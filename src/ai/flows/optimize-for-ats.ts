'use server';

/**
 * @fileOverview Analyzes a resume for ATS compatibility and provides recommendations.
 *
 * - optimizeForAts - A function that analyzes a resume and provides ATS optimization recommendations.
 * - OptimizeForAtsInput - The input type for the optimizeForAts function.
 * - OptimizeForAtsOutput - The return type for the optimizeForAts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeForAtsInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be analyzed.'),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description to tailor the resume towards.'),
});
export type OptimizeForAtsInput = z.infer<typeof OptimizeForAtsInputSchema>;

const OptimizeForAtsOutputSchema = z.object({
  atsCompatibilityScore: z
    .number()
    .describe('A score indicating the resume ATS compatibility (0-100).'),
  missingKeywords: z
    .array(z.string())
    .describe('A list of keywords missing from the resume.'),
  recommendations: z
    .string()
    .describe('Recommendations to improve the resume ATS score.'),
});
export type OptimizeForAtsOutput = z.infer<typeof OptimizeForAtsOutputSchema>;

export async function optimizeForAts(input: OptimizeForAtsInput): Promise<OptimizeForAtsOutput> {
  return optimizeForAtsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeForAtsPrompt',
  input: {schema: OptimizeForAtsInputSchema},
  output: {schema: OptimizeForAtsOutputSchema},
  prompt: `You are an expert resume optimization consultant specializing in Applicant Tracking Systems (ATS).

You will analyze the resume and provide recommendations to improve its ATS compatibility score.

Analyze the resume content and identify missing keywords that are relevant to the job description (if provided) and the resume content.

Provide a compatibility score between 0 and 100.

Resume:
{{{resumeText}}}

Job Description (Optional):
{{{jobDescription}}}

Recommendations:`,
});

const optimizeForAtsFlow = ai.defineFlow(
  {
    name: 'optimizeForAtsFlow',
    inputSchema: OptimizeForAtsInputSchema,
    outputSchema: OptimizeForAtsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
