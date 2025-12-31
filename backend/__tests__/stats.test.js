const request = require('supertest');
const app = require('../src/server');

describe('Stats Endpoint', () => {
  describe('GET /api/stats', () => {
    test('should return 200 OK status', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.statusCode).toBe(200);
    });

    test('should return stats object', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('mode');
      expect(res.body).toHaveProperty('database_connected');
      expect(res.body).toHaveProperty('server_uptime_seconds');
      expect(res.body).toHaveProperty('parsed_in_session');
      expect(res.body).toHaveProperty('total_parsed');
      expect(res.body).toHaveProperty('timestamp');
    });

    test('should return success=true', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.body.success).toBe(true);
    });

    test('should return valid mode values', async () => {
      const res = await request(app).get('/api/stats');
      expect(['DEMO', 'PRODUCTION']).toContain(res.body.mode);
    });

    test('should return numeric uptime', async () => {
      const res = await request(app).get('/api/stats');
      expect(typeof res.body.server_uptime_seconds).toBe('number');
      expect(res.body.server_uptime_seconds).toBeGreaterThanOrEqual(0);
    });

    test('should return numeric parsed counts', async () => {
      const res = await request(app).get('/api/stats');
      expect(typeof res.body.parsed_in_session).toBe('number');
      expect(typeof res.body.total_parsed).toBe('number');
      expect(res.body.parsed_in_session).toBeGreaterThanOrEqual(0);
      expect(res.body.total_parsed).toBeGreaterThanOrEqual(0);
    });

    test('should return database connection status', async () => {
      const res = await request(app).get('/api/stats');
      expect(typeof res.body.database_connected).toBe('boolean');
    });

    test('should return timestamp in ISO format', async () => {
      const res = await request(app).get('/api/stats');
      const timestamp = new Date(res.body.timestamp);
      expect(timestamp instanceof Date && !isNaN(timestamp)).toBe(true);
    });
  });
});
