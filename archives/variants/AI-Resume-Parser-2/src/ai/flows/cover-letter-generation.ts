'use server';

/**
 * @fileOverview Generates personalized cover letters based on resume and job description.
 *
 * - generateCoverLetter - A function that generates a tailored cover letter.
 * - GenerateCoverLetterInput - The input type for the generateCoverLetter function.
 * - GenerateCoverLetterOutput - The return type for the generateCoverLetter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCoverLetterInputSchema = z.object({
    resumeText: z
        .string()
        .describe('The text content of the resume to base the cover letter on.'),
    jobDescription: z
        .string()
        .describe('The job description to tailor the cover letter towards.'),
    companyName: z
        .string()
        .describe('The name of the company being applied to.'),
    hiringManagerName: z
        .string()
        .optional()
        .describe('The name of the hiring manager if known.'),
    tone: z
        .enum(['professional', 'enthusiastic', 'creative'])
        .default('professional')
        .describe('The desired tone of the cover letter.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
    coverLetter: z
        .string()
        .describe('The generated cover letter text.'),
    keyHighlights: z
        .array(z.string())
        .describe('Key qualifications highlighted from the resume.'),
    suggestedSubjectLine: z
        .string()
        .describe('A suggested email subject line for the application.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
    return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateCoverLetterPrompt',
    input: { schema: GenerateCoverLetterInputSchema },
    output: { schema: GenerateCoverLetterOutputSchema },
    prompt: `You are an expert career coach and professional cover letter writer. Your task is to generate a compelling, personalized cover letter that will help the candidate stand out.

TONE GUIDELINES:
{{#if (eq tone "professional")}}
- Use formal, polished language
- Focus on qualifications and achievements
- Maintain a confident but not boastful tone
{{/if}}
{{#if (eq tone "enthusiastic")}}
- Show genuine excitement about the opportunity
- Use energetic, positive language
- Highlight passion for the field
{{/if}}
{{#if (eq tone "creative")}}
- Use creative language and compelling storytelling
- Show personality and uniqueness
- Make the letter memorable and engaging
{{/if}}

COVER LETTER STRUCTURE:
1. Opening: Hook the reader with a compelling introduction
2. Why This Company: Show genuine interest in the company
3. Key Qualifications: Match 2-3 key skills from resume to job requirements
4. Achievements: Highlight quantifiable accomplishments
5. Cultural Fit: Demonstrate alignment with company values
6. Call to Action: Strong, confident closing

RESUME CONTENT:
{{{resumeText}}}

JOB DESCRIPTION:
{{{jobDescription}}}

COMPANY NAME: {{{companyName}}}
{{#if hiringManagerName}}HIRING MANAGER: {{{hiringManagerName}}}{{/if}}

REQUIREMENTS:
1. Reference specific requirements from the job description
2. Include quantifiable achievements from the resume
3. Keep the letter concise (250-400 words)
4. Personalize for the company
5. Avoid generic phrases like "I am writing to apply..."
6. Use strong action verbs

Please generate a tailored cover letter along with key highlights and a suggested email subject line.`,
});

const generateCoverLetterFlow = ai.defineFlow(
    {
        name: 'generateCoverLetterFlow',
        inputSchema: GenerateCoverLetterInputSchema,
        outputSchema: GenerateCoverLetterOutputSchema,
    },
    async input => {
        const { output } = await prompt(input);
        return output!;
    }
);
