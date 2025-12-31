const request = require('supertest');
const app = require('../src/server');

describe('Demo Samples Endpoint', () => {
  describe('GET /api/demo-samples', () => {
    test('should return 200 OK status', async () => {
      const res = await request(app).get('/api/demo-samples');
      expect(res.statusCode).toBe(200);
    });

    test('should return demo samples data', async () => {
      const res = await request(app).get('/api/demo-samples');
      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('mode');
      expect(res.body).toHaveProperty('count');
      expect(res.body).toHaveProperty('data');
    });

    test('should return success=true', async () => {
      const res = await request(app).get('/api/demo-samples');
      expect(res.body.success).toBe(true);
    });

    test('should return DEMO mode', async () => {
      const res = await request(app).get('/api/demo-samples');
      expect(res.body.mode).toBe('DEMO');
    });

    test('should return array of sample resumes', async () => {
      const res = await request(app).get('/api/demo-samples');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('should return correct count of samples', async () => {
      const res = await request(app).get('/api/demo-samples');
      expect(res.body.count).toBe(res.body.data.length);
    });

    test('should have required fields in each sample', async () => {
      const res = await request(app).get('/api/demo-samples');
      res.body.data.forEach((sample) => {
        expect(sample).toHaveProperty('id');
        expect(sample).toHaveProperty('name');
        expect(sample).toHaveProperty('contact');
        expect(sample).toHaveProperty('skills');
        expect(sample).toHaveProperty('experience');
        expect(sample).toHaveProperty('education');
        expect(sample).toHaveProperty('raw_text');
      });
    });

    test('should have contact info in each sample', async () => {
      const res = await request(app).get('/api/demo-samples');
      res.body.data.forEach((sample) => {
        expect(sample.contact).toHaveProperty('email');
        expect(sample.contact).toHaveProperty('phone');
      });
    });

    test('should have array fields in each sample', async () => {
      const res = await request(app).get('/api/demo-samples');
      res.body.data.forEach((sample) => {
        expect(Array.isArray(sample.skills)).toBe(true);
        expect(Array.isArray(sample.experience)).toBe(true);
        expect(Array.isArray(sample.education)).toBe(true);
        expect(sample.skills.length).toBeGreaterThan(0);
      });
    });
  });
});
