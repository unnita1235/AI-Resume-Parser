import re
import spacy
from PyPDF2 import PdfReader
from docx import Document
import json

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

class ResumeParser:
    def __init__(self):
        self.email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        self.phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        self.linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        self.github_pattern = r'github\.com/[\w-]+'

    def extract_text_from_pdf(self, file_path):
        """Extract text from PDF file"""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""

    def extract_text_from_docx(self, file_path):
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            print(f"Error reading DOCX: {e}")
            return ""

    def extract_contact_info(self, text):
        """Extract contact information"""
        email = re.findall(self.email_pattern, text)
        phone = re.findall(self.phone_pattern, text)
        linkedin = re.findall(self.linkedin_pattern, text)
        github = re.findall(self.github_pattern, text)

        return {
            "email": email[0] if email else None,
            "phone": phone[0] if phone else None,
            "linkedin": linkedin[0] if linkedin else None,
            "github": github[0] if github else None
        }

    def extract_name(self, text):
        """Extract name (first line usually contains name)"""
        doc = nlp(text[:200])  # Process first 200 chars
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
        # Fallback: return first line
        lines = text.split('\n')
        return lines[0].strip() if lines else "Unknown"

    def extract_skills(self, text):
        """Extract skills from resume"""
        skills_keywords = [
            'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'MongoDB',
            'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Machine Learning',
            'Data Analysis', 'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js'
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in skills_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return found_skills

    def extract_experience(self, text):
        """Extract work experience"""
        experience_section = []
        lines = text.split('\n')
        
        experience_keywords = ['experience', 'employment', 'work history']
        in_experience_section = False
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            
            if any(keyword in line_lower for keyword in experience_keywords):
                in_experience_section = True
                continue
            
            if in_experience_section:
                # Stop if we hit another section
                if any(keyword in line_lower for keyword in ['education', 'skills', 'projects']):
                    break
                    
                if line.strip():
                    experience_section.append(line.strip())
        
        return experience_section

    def extract_education(self, text):
        """Extract education information"""
        education_section = []
        lines = text.split('\n')
        
        education_keywords = ['education', 'academic', 'qualification']
        in_education_section = False
        
        for line in lines:
            line_lower = line.lower()
            
            if any(keyword in line_lower for keyword in education_keywords):
                in_education_section = True
                continue
            
            if in_education_section:
                if any(keyword in line_lower for keyword in ['experience', 'skills', 'projects']):
                    break
                    
                if line.strip():
                    education_section.append(line.strip())
        
        return education_section

    def parse_resume(self, file_path, file_type):
        """Main parsing function"""
        # Extract text based on file type
        if file_type == 'pdf':
            text = self.extract_text_from_pdf(file_path)
        elif file_type in ['docx', 'doc']:
            text = self.extract_text_from_docx(file_path)
        else:
            return {"error": "Unsupported file type"}

        if not text:
            return {"error": "Could not extract text from file"}

        # Parse resume components
        parsed_data = {
            "name": self.extract_name(text),
            "contact": self.extract_contact_info(text),
            "skills": self.extract_skills(text),
            "experience": self.extract_experience(text),
            "education": self.extract_education(text),
            "raw_text": text
        }

        return parsed_data

# Test function
if __name__ == "__main__":
    parser = ResumeParser()
    print("Resume Parser initialized successfully!")
