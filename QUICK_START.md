# ⚡ QUICK START REFERENCE

**AI Resume Parser - Production Ready**

---

## 🚀 Deploy in 15 Minutes

### Deploy Frontend (Vercel)
```bash
1. Go to https://vercel.com/new
2. Import repository
3. Add env: GOOGLE_GEMINI_API_KEY
4. Deploy
```

### Deploy Backend (Render)
```bash
1. Go to https://dashboard.render.com
2. Create Web Service
3. Select GitHub repo
4. Add env: GOOGLE_GEMINI_API_KEY
5. Deploy
```

### Update Frontend with Backend URL
```bash
In Vercel → Settings → Environment Variables
Add: NEXT_PUBLIC_API_URL = your-backend.onrender.com
Redeploy
```

---

## 🏃 Run Locally

```bash
# 1. Clone
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser

# 2. Install
npm install && cd backend && npm install && cd ..

# 3. Configure
cp .env.example .env.local
# Edit: Add GOOGLE_GEMINI_API_KEY

# 4. Run
npm run dev

# Opens:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## 📝 Get API Key (Free)

1. Visit https://aistudio.google.com/app/api-keys
2. Click "Create API Key"
3. Copy key
4. Add to `.env.local`: `GOOGLE_GEMINI_API_KEY=your_key`

---

## ✅ Verify Installation

```bash
# Health check
curl http://localhost:3000/api/health

# File upload
curl -X POST http://localhost:3000/api/extract-text \
  -F "file=@resume.pdf"

# ATS score
curl -X POST http://localhost:3000/api/ai/ats-optimize \
  -H "Content-Type: application/json" \
  -d '{"resumeText":"My resume..."}'
```

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| `FULL_SETUP_GUIDE.md` | Complete setup & deployment |
| `PRODUCTION_DEPLOYMENT_CHECKLIST.md` | Pre-deployment verification |
| `PROJECT_COMPLETION_SUMMARY.md` | What was built & status |
| `COMPLETE_AUDIT_REPORT.md` | Code quality analysis |

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| "API key not configured" | Add `GOOGLE_GEMINI_API_KEY` to `.env.local` |
| "File upload failed" | Check file size (< 5MB), format (PDF/DOCX/TXT) |
| "Port 3000 in use" | `PORT=3001 npm run dev` |
| "Backend not responding" | Verify `NEXT_PUBLIC_API_URL` in frontend |
| "Build error" | `rm -rf node_modules && npm install` |

---

## 💻 Environment Variables

```env
# REQUIRED
GOOGLE_GEMINI_API_KEY=your_key

# OPTIONAL
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash
NODE_ENV=development
```

---

## 🎯 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/extract-text` | POST | Upload & extract |
| `/api/ai/ats-optimize` | POST | ATS scoring |
| `/api/ai/tone-adjust` | POST | Tone adjustment |
| `/api/ai/action-verbs` | POST | Enhance verbs |
| `/api/ai/cover-letter` | POST | Generate letter |

---

## 📦 Project Structure

```
AI-Resume-Parser/
├── src/              # Frontend (Next.js)
├── backend/          # Backend (Express)
├── docs/             # Guides & docs
└── tests/            # Test files
```

---

## ⚙️ Configuration Files

- `next.config.ts` - Next.js config
- `tsconfig.json` - TypeScript config
- `vercel.json` - Vercel deployment
- `render.yaml` - Render deployment
- `docker-compose.yml` - Docker setup
- `.env.example` - Environment template

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests only
npm test -- src/

# Run backend tests only
cd backend && npm test

# Type check
npm run typecheck

# Build production
npm run build
```

---

## 🚀 Next Steps

1. **Get API Key** → https://aistudio.google.com/app/api-keys
2. **Choose Setup**:
   - Local: `npm run dev`
   - Deploy: Use FULL_SETUP_GUIDE.md
3. **Test Features** → Upload a resume file
4. **Deploy** → Follow PRODUCTION_DEPLOYMENT_CHECKLIST.md

---

## 📞 Need Help?

- **Setup**: See `FULL_SETUP_GUIDE.md`
- **Deployment**: See `PRODUCTION_DEPLOYMENT_CHECKLIST.md`
- **Issues**: See "Troubleshooting" section above
- **Code**: See `COMPLETE_AUDIT_REPORT.md`

---

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Date**: Jan 16, 2026

