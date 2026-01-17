'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '@/lib/db';
import Resume from '@/models/Resume';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function processResume(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file uploaded');

    // 1. Extract Text
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.type === 'application/pdf') {
      const data = await pdf(buffer);
      text = data.text;
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.name.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      text = buffer.toString('utf-8');
    }

    // Clean text
    text = text.replace(/\s+/g, ' ').trim().substring(0, 10000); // Limit tokens

    // 2. AI Extraction
    const prompt = `
    Extract the following details from this resume text and return STRICT JSON only. 
    Do not use markdown code blocks.
    JSON Structure: { "name": "", "email": "", "phone": "", "skills": [], "experience": [], "education": [], "summary": "" }
    
    Resume Text:
    ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    let structuredData;
    try {
        structuredData = JSON.parse(jsonString);
    } catch (e) {
        console.error("JSON Parse Error", e);
        // Fallback if AI fails to give valid JSON
        structuredData = { 
            name: "Unknown", 
            summary: "AI Parsing Failed", 
            rawText: text 
        };
    }

    // 3. Save to MongoDB
    await connectDB();
    const newResume = await Resume.create({
      fileName: file.name,
      originalText: text,
      structuredData: structuredData
    });

    // 4. Return Plain Object (Next.js can't serialize Mongoose docs directly)
    return { 
        success: true, 
        data: JSON.parse(JSON.stringify(newResume)),
        message: "Resume processed successfully" 
    };

  } catch (error: any) {
    console.error('Processing Error:', error);
    return { success: false, error: error.message };
  }
}
