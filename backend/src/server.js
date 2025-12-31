const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

const app = express();

// Server startup time for uptime calculation
const SERVER_START_TIME = Date.now();
let RESUME_PARSE_COUNT = 0;
let DEMO_MODE_ACTIVE = !process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// MongoDB Schema
const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  linkedin: String,
  github: String,
  skills: [String],
  experience: [String],
  education: [String],
  rawText: String,
  fileName: String,
  uploadDate: { type: Date, default: Date.now }
});

const Resume = mongoose.model('Resume', resumeSchema);

// MongoDB Connection
let mongoConnected = false;
let mongoError = null;

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    mongoConnected = true;
    DEMO_MODE_ACTIVE = false;
    console.log('✅ MongoDB Connected');
  })
  .catch(err => {
    mongoConnected = false;
    mongoError = err.message;
    DEMO_MODE_ACTIVE = true;
    console.error('❌ MongoDB Error:', err.message);
    console.log('⚠️  Running in DEMO MODE - data will not persist');
  });
} else {
  DEMO_MODE_ACTIVE = true;
  console.log('⚠️  MONGODB_URI not set - running in DEMO MODE');
}

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'));
    }
  }
});

// Extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    return '';
  }
}

// Extract text from DOCX
async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return '';
  }
}

// Simple parsing functions
function extractEmail(text) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

function extractPhone(text) {
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
}

function extractName(text) {
  const lines = text.split('\n');
  return lines[0].trim() || 'Unknown';
}

function extractSkills(text) {
  const skillsKeywords = [
    'Python', 'JavaScript', 'Java', 'C\\+\\+', 'React', 'Node\\.js', 'MongoDB',
    'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Machine Learning',
    'Data Analysis', 'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue\\.js',
    'Express', 'Django', 'Flask', 'PostgreSQL', 'Redis', 'GraphQL'
  ];
  
  const foundSkills = [];
  const textLower = text.toLowerCase();
  
  skillsKeywords.forEach(skill => {
    const regex = new RegExp(skill, 'i');
    if (regex.test(text)) {
      foundSkills.push(skill.replace(/\\/g, ''));
    }
  });
  
  return foundSkills;
}

// Health check endpoint - used by deployment platforms (Render, Railway, etc.)
app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - SERVER_START_TIME) / 1000);

  const healthStatus = {
    status: mongoConnected ? 'healthy' : (DEMO_MODE_ACTIVE ? 'degraded' : 'unhealthy'),
    timestamp: new Date().toISOString(),
    uptime_seconds: uptime,
    mode: DEMO_MODE_ACTIVE ? 'DEMO' : 'PRODUCTION',
    database: {
      connected: mongoConnected,
      error: mongoError || null
    },
    server: {
      memory_usage_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      node_version: process.version,
      environment: process.env.NODE_ENV || 'development'
    }
  };

  const statusCode = mongoConnected ? 200 : (DEMO_MODE_ACTIVE ? 200 : 503);
  res.status(statusCode).json(healthStatus);
});

// Stats endpoint - shows resume parsing statistics
app.get('/api/stats', async (req, res) => {
  try {
    const uptime = Math.floor((Date.now() - SERVER_START_TIME) / 1000);

    let totalResumes = 0;
    if (mongoConnected && !DEMO_MODE_ACTIVE) {
      totalResumes = await Resume.countDocuments();
    }

    const stats = {
      success: true,
      mode: DEMO_MODE_ACTIVE ? 'DEMO' : 'PRODUCTION',
      database_connected: mongoConnected,
      server_uptime_seconds: uptime,
      parsed_in_session: RESUME_PARSE_COUNT,
      total_parsed: totalResumes,
      timestamp: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Parse resume endpoint
app.post('/api/parse', upload.single('file'), async (req, res) => {
  let fileToDelete = null;
  try {
    console.log('📄 File received:', req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    fileToDelete = req.file.path;
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    console.log('📝 Extracting text from:', fileExt);

    // Extract text based on file type
    let text = '';
    if (fileExt === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else if (fileExt === '.docx' || fileExt === '.doc') {
      text = await extractTextFromDOCX(filePath);
    }

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from file. Please ensure the file contains readable text.'
      });
    }

    console.log('✅ Text extracted, length:', text.length);

    // Parse data
    const parsedData = {
      name: extractName(text),
      contact: {
        email: extractEmail(text),
        phone: extractPhone(text),
        linkedin: null,
        github: null
      },
      skills: extractSkills(text),
      experience: [],
      education: [],
      raw_text: text.substring(0, 1000) // First 1000 chars
    };

    console.log('💾 Saving to MongoDB...');

    // Save to MongoDB (if connected)
    let resumeId = 'DEMO_' + Date.now();

    if (mongoConnected && !DEMO_MODE_ACTIVE) {
      const resume = new Resume({
        name: parsedData.name,
        email: parsedData.contact.email,
        phone: parsedData.contact.phone,
        linkedin: parsedData.contact.linkedin,
        github: parsedData.contact.github,
        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        rawText: parsedData.raw_text,
        fileName: req.file.originalname
      });

      await resume.save();
      resumeId = resume._id;
      console.log('✅ Saved to MongoDB');
    } else if (DEMO_MODE_ACTIVE) {
      console.log('⚠️  Demo mode: Data saved in memory only (not persisted)');
    }

    RESUME_PARSE_COUNT++;

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      mode: DEMO_MODE_ACTIVE ? 'DEMO' : 'PRODUCTION',
      data: parsedData,
      resumeId: resumeId
    });

  } catch (error) {
    console.error('❌ Error:', error);

    res.status(500).json({
      success: false,
      message: 'Error parsing resume',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  } finally {
    // Clean up uploaded file
    if (fileToDelete && fs.existsSync(fileToDelete)) {
      try {
        fs.unlinkSync(fileToDelete);
      } catch (err) {
        console.warn('Warning: Could not delete temporary file:', fileToDelete);
      }
    }
  }
});

// Get all resumes
app.get('/api/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadDate: -1 });
    res.json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single resume
app.get('/api/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Demo samples endpoint - for testing without real resumes
app.get('/api/demo-samples', (req, res) => {
  const sampleResumes = [
    {
      id: 'sample_1',
      name: 'Sarah Johnson',
      contact: {
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567'
      },
      skills: ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
      experience: ['Senior Software Engineer at TechCorp (3 years)', 'Software Engineer at StartupXYZ (2 years)'],
      education: ['BS Computer Science, University of State'],
      raw_text: 'Sarah Johnson is a Senior Software Engineer with 5+ years of experience...'
    },
    {
      id: 'sample_2',
      name: 'Michael Chen',
      contact: {
        email: 'michael.chen@email.com',
        phone: '(555) 987-6543'
      },
      skills: ['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'GraphQL', 'Kubernetes', 'GCP'],
      experience: ['Tech Lead at CloudSystems (4 years)', 'Full Stack Developer at WebAgency (3 years)'],
      education: ['MS Computer Science, Tech University', 'BS Information Technology, Tech University'],
      raw_text: 'Michael Chen is a Tech Lead with expertise in full stack development...'
    },
    {
      id: 'sample_3',
      name: 'Jessica Martinez',
      contact: {
        email: 'jessica.martinez@email.com',
        phone: '(555) 456-7890'
      },
      skills: ['Java', 'Spring Boot', 'SQL', 'Angular', 'Git', 'Maven', 'Microservices'],
      experience: ['Backend Engineer at FinanceCorp (5 years)', 'Junior Developer at DataSystems (1 year)'],
      education: ['BS Software Engineering, Engineering University'],
      raw_text: 'Jessica Martinez is a Backend Engineer specializing in microservices and enterprise applications...'
    }
  ];

  res.json({
    success: true,
    mode: 'DEMO',
    message: 'Sample resumes for demonstration purposes',
    count: sampleResumes.length,
    data: sampleResumes
  });
});

// Export app for testing
module.exports = app;

// Start server (only if this file is run directly, not imported)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ AI Resume Parser Server Running`);
    console.log(`${'='.repeat(50)}`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`📁 Upload directory: ${uploadDir}`);
    console.log(`🗄️  Database: ${mongoConnected ? '✅ Connected' : (DEMO_MODE_ACTIVE ? '⚠️  Demo Mode' : '❌ Disconnected')}`);
    console.log(`\n📚 API Endpoints:`);
    console.log(`   GET  /health             - Server health check`);
    console.log(`   GET  /api/stats          - Parsing statistics`);
    console.log(`   POST /api/parse          - Parse resume file`);
    console.log(`   GET  /api/resumes        - Get all parsed resumes`);
    console.log(`   GET  /api/resumes/:id    - Get specific resume`);
    console.log(`   GET  /api/demo-samples   - Get sample resumes`);
    console.log(`${'='.repeat(50)}\n`);
  });
}
