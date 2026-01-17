const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

// Import AI enhancement routes
const aiEnhancementRoutes = require('./routes/ai-enhancement');

// Import middleware
const { apiLimiter, aiLimiter } = require('./middleware/rate-limiter');

const app = express();

// ==================== CONFIGURATION ====================
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ==================== CORS SETUP (CRITICAL FIX) ====================
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',                            // Local Development
      'https://ai-resume-parser-seven.vercel.app',        // Your Vercel URL
      process.env.FRONTEND_URL                            // URL from Env Var
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      return callback(null, true); // Temporarily allow all to fix your error, but log it
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Register Routes
app.use('/api/ai', aiEnhancementRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', mode: 'production' });
});

// Database Connection
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err.message));
}

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;
