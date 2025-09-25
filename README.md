
# 🤖 AI Resume Parser - Intelligent Recruitment Tool

**Automated Resume Analysis System Using Natural Language Processing**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![NLP](https://img.shields.io/badge/NLP-Natural%20Language%20Processing-orange)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-FF6F00?style=for-the-badge)

## 🎯 Business Value

This system automates the initial resume screening process for recruiters, saving hours of manual work by:
- **Extracting key candidate information** automatically
- **Identifying technical skills** and experience levels
- **Standardizing resume data** for easy comparison
- **Reducing hiring bias** through consistent evaluation

## ✨ Key Features

### 📄 Multi-Format Support
- Process PDF, DOCX, and image-based resumes
- Text extraction with high accuracy
- Format preservation and data integrity

### 🔍 Smart Entity Recognition
- **Personal Info:** Name, email, phone, location
- **Education:** Degrees, institutions, years
- **Experience:** Companies, roles, durations
- **Skills:** Technical competencies and proficiencies

### 📊 Advanced Analytics
- Experience calculation and validation
- Skill gap analysis for job requirements
- Candidate ranking based on criteria

## 🚀 Quick Demo

**Installation:**
```bash
git clone https://github.com/unnita1235/ai-resume-parser.git
cd ai-resume-parser
pip install -r requirements.txt
python app.py


Basic Usage:

python
from resume_parser import ResumeParser

parser = ResumeParser()
result = parser.parse('resume.pdf')
print(f"Candidate: {result['name']}")
print(f"Skills: {result['skills']}")
print(f"Experience: {result['experience']} years")

Basic Usage:

python
from resume_parser import ResumeParser

parser = ResumeParser()
result = parser.parse('resume.pdf')
print(f"Candidate: {result['name']}")
print(f"Skills: {result['skills']}")
print(f"Experience: {result['experience']} years")
