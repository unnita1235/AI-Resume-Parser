const express = require('express');
const Resume = require('../models/Resume');
const { parseWithRegex } = require('../utils/parser');
const router = express.Router();

// Get all resumes for user
router.get('/', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const resumes = await Resume.find({ userId: req.userId })
      .sort({ uploadDate: -1 })
      .select('-rawText');

    res.json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single resume
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.userId && resume.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create resume from text
router.post('/', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { text, fileName } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Resume text required' });
    }

    // Parse resume
    const parsed = parseWithRegex(text);

    const resume = await Resume.create({
      ...parsed,
      rawText: text,
      fileName: fileName || 'resume.txt',
      fileType: 'txt',
      userId: req.userId,
      parseMethod: 'regex',
    });

    res.status(201).json({
      success: true,
      message: 'Resume created',
      data: resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update resume
router.put('/:id', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.userId && resume.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Resume updated',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete resume
router.delete('/:id', async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (resume.userId && resume.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
