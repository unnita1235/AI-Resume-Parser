import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/geminiClient';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body ?? {};

    if (!text || typeof text !== 'string') {
      return NextResponse.json(errorResponse('text is required and must be a string'), { status: 400 });
    }

    if (text.length < 20) {
      return NextResponse.json(errorResponse('Text is too short (minimum 20 characters)'), { status: 400 });
    }

    const prompt = `Enhance the action verbs in this resume text to be more impactful and professional.\n\nText:\n${text}\n\nReplace weak or common verbs with strong, specific action verbs. Return a JSON object with this exact structure:\n{\n  "enhancedText": "<the enhanced text>",\n  "changedVerbs": [ {"original": "worked on", "enhanced": "spearheaded", "context": "brief context"} ],\n  "totalChanges": <number>\n}`;

    const result = await generateJSON(prompt, { temperature: 0.5, maxOutputTokens: 2048 });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to enhance action verbs'), { status: 500 });
    }

    const data = result.data ?? {};

    return NextResponse.json(successResponse({
      enhancedText: data.enhancedText || text,
      changedVerbs: Array.isArray(data.changedVerbs) ? data.changedVerbs : [],
      totalChanges: typeof data.totalChanges === 'number' ? data.totalChanges : (data.changedVerbs?.length || 0),
    }));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error?.message ?? 'Failed to enhance action verbs'), { status: 500 });
  }
}