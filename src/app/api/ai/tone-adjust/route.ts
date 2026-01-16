import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, tone } = body ?? {};

    if (!text || typeof text !== 'string') {
      return NextResponse.json(errorResponse('text is required and must be a string'), { status: 400 });
    }

    if (!tone || !['formal', 'casual'].includes(tone)) {
      return NextResponse.json(errorResponse('tone must be "formal" or "casual"'), { status: 400 });
    }

    if (text.length < 20) {
      return NextResponse.json(errorResponse('Text is too short (minimum 20 characters)'), { status: 400 });
    }

    const prompt = `Adjust the following resume/professional text to be more ${tone}.\n\nOriginal text:\n${text}\n\nRequirements:\n- Keep the core meaning and achievements intact\n- ${tone === 'formal' ? 'Use professional language, remove contractions, use industry terms' : 'Use conversational language while maintaining professionalism'}\n- Maintain the same bullet point or paragraph structure\n- Do not add or remove information\n\nReturn a JSON object with this exact structure:\n{\n  "adjustedText": "<the adjusted text>",\n  "summary": "<brief description of changes made>",\n  "originalTone": "<detected original tone>",\n  "targetTone": "${tone}"\n}`;

    const result = await generateJSON(prompt, { temperature: 0.5, maxOutputTokens: 2048 });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to adjust tone'), { status: 500 });
    }

    const data = result.data ?? {};

    return NextResponse.json(successResponse({
      adjustedText: data.adjustedText || text,
      summary: data.summary || `Adjusted text to ${tone} tone`,
      originalTone: data.originalTone || 'unknown',
      targetTone: tone,
    }));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error?.message ?? 'Failed to adjust tone'), { status: 500 });
  }
}