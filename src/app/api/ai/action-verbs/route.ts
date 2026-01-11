import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/geminiClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body ?? {};

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'text is required and must be a string' }, { status: 400 });
    }

    if (text.length < 20) {
      return NextResponse.json({ success: false, error: 'Text is too short. Please provide more content.' }, { status: 400 });
    }

    const prompt = `Enhance the action verbs in this resume text to be more impactful and professional.\n\nText:\n${text}\n\nReplace weak or common verbs with strong, specific action verbs. Return a JSON object with this exact structure:\n{\n  "enhancedText": "<the enhanced text>",\n  "changedVerbs": [ {"original": "worked on", "enhanced": "spearheaded", "context": "brief context"} ],\n  "totalChanges": <number>\n}`;

    const result = await generateJSON(prompt, { temperature: 0.5, maxOutputTokens: 2048 });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to enhance action verbs' }, { status: 500 });
    }

    const data = result.data ?? {};

    const response = {
      success: true,
      enhancedText: data.enhancedText || text,
      changedVerbs: Array.isArray(data.changedVerbs) ? data.changedVerbs : [],
      totalChanges: typeof data.totalChanges === 'number' ? data.totalChanges : (data.changedVerbs?.length || 0),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? String(error) }, { status: 500 });
  }
}