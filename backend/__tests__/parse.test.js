const request = require('supertest');
const app = require('../src/server');

describe('Resume Parsing Endpoint', () => {
  describe('POST /api/parse - Error Cases', () => {
    test('should return 400 if no file uploaded', async () => {
      const res = await request(app)
        .post('/api/parse')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('No file uploaded');
    });

    test('should return proper error for empty request', async () => {
      const res = await request(app)
        .post('/api/parse');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success');
      expect(res.body.success).toBe(false);
    });
  });

  describe('Parse Response Format', () => {
    test('error response should have consistent format', async () => {
      const res = await request(app)
        .post('/api/parse');
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.success).toBe('boolean');
      expect(typeof res.body.message).toBe('string');
    });
  });

  describe('POST /api/parse - Validation', () => {
    test('should only accept specific file types', async () => {
      const res = await request(app)
        .post('/api/parse')
        .field('name', 'test');

      // Should fail because no file or wrong type
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});

describe('Resume Database Operations', () => {
  describe('GET /api/resumes', () => {
    test('should return resumes list', async () => {
      const res = await request(app).get('/api/resumes');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should return valid count', async () => {
      const res = await request(app).get('/api/resumes');
      expect(typeof res.body.count).toBe('number');
      expect(res.body.count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /api/resumes/:id', () => {
    test('should return 404 for non-existent resume', async () => {
      const fakeId = '000000000000000000000000';
      const res = await request(app).get(`/api/resumes/${fakeId}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });

    test('should return error for invalid MongoDB ID format', async () => {
      const res = await request(app).get('/api/resumes/invalid-id');
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});
