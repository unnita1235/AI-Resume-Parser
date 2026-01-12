const { verifyToken } = require('../utils/jwt');

/**
 * JWT Token Authentication Middleware
 */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  next();
};

/**
 * Optional Authentication (doesn't fail if token missing)
 */
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.userId = decoded.userId;
    }
  }
  next();
};

/**
 * API Key Authentication (for backward compatibility)
 */
function getValidApiKeys() {
    const keysStr = process.env.VALID_API_KEYS || '';
    if (!keysStr) {
        return [];
    }
    return keysStr.split(',').map(key => key.trim()).filter(Boolean);
}

function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}

function isDemoMode() {
    return process.env.DEMO_MODE === 'true';
}

/**
 * API Key authentication (backward compatible)
 */
function checkApiKey(req, res, next) {
    // Skip auth for health endpoints
    if (req.path === '/health' || req.path.endsWith('/health')) {
        return next();
    }

    // Skip auth in development mode
    if (isDevelopment()) {
        return next();
    }

    // Skip auth in demo mode
    if (isDemoMode()) {
        return next();
    }

    // Get API key from header
    const apiKey = req.headers['x-api-key'];

    // If no API keys configured, skip auth (but warn)
    const validKeys = getValidApiKeys();
    if (validKeys.length === 0) {
        console.warn('[Auth] No API keys configured. Authentication disabled.');
        return next();
    }

    // Check if API key is provided
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'API key is required. Provide X-API-Key header.',
        });
    }

    // Validate API key
    if (!validKeys.includes(apiKey)) {
        console.warn(`[Auth] Invalid API key attempt: ${apiKey.substring(0, 8)}...`);
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Invalid API key.',
        });
    }

    // API key is valid
    next();
}

/**
 * Optional API key authentication
 */
function checkOptionalApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validKeys = getValidApiKeys();

    req.authenticated = false;

    if (apiKey && validKeys.includes(apiKey)) {
        req.authenticated = true;
    }

    next();
}

/**
 * Generate a new API key
 */
function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'rp_';
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

module.exports = {
    authMiddleware,
    optionalAuth,
    checkApiKey,
    checkOptionalApiKey,
    generateApiKey,
    getValidApiKeys,
    isDevelopment,
    isDemoMode,
};
