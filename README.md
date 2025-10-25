# AI Resume Parser & Rewriter

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://ai-resume-parser-seven.vercel.app/)
[![Vercel](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://vercel.com/unni-t-as-projects/ai-resume-parser)
![Status](https://img.shields.io/badge/status-active-blue)

> **AI Resume Parser & Rewriter** — an intelligent web application that allows users to upload or paste resumes, analyze them using AI, and automatically enhance them for ATS (Applicant Tracking System) optimization, professional tone, and stronger action verbs.

---

## 🚀 Live Demo

🔗 **Production URL:**  
[https://ai-resume-parser-seven.vercel.app/](https://ai-resume-parser-seven.vercel.app/)

Experience the live, hosted version deployed on **Vercel**.

---

## 🖼️ Screenshots

**Resume Rewriter Interface**  
![Resume Rewriter Interface](public/screenshots/AI-Resume-Parser.png)

**AI Enhancement Tools Panel**  
![AI Enhancement Tools Panel](public/screenshots/AI-Resume-Parser1.png)

---

## ✨ Features

### 🎯 **Core Functionality**
- 🧠 **AI-powered resume enhancement** for ATS compatibility  
- 🎯 **Tone adjustment** to make resumes more professional  
- ⚡ **Action verb enhancement** to improve impact  
- 📄 **Real-time preview** — left pane (input) → right pane (AI-rewritten resume)  
- 💾 **Download resume** in one click  
- 📋 **Copy to clipboard** functionality

### 📁 **File Management**
- 📤 **File Upload** - Support for PDF, DOCX, and TXT files
- 📝 **Text Input** - Paste resume text directly
- 🔄 **Reset Function** - Return to default resume template
- 📊 **Character Counter** - Track resume length

### 🎨 **User Experience**
- 🌗 **Modern UI** with smooth layout and clean typography  
- 🚀 **Fully responsive** — optimized for desktop and tablet view  
- ⚡ **Loading States** - Visual feedback for all operations
- 🎯 **Error Handling** - Comprehensive error management
- 🖨️ **Print Optimization** - Clean print layout

### 🔧 **Technical Features**
- ⚙️ **Deployed on Vercel** with zero-config build
- 🔒 **TypeScript** - Full type safety
- 🎨 **Tailwind CSS** - Modern styling
- 📱 **Mobile Responsive** - Works on all devices

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| AI Integration | Google Genkit + Gemini 2.5 Flash |
| UI Components | Radix UI + Lucide Icons |
| State Management | React Hooks + Server Actions |
| File Processing | Custom API Routes |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

## ⚙️ Getting Started (Local Development)

> Requires **Node.js v18+** and **npm** or **yarn**.

### 1️⃣ Clone the repository
```bash
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser
```

### 2️⃣ Install dependencies
```bash
npm install
# or
yarn
```

### 3️⃣ Set up environment variables
Create a `.env.local` file in the root directory:
```bash
# Google AI API Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Development Configuration
NODE_ENV=development
```

**Getting Your Google AI API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API Key" in the left sidebar
4. Create a new API key
5. Copy the API key and paste it in your `.env.local` file

### 4️⃣ Run development server
```bash
npm run dev
# or
yarn dev
```

Then open 👉 http://localhost:3000

⚠️ **Important:** Never commit `.env.local` — keep it private.
In production, set environment variables in Vercel Dashboard → Settings → Environment Variables.

🧱 Build for Production
npm run build
npm run start

☁️ Deploy to Vercel
Step-by-Step

Go to Vercel
.

Import your repository (unnita1235/AI-Resume-Parser).

Add environment variables if required.

Click Deploy — done! 🎉

Vercel automatically handles:

Dependency installation

Next.js build process

Continuous deployment for each commit

🗂️ Project Structure
AI-Resume-Parser/
├── public/
│   └── screenshots/
│       ├── AI-Resume-Parser.png
│       └── AI-Resume-Parser1.png
├── src/
│   ├── app/
│   ├── components/
│   ├── styles/
│   └── ...
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md

🧩 Common npm Scripts
Command	Description
npm run dev	Start development server
npm run build	Build production version
npm run start	Run production build
npm run lint	Lint codebase
npm run format	Format code with Prettier
💡 Future Enhancements

📂 Resume upload (PDF/DOCX) and text extraction

🔍 AI keyword matcher for job descriptions

📊 Resume scoring system (ATS ranking %)

🗣️ Multi-language tone & grammar enhancement

🧾 Export in DOCX / PDF formats with design templates

🤝 Contributing

Fork this repository

Create a new feature branch:

git checkout -b feature/your-feature


Commit and push your changes:

git commit -m "feat: add new feature"
git push origin feature/your-feature


Open a Pull Request on GitHub

🪪 License

This project is licensed under the MIT License — see the LICENSE
 file for details.

👤 Author

Unni T A
🔗 GitHub Profile

🌐 Live App

🚀 Vercel Dashboard

AI Resume Parser — Smarter, Faster, and Professionally Enhanced Resumes.
