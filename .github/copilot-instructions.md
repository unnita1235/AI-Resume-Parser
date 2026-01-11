# Copilot / AI Agent Instructions (short & actionable)

## Big picture (what lives where) ✅
- Frontend: Next.js 15 App Router in `src/app` (TypeScript + Tailwind + shadcn/ui). UI uses server actions and calls local API routes.
- AI: Genkit config in `src/ai/genkit.ts` (plugin `@genkit-ai/googleai`, model `googleai/gemini-2.5-flash`). Flows are in `src/ai/flows/*` and imported by `src/ai/dev.ts` for the Genkit dev harness.
- API: Next API routes in `src/app/api/**/route.ts` (e.g., `ai/ats-optimize`, `ai/tone-adjust`, `extract-text`, `health`). These wrap Gemini via `src/lib/geminiClient.ts` and handle file/text inputs.
- Backend (optional): Express + MongoDB service in `backend/src/server.js` for resume storage and parsing endpoints (`/api/parse`, `/api/resumes`), plus a Python parser at `backend/python_parser/parser.py`.
- Deployment: Vercel (frontend). Dockerfiles: `src/Dockerfile` (Next) and `backend/Dockerfile` (Express).

## Run & test locally 🔧
- Install: `npm install` (root). For Python parser: `pip install -r backend/python_parser/requirements.txt`.
- Env: copy `.env.example` → `.env.local`. Set one of: `GOOGLE_GEMINI_API_KEY` or `GOOGLE_AI_API_KEY`. For backend calls, set `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`). See `SETUP.md`.
- Start Next: `npm run dev` (http://localhost:3000). Genkit harness: `npm run genkit:dev` (or `genkit:watch`).
- Tests: `npm test` (Vitest, see `src/__tests__`). Backend tests: `cd backend && npm test` (Jest). Python tests: `pytest -q`.
- Preview build: `npm run preview` (`next build && next start`).

## AI flow conventions 🧭
- Each flow: `use server` at top, Zod schemas for input/output, prompt via `ai.definePrompt`, wrapper via `ai.defineFlow` returning typed data.
- Example: `src/ai/flows/optimize-for-ats.ts` defines `OptimizeForAtsInput/Output`, `optimizeForAtsPrompt`, and `optimizeForAtsFlow`.
- After adding a flow, import it in `src/ai/dev.ts` so the dev harness picks it up.

## API route patterns (Next.js) 🧩
- Use `export async function POST/GET` in `route.ts` with `NextResponse.json(...)`.
- Validate inputs and return a consistent shape: `{ success: boolean, ... }`.
- Examples:
  - `src/app/api/ai/ats-optimize/route.ts` expects `{ resumeText, jobDescription? }` and returns `{ score, missingKeywords, recommendations, issues, strengths }`.
  - `src/app/api/ai/tone-adjust/route.ts` expects `{ text, tone: 'formal'|'casual' }` and returns `{ adjustedText, summary, originalTone, targetTone }`.
  - `src/app/api/extract-text/route.ts` accepts `FormData(file)` for PDF/DOCX/TXT, enforces 5MB limit, and returns `{ text, metadata }`.

## Integration notes 🔐
- Gemini REST wrapper: `src/lib/geminiClient.ts` reads `GOOGLE_GEMINI_API_KEY` or `GOOGLE_AI_API_KEY` (either works). Do not hardcode secrets.
- Health check route uses `process.env.GOOGLE_GENAI_API_KEY`; prefer the keys above and align if needed.
- Frontend API client: `src/lib/api-client.ts` targets `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`) for backend endpoints.

## Debugging tips 🐞
- AI prompts/responses: run `npm run genkit:dev` and watch logs.
- API issues: check Next dev server logs and test routes under `src/app/api/**`.
- File parsing: verify MIME/size in `extract-text` and use sample files in `src/tests`.
- Backend service: verify `/health`, `/api/parse` on port 5000; set `MONGODB_URI` and `UPLOAD_PATH` if using Express.

## PR checklist for AI changes ✅
- Define Zod schemas + export `type` via `z.infer`, keep prompts inside `ai.definePrompt`.
- Import new flows in `src/ai/dev.ts` and add unit tests (`src/__tests__`, `backend/__tests__`).
- Update `SETUP.md` if env vars change; keep diffs small and verify with `genkit:dev`.

Questions or unclear areas? If the Express backend is optional in your environment or if `GOOGLE_GENAI_API_KEY` should be standardized, tell me and I’ll refine these notes. ✨
