# Architecture

## System Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │      │    Backend API   │      │   External      │
│   (Next.js)     │─────▶│    (Express.js)  │─────▶│   Services      │
│   Port: 3000    │◀─────│    Port: 5000    │◀─────│                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
        │                         │                        │
        ▼                         ▼                        ▼
   ┌─────────┐              ┌─────────┐              ┌─────────┐
   │ Vercel  │              │ Render  │              │ Gemini  │
   │         │              │ MongoDB │              │ API     │
   └─────────┘              └─────────┘              └─────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, TypeScript | UI, SSR, API routes |
| **Styling** | Tailwind CSS, shadcn/ui | Components, design system |
| **Backend** | Express.js, Node.js | REST API, file processing |
| **Database** | MongoDB | Resume storage (optional) |
| **AI** | Google Gemini via Genkit | Resume parsing, optimization |
| **File Processing** | pdf-parse, mammoth | PDF/DOCX text extraction |

## Data Flow

### Resume Upload Flow

```
1. User uploads file (PDF/DOCX/TXT)
            ↓
2. Frontend validates file type/size
            ↓
3. File sent to /api/parse endpoint
            ↓
4. Backend extracts text (pdf-parse/mammoth)
            ↓
5. Text sent to Gemini AI for parsing
            ↓
6. Structured data returned to frontend
            ↓
7. Resume saved to MongoDB (if configured)
```

### AI Enhancement Flow

```
1. User requests enhancement (ATS/Tone/Verbs)
            ↓
2. Frontend calls server action
            ↓
3. Genkit AI flow processes request
            ↓
4. Gemini API returns enhanced content
            ↓
5. Results displayed in preview panel
```

## Key Design Decisions

### Why Next.js 15?
- Server Actions for AI flows
- App Router for cleaner structure
- TypeScript integration
- Easy Vercel deployment

### Why Express.js Backend?
- File upload handling (multer)
- MongoDB integration
- Keep-alive for free tier hosting
- Separation from frontend

### Why Gemini AI?
- Fast response times
- Large context window (1M tokens)
- Cost-effective
- Good understanding of professional content

### Why Optional MongoDB?
- Works without database (demo mode)
- Easy setup with Atlas free tier
- Persistence for production use

## Security

| Feature | Implementation |
|---------|----------------|
| File Validation | Type + size limits |
| CORS | Whitelist-based |
| API Keys | Environment variables |
| File Cleanup | Automatic (every 6 hours) |

## Performance

| Metric | Target | Notes |
|--------|--------|-------|
| Parse Time | <5 seconds | With Gemini AI |
| Cold Start | 30-50 seconds | Render free tier |
| File Size | 10MB max | Configurable |
