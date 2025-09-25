# AI Resume Parser

A Python-based system that automatically extracts information from resumes using Natural Language Processing (NLP).

## Features

- Extract text from PDF and DOCX files
- Identify name, email, phone number, skills, and experience
- Output structured JSON data
- Support for multiple resume formats

## Installation

```bash
# Clone the repository
git clone https://github.com/unnita1235/ai-resume-parser.git
cd ai-resume-parser

# Install requirements
pip install -r requirements.txt
Usage
python
from resume_parser import ResumeParser

# Initialize parser
parser = ResumeParser()

# Parse a resume file
result = parser.parse('resume.pdf')

# Print extracted information
print("Name:", result['name'])
print("Email:", result['email'])
print("Skills:", result['skills'])
Project Structure
text
ai-resume-parser/
├── src/           # Source code
├── tests/         # Test cases
├── samples/       # Example resumes
├── requirements.txt
└── README.md
Technologies Used
Python

spaCy (for NLP)

PyPDF2 (for PDF processing)

python-docx (for DOCX files)

Support
For questions, email: Unnita1235@gmail.com


