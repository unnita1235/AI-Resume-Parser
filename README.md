# 🤖 AI Resume Parser

An intelligent resume parsing system that uses Natural Language Processing (NLP) to extract and analyze candidate information from resumes.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![NLP](https://img.shields.io/badge/NLP-Natural%20Language%20Processing-orange)
![Machine Learning](https://img.shields.io/badge/Machine-Learning-blueviolet)

## ✨ Features

- **Text Extraction**: Extract text from PDF, DOCX, and image formats
- **Entity Recognition**: Identify name, email, phone, education, experience
- **Skill Matching**: Automatically detect technical skills and competencies
- **Experience Analysis**: Calculate total experience and role seniority
- **JSON Output**: Structured data output for easy integration
## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/unnita1235/ai-resume-parser.git
cd ai-resume-parser

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py

from resume_parser import ResumeParser

# Initialize parser
parser = ResumeParser()

# Parse a resume
result = parser.parse('resume.pdf')
print(result)
📁 Project Structure
text
ai-resume-parser/
├── src/
│   ├── text_extraction.py    # Text extraction from various formats
│   ├── entity_recognition.py # Identify key entities
│   └── skill_matcher.py      # Skill detection and matching
├── samples/                  # Sample resumes for testing
├── requirements.txt          # Python dependencies
└── app.py                   # Main application file
🛠️ Technologies Used
spaCy: For NLP and entity recognition

PyPDF2: PDF text extraction

python-docx: DOCX file processing

scikit-learn: Machine learning components

📊 Sample Output
json
{
  "personal_info": {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+1-234-567-8900"
  },
  "skills": ["Python", "Machine Learning", "React", "Node.js"],
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "duration": "2 years"
    }
  ]
}
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📄 License
This project is licensed under the MIT License.

⭐ If you find this project helpful, please give it a star!
