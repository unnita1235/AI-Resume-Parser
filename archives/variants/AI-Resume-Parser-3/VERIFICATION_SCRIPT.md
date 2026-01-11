# Verification Script

Copy-paste ready commands to test all endpoints.

Replace `YOUR_BACKEND_URL` with your deployed URL (e.g., `https://your-app.onrender.com`).

---

## Health Checks

```bash
# Basic health check
curl -s YOUR_BACKEND_URL/health | jq .

# Expected: {"status":"healthy","timestamp":"...","uptime":...,"mode":"...","database":"...","version":"2.0.0"}
```

```bash
# Server stats
curl -s YOUR_BACKEND_URL/api/stats | jq .

# Expected: {"success":true,"stats":{...}}
```

```bash
# AI service health
curl -s YOUR_BACKEND_URL/api/ai/health | jq .

# Expected: {"success":true,"geminiStatus":"available","message":"Gemini AI is operational",...}
```

---

## Demo Endpoints

```bash
# Get demo resumes
curl -s YOUR_BACKEND_URL/api/demo-resumes | jq .

# Expected: {"success":true,"mode":"demo","data":[{...},{...},{...}]}
```

---

## AI Enhancement Endpoints

### ATS Optimization

```bash
curl -s -X POST YOUR_BACKEND_URL/api/ai/ats-optimize \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "John Smith\nSoftware Engineer\njohn@email.com\n\nEXPERIENCE\nSenior Developer at TechCorp (2020-Present)\n- Built web applications using React and Node.js\n- Led team of 5 developers\n\nSKILLS\nJavaScript, Python, React, Node.js, PostgreSQL, AWS\n\nEDUCATION\nBS Computer Science, MIT 2018"
  }' | jq .

# Expected: {"success":true,"score":XX,"missingKeywords":[...],"recommendations":[...],...}
```

### Tone Adjustment

```bash
curl -s -X POST YOUR_BACKEND_URL/api/ai/tone-adjust \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I worked on some cool projects and helped the team out a lot. We built awesome stuff together.",
    "tone": "formal"
  }' | jq .

# Expected: {"success":true,"adjustedText":"...","summary":"...","originalTone":"...","targetTone":"formal"}
```

### Action Verb Enhancement

```bash
curl -s -X POST YOUR_BACKEND_URL/api/ai/action-verbs \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Worked on backend systems. Helped with customer support. Made reports for management. Did code reviews."
  }' | jq .

# Expected: {"success":true,"enhancedText":"...","changedVerbs":[...],"totalChanges":X}
```

### Cover Letter Generation

```bash
curl -s -X POST YOUR_BACKEND_URL/api/ai/cover-letter \
  -H "Content-Type: application/json" \
  -d '{
    "resumeData": {
      "name": "John Smith",
      "skills": ["JavaScript", "React", "Node.js", "AWS"],
      "experience": ["Senior Developer at TechCorp (2020-Present)"],
      "education": ["BS Computer Science, MIT 2018"],
      "summary": "5+ years experience building scalable web applications"
    },
    "jobDescription": "We are looking for a Senior Full Stack Developer to join our team. Requirements: 5+ years experience, React, Node.js, AWS, team leadership.",
    "companyName": "InnovateTech"
  }' | jq .

# Expected: {"success":true,"coverLetter":"Dear Hiring Manager,...","wordCount":XXX}
```

---

## File Upload Test

```bash
# Replace resume.pdf with an actual file path
curl -s -X POST YOUR_BACKEND_URL/api/parse \
  -F "file=@resume.pdf" | jq .

# Expected: {"success":true,"message":"Resume parsed successfully","data":{...},...}
```

---

## Error Cases

### Missing required field

```bash
curl -s -X POST YOUR_BACKEND_URL/api/ai/ats-optimize \
  -H "Content-Type: application/json" \
  -d '{}' | jq .

# Expected: {"success":false,"error":"resumeText is required and must be a string"}
```

### Invalid tone

```bash
curl -s -X POST YOUR_BACKEND_URL/api/ai/tone-adjust \
  -H "Content-Type: application/json" \
  -d '{"text": "Some text", "tone": "invalid"}' | jq .

# Expected: {"success":false,"error":"tone is required and must be \"formal\" or \"casual\""}
```

### Text too short

```bash
curl -s -X POST YOUR_BACKEND_URL/api/ai/action-verbs \
  -H "Content-Type: application/json" \
  -d '{"text": "Short"}' | jq .

# Expected: {"success":false,"error":"Text is too short. Please provide more content."}
```

---

## Rate Limit Headers

Check rate limit info in response headers:

```bash
curl -v YOUR_BACKEND_URL/api/stats 2>&1 | grep -i ratelimit

# Expected headers:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 99
# X-RateLimit-Reset: 1704729600
```

---

## Quick Test Script

Save as `test-api.sh`:

```bash
#!/bin/bash
URL="${1:-http://localhost:5000}"

echo "Testing: $URL"
echo "===================="

echo -n "Health: "
curl -s "$URL/health" | jq -r '.status'

echo -n "AI Health: "
curl -s "$URL/api/ai/health" | jq -r '.geminiStatus'

echo -n "Demo Resumes: "
curl -s "$URL/api/demo-resumes" | jq -r '.data | length'

echo "===================="
echo "All tests complete!"
```

Run: `./test-api.sh https://your-backend.onrender.com`
