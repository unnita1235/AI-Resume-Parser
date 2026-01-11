# Deployment Guide for AI Resume Parser

## Quick Start - Render Deployment

### Problem: Backend Sleeping on Free Tier

Your current Render free tier service sleeps after 15 minutes of inactivity, causing 30-50 second delays. This guide helps you fix it.

### Solution 1: Upgrade to Paid Plan (RECOMMENDED)
- **Cost**: $7/month (cheapest paid tier)
- - **Benefits**: No sleeping, always active, reliable
  - - **How**: Go to Render Dashboard → Settings → Upgrade Plan
   
    - ### Solution 2: Keep-Alive Mechanism (Free Tier)
    - If you want to stay on free tier, implement keep-alive:
   
    - #### Step 1: Update backend/src/server.js
   
    - Add this after the imports section:
   
    - ```javascript
      // ==================== KEEP-ALIVE FOR FREE TIER ====================
      if (process.env.KEEP_ALIVE_INTERVAL && process.env.NODE_ENV === 'production') {
        const keepAliveInterval = parseInt(process.env.KEEP_ALIVE_INTERVAL);
        setInterval(() => {
          try {
            const protocol = process.env.RENDER_EXTERNAL_URL ? 'https' : 'http';
            const host = process.env.RENDER_EXTERNAL_URL || `localhost:${PORT}`;
            fetch(`${protocol}://${host}/health`)
              .catch(() => console.log('Keep-alive ping sent'));
          } catch (err) {
            console.error('Keep-alive error:', err.message);
          }
        }, keepAliveInterval);
        console.log(`⏱️  Keep-alive enabled (${keepAliveInterval}ms interval)`);
      }
      ```

      #### Step 2: Set Environment Variables in Render

      Go to Render Dashboard → Environment and add:

      ```
      PORT=5000
      NODE_ENV=production
      DEMO_MODE=false
      MONGODB_URI=<your-mongodb-connection-string>
      GOOGLE_GEMINI_API_KEY=<your-api-key>
      MAX_FILE_SIZE=10485760
      UPLOAD_PATH=./uploads
      LOG_LEVEL=info
      KEEP_ALIVE_INTERVAL=25000
      ```

      #### Step 3: Verify Health Endpoint

      Test your health check works:
      ```bash
      curl https://<your-render-url>.onrender.com/health
      ```

      Expected response:
      ```json
      {
        "status": "healthy",
        "uptime": 1234,
        "mode": "production",
        "database": "connected",
        "version": "2.0.0"
      }
      ```

      ## MongoDB Atlas Setup

      1. Go to https://cloud.mongodb.com
      2. 2. Sign in / Create account
         3. 3. Create a free tier cluster (M0)
            4. 4. Click "Connect" and select "Connect your application"
               5. 5. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`
                  6. 6. Add to Render Environment as `MONGODB_URI`
                    
                     7. ## Google Gemini API Setup
                    
                     8. 1. Go to https://aistudio.google.com/app/api-keys
                        2. 2. Click "Create API Key"
                           3. 3. Select your project or create new
                              4. 4. Copy the API key
                                 5. 5. Add to Render Environment as `GOOGLE_GEMINI_API_KEY`
                                   
                                    6. ## Testing the Backend
                                   
                                    7. ### 1. Health Check
                                    8. ```bash
                                       curl https://<your-url>/health
                                       ```

                                       ### 2. Stats Endpoint
                                       ```bash
                                       curl https://<your-url>/api/stats
                                       ```

                                       ### 3. Demo Resumes (no auth needed)
                                       ```bash
                                       curl https://<your-url>/api/demo-resumes
                                       ```

                                       ## Troubleshooting

                                       ### "Backend unavailable" error on frontend
                                       - Check Render service is running (green status)
                                       - - Verify environment variables are set
                                         - - Check MongoDB connection string is correct
                                           - - Look at Render logs for errors
                                            
                                             - ### "MONGODB_URI not set" warning in logs
                                             - - Go to Render Environment tab
                                               - - Add/verify MONGODB_URI variable
                                                 - - Redeploy service
                                                  
                                                   - ### "GOOGLE_GEMINI_API_KEY not set" warning
                                                   - - Get API key from https://aistudio.google.com/app/api-keys
                                                     - - Add to Render Environment
                                                       - - Redeploy service
                                                         - - Parser will fall back to regex until API key is set
                                                          
                                                           - ### Slow responses (>5 seconds)
                                                           - - Likely free tier spindown happening
                                                             - - Consider upgrading to paid plan
                                                               - - Or ensure keep-alive interval is set to 25000ms
                                                                
                                                                 - ## Production Checklist
                                                                
                                                                 - - [ ] Backend running on Render (check status)
                                                                   - [ ] - [ ] MongoDB Atlas cluster created and connected
                                                                   - [ ] - [ ] Google Gemini API key obtained and configured
                                                                   - [ ] - [ ] Environment variables all set in Render
                                                                   - [ ] - [ ] Health endpoint responds within 2 seconds
                                                                   - [ ] - [ ] Demo resumes endpoint working
                                                                   - [ ] - [ ] Frontend successfully connects to backend
                                                                   - [ ] - [ ] Parse endpoint accepts file uploads
                                                                   - [ ] - [ ] Error handling working (try invalid file)
                                                                  
                                                                   - [ ] ## Performance Notes
                                                                  
                                                                   - [ ] - Free tier can handle ~100 concurrent requests
                                                                   - [ ] - File size limit: 10MB (configurable)
                                                                   - [ ] - Resume parsing: 2-5 seconds with Gemini API
                                                                   - [ ] - Demo mode parsing: <500ms (no API call)
                                                                  
                                                                   - [ ] ## Next Steps
                                                                  
                                                                   - [ ] 1. Monitor Render logs regularly
                                                                   - [ ] 2. Set up error tracking (optional: Sentry)
                                                                   - [ ] 3. Track usage with /api/stats endpoint
                                                                   - [ ] 4. Plan upgrade timeline if usage grows
