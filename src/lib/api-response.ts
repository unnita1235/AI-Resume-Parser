/**
 * Standardized API Response Format
 * All API endpoints should use these functions for consistency
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

/**
 * Success response wrapper
 * @param data The data to return
 * @param message Optional message (not used, kept for backward compatibility)
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Error response wrapper
 * @param error Error message
 */
export function errorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validation error helper
 * @param fieldName The field that failed validation
 * @param reason The reason why validation failed
 */
export function validationError(fieldName: string, reason: string): ApiResponse {
  return errorResponse(`${fieldName}: ${reason}`);
}
