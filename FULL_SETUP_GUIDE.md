# 🚀 COMPLETE SETUP & DEPLOYMENT GUIDE

**AI Resume Parser - Full-Stack Application**  
**Status**: ✅ Production Ready  
**Last Updated**: January 16, 2026

---

## 📋 Table of Contents

1. [Quick Start (5 minutes)](#quick-start-5-minutes)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Testing & Validation](#testing--validation)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start (5 minutes)

### Option A: Just Deploy (No Local Setup)

```bash
# 1. Fork/Clone the repository
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser

# 2. Get your free Gemini API key
# Visit: https://aistudio.google.com/app/api-keys

# 3. Deploy Frontend to Vercel
# - Go to https://vercel.com/new
# - Import your GitHub repository
# - Add environment variable: GOOGLE_GEMINI_API_KEY
# - Click Deploy

# 4. Deploy Backend to Render
# - Go to https://dashboard.render.com
# - Create new Web Service
# - Connect your GitHub
# - Add render.yaml to deploy
# - Set environment variable: GOOGLE_GEMINI_API_KEY
```

### Option B: Run Locally

```bash
# 1. Clone repository
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser

# 2. Install dependencies
npm install
cd backend && npm install && cd ..

# 3. Create .env.local
cp .env.example .env.local
# Edit .env.local and add your GOOGLE_GEMINI_API_KEY

# 4. Start the app
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## Local Development Setup

### Prerequisites

- **Node.js** 18+ (check: `node --version`)
- **npm** 9+ (check: `npm --version`)
- **Git** (check: `git --version`)
- **Free Gemini API Key** from https://aistudio.google.com/app/api-keys
- **Optional**: MongoDB Atlas URI for database features

### Installation Steps

#### Step 1: Clone Repository

```bash
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser
```

#### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### Step 3: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the file with your values
# Windows: Open .env.local in notepad or your editor
# Mac/Linux: nano .env.local
```

#### Step 4: Configure Environment Variables

Edit `.env.local`:

```env
# REQUIRED - Get free key from https://aistudio.google.com/app/api-keys
GOOGLE_GEMINI_API_KEY=your_api_key_here

# Optional - Backend URL (auto-detected in development)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional - Gemini model selection
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash

# Optional - Node environment
NODE_ENV=development
```

---

## Environment Configuration

### Frontend Variables (.env.local)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_GEMINI_API_KEY` | ✅ Yes | - | Your Google Gemini API key |
| `GOOGLE_AI_API_KEY` | ❌ No | - | Alternative: Google AI API key |
| `NEXT_PUBLIC_API_URL` | ❌ No | `http://localhost:5000` | Backend API endpoint |
| `NEXT_PUBLIC_GEMINI_MODEL` | ❌ No | `gemini-1.5-flash` | Gemini model version |
| `NODE_ENV` | ❌ No | `development` | Environment: development/production |

### Backend Variables

For local dev: Add to `.env.local` file in root

For production (Render): Set in Render dashboard secrets

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_GEMINI_API_KEY` | ✅ Yes | - | Backend API key (same as frontend) |
| `MONGODB_URI` | ❌ No | - | MongoDB connection string (demo mode if empty) |
| `NODE_ENV` | ❌ No | `development` | Environment mode |
| `PORT` | ❌ No | `5000` | Server port |

---

## Running the Application

### Development Mode

#### Full Stack (Recommended)

```bash
npm run dev
```

This starts both frontend (port 3000) and backend (port 5000) simultaneously.

**Output**:
```
> npm run dev
▲ Next.js 15.0.0 at http://localhost:3000
✅ Express server at http://localhost:5000
```

#### Frontend Only

```bash
npx next dev
```

Opens: http://localhost:3000

#### Backend Only

```bash
cd backend
npm run dev
```

Server: http://localhost:5000

#### Genkit Flows (AI Testing)

```bash
npm run genkit:dev
```

Opens: http://localhost:4000/devui (Genkit test interface)

### Production Build

```bash
# Build frontend
npm run build

# Test production build
npm run preview

# Backend is Node.js - no build needed
```

---

## Testing & Validation

### Run All Tests

```bash
# Frontend + Backend tests
npm test

# Expected output: 5/5 tests passing
```

### Test Individual Endpoints

#### Test 1: Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "api": "operational",
      "fileProcessing": "operational",
      "ai": "operational"
    }
  }
}
```

#### Test 2: File Upload

```bash
# Create test file
echo "John Doe, Senior Developer, 10 years experience" > test.txt

# Upload
curl -X POST http://localhost:3000/api/extract-text \
  -F "file=@test.txt"
```

#### Test 3: ATS Optimization

```bash
curl -X POST http://localhost:3000/api/ai/ats-optimize \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Worked on various projects using JavaScript and React frameworks..."
  }'
```

#### Test 4: Tone Adjustment

```bash
curl -X POST http://localhost:3000/api/ai/tone-adjust \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I worked on stuff and made it better",
    "tone": "formal"
  }'
```

### UI Testing

1. Open http://localhost:3000
2. **Test File Upload**:
   - Click "Upload Resume"
   - Select PDF, DOCX, or TXT file
   - Verify text extraction works

3. **Test ATS Optimization**:
   - Enter resume text (or upload file)
   - Click "Optimize for ATS"
   - Verify score appears (0-100)

4. **Test Tone Adjustment**:
   - Enter text
   - Select tone (formal/casual)
   - Click "Adjust Tone"
   - Verify adjusted text appears

5. **Test Cover Letter Generation**:
   - Enter resume and job description
   - Click "Generate Cover Letter"
   - Verify cover letter appears

---

## Deployment Guide

### Deploy Frontend to Vercel

#### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

#### Step 3: Configure Environment

In Vercel Dashboard:

1. Click your project
2. Go to Settings → Environment Variables
3. Add:
   - Key: `GOOGLE_GEMINI_API_KEY`
   - Value: `your_api_key_here`
   - Select: Production, Preview, Development
4. Click Save

#### Step 4: Deploy

1. Go to Deployments tab
2. Select the latest commit
3. Click "Redeploy"
4. Wait for green checkmark ✅

**Your App**: `https://your-project.vercel.app`

### Deploy Backend to Render

#### Step 1: Create Service

1. Go to https://dashboard.render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub

#### Step 2: Configure

In Render:

1. **Name**: `ai-resume-parser-backend`
2. **Environment**: Node
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Plan**: Free (or Paid for production)

#### Step 3: Add Environment Variables

1. Go to Environment
2. Click "Add Environment Variable"
3. Add:
   - Key: `GOOGLE_GEMINI_API_KEY`
   - Value: `your_api_key_here`
4. Click Save

#### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for build to complete (3-5 minutes)

**Your Backend**: `https://your-backend-name.onrender.com`

#### Step 5: Update Frontend

Update Vercel environment variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
```

Redeploy frontend on Vercel.

### Deploy Using Docker

#### Docker Compose (Local)

```bash
# Start both services with Docker
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

#### Deploy to Cloud

```bash
# Build images
docker build -f Dockerfile -t myapp-frontend:latest .
docker build -f backend/Dockerfile -t myapp-backend:latest .

# Push to registry (Docker Hub, AWS ECR, etc.)
docker push myapp-frontend:latest
docker push myapp-backend:latest
```

---

## Troubleshooting

### Issue: "API key not configured"

**Solution**:
```bash
# 1. Verify .env.local exists
ls -la .env.local

# 2. Check API key is set
cat .env.local | grep GOOGLE_GEMINI_API_KEY

# 3. Restart dev server
# Stop: Ctrl+C
# Start: npm run dev
```

### Issue: "Failed to extract text"

**Solution**:
```bash
# 1. Verify backend is running
curl http://localhost:5000/health

# 2. Check file size (max 5MB)
# 3. Verify file format (PDF, DOCX, or TXT)
# 4. Check backend logs for errors
```

### Issue: "Cannot connect to MongoDB"

**Solution**:
```bash
# App works without MongoDB (demo mode)
# To use MongoDB:
# 1. Get MongoDB URI from mongodb.com
# 2. Add to .env.local: MONGODB_URI=your_uri
# 3. Restart backend
```

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Find process on port 3000
lsof -i :3000

# Kill process (Mac/Linux)
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Issue: "Module not found"

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# For backend
cd backend
rm -rf node_modules
npm install
```

### Issue: Tests Failing

**Solution**:
```bash
# Run tests with verbose output
npm test -- --reporter=verbose

# Run single test
npm test -- resume-parser.test.ts

# Update snapshots if needed
npm test -- -u
```

---

## Production Checklist

Before deploying to production:

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Environment variables set in deployment platform
- [ ] API key has sufficient quota
- [ ] CORS configured for your domain
- [ ] Database backups enabled (if using MongoDB)
- [ ] Error logging configured
- [ ] Health endpoint accessible
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured

---

## Project Structure

```
AI-Resume-Parser/
├── src/                          # Frontend (Next.js)
│   ├── app/                      # App Router pages
│   │   ├── api/                  # API routes
│   │   │   ├── ai/               # AI endpoints
│   │   │   ├── extract-text/     # File extraction
│   │   │   └── health/           # Health check
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main page
│   ├── components/               # React components
│   ├── lib/                      # Utilities & clients
│   │   ├── api-response.ts       # Response format
│   │   ├── geminiClient.ts       # Gemini API client
│   │   └── ai.ts                 # AI wrapper
│   └── __tests__/                # Tests
├── backend/                      # Backend (Express)
│   ├── src/
│   │   ├── server-v2.js          # Main server
│   │   ├── middleware/           # Middlewares
│   │   │   └── validate-request.js # Request validation
│   │   ├── routes/               # API routes
│   │   └── db/                   # Database
│   └── __tests__/                # Tests
├── .env.example                  # Environment template
├── package.json                  # Frontend dependencies
├── backend/package.json          # Backend dependencies
└── docker-compose.yml            # Docker setup
```

---

## Key Features

✅ **AI-Powered Resume Analysis**
- ATS compatibility scoring (0-100)
- Missing keywords identification
- Improvement recommendations
- Issue detection and solutions

✅ **Resume Enhancement**
- Tone adjustment (formal/casual)
- Action verb enhancement
- Automated cover letter generation
- Professional formatting

✅ **File Support**
- PDF parsing
- DOCX extraction
- Plain text support
- 5MB file size limit

✅ **Security**
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation

✅ **Scalability**
- MongoDB integration (optional)
- Connection pooling
- Error boundaries
- Comprehensive logging

---

## Support & Resources

- **API Documentation**: See routes in `src/app/api/`
- **Gemini API**: https://ai.google.dev
- **Next.js Docs**: https://nextjs.org
- **Express Docs**: https://expressjs.com
- **Repository**: https://github.com/unnita1235/AI-Resume-Parser

---

## Version History

- **v1.0.0** (Jan 16, 2026) - Production Release
  - Full-stack implementation complete
  - All features working
  - Deployment guides added
  - Comprehensive documentation

---

**🎉 Ready to deploy! Start with Option A (Quick Deploy) or Option B (Local Development).**

