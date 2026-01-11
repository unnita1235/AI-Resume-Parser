'use server';

/**
 * @fileOverview Adjusts the tone of a resume between formal and casual.
 *
 * - adjustTone - A function that adjusts the tone of the resume.
 * - ToneAdjustmentInput - The input type for the adjustTone function.
 * - ToneAdjustmentOutput - The return type for the adjustTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ToneAdjustmentInputSchema = z.object({
  resume: z.string().describe('The resume content to adjust.'),
  tone: z.enum(['formal', 'casual']).describe('The desired tone of the resume.'),
});
export type ToneAdjustmentInput = z.infer<typeof ToneAdjustmentInputSchema>;

const ToneAdjustmentOutputSchema = z.object({
  adjustedResume: z.string().describe('The resume content with the adjusted tone.'),
});
export type ToneAdjustmentOutput = z.infer<typeof ToneAdjustmentOutputSchema>;

export async function adjustTone(input: ToneAdjustmentInput): Promise<ToneAdjustmentOutput> {
  return adjustToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'toneAdjustmentPrompt',
  input: {schema: ToneAdjustmentInputSchema},
  output: {schema: ToneAdjustmentOutputSchema},
  prompt: `You are a professional resume writer and career consultant. Your task is to adjust the tone of the provided resume to be more {{{tone}}} while maintaining professionalism and impact.

TONE GUIDELINES:

FORMAL TONE:
- Use sophisticated vocabulary and complex sentence structures
- Employ industry-specific terminology and technical jargon
- Focus on achievements with quantifiable metrics
- Use third-person perspective where appropriate
- Maintain professional distance and authority

CASUAL TONE:
- Use conversational language while remaining professional
- Include personal touches and direct statements
- Simplify complex concepts for broader understanding
- Use first-person perspective ("I led", "I developed")
- Create a more approachable and relatable tone

IMPORTANT REQUIREMENTS:
1. Preserve all factual information and achievements
2. Maintain the same structure and formatting
3. Keep all contact information unchanged
4. Ensure the tone change enhances rather than diminishes the resume's impact
5. Make the language more engaging and compelling

Resume Content:
{{{resume}}}

Please rewrite the resume with the adjusted tone while maintaining all essential information and improving overall impact.`,
});

const adjustToneFlow = ai.defineFlow(
  {
    name: 'adjustToneFlow',
    inputSchema: ToneAdjustmentInputSchema,
    outputSchema: ToneAdjustmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
