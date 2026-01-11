const { parseWithRegex } = require('../src/utils/resume-parser');

/**
 * Comprehensive tests for the parseWithRegex function
 *
 * This function is a critical fallback parser that extracts structured information
 * from resume text using regular expressions. It handles:
 * - Contact information (email, phone, LinkedIn, GitHub)
 * - Skills detection from a predefined list
 * - Name extraction from the first line
 */

describe('parseWithRegex Function', () => {
  describe('Email Extraction', () => {
    test('should extract standard email format', () => {
      const text = `John Doe
john.doe@example.com
Software Engineer`;

      const result = parseWithRegex(text);
      expect(result.email).toBe('john.doe@example.com');
    });

    test('should extract email with plus addressing', () => {
      const text = 'Contact: user+tag@company.io';
      const result = parseWithRegex(text);
      expect(result.email).toBe('user+tag@company.io');
    });

    test('should extract email with subdomain', () => {
      const text = 'Email: contact@mail.company.co.uk';
      const result = parseWithRegex(text);
      expect(result.email).toBe('contact@mail.company.co.uk');
    });

    test('should extract email with numbers', () => {
      const text = 'user123@test456.com';
      const result = parseWithRegex(text);
      expect(result.email).toBe('user123@test456.com');
    });

    test('should return null when no email is present', () => {
      const text = 'John Doe\nSoftware Engineer\nNo contact info';
      const result = parseWithRegex(text);
      expect(result.email).toBeNull();
    });

    test('should extract first email when multiple are present', () => {
      const text = 'first@email.com and second@email.com';
      const result = parseWithRegex(text);
      expect(result.email).toBe('first@email.com');
    });
  });

  describe('Phone Number Extraction', () => {
    test('should extract US phone with parentheses format', () => {
      const text = 'Phone: (123) 456-7890';
      const result = parseWithRegex(text);
      expect(result.phone).toBe('(123) 456-7890');
    });

    test('should extract phone with dashes', () => {
      const text = 'Call me at 555-123-4567';
      const result = parseWithRegex(text);
      expect(result.phone).toBe('555-123-4567');
    });

    test('should extract phone with dots', () => {
      const text = 'Contact: 123.456.7890';
      const result = parseWithRegex(text);
      expect(result.phone).toBe('123.456.7890');
    });

    test('should extract international phone with country code', () => {
      const text = 'Phone: +1-555-123-4567';
      const result = parseWithRegex(text);
      expect(result.phone).toBe('+1-555-123-4567');
    });

    test('should extract phone with spaces', () => {
      const text = '(555) 123 4567';
      const result = parseWithRegex(text);
      expect(result.phone).toBe('(555) 123 4567');
    });

    test('should extract phone without separators', () => {
      const text = 'Mobile: 5551234567';
      const result = parseWithRegex(text);
      expect(result.phone).toBe('5551234567');
    });

    test('should return null when no phone is present', () => {
      const text = 'John Doe\njohn@email.com\nNo phone number here';
      const result = parseWithRegex(text);
      expect(result.phone).toBeNull();
    });
  });

  describe('LinkedIn Profile Extraction', () => {
    test('should extract LinkedIn personal profile', () => {
      const text = 'LinkedIn: linkedin.com/in/johndoe';
      const result = parseWithRegex(text);
      expect(result.linkedin).toBe('linkedin.com/in/johndoe');
    });

    test('should extract LinkedIn profile with hyphens', () => {
      const text = 'Profile: linkedin.com/in/john-doe-12345';
      const result = parseWithRegex(text);
      expect(result.linkedin).toBe('linkedin.com/in/john-doe-12345');
    });

    test('should extract LinkedIn profile with underscores', () => {
      const text = 'Connect: linkedin.com/in/john_doe_eng';
      const result = parseWithRegex(text);
      expect(result.linkedin).toBe('linkedin.com/in/john_doe_eng');
    });

    test('should extract LinkedIn company profile', () => {
      const text = 'Company: linkedin.com/company/tech-corp';
      const result = parseWithRegex(text);
      expect(result.linkedin).toBe('linkedin.com/company/tech-corp');
    });

    test('should be case insensitive', () => {
      const text = 'LINKEDIN.COM/IN/JOHNDOE';
      const result = parseWithRegex(text);
      expect(result.linkedin).not.toBeNull();
      expect(result.linkedin.toLowerCase()).toContain('linkedin.com/in/johndoe');
    });

    test('should extract LinkedIn with https protocol', () => {
      const text = 'https://linkedin.com/in/johndoe';
      const result = parseWithRegex(text);
      expect(result.linkedin).toBe('linkedin.com/in/johndoe');
    });

    test('should return null when no LinkedIn is present', () => {
      const text = 'John Doe\njohn@email.com\nNo LinkedIn profile';
      const result = parseWithRegex(text);
      expect(result.linkedin).toBeNull();
    });
  });

  describe('GitHub Profile Extraction', () => {
    test('should extract GitHub profile', () => {
      const text = 'GitHub: github.com/johndoe';
      const result = parseWithRegex(text);
      expect(result.github).toBe('github.com/johndoe');
    });

    test('should extract GitHub profile with hyphens', () => {
      const text = 'Code: github.com/john-doe-dev';
      const result = parseWithRegex(text);
      expect(result.github).toBe('github.com/john-doe-dev');
    });

    test('should extract GitHub profile with underscores', () => {
      const text = 'Profile: github.com/john_doe_123';
      const result = parseWithRegex(text);
      expect(result.github).toBe('github.com/john_doe_123');
    });

    test('should be case insensitive', () => {
      const text = 'GITHUB.COM/JOHNDOE';
      const result = parseWithRegex(text);
      expect(result.github).not.toBeNull();
      expect(result.github.toLowerCase()).toContain('github.com/johndoe');
    });

    test('should extract GitHub with https protocol', () => {
      const text = 'https://github.com/johndoe';
      const result = parseWithRegex(text);
      expect(result.github).toBe('github.com/johndoe');
    });

    test('should return null when no GitHub is present', () => {
      const text = 'John Doe\njohn@email.com\nNo GitHub profile';
      const result = parseWithRegex(text);
      expect(result.github).toBeNull();
    });
  });

  describe('Skills Extraction', () => {
    test('should detect single skill', () => {
      const text = 'I am proficient in Python programming';
      const result = parseWithRegex(text);
      expect(result.skills).toContain('Python');
      expect(result.skills).toHaveLength(1);
    });

    test('should detect multiple skills', () => {
      const text = 'Skills: React, Node.js, MongoDB, Docker, AWS';
      const result = parseWithRegex(text);
      expect(result.skills).toContain('React');
      expect(result.skills).toContain('Node.js');
      expect(result.skills).toContain('MongoDB');
      expect(result.skills).toContain('Docker');
      expect(result.skills).toContain('AWS');
      expect(result.skills.length).toBeGreaterThanOrEqual(5);
    });

    test('should be case insensitive', () => {
      const text = 'I know PYTHON, javascript, and TypeScript';
      const result = parseWithRegex(text);
      expect(result.skills).toContain('Python');
      expect(result.skills).toContain('JavaScript');
      expect(result.skills).toContain('TypeScript');
      expect(result.skills.length).toBeGreaterThanOrEqual(3);
    });

    test('should match word boundaries (no partial matches)', () => {
      const text = 'I have experience with JavaScript';
      const result = parseWithRegex(text);
      expect(result.skills).toContain('JavaScript');
      expect(result.skills).not.toContain('Java');
    });

    test('should detect skills with dots', () => {
      const text = 'Proficient in Node.js and Vue.js';
      const result = parseWithRegex(text);
      expect(result.skills).toContain('Node.js');
      expect(result.skills).toContain('Vue.js');
    });

    test('should detect skills with special characters', () => {
      const text = 'Tech stack: C++, C#, Python';
      const result = parseWithRegex(text);
      expect(result.skills).toContain('C++');
      expect(result.skills).toContain('C#');
      expect(result.skills).toContain('Python');
    });

    test('should return empty array when no skills match', () => {
      const text = 'I am a manager with no technical skills';
      const result = parseWithRegex(text);
      expect(result.skills).toHaveLength(0);
    });

    test('should handle skills in comma-separated list', () => {
      const text = 'Skills: Python, JavaScript, TypeScript, React, Node.js';
      const result = parseWithRegex(text);
      expect(result.skills.length).toBeGreaterThanOrEqual(5);
      expect(result.skills).toContain('Python');
      expect(result.skills).toContain('JavaScript');
      expect(result.skills).toContain('TypeScript');
      expect(result.skills).toContain('React');
      expect(result.skills).toContain('Node.js');
    });
  });

  describe('Name Extraction', () => {
    test('should extract name from first line', () => {
      const text = `John Doe
john@email.com
Software Engineer`;
      const result = parseWithRegex(text);
      expect(result.name).toBe('John Doe');
    });

    test('should trim whitespace from name', () => {
      const text = `  Jane Smith
jane@email.com`;
      const result = parseWithRegex(text);
      expect(result.name).toBe('Jane Smith');
    });

    test('should handle name with special characters', () => {
      const text = `María José García-López
maria@email.com`;
      const result = parseWithRegex(text);
      expect(result.name).toBe('María José García-López');
    });

    test('should return "Unknown" for empty text', () => {
      const text = '';
      const result = parseWithRegex(text);
      expect(result.name).toBe('Unknown');
    });

    test('should return "Unknown" for whitespace-only text', () => {
      const text = '   \n  \n  ';
      const result = parseWithRegex(text);
      expect(result.name).toBe('Unknown');
    });

    test('should handle single-word name', () => {
      const text = `Madonna
madonna@email.com`;
      const result = parseWithRegex(text);
      expect(result.name).toBe('Madonna');
    });

    test('should handle name with title', () => {
      const text = `Dr. John Smith
john@email.com`;
      const result = parseWithRegex(text);
      expect(result.name).toBe('Dr. John Smith');
    });
  });

  describe('Complete Resume Parsing Integration', () => {
    test('should parse complete resume with all fields', () => {
      const resumeText = `John Doe
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe | github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with expertise in React, Node.js, Python, and AWS.

SKILLS
React, Node.js, Python, JavaScript, TypeScript, MongoDB, PostgreSQL, Docker, AWS, Git

EXPERIENCE
Senior Software Engineer
Tech Company | 2020-Present
- Developed scalable web applications using React and Node.js
- Deployed services on AWS with Docker containers

EDUCATION
BS Computer Science
University of Technology | 2018`;

      const result = parseWithRegex(resumeText);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john.doe@email.com');
      expect(result.phone).toBe('(555) 123-4567');
      expect(result.linkedin).toBe('linkedin.com/in/johndoe');
      expect(result.github).toBe('github.com/johndoe');
      expect(result.skills.length).toBeGreaterThan(5);
      expect(result.skills).toContain('React');
      expect(result.skills).toContain('Python');
      expect(result.skills).toContain('AWS');
    });

    test('should handle minimal resume with only name', () => {
      const resumeText = 'John Doe';
      const result = parseWithRegex(resumeText);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBeNull();
      expect(result.phone).toBeNull();
      expect(result.linkedin).toBeNull();
      expect(result.github).toBeNull();
      expect(result.skills).toHaveLength(0);
    });

    test('should handle resume with some missing fields', () => {
      const resumeText = `Jane Smith
jane@email.com

Skills: Python, Django, PostgreSQL`;

      const result = parseWithRegex(resumeText);

      expect(result.name).toBe('Jane Smith');
      expect(result.email).toBe('jane@email.com');
      expect(result.phone).toBeNull();
      expect(result.linkedin).toBeNull();
      expect(result.skills).toContain('Python');
      expect(result.skills).toContain('Django');
      expect(result.skills).toContain('PostgreSQL');
      expect(result.skills.length).toBeGreaterThanOrEqual(3);
    });

    test('should return all expected fields', () => {
      const text = 'Test Resume';
      const result = parseWithRegex(text);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('phone');
      expect(result).toHaveProperty('linkedin');
      expect(result).toHaveProperty('github');
      expect(result).toHaveProperty('skills');
      expect(result).toHaveProperty('experience');
      expect(result).toHaveProperty('education');
      expect(result).toHaveProperty('summary');
      expect(Array.isArray(result.skills)).toBe(true);
      expect(Array.isArray(result.experience)).toBe(true);
      expect(Array.isArray(result.education)).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty string', () => {
      const result = parseWithRegex('');
      expect(result.name).toBe('Unknown');
      expect(result.email).toBeNull();
      expect(result.skills).toHaveLength(0);
    });

    test('should handle only whitespace', () => {
      const result = parseWithRegex('     \n\n   \n  ');
      expect(result.name).toBe('Unknown');
    });

    test('should handle text with special characters', () => {
      const text = 'Email: user@example.com\n☎ Phone: (555) 123-4567\n★ Skills: JavaScript';
      const result = parseWithRegex(text);

      expect(result.email).toBe('user@example.com');
      expect(result.phone).toBe('(555) 123-4567');
      expect(result.skills).toContain('JavaScript');
    });

    test('should handle very long text', () => {
      const longText = 'a'.repeat(10000) + ' Python ' + 'b'.repeat(10000);
      const result = parseWithRegex(longText);
      expect(result.skills).toContain('Python');
    });

    test('should handle text with multiple line breaks', () => {
      const text = `John Doe


john@email.com


Skills: Python`;
      const result = parseWithRegex(text);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@email.com');
      expect(result.skills).toContain('Python');
    });

    test('should handle malformed URLs gracefully', () => {
      const text = 'linkedin/in/broken github/broken';
      const result = parseWithRegex(text);

      expect(result.linkedin).toBeNull();
      expect(result.github).toBeNull();
    });

    test('should handle mixed content with code snippets', () => {
      const text = `John Doe
john@email.com
Experience with Python:
def hello():
    print("Hello")

Skills: Python, JavaScript`;
      const result = parseWithRegex(text);

      expect(result.skills).toContain('Python');
      expect(result.skills).toContain('JavaScript');
    });
  });

  describe('Summary Extraction', () => {
    test('should extract summary as first 500 characters', () => {
      const longText = 'a'.repeat(600);
      const result = parseWithRegex(longText);

      expect(result.summary).toHaveLength(500);
      expect(result.summary).toBe('a'.repeat(500));
    });

    test('should handle text shorter than 500 characters', () => {
      const shortText = 'Short resume text';
      const result = parseWithRegex(shortText);

      expect(result.summary).toBe(shortText);
      expect(result.summary.length).toBeLessThanOrEqual(500);
    });

    test('should include full content if exactly 500 characters', () => {
      const text = 'a'.repeat(500);
      const result = parseWithRegex(text);

      expect(result.summary).toHaveLength(500);
    });
  });

  describe('Experience and Education Arrays', () => {
    test('should return empty arrays for experience and education', () => {
      const text = 'John Doe\njohn@email.com';
      const result = parseWithRegex(text);

      expect(result.experience).toEqual([]);
      expect(result.education).toEqual([]);
    });
  });
});
