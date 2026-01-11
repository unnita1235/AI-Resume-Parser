# Architecture — AI Resume Parser

Overview
- Input: PDF / DOCX / image
- Step 1: text_extraction.py — extract raw text
- Step 2: entity_recognition.py — spaCy / regex to find names, emails, phones
- Step 3: skill_matcher.py — map tokens to known skill set (JSON)
- Output: structured JSON (personal_info, skills, experience)

Key files
- `src/text_extraction.py` — convert PDF/DOCX to text
- `src/entity_recognition.py` — NLP entity extraction
- `src/skill_matcher.py` — skill detection logic
- `app.py` — minimal CLI / API entrypoint

How to evaluate quickly
1. Run `python app.py` (or `docker build . && docker run -p 5000:5000 <image>`)  
2. Inspect `src/entity_recognition.py` for the named entity logic  
3. Open `tests/` to see automated checks
