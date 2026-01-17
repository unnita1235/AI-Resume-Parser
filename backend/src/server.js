const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

// Import routes
const aiEnhancementRoutes = require('./routes/ai-enhancement');
const { apiLimiter, aiLimiter } = require('./middleware/rate-limiter');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== CORS SETUP ====================
// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',                            // Local frontend
  'https://ai-resume-parser-seven.vercel.app',        // Your Vercel app
  process.env.FRONTEND_URL                            // Custom env var
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    console.log('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads (optional, careful with security)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => res.send('AI Resume Parser Backend is Running 🚀'));
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date() }));

// Register API routes
app.use('/api/ai', aiEnhancementRoutes);

// ... [Keep your existing parsing logic and database connection code below] ...
// ... [Ensure you import and use the gemini-client correctly as shown in your original files] ...

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 CORS allowed for: ${allowedOrigins.join(', ')}`);
});

module.exports = app;
