require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

// Import routes, middleware, and utilities
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const { authMiddleware, optionalAuth } = require('./middleware/auth');
const { validateAtsRequest, validateToneRequest, validateActionVerbRequest } = require('./middleware/validate-request');
const { connectDB } = require('./db/mongodb-connection');

const app = express();

// Security middleware
app.use(helmet());
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MongoDB Connection with retry logic
if (process.env.NODE_ENV !== 'test') {
  connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Exit in production if DB connection fails
    }
    // Continue in development/test mode even if DB connection fails
  });
} else {
  console.log('⚠️  Skipping MongoDB connection (test mode)');
}

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.post('/api/auth/register', authRoutes.register || ((_req, res) => res.status(404).json({ success: false })));
app.post('/api/auth/login', authRoutes.login || ((_req, res) => res.status(404).json({ success: false })));
app.get('/api/auth/me', authMiddleware, authRoutes.get || ((_req, res) => res.status(404).json({ success: false })));
app.put('/api/auth/profile', authMiddleware, authRoutes.update || ((_req, res) => res.status(404).json({ success: false })));

// Resume routes
app.get('/api/resumes', optionalAuth, resumeRoutes.list || ((_req, res) => res.status(404).json({ success: false })));
app.get('/api/resumes/:id', optionalAuth, resumeRoutes.get || ((_req, res) => res.status(404).json({ success: false })));
app.post('/api/resumes', authMiddleware, resumeRoutes.create || ((_req, res) => res.status(404).json({ success: false })));
app.put('/api/resumes/:id', authMiddleware, resumeRoutes.update || ((_req, res) => res.status(404).json({ success: false })));
app.delete('/api/resumes/:id', authMiddleware, resumeRoutes.delete || ((_req, res) => res.status(404).json({ success: false })));

// AI routes with validation middleware
app.post('/api/ai/ats-optimize', optionalAuth, validateAtsRequest, aiRoutes.atsOptimize || ((_req, res) => res.status(404).json({ success: false, error: 'Handler not found' })));
app.post('/api/ai/tone-adjust', optionalAuth, validateToneRequest, aiRoutes.toneAdjust || ((_req, res) => res.status(404).json({ success: false, error: 'Handler not found' })));
app.post('/api/ai/action-verbs', optionalAuth, validateActionVerbRequest, aiRoutes.actionVerbs || ((_req, res) => res.status(404).json({ success: false, error: 'Handler not found' })));

// Admin routes (require admin role)
app.get('/api/admin/users', authMiddleware, adminRoutes.listUsers || ((_req, res) => res.status(404).json({ success: false })));
app.get('/api/admin/stats', authMiddleware, adminRoutes.getStats || ((_req, res) => res.status(404).json({ success: false })));
app.post('/api/admin/users/:id/suspend', authMiddleware, adminRoutes.suspendUser || ((_req, res) => res.status(404).json({ success: false })));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
}

module.exports = app;
