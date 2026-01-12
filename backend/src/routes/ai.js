const express = require('express');
const { generateJSON } = require('../utils/gemini-client');
const router = express.Router();

// ATS Optimize
router.post('/ats-optimize', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ success: false, message: 'Resume text required' });
    }

    const prompt = `Analyze this resume for ATS compatibility:\n\n${resumeText}${jobDescription ? `\n\nJob Description:\n${jobDescription}` : ''}\n\nReturn JSON with: score (0-100), missingKeywords, recommendations, issues, strengths`;

    const result = await generateJSON(prompt, { temperature: 0.3, maxOutputTokens: 2048 });

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    const data = result.data || {};

    res.json({
      success: true,
      score: Math.min(100, Math.max(0, data.score || 50)),
      missingKeywords: data.missingKeywords || [],
      recommendations: data.recommendations || [],
      issues: data.issues || [],
      strengths: data.strengths || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Tone Adjust
router.post('/tone-adjust', async (req, res) => {
  try {
    const { text, tone } = req.body;

    if (!text || !['formal', 'casual'].includes(tone)) {
      return res.status(400).json({ success: false, message: 'Valid text and tone required' });
    }

    const prompt = `Adjust this text to be more ${tone}:\n\n${text}\n\nReturn JSON with: adjustedText, summary, targetTone`;

    const result = await generateJSON(prompt, { temperature: 0.5, maxOutputTokens: 2048 });

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    const data = result.data || {};

    res.json({
      success: true,
      adjustedText: data.adjustedText || text,
      summary: data.summary || '',
      targetTone: tone,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Action Verbs Enhancement
router.post('/action-verbs', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text required' });
    }

    const prompt = `Enhance these resume action verbs:\n\n${text}\n\nReturn JSON with: enhancedText, changedVerbs, totalChanges`;

    const result = await generateJSON(prompt, { temperature: 0.4, maxOutputTokens: 2048 });

    if (!result.success) {
      return res.status(500).json({ success: false, message: result.error });
    }

    const data = result.data || {};

    res.json({
      success: true,
      enhancedText: data.enhancedText || text,
      changedVerbs: data.changedVerbs || [],
      totalChanges: data.totalChanges || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
