import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeText, jobDescription } = body ?? {};

    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json({ success: false, error: 'resumeText is required and must be a string' }, { status: 400 });
    }

    if (resumeText.length < 50) {
      return NextResponse.json({ success: false, error: 'Resume text is too short. Please provide more content.' }, { status: 400 });
    }

    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide optimization suggestions.\n\nResume:\n${resumeText}\n\n${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}\n\nReturn a JSON object with this exact structure:\n{\n  "score": <number 0-100>,\n  "missingKeywords": ["keyword1", "keyword2"],\n  "recommendations": ["recommendation1", "recommendation2"],\n  "issues": ["issue1", "issue2"],\n  "strengths": ["strength1", "strength2"]\n}\n\nScore should reflect:\n- 90-100: Excellent ATS compatibility\n- 70-89: Good, minor improvements needed\n- 50-69: Fair, several improvements recommended\n- Below 50: Needs significant work\n\nFocus on: keyword optimization, formatting, section headers, and industry-standard terminology.`;

    const result = await generateJSON(prompt, { temperature: 0.3, maxOutputTokens: 2048 });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to analyze resume' }, { status: 500 });
    }

    const data = result.data ?? {};

    const response = {
      success: true,
      score: typeof data.score === 'number' ? Math.min(100, Math.max(0, data.score)) : 50,
      missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      issues: Array.isArray(data.issues) ? data.issues : [],
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? String(error) }, { status: 500 });
  }
}