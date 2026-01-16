/**
 * Backend Request Validation Middleware
 * Centralized validation to reduce code duplication
 */

const validateAtsRequest = (req, res, next) => {
  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({
      success: false,
      error: 'resumeText: Resume text is required',
      timestamp: new Date().toISOString(),
    });
  }

  if (typeof resumeText !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'resumeText: Must be a string',
      timestamp: new Date().toISOString(),
    });
  }

  if (resumeText.length < 50) {
    return res.status(400).json({
      success: false,
      error: 'resumeText: Must be at least 50 characters',
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

const validateToneRequest = (req, res, next) => {
  const { text, tone } = req.body;
  const validTones = ['formal', 'casual'];

  if (!text) {
    return res.status(400).json({
      success: false,
      error: 'text: Text content is required',
      timestamp: new Date().toISOString(),
    });
  }

  if (typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'text: Must be a string',
      timestamp: new Date().toISOString(),
    });
  }

  if (!tone) {
    return res.status(400).json({
      success: false,
      error: 'tone: Tone selection is required (formal or casual)',
      timestamp: new Date().toISOString(),
    });
  }

  if (!validTones.includes(tone)) {
    return res.status(400).json({
      success: false,
      error: `tone: Must be one of: ${validTones.join(', ')}`,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

const validateActionVerbRequest = (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      error: 'text: Text content is required',
      timestamp: new Date().toISOString(),
    });
  }

  if (typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'text: Must be a string',
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

const validateCoverLetterRequest = (req, res, next) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText) {
    return res.status(400).json({
      success: false,
      error: 'resumeText: Resume text is required',
      timestamp: new Date().toISOString(),
    });
  }

  if (!jobDescription) {
    return res.status(400).json({
      success: false,
      error: 'jobDescription: Job description is required',
      timestamp: new Date().toISOString(),
    });
  }

  if (typeof resumeText !== 'string' || typeof jobDescription !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Both resumeText and jobDescription must be strings',
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

module.exports = {
  validateAtsRequest,
  validateToneRequest,
  validateActionVerbRequest,
  validateCoverLetterRequest,
};
