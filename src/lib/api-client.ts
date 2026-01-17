/**
 * API Client for AI Resume Parser
 * 
 * This module provides type-safe functions for communicating with the backend API.
 * All functions include comprehensive error handling, timeout support, and proper typing.
 * 
 * @module api-client
 */

// ==================== CONFIGURATION ====================

/**
 * Backend API URL
 * In production, this should point to your Render backend.
 * In development, it defaults to localhost.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const DEFAULT_TIMEOUT = 30000;

// ==================== TYPE DEFINITIONS ====================

/**
 * Parsed resume data structure
 */
export interface ParsedResumeData {
  name: string;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  skills: string[];
  experience: string[];
  education: string[];
  summary: string;
  accuracy?: number;
  parseMethod?: 'ai' | 'regex' | 'demo';
}

/**
 * Response from the parse endpoint
 */
export interface ParseResponse {
  success: boolean;
  data: ParsedResumeData;
  resumeId?: string;
  message: string;
  mode?: string;
  warning?: string;
  error?: string;
}

/**
 * ATS optimization result
 */
export interface ATSOptimizationResult {
  success: boolean;
  score: number;
  missingKeywords: string[];
  recommendations: string[];
  issues: string[];
  error?: string;
}

/**
 * Tone adjustment result
 */
export interface ToneAdjustmentResult {
  success: boolean;
  adjustedText: string;
  summary: string;
  originalTone?: string;
  targetTone?: string;
  error?: string;
}

/**
 * Action verb enhancement result
 */
export interface ActionVerbResult {
  success: boolean;
  enhancedText: string;
  changedVerbs: Array<{
    original: string;
    enhanced: string;
    context: string;
  }>;
  totalChanges: number;
  error?: string;
}

/**
 * Cover letter generation result
 */
export interface CoverLetterResult {
  success: boolean;
  coverLetter: string;
  wordCount?: number;
  error?: string;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  mode: string;
  database: string;
  version: string;
}

/**
 * AI health check response
 */
export interface AIHealthResponse {
  success: boolean;
  geminiStatus: 'available' | 'unavailable' | 'error';
  message: string;
  responseTime?: number;
}

/**
 * Stats response
 */
export interface StatsResponse {
  success: boolean;
  stats: {
    uptime: number;
    totalRequests: number;
    totalParsedResumes: number;
    errors: number;
    mode: string;
    databaseConnected: boolean;
  };
}

/**
 * API error structure
 */
export interface APIError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Creates an AbortController with timeout
 * @param timeout - Timeout in milliseconds
 * @returns Object with controller, signal, and cleanup function
 */
function createTimeoutController(timeout: number = DEFAULT_TIMEOUT): {
  controller: AbortController;
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return {
    controller,
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId),
  };
}

/**
 * Handles fetch errors and provides consistent error messages
 * @param error - The caught error
 * @param operation - Name of the operation for context
 * @returns Formatted error object
 */
function handleFetchError(error: unknown, operation: string): APIError {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: `Request timeout: ${operation} took too long to respond`,
        statusCode: 408,
      };
    }
    return {
      success: false,
      error: error.message,
      message: `${operation} failed: ${error.message}`,
    };
  }
  return {
    success: false,
    error: 'Unknown error occurred',
    message: `${operation} failed with unknown error`,
  };
}

// ==================== API FUNCTIONS ====================

/**
 * Parse a resume file using the backend API
 * 
 * @param file - The resume file to parse (PDF, DOC, or DOCX)
 * @param apiKey - Optional API key for authenticated requests
 * @returns Promise resolving to parsed resume data
 * 
 * @example
 * ```typescript
 * const result = await parseResume(file);
 * if (result.success) {
 *   console.log(result.data.name);
 * }
 * ```
 */
export async function parseResume(file: File, apiKey?: string): Promise<ParseResponse> {
  const { signal, cleanup } = createTimeoutController(60000); // 60s for file upload
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const headers: HeadersInit = {};
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
    
    const response = await fetch(`${API_URL}/api/parse`, {
      method: 'POST',
      body: formData,
      headers,
      signal,
    });
    
    cleanup();
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        data: {} as ParsedResumeData,
        message: data.message || 'Failed to parse resume',
        error: data.error || `HTTP ${response.status}`,
      };
    }
    
    return data as ParseResponse;
  } catch (error) {
    cleanup();
    const apiError = handleFetchError(error, 'Resume parsing');
    return {
      success: false,
      data: {} as ParsedResumeData,
      message: apiError.message || apiError.error,
      error: apiError.error,
    };
  }
}

/**
 * Get ATS optimization suggestions for resume text
 * 
 * @param resumeText - The resume text to optimize
 * @param jobDescription - Optional job description for targeted optimization
 * @returns Promise resolving to ATS optimization results
 * 
 * @example
 * ```typescript
 * const result = await getATSOptimization(resumeText, jobDescription);
 * console.log(`ATS Score: ${result.score}`);
 * ```
 */
export async function getATSOptimization(
  resumeText: string,
  jobDescription?: string
): Promise<ATSOptimizationResult> {
  const { signal, cleanup } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/ai/ats-optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText, jobDescription }),
      signal,
    });
    
    cleanup();
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        score: 0,
        missingKeywords: [],
        recommendations: [],
        issues: [],
        error: data.error || `HTTP ${response.status}`,
      };
    }
    
    return data as ATSOptimizationResult;
  } catch (error) {
    cleanup();
    const apiError = handleFetchError(error, 'ATS optimization');
    return {
      success: false,
      score: 0,
      missingKeywords: [],
      recommendations: [],
      issues: [],
      error: apiError.error,
    };
  }
}

/**
 * Adjust the tone of resume text
 * 
 * @param text - The text to adjust
 * @param targetTone - Target tone: 'formal' or 'casual'
 * @returns Promise resolving to tone-adjusted text
 * 
 * @example
 * ```typescript
 * const result = await getToneAdjustment(text, 'formal');
 * console.log(result.adjustedText);
 * ```
 */
export async function getToneAdjustment(
  text: string,
  targetTone: 'formal' | 'casual'
): Promise<ToneAdjustmentResult> {
  const { signal, cleanup } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/ai/tone-adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, tone: targetTone }),
      signal,
    });
    
    cleanup();
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        adjustedText: '',
        summary: '',
        error: data.error || `HTTP ${response.status}`,
      };
    }
    
    return data as ToneAdjustmentResult;
  } catch (error) {
    cleanup();
    const apiError = handleFetchError(error, 'Tone adjustment');
    return {
      success: false,
      adjustedText: '',
      summary: '',
      error: apiError.error,
    };
  }
}

/**
 * Enhance action verbs in resume text
 * 
 * @param text - The resume text to enhance
 * @returns Promise resolving to enhanced text with changed verbs list
 * 
 * @example
 * ```typescript
 * const result = await getActionVerbEnhancement(bulletPoints);
 * console.log(`Made ${result.totalChanges} improvements`);
 * ```
 */
export async function getActionVerbEnhancement(text: string): Promise<ActionVerbResult> {
  const { signal, cleanup } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/ai/action-verbs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      signal,
    });
    
    cleanup();
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        enhancedText: '',
        changedVerbs: [],
        totalChanges: 0,
        error: data.error || `HTTP ${response.status}`,
      };
    }
    
    return data as ActionVerbResult;
  } catch (error) {
    cleanup();
    const apiError = handleFetchError(error, 'Action verb enhancement');
    return {
      success: false,
      enhancedText: '',
      changedVerbs: [],
      totalChanges: 0,
      error: apiError.error,
    };
  }
}

/**
 * Generate a cover letter based on resume and job description
 * 
 * @param resumeData - Parsed resume data or summary text
 * @param jobDescription - The job description to tailor the cover letter for
 * @param companyName - Optional company name for personalization
 * @returns Promise resolving to generated cover letter
 * 
 * @example
 * ```typescript
 * const result = await generateCoverLetter(resumeData, jobDescription, 'Google');
 * console.log(result.coverLetter);
 * ```
 */
export async function generateCoverLetter(
  resumeData: ParsedResumeData | string,
  jobDescription: string,
  companyName?: string
): Promise<CoverLetterResult> {
  const { signal, cleanup } = createTimeoutController(45000); // 45s for generation
  
  try {
    const response = await fetch(`${API_URL}/api/ai/cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData, jobDescription, companyName }),
      signal,
    });
    
    cleanup();
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        coverLetter: '',
        error: data.error || `HTTP ${response.status}`,
      };
    }
    
    return data as CoverLetterResult;
  } catch (error) {
    cleanup();
    const apiError = handleFetchError(error, 'Cover letter generation');
    return {
      success: false,
      coverLetter: '',
      error: apiError.error,
    };
  }
}

/**
 * Check backend health status
 * 
 * @returns Promise resolving to health check response
 * 
 * @example
 * ```typescript
 * const health = await checkHealth();
 * console.log(`Backend status: ${health.status}`);
 * ```
 */
export async function checkHealth(): Promise<HealthCheckResponse> {
  const { signal, cleanup } = createTimeoutController(5000);
  
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
      signal,
    });
    
    cleanup();
    
    if (!response.ok) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: 0,
        mode: 'unknown',
        database: 'unknown',
        version: 'unknown',
      };
    }
    
    return await response.json() as HealthCheckResponse;
  } catch (error) {
    cleanup();
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: 0,
      mode: 'offline',
      database: 'disconnected',
      version: 'unknown',
    };
  }
}

/**
 * Check AI (Gemini) service health
 * 
 * @returns Promise resolving to AI health status
 */
export async function checkAIHealth(): Promise<AIHealthResponse> {
  const { signal, cleanup } = createTimeoutController(10000);
  
  try {
    const response = await fetch(`${API_URL}/api/ai/health`, {
      method: 'GET',
      signal,
    });
    
    cleanup();
    
    const data = await response.json();
    return data as AIHealthResponse;
  } catch (error) {
    cleanup();
    return {
      success: false,
      geminiStatus: 'unavailable',
      message: 'Could not reach AI service',
    };
  }
}

/**
 * Get server statistics
 * 
 * @returns Promise resolving to server stats
 */
export async function getStats(): Promise<StatsResponse> {
  const { signal, cleanup } = createTimeoutController(5000);
  
  try {
    const response = await fetch(`${API_URL}/api/stats`, {
      method: 'GET',
      signal,
    });
    
    cleanup();
    
    return await response.json() as StatsResponse;
  } catch (error) {
    cleanup();
    return {
      success: false,
      stats: {
        uptime: 0,
        totalRequests: 0,
        totalParsedResumes: 0,
        errors: 0,
        mode: 'offline',
        databaseConnected: false,
      },
    };
  }
}

/**
 * Get all parsed resumes from the database
 * 
 * @param limit - Maximum number of resumes to fetch
 * @param skip - Number of resumes to skip (for pagination)
 * @returns Promise resolving to array of parsed resumes
 */
export async function getResumes(
  limit: number = 50,
  skip: number = 0
): Promise<{ success: boolean; data: ParsedResumeData[]; total?: number; error?: string }> {
  const { signal, cleanup } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/resumes?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      signal,
    });
    
    cleanup();
    
    return await response.json();
  } catch (error) {
    cleanup();
    const apiError = handleFetchError(error, 'Fetching resumes');
    return {
      success: false,
      data: [],
      error: apiError.error,
    };
  }
}

/**
 * Get a single resume by ID
 * 
 * @param id - Resume document ID
 * @returns Promise resolving to resume data
 */
export async function getResumeById(
  id: string
): Promise<{ success: boolean; data?: ParsedResumeData; error?: string }> {
  const { signal, cleanup } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/resumes/${id}`, {
      method: 'GET',
      signal,
    });
    
    cleanup();
    
    return await response.json();
  } catch (error) {
    cleanup();
    const apiError = handleFetchError(error, 'Fetching resume');
    return {
      success: false,
      error: apiError.error,
    };
  }
}

// ==================== EXPORTS ====================

export default {
  parseResume,
  getATSOptimization,
  getToneAdjustment,
  getActionVerbEnhancement,
  generateCoverLetter,
  checkHealth,
  checkAIHealth,
  getStats,
  getResumes,
  getResumeById,
};
