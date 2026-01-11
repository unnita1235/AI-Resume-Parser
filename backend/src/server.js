const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const gemini = require('./utils/gemini-client');
require('dotenv').config();

const app = express();

// Basic server state for health/stats
const serverStats = {
  startTime: Date.now(),
  totalRequests: 0,
  totalParsedResumes: 0,
  errors: 0,
};

// Demo resumes for testing and demo endpoints
const demoResumes = [
  {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: ['Senior Developer at TechCorp'],
    education: ['B.S. Computer Science'],
    accuracy: 92,
  },
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 987-6543',
    skills: ['Python', 'Django', 'PostgreSQL'],
    experience: ['Backend Engineer at DataWorks'],
    education: ['M.S. Software Engineering'],
    accuracy: 88,
  },
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request counter for stats
app.use((req, _res, next) => {
  serverStats.totalRequests += 1;
  next();
});

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

// MongoDB Connection (skipped in tests or when URI missing)
if (process.env.NODE_ENV !== 'test' && process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));
} else {
  console.warn('⚠️  Skipping MongoDB connection (test mode or missing MONGODB_URI)');
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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    mode: process.env.NODE_ENV === 'test' ? 'test' : 'production',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '1.0.0'
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      uptime: Math.floor((Date.now() - serverStats.startTime) / 1000),
      totalRequests: serverStats.totalRequests,
      totalParsedResumes: serverStats.totalParsedResumes,
      errors: serverStats.errors,
      mode: process.env.NODE_ENV === 'test' ? 'test' : 'production',
    }
  });
});

// Demo resumes endpoint
app.get('/api/demo-resumes', (req, res) => {
  res.json({ success: true, data: demoResumes });
});

// AI health endpoint
app.get('/api/ai/health', async (req, res) => {
  try {
    const result = await gemini.checkHealth();
    if (result.available) {
      return res.json({
        success: true,
        geminiStatus: 'available',
        responseTime: result.responseTime ?? 0,
      });
    }

    return res.json({
      success: false,
      geminiStatus: 'unavailable',
      error: result.error,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Helpers for AI routes
function validateResumeText(body) {
  if (!body || typeof body.resumeText !== 'string') {
    return 'resumeText is required';
  }
  if (body.resumeText.trim().length < 20) {
    return 'resume text is too short';
  }
  return null;
}

function validateText(body) {
  if (!body || typeof body.text !== 'string') {
    return 'text is required';
  }
  if (body.text.trim().length < 5) {
    return 'text is too short';
  }
  return null;
}

// ATS optimize
app.post('/api/ai/ats-optimize', async (req, res) => {
  const error = validateResumeText(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  try {
    const result = await gemini.generateJSON('', {});
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    const data = result.data || {};
    return res.json({
      success: true,
      score: data.score ?? 0,
      missingKeywords: data.missingKeywords ?? [],
      recommendations: data.recommendations ?? [],
      issues: data.issues ?? [],
      strengths: data.strengths ?? [],
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Tone adjust
app.post('/api/ai/tone-adjust', async (req, res) => {
  const error = validateText(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  const tone = req.body.tone;
  if (tone !== 'formal' && tone !== 'casual') {
    return res.status(400).json({ success: false, error: 'tone must be "formal" or "casual"' });
  }

  try {
    const result = await gemini.generateJSON('', {});
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    const data = result.data || {};
    return res.json({
      success: true,
      adjustedText: data.adjustedText ?? req.body.text,
      summary: data.summary ?? '',
      originalTone: data.originalTone ?? 'unknown',
      targetTone: data.targetTone ?? tone,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Action verbs
app.post('/api/ai/action-verbs', async (req, res) => {
  const error = validateText(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }

  if (req.body.text.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'text is too short' });
  }

  try {
    const result = await gemini.generateJSON('', {});
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    const data = result.data || {};
    return res.json({
      success: true,
      enhancedText: data.enhancedText ?? req.body.text,
      changedVerbs: data.changedVerbs ?? [],
      totalChanges: data.totalChanges ?? (data.changedVerbs ? data.changedVerbs.length : 0),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Cover letter
app.post('/api/ai/cover-letter', async (req, res) => {
  const { resumeData, jobDescription } = req.body || {};
  if (!resumeData) {
    return res.status(400).json({ success: false, error: 'resumeData is required' });
  }
  if (!jobDescription) {
    return res.status(400).json({ success: false, error: 'jobDescription is required' });
  }
  if (typeof jobDescription !== 'string' || jobDescription.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'job description is too short' });
  }

  try {
    const result = await gemini.generateJSON('', {});
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    const data = result.data || {};
    return res.json({
      success: true,
      coverLetter: data.coverLetter ?? 'Dear Hiring Manager,',
      wordCount: data.wordCount ?? (data.coverLetter ? data.coverLetter.split(/\s+/).length : 0),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Parse resume endpoint
app.post('/api/parse', upload.single('file'), async (req, res) => {
  try {
    console.log('📄 File received:', req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

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
      fs.unlinkSync(filePath); // Clean up
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from file'
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

    // Save to MongoDB when connected
    if (mongoose.connection.readyState === 1) {
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
      console.log('✅ Saved to MongoDB');
    }

    // Update stats
    serverStats.totalParsedResumes += 1;

    // Clean up file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: parsedData,
      resumeId: resume._id
    });

  } catch (error) {
    console.error('❌ Error:', error);
    serverStats.errors += 1;
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error parsing resume',
      error: error.message 
    });
  }
});

// Get all resumes
app.get('/api/resumes', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

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

// Start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📁 Upload directory: ${uploadDir}`);
  });
}

module.exports = app;
