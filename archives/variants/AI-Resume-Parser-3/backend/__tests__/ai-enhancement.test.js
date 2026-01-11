/**
 * AI Enhancement Routes Tests
 * 
 * Jest test suite for AI enhancement endpoints.
 * @module __tests__/ai-enhancement.test
 */

const request = require('supertest');
const app = require('../src/server');

// Mock the gemini-client module
jest.mock('../src/utils/gemini-client', () => ({
    isConfigured: jest.fn(() => true),
    generateJSON: jest.fn(),
    checkHealth: jest.fn(),
}));

const gemini = require('../src/utils/gemini-client');

describe('AI Enhancement Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==================== HEALTH CHECK ====================
    describe('GET /api/ai/health', () => {
        test('should return available when Gemini is healthy', async () => {
            gemini.checkHealth.mockResolvedValue({
                available: true,
                responseTime: 500,
            });

            const res = await request(app).get('/api/ai/health');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.geminiStatus).toBe('available');
            expect(res.body).toHaveProperty('responseTime');
        });

        test('should return unavailable when Gemini is down', async () => {
            gemini.checkHealth.mockResolvedValue({
                available: false,
                error: 'API key not configured',
            });

            const res = await request(app).get('/api/ai/health');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.geminiStatus).toBe('unavailable');
        });
    });

    // ==================== ATS OPTIMIZE ====================
    describe('POST /api/ai/ats-optimize', () => {
        const validResumeText = 'John Doe\nSoftware Engineer\n5 years experience in JavaScript, React, Node.js\nBuilt scalable applications for millions of users';

        test('should return ATS score and recommendations', async () => {
            gemini.generateJSON.mockResolvedValue({
                success: true,
                data: {
                    score: 85,
                    missingKeywords: ['Docker', 'AWS'],
                    recommendations: ['Add more quantifiable achievements'],
                    issues: ['Missing summary section'],
                    strengths: ['Strong technical skills'],
                },
            });

            const res = await request(app)
                .post('/api/ai/ats-optimize')
                .send({ resumeText: validResumeText });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.score).toBe(85);
            expect(res.body.missingKeywords).toContain('Docker');
            expect(res.body.recommendations).toHaveLength(1);
        });

        test('should require resumeText', async () => {
            const res = await request(app)
                .post('/api/ai/ats-optimize')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toContain('resumeText is required');
        });

        test('should reject short resume text', async () => {
            const res = await request(app)
                .post('/api/ai/ats-optimize')
                .send({ resumeText: 'Too short' });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('too short');
        });

        test('should handle Gemini API errors', async () => {
            gemini.generateJSON.mockResolvedValue({
                success: false,
                error: 'API rate limit exceeded',
            });

            const res = await request(app)
                .post('/api/ai/ats-optimize')
                .send({ resumeText: validResumeText });

            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
        });
    });

    // ==================== TONE ADJUST ====================
    describe('POST /api/ai/tone-adjust', () => {
        test('should adjust text to formal tone', async () => {
            gemini.generateJSON.mockResolvedValue({
                success: true,
                data: {
                    adjustedText: 'I developed innovative solutions...',
                    summary: 'Formalized language and removed contractions',
                    originalTone: 'casual',
                    targetTone: 'formal',
                },
            });

            const res = await request(app)
                .post('/api/ai/tone-adjust')
                .send({
                    text: "I worked on some cool projects and we built awesome stuff",
                    tone: 'formal',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.targetTone).toBe('formal');
            expect(res.body.adjustedText).toBeDefined();
        });

        test('should adjust text to casual tone', async () => {
            gemini.generateJSON.mockResolvedValue({
                success: true,
                data: {
                    adjustedText: "I've worked on some great projects...",
                    summary: 'Made language more conversational',
                    originalTone: 'formal',
                    targetTone: 'casual',
                },
            });

            const res = await request(app)
                .post('/api/ai/tone-adjust')
                .send({
                    text: 'I developed enterprise solutions for Fortune 500 companies',
                    tone: 'casual',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.targetTone).toBe('casual');
        });

        test('should require text field', async () => {
            const res = await request(app)
                .post('/api/ai/tone-adjust')
                .send({ tone: 'formal' });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('text is required');
        });

        test('should reject invalid tone', async () => {
            const res = await request(app)
                .post('/api/ai/tone-adjust')
                .send({
                    text: 'Some text',
                    tone: 'professional', // invalid
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('must be "formal" or "casual"');
        });
    });

    // ==================== ACTION VERBS ====================
    describe('POST /api/ai/action-verbs', () => {
        test('should enhance action verbs', async () => {
            gemini.generateJSON.mockResolvedValue({
                success: true,
                data: {
                    enhancedText: 'Spearheaded development of new features. Mentored junior developers.',
                    changedVerbs: [
                        { original: 'Worked on', enhanced: 'Spearheaded', context: 'development' },
                        { original: 'Helped', enhanced: 'Mentored', context: 'junior developers' },
                    ],
                    totalChanges: 2,
                },
            });

            const res = await request(app)
                .post('/api/ai/action-verbs')
                .send({
                    text: 'Worked on development of new features. Helped junior developers.',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.totalChanges).toBe(2);
            expect(res.body.changedVerbs).toHaveLength(2);
        });

        test('should require text field', async () => {
            const res = await request(app)
                .post('/api/ai/action-verbs')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('text is required');
        });

        test('should reject short text', async () => {
            const res = await request(app)
                .post('/api/ai/action-verbs')
                .send({ text: 'Short' });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('too short');
        });
    });

    // ==================== COVER LETTER ====================
    describe('POST /api/ai/cover-letter', () => {
        const validResumeData = {
            name: 'John Doe',
            skills: ['JavaScript', 'React', 'Node.js'],
            experience: ['Senior Developer at TechCorp'],
            education: ['BS Computer Science'],
            summary: 'Experienced full stack developer',
        };

        const validJobDescription = 'We are looking for a Senior Developer with 5+ years experience in React and Node.js to join our growing team.';

        test('should generate a cover letter', async () => {
            gemini.generateJSON.mockResolvedValue({
                success: true,
                data: {
                    coverLetter: 'Dear Hiring Manager,\n\nI am writing to express my interest...',
                    wordCount: 285,
                },
            });

            const res = await request(app)
                .post('/api/ai/cover-letter')
                .send({
                    resumeData: validResumeData,
                    jobDescription: validJobDescription,
                    companyName: 'TechCorp',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.coverLetter).toContain('Dear Hiring Manager');
            expect(res.body.wordCount).toBeGreaterThan(0);
        });

        test('should work without company name', async () => {
            gemini.generateJSON.mockResolvedValue({
                success: true,
                data: {
                    coverLetter: 'Dear Hiring Manager,\n\nI am excited to apply...',
                    wordCount: 250,
                },
            });

            const res = await request(app)
                .post('/api/ai/cover-letter')
                .send({
                    resumeData: validResumeData,
                    jobDescription: validJobDescription,
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        test('should require resumeData', async () => {
            const res = await request(app)
                .post('/api/ai/cover-letter')
                .send({
                    jobDescription: validJobDescription,
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('resumeData is required');
        });

        test('should require jobDescription', async () => {
            const res = await request(app)
                .post('/api/ai/cover-letter')
                .send({
                    resumeData: validResumeData,
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('jobDescription is required');
        });

        test('should reject short job description', async () => {
            const res = await request(app)
                .post('/api/ai/cover-letter')
                .send({
                    resumeData: validResumeData,
                    jobDescription: 'Short',
                });

            expect(res.status).toBe(400);
            expect(res.body.error).toContain('too short');
        });
    });

    // ==================== EDGE CASES ====================
    describe('Edge Cases', () => {
        test('should handle empty request body', async () => {
            const res = await request(app)
                .post('/api/ai/ats-optimize')
                .send();

            expect(res.status).toBe(400);
        });

        test('should handle malformed JSON response from Gemini', async () => {
            gemini.generateJSON.mockResolvedValue({
                success: true,
                data: null,
            });

            const res = await request(app)
                .post('/api/ai/ats-optimize')
                .send({ resumeText: 'John Doe\nSoftware Engineer with 5 years experience in JavaScript and Python' });

            expect(res.status).toBe(200);
            // Should return default values
            expect(res.body.missingKeywords).toEqual([]);
        });
    });
});
