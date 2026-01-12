/**
 * Central AI helper for Google Gemini integrations.
 * This file re-exports the lightweight REST wrapper so all server code
 * can import from a single location. Future Genkit-based flows can also
 * be surfaced here to keep usage consistent.
 */

export type { GenerateContentOptions, GenerateContentResult, GenerateJSONResult, HealthResult } from './geminiClient';

export { isConfigured, configure, generateContent, generateJSON, checkHealth } from './geminiClient';
