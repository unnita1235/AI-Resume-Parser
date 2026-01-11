# Deployment Guide - AI Resume Parser

Complete guide for deploying the AI Resume Parser to free cloud services.

---

## Quick Start (2 Minutes)

1. **Backend → [Render.com](https://render.com)**
   - Connect GitHub repo
   - Set environment variables (see below)
   - Deploy

2. **Frontend → [Vercel](https://vercel.com)**
   - Import GitHub repo
   - Set `NEXT_PUBLIC_API_URL` to your Render backend URL
   - Deploy

---

## Backend Deployment (Render.com)

### Step 1: Create Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ai-resume-parser-backend`
   - **Region**: Singapore (or nearest)
   - **Branch**: `main`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### Step 3: Environment Variables
Add these in Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port |
| `GOOGLE_GEMINI_API_KEY` | `your-key` | [Get free key](https://aistudio.google.com/app/api-keys) |
| `MONGODB_URI` | `mongodb+srv://...` | [Get free cluster](https://cloud.mongodb.com) |
| `CORS_WHITELIST` | `https://your-frontend.vercel.app` | Frontend URL |
| `DEMO_MODE` | `false` | Set `true` for testing without API key |

### Step 4: Deploy
1. Click **Create Web Service**
2. Wait for deployment (3-5 minutes)
3. Test: `https://your-app.onrender.com/health`

---

## Frontend Deployment (Vercel)

### Step 1: Create Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import Project
1. Click **Add New** → **Project**
2. Import your GitHub repository
3. Framework: Next.js (auto-detected)

### Step 3: Environment Variables
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` |
| `GOOGLE_GENAI_API_KEY` | `your-key` |

### Step 4: Deploy
1. Click **Deploy**
2. Wait for build (1-2 minutes)
3. Access your site at the provided URL

---

## Database Setup (MongoDB Atlas)

### Step 1: Create Free Cluster
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up and create organization
3. Create **FREE** shared cluster

### Step 2: Configure Access
1. **Database Access** → Add user with password
2. **Network Access** → Add `0.0.0.0/0` (allow all IPs)

### Step 3: Get Connection String
1. Click **Connect** → **Connect your application**
2. Copy the connection string
3. Replace `<password>` with your password
4. Add to Render environment as `MONGODB_URI`

---

## API Key Setup (Google Gemini)

1. Go to [aistudio.google.com/app/api-keys](https://aistudio.google.com/app/api-keys)
2. Sign in with Google
3. Click **Create API Key**
4. Copy the key
5. Add to both:
   - Render: `GOOGLE_GEMINI_API_KEY`
   - Vercel: `GOOGLE_GENAI_API_KEY`

---

## Verification

After deployment, test these endpoints:

```bash
# Backend Health
curl https://your-backend.onrender.com/health

# AI Health
curl https://your-backend.onrender.com/api/ai/health

# Parse Demo
curl https://your-backend.onrender.com/api/demo-resumes
```

---

## Troubleshooting

### Backend not starting
- Check Render logs for errors
- Verify all environment variables are set
- Ensure `MONGODB_URI` is correct

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is running (check /health)
- Check CORS_WHITELIST includes your frontend URL

### AI features not working
- Verify `GOOGLE_GEMINI_API_KEY` is set
- Test with `/api/ai/health` endpoint
- Check you haven't exceeded free tier limits

### Render service sleeping
- Free tier sleeps after 15 min inactivity
- The keep-alive mechanism prevents this
- First request after sleep takes ~30 seconds

---

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Google Gemini API key obtained
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS whitelist includes frontend URL
- [ ] Health endpoint responding
- [ ] File upload working
- [ ] AI enhancement features working
