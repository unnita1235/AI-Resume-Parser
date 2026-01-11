# AI Resume Parser & Rewriter

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ai-resume-parser-seven.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-blue)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-84%25-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4)](https://tailwindcss.com/)

> AI-powered resume enhancement tool using Google Gemini for ATS optimization, professional tone adjustment, and action verb improvements

**Live Demo:** https://ai-resume-parser-seven.vercel.app/  
**Backend API:** https://ai-resume-parser-0cmr.onrender.com

---

## 📸 Preview

<p align="center">
  <img src="screenshots/app-preview.png" alt="AI Resume Parser Interface" width="800">
</p>


## Overview

AI Resume Parser & Rewriter is a web application that helps job seekers optimize their resumes using artificial intelligence. Upload or paste your resume, and the AI provides intelligent enhancements for ATS compatibility, professional tone, and impactful language.

---

## Key Features

### Core Functionality
- 🧠 **AI-powered enhancement** for ATS compatibility
- 🎯 **Tone adjustment** for professional language
- ⚡ **Action verb enhancement** for stronger impact
- 📄 **Real-time preview** (input → AI-rewritten output)
- 💾 **Download resume** in one click
- 📋 **Copy to clipboard** functionality

### File Management
- 📤 **File upload** - PDF, DOCX, TXT support
- 📝 **Text input** - Direct paste functionality
- 🔄 **Reset function** - Return to template
- 📊 **Character counter** - Track resume length

### User Experience
- 🎨 **Modern UI** with clean typography
- 📱 **Fully responsive** - Desktop and tablet optimized
- ⚡ **Loading states** - Visual feedback
- 🎯 **Error handling** - Comprehensive error management
- 🖨️ **Print optimization** - Clean print layout

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS + shadcn/ui
- Radix UI + Lucide Icons
- React Hooks

**AI Integration**
- Google Genkit
- Gemini 2.5 Flash

**Backend**
- Node.js Express (separate backend)
- MongoDB (optional, for data persistence)
- File processing (PDF, DOCX, TXT)

**Deployment**
- Frontend: Vercel
- Backend: Render

---

## Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- Google AI API Key ([Get free key](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser

# Install dependencies (with legacy-peer-deps for React 19 compatibility)
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env.local
# Edit .env.local and add your Google AI API key:
# GOOGLE_GENAI_API_KEY=your_api_key_here

# Run development server
npm run dev
```

Open http://localhost:3000

### Backend Setup (Optional)

The backend is optional - the app works in demo mode without it.

```bash
cd backend

# Install backend dependencies
npm install

# Set up environment (optional)
cp .env.example .env
# Add MongoDB URI if you want data persistence:
# MONGODB_URI=your_mongodb_connection_string

# Run backend server
npm run dev
```

Backend runs on http://localhost:5000

---

## Project Structure

```
AI-Resume-Parser/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main page
│   │   ├── layout.tsx             # Root layout
│   │   ├── api/                   # API routes
│   │   │   ├── extract-text/      # Text extraction from files
│   │   │   └── health/            # Health check
│   │   ├── cover-letter/          # Cover letter page
│   │   ├── dashboard/             # Dashboard page
│   │   └── globals.css
│   ├── ai/
│   │   ├── genkit.ts              # Genkit configuration
│   │   └── flows/                 # AI flows
│   │       ├── tone-adjustment.ts
│   │       ├── action-verb-enhancement.ts
│   │       ├── optimize-for-ats.ts
│   │       └── cover-letter-generation.ts
│   ├── components/
│   │   ├── resume-editor.tsx      # Main editor
│   │   ├── file-upload.tsx        # Upload handler
│   │   ├── resume-preview.tsx     # Resume preview
│   │   ├── BackendStatusBadge.tsx # Backend status indicator
│   │   └── ui/                    # shadcn/ui components
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   └── types/
│       └── resume.ts              # TypeScript types
├── backend/                        # Express API (optional)
│   ├── src/
│   │   ├── server.js              # Main server
│   │   ├── db/                    # Database connection
│   │   ├── middleware/            # Express middleware
│   │   ├── models/                # MongoDB models
│   │   ├── routes/                # API routes
│   │   └── utils/                 # Utilities
│   └── package.json
├── .env.example
└── README.md
```

---

## Environment Variables

```env
# .env.local

# Google AI API Key (REQUIRED)
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here

# Backend API URL (Required for backend integration)
NEXT_PUBLIC_API_URL=http://localhost:5000

# MongoDB (Optional - for data persistence)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Development
NODE_ENV=development
```

**Getting Your API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Get API Key"
4. Create new API key
5. Copy and paste into `.env.local`

---

## API Endpoints (Backend)

### Resume Parsing
**POST** `/api/parse`
- Upload and parse resume files
- Supports: PDF, DOCX, TXT
- Max size: 5MB

**Request:**
```bash
curl -X POST http://localhost:5000/api/parse \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "experience": [...],
    "education": [...],
    "skills": [...]
  }
}
```

### AI Enhancement
**POST** `/api/enhance`
- AI-powered resume rewriting
- Tone adjustment
- Action verb optimization

---

## How It Works

### AI Enhancement Process

1. **Input:** User uploads resume or pastes text
2. **Parsing:** Extract structured data from resume
3. **AI Analysis:** Send to Google Gemini for enhancement
4. **Optimization:** 
   - ATS keyword optimization
   - Professional tone adjustment
   - Action verb strengthening
5. **Output:** Display enhanced resume with improvements
6. **Export:** Download or copy optimized version

### Supported Enhancements

- **ATS Optimization:** Keyword placement, formatting
- **Tone Adjustment:** Professional language, clarity
- **Action Verbs:** Stronger, more impactful verbs
- **Structure:** Improved organization and flow

---

## Features Status

✅ **Currently Working:**
- Resume file upload (PDF, DOCX, TXT)
- Text paste functionality
- AI-powered tone adjustment
- AI-powered action verb enhancement
- ATS optimization
- Cover letter generation
- Real-time preview
- Download functionality
- Copy to clipboard
- Responsive design
- Backend status monitoring
- Demo mode (works without backend)

📅 **Future Enhancements:**
- User accounts and authentication
- Resume templates library
- Version history tracking
- Advanced analytics dashboard
- Resume scoring system
- Job-specific optimization
- LinkedIn profile optimization
- Multi-language support

---

## Development Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Lint code
npm run typecheck    # TypeScript check
```

---

## Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `GOOGLE_GENAI_API_KEY`
   - `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy automatically

### Render (Backend - Optional)

1. Create web service
2. Connect GitHub repository
3. Set environment variables:
   - `GOOGLE_GEMINI_API_KEY` (or `GOOGLE_AI_API_KEY`)
   - `MONGODB_URI` (optional)
   - `CORS_WHITELIST` (your frontend URL)
4. Deploy

---

## Troubleshooting

### Installation Issues

**Problem:** `npm install` fails with peer dependency errors
```bash
# Solution: Use legacy-peer-deps flag
npm install --legacy-peer-deps
```

**Problem:** Build fails with "Module not found"
```bash
# Solution: Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Runtime Issues

**Problem:** Backend shows "Offline - Demo Mode"
- Check if backend is running on correct port (default: 5000)
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check backend health: `curl http://localhost:5000/health`

**Problem:** AI features not working
- Verify Google AI API key is set correctly
- Check API key has not expired
- Ensure API key is in `.env.local` (frontend) or `.env` (backend)
- Variable name: `GOOGLE_GENAI_API_KEY`

**Problem:** File upload fails
- Maximum file size is 5MB
- Supported formats: PDF, DOCX, TXT only
- Check file is not corrupted

**Problem:** PDF parsing errors
- Some PDFs may be scanned images - use OCR-enabled PDFs
- Try converting PDF to text first
- Use DOCX or TXT format as alternative

### Deployment Issues

**Problem:** Vercel build fails
- Check all dependencies are listed in `package.json`
- Verify environment variables are set in Vercel dashboard
- Build command should be: `npm run build`
- Check build logs for specific errors

**Problem:** Backend not responding on Render
- Free tier services sleep after inactivity
- First request may take 30-60 seconds to wake up
- Check service logs in Render dashboard
- Verify environment variables are set

**Problem:** CORS errors
- Add frontend URL to `CORS_WHITELIST` in backend environment
- Format: `https://your-app.vercel.app`
- Restart backend after environment variable changes

### Getting Help

- Check existing [GitHub Issues](https://github.com/unnita1235/AI-Resume-Parser/issues)
- Create a new issue with:
  - Error message
  - Steps to reproduce
  - Environment (OS, Node version, browser)
- Contact: unnita1235@gmail.com

---

## Performance

**Current Metrics:**
- Processing time: <2s per resume
- Supported formats: PDF, DOCX, TXT
- Max file size: 5MB
- AI response time: 1-3s

---

## Security

- API keys stored server-side only
- Input validation and sanitization
- Type-safe with TypeScript
- Secure file upload handling
- HTTPS enforced in production

---

## Known Limitations

- AI enhancement requires Google AI API key (free tier available)
- Processing time depends on resume length and AI response time
- Best results with well-formatted, text-based input
- Scanned PDFs (images) require OCR preprocessing
- Large resumes (>4000 chars) may need chunking for AI processing

---

## Future Enhancements

- Text chunking for large resumes (>4000 chars)
- Resume ATS score (percentage ranking)
- Multiple resume templates
- Job description keyword matching
- Interview preparation tips
- Export to multiple formats (DOCX, PDF)
- User authentication and saved resumes

---

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to fork
5. Open Pull Request

---

## License

MIT License - See [LICENSE](LICENSE)

---

## Deployment Status

✅ **Frontend:** Live on Vercel - https://ai-resume-parser-seven.vercel.app/
✅ **Backend:** Live on Render - https://ai-resume-parser-0cmr.onrender.com
✅ **Build:** Passing with Next.js 16 & React 19
✅ **Security:** All vulnerabilities patched (0 vulnerabilities)

---

## Author

**Unni T A**
- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com
- Portfolio: https://github.com/unnita1235

---

## Acknowledgments

- Next.js team
- Google Genkit
- Vercel
- shadcn/ui
- Tailwind CSS

---

**AI Resume Parser & Rewriter** - Helping Job Seekers Land Their Dream Jobs

*Note: This project demonstrates AI integration with Google Gemini for practical resume enhancement. The current deployment showcases full functionality with AI-powered optimization.*
