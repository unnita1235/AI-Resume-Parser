/**
 * MongoDB Connection Utility with Connection Pooling
 * Implements retry logic and proper connection pool configuration
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

  // Skip MongoDB connection in demo mode
  if (!process.env.MONGODB_URI) {
    console.log('⚠️  MONGODB_URI not set - running in demo mode (no database)');
    return;
  }

  const maxRetries = 5;
  let retries = 0;
  const retryDelay = (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000);

  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Connection pool configuration
        maxPoolSize: 10,
        minPoolSize: 2,
        // Timeout configuration
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        // Retry configuration
        retryWrites: true,
        retryReads: true,
        w: 'majority',
        // Keep-alive
        keepAlive: true,
        keepAliveInitialDelayMS: 10000,
      });

      console.log('✅ MongoDB connected successfully');
      console.log(`   Connection Pool: max=${mongoose.connection.getClient().topology.s.pool.options.maxPoolSize}`);
      return;
    } catch (error) {
      retries++;
      const delay = retryDelay(retries - 1);

      console.error(
        `❌ MongoDB connection attempt ${retries}/${maxRetries} failed:`,
        error.message
      );

      if (retries < maxRetries) {
        console.log(`   Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Failed to connect to MongoDB after ${maxRetries} attempts. Check MONGODB_URI in environment variables.`
  );
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
