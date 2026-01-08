/**
 * Authentication Middleware
 * 
 * Simple API key authentication for protected endpoints.
 * Validates X-API-Key header against configured keys.
 * 
 * @module middleware/auth
 */

/**
 * Get valid API keys from environment
 * @returns {string[]} Array of valid API keys
 */
function getValidApiKeys() {
    const keysStr = process.env.VALID_API_KEYS || '';
    if (!keysStr) {
        return [];
    }
    return keysStr.split(',').map(key => key.trim()).filter(Boolean);
}

/**
 * Check if we're in development mode
 * @returns {boolean} True if development mode
 */
function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}

/**
 * Check if demo mode is enabled
 * @returns {boolean} True if demo mode is enabled
 */
function isDemoMode() {
    return process.env.DEMO_MODE === 'true';
}

/**
 * Authentication middleware
 * 
 * Validates API key from X-API-Key header.
 * Skips validation for:
 * - Health endpoints (/health)
 * - Development mode
 * - Demo mode
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function authMiddleware(req, res, next) {
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
 * Optional authentication middleware
 * 
 * Same as authMiddleware but doesn't block requests without API key.
 * Sets req.authenticated = true if valid key provided.
 */
function optionalAuth(req, res, next) {
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
 * @returns {string} A new random API key
 */
function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'rp_'; // resume-parser prefix
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

module.exports = {
    authMiddleware,
    optionalAuth,
    generateApiKey,
    getValidApiKeys,
    isDevelopment,
    isDemoMode,
};
