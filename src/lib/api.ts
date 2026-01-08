/**
 * API Configuration and Utilities
 *
 * This module provides centralized API configuration for frontend-backend connectivity.
 * It uses NEXT_PUBLIC_API_URL for the Express backend and falls back gracefully.
 */

// Backend API base URL from environment variable
// IMPORTANT: NEXT_PUBLIC_ prefix is required for client-side access in Next.js
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

/**
 * Get the full URL for a backend API endpoint
 * @param endpoint - The API endpoint path (e.g., '/api/parse', '/health')
 * @returns Full URL to the backend endpoint
 */
export function getBackendUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BACKEND_API_URL}${normalizedEndpoint}`;
}

/**
 * Check if the backend is available
 * @returns Promise<boolean> - true if backend is reachable
 */
export async function checkBackendHealth(): Promise<{
  isHealthy: boolean;
  status?: string;
  mode?: string;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(getBackendUrl('/health'), {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        isHealthy: true,
        status: data.status,
        mode: data.mode,
      };
    }

    return {
      isHealthy: false,
      error: `Health check failed with status: ${response.status}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Connection failed';
    return {
      isHealthy: false,
      error: errorMessage,
    };
  }
}

/**
 * Parse a resume file using the backend API
 * @param file - The resume file to parse
 * @returns Parsed resume data
 */
export async function parseResumeWithBackend(file: File): Promise<{
  success: boolean;
  data?: {
    name: string;
    email: string | null;
    phone: string | null;
    linkedin: string | null;
    github: string | null;
    skills: string[];
    experience: string[];
    education: string[];
    summary: string;
    accuracy: number;
    parseMethod: 'ai' | 'regex' | 'demo';
  };
  error?: string;
  mode?: string;
}> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(getBackendUrl('/api/parse'), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Request failed with status: ${response.status}`,
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse resume';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get all parsed resumes from the backend
 * @param limit - Maximum number of resumes to return
 * @param skip - Number of resumes to skip (for pagination)
 */
export async function getResumes(limit = 50, skip = 0): Promise<{
  success: boolean;
  data?: Array<{
    _id: string;
    name: string;
    email: string;
    skills: string[];
    parseMethod: string;
    uploadDate: string;
  }>;
  total?: number;
  mode?: string;
  error?: string;
}> {
  try {
    const url = new URL(getBackendUrl('/api/resumes'));
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('skip', String(skip));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch resumes: ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch resumes';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get demo resumes from the backend
 */
export async function getDemoResumes(): Promise<{
  success: boolean;
  data?: Array<{
    name: string;
    email: string;
    skills: string[];
    parseMethod: string;
  }>;
  error?: string;
}> {
  try {
    const response = await fetch(getBackendUrl('/api/demo-resumes'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch demo resumes: ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch demo resumes';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get backend server statistics
 */
export async function getBackendStats(): Promise<{
  success: boolean;
  stats?: {
    uptime: number;
    totalRequests: number;
    totalParsedResumes: number;
    errors: number;
    mode: string;
    databaseConnected: boolean;
  };
  error?: string;
}> {
  try {
    const response = await fetch(getBackendUrl('/api/stats'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch stats: ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stats';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Log the backend URL on import (for debugging)
if (isBrowser) {
  console.log('[API] Backend URL configured as:', BACKEND_API_URL);
}
