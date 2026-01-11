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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

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
    status: 'OK', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
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

    // Save to MongoDB
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
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
});
