# AI Resume Parser & Rewriter

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-blue)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-84%25-blue)](https://www.typescriptlang.org/)

> A prototype web tool using Google Gemini for basic resume parsing and enhancement to improve ATS compatibility, tone, and action verbs.

**Note:** The live demo (previously at https://ai-resume-parser-seven.vercel.app/) is currently unavailable as of January 2026. Local setup is required to test functionality. Backend API at https://ai-resume-parser-0cmr.onrender.com may be operational for testing.

---

## Overview

This project is a basic prototype for a resume optimization tool. It allows users to upload or paste resume content, parse it into structured data (e.g., name, experience, skills), and apply AI enhancements via Google Gemini for ATS-friendly formatting, professional tone adjustments, and stronger action verbs. Built as a learning exercise, it demonstrates simple AI integration in a web app but remains limited to demo-level use without full production features like database storage or advanced error recovery.

---

## Key Features

- **File Parsing:** Handles PDF, DOCX, and TXT uploads (up to 5MB) to extract structured data such as contact info, experience, education, and skills.
- **AI Enhancement:** Uses Google Gemini 2.5 Flash to rewrite content for ATS optimization, professional language, and impactful verbs; processes in 1-3 seconds for typical resumes.
- **User Interface:** Real-time preview of original vs. enhanced resume, with options to download or copy the output.
- **Responsive Design:** Works on desktop and tablet; basic loading states and error messages for usability.
- **Limitations:** No user accounts, version history, or advanced analytics; relies on server-side API keys; best with well-formatted input to avoid parsing issues.

These features address real job search problems like passing ATS filters (which reject 75% of resumes due to formatting) and improving language, but the tool is not scalable for high-volume use.

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router for routing), TypeScript (for type safety), Tailwind CSS + shadcn/ui (for styling), Radix UI + Lucide Icons (for components), React Hooks (for state management).
- **AI Integration:** Google Genkit (for Gemini API calls), Gemini 2.5 Flash model (for enhancements).
- **Backend:** Next.js API Routes (for parsing and enhancement endpoints); no separate Express or Python backend in current structure.
- **Deployment:** Vercel for frontend; Render for any API needs; Docker support via Dockerfile and docker-compose.yml.
- **Tools:** GitHub Actions for CI/CD; basic testing implied but not detailed.

---

## Quick Start

### Prerequisites
- Node.js v18+
- npm
- Google AI API Key (free from https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone repository
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add GOOGLE_AI_API_KEY=your_key_here

# Run development server
npm run dev
Access at http://localhost:3000. Upload a resume to test parsing and enhancement.

Project Structure
textAI-Resume-Parser/
├── .github/workflows/        # CI/CD workflows
├── .vscode/                  # VS Code settings
├── public/screenshots/       # Screenshots
├── src/                      # Frontend source
│   ├── app/                  # Next.js app router
│   │   ├── page.tsx          # Main page
│   │   ├── layout.tsx        # Root layout
│   │   ├── api/              # API routes (parse, enhance)
│   │   └── globals.css
│   ├── components/           # UI components
│   │   ├── ResumeEditor.tsx
│   │   ├── FileUpload.tsx
│   │   ├── PreviewPane.tsx
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utilities
│   │   ├── ai.ts             # AI integration
│   │   ├── parser.ts         # Parsing logic
│   │   └── utils.ts
│   └── types/                # TypeScript types
│       └── resume.ts
├── .env.example
├── .gitignore
├── API_REFERENCE.md
├── ARCHITECTURE.md
├── DEPLOYMENT.md
├── Dockerfile
├── LICENSE
├── QUICK_SETUP.md
├── README.md
├── docker-compose.yml
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json

How It Works

Input Handling: User uploads file or pastes text; parsed into structured JSON (e.g., {"name": "John Doe", "skills": [...]}) via API route.
AI Processing: Sends parsed data to Gemini for optimization using predefined prompts for ATS keywords, tone, and verbs.
Output: Displays enhanced resume in preview pane; allows export.
Problem Solving: Helps with real issues like weak verbs (e.g., "helped" to "spearheaded") and ATS rejection, but processing depends on input quality and API availability.


Development Scripts
Bashnpm run dev     # Local server
npm run build   # Production build
npm run start   # Run build
npm run lint    # Code linting

Known Limitations

Requires Google AI API key; free tier may have rate limits.
Parsing accuracy varies with file format; complex layouts may fail.
No persistent storage; all processing is session-based.
Demo site down; local run needed for testing.
Basic security; not audited for production.


Contributing
Fork, create branch, commit, push, and PR. Focus on bug fixes or feature additions.

License
MIT - See LICENSE

Author
Unni T A (@unnita1235) - Entry-level full-stack developer focusing on AI web tools.
Updated: January 2026
