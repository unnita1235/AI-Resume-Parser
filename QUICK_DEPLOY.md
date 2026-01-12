# ⚡ Quick Deployment Checklist

> Complete deployment in 3 simple steps

---

## 🚀 Step 1: Get Your API Key (5 minutes)

```bash
1. Visit: https://aistudio.google.com/app/api-keys
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key
5. Save it somewhere safe (don't commit to git!)
```

---

## 📤 Step 2: Deploy Frontend to Vercel (2 minutes)

```bash
1. Go to: https://vercel.com
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Framework auto-detects as Next.js ✓
5. Set Environment Variables:
   - GOOGLE_GEMINI_API_KEY: [paste your key]
   - NEXT_PUBLIC_API_URL: https://your-backend.onrender.com
6. Click "Deploy"
7. Wait for build (1-2 minutes)
8. Get your frontend URL
```

**Expected**: https://your-project.vercel.app

---

## 🔧 Step 3: Deploy Backend to Render (3 minutes)

```bash
1. Go to: https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: ai-resume-parser-backend
   - Region: Singapore (or nearest)
   - Branch: main
   - Build: cd backend && npm install
   - Start: cd backend && npm start
5. Set Environment Variables:
   - GOOGLE_GEMINI_API_KEY: [paste your key]
   - CORS_WHITELIST: https://your-project.vercel.app
   - NODE_ENV: production
6. Click "Create Web Service"
7. Wait for deployment (3-5 minutes)
8. Get your backend URL (onrender.com)
```

**Expected**: https://your-backend.onrender.com

---

## ✅ Verification (After Deployment)

### Test Backend Health
```bash
curl https://your-backend.onrender.com/health
# Should return: { status: "healthy", ... }
```

### Test Frontend
1. Open https://your-project.vercel.app
2. Upload a resume (PDF/DOCX/TXT)
3. Click "Analyze for ATS"
4. Should see score and recommendations

### Check Logs
- **Vercel**: Deployments tab → Logs
- **Render**: Dashboard → Recent deploys → Logs

---

## 🔐 Important Security Notes

⚠️ **NEVER commit API keys to GitHub!**
- ✅ Use platform dashboard to set secrets
- ✅ Keep keys in environment variables only
- ✅ GitHub should only have .env.example (no real values)

---

## 📊 Success Indicators

✅ **Frontend**
- Page loads at vercel.app URL
- No 404 errors
- Components render correctly

✅ **Backend**
- Health endpoint returns 200
- CORS allows frontend requests
- File upload works

✅ **AI Integration**
- ATS analysis completes in <5 seconds
- Tone adjustment works
- File extraction successful

---

## 🆘 Troubleshooting

### Backend not connecting
```
→ Check NEXT_PUBLIC_API_URL in Vercel env
→ Verify CORS_WHITELIST on Render
→ Check logs for connection errors
```

### API key not working
```
→ Verify key is set in deployment platform
→ Confirm key has correct permissions
→ Try fresh API key from Google
```

### File upload fails
```
→ Check file size (max 5MB)
→ Verify file format (PDF/DOCX/TXT)
→ Check backend /health endpoint
```

### Slow responses
```
→ Free tier has rate limits
→ Vercel cold starts on first request
→ Render free tier has slower CPU
→ Consider upgrading for production
```

---

## 📞 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 503 Service Unavailable | Backend down | Check Render dashboard |
| CORS Error | Wrong frontend URL | Update CORS_WHITELIST |
| 401 Unauthorized | Invalid API key | Regenerate key, update env |
| 413 Payload Too Large | File >5MB | Compress resume file |
| 500 Internal Error | AI API failed | Check Google API quota |

---

## 🎯 Next Steps

1. **Monitor Live App**
   - Check error rates daily
   - Monitor API response times
   - Review user feedback

2. **Optimize Performance**
   - Enable Vercel Analytics
   - Monitor Render logs
   - Add caching if needed

3. **Maintain & Update**
   - Keep dependencies current
   - Monitor API rate limits
   - Backup user data

---

## 📚 More Information

- **Full guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Verification**: [DEPLOYMENT_READY.md](DEPLOYMENT_READY.md)
- **Troubleshooting**: [SETUP.md](SETUP.md)
- **Architecture**: [README.md](README.md)

---

## ⏱️ Timeline

| Step | Time | Total |
|------|------|-------|
| Get API Key | 5 min | 5 min |
| Deploy Frontend | 2 min + build (1-2 min) | 8-9 min |
| Deploy Backend | 3 min + deploy (3-5 min) | 14-17 min |
| Verify | 2 min | 16-19 min |

**Total time to production: ~20 minutes** ⚡

---

## 🎉 You're Done!

Your AI Resume Parser is now live! 🚀

- Frontend: https://your-project.vercel.app
- Backend: https://your-backend.onrender.com
- Share with friends and gather feedback!

---

**Last Updated**: January 12, 2026  
**Status**: Production Ready ✅
