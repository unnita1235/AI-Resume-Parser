/**
 * Gemini client (TypeScript)
 * Lightweight wrapper to call Google Generative Language (Gemini) via REST.
 * Recommended placement: `src/lib/geminiClient.ts`
 */

export interface GenerateContentOptions {
  temperature?: number;
  maxOutputTokens?: number;
  timeout?: number; // ms
}

export interface GenerateContentResult {
  success: boolean;
  text?: string;
  error?: string;
  statusCode?: number;
}

export interface GenerateJSONResult extends GenerateContentResult {
  data?: any;
}

export interface HealthResult {
  available: boolean;
  responseTime?: number;
  error?: string;
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const DEFAULT_TIMEOUT = 30_000; // ms
const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 2048;

const config = {
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '',
  timeout: DEFAULT_TIMEOUT,
  defaultTemperature: DEFAULT_TEMPERATURE,
  defaultMaxTokens: DEFAULT_MAX_TOKENS,
};

export function isConfigured(): boolean {
  return Boolean(config.apiKey);
}

export function configure(newConfig: Partial<typeof config>) {
  Object.assign(config, newConfig);
}

export async function generateContent(prompt: string, options: GenerateContentOptions = {}): Promise<GenerateContentResult> {
  if (!isConfigured()) {
    return { success: false, error: 'Gemini API key not configured' };
  }

  const temperature = options.temperature ?? config.defaultTemperature;
  const maxOutputTokens = options.maxOutputTokens ?? config.defaultMaxTokens;
  const timeout = options.timeout ?? config.timeout;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.apiKey,
      },
      body: JSON.stringify({
        contents: [ { parts: [{ text: prompt }] } ],
        generationConfig: { temperature, maxOutputTokens },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: `Gemini API error: ${res.status} ${res.statusText}`, statusCode: res.status };
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return { success: false, error: 'No content in Gemini response' };

    return { success: true, text };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') return { success: false, error: 'Request timed out' };
    return { success: false, error: err?.message ?? String(err) };
  }
}

export async function generateJSON(prompt: string, options: GenerateContentOptions = {}): Promise<GenerateJSONResult> {
  const result = await generateContent(prompt, options);
  if (!result.success) return result as GenerateJSONResult;

  try {
    const jsonMatch = result.text?.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!jsonMatch) return { success: false, text: result.text, error: 'No JSON found in response' };
    const data = JSON.parse(jsonMatch[0]);
    return { success: true, text: result.text, data };
  } catch (parseError: any) {
    return { success: false, text: result.text, error: `Failed to parse JSON: ${parseError?.message ?? parseError}` };
  }
}

export async function checkHealth(): Promise<HealthResult> {
  if (!isConfigured()) return { available: false, error: 'API key not configured' };
  const start = Date.now();
  try {
    const r = await generateContent('Say "OK" if you can read this.', { temperature: 0, maxOutputTokens: 10, timeout: 10_000 });
    return { available: r.success, responseTime: Date.now() - start, error: r.success ? undefined : r.error };
  } catch (err: any) {
    return { available: false, responseTime: Date.now() - start, error: err?.message ?? String(err) };
  }
}
