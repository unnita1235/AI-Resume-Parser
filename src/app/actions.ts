"use server";

import { enhanceActionVerbs, EnhanceActionVerbsInput } from "@/ai/flows/action-verb-enhancement";
import { optimizeForAts, OptimizeForAtsInput } from "@/ai/flows/optimize-for-ats";
import { adjustTone, ToneAdjustmentInput } from "@/ai/flows/tone-adjustment";
import { generateCoverLetter, GenerateCoverLetterInput } from "@/ai/flows/cover-letter-generation";

/**
 * Formats error for logging with context
 */
function formatError(operation: string, error: unknown, inputPreview?: string): string {
  const errorMsg = error instanceof Error ? error.message : String(error);
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${operation}] Failed: ${errorMsg}${inputPreview ? ` | Input: ${inputPreview}` : ''}`;
}

export async function runOptimizeForAts(input: OptimizeForAtsInput) {
  try {
    return await optimizeForAts(input);
  } catch (error) {
    const inputPreview = input.resumeText?.slice(0, 100) + '...';
    console.error(formatError('ATS Optimization', error, inputPreview));
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`ATS optimization failed: ${errorMsg}`);
  }
}

export async function runEnhanceActionVerbs(input: EnhanceActionVerbsInput) {
  try {
    return await enhanceActionVerbs(input);
  } catch (error) {
    console.error(formatError('Action Verb Enhancement', error, input.bulletPoint));
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Action verb enhancement failed: ${errorMsg}`);
  }
}

export async function runAdjustTone(input: ToneAdjustmentInput) {
  try {
    return await adjustTone(input);
  } catch (error) {
    const inputPreview = input.resume?.slice(0, 100) + '...';
    console.error(formatError('Tone Adjustment', error, inputPreview));
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Tone adjustment failed: ${errorMsg}`);
  }
}

export async function runGenerateCoverLetter(input: GenerateCoverLetterInput) {
  try {
    return await generateCoverLetter(input);
  } catch (error) {
    console.error(formatError('Cover Letter Generation', error));
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Cover letter generation failed: ${errorMsg}`);
  }
}

