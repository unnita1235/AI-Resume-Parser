// src/ai/flows/action-verb-enhancement.ts
'use server';

/**
 * @fileOverview Enhances action verbs in resume bullet points.
 *
 * - enhanceActionVerbs - A function that suggests stronger action verbs for a given resume bullet point.
 * - EnhanceActionVerbsInput - The input type for the enhanceActionVerbs function.
 * - EnhanceActionVerbsOutput - The return type for the enhanceActionVerbs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceActionVerbsInputSchema = z.object({
  bulletPoint: z.string().describe('The resume bullet point to enhance.'),
});
export type EnhanceActionVerbsInput = z.infer<typeof EnhanceActionVerbsInputSchema>;

const EnhanceActionVerbsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested stronger action verbs.'),
});
export type EnhanceActionVerbsOutput = z.infer<typeof EnhanceActionVerbsOutputSchema>;

export async function enhanceActionVerbs(
  input: EnhanceActionVerbsInput
): Promise<EnhanceActionVerbsOutput> {
  return enhanceActionVerbsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceActionVerbsPrompt',
  input: {schema: EnhanceActionVerbsInputSchema},
  output: {schema: EnhanceActionVerbsOutputSchema},
  prompt: `You are a resume expert. Your job is to suggest stronger action verbs to start the bullet point.

Suggest three alternative action verbs to start the following resume bullet point.  Return your answer as a JSON array.

Bullet Point: {{{bulletPoint}}}`,
});

const enhanceActionVerbsFlow = ai.defineFlow(
  {
    name: 'enhanceActionVerbsFlow',
    inputSchema: EnhanceActionVerbsInputSchema,
    outputSchema: EnhanceActionVerbsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
