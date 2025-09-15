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
  prompt: `You are a resume expert. You will adjust the tone of the resume to be more {{{tone}}}. 

Resume: {{{resume}}}`,
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
