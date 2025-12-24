"use server";

import { enhanceActionVerbs, EnhanceActionVerbsInput } from "@/ai/flows/action-verb-enhancement";
import { optimizeForAts, OptimizeForAtsInput } from "@/ai/flows/optimize-for-ats";
import { adjustTone, ToneAdjustmentInput } from "@/ai/flows/tone-adjustment";
import { generateCoverLetter, GenerateCoverLetterInput } from "@/ai/flows/cover-letter-generation";

export async function runOptimizeForAts(input: OptimizeForAtsInput) {
  try {
    return await optimizeForAts(input);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to optimize for ATS. Please try again.");
  }
}

export async function runEnhanceActionVerbs(input: EnhanceActionVerbsInput) {
  try {
    return await enhanceActionVerbs(input);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to enhance action verbs. Please try again.");
  }
}

export async function runAdjustTone(input: ToneAdjustmentInput) {
  try {
    return await adjustTone(input);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to adjust tone. Please try again.");
  }
}

export async function runGenerateCoverLetter(input: GenerateCoverLetterInput) {
  try {
    return await generateCoverLetter(input);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
}

