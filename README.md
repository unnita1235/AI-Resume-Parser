# AI Resume Parser & Rewriter

> AI-powered resume enhancement tool with real-time text optimization using Google Gemini AI.

**Status**: ✅ **PRODUCTION READY** - Fully Functional  
**Live Demo**: https://ai-resume-parser-seven.vercel.app

---

## 📸 What This Is

AI Resume Parser is a **fully functional web application** that uses Google Gemini AI to enhance resumes in real-time. It provides ATS optimization, professional tone adjustment, and action verb improvements.

**This project actually works!** Unlike prototypes, this is a complete, deployed application with real AI integration and active users.

---

## ✨ Features (All Working ✅)

### What Actually Works
- ✅ **AI Resume Enhancement** - Google Gemini 2.5 Flash integration
- ✅ **File Upload** - PDF, DOCX, TXT support
- ✅ **Real-time Editing** - Live text input and preview
- ✅ **ATS Optimization** - Improve resume for applicant tracking systems
- ✅ **Tone Adjustment** - Professional writing enhancement
- ✅ **Action Verbs** - Strengthen resume language
- ✅ **Download Resume** - Export enhanced resume
- ✅ **Copy to Clipboard** - Quick copy functionality
- ✅ **Responsive Design** - Works on all devices

### Current Limitations
- ⚠️ No database (works in memory only)
- ⚠️ No user accounts (single-session usage)
- ⚠️ No resume history

---

## 🛠️ Tech Stack

**Frontend**:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form

**AI Integration**:
- Google Genkit
- Google Gemini 2.5 Flash API
- Server Actions

**Deployment**:
- Vercel (Frontend)
- Vercel Edge Functions (AI processing)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google AI API Key ([Get free key](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone repository
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Google AI API key:
# GOOGLE_GENAI_API_KEY=your_api_key_here

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
AI-Resume-Parser/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main resume editor
│   │   ├── api/              # API routes
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── ResumeEditor.tsx  # Main editor component
│   │   ├── FileUpload.tsx    # File handling
│   │   └── ui/               # shadcn components
│   ├── lib/
│   │   ├── ai.ts             # AI integration
│   │   └── utils.ts          # Utilities
│   └── actions/
│       └── enhance.ts        # AI enhancement action
├── public/
│   └── screenshots/          # App screenshots
└── package.json
```

---

## 🤖 AI Capabilities

### Google Gemini Integration

**What the AI does**:
1. Analyzes resume text structure
2. Suggests ATS-friendly improvements
3. Enhances professional tone
4. Replaces weak verbs with action verbs
5. Improves clarity and impact

**API Usage**:
- Real API calls to Google Gemini
- Streaming responses for better UX
- Error handling for failed requests
- Rate limiting awareness

---

## 🎯 What This Project Proves

### Skills Demonstrated
- ✅ **Production AI Integration** - Real Google Gemini API usage
- ✅ **Full-Stack Next.js** - Server actions + client components
- ✅ **TypeScript** - Type-safe implementation
- ✅ **Modern React** - Hooks, context, best practices
- ✅ **File Processing** - PDF, DOCX text extraction
- ✅ **Deployed & Working** - Live production application
- ✅ **Error Handling** - Graceful failure management
- ✅ **Responsive Design** - Mobile-first approach

### What's Missing (Roadmap)
- 🚧 Backend database for resume storage
- 🚧 User authentication
- 🚧 Resume history tracking
- 🚧 PDF export with formatting
- 🚧 Multiple resume versions

---

## 🔧 Available Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run typecheck  # TypeScript checking
```

---

## 📝 How It Works

1. **User uploads resume** or pastes text
2. **File is processed** - Extract text from PDF/DOCX
3. **AI analyzes content** - Google Gemini processes text
4. **Suggestions displayed** - Real-time enhancement options
5. **User applies changes** - Update resume with improvements
6. **Download enhanced resume** - Export final version

---

## 🎨 UI Features

- **Split-pane editor** - Input on left, preview on right
- **Character counter** - Track resume length
- **Loading states** - Visual feedback during AI processing
- **Error messages** - Clear error communication
- **Mobile responsive** - Works on all screen sizes
- **Clean design** - Professional, minimal interface

---

## 📄 License

MIT License - Portfolio/Production Project

---

## 👤 Author

**Unni T A**  
Frontend Developer with AI Integration Experience

- GitHub: [@unnita1235](https://github.com/unnita1235)
- Email: unnita1235@gmail.com
- Portfolio: https://github.com/unnita1235

---

## 🙏 Acknowledgments

- Google Genkit team for AI framework
- Google Gemini for powerful AI model
- Next.js for excellent framework
- Vercel for seamless deployment
- shadcn/ui for component library

---

## 💡 Project Highlights

This is my **flagship project** - the only one in my portfolio that is:
- ✅ Fully functional and deployed
- ✅ Using real AI integration (not fake)
- ✅ Processing actual user data
- ✅ Handling errors gracefully
- ✅ Production-ready code quality

**This demonstrates I can**:
- Integrate complex AI APIs
- Build complete, working applications
- Deploy to production
- Handle real user interactions
- Write clean, maintainable code

---

## 🚀 Future Enhancements

### Phase 1 (Next Month)
- [ ] Add Express.js backend
- [ ] PostgreSQL database integration
- [ ] User authentication (JWT)
- [ ] Resume storage and history

### Phase 2 (2-3 Months)
- [ ] Multiple resume versions
- [ ] Custom templates
- [ ] PDF export with formatting
- [ ] Cover letter generation

### Phase 3 (Future)
- [ ] Job description matching
- [ ] LinkedIn profile optimization
- [ ] Interview preparation tips

---

**Status**: ✅ **PRODUCTION READY** - Fully working AI-powered application

*Last updated: January 2026*

---

**This is my only complete project. The others are frontend prototypes.**
