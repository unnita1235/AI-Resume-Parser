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

- 🧠 **AI-powered resume enhancement** for ATS compatibility  
- 🎯 **Tone adjustment** to make resumes more professional  
- ⚡ **Action verb enhancement** to improve impact  
- 📄 **Real-time preview** — left pane (input) → right pane (AI-rewritten resume)  
- 💾 **Download resume** in one click  
- 🌗 **Modern dark UI** with smooth layout and clean typography  
- 🚀 **Fully responsive** — optimized for desktop and tablet view  
- ⚙️ **Deployed on Vercel** with zero-config build

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend Framework | Next.js 13 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Integration | OpenAI / custom AI API |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

## ⚙️ Getting Started (Local Development)

> Requires **Node.js v18+** and **npm** or **yarn**.

### 1️⃣ Clone the repository
```bash
git clone https://github.com/unnita1235/AI-Resume-Parser.git
cd AI-Resume-Parser

2️⃣ Install dependencies
npm install
# or
yarn

3️⃣ Run development server
npm run dev
# or
yarn dev


Then open 👉 http://localhost:3000

🌍 Environment Variables

If using AI APIs (like OpenAI or custom backend), create a .env.local file at the root:

NEXT_PUBLIC_API_URL=https://api.example.com
OPENAI_API_KEY=your_openai_api_key


⚠️ Never commit .env.local — keep it private.
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
