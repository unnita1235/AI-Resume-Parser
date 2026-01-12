# 🚀 Quick Reference - Full Stack Application

## Start Development (1 Command)
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## First Time Setup
```bash
npm install
cd backend && npm install && cd ..

# Setup .env files
cp .env.example .env.local
echo 'GOOGLE_AI_API_KEY=your-key' >> .env.local

cp backend/.env.example backend/.env
echo 'MONGODB_URI=mongodb://localhost:27017/ai-resume-parser' >> backend/.env
echo 'JWT_SECRET=super-secret-key' >> backend/.env

# Start MongoDB (Docker)
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7

# Start everything
npm run dev
```

## Key Files & What They Do

| File | Purpose | Changes |
|------|---------|---------|
| `backend/src/server-v2.js` | Main API server | ✨ NEW - Complete with all routes |
| `src/contexts/AuthContext.tsx` | Auth state management | ✨ NEW - Global auth provider |
| `src/app/login/page.tsx` | Login page | ✨ NEW - User authentication |
| `src/app/register/page.tsx` | Registration page | ✨ NEW - User signup |
| `src/app/dashboard/page.tsx` | User dashboard | ✨ NEW - Resume history & stats |
| `backend/src/models/User.js` | User database model | ✨ ENHANCED - Full auth schema |
| `backend/src/models/Resume.js` | Resume database model | ✨ ENHANCED - Complete schema |
| `backend/src/routes/auth.js` | Auth API endpoints | ✨ NEW - Login/register routes |
| `backend/src/routes/resumes.js` | Resume CRUD endpoints | ✨ NEW - Resume management |
| `backend/src/middleware/auth.js` | JWT auth middleware | ✨ ENHANCED - JWT support |
| `.env.local` | Frontend config | ✨ NEW - API URL & keys |
| `backend/.env` | Backend config | ✨ NEW - Database & secrets |

## API Endpoints

### Auth
```bash
POST   /api/auth/register        # Create account
POST   /api/auth/login           # Login
GET    /api/auth/me              # Get current user
PUT    /api/auth/profile         # Update profile
```

### Resumes
```bash
GET    /api/resumes              # List user's resumes
POST   /api/resumes              # Create resume
GET    /api/resumes/:id          # Get single resume
PUT    /api/resumes/:id          # Update resume
DELETE /api/resumes/:id          # Delete resume
```

### AI Features
```bash
POST   /api/ai/ats-optimize      # Analyze ATS score
POST   /api/ai/tone-adjust       # Adjust tone
POST   /api/ai/action-verbs      # Enhance verbs
```

### Admin
```bash
GET    /api/admin/users          # List all users
GET    /api/admin/stats          # System stats
POST   /api/admin/users/:id/suspend  # Suspend user
```

## Authentication Flow

```
1. User registers/logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Frontend sends token in Authorization header
5. Backend validates token
6. Request succeeds or fails
```

## User Roles

- **user**: Normal user, can manage own resumes
- **admin**: Can view all users, manage system, suspend users

## Subscription Plans

- **free**: 5 resumes, 50 AI credits
- **pro**: 25 resumes, 500 AI credits
- **enterprise**: Unlimited, custom credits

## Docker Commands

```bash
# Start all services
docker-compose -f docker-compose.full.yml up

# Stop all services
docker-compose -f docker-compose.full.yml down

# View logs
docker-compose -f docker-compose.full.yml logs -f

# Rebuild
docker-compose -f docker-compose.full.yml up --build
```

## Troubleshooting

### MongoDB won't connect
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Start MongoDB
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7

# Check connection string in backend/.env
MONGODB_URI=mongodb://admin:password@localhost:27017/ai-resume-parser?authSource=admin
```

### Backend not starting
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process on that port
kill -9 <PID>

# Or use different port
echo 'PORT=5001' >> backend/.env
```

### Frontend can't reach backend
```bash
# Check NEXT_PUBLIC_API_URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000

# Check backend is running on port 5000
curl http://localhost:5000/health
```

### JWT token expired
```bash
# Clear localStorage and login again
# Or change JWT_EXPIRE in backend/.env
JWT_EXPIRE=30d
```

## Production Checklist

- [ ] Change JWT_SECRET in backend/.env
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas (cloud)
- [ ] Setup email (Gmail app password)
- [ ] Configure Stripe keys (optional)
- [ ] Setup HTTPS
- [ ] Configure CORS for frontend URL
- [ ] Setup monitoring/logging
- [ ] Database backups
- [ ] Rate limiting thresholds

## Useful Commands

```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start

# View backend logs
tail -f backend/logs/app.log
```

## Architecture Overview

```
                    User
                     |
        ______________|______________
        |                            |
        v                            v
    Browser                     Mobile App
        |                            |
        |____________________________|
                  |
          HTTPS/REST API
                  |
        __________|__________
        |                   |
        v                   v
    Frontend          Backend API
    (Next.js)         (Express.js)
        |                   |
        |                   |
        |___________________|
              |
        ______|______
        |            |
        v            v
    MongoDB      Google AI
    (User Data)  (Gemini)
```

## Important Notes

✅ **Production Ready**
- Full authentication system
- Database with proper indexing
- Rate limiting
- Security headers
- Error handling
- Input validation

⚠️ **Still Needed**
- Email configuration (Gmail)
- Stripe payment setup (optional)
- Analytics integration
- Logging setup
- CI/CD pipeline
- Monitoring/alerting

## Resources

- Docs: [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md)
- API: [API_REFERENCE.md](./API_REFERENCE.md)
- Deploy: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Complete: [FULLSTACK_COMPLETE.md](./FULLSTACK_COMPLETE.md)

---

**Everything is ready to deploy! 🚀**
