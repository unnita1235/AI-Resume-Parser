# AI Resume Parser - Backend Deployment Guide

Complete guide to deploying the AI Resume Parser backend to production on Railway or Render with MongoDB Atlas.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Railway Deployment](#railway-deployment)
4. [Render Deployment](#render-deployment)
5. [Environment Variables](#environment-variables)
6. [Health Checks & Monitoring](#health-checks--monitoring)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with access to the repository
- ✅ Node.js 16+ (for local development/testing)
- ✅ A free tier account on either Railway or Render
- ✅ A free tier MongoDB Atlas account

---

## MongoDB Atlas Setup

MongoDB Atlas provides a free tier database perfect for testing. Here's how to set it up:

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Verify your email

### Step 2: Create a Cluster

1. After login, click "Create" to build a new cluster
2. Select **M0 Sandbox** (free tier)
3. Choose your preferred region (closest to your server)
4. Click "Create Cluster" (takes 2-3 minutes)

### Step 3: Create Database User

1. In the MongoDB Atlas dashboard, go to **Security** → **Database Access**
2. Click "Add New Database User"
3. Choose **Password** as the authentication method
4. Enter username: `admin`
5. Generate a secure password (copy this, you'll need it)
6. Click "Add User"

### Step 4: Configure Network Access

1. Go to **Security** → **Network Access**
2. Click "Add IP Address"
3. For testing/development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IPs (Railway/Render will provide)
5. Click "Confirm"

### Step 5: Get Connection String

1. Go to **Databases** → Click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string
5. Replace `<username>` with `admin` and `<password>` with your password
6. Replace `myFirstDatabase` with `resume-parser`

**Example:**
```
mongodb+srv://admin:yourPassword123@cluster0.abc123.mongodb.net/resume-parser?retryWrites=true&w=majority
```

---

## Railway Deployment

Railway offers simple deployment with automatic scaling.

### Step 1: Push to GitHub

Ensure your code is pushed to the feature branch:

```bash
cd /home/user/AI-Resume-Parser
git add .
git commit -m "feat: add backend improvements with health checks and demo mode"
git push -u origin claude/fix-resume-parser-backend-jd7eN
```

### Step 2: Connect Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)
3. Authorize Railway to access your repositories

### Step 3: Create New Project

1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Select your forked repository: `AI-Resume-Parser`
4. Choose the branch: `claude/fix-resume-parser-backend-jd7eN`
5. Select the `/backend` directory as the root

### Step 4: Configure Environment Variables

1. In your Railway project dashboard, click "Variables"
2. Add the following environment variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB connection string from Atlas |
| `CORS_ORIGINS` | Your frontend domain (e.g., `https://yourdomain.com`) |
| `MAX_FILE_SIZE` | `10485760` |
| `UPLOAD_PATH` | `./uploads` |

### Step 5: Deploy

1. Railway auto-deploys when you push to the branch
2. Check the "Deployments" tab for status
3. Get your deployment URL from the "Settings" tab

### Step 6: Verify Deployment

Test your deployment:

```bash
curl https://your-railway-url/health
curl https://your-railway-url/api/stats
curl https://your-railway-url/api/demo-samples
```

---

## Render Deployment

Render is another excellent option with free tier services.

### Step 1: Push to GitHub

Same as Railway - push your code to the feature branch.

### Step 2: Connect Render Account

1. Go to [render.com](https://render.com)
2. Click "Sign up" and choose GitHub
3. Authorize Render to access your repositories

### Step 3: Create Web Service

1. Click "New +"
2. Select "Web Service"
3. Search for your repository: `AI-Resume-Parser`
4. Click "Connect"
5. Configure the following:

| Setting | Value |
|---------|-------|
| Name | `ai-resume-parser-backend` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Root Directory | `backend` |

### Step 4: Configure Environment Variables

1. Scroll down to "Environment Variables"
2. Add the same variables as Railway:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/resume-parser
CORS_ORIGINS=https://yourdomain.com
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will start deploying (check the "Logs" tab)
3. Once deployed, you'll get a URL like `https://ai-resume-parser-backend.onrender.com`

### Step 6: Verify Deployment

```bash
curl https://ai-resume-parser-backend.onrender.com/health
curl https://ai-resume-parser-backend.onrender.com/api/stats
```

**Note:** Free tier services on Render may sleep after 15 minutes of inactivity. Upgrade to "Starter" plan ($7/month) to keep your service always running.

---

## Environment Variables

### Required Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | - | MongoDB Atlas connection string |
| `NODE_ENV` | Yes | `development` | `production` or `development` |
| `PORT` | No | `5000` | Server port |

### Optional Variables

| Variable | Required | Default | Description |
| `CORS_ORIGINS` | No | `*` | Comma-separated allowed origins |
| `MAX_FILE_SIZE` | No | `10485760` | Max upload size in bytes |
| `UPLOAD_PATH` | No | `./uploads` | Directory for uploaded files |
| `LOG_LEVEL` | No | `info` | Logging level |

### Creating `.env` File (Local Development)

Copy the example and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/resume-parser
CORS_ORIGINS=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

---

## Health Checks & Monitoring

### Health Check Endpoint

All deployment platforms use the `/health` endpoint to monitor your service:

```bash
curl https://your-backend-url/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "uptime_seconds": 3600,
  "mode": "PRODUCTION",
  "database": {
    "connected": true,
    "error": null
  },
  "server": {
    "memory_usage_mb": 45,
    "node_version": "v18.16.0",
    "environment": "production"
  }
}
```

### Statistics Endpoint

Check parsing statistics:

```bash
curl https://your-backend-url/api/stats
```

**Response:**
```json
{
  "success": true,
  "mode": "PRODUCTION",
  "database_connected": true,
  "server_uptime_seconds": 3600,
  "parsed_in_session": 5,
  "total_parsed": 42,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Demo Mode Detection

If `MONGODB_URI` is not set, the server runs in **DEMO MODE**:
- Requests are processed normally
- Data is stored in memory only (not persisted)
- Perfect for testing without a database
- Status will show `"mode": "DEMO"`

---

## Testing

### Running Tests Locally

```bash
cd backend

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Files

Located in `backend/__tests__/`:

- **health.test.js** - Tests for `/health` endpoint
- **stats.test.js** - Tests for `/api/stats` endpoint
- **demo-samples.test.js** - Tests for `/api/demo-samples` endpoint
- **parse.test.js** - Tests for `/api/parse` endpoint and database operations

### Running Tests in CI/CD

Both Railway and Render can run tests as part of the build process. Add to your deployment config:

**Railway:**
```yaml
deploy:
  startCommand: npm test && npm start
```

**Render:**
```yaml
buildCommand: npm install && npm test
```

---

## API Endpoints

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check (for deployment monitoring) |
| GET | `/api/stats` | Resume parsing statistics |
| GET | `/api/demo-samples` | Sample resumes for demonstration |
| POST | `/api/parse` | Upload and parse a resume (PDF/DOC/DOCX) |
| GET | `/api/resumes` | Get all parsed resumes |
| GET | `/api/resumes/:id` | Get specific resume by ID |

### Example API Usage

**Upload and Parse Resume:**
```bash
curl -X POST \
  -F "file=@resume.pdf" \
  https://your-backend-url/api/parse
```

**Get All Resumes:**
```bash
curl https://your-backend-url/api/resumes
```

**Get Demo Samples:**
```bash
curl https://your-backend-url/api/demo-samples
```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error:** `❌ MongoDB Error: Authentication failed`

**Solution:**
- Verify username and password in `MONGODB_URI`
- Check IP whitelist in MongoDB Atlas (Network Access)
- Ensure the database name is correct
- Test connection string locally first

#### 2. Service Won't Stay Running (Render Free Tier)

**Problem:** Service goes to sleep after 15 minutes of inactivity

**Solution:**
- Upgrade to Render "Starter" plan ($7/month minimum)
- Or use Railway which has better free tier uptime
- Or implement a pinging service to keep it alive

#### 3. Port Already in Use

**Error:** `Error: listen EADDRINUSE :::5000`

**Solution:**
- Check if another service is using port 5000
- Kill the process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`
- Or change `PORT` environment variable

#### 4. CORS Errors in Frontend

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Set `CORS_ORIGINS` to your frontend domain
- Example: `CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`
- Restart the service after changing

#### 5. Health Check Failing

**Problem:** Deployment platform keeps restarting the service

**Solution:**
- Check `/health` endpoint: `curl https://your-backend-url/health`
- Check server logs for errors
- Verify MongoDB connection string
- Check memory usage (free tier has limits)

### Checking Logs

**Railway:**
1. Go to your project dashboard
2. Click "Deployments"
3. Click on the active deployment
4. View "Logs" tab

**Render:**
1. Go to your web service dashboard
2. Click "Logs"
3. View real-time logs

### Redeploying

**Railway:**
- Push a new commit to your branch
- Railway auto-redeploys

**Render:**
- Manual: Click "Deploy" button in dashboard
- Auto: Push new commit to the branch

---

## Production Best Practices

1. **Enable HTTPS**: Both Railway and Render provide free HTTPS
2. **Set NODE_ENV=production**: Optimizes performance
3. **Use strong MongoDB passwords**: At least 20 characters
4. **Monitor health checks**: Set up alerts in your deployment platform
5. **Regular backups**: MongoDB Atlas has automatic backups on paid plans
6. **Rate limiting**: Consider adding rate limiting middleware for public endpoints
7. **API documentation**: Document your API for frontend team

---

## Support & Resources

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Express.js Guide](https://expressjs.com)

---

**Last Updated:** 2024-01-15
**Backend Version:** 1.0.0
