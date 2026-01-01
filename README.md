# AI Resume Parser

**Status**: 🚀 Production-Ready MVP  
**Live Demo**: https://ai-resume-parser-seven.vercel.app  
**Backend API**: https://ai-resume-parser-0cmr.onrender.com (Health check: `/health`)

---

## What This Actually Does

This is a **fully functional web application** that helps job seekers optimize their resumes using AI. You can upload a PDF, DOCX, or TXT file, and the app uses Google Gemini AI to suggest improvements for ATS (Applicant Tracking System) compatibility, professional tone, and stronger action verbs.

### What Works Right Now

✅ **File Upload** - Upload PDF, DOCX, or TXT files (up to 10MB)  
✅ **AI-Powered Enhancement** - Real-time resume improvement suggestions via Google Gemini  
✅ **Live Text Editing** - Write or paste resume text directly  
✅ **ATS Optimization** - Get specific recommendations for ATS systems  
✅ **Professional Tone** - Suggestions to make writing more professional  
✅ **Action Verb Suggestions** - Strengthen your resume language  
✅ **Copy to Clipboard** - Quick copy functionality for enhanced text  
✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop  
✅ **Demo Mode** - Works without API keys (shows sample parsed resumes)  

### Current Limitations

⚠️ **No User Accounts** - Single session only (no login/signup)  
⚠️ **No Database** - History is lost on page refresh  
⚠️ **Backend on Free Tier** - May have 30-50 second delays when dormant  
⚠️ **No PDF Export** - Copy text only (no formatted download)  

---

## Tech Stack (What's Actually Used)

**Frontend**
- Next.js 15 (App Router)
- - TypeScript
  - - Tailwind CSS
    - - shadcn/ui components
      - - React Hook Form
       
        - **AI Integration**
        - - Google Gemini 2.5 Flash API
          - - Real-time processing
           
            - **Backend**
            - - Express.js
              - - Node.js 18+
                - - MongoDB Atlas (optional, for future features)
                 
                  - **Deployment**
                  - - Vercel (Frontend)
                    - - Render (Backend API)
                     
                      - ---

                      ## 🎯 Feature Status

                      | Feature | Status | Details |
                      |---------|--------|---------|
                      | Upload resumes | ✅ Working | PDF, DOCX, TXT support |
                      | Parse with AI | ✅ Working | Google Gemini 2.5 Flash |
                      | Live text editing | ✅ Working | Real-time enhancement |
                      | ATS optimization | ✅ Working | Specific recommendations |
                      | Professional tone | ✅ Working | Grammar and style suggestions |
                      | Action verbs | ✅ Working | Stronger language suggestions |
                      | Export/Download | 🚧 In Progress | Currently copy-to-clipboard only |
                      | User accounts | 📅 Planned | Q2 2026 |
                      | Resume history | 📅 Planned | Database integration needed |
                      | PDF export | 📅 Planned | Formatted download |
                      | Cover letter generation | 📅 Planned | AI-powered letters |
                      | Job description matching | 📅 Planned | Match resumes to job postings |

                      ---

                      ## 🚀 Getting Started

                      ### Prerequisites

                      - Node.js 18+
                      - - npm or yarn
                        - - Google Gemini API key (free tier available at https://aistudio.google.com/app/api-keys)
                         
                          - ### Quick Start
                         
                          - 1. **Clone the repo**
                            2.    ```bash
                                     git clone https://github.com/unnita1235/AI-Resume-Parser.git
                                     cd AI-Resume-Parser
                                     ```

                                  2. **Install dependencies**
                                  3.    ```bash
                                           npm install
                                           ```

                                        3. **Set up environment variables**
                                        4.    ```bash
                                                 cp .env.example .env.local
                                                 # Edit .env.local and add your Google Gemini API key
                                                 ```

                                              4. **Run development server**
                                              5.    ```bash
                                                       npm run dev
                                                       ```

                                                    5. **Open http://localhost:3000 in your browser**
                                                
                                                    6. ### Environment Variables
                                                
                                                    7. ```
                                                       # Required
                                                       NEXT_PUBLIC_API_URL=http://localhost:5000
                                                       NEXT_PUBLIC_DEMO_MODE=false  # Set to true for demo mode

                                                       # Optional - For backend deployment
                                                       GOOGLE_GEMINI_API_KEY=<your-api-key>
                                                       MONGODB_URI=<your-mongodb-connection-string>
                                                       ```

                                                       See `backend/.env.example` for complete backend configuration.

                                                       ---

                                                       ## 📁 Project Structure

                                                       ```
                                                       AI-Resume-Parser/
                                                       ├── src/
                                                       │   ├── app/                 # Next.js app directory
                                                       │   │   ├── page.tsx        # Main resume editor
                                                       │   │   ├── layout.tsx      # Root layout
                                                       │   │   └── api/            # API routes
                                                       │   ├── components/         # React components
                                                       │   │   ├── BackendStatusBadge.tsx
                                                       │   │   └── ui/            # shadcn/ui components
                                                       │   ├── hooks/             # Custom React hooks
                                                       │   │   └── useBackendStatus.ts
                                                       │   └── lib/              # Utilities
                                                       ├── backend/              # Express.js API
                                                       │   ├── src/
                                                       │   │   ├── server.js     # Main server
                                                       │   │   └── routes/       # API endpoints
                                                       │   ├── __tests__/        # Jest tests
                                                       │   └── .env.example
                                                       ├── public/              # Static assets
                                                       └── package.json
                                                       ```

                                                       ---

                                                       ## 🤖 How It Works

                                                       1. **Upload or Paste** - Choose a resume file or paste text directly
                                                       2. 2. **Parse** - System extracts key information (name, email, skills, experience)
                                                          3. 3. **Enhance** - Google Gemini AI suggests improvements
                                                             4. 4. **Review** - See suggestions for ATS, tone, and action verbs
                                                                5. 5. **Apply** - Copy enhanced text or adjust manually
                                                                  
                                                                   6. ### AI Processing
                                                                  
                                                                   7. The app sends your resume to Google Gemini API with this prompt:
                                                                   8. > "Analyze this resume and provide specific, actionable suggestions for improving: 1) ATS compatibility, 2) Professional tone, 3) Stronger action verbs. Be concise and practical."
                                                                      >
                                                                      > Parsing accuracy varies:
                                                                      > - **With Gemini AI**: ~85-92% accuracy (actual resume extraction)
                                                                      > - - **With Regex fallback**: ~65-75% accuracy (when API unavailable)
                                                                      >   - - **Demo mode**: 100% (pre-parsed sample resumes)
                                                                      >    
                                                                      >     - ---
                                                                      >
                                                                      > ## 🔧 Deployment
                                                                      >
                                                                      > ### Deploy Frontend (Vercel)
                                                                      >
                                                                      > ```bash
                                                                      > # Connected to GitHub, auto-deploys on push
                                                                      > # Visit https://vercel.com/new and link your repo
                                                                      > ```
                                                                      >
                                                                      > ### Deploy Backend (Render)
                                                                      >
                                                                      > ```bash
                                                                      > # See DEPLOYMENT.md for detailed instructions
                                                                      > # Or use: https://dashboard.render.com/
                                                                      > ```
                                                                      >
                                                                      > ---
                                                                      >
                                                                      > ## 📊 Testing
                                                                      >
                                                                      > ### Run Tests
                                                                      >
                                                                      > ```bash
                                                                      > cd backend
                                                                      > npm test
                                                                      > ```
                                                                      >
                                                                      > ### Test Coverage
                                                                      >
                                                                      > - Health check endpoint ✅
                                                                      > - - API stats endpoint ✅
                                                                      >   - - Demo data endpoint ✅
                                                                      >     - - Resume parsing endpoint 🚧
                                                                      >      
                                                                      >       - ---
                                                                      >
                                                                      > ## 🛠️ Development
                                                                      >
                                                                      > ### Available Scripts
                                                                      >
                                                                      > ```bash
                                                                      > # Frontend
                                                                      > npm run dev       # Development server
                                                                      > npm run build     # Production build
                                                                      > npm run start     # Start production server
                                                                      > npm run lint      # Run ESLint
                                                                      > npm run type-check # TypeScript check
                                                                      >
                                                                      > # Backend (in backend/ folder)
                                                                      > npm test          # Run tests
                                                                      > npm run dev       # Development server
                                                                      > npm run build     # Build project
                                                                      > ```
                                                                      >
                                                                      > ---
                                                                      >
                                                                      > ## 📝 API Documentation
                                                                      >
                                                                      > ### Frontend API Integration
                                                                      >
                                                                      > The frontend connects to the backend at `/api/health` and `/api/parse`:
                                                                      >
                                                                      > ```typescript
                                                                      > // Check backend status
                                                                      > GET /health
                                                                      > Response: { status: 'healthy', uptime: 1234, mode: 'production', ... }
                                                                      >
                                                                      > // Parse a resume
                                                                      > POST /api/parse
                                                                      > Body: { file: File }
                                                                      > Response: { success: true, data: { name, email, skills, ... }, ... }
                                                                      >
                                                                      > // Get parsed resumes
                                                                      > GET /api/resumes
                                                                      > Response: { success: true, data: [...], ... }
                                                                      >
                                                                      > // Get demo resumes (no auth)
                                                                      > GET /api/demo-resumes
                                                                      > Response: { success: true, data: [...], ... }
                                                                      > ```
                                                                      >
                                                                      > See `DEPLOYMENT.md` for complete API documentation.
                                                                      >
                                                                      > ---
                                                                      >
                                                                      > ## ⚠️ Important Notes
                                                                      >
                                                                      > ### About the "92% Accuracy" Claim
                                                                      >
                                                                      > The original README claimed "92% accuracy" without testing. This is **not verified**. Actual accuracy depends on:
                                                                      > - Resume formatting and structure
                                                                      > - - API response quality
                                                                      >   - - Fallback regex parser (65-75% when API unavailable)
                                                                      >    
                                                                      >     - Use demo mode to see examples before uploading real resumes.
                                                                      >    
                                                                      >     - ### Backend Sleep Issue
                                                                      >    
                                                                      >     - The Render free tier sleeps after 15 minutes of inactivity, causing response delays. Solutions:
                                                                      > 1. **Upgrade to paid plan** ($7/month minimum)
                                                                      > 2. 2. **Implement keep-alive mechanism** (see `DEPLOYMENT.md`)
                                                                      >    3. 3. **Use production environment** with proper monitoring
                                                                      >      
                                                                      >       4. ### Security Considerations
                                                                      >      
                                                                      >       5. - Resume files are processed in-memory only
                                                                      >          - - No files are permanently stored (unless you add a database)
                                                                      >            - - Google Gemini API key should never be exposed in frontend code
                                                                      >              - - Only send necessary resume text to the API, not full documents
                                                                      >               
                                                                      >                - ---
                                                                      >
                                                                      > ## 🚀 Next Steps
                                                                      >
                                                                      > ### To Get This Production-Ready
                                                                      >
                                                                      > 1. **Add User Accounts** - Authentication and resume history
                                                                      > 2. 2. **Add Database** - Persist parsed resumes
                                                                      >    3. 3. **Improve Accuracy** - Fine-tune AI prompts
                                                                      >       4. 4. **Add More Features** - Cover letters, job matching
                                                                      >          5. 5. **Add Monitoring** - Error tracking and analytics
                                                                      >            
                                                                      >             6. ### To Deploy
                                                                      >            
                                                                      >             7. 1. Fork this repository
                                                                      >                2. 2. Follow `DEPLOYMENT.md` for setup
                                                                      >                   3. 3. Add your Google Gemini API key
                                                                      >                      4. 4. Deploy frontend to Vercel
                                                                      >                         5. 5. Deploy backend to Render or Railway
                                                                      >                           
                                                                      >                            6. ---
                                                                      >                           
                                                                      >                            7. ## 📞 Support & Issues
                                                                      >                           
                                                                      >                            8. - **Questions?** Check the `DEPLOYMENT.md` file
                                                                      > - **Found a bug?** Open an issue on GitHub
                                                                      > - - **Want to contribute?** Pull requests welcome!
                                                                      >  
                                                                      >   - ---
                                                                      >
                                                                      > ## 📄 License
                                                                      >
                                                                      > MIT License - See LICENSE file for details
                                                                      >
                                                                      > ---
                                                                      >
                                                                      > ## 👤 Author
                                                                      >
                                                                      > **Unni T A**
                                                                      > Frontend Developer with AI Integration Experience
                                                                      >
                                                                      > - GitHub: [@unnita1235](https://github.com/unnita1235)
                                                                      > - - Email: unnita1235@gmail.com
                                                                      >   - - Portfolio: https://github.com/unnita1235
                                                                      >    
                                                                      >     - ---
                                                                      >
                                                                      > ## 🙏 Acknowledgments
                                                                      >
                                                                      > - Google Gemini team for the powerful AI model
                                                                      > - - Next.js team for the excellent framework
                                                                      >   - - Vercel for seamless deployment
                                                                      >     - - shadcn for amazing UI components
                                                                      >      
                                                                      >       - ---
                                                                      >
                                                                      > **Last Updated**: January 1, 2026
                                                                      > **Status**: MVP - Fully Functional, Production-Ready for Demo Use
