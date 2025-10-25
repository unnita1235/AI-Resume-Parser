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

Your task is to analyze the provided resume and provide comprehensive recommendations to improve its ATS compatibility score.

ANALYSIS CRITERIA:
1. Keyword density and relevance
2. Formatting and structure
3. Skills and experience alignment
4. Industry-specific terminology
5. Action verbs and quantifiable achievements

SCORING GUIDELINES:
- 90-100: Excellent ATS compatibility
- 80-89: Good ATS compatibility with minor improvements needed
- 70-79: Fair ATS compatibility with several improvements needed
- 60-69: Poor ATS compatibility requiring significant improvements
- Below 60: Very poor ATS compatibility requiring major overhaul

Resume Content:
{{{resumeText}}}

Job Description (Optional):
{{{jobDescription}}}

Please provide:
1. ATS compatibility score (0-100)
2. List of missing keywords from the job description
3. Specific recommendations for improvement

Focus on actionable, specific advice that will improve the resume's chances of passing ATS screening.`,
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
