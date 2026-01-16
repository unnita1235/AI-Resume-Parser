import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/geminiClient';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeData, jobDescription, companyName } = body ?? {};

    if (!resumeData) {
      return NextResponse.json(errorResponse('resumeData is required'), { status: 400 });
    }

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(errorResponse('jobDescription is required and must be a string'), { status: 400 });
    }

    if (jobDescription.length < 20) {
      return NextResponse.json(errorResponse('Job description is too short (minimum 20 characters)'), { status: 400 });
    }

    const resumeStr = typeof resumeData === 'string' ? resumeData : `Name: ${resumeData.name || 'Candidate'}\nSkills: ${(resumeData.skills || []).join(', ')}\nExperience: ${(resumeData.experience || []).join('; ')}\nEducation: ${(resumeData.education || []).join('; ')}\nSummary: ${resumeData.summary || ''}`;

    const prompt = `Generate a professional cover letter based on the following resume and job description.\n\nResume Information:\n${resumeStr}\n\nJob Description:\n${jobDescription}\n\n${companyName ? `Company: ${companyName}` : ''}\n\nRequirements:\n- Professional tone\n- 3-4 paragraphs\n- Highlight relevant skills and experience\n- Show enthusiasm for the role\n- Include a strong opening and call to action\n- Do NOT use placeholder text like [Your Name] - use the name from the resume\n\nReturn a JSON object with this exact structure:\n{\n  "coverLetter": "<the complete cover letter>",\n  "wordCount": <number>\n}`;

    const result = await generateJSON(prompt, { temperature: 0.7, maxOutputTokens: 4096 });

    if (!result.success) {
      return NextResponse.json(errorResponse(result.error || 'Failed to generate cover letter'), { status: 500 });
    }

    const data = result.data ?? {};

    if (!data.coverLetter) {
      return NextResponse.json(errorResponse('Failed to generate cover letter content'), { status: 500 });
    }

    return NextResponse.json(successResponse({
      coverLetter: data.coverLetter,
      wordCount: typeof data.wordCount === 'number' ? data.wordCount : (data.coverLetter?.split(/\s+/).length || 0),
    }));
  } catch (error: any) {
    return NextResponse.json(errorResponse(error?.message ?? 'Failed to generate cover letter'), { status: 500 });
  }
}