const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

const aiEnhancementRoutes = require('./routes/ai-enhancement');
// const { apiLimiter, aiLimiter } = require('./middleware/rate-limiter'); // Uncomment if you have these files
// require('./keep-alive').startKeepAlive(); // Keep this if you use the script

const app = express();

// ==================== CONFIGURATION ====================
const PORT = process.env.PORT || 5000;
// CRITICAL: Get allowed origins from ENV or default to localhost for dev
const ALLOWED_ORIGINS = process.env.CORS_WHITELIST 
  ? process.env.CORS_WHITELIST.split(',') 
  : ['http://localhost:3000'];

const MONGODB_URI = process.env.MONGODB_URI;
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use('/api/', apiLimiter); // Re-enable if you have the middleware file

// ==================== DATABASE ====================
// Define Schema inline or import it. Ideally, keep models in src/models
const resumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  summary: String,
  skills: [String],
  experience: [String],
  rawText: String,
  fileName: String,
  createdAt: { type: Date, default: Date.now }
});

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
} else {
  console.warn('⚠️ MONGODB_URI missing. Running in memory-only mode.');
}

// ==================== UPLOAD HANDLER ====================
// Use /tmp for serverless/container compatibility
const uploadDir = '/tmp/uploads'; 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('pdf') || file.mimetype.includes('word')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF/DOC formats allowed'));
    }
  }
});

// ==================== AI PARSER (GEMINI) ====================
async function parseWithGemini(text) {
  if (!GEMINI_API_KEY) return null;
  
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Extract the following details from this resume text and return raw JSON only (no markdown formatting):
              { "name": "", "email": "", "phone": "", "skills": [], "experience": [], "education": [], "summary": "" }
              
              Resume Text:
              ${text.substring(0, 8000)}` // Limit text to avoid token limits
            }]
          }]
        })
      }
    );

    const data = await response.json();
    let rawJSON = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    // Clean markdown code blocks if Gemini adds them
    rawJSON = rawJSON.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(rawJSON);
  } catch (error) {
    console.error('Gemini Parse Error:', error);
    return null;
  }
}

// ==================== ROUTES ====================
app.get('/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }));

app.post('/api/parse', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;
  
  try {
    let text = '';
    
    // 1. Extract Text
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      text = pdfData.text;
    } else {
      // Add logic for DOCX if needed via mammoth
      text = "DOCX parsing requires mammoth implementation here.";
    }

    // 2. AI Parse
    let parsedData = await parseWithGemini(text);
    
    // 3. Fallback (Basic Regex) if AI fails or no key
    if (!parsedData) {
      console.log('Falling back to Regex parsing');
      parsedData = {
        name: 'Unknown',
        email: (text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/) || [])[0] || null,
        skills: [],
        rawText: text.substring(0, 500) // Preview
      };
    }

    // 4. Save to DB (Optional)
    if (mongoose.connection.readyState === 1) {
      const newResume = new Resume({
        ...parsedData,
        fileName: req.file.originalname,
        rawText: text
      });
      await newResume.save();
    }

    res.json({ success: true, data: parsedData });

  } catch (error) {
    console.error('Processing Error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    // ALWAYS clean up the file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🌍 Allowed Origins: ${ALLOWED_ORIGINS}`);
});
