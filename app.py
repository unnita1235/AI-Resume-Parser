```python
"""
AI Resume Parser - Main Application
"""
import spacy
import PyPDF2
import json

class ResumeParser:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
    
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF file"""
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return ""
    
    def parse(self, file_path):
        """Main parsing function"""
        # Extract text based on file type
        if file_path.endswith('.pdf'):
            text = self.extract_text_from_pdf(file_path)
        else:
            # For other file types, you would add similar functions
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        
        # Basic NLP processing
        doc = self.nlp(text)
        
        # Extract entities (this is simplified)
        result = {
            'name': self.extract_name(doc),
            'email': self.extract_email(text),
            'phone': self.extract_phone(text),
            'skills': self.extract_skills(doc),
            'education': self.extract_education(doc),
            'experience': self.extract_experience(doc)
        }
        
        return result
    
    def extract_name(self, doc):
        """Extract person name from text"""
        for entity in doc.ents:
            if entity.label_ == "PERSON":
                return entity.text
        return "Not found"
    
    def extract_email(self, text):
        """Extract email address"""
        import re
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else "Not found"
    
    def extract_phone(self, text):
        """Extract phone number"""
        import re
        phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
        phones = re.findall(phone_pattern, text)
        return phones[0] if phones else "Not found"
    
    def extract_skills(self, doc):
        """Extract skills (simplified version)"""
        skills = ['python', 'javascript', 'react', 'node', 'mongodb', 'html', 'css']
        found_skills = []
        for token in doc:
            if token.text.lower() in skills:
                found_skills.append(token.text)
        return found_skills
    
    def extract_education(self, doc):
        """Extract education information"""
        # Simplified implementation
        education_keywords = ['bachelor', 'master', 'degree', 'university', 'college']
        education = []
        for sent in doc.sents:
            if any(keyword in sent.text.lower() for keyword in education_keywords):
                education.append(sent.text)
        return education
    
    def extract_experience(self, doc):
        """Extract experience information"""
        # Simplified implementation
        exp_keywords = ['experience', 'worked', 'years', 'company']
        experience = []
        for sent in doc.sents:
            if any(keyword in sent.text.lower() for keyword in exp_keywords):
                experience.append(sent.text)
        return experience

# Demo function for recruiters
def demo():
    print("🤖 AI Resume Parser Demo")
    print("=" * 30)
    
    parser = ResumeParser()
    
    # Create a simple test resume text
    test_text = """
    John Doe
    Email: john.doe@email.com
    Phone: +91 9876543210
    
    Skills: Python, JavaScript, React, Node.js
    
    Education: Bachelor of Computer Science from University of Example
    
    Experience: 3 years as Software Developer at Tech Company
    """
    
    # Save test text to file
    with open('test_resume.txt', 'w') as f:
        f.write(test_text)
    
    # Parse the resume
    result = parser.parse('test_resume.txt')
    
    print("Extracted Information:")
    print(f"Name: {result['name']}")
    print(f"Email: {result['email']}")
    print(f"Phone: {result['phone']}")
    print(f"Skills: {', '.join(result['skills'])}")
    print(f"Education: {result['education'][0] if result['education'] else 'Not found'}")
    print(f"Experience: {result['experience'][0] if result['experience'] else 'Not found'}")

if __name__ == "__main__":
    demo()
