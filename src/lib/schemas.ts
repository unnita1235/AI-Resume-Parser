/**
 * Zod schemas for API response validation
 *
 * Provides runtime type checking for all API responses to catch
 * malformed data before it causes runtime errors.
 */

import { z } from 'zod';

// ==================== RESUME SCHEMAS ====================

export const ParsedResumeDataSchema = z.object({
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  linkedin: z.string().nullable(),
  github: z.string().nullable(),
  skills: z.array(z.string()),
  experience: z.array(z.string()),
  education: z.array(z.string()),
  summary: z.string(),
  accuracy: z.number().optional(),
  parseMethod: z.enum(['ai', 'regex', 'demo']).optional(),
});

export const ParseResponseSchema = z.object({
  success: z.boolean(),
  data: ParsedResumeDataSchema,
  resumeId: z.string().optional(),
  message: z.string(),
  mode: z.string().optional(),
  warning: z.string().optional(),
  error: z.string().optional(),
});

// ==================== ATS OPTIMIZATION SCHEMAS ====================

export const ATSOptimizationResultSchema = z.object({
  success: z.boolean(),
  score: z.number(),
  missingKeywords: z.array(z.string()),
  recommendations: z.array(z.string()),
  issues: z.array(z.string()),
  error: z.string().optional(),
});

// ==================== TONE ADJUSTMENT SCHEMAS ====================

export const ToneAdjustmentResultSchema = z.object({
  success: z.boolean(),
  adjustedText: z.string(),
  summary: z.string(),
  originalTone: z.string().optional(),
  targetTone: z.string().optional(),
  error: z.string().optional(),
});

// ==================== ACTION VERB SCHEMAS ====================

export const ActionVerbResultSchema = z.object({
  success: z.boolean(),
  enhancedText: z.string(),
  changedVerbs: z.array(z.object({
    original: z.string(),
    enhanced: z.string(),
    context: z.string(),
  })),
  totalChanges: z.number(),
  error: z.string().optional(),
});

// ==================== COVER LETTER SCHEMAS ====================

export const CoverLetterResultSchema = z.object({
  success: z.boolean(),
  coverLetter: z.string(),
  wordCount: z.number().optional(),
  error: z.string().optional(),
});

// ==================== HEALTH CHECK SCHEMAS ====================

export const HealthCheckResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy', 'degraded']),
  timestamp: z.string(),
  uptime: z.number().optional(),
  mode: z.string().optional(),
  database: z.string().optional(),
  version: z.string(),
  services: z.record(z.string()).optional(),
});

export const AIHealthResponseSchema = z.object({
  success: z.boolean(),
  geminiStatus: z.enum(['available', 'unavailable', 'error']),
  message: z.string(),
  responseTime: z.number().optional(),
});

// ==================== STATS SCHEMAS ====================

export const StatsResponseSchema = z.object({
  success: z.boolean(),
  stats: z.object({
    uptime: z.number(),
    totalRequests: z.number(),
    totalParsedResumes: z.number(),
    errors: z.number(),
    mode: z.string(),
    databaseConnected: z.boolean(),
  }),
});

// ==================== UTILITY FUNCTIONS ====================

/**
 * Safely validates API response data with fallback
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param fallback - Fallback value if validation fails
 * @returns Validated data or fallback
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fallback: T
): { data: T; isValid: boolean; error?: string } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { data: result.data, isValid: true };
  }

  console.error('[API Validation Error]', result.error.format());
  return {
    data: fallback,
    isValid: false,
    error: result.error.message
  };
}

// ==================== TYPE EXPORTS ====================

export type ParsedResumeData = z.infer<typeof ParsedResumeDataSchema>;
export type ParseResponse = z.infer<typeof ParseResponseSchema>;
export type ATSOptimizationResult = z.infer<typeof ATSOptimizationResultSchema>;
export type ToneAdjustmentResult = z.infer<typeof ToneAdjustmentResultSchema>;
export type ActionVerbResult = z.infer<typeof ActionVerbResultSchema>;
export type CoverLetterResult = z.infer<typeof CoverLetterResultSchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
export type AIHealthResponse = z.infer<typeof AIHealthResponseSchema>;
export type StatsResponse = z.infer<typeof StatsResponseSchema>;
