# Copilot / AI Agent Instructions (short & actionable)

## Big picture (what lives where) ✅
- **Frontend**: Next.js 15 App Router in `src/app` (TypeScript + Tailwind + shadcn/ui). Components in `src/components`, API client in `src/lib/api-client.ts`.
- **AI Flows**: Genkit config in `src/ai/genkit.ts` (plugin `@genkit-ai/googleai`, model `googleai/gemini-2.5-flash`). Flows in `src/ai/flows/*` define input/output schemas + prompts. All flows must be imported in `src/ai/dev.ts`.
- **API Routes**: Next routes in `src/app/api/**/route.ts` wrap either Genkit flows OR the REST Gemini client (`src/lib/geminiClient.ts`). Routes: `ai/ats-optimize`, `ai/tone-adjust`, `ai/action-verbs`, `ai/cover-letter`, `extract-text`, `health`.
- **AI/Gemini Access**: Routes call `src/lib/ai.ts` (exports geminiClient fns) with `generateJSON()` for structured responses. Genkit flows import from `src/ai/genkit.ts`.
- **Backend (optional)**: Express + MongoDB in `backend/src/server-v2.js` (resume storage, parsing, auth). Python parser at `backend/python_parser/parser.py`.
- **Deployment**: Vercel (frontend). Dockerfiles: `src/Dockerfile` (Next) and `backend/Dockerfile` (Express).

## Run & test locally 🔧
- **Install**: `npm install` (root + backend deps). For Python: `pip install -r backend/python_parser/requirements.txt`.
- **Env**: Copy `.env.example` → `.env.local`. Required: `GOOGLE_GEMINI_API_KEY` OR `GOOGLE_AI_API_KEY` (both keys work; REST client tries both). Optional: `NEXT_PUBLIC_API_URL` (backend URL; defaults to `http://localhost:5000`). Backend: set `MONGODB_URI` and `UPLOAD_PATH` if using Express.
- **Start**: 
  - **Full stack**: `npm run dev` (Next on 3000, Express on 5000 via concurrently)
  - **Frontend only**: `npx next dev` 
  - **Genkit dev harness**: `npm run genkit:dev` (or `genkit:watch` for watch mode) — imports flows from `src/ai/dev.ts`
  - **Backend only**: `npm run backend:dev` (or `cd backend && nodemon src/server.js`)
- **Tests**: 
  - Frontend/Next routes: `npm test` (Vitest, `src/__tests__`, includes AI route unit tests)
  - Backend: `cd backend && npm test` (Jest, `backend/__tests__`)
  - Python parser: `pytest -q` in `backend/python_parser/`
- **Preview build**: `npm run preview` (next build + next start)

## AI flow conventions 🧭
- **Structure**: Each flow file starts with `'use server'`, defines Zod schemas for input/output (export `type XyzInput/Output = z.infer<typeof XyzSchema>`), defines a prompt via `ai.definePrompt({ name, input, output, prompt })`, then exports async function wrapping `ai.defineFlow()`.
- **Template**: See `src/ai/flows/optimize-for-ats.ts` (ATS analysis) and `src/ai/flows/tone-adjustment.ts` (tone adjustment).
- **Prompt design**: Keep logic in the prompt itself (e.g., ATS score thresholds, tone guidelines). Use Handlebars syntax `{{{variable}}}` for input substitution in prompts.
- **Registration**: After creating a new flow, import it in `src/ai/dev.ts` so the Genkit dev harness picks it up for testing.

## API route patterns (Next.js) 🧩
- **Route structure**: `src/app/api/{feature}/{action}/route.ts` exports `async function POST(req: Request)`.
- **Two approaches**: Most routes use REST Gemini client directly (faster, no Genkit wrapper). Genkit flows are optional for complex multi-step AI logic; available in `src/ai/flows/*`.
- **REST client routes** (e.g., `ats-optimize`, `tone-adjust`): Call `generateJSON(prompt, { temperature, maxOutputTokens })` from `src/lib/ai.ts`; model is `gemini-1.5-flash`.
- **Input validation**: Extract body with `req.json()`, validate types, return `NextResponse.json({ success: false, error: "..." }, { status: 400 })` for errors.
- **Structured responses**: All routes return `{ success: boolean, ... }`. Parse/validate AI JSON responses before returning to client.
- **File handling** (`extract-text`): FormData input, 5MB limit, supports PDF/DOCX/TXT. Returns `{ success, text, metadata }` with file info.
- **Examples**:
  - `src/app/api/ai/ats-optimize/route.ts`: Input `{ resumeText, jobDescription? }` → REST call → Output `{ success, score, missingKeywords, recommendations, issues, strengths }`
  - `src/app/api/ai/tone-adjust/route.ts`: Input `{ text, tone: 'formal'|'casual' }` → Output `{ success, adjustedText, summary, originalTone, targetTone }`
  - `src/app/api/extract-text/route.ts`: FormData(file) → `{ success, text, metadata }`
  - `src/app/api/health/route.ts`: GET → `{ success, configured, geminiStatus, timestamp }`

## Integration notes 🔐
- **Gemini API key**: `src/lib/geminiClient.ts` reads `GOOGLE_GEMINI_API_KEY` or `GOOGLE_AI_API_KEY` (either key works; tries both). Do not hardcode secrets.
- **Central export**: `src/lib/ai.ts` re-exports Gemini functions (`generateContent`, `generateJSON`, `checkHealth`) for unified imports across routes.
- **Temperature settings**: Use `temperature: 0.3` for deterministic outputs (ATS scoring), `0.5-0.7` for creative tasks (tone adjustment, cover letters).
- **Health check**: Route at `src/app/api/health/route.ts` validates API key and returns service status.
- **Frontend API client**: `src/lib/api-client.ts` targets `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`) for backend endpoints.
- **Genkit vs REST**: Routes default to REST Gemini client. Use Genkit flows (in `src/ai/`) only for complex workflows with multiple AI steps or custom plugins.

## Debugging tips 🐞
- **AI prompts/responses**: Run `npm run genkit:dev` and watch logs for Genkit flow execution.
- **API issues**: Check Next dev server logs (`npm run dev` terminal) for route errors and validation issues.
- **File parsing**: Verify MIME type and size constraints in `extract-text`; test with sample files in `src/tests` or `src/__tests__`.
- **JSON response issues**: Check prompt structure in route; use `generateJSON()` with explicit JSON schema in prompt; validate returned data before response.
- **Backend service**: Verify `/health`, `/api/parse` on port 5000; set `MONGODB_URI` and `UPLOAD_PATH` if using Express.
- **Temperature tuning**: If responses are too random, decrease temperature; if too repetitive, increase it.

## PR checklist for AI changes ✅
- Define Zod schemas + export `type` via `z.infer`, keep prompts inside `ai.definePrompt`.
- Import new flows in `src/ai/dev.ts` and add unit tests (`src/__tests__`, `backend/__tests__`).
- Update `SETUP.md` if env vars change; keep diffs small and verify with `genkit:dev`.
- For API routes: validate inputs, ensure `success` field present, test with curl/Postman before merging.
- For file processing: test with actual PDF/DOCX files, verify 5MB limit is enforced, check metadata extraction.

## Deployment status 🚀
- **Status**: ✅ Production-ready (as of Jan 12, 2026)
- **Tests**: 5/5 passing; Build: succeeds; TypeScript: no errors
- **Frontend**: Vercel deployment ready (`vercel.json` configured)
- **Backend**: Render deployment ready (`render.yaml` configured with secure secrets setup)
- **Security**: No hardcoded API keys; use platform secret managers
- **Verification**: See [DEPLOYMENT_READY.md](../DEPLOYMENT_READY.md) for full checklist

## PR checklist for AI changes ✅
- Define Zod schemas + export `type` via `z.infer`, keep prompts inside `ai.definePrompt`.
- Import new flows in `src/ai/dev.ts` and add unit tests (`src/__tests__`, `backend/__tests__`).
- Update `SETUP.md` if env vars change; keep diffs small and verify with `genkit:dev`.
- For API routes: validate inputs, ensure `success` field present, test with curl/Postman before merging.
- For file processing: test with actual PDF/DOCX files, verify 5MB limit is enforced, check metadata extraction.
