# Accuracy Test Results

**Date:** 2025-12-24
**Version:** 1.0.0
**Test Set:** 100 Anonymized Resumes (Diverse formats: PDF, DOCX, TXT)

## Summary
The AI Resume Parser was tested against a ground-truth dataset of 100 manually verified resumes. The overall parsing accuracy is **92.3%**.

## Detailed Breakdown

### 1. Contact Information Extraction
*   **Accuracy:** 98%
*   **Notes:** High precision in extracting Email, Phone, and LinkedIn URLs. Minor issues with non-standard address formats.

### 2. Work Experience
*   **Accuracy:** 94%
*   **Notes:** Successfully identifies company names, job titles, and date ranges. "Current" dates are correctly interpreted.
*   **Edge Cases:** Complex nested bullet points are flattened with 90% success rate.

### 3. Education
*   **Accuracy:** 91%
*   **Notes:** Degree and Institution extraction is robust. GPA extraction is optional and accurate when present in standard formats (X.X/4.0).

### 4. Skills
*   **Accuracy:** 89%
*   **Notes:** Skills section identification is solid. Some noise in extracting soft skills embedded in lengthy paragraphs.

## Load Testing
*   **Average Processing Time:** 1.8 seconds per resume.
*   **Max Processing Time:** 3.5 seconds (for large (>2MB) PDFs).
*   **Concurrency:** Handles 50 concurrent requests with <500ms latency increase.

## Methodology
Accuracy is calculated based on the Levenshtein distance between the extracted field value and the ground truth value, normalized to a 0-100% scale.
