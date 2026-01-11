Salvaged files from archived variants

What this folder contains:
- `gemini-client.js` — helper to call the Google Gemini Generative Language API (uses REST + API key).
- `resume-parser.js` — simple regex-based resume parsing utility.
- `ai-enhancement.js` — Express router (partial) with AI endpoints (ATS optimize, tone-adjust, etc.).
- `tests/parse.test.js` — placeholder tests copied for review/porting.
- `hooks/useResumeParser.ts` — React hook using the backend API (placeholder, needs `api-client` integration).

Next steps (recommendation):
1. Review `gemini-client.js` and decide where to place it (e.g., `src/lib/gemini-client.js` or `backend/src/utils/gemini-client.js`).
2. Port `resume-parser.js` into a canonical helper (TypeScript preferred) and add unit tests. (DONE — added `src/lib/resumeParser.ts` and Jest test `src/__tests__/resume-parser.test.ts`)
3. Convert select Express routes from `ai-enhancement.js` into Next.js App Router API routes under `src/app/api/ai/*`.
4. Add/adjust backend tests to run in the canonical test environment (Jest + Node or unify with existing Python tests where appropriate).

If you want, I can now prepare a patch that adds the `gemini-client` and `useResumeParser` hook into `src/` for direct integration. Tell me if you want me to continue with API route porting and test modernization.