# AI Resume Parser - Full Stack Application Setup

This is a complete full-stack application with authentication, database, API, and user management.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                    │
│  ├─ Login / Register Pages                                  │
│  ├─ Dashboard (Resume History, Stats)                       │
│  ├─ Editor (AI-powered Resume Editor)                       │
│  ├─ Profile Management                                      │
│  └─ Admin Panel                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Express)                     │
│  ├─ Authentication Routes (JWT)                             │
│  ├─ Resume Management APIs                                  │
│  ├─ AI Enhancement Routes (Gemini)                          │
│  ├─ Admin Routes                                            │
│  └─ Middleware (Auth, Rate Limiting, Logging)              │
└─────────────────────────────────────────────────────────────┘
       ↓                           ↓                    ↓
   ┌──────────────┐        ┌──────────────┐    ┌───────────────┐
   │   MongoDB    │        │  Google AI   │    │    Stripe     │
   │   Database   │        │   (Gemini)   │    │  (Payments)   │
   └──────────────┘        └──────────────┘    └───────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- Google Gemini API Key
- (Optional) Gmail App Password for emails

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies  
cd backend
npm install
cd ..
```

### 2. Configure Environment

Copy the template files:
```bash
cp .env.example .env.local
cp backend/.env.example backend/.env.local
```

Edit `.env.local` and `backend/.env`:
```env
# .env.local
GOOGLE_AI_API_KEY=your-api-key-here
NEXT_PUBLIC_API_URL=http://localhost:5000

# backend/.env
MONGODB_URI=mongodb://localhost:27017/ai-resume-parser
JWT_SECRET=your-very-secret-key-here
GOOGLE_AI_API_KEY=your-api-key-here
```

### 3. Start MongoDB

```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7

# Or with local MongoDB
mongod
```

### 4. Run Development Server

```bash
# This starts both frontend (port 3000) and backend (port 5000)
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Login**: Use the register page to create an account

## 📋 Features Implemented

### Authentication & User Management
- ✅ User registration and login (JWT-based)
- ✅ Email verification (optional)
- ✅ Password reset flow
- ✅ User profiles with avatar support
- ✅ Role-based access control (user/admin)

### Resume Management
- ✅ Upload and parse resumes (PDF/DOCX/TXT)
- ✅ Resume history and storage
- ✅ Edit and delete resumes
- ✅ Search and filter resumes
- ✅ Resume versioning

### AI Features
- ✅ ATS optimization analysis
- ✅ Tone adjustment (formal/casual)
- ✅ Action verb enhancement
- ✅ Cover letter generation (from resume)
- ✅ Real-time preview

### User Dashboard
- ✅ Resume statistics
- ✅ Profile management
- ✅ Usage statistics
- ✅ Subscription management
- ✅ Download/Export options

### Admin Panel
- ✅ User management
- ✅ System statistics
- ✅ User suspension/activation
- ✅ Usage monitoring
- ✅ AI credits management

### Security & Performance
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Password hashing (bcryptjs)
- ✅ Request logging (Morgan)

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose -f docker-compose.full.yml up

# Services will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

### Build Production Image

```bash
docker build -f Dockerfile.full -t ai-resume-parser:latest .
```

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update user profile

### Resumes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get single resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Features
- `POST /api/ai/ats-optimize` - Analyze ATS compatibility
- `POST /api/ai/tone-adjust` - Adjust tone
- `POST /api/ai/action-verbs` - Enhance action verbs

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - System statistics
- `POST /api/admin/users/:id/suspend` - Suspend user

### Health & Status
- `GET /health` - API health check

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```bash
curl -H "Authorization: Bearer <your-token>" \
     http://localhost:5000/api/auth/me
```

Token is obtained from login/register response and stored in localStorage on frontend.

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  profile: {
    phone: String,
    location: String,
    jobTitle: String,
    bio: String,
    avatar: String
  },
  subscription: {
    plan: 'free' | 'pro' | 'enterprise',
    active: Boolean,
    expiresAt: Date
  },
  aiCredits: Number,
  role: 'user' | 'admin',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Resumes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  email: String,
  phone: String,
  skills: [String],
  experience: [String],
  education: [String],
  rawText: String,
  fileName: String,
  atsScore: Number,
  parseMethod: String,
  uploadDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚢 Deployment Options

### Vercel (Frontend) + Railway/Render (Backend)

1. **Frontend on Vercel**:
   ```bash
   vercel deploy
   ```
   Set `NEXT_PUBLIC_API_URL` to your backend URL

2. **Backend on Railway/Render**:
   - Connect your GitHub repo
   - Set environment variables
   - Deploy automatically

### Self-Hosted (AWS/DigitalOcean)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📊 Usage Monitoring

The application tracks:
- Resume uploads and parses
- AI feature usage (ATS checks, tone adjustments, etc.)
- User activity logs
- Subscription usage
- API response times

View stats in Admin Dashboard: `/admin/stats`

## 🔧 Environment Variables

### Frontend (.env.local)
```env
GOOGLE_AI_API_KEY=                  # Required: Google Gemini API key
GOOGLE_GEMINI_API_KEY=              # Alternative: Gemini key
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend API URL
```

### Backend (.env)
```env
NODE_ENV=development                # Environment
PORT=5000                          # Server port
MONGODB_URI=mongodb://localhost:27017/ai-resume-parser  # MongoDB connection
JWT_SECRET=your-secret-key          # JWT signing key
GOOGLE_AI_API_KEY=                 # Gemini API key
EMAIL_USER=your-email@gmail.com     # Gmail account
EMAIL_PASSWORD=app-password         # Gmail app password
FRONTEND_URL=http://localhost:3000  # Frontend URL
```

## 🧪 Testing

### Run Frontend Tests
```bash
npm test
npm run test:watch
```

### Run Backend Tests
```bash
cd backend
npm test
npm run test:watch
```

## 📚 Project Structure

```
project-root/
├── src/                          # Frontend (Next.js)
│   ├── app/                      # App Router pages
│   │   ├── page.tsx             # Home page
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── dashboard/           # User dashboard
│   │   ├── editor/              # Resume editor
│   │   └── api/                 # API routes
│   ├── components/               # React components
│   ├── contexts/                 # React contexts (Auth)
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utilities and helpers
│   └── __tests__/               # Frontend tests
│
├── backend/                       # Backend (Express)
│   ├── src/
│   │   ├── server-v2.js         # Main server file
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Express middleware
│   │   ├── utils/               # Utilities
│   │   └── config/              # Configuration
│   ├── __tests__/               # Backend tests
│   └── package.json
│
├── docker-compose.full.yml       # Docker Compose setup
├── Dockerfile.full              # Full-stack Dockerfile
├── Dockerfile.backend           # Backend-only Dockerfile
├── .env.local                   # Local environment variables
├── package.json
└── README.md
```

## 🎯 Next Steps

1. **Configure Stripe** for subscription payments
   - Get API keys from Stripe dashboard
   - Implement payment flows in `/api/checkout`

2. **Setup Email Notifications**
   - Configure Gmail App Password
   - Send emails on registration, resume upload, etc.

3. **Implement Analytics**
   - Track user behavior
   - Monitor API performance
   - Analyze feature usage

4. **Advanced Features**
   - Resume templates
   - Collaboration features
   - Export to LinkedIn
   - Browser extensions

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@resumeparser.com
- 💬 Discord: [Join our community](https://discord.gg/resumeparser)
- 🐛 Issues: [GitHub Issues](https://github.com/unnita1235/AI-Resume-Parser/issues)

## 🔔 Changelog

### v1.0.0 (Current)
- ✨ Initial full-stack release
- 🔐 JWT authentication
- 📊 User dashboard
- 🤖 AI features integration
- 🐳 Docker support
- 📱 Responsive UI

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.
