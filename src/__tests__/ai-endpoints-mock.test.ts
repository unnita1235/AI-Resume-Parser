import * as gemini from '@/lib/geminiClient';
import { POST as atsPOST } from '@/app/api/ai/ats-optimize/route';

vi.mock('@/lib/geminiClient');

describe('AI API with mocked Gemini', () => {
  afterEach(() => vi.restoreAllMocks());

  test('ATS optimize returns normalized response when Gemini returns data', async () => {
    const mockData = {
      score: 85,
      missingKeywords: ['TypeScript', 'Docker'],
      recommendations: ['Add a technical summary', 'Include project metrics'],
      issues: [],
      strengths: ['Clear skills section'],
    };

    (gemini.generateJSON as unknown as vi.Mock).mockResolvedValue({ success: true, data: mockData });

    const req = new Request('http://localhost/api/ai/ats-optimize', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ resumeText: 'This is a long resume text with lots of content to pass length checks.' }),
    });

    const res = await atsPOST(req as any);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.score).toBe(85);
    expect(Array.isArray(json.missingKeywords)).toBe(true);
    expect(json.recommendations.length).toBeGreaterThan(0);
  });
});