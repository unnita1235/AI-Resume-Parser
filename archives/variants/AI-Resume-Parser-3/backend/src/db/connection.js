/**
 * Database Connection
 * 
 * MongoDB connection singleton with retry logic and health checks.
 * 
 * @module db/connection
 */

const mongoose = require('mongoose');

// Connection state
let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 5;
const RETRY_INTERVAL_MS = 10000; // 10 seconds

/**
 * Get MongoDB connection URI
 * @returns {string|null} MongoDB URI or null if not configured
 */
function getMongoURI() {
    return process.env.MONGODB_URI || null;
}

/**
 * Check if database is connected
 * @returns {boolean} True if connected
 */
function isConnectedToMongo() {
    return mongoose.connection.readyState === 1;
}

/**
 * Get connection status string
 * @returns {string} Status description
 */
function getConnectionStatus() {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    return states[mongoose.connection.readyState] || 'unknown';
}

/**
 * Connect to MongoDB
 * 
 * @param {Object} options - Connection options
 * @param {boolean} options.retry - Whether to retry on failure (default: true)
 * @param {number} options.maxRetries - Maximum retry attempts (default: 5)
 * @returns {Promise<boolean>} True if connected successfully
 */
async function connect(options = {}) {
    const { retry = true, maxRetries = MAX_RETRY_ATTEMPTS } = options;

    const uri = getMongoURI();

    if (!uri) {
        console.warn('[DB] MONGODB_URI not configured. Running without database.');
        return false;
    }

    // Already connected
    if (isConnectedToMongo()) {
        console.log('[DB] Already connected to MongoDB');
        return true;
    }

    connectionAttempts++;
    console.log(`[DB] Connecting to MongoDB (attempt ${connectionAttempts})...`);

    try {
        await mongoose.connect(uri, {
            // Modern Mongoose 7+ doesn't need these options, but include for compatibility
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        connectionAttempts = 0;
        console.log('[DB] ✅ MongoDB connected successfully');

        // Set up event handlers
        setupEventHandlers();

        return true;
    } catch (error) {
        console.error(`[DB] ❌ MongoDB connection error: ${error.message}`);
        isConnected = false;

        // Retry logic
        if (retry && connectionAttempts < maxRetries) {
            console.log(`[DB] Retrying in ${RETRY_INTERVAL_MS / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL_MS));
            return connect(options);
        }

        if (connectionAttempts >= maxRetries) {
            console.error(`[DB] Max retry attempts (${maxRetries}) reached. Running without database.`);
            connectionAttempts = 0;
        }

        return false;
    }
}

/**
 * Set up mongoose connection event handlers
 */
function setupEventHandlers() {
    mongoose.connection.on('connected', () => {
        console.log('[DB] Mongoose connected to MongoDB');
        isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
        console.error('[DB] Mongoose connection error:', err.message);
        isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('[DB] Mongoose disconnected from MongoDB');
        isConnected = false;
    });

    // Handle process termination
    process.on('SIGINT', async () => {
        await disconnect();
        process.exit(0);
    });
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
async function disconnect() {
    if (!isConnectedToMongo()) {
        return;
    }

    try {
        await mongoose.connection.close();
        isConnected = false;
        console.log('[DB] MongoDB connection closed');
    } catch (error) {
        console.error('[DB] Error closing MongoDB connection:', error.message);
    }
}

/**
 * Health check for database connection
 * @returns {Promise<{healthy: boolean, status: string, latency?: number}>}
 */
async function healthCheck() {
    const startTime = Date.now();

    try {
        if (!isConnectedToMongo()) {
            return {
                healthy: false,
                status: getConnectionStatus(),
            };
        }

        // Ping the database
        await mongoose.connection.db.admin().ping();
        const latency = Date.now() - startTime;

        return {
            healthy: true,
            status: 'connected',
            latency,
        };
    } catch (error) {
        return {
            healthy: false,
            status: 'error',
            error: error.message,
        };
    }
}

/**
 * Get database statistics
 * @returns {Promise<Object>} Database stats or null if not connected
 */
async function getStats() {
    if (!isConnectedToMongo()) {
        return null;
    }

    try {
        const stats = await mongoose.connection.db.stats();
        return {
            collections: stats.collections,
            documents: stats.objects,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize,
            indexes: stats.indexes,
        };
    } catch (error) {
        console.error('[DB] Error getting stats:', error.message);
        return null;
    }
}

module.exports = {
    connect,
    disconnect,
    healthCheck,
    getStats,
    isConnected: isConnectedToMongo,
    getConnectionStatus,
    mongoose, // Export mongoose instance for direct access if needed
};
