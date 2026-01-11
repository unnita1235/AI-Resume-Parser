import { POST as atsPOST } from '@/app/api/ai/ats-optimize/route';
import { POST as tonePOST } from '@/app/api/ai/tone-adjust/route';
import { GET as healthGET } from '@/app/api/ai/health/route';

// Basic Request helper
function makeReq(body?: any) {
  const init: RequestInit = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  };
  return new Request('http://localhost/api/ai/test', init);
}

describe('AI API basic validations', () => {
  test('ATS optimize returns 400 for missing resumeText', async () => {
    const req = makeReq({});
    const res = await atsPOST(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/resumeText is required/);
  });

  test('Tone adjust validation - missing text', async () => {
    const req = makeReq({ tone: 'formal' });
    const res = await tonePOST(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/text is required/);
  });

  test('Health endpoint returns structured response', async () => {
    const res = await healthGET();
    const json = await res.json();
    expect(json).toHaveProperty('success');
    expect(json).toHaveProperty('geminiStatus');
    expect(json).toHaveProperty('configured');
  });
});