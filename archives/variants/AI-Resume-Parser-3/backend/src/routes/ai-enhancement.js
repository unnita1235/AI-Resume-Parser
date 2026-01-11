/**
 * AI Enhancement Routes
 * 
 * Express router providing AI-powered resume enhancement features:
 * - ATS optimization scoring and recommendations
 * - Tone adjustment (formal/casual)
 * - Action verb enhancement
 * - Cover letter generation
 * - AI health check
 * 
 * @module routes/ai-enhancement
 */

const express = require('express');
const router = express.Router();
const gemini = require('../utils/gemini-client');

// ==================== PROMPTS ====================

const PROMPTS = {
    atsOptimize: (resumeText, jobDescription) => `
Analyze this resume for ATS (Applicant Tracking System) compatibility and provide optimization suggestions.

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "missingKeywords": ["keyword1", "keyword2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "issues": ["issue1", "issue2"],
  "strengths": ["strength1", "strength2"]
}

Score should reflect:
- 90-100: Excellent ATS compatibility
- 70-89: Good, minor improvements needed
- 50-69: Fair, several improvements recommended
- Below 50: Needs significant work

Focus on: keyword optimization, formatting, section headers, and industry-standard terminology.
`,

    toneAdjust: (text, targetTone) => `
Adjust the following resume/professional text to be more ${targetTone}.

Original text:
${text}

Requirements:
- Keep the core meaning and achievements intact
- ${targetTone === 'formal' ? 'Use professional language, remove contractions, use industry terms' : 'Use conversational language while maintaining professionalism'}
- Maintain the same bullet point or paragraph structure
- Do not add or remove information

Return a JSON object with this exact structure:
{
  "adjustedText": "<the adjusted text>",
  "summary": "<brief description of changes made>",
  "originalTone": "<detected original tone>",
  "targetTone": "${targetTone}"
}
`,

    actionVerbs: (text) => `
Enhance the action verbs in this resume text to be more impactful and professional.

Text:
${text}

Replace weak or common verbs with strong, specific action verbs.
Examples of improvements:
- "worked on" → "spearheaded", "orchestrated"
- "was responsible for" → "managed", "directed"
- "helped" → "facilitated", "enabled"
- "did" → "executed", "implemented"
- "made" → "developed", "created"

Return a JSON object with this exact structure:
{
  "enhancedText": "<the enhanced text>",
  "changedVerbs": [
    {"original": "worked on", "enhanced": "spearheaded", "context": "brief context"},
    {"original": "helped", "enhanced": "facilitated", "context": "brief context"}
  ],
  "totalChanges": <number>
}
`,

    coverLetter: (resumeData, jobDescription, companyName) => {
        const resumeStr = typeof resumeData === 'string'
            ? resumeData
            : `Name: ${resumeData.name || 'Candidate'}
Skills: ${(resumeData.skills || []).join(', ')}
Experience: ${(resumeData.experience || []).join('; ')}
Education: ${(resumeData.education || []).join('; ')}
Summary: ${resumeData.summary || ''}`;

        return `
Generate a professional cover letter based on the following resume and job description.

Resume Information:
${resumeStr}

Job Description:
${jobDescription}

${companyName ? `Company: ${companyName}` : ''}

Requirements:
- Professional tone
- 3-4 paragraphs
- Highlight relevant skills and experience
- Show enthusiasm for the role
- Include a strong opening and call to action
- Do NOT use placeholder text like [Your Name] - use the name from the resume

Return a JSON object with this exact structure:
{
  "coverLetter": "<the complete cover letter>",
  "wordCount": <number>
}
`;
    },
};

// ==================== MIDDLEWARE ====================

/**
 * Validate that request body is not empty
 */
const validateBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Request body is required',
        });
    }
    next();
};

// ==================== ROUTES ====================

/**
 * POST /api/ai/ats-optimize
 * 
 * Analyze resume for ATS compatibility and provide optimization suggestions.
 * 
 * @body {string} resumeText - The resume text to analyze
 * @body {string} [jobDescription] - Optional job description for targeted analysis
 * @returns {Object} ATS score and recommendations
 */
router.post('/ats-optimize', validateBody, async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || typeof resumeText !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'resumeText is required and must be a string',
            });
        }

        if (resumeText.length < 50) {
            return res.status(400).json({
                success: false,
                error: 'Resume text is too short. Please provide more content.',
            });
        }

        console.log('[AI] Processing ATS optimization request...');

        const prompt = PROMPTS.atsOptimize(resumeText, jobDescription);
        const result = await gemini.generateJSON(prompt, {
            temperature: 0.3,
            maxOutputTokens: 2048,
        });

        if (!result.success) {
            console.error('[AI] ATS optimization failed:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to analyze resume',
            });
        }

        const data = result.data;

        // Validate and normalize response
        const response = {
            success: true,
            score: typeof data.score === 'number' ? Math.min(100, Math.max(0, data.score)) : 50,
            missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
            recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
            issues: Array.isArray(data.issues) ? data.issues : [],
            strengths: Array.isArray(data.strengths) ? data.strengths : [],
        };

        console.log(`[AI] ATS optimization complete. Score: ${response.score}`);
        res.json(response);
    } catch (error) {
        console.error('[AI] ATS optimization error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * POST /api/ai/tone-adjust
 * 
 * Adjust the tone of text to be more formal or casual.
 * 
 * @body {string} text - The text to adjust
 * @body {string} tone - Target tone: 'formal' or 'casual'
 * @returns {Object} Adjusted text and summary of changes
 */
router.post('/tone-adjust', validateBody, async (req, res) => {
    try {
        const { text, tone } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'text is required and must be a string',
            });
        }

        if (!tone || !['formal', 'casual'].includes(tone)) {
            return res.status(400).json({
                success: false,
                error: 'tone is required and must be "formal" or "casual"',
            });
        }

        console.log(`[AI] Processing tone adjustment to ${tone}...`);

        const prompt = PROMPTS.toneAdjust(text, tone);
        const result = await gemini.generateJSON(prompt, {
            temperature: 0.5,
            maxOutputTokens: 2048,
        });

        if (!result.success) {
            console.error('[AI] Tone adjustment failed:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to adjust tone',
            });
        }

        const data = result.data;

        const response = {
            success: true,
            adjustedText: data.adjustedText || text,
            summary: data.summary || `Adjusted text to ${tone} tone`,
            originalTone: data.originalTone || 'unknown',
            targetTone: tone,
        };

        console.log('[AI] Tone adjustment complete');
        res.json(response);
    } catch (error) {
        console.error('[AI] Tone adjustment error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * POST /api/ai/action-verbs
 * 
 * Enhance weak action verbs with more impactful alternatives.
 * 
 * @body {string} text - The text to enhance
 * @returns {Object} Enhanced text and list of changed verbs
 */
router.post('/action-verbs', validateBody, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'text is required and must be a string',
            });
        }

        if (text.length < 20) {
            return res.status(400).json({
                success: false,
                error: 'Text is too short. Please provide more content.',
            });
        }

        console.log('[AI] Processing action verb enhancement...');

        const prompt = PROMPTS.actionVerbs(text);
        const result = await gemini.generateJSON(prompt, {
            temperature: 0.5,
            maxOutputTokens: 2048,
        });

        if (!result.success) {
            console.error('[AI] Action verb enhancement failed:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to enhance action verbs',
            });
        }

        const data = result.data;

        const response = {
            success: true,
            enhancedText: data.enhancedText || text,
            changedVerbs: Array.isArray(data.changedVerbs) ? data.changedVerbs : [],
            totalChanges: typeof data.totalChanges === 'number' ? data.totalChanges : (data.changedVerbs?.length || 0),
        };

        console.log(`[AI] Action verb enhancement complete. ${response.totalChanges} changes made.`);
        res.json(response);
    } catch (error) {
        console.error('[AI] Action verb enhancement error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * POST /api/ai/cover-letter
 * 
 * Generate a professional cover letter based on resume and job description.
 * 
 * @body {Object|string} resumeData - Parsed resume data or summary text
 * @body {string} jobDescription - The job description to tailor for
 * @body {string} [companyName] - Optional company name for personalization
 * @returns {Object} Generated cover letter
 */
router.post('/cover-letter', validateBody, async (req, res) => {
    try {
        const { resumeData, jobDescription, companyName } = req.body;

        if (!resumeData) {
            return res.status(400).json({
                success: false,
                error: 'resumeData is required',
            });
        }

        if (!jobDescription || typeof jobDescription !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'jobDescription is required and must be a string',
            });
        }

        if (jobDescription.length < 20) {
            return res.status(400).json({
                success: false,
                error: 'Job description is too short. Please provide more details.',
            });
        }

        console.log('[AI] Generating cover letter...');

        const prompt = PROMPTS.coverLetter(resumeData, jobDescription, companyName);
        const result = await gemini.generateJSON(prompt, {
            temperature: 0.7,
            maxOutputTokens: 4096,
        });

        if (!result.success) {
            console.error('[AI] Cover letter generation failed:', result.error);
            return res.status(500).json({
                success: false,
                error: result.error || 'Failed to generate cover letter',
            });
        }

        const data = result.data;

        const response = {
            success: true,
            coverLetter: data.coverLetter || '',
            wordCount: typeof data.wordCount === 'number' ? data.wordCount : (data.coverLetter?.split(/\s+/).length || 0),
        };

        if (!response.coverLetter) {
            return res.status(500).json({
                success: false,
                error: 'Failed to generate cover letter content',
            });
        }

        console.log(`[AI] Cover letter generated. ${response.wordCount} words.`);
        res.json(response);
    } catch (error) {
        console.error('[AI] Cover letter generation error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

/**
 * GET /api/ai/health
 * 
 * Check Gemini AI service health status.
 * 
 * @returns {Object} AI health status
 */
router.get('/health', async (req, res) => {
    try {
        console.log('[AI] Checking AI health...');

        const healthResult = await gemini.checkHealth();

        const response = {
            success: healthResult.available,
            geminiStatus: healthResult.available ? 'available' : 'unavailable',
            message: healthResult.available
                ? 'Gemini AI is operational'
                : (healthResult.error || 'Gemini AI is not available'),
            responseTime: healthResult.responseTime,
            configured: gemini.isConfigured(),
        };

        console.log(`[AI] Health check: ${response.geminiStatus}`);
        res.json(response);
    } catch (error) {
        console.error('[AI] Health check error:', error.message);
        res.status(500).json({
            success: false,
            geminiStatus: 'error',
            message: error.message,
            configured: gemini.isConfigured(),
        });
    }
});

module.exports = router;
