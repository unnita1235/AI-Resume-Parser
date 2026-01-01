/**
 * Keep-Alive Mechanism for Render.com Free Tier
 * 
 * This module prevents the Render service from sleeping by making
 * periodic health check requests to the backend API.
 * 
 * Render.com free tier services automatically spin down after 15 minutes
 * of inactivity, causing ~30-50 second cold start delays. This keep-alive
 * mechanism pings the health endpoint every 25 seconds to maintain service.
 */

const HEALTH_CHECK_INTERVAL = 25000; // 25 seconds
const HEALTH_CHECK_ENDPOINT = 'http://localhost:' + (process.env.PORT || 5000) + '/api/health';
/**
 * Start the keep-alive interval
 * Makes periodic requests to health endpoint to prevent service sleep
 */
function startKeepAlive() {
    console.log('[Keep-Alive] Starting backend keep-alive mechanism...');

  // Initial health check immediately
  performHealthCheck();

  // Set up recurring health checks
  const intervalId = setInterval(performHealthCheck, HEALTH_CHECK_INTERVAL);

  // Clear interval on process exit
  process.on('exit', () => {
        clearInterval(intervalId);
        console.log('[Keep-Alive] Cleared keep-alive interval');
  });

  return intervalId;
}

/**
 * Perform a single health check request
 */
function performHealthCheck() {
    // Use fetch or native Node.js http module
  if (typeof fetch !== 'undefined') {
        // Browser or Node 18+ environment
      fetch(HEALTH_CHECK_ENDPOINT, { 
                  method: 'GET',
              timeout: 5000 
      })
          .then(response => {
                    if (response.ok) {
                                console.log('[Keep-Alive] Health check successful at', new Date().toISOString());
                    } else {
                                console.warn('[Keep-Alive] Health check returned status:', response.status);
                    }
          })
          .catch(error => {
                    console.warn('[Keep-Alive] Health check failed:', error.message);
          });
  } else {
        // Fallback for older Node.js versions
      const http = require('http');
        const request = http.get(HEALTH_CHECK_ENDPOINT, (res) => {
                if (res.statusCode === 200) {
                          console.log('[Keep-Alive] Health check successful at', new Date().toISOString());
                } else {
                          console.warn('[Keep-Alive] Health check returned status:', res.statusCode);
                }
        });

      request.on('error', (error) => {
              console.warn('[Keep-Alive] Health check failed:', error.message);
      });

      request.setTimeout(5000);
  }
}

/**
 * Module exports
 * Start keep-alive when imported
 */
module.exports = {
    startKeepAlive,
    performHealthCheck,
    HEALTH_CHECK_INTERVAL,
    HEALTH_CHECK_ENDPOINT
};

// Auto-start keep-alive if this module is run directly
if (require.main === module) {
    startKeepAlive();
}
