/**
 * Rate Limiter Middleware
 * 
 * Configurable rate limiting for API endpoints.
 * Uses express-rate-limit if available, falls back to simple in-memory limiting.
 * 
 * @module middleware/rate-limiter
 */

/**
 * Simple in-memory rate limiter store
 */
const requestCounts = new Map();
const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_REQUESTS = 100;

/**
 * Clean up old entries periodically
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requestCounts.entries()) {
        if (now > data.resetTime) {
            requestCounts.delete(key);
        }
    }
}, 60 * 1000); // Clean up every minute

/**
 * Get client identifier from request
 * @param {Object} req - Express request
 * @returns {string} Client identifier
 */
function getClientId(req) {
    return req.ip ||
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        'unknown';
}

/**
 * Create a rate limiter middleware
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 min)
 * @param {number} options.max - Maximum requests per window (default: 100)
 * @param {string} options.message - Error message when rate limited
 * @param {Function} options.skip - Function to skip rate limiting for certain requests
 * @returns {Function} Express middleware
 */
function createRateLimiter(options = {}) {
    const {
        windowMs = DEFAULT_WINDOW_MS,
        max = DEFAULT_MAX_REQUESTS,
        message = 'Too many requests, please try again later.',
        skip = () => false,
    } = options;

    return function rateLimiter(req, res, next) {
        // Skip if skip function returns true
        if (skip(req)) {
            return next();
        }

        const clientId = getClientId(req);
        const now = Date.now();

        let clientData = requestCounts.get(clientId);

        // Initialize or reset if window expired
        if (!clientData || now > clientData.resetTime) {
            clientData = {
                count: 0,
                resetTime: now + windowMs,
            };
        }

        // Increment request count
        clientData.count++;
        requestCounts.set(clientId, clientData);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - clientData.count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000));

        // Check if rate limited
        if (clientData.count > max) {
            console.warn(`[RateLimit] Client ${clientId} exceeded rate limit`);
            return res.status(429).json({
                success: false,
                error: 'Too Many Requests',
                message,
                retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
            });
        }

        next();
    };
}

/**
 * Pre-configured rate limiter for API endpoints
 * 100 requests per 15 minutes
 */
const apiLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many API requests. Please wait before trying again.',
    skip: (req) => {
        // Skip rate limiting for health endpoints
        return req.path === '/health' || req.path.endsWith('/health');
    },
});

/**
 * Stricter rate limiter for AI endpoints
 * 30 requests per 15 minutes
 */
const aiLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'AI enhancement rate limit exceeded. Please wait before trying again.',
});

/**
 * Very strict limiter for file uploads
 * 10 uploads per 15 minutes
 */
const uploadLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Upload rate limit exceeded. Please wait before uploading more files.',
});

/**
 * Authentication attempt limiter
 * 5 attempts per 15 minutes
 */
const authLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts. Please wait.',
});

module.exports = {
    createRateLimiter,
    apiLimiter,
    aiLimiter,
    uploadLimiter,
    authLimiter,
};
