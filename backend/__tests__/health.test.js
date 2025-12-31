const request = require('supertest');
const app = require('../src/server');

describe('Health Check Endpoint', () => {
  describe('GET /health', () => {
    test('should return 200 OK status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
    });

    test('should return health status object', async () => {
      const res = await request(app).get('/health');
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime_seconds');
      expect(res.body).toHaveProperty('mode');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('server');
    });

    test('should return valid status values', async () => {
      const res = await request(app).get('/health');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(res.body.status);
    });

    test('should return valid mode values', async () => {
      const res = await request(app).get('/health');
      expect(['DEMO', 'PRODUCTION']).toContain(res.body.mode);
    });

    test('should return database connection info', async () => {
      const res = await request(app).get('/health');
      expect(res.body.database).toHaveProperty('connected');
      expect(typeof res.body.database.connected).toBe('boolean');
    });

    test('should return server info', async () => {
      const res = await request(app).get('/health');
      expect(res.body.server).toHaveProperty('memory_usage_mb');
      expect(res.body.server).toHaveProperty('node_version');
      expect(res.body.server).toHaveProperty('environment');
      expect(typeof res.body.server.memory_usage_mb).toBe('number');
    });

    test('should return timestamp in ISO format', async () => {
      const res = await request(app).get('/health');
      const timestamp = new Date(res.body.timestamp);
      expect(timestamp instanceof Date && !isNaN(timestamp)).toBe(true);
    });

    test('should have uptime greater than 0', async () => {
      const res = await request(app).get('/health');
      expect(res.body.uptime_seconds).toBeGreaterThanOrEqual(0);
    });
  });
});
