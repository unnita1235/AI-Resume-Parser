# API Reference - AI Resume Parser

Complete API documentation for all endpoints.

**Base URL**: `https://your-backend.onrender.com`

---

## Health & Status

### GET /health
Check server health.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-08T12:00:00.000Z",
  "uptime": 3600,
  "mode": "production",
  "database": "connected",
  "version": "2.0.0"
}
```

### GET /api/stats
Get server statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "uptime": 3600,
    "totalRequests": 150,
    "totalParsedResumes": 25,
    "errors": 2,
    "mode": "production",
    "databaseConnected": true
  }
}
```

### GET /api/ai/health
Check AI (Gemini) service status.

**Response:**
```json
{
  "success": true,
  "geminiStatus": "available",
  "message": "Gemini AI is operational",
  "responseTime": 523,
  "configured": true
}
```

---

## Resume Parsing

### POST /api/parse
Parse a resume file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (PDF, DOC, or DOCX)

**curl:**
```bash
curl -X POST https://your-backend.onrender.com/api/parse \
  -F "file=@resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "mode": "production",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": ["Senior Developer at Company (2020-Present)"],
    "education": ["BS Computer Science, University (2018)"],
    "summary": "Experienced developer...",
    "accuracy": 92,
    "parseMethod": "ai"
  },
  "resumeId": "658abc123def456"
}
```

### GET /api/resumes
Get all parsed resumes.

**Query Parameters:**
- `limit` (number): Max results (default: 50)
- `skip` (number): Offset for pagination

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "mode": "production",
  "data": [/* array of resumes */]
}
```

### GET /api/resumes/:id
Get a single resume by ID.

**Response:**
```json
{
  "success": true,
  "data": {/* resume object */}
}
```

### GET /api/demo-resumes
Get sample demo resumes.

**Response:**
```json
{
  "success": true,
  "mode": "demo",
  "message": "Sample resumes for demonstration",
  "data": [/* array of demo resumes */]
}
```

---

## AI Enhancement Features

### POST /api/ai/ats-optimize
Analyze resume for ATS compatibility.

**Request:**
```json
{
  "resumeText": "Full resume text...",
  "jobDescription": "Optional job description..."
}
```

**curl:**
```bash
curl -X POST https://your-backend.onrender.com/api/ai/ats-optimize \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "John Doe\nSoftware Engineer\nExperience: 5 years..."}'
```

**Response:**
```json
{
  "success": true,
  "score": 75,
  "missingKeywords": ["project management", "agile"],
  "recommendations": [
    "Add more quantifiable achievements",
    "Include relevant certifications"
  ],
  "issues": ["Missing summary section"],
  "strengths": ["Strong technical skills", "Clear formatting"]
}
```

### POST /api/ai/tone-adjust
Adjust text tone to formal or casual.

**Request:**
```json
{
  "text": "Resume bullet points or text...",
  "tone": "formal"
}
```

**Response:**
```json
{
  "success": true,
  "adjustedText": "Revised text with adjusted tone...",
  "summary": "Made 5 adjustments to formalize language",
  "originalTone": "casual",
  "targetTone": "formal"
}
```

### POST /api/ai/action-verbs
Enhance weak action verbs.

**Request:**
```json
{
  "text": "Worked on projects. Helped team members. Made reports."
}
```

**Response:**
```json
{
  "success": true,
  "enhancedText": "Spearheaded projects. Mentored team members. Developed reports.",
  "changedVerbs": [
    {"original": "Worked on", "enhanced": "Spearheaded", "context": "projects"},
    {"original": "Helped", "enhanced": "Mentored", "context": "team members"},
    {"original": "Made", "enhanced": "Developed", "context": "reports"}
  ],
  "totalChanges": 3
}
```

### POST /api/ai/cover-letter
Generate a cover letter.

**Request:**
```json
{
  "resumeData": {
    "name": "John Doe",
    "skills": ["JavaScript", "React"],
    "experience": ["Developer at Company"],
    "summary": "Experienced developer..."
  },
  "jobDescription": "Looking for a senior developer...",
  "companyName": "TechCorp"
}
```

**Response:**
```json
{
  "success": true,
  "coverLetter": "Dear Hiring Manager,\n\nI am writing to express...",
  "wordCount": 285
}
```

---

## Error Responses

All endpoints may return errors:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/api/*` (general) | 100 req/15 min |
| `/api/ai/*` | 30 req/15 min |
| `/api/parse` | 10 uploads/15 min |

Rate limit headers are included in responses:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
