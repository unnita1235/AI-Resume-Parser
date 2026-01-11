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
  prompt: `You are a professional resume writer specializing in creating impactful bullet points. Your task is to suggest stronger, more powerful action verbs to start the provided resume bullet point.

ACTION VERB CATEGORIES TO CONSIDER:
- Leadership: Led, Directed, Orchestrated, Spearheaded, Championed
- Achievement: Achieved, Accomplished, Delivered, Exceeded, Surpassed
- Innovation: Developed, Created, Designed, Implemented, Pioneered
- Impact: Improved, Enhanced, Optimized, Streamlined, Transformed
- Management: Managed, Supervised, Coordinated, Facilitated, Mentored
- Technical: Built, Engineered, Programmed, Configured, Deployed

SELECTION CRITERIA:
1. Choose verbs that convey strong action and impact
2. Ensure the verb fits naturally with the rest of the sentence
3. Prioritize verbs that suggest measurable outcomes
4. Avoid weak verbs like "worked", "helped", "assisted"
5. Consider industry-specific terminology when appropriate

Bullet Point to Enhance:
{{{bulletPoint}}}

Please provide exactly 3 alternative action verbs that would make this bullet point more impactful and professional. Return your response as a JSON array of strings containing only the suggested verbs.`,
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
