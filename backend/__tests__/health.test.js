const request = require('supertest');
const app = require('../src/server');

describe('Health Check Endpoints', () => {
  describe('GET /health', () => {
    test('should be available immediately', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
    });

    test('should return required health fields', async () => {
      const res = await request(app).get('/health');

      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('mode');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('version');
    });

    test('should indicate healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('GET /api/stats', () => {
    test('should track request counts', async () => {
      // Make a few requests
      await request(app).get('/health');
      await request(app).get('/api/stats');

      const res = await request(app).get('/api/stats');

      expect(res.body.stats.totalRequests).toBeGreaterThan(0);
    });

    test('should report accuracy stats', async () => {
      const res = await request(app).get('/api/stats');

      expect(res.body.stats).toHaveProperty('totalParsedResumes');
      expect(res.body.stats).toHaveProperty('errors');
    });
  });
});
