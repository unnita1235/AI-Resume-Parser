# Copilot / AI Agent Instructions (short & actionable)

## Big picture (what lives where) ✅
- **Frontend**: Next.js 15 App Router in `src/app` (TypeScript + Tailwind + shadcn/ui). Layout: resizable split pane (`ResumeEditor` left, `ResumePreview` right). Components in `src/components`, API calls via `src/lib/api-client.ts`.
- **AI Flows (Genkit)**: Config in `src/ai/genkit.ts` (plugin `@genkit-ai/googleai`, model `gemini-2.5-flash`). Flows in `src/ai/flows/*` define Zod schemas + prompts. Each flow: `'use server'` → `definePrompt()` → `defineFlow()`. All must be imported in `src/ai/dev.ts` for harness discovery.
- **API Routes (REST preferred)**: Next routes in `src/app/api/**/route.ts` mostly use REST Gemini client directly (faster, no Genkit). Routes: `ai/ats-optimize` (score 0-100), `ai/tone-adjust` (formal|casual), `ai/action-verbs` (verb enhancement), `ai/cover-letter` (generation), `extract-text` (PDF/DOCX/TXT), `health` (status check). All return `{ success, ... }` response structure.
- **Gemini Access**: Routes import `generateJSON()` from `src/lib/ai.ts` which wraps `src/lib/geminiClient.ts` (REST client, reads `GOOGLE_GEMINI_API_KEY` or `GOOGLE_AI_API_KEY`).
- **Backend (optional)**: Express + MongoDB in `backend/src/server.js` (demo mode works without DB). Python parser at `backend/python_parser/parser.py` for advanced PDF extraction.
- **Deployment**: Frontend on Vercel (`vercel.json` configured). Backend on Render (`render.yaml` with secret mgmt).

## Run & test locally 🔧
- **Install**: `npm install` (root). Backend deps separate: `cd backend && npm install`. Python (optional): `pip install -r backend/python_parser/requirements.txt`.
- **Env**: Copy `.env.example` → `.env.local`. Required: `GOOGLE_GEMINI_API_KEY` OR `GOOGLE_AI_API_KEY`. Optional: `NEXT_PUBLIC_API_URL` (backend; defaults `http://localhost:5000`), `NODE_ENV`. Backend: `MONGODB_URI` (optional, demo mode if empty), `UPLOAD_PATH` (file uploads).
- **Start**: 
  - **Full stack (recommended)**: `npm run dev` (Next 3000 + Express 5000, uses `concurrently`)
  - **Frontend only**: `npx next dev` (port 3000)
  - **Genkit harness**: `npm run genkit:dev` or `genkit:watch` (test flows; imports from `src/ai/dev.ts`)
  - **Backend only**: `npm run backend:dev` (port 5000)
  - **Build preview**: `npm run preview` (test production build locally)
- **Tests**: 
  - Frontend: `npm test` (Vitest, `src/__tests__`, uses jsdom environment)
  - Backend: `cd backend && npm test` (Jest, `backend/__tests__`)
  - Both: `npm run typecheck` (TypeScript check, no emit)

## AI flow conventions 🧭
- **Structure**: `'use server'` → define `XyzInputSchema` & `XyzOutputSchema` (Zod) → export `type XyzInput/Output = z.infer<...>` → `ai.definePrompt({ name, input, output, prompt })` → `ai.defineFlow({ name, inputSchema, outputSchema, streamFn })` → export async wrapper.
- **Template examples**: 
  - `src/ai/flows/optimize-for-ats.ts` — analyzes resume ATS compatibility (deterministic, temp 0.3)
  - `src/ai/flows/tone-adjustment.ts` — adjusts tone (creative, temp 0.7)
- **Prompt design**: Encode all logic in prompt text (ATS thresholds, tone guidelines, output format). Zod schemas define structure only. No computation in flows; let AI do it via prompt.
- **Input substitution**: Use Handlebars `{{{variable}}}` in prompt text to inject schema fields.
- **Registration**: Import new flows in `src/ai/dev.ts` — Genkit harness discovers flows from this file only. Must do this before `npm run genkit:dev` will show new flows.

## API route patterns (Next.js) 🧩
- **Route structure**: `src/app/api/{feature}/{action}/route.ts` exports `async function POST(req)`. Path structure drives route organization; no strict naming convention but follow existing pattern.
- **When to use REST vs Genkit**: Default to REST client (lighter, faster). Use Genkit flows only for multi-step workflows or complex prompt logic. Most routes (ats-optimize, tone-adjust, action-verbs) use REST.
- **REST client pattern** (e.g., `src/app/api/ai/ats-optimize/route.ts`):
  1. Extract + validate input: `req.json()` → check types/required fields → 400 if invalid
  2. Build prompt string inline (all logic in prompt text, not code)
  3. Call `generateJSON(prompt, { temperature, maxOutputTokens })` from `src/lib/ai.ts`
  4. Validate AI response structure before returning
  5. Return `{ success: true/false, ... }` with exact field names expected by frontend
- **Response contract**: All routes return `{ success: boolean, ... }`. On error: `{ success: false, error: "string" }` with HTTP 400/500. On success: include data fields (e.g., `score`, `adjustedText`, `text`).
- **File handling** (`extract-text`): FormData input, enforce 5MB limit, support PDF/DOCX/TXT via MIME type check. Return `{ success, text, metadata }`.
- **Key routes reference**:
  - `ats-optimize`: `{ resumeText, jobDescription? }` → `{ score: 0-100, missingKeywords[], recommendations[], issues[], strengths[] }`
  - `tone-adjust`: `{ text, tone: 'formal'|'casual' }` → `{ adjustedText, summary, originalTone, targetTone }`
  - `action-verbs`: `{ text }` → `{ enhancedText, changedVerbs[] }`
  - `cover-letter`: `{ resumeText, jobDescription }` → `{ coverLetter }`
  - `extract-text`: FormData(file) → `{ text, metadata }`
  - `health`: GET → `{ configured, geminiStatus, timestamp }`

## Integration notes 🔐
- **API key setup**: `src/lib/geminiClient.ts` checks `GOOGLE_GEMINI_API_KEY` then falls back to `GOOGLE_AI_API_KEY`. Client tries both. Never hardcode; use `.env.local` or platform secrets only.
- **Central Gemini export**: `src/lib/ai.ts` re-exports `generateContent()`, `generateJSON()`, `checkHealth()` from geminiClient. All routes import from `ai.ts`, not geminiClient directly (consistency).
- **Model & temperature tuning**:
  - Model: `gemini-1.5-flash` (default) for speed/cost; configured in geminiClient.ts
  - ATS scoring (deterministic): `temperature: 0.3` → low variance
  - Tone adjustment, cover letters (creative): `temperature: 0.7` → higher variety
- **Health endpoint**: `src/app/api/health/route.ts` validates API availability and returns service status JSON.
- **Frontend-to-API**: `src/lib/api-client.ts` makes fetch calls to `NEXT_PUBLIC_API_URL` (defaults `http://localhost:5000` if backend present, else local Next routes on 3000).
- **Decision: REST vs Genkit**: Most routes use REST (direct generateJSON call). Genkit flows reserved for future multi-step AI workflows; currently used for optional advanced flows only.

## Debugging tips 🐞
- **API route errors**: Check Next dev server logs (`npm run dev` terminal). Routes print request validation errors and AI response parsing issues.
- **Genkit flow testing**: Run `npm run genkit:dev` (harness UI on port 4000). Manually test flows; watch for schema mismatches or prompt issues. Ensure flows are imported in `src/ai/dev.ts`.
- **Gemini API failures**: 
  - Check API key set in `.env.local`; test with `curl -X GET http://localhost:3000/api/health`
  - If "API key not configured", Gemini client couldn't read env vars (restart dev server after env change)
  - 30-second timeout default; increase if hitting slow responses
- **File extraction issues**: 
  - Verify MIME type match (application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain)
  - Test with small files first; 5MB limit enforced
  - Check file encoding for TXT files (UTF-8 assumed)
- **JSON parsing errors**: Validate AI response is JSON before parsing. If Gemini returns non-JSON (e.g., markdown), update prompt to enforce `\`\`\`json\n{...}\n\`\`\`` block.
- **Temperature tuning**: Low (0.1-0.3) = deterministic (ATS); High (0.7-0.9) = creative but inconsistent (tone, cover letter).

## PR checklist for AI changes ✅
- **For new Genkit flows**: Define Zod schemas (input/output) → export `type` via `z.infer` → prompt text uses `{{{fieldName}}}` substitution → import in `src/ai/dev.ts` (required for discovery).
- **For REST API routes**: Validate all inputs (type + presence) → return `{ success: false, error: "..." }` if invalid → call `generateJSON()` with inline prompt → validate response schema → return typed response object.
- **Testing**: Add `src/__tests__/*.test.ts` for route/logic tests (Vitest, jsdom). Run `npm test` to verify locally before pushing.
- **Update docs**: If adding new env vars, update `.env.example` and `.github/copilot-instructions.md` (this file).
- **Verify temperature**: Deterministic tasks use 0.3; creative tasks use 0.7. Document reasoning in code comment.
- **Check response structure**: All responses include `success` boolean. On error, include `error` field (string). Test with curl/Postman before merging.

## Frontend patterns 🎨
- **Split-pane layout**: `src/app/page.tsx` renders `ResizablePanelGroup` with `ResumeEditor` (left) + `ResumePreview` (right). Editor state (`resumeText`) lifted to page level; passed down as props.
- **ResumeEditor component** (`src/components/resume-editor.tsx`):
  - Local state for UI controls: `jobDescription`, `tone`, `bulletPoint`, `atsResult`, `verbSuggestions`, `isAtsLoading`, `isToneLoading`, `isVerbLoading`
  - Calls server actions (`runOptimizeForAts`, `runAdjustTone`, `runEnhanceActionVerbs` from `src/app/actions.ts`) — these are async wrappers around API routes
  - Uses `useToast()` hook from `@/hooks/use-toast` for user feedback
  - Pattern: validate input → set loading → try/catch API call → toast on error → update state on success
- **ResumePreview component**: Renders `resumeText` as formatted resume (read-only display, no state mutations)
- **File upload pattern** (`src/components/file-upload.tsx`): Accepts drag-drop or click, extracts text via `/api/extract-text`, calls parent `onTextExtracted(text)` callback
- **Controlled components**: All form inputs (textarea, radio buttons, select) use React state; onChange handlers update parent via props (e.g., `setResumeText`)
- **Server actions** (`src/app/actions.ts`): Async functions marked `'use server'` that wrap API routes. Client components import these and await them. Error messages propagate via thrown exceptions → caught in try/catch → toasted.

## Backend patterns 📦
- **Express server** (`backend/src/server.js`): Boots on port 5000. Middlewares: CORS, JSON parser, file upload (multer), request counter.
- **MongoDB optional**: Schema for `Resume` model (name, email, skills, experience, etc.). Connection skipped if `MONGODB_URI` not set or `NODE_ENV=test`; app runs in demo mode with in-memory data.
- **Demo mode**: When MongoDB not available, routes return hardcoded demo resumes from `demoResumes[]` array (e.g., Jane Doe, John Smith). Allows full feature testing without DB.
- **File upload handling** (`multer`): Stores files in `UPLOAD_PATH` (default `./uploads`). Supports PDF → `pdf-parse`, DOCX → `mammoth`, TXT → native.
- **Routes structure**: Paths like `/api/parse`, `/api/parse/regex`, `/health` return `{ success, data, message }`. Errors: `{ success: false, error: "..." }` with appropriate HTTP status.
- **Gemini client** (`backend/src/utils/gemini-client.js`): REST client for Gemini; separate from frontend geminiClient.ts. Used by backend routes if backend is primary AI endpoint.

## State management & hooks 🪝
- **Lifting state**: App-level state (`resumeText`) lives in `src/app/page.tsx`, passed to `ResumeEditor` and `ResumePreview` as props. Children call `setResumeText(newText)` to update parent.
- **Local component state**: Components use `useState` for UI-only state (loading flags, form inputs, UI toggles) — e.g., `ResumeEditor` has `isAtsLoading`, `atsResult`, `jobDescription`.
- **useToast hook** (`src/hooks/use-toast`): Imported from shadcn/ui; call `toast({ title, description, variant })` to show notifications. Variants: `default`, `destructive`, `success`.
- **No Context/Redux**: Current codebase uses simple prop drilling. State is colocated near where it's used.
- **Server actions**: Async functions in `src/app/actions.ts` handle API calls server-side. Client awaits them; errors surface as thrown exceptions.
- **useEffect sparingly**: Only in `StatusIndicator` for hydration workaround (`setMounted` to avoid SSR mismatch). Most components are direct renders without effects.

## Error handling & validation 🛡️
- **API routes**: 
  1. Extract body with `const body = await req.json()` in try/catch
  2. Validate required fields + types: `if (!resumeText || typeof resumeText !== 'string') return NextResponse.json({ success: false, error: "..." }, { status: 400 })`
  3. Validate content (e.g., min length): `if (resumeText.length < 50) return ...`
  4. Wrap AI call in try/catch: on error, return `{ success: false, error: error.message }` with 500 status
  5. Validate AI response before returning to client: `if (!data.score || typeof data.score !== 'number') { ... fix with default ... }`
- **Frontend components**: Wrap API calls in try/catch; catch errors are toasted with `.title` or `.message`. Empty input validation before API call.
- **File handling**: Check MIME type + file size before upload. FormData validation: ensure file exists before posting.
- **Timeout handling**: Gemini client has 30-second timeout; routes pass `{ maxOutputTokens, temperature }` to control response size/latency.

## Monorepo integration & cross-cutting concerns 🔗
- **Shared .env vars**: Frontend reads `GOOGLE_GEMINI_API_KEY` and `NEXT_PUBLIC_API_URL`. Backend reads `GOOGLE_GEMINI_API_KEY`, `MONGODB_URI`, `UPLOAD_PATH`. Copy `.env.example` → `.env.local` (git-ignored, shared locally).
- **API routing decision**: Frontend can call either local Next.js API routes (`/api/ai/ats-optimize`) OR backend Express (`http://localhost:5000/api/parse`). Controlled by `NEXT_PUBLIC_API_URL`. In production, frontend typically calls its own Next.js routes; backend is optional.
- **Deployments**:
  - Frontend deploys to Vercel independently; build: `npm run build`
  - Backend deploys to Render independently; uses `render.yaml`; startup: `npm start` in `backend/` dir
  - Both can run locally concurrently: `npm run dev`
- **Testing split**: Frontend tests use Vitest + jsdom (`npm test` from root). Backend tests use Jest (`cd backend && npm test`). No shared test runner.
- **Monorepo commands**: 
  - `npm install` installs root + frontend deps; backend deps separate via `cd backend && npm install`
  - `npm run dev` uses `concurrently` to start both on 3000 + 5000
  - Linting: `npm run lint` (frontend only); backend has separate linting if configured
- **Type safety**: Frontend is TypeScript strict; backend is JavaScript (no types enforced). Use JSDoc comments in backend for clarity.

## Deployment & project status 🚀
- **Status**: ✅ Production-ready (as of Jan 16, 2026)
- **Frontend**: Vercel ready; `vercel.json` configured; `npm run build` succeeds
- **Backend**: Render ready; `render.yaml` uses dashboard secrets (no inline values); Express on port 5000
- **Tests**: 5/5 passing (`npm test`); TypeScript strict mode enabled
- **Architecture**: Monorepo (frontend `src/`, backend `backend/`). Split for independent deployment if needed.
- **Reference**: See [DEPLOYMENT_READY.md](../DEPLOYMENT_READY.md) for full deployment checklist
