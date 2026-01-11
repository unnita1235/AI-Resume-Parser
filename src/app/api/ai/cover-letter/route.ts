import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/geminiClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeData, jobDescription, companyName } = body ?? {};

    if (!resumeData) {
      return NextResponse.json({ success: false, error: 'resumeData is required' }, { status: 400 });
    }

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json({ success: false, error: 'jobDescription is required and must be a string' }, { status: 400 });
    }

    if (jobDescription.length < 20) {
      return NextResponse.json({ success: false, error: 'Job description is too short. Please provide more details.' }, { status: 400 });
    }

    const resumeStr = typeof resumeData === 'string' ? resumeData : `Name: ${resumeData.name || 'Candidate'}\nSkills: ${(resumeData.skills || []).join(', ')}\nExperience: ${(resumeData.experience || []).join('; ')}\nEducation: ${(resumeData.education || []).join('; ')}\nSummary: ${resumeData.summary || ''}`;

    const prompt = `Generate a professional cover letter based on the following resume and job description.\n\nResume Information:\n${resumeStr}\n\nJob Description:\n${jobDescription}\n\n${companyName ? `Company: ${companyName}` : ''}\n\nRequirements:\n- Professional tone\n- 3-4 paragraphs\n- Highlight relevant skills and experience\n- Show enthusiasm for the role\n- Include a strong opening and call to action\n- Do NOT use placeholder text like [Your Name] - use the name from the resume\n\nReturn a JSON object with this exact structure:\n{\n  "coverLetter": "<the complete cover letter>",\n  "wordCount": <number>\n}`;

    const result = await generateJSON(prompt, { temperature: 0.7, maxOutputTokens: 4096 });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to generate cover letter' }, { status: 500 });
    }

    const data = result.data ?? {};

    const response = {
      success: true,
      coverLetter: data.coverLetter || '',
      wordCount: typeof data.wordCount === 'number' ? data.wordCount : (data.coverLetter?.split(/\s+/).length || 0),
    };

    if (!response.coverLetter) {
      return NextResponse.json({ success: false, error: 'Failed to generate cover letter content' }, { status: 500 });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? String(error) }, { status: 500 });
  }
}