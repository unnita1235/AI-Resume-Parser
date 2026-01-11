const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

describe('Resume Parsing API', () => {
  beforeAll(async () => {
    // Connect to test database if needed
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  describe('GET /health', () => {
    test('should return healthy status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('mode');
    });
  });

  describe('GET /api/stats', () => {
    test('should return server statistics', async () => {
      const res = await request(app).get('/api/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toHaveProperty('uptime');
      expect(res.body.stats).toHaveProperty('totalRequests');
      expect(res.body.stats).toHaveProperty('totalParsedResumes');
      expect(res.body.stats).toHaveProperty('mode');
    });
  });

  describe('GET /api/demo-resumes', () => {
    test('should return demo resumes', async () => {
      const res = await request(app).get('/api/demo-resumes');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('name');
      expect(res.body.data[0]).toHaveProperty('email');
      expect(res.body.data[0]).toHaveProperty('skills');
      expect(res.body.data[0]).toHaveProperty('accuracy');
    });
  });

  describe('GET /api/resumes', () => {
    test('should return list of resumes', async () => {
      const res = await request(app).get('/api/resumes');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('count');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/parse (without file)', () => {
    test('should return error when no file uploaded', async () => {
      const res = await request(app).post('/api/parse');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('No file uploaded');
    });
  });
});
