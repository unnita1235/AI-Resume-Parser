import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';

// PDF and DOCX extraction libraries
// @ts-ignore - pdf-parse types not available
import * as pdfParse from 'pdf-parse';
// @ts-ignore - mammoth types not available  
import mammoth from 'mammoth';

/**
 * POST /api/extract-text
 * 
 * Extracts text content from uploaded resume files.
 * Supports: PDF, DOCX, TXT formats
 * 
 * @param request - FormData containing 'file' field
 * @returns JSON with extracted text or error message
 */
export async function POST(request: NextRequest) {
  // Define CORS headers once at the top
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      const response = NextResponse.json(
        errorResponse('No file provided'),
        { status: 400 }
      );
      Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
      return response;
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      const response = NextResponse.json(
        errorResponse('File too large (max 5MB)'),
        { status: 400 }
      );
      Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
      return response;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';
    let metadata = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      extractedAt: new Date().toISOString(),
      characterCount: 0,
      wordCount: 0
    };

    // Handle different file types
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      extractedText = await extractTextFromPDF(buffer);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      extractedText = await extractTextFromDOCX(buffer);
    } else {
      const response = NextResponse.json(
        errorResponse('Unsupported file type (use PDF, DOCX, or TXT)'),
        { status: 400 }
      );
      Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
      return response;
    }

    // Clean up extracted text
    extractedText = cleanExtractedText(extractedText);

    // Update metadata
    metadata.characterCount = extractedText.length;
    metadata.wordCount = extractedText.split(/\s+/).filter(word => word.length > 0).length;

    // Validate extraction result
    if (!extractedText || extractedText.trim().length < 10) {
      const response = NextResponse.json(
        errorResponse('Could not extract text from file'),
        { status: 422 }
      );
      Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
      return response;
    }

    const response = NextResponse.json(
      successResponse({
        text: extractedText,
        metadata
      })
    );
    Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;

  } catch (error) {
    console.error('Error extracting text:', error);
    const response = NextResponse.json(
      errorResponse(error instanceof Error ? error.message : 'Failed to extract text'),
      { status: 500 }
    );
    Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }
}

/**
 * Extracts text from PDF files using pdf-parse library
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // pdfParse is the default export in CommonJS
    const pdf = pdfParse as any;
    const data = await pdf(buffer, {
      // Disable test data
      max: 0
    });
    return data.text || '';
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Extracts text from DOCX files using mammoth library
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

/**
 * Cleans up extracted text by removing excessive whitespace
 * and normalizing line breaks
 */
function cleanExtractedText(text: string): string {
  return text
    // Normalize different line endings to \n
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove multiple consecutive blank lines (keep max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Remove multiple consecutive spaces
    .replace(/[ \t]+/g, ' ')
    // Trim whitespace from each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Final trim
    .trim();
}
