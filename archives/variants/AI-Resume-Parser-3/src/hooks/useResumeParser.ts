"use client";

/**
 * useResumeParser Hook
 * 
 * React hook for parsing resumes with the backend API.
 * Provides state management for loading, errors, and parsed data.
 * 
 * @module useResumeParser
 */

import { useState, useCallback } from "react";
import {
    parseResume as apiParseResume,
    getATSOptimization as apiGetATSOptimization,
    getToneAdjustment as apiGetToneAdjustment,
    getActionVerbEnhancement as apiGetActionVerbEnhancement,
    generateCoverLetter as apiGenerateCoverLetter,
    ParsedResumeData,
    ParseResponse,
    ATSOptimizationResult,
    ToneAdjustmentResult,
    ActionVerbResult,
    CoverLetterResult,
} from "@/lib/api-client";

// ==================== TYPE DEFINITIONS ====================

/**
 * State structure for the resume parser hook
 */
export interface ResumeParserState {
    /** Whether a parsing operation is in progress */
    isLoading: boolean;
    /** Whether an ATS optimization is in progress */
    isOptimizing: boolean;
    /** Whether a tone adjustment is in progress */
    isAdjustingTone: boolean;
    /** Whether action verb enhancement is in progress */
    isEnhancingVerbs: boolean;
    /** Whether cover letter generation is in progress */
    isGeneratingCoverLetter: boolean;
    /** Error message if any operation failed */
    error: string | null;
    /** Whether the last operation was successful */
    success: boolean;
    /** The parsed resume data */
    data: ParsedResumeData | null;
    /** The resume ID from the database */
    resumeId: string | null;
    /** ATS optimization results */
    atsResult: ATSOptimizationResult | null;
    /** Tone adjustment results */
    toneResult: ToneAdjustmentResult | null;
    /** Action verb enhancement results */
    verbsResult: ActionVerbResult | null;
    /** Generated cover letter */
    coverLetterResult: CoverLetterResult | null;
}

/**
 * Options for useResumeParser hook
 */
export interface UseResumeParserOptions {
    /** Callback when parsing succeeds */
    onSuccess?: (data: ParsedResumeData, resumeId?: string) => void;
    /** Callback when parsing fails */
    onError?: (error: string) => void;
    /** API key for authenticated requests */
    apiKey?: string;
}

/**
 * Return type for the useResumeParser hook
 */
export interface UseResumeParserReturn extends ResumeParserState {
    /** Parse a resume file */
    parseResume: (file: File) => Promise<ParseResponse>;
    /** Get ATS optimization for resume text */
    getATSOptimization: (resumeText: string, jobDescription?: string) => Promise<ATSOptimizationResult>;
    /** Adjust the tone of text */
    getToneAdjustment: (text: string, tone: 'formal' | 'casual') => Promise<ToneAdjustmentResult>;
    /** Enhance action verbs in text */
    getActionVerbEnhancement: (text: string) => Promise<ActionVerbResult>;
    /** Generate a cover letter */
    generateCoverLetter: (jobDescription: string, companyName?: string) => Promise<CoverLetterResult>;
    /** Reset all state */
    reset: () => void;
    /** Clear error state only */
    clearError: () => void;
}

// ==================== INITIAL STATE ====================

const initialState: ResumeParserState = {
    isLoading: false,
    isOptimizing: false,
    isAdjustingTone: false,
    isEnhancingVerbs: false,
    isGeneratingCoverLetter: false,
    error: null,
    success: false,
    data: null,
    resumeId: null,
    atsResult: null,
    toneResult: null,
    verbsResult: null,
    coverLetterResult: null,
};

// ==================== HOOK IMPLEMENTATION ====================

/**
 * Hook for parsing resumes and using AI enhancement features
 * 
 * @param options - Configuration options
 * @returns State and functions for resume operations
 * 
 * @example
 * ```tsx
 * const { parseResume, data, isLoading, error } = useResumeParser({
 *   onSuccess: (data) => console.log('Parsed:', data.name),
 *   onError: (error) => console.error('Failed:', error),
 * });
 * 
 * const handleUpload = async (file: File) => {
 *   await parseResume(file);
 * };
 * ```
 */
export function useResumeParser(
    options: UseResumeParserOptions = {}
): UseResumeParserReturn {
    const { onSuccess, onError, apiKey } = options;
    const [state, setState] = useState<ResumeParserState>(initialState);

    /**
     * Parse a resume file
     */
    const parseResume = useCallback(
        async (file: File): Promise<ParseResponse> => {
            // Validate file
            if (!file) {
                const error = "No file provided";
                setState((prev) => ({ ...prev, error, success: false }));
                onError?.(error);
                return { success: false, data: {} as ParsedResumeData, message: error, error };
            }

            // Validate file type
            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (!allowedTypes.includes(file.type)) {
                const error = "Invalid file type. Please upload a PDF or Word document.";
                setState((prev) => ({ ...prev, error, success: false }));
                onError?.(error);
                return { success: false, data: {} as ParsedResumeData, message: error, error };
            }

            // Validate file size (10MB max)
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                const error = "File too large. Maximum size is 10MB.";
                setState((prev) => ({ ...prev, error, success: false }));
                onError?.(error);
                return { success: false, data: {} as ParsedResumeData, message: error, error };
            }

            setState((prev) => ({
                ...prev,
                isLoading: true,
                error: null,
                success: false,
            }));

            try {
                const response = await apiParseResume(file, apiKey);

                if (response.success && response.data) {
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        success: true,
                        data: response.data,
                        resumeId: response.resumeId || null,
                        error: null,
                    }));
                    onSuccess?.(response.data, response.resumeId);
                } else {
                    const errorMessage = response.error || response.message || "Failed to parse resume";
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        success: false,
                        error: errorMessage,
                    }));
                    onError?.(errorMessage);
                }

                return response;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    success: false,
                    error: errorMessage,
                }));
                onError?.(errorMessage);
                return {
                    success: false,
                    data: {} as ParsedResumeData,
                    message: errorMessage,
                    error: errorMessage,
                };
            }
        },
        [apiKey, onSuccess, onError]
    );

    /**
     * Get ATS optimization for resume text
     */
    const getATSOptimization = useCallback(
        async (resumeText: string, jobDescription?: string): Promise<ATSOptimizationResult> => {
            if (!resumeText?.trim()) {
                const result: ATSOptimizationResult = {
                    success: false,
                    score: 0,
                    missingKeywords: [],
                    recommendations: [],
                    issues: [],
                    error: "Resume text is required",
                };
                return result;
            }

            setState((prev) => ({ ...prev, isOptimizing: true, error: null }));

            try {
                const result = await apiGetATSOptimization(resumeText, jobDescription);
                setState((prev) => ({
                    ...prev,
                    isOptimizing: false,
                    atsResult: result,
                    error: result.success ? null : result.error || null,
                }));
                return result;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "ATS optimization failed";
                setState((prev) => ({
                    ...prev,
                    isOptimizing: false,
                    error: errorMessage,
                }));
                return {
                    success: false,
                    score: 0,
                    missingKeywords: [],
                    recommendations: [],
                    issues: [],
                    error: errorMessage,
                };
            }
        },
        []
    );

    /**
     * Adjust the tone of text
     */
    const getToneAdjustment = useCallback(
        async (text: string, tone: 'formal' | 'casual'): Promise<ToneAdjustmentResult> => {
            if (!text?.trim()) {
                return {
                    success: false,
                    adjustedText: "",
                    summary: "",
                    error: "Text is required",
                };
            }

            setState((prev) => ({ ...prev, isAdjustingTone: true, error: null }));

            try {
                const result = await apiGetToneAdjustment(text, tone);
                setState((prev) => ({
                    ...prev,
                    isAdjustingTone: false,
                    toneResult: result,
                    error: result.success ? null : result.error || null,
                }));
                return result;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Tone adjustment failed";
                setState((prev) => ({
                    ...prev,
                    isAdjustingTone: false,
                    error: errorMessage,
                }));
                return {
                    success: false,
                    adjustedText: "",
                    summary: "",
                    error: errorMessage,
                };
            }
        },
        []
    );

    /**
     * Enhance action verbs in text
     */
    const getActionVerbEnhancement = useCallback(
        async (text: string): Promise<ActionVerbResult> => {
            if (!text?.trim()) {
                return {
                    success: false,
                    enhancedText: "",
                    changedVerbs: [],
                    totalChanges: 0,
                    error: "Text is required",
                };
            }

            setState((prev) => ({ ...prev, isEnhancingVerbs: true, error: null }));

            try {
                const result = await apiGetActionVerbEnhancement(text);
                setState((prev) => ({
                    ...prev,
                    isEnhancingVerbs: false,
                    verbsResult: result,
                    error: result.success ? null : result.error || null,
                }));
                return result;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Verb enhancement failed";
                setState((prev) => ({
                    ...prev,
                    isEnhancingVerbs: false,
                    error: errorMessage,
                }));
                return {
                    success: false,
                    enhancedText: "",
                    changedVerbs: [],
                    totalChanges: 0,
                    error: errorMessage,
                };
            }
        },
        []
    );

    /**
     * Generate a cover letter
     */
    const generateCoverLetter = useCallback(
        async (jobDescription: string, companyName?: string): Promise<CoverLetterResult> => {
            if (!state.data) {
                return {
                    success: false,
                    coverLetter: "",
                    error: "No resume data available. Please parse a resume first.",
                };
            }

            if (!jobDescription?.trim()) {
                return {
                    success: false,
                    coverLetter: "",
                    error: "Job description is required",
                };
            }

            setState((prev) => ({ ...prev, isGeneratingCoverLetter: true, error: null }));

            try {
                const result = await apiGenerateCoverLetter(state.data, jobDescription, companyName);
                setState((prev) => ({
                    ...prev,
                    isGeneratingCoverLetter: false,
                    coverLetterResult: result,
                    error: result.success ? null : result.error || null,
                }));
                return result;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Cover letter generation failed";
                setState((prev) => ({
                    ...prev,
                    isGeneratingCoverLetter: false,
                    error: errorMessage,
                }));
                return {
                    success: false,
                    coverLetter: "",
                    error: errorMessage,
                };
            }
        },
        [state.data]
    );

    /**
     * Reset all state to initial values
     */
    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    /**
     * Clear only the error state
     */
    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    return {
        ...state,
        parseResume,
        getATSOptimization,
        getToneAdjustment,
        getActionVerbEnhancement,
        generateCoverLetter,
        reset,
        clearError,
    };
}

export default useResumeParser;
