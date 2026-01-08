# Deployment Guide

## Overview

This guide covers deploying the AI Resume Parser application with:
- **Frontend**: Vercel (recommended) or any Next.js host
- **Backend**: Render (recommended) or any Node.js host

---

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project settings:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)

### Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `GOOGLE_GENAI_API_KEY` | Your Gemini API key |
| `NEXT_PUBLIC_API_URL` | Your backend URL (after backend deployment) |

### Step 4: Deploy

Click **Deploy**. Vercel will automatically deploy on every push to `main`.

---

## Backend Deployment (Render)

### Step 1: Create Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository

### Step 2: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Name** | `ai-resume-parser-backend` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### Step 3: Add Environment Variables

| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `GOOGLE_GEMINI_API_KEY` | Your Gemini API key |
| `MONGODB_URI` | Your MongoDB connection string |
| `CORS_WHITELIST` | Your Vercel frontend URL |
| `MAX_FILE_SIZE` | `10485760` |

### Step 4: Deploy

Click **Create Web Service**. First deployment takes 5-10 minutes.

---

## Free Tier Considerations

### Render Free Tier Limitations

- Service sleeps after **15 minutes** of inactivity
- First request after sleep takes **30-50 seconds**
- Solution: Backend includes keep-alive mechanism (pings every 25 seconds)

### Upgrade Option

For production use, upgrade to Render Starter ($7/month):
- No sleeping
- Always responsive
- Better performance

---

## MongoDB Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free M0 cluster
3. Click **Connect** → **Connect your application**
4. Copy connection string
5. Add to Render environment as `MONGODB_URI`

> **Note**: Without MongoDB, resumes won't persist. The app works but data is lost on refresh.

---

## Post-Deployment Verification

### 1. Check Backend Health

```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123,
  "mode": "production",
  "database": "connected"
}
```

### 2. Check Frontend

1. Visit your Vercel URL
2. Status indicator should show green/connected
3. Try uploading a test resume

### 3. Check Keep-Alive

Monitor Render logs - you should see health check pings every 25 seconds.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend unavailable | Check Render service status |
| CORS errors | Add frontend URL to `CORS_WHITELIST` |
| AI not working | Verify `GOOGLE_GEMINI_API_KEY` |
| Data not saving | Configure `MONGODB_URI` |
| Slow first load | Normal for free tier (30-50s cold start) |

---

## Update Frontend After Backend Deploy

After deploying backend, update Vercel:

1. Copy your Render backend URL
2. Go to Vercel → Settings → Environment Variables
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Redeploy the frontend

---

## Quick Reference

### Commands

```bash
# Local development
npm run dev              # Frontend (port 3000)
cd backend && npm run dev # Backend (port 5000)

# Production build
npm run build            # Frontend
cd backend && npm start  # Backend
```

### URLs

| Service | Local | Production |
|---------|-------|------------|
| Frontend | http://localhost:3000 | https://your-app.vercel.app |
| Backend | http://localhost:5000 | https://your-api.onrender.com |
| Health Check | /health | /health |
