const express = require('express');
const User = require('../models/User');
const Resume = require('../models/Resume');
const router = express.Router();

// Get all users (admin only)
router.get('/users', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const users = await User.find().select('-password').limit(100);

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get system stats
router.get('/stats', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const stats = {
      totalUsers: await User.countDocuments(),
      totalResumes: await Resume.countDocuments(),
      totalAiCreditsUsed: (await User.aggregate([
        { $group: { _id: null, total: { $sum: '$aiCredits' } } },
      ]))[0]?.total || 0,
      activeSubscriptions: await User.countDocuments({ 'subscription.active': true }),
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Suspend user (admin only)
router.post('/users/:id/suspend', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const admin = await User.findById(req.userId);
    if (admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json({
      success: true,
      message: 'User suspended',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
