const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

// Keep-alive mechanism to prevent Render free tier service from sleeping
require('./keep-alive').startKeepAlive();

const app = express();

// ==================== CONFIGURATION ====================
const PORT = process.env.PORT || 5000;
const ENABLE_DEMO_MODE = process.env.DEMO_MODE === 'true';
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== HEALTH CHECK & STATS ====================
const serverStats = {
  startTime: Date.now(),
  requestCount: 0,
  parsedResumes: 0,
  errors: 0,
};

// Health endpoint - CRITICAL for container detection
app.get('/health', (req, res) => {
  const uptime = Math.floor((Date.now() - serverStats.startTime) / 1000);
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    mode: ENABLE_DEMO_MODE ? 'demo' : 'production',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '2.0.0',
  });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    let resumeCount = 0;
    if (mongoose.connection.readyState === 1) {
      resumeCount = await Resume.countDocuments();
    }

    res.json({
      success: true,
      stats: {
        uptime: Math.floor((Date.now() - serverStats.startTime) / 1000),
        totalRequests: serverStats.requestCount,
        totalParsedResumes: resumeCount,
        errors: serverStats.errors,
        mode: ENABLE_DEMO_MODE ? 'demo' : 'production',
        databaseConnected: mongoose.connection.readyState === 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== FILE UPLOADS ====================
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'));
    }
  },
});

// ==================== DATABASE ====================
const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  linkedin: String,
  github: String,
  skills: [String],
  experience: [String],
  education: [String],
  summary: String,
  rawText: String,
  fileName: String,
  parseMethod: { type: String, enum: ['ai', 'regex', 'demo'], default: 'regex' },
  uploadDate: { type: Date, default: Date.now },
  accuracy: { type: Number, default: 0 }, // 0-100
});

const Resume = mongoose.model('Resume', resumeSchema);

// MongoDB Connection with retry logic
let mongoConnected = false;
const connectMongoDB = () => {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set. Running in demo mode.');
    mongoConnected = false;
    return;
  }

  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('✅ MongoDB Connected');
      mongoConnected = true;
    })
    .catch((err) => {
      console.error('❌ MongoDB Error:', err.message);
      mongoConnected = false;
      // Retry connection every 10 seconds
      setTimeout(connectMongoDB, 10000);
    });
};

connectMongoDB();

// ==================== TEXT EXTRACTION ====================
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error.message);
    return '';
  }
}

async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error.message);
    return '';
  }
}

// ==================== PARSING WITH GEMINI AI ====================
async function parseWithGemini(text) {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set. Falling back to regex parsing.');
    return null;
  }

  try {
    // Using fetch to call Google Gemini API
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Parse this resume and extract structured information. Return JSON only with: { name, email, phone, linkedin, github, skills: [], experience: [], education: [], summary }. Resume:\\n\\n${text.substring(0, 4000)}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) return null;

    // Extract JSON from response
    const jsonMatch = content.match(/\\{[\\s\\S]*\\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini parsing error:', error.message);
    return null;
  }
}

// ==================== REGEX PARSING FALLBACK ====================
function parseWithRegex(text) {
  const emailRegex = /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/;
  const phoneRegex =
    /(\\+\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}/;
  const linkedinRegex =
    /linkedin\\.com\\/in\\/([\\w\\-]+)|linkedin\\.com\\/company\\/([\\w\\-]+)/i;
  const githubRegex = /github\\.com\\/([\\w\\-]+)/i;

  const skillsKeywords = [
    'Python',
    'JavaScript',
    'TypeScript',
    'Java',
    'C++',
    'C#',
    'PHP',
    'Ruby',
    'Go',
    'Rust',
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'Spring',
    'FastAPI',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Redis',
    'Elasticsearch',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
    'Jenkins',
    'Git',
    'GraphQL',
    'REST',
    'SOAP',
    'Machine Learning',
    'TensorFlow',
    'PyTorch',
    'Data Analysis',
    'Pandas',
    'NumPy',
    'HTML',
    'CSS',
    'SCSS',
    'Tailwind',
    'Bootstrap',
    'SQL',
    'NoSQL',
    'Agile',
    'Scrum',
    'CI/CD',
  ];

  const lines = text.split('\\n').filter((line) => line.trim().length > 0);
  const name = lines[0]?.trim() || 'Unknown';

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);

  const foundSkills = [];
  skillsKeywords.forEach((skill) => {
    if (new RegExp(`\\\\b${skill}\\\\b`, 'i').test(text)) {
      foundSkills.push(skill);
    }
  });

  return {
    name: name,
    email: emailMatch?.[0] || null,
    phone: phoneMatch?.[0] || null,
    linkedin: linkedinMatch?.[0] || null,
    github: githubMatch?.[0] || null,
    skills: foundSkills,
    experience: [],
    education: [],
    summary: text.substring(0, 500),
  };
}

// ==================== DEMO DATA ====================
const DEMO_RESUMES = [
  {
    name: 'John Anderson',
    email: 'john.anderson@email.com',
    phone: '+1-555-0101',
    linkedin: 'linkedin.com/in/johnanderson',
    github: 'github.com/johnanderson',
    skills: [
      'React',
      'Node.js',
      'Python',
      'MongoDB',
      'AWS',
      'Docker',
      'PostgreSQL',
      'GraphQL',
    ],
    experience: [
      'Senior Full Stack Engineer at TechCorp (2021-Present)',
      'Full Stack Developer at StartupXYZ (2019-2021)',
      'Junior Developer at WebAgency (2018-2019)',
    ],
    education: [
      'BS Computer Science, State University (2018)',
      'AWS Solutions Architect Certification',
    ],
    summary:
      'Experienced full stack engineer with 5+ years building scalable web applications. Expertise in React, Node.js, and cloud deployment.',
    fileName: '[DEMO] John Anderson - Full Stack Engineer.pdf',
    parseMethod: 'demo',
    accuracy: 92,
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1-555-0202',
    linkedin: 'linkedin.com/in/sarahchen',
    github: 'github.com/sarahchen',
    skills: [
      'Python',
      'Machine Learning',
      'TensorFlow',
      'Data Analysis',
      'SQL',
      'Pandas',
      'NumPy',
      'Scikit-learn',
    ],
    experience: [
      'Data Scientist at DataCorp (2020-Present)',
      'ML Engineer at AI Startup (2019-2020)',
      'Data Analyst at FinTech (2018-2019)',
    ],
    education: [
      'MS Data Science, Tech University (2018)',
      'BS Mathematics, Tech University (2016)',
    ],
    summary:
      'Data scientist with expertise in machine learning and statistical analysis. Proven track record of building predictive models.',
    fileName: '[DEMO] Sarah Chen - Data Scientist.pdf',
    parseMethod: 'demo',
    accuracy: 88,
  },
  {
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@email.com',
    phone: '+1-555-0303',
    linkedin: 'linkedin.com/in/mrodriguez',
    github: 'github.com/mrodriguez',
    skills: [
      'Java',
      'Spring Boot',
      'Kubernetes',
      'Docker',
      'AWS',
      'Microservices',
      'Apache Kafka',
      'PostgreSQL',
    ],
    experience: [
      'Senior Backend Engineer at CloudSys (2021-Present)',
      'Backend Engineer at DistribCorp (2019-2021)',
      'Java Developer at EnterpriseSoft (2017-2019)',
    ],
    education: [
      'BS Computer Engineering, Engineering University (2017)',
      'Kubernetes Administrator Certification',
    ],
    summary:
      'Backend engineer specializing in cloud-native microservices architecture. Expert in scaling systems for millions of users.',
    fileName: '[DEMO] Michael Rodriguez - Backend Engineer.pdf',
    parseMethod: 'demo',
    accuracy: 90,
  },
];

// Endpoint to get demo resumes
app.get('/api/demo-resumes', (req, res) => {
  res.json({
    success: true,
    mode: 'demo',
    message: 'These are sample resumes for demonstration purposes',
    data: DEMO_RESUMES,
  });
});

// ==================== API ENDPOINTS ====================

// Parse resume endpoint (main)
app.post('/api/parse', upload.single('file'), async (req, res) => {
  serverStats.requestCount++;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    console.log(
      `📄 Processing: ${req.file.originalname} (${req.file.size} bytes)`
    );

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Extract text from file
    let text = '';
    if (fileExt === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else if (['.docx', '.doc'].includes(fileExt)) {
      text = await extractTextFromDOCX(filePath);
    }

    if (!text) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from file',
      });
    }

    console.log(`✅ Text extracted: ${text.length} characters`);

    // Try Gemini parsing first, fall back to regex
    let parsedData = null;
    let parseMethod = 'regex';
    let accuracy = 65;

    if (GEMINI_API_KEY && !ENABLE_DEMO_MODE) {
      console.log('🤖 Attempting AI parsing with Gemini...');
      parsedData = await parseWithGemini(text);
      if (parsedData) {
        parseMethod = 'ai';
        accuracy = 92;
        console.log('✅ Gemini parsing successful');
      }
    }

    // Fallback to regex if Gemini failed
    if (!parsedData) {
      console.log('📋 Using regex parsing fallback');
      parsedData = parseWithRegex(text);
      parseMethod = 'regex';
      accuracy = 65;
    }

    // Save to MongoDB if available
    if (mongoConnected) {
      try {
        const resume = new Resume({
          name: parsedData.name,
          email: parsedData.email,
          phone: parsedData.phone,
          linkedin: parsedData.linkedin,
          github: parsedData.github,
          skills: parsedData.skills,
          experience: parsedData.experience,
          education: parsedData.education,
          summary: parsedData.summary,
          rawText: text.substring(0, 2000),
          fileName: req.file.originalname,
          parseMethod: parseMethod,
          accuracy: accuracy,
        });

        await resume.save();
        serverStats.parsedResumes++;
        console.log(`✅ Saved to MongoDB: ${resume._id}`);

        // Clean up file
        fs.unlinkSync(filePath);

        return res.json({
          success: true,
          message: 'Resume parsed successfully',
          mode: 'production',
          data: {
            ...parsedData,
            accuracy: accuracy,
            parseMethod: parseMethod,
          },
          resumeId: resume._id,
        });
      } catch (dbError) {
        console.error('Database error:', dbError.message);
        serverStats.errors++;
      }
    }

    // If no MongoDB, still return parsed data
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Resume parsed successfully (demo mode - not saved)',
      mode: ENABLE_DEMO_MODE ? 'demo' : 'production',
      data: {
        ...parsedData,
        accuracy: accuracy,
        parseMethod: parseMethod,
      },
      resumeId: null,
      warning: mongoConnected ? null : 'Database not available',
    });
  } catch (error) {
    serverStats.errors++;
    console.error('❌ Parsing error:', error.message);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error parsing resume',
      error: error.message,
    });
  }
});

// Get all parsed resumes
app.get('/api/resumes', async (req, res) => {
  serverStats.requestCount++;

  try {
    if (!mongoConnected) {
      return res.json({
        success: true,
        count: DEMO_RESUMES.length,
        mode: 'demo',
        data: DEMO_RESUMES,
        message: 'Returning demo data (database unavailable)',
      });
    }

    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const resumes = await Resume.find()
      .sort({ uploadDate: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Resume.countDocuments();

    res.json({
      success: true,
      count: resumes.length,
      total: total,
      mode: 'production',
      data: resumes,
    });
  } catch (error) {
    serverStats.errors++;
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single resume
app.get('/api/resumes/:id', async (req, res) => {
  serverStats.requestCount++;

  try {
    if (!mongoConnected) {
      return res.status(400).json({
        success: false,
        message: 'Database not available',
      });
    }

    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    serverStats.errors++;
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  serverStats.errors++;
  console.error('Global error handler:', err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\\n${'='.repeat(50)}`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`🤖 AI Mode: ${GEMINI_API_KEY ? 'Enabled' : 'Disabled'}`);
  console.log(`📊 Demo Mode: ${ENABLE_DEMO_MODE ? 'Enabled' : 'Disabled'}`);
  console.log(`📦 Database: ${mongoConnected ? 'Connected' : 'Disabled'}`);
  console.log(`🔗 Health check: GET /health`);
  console.log(`📈 Stats: GET /api/stats`);
  console.log(`${'='.repeat(50)}\\n`);
});

module.exports = app;
