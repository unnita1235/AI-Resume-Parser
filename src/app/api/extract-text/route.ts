import { NextRequest, NextResponse } from 'next/server';

// PDF and DOCX extraction libraries
import mammoth from 'mammoth';

// pdf-parse needs dynamic import for CommonJS compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buffer: Buffer, options?: { max?: number }) => Promise<{ text: string }>;

/**
 * Validates file content by checking magic bytes (file signature)
 * This prevents users from renaming malicious files to bypass extension checks
 */
function validateFileContent(buffer: Buffer, fileName: string): { valid: boolean; detectedType: string } {
  const ext = fileName.toLowerCase().split('.').pop();

  // PDF files start with %PDF
  if (ext === 'pdf') {
    const header = buffer.slice(0, 4).toString('ascii');
    if (header === '%PDF') {
      return { valid: true, detectedType: 'pdf' };
    }
    return { valid: false, detectedType: 'unknown' };
  }

  // DOCX files are ZIP format, start with PK (0x50 0x4B)
  if (ext === 'docx') {
    if (buffer[0] === 0x50 && buffer[1] === 0x4B) {
      return { valid: true, detectedType: 'docx' };
    }
    return { valid: false, detectedType: 'unknown' };
  }

  // TXT files - accept without validation (any content is valid text)
  if (ext === 'txt') {
    return { valid: true, detectedType: 'txt' };
  }

  return { valid: false, detectedType: 'unknown' };
}

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
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No file provided',
          message: 'Please upload a resume file (PDF, DOCX, or TXT)'
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large',
          message: 'Please upload a file smaller than 5MB'
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate file content matches extension (security check)
    const validation = validateFileContent(buffer, file.name);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file content',
          message: 'File content does not match the file extension. Please upload a valid PDF, DOCX, or TXT file.'
        },
        { status: 400 }
      );
    }

    let extractedText = '';
    const metadata = {
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
      return NextResponse.json(
        { 
          success: false,
          error: 'Unsupported file type',
          message: 'Please upload a PDF, DOCX, or TXT file'
        },
        { status: 400 }
      );
    }

    // Clean up extracted text
    extractedText = cleanExtractedText(extractedText);

    // Update metadata
    metadata.characterCount = extractedText.length;
    metadata.wordCount = extractedText.split(/\s+/).filter(word => word.length > 0).length;

    // Validate extraction result
    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Extraction failed',
          message: 'Could not extract text from the file. Please ensure the file contains readable text.'
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ 
      success: true,
      text: extractedText,
      metadata
    });

  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Extraction error',
        message: 'Failed to extract text from file. Please try again or use a different file format.'
      },
      { status: 500 }
    );
  }
}

/**
 * Extracts text from PDF files using pdf-parse library
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer, {
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
