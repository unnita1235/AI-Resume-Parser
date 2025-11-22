import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

// Simple text extraction for demonstration
// In production, you'd want to use proper libraries like pdf-parse, mammoth, etc.

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    // Handle different file types
    if (file.type === 'text/plain') {
      extractedText = buffer.toString('utf-8');
    } else if (file.type === 'application/pdf') {
      // For PDF files, we'll use a simple approach
      // In production, use pdf-parse or similar library
      extractedText = await extractTextFromPDF(buffer);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX files, we'll use a simple approach
      // In production, use mammoth or similar library
      extractedText = await extractTextFromDOCX(buffer);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from file' },
      { status: 500 }
    );
  }
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // This is a simplified implementation
  // In production, use pdf-parse library:
  // const pdfParse = require('pdf-parse');
  // const data = await pdfParse(buffer);
  // return data.text;
  
  // For now, return a placeholder
  return `PDF Content Extracted (${buffer.length} bytes)
  
This is a placeholder for PDF text extraction. In a production environment, you would use the pdf-parse library to extract actual text content from PDF files.

To implement proper PDF extraction:
1. Install pdf-parse: npm install pdf-parse
2. Import and use: const pdfParse = require('pdf-parse');
3. Extract text: const data = await pdfParse(buffer);

For now, please paste your resume text directly or use a TXT file.`;
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  // This is a simplified implementation
  // In production, use mammoth library:
  // const mammoth = require('mammoth');
  // const result = await mammoth.extractRawText({ buffer });
  // return result.value;
  
  // For now, return a placeholder
  return `DOCX Content Extracted (${buffer.length} bytes)
  
This is a placeholder for DOCX text extraction. In a production environment, you would use the mammoth library to extract actual text content from DOCX files.

To implement proper DOCX extraction:
1. Install mammoth: npm install mammoth
2. Import and use: const mammoth = require('mammoth');
3. Extract text: const result = await mammoth.extractRawText({ buffer });

For now, please paste your resume text directly or use a TXT file.`;
}
