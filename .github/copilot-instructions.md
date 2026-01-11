# Copilot / AI Agent Instructions (short & actionable)

## Purpose
Help an AI coding agent be productive quickly: where AI logic lives, how to run and test locally, project-specific conventions, and typical integration points.

---

## Big picture (quick) ✅
- Frontend: Next.js App Router in `src/app` (TypeScript + Tailwind). Run with `npm run dev`.
- AI: Genkit configuration in `src/ai/genkit.ts` (uses `@genkit-ai/googleai`). Flows live in `src/ai/flows/*` and are exported server functions used by UI.
- Backend: Simple Python text parser at `backend/python_parser/parser.py` (spaCy + PyPDF2) and Node API routes under `src/app/api`.
- Deployment: Vercel for frontend; Docker files exist in `src/Dockerfile` and `backend/Dockerfile` for containerized builds.

---

## How to run & test locally 🔧
- Install deps: `npm install` (root) and `pip install -r backend/python_parser/requirements.txt` (if working with Python parser).
- Environment: copy `.env.example` → `.env.local` and set `GOOGLE_AI_API_KEY` (see `SETUP.md`).
- Start app: `npm run dev` (Next dev server on `http://localhost:3000`).
- Run Genkit dev harness for AI prompt debugging: `npm run genkit:dev` (or `npm run genkit:watch`).
- Frontend tests: `cd frontend && npm test` (CRA test runner). Python tests: `pytest -q` (CI defined in `src/app/.github/workflows/python-ci.yml`).
- Build preview: `npm run preview` (runs `next build && next start`).

---

## AI flow conventions you must follow 🧭
- Flows live in `src/ai/flows/*.ts` and follow this pattern:
  - Define input/output Zod schema (use `z.object` from `genkit`).
  - Create a prompt with `ai.definePrompt({ input, output, prompt })`.
  - Wrap in `ai.defineFlow(...)` and export a typed function used by server actions.
  - Example: `src/ai/flows/optimize-for-ats.ts` (see `OptimizeForAtsInput/Output`, `prompt`, `optimizeForAtsFlow`).
- Files intended for server execution include the top-line `use server` directive.
- TypeScript types should mirror Zod schemas (export `type FooInput = z.infer<typeof FooInputSchema>`).
- Keep prompt text inside `ai.definePrompt` (helps prompt-tracking and testability).

---

## Model & credential notes 🔐
- Model config is in `src/ai/genkit.ts` (`model: 'googleai/gemini-2.5-flash'`). Change there to switch models or add plugins.
- API key: set `GOOGLE_AI_API_KEY` in `.env.local`. Do NOT hardcode secrets into files.

---

## Integration & debugging tips 🐞
- To debug prompt responses locally, run `npm run genkit:dev` and check the console for request/response logs.
- When adding a new flow, import it in `src/ai/dev.ts` so it’s picked up by the genkit dev harness.
- For frontend/API issues, check Next server logs when running `npm run dev`.
- For parsing issues, run the Python parser directly or run `pytest -q` to run repository tests.

---

## PR checklist for AI changes ✅
- Add/adjust Zod schemas and export corresponding TypeScript types.
- Include example inputs/expected outputs in unit tests (where applicable).
- Update `SETUP.md` if new env vars are required.
- Keep prompt changes small & test locally with `genkit:dev`.

---

If anything is unclear or you want extra examples (sample tests, a standard prompt template, or a checklist for reviewing prompt quality), tell me which area to expand and I’ll iterate. ✨
