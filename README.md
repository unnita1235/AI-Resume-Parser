# AI Resume Parser & Rewriter

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ai-resume-parser-seven.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-blue)](https://nextjs.org)
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
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Radix UI + Lucide Icons
- React Hooks

**AI Integration**
- Google Genkit
- Gemini 2.5 Flash

**Backend**
- Next.js API Routes
- Node.js Express (separate backend)
- File processing APIs

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

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Google AI API key:
# GOOGLE_AI_API_KEY=your_api_key_here

# Run development server
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
AI-Resume-Parser/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page
│   │   ├── layout.tsx        # Root layout
│   │   ├── api/              # API routes
│   │   │   ├── parse/        # Resume parsing
│   │   │   └── enhance/      # AI enhancement
│   │   └── globals.css
│   ├── components/
│   │   ├── ResumeEditor.tsx  # Main editor
│   │   ├── FileUpload.tsx    # Upload handler
│   │   ├── PreviewPane.tsx   # Resume preview
│   │   └── ui/               # shadcn/ui
│   ├── lib/
│   │   ├── ai.ts             # AI integration
│   │   ├── parser.ts         # Parsing logic
│   │   └── utils.ts
│   └── types/
│       └── resume.ts
├── backend/                   # Express API (optional)
│   ├── app.py
│   └── requirements.txt
├── .env.example
└── README.md
```

---

## Environment Variables

```env
# .env.local

# Google AI API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Next.js Config
NEXT_PUBLIC_API_URL=http://localhost:3000

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
- AI-powered enhancement
- Real-time preview
- Download functionality
- Copy to clipboard
- Responsive design

🚧 **In Progress:**
- User accounts
- Resume templates
- Version history
- Advanced analytics

📅 **Planned:**
- Resume scoring system
- Job-specific optimization
- Cover letter generation
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
   - `GOOGLE_AI_API_KEY`
4. Deploy automatically

### Render (Backend - Optional)

1. Create web service
2. Connect GitHub repository
3. Set environment variables
4. Deploy

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
- Processing time depends on resume length
- Best results with well-formatted input
- Demo uses placeholder data when API unavailable

---

## Future Enhancements

- Resume ATS score (percentage ranking)
- Multiple resume templates
- Job description keyword matching
- Cover letter generation
- Interview preparation tips
- Export to multiple formats (DOCX, PDF)

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
