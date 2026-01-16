import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";

/**
 * Health check endpoint to verify API availability
 * Returns status of the API and any connected services
 */
export async function GET() {
  // Check if Google AI API key is configured (same keys as geminiClient.ts)
  const hasAiKey = !!(process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY);

  const healthStatus = {
    status: hasAiKey ? "healthy" : "degraded",
    services: {
      api: "operational",
      fileProcessing: "operational",
      ai: hasAiKey ? "operational" : "unavailable - API key not configured",
    },
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  };

  return NextResponse.json(successResponse(healthStatus), {
    status: hasAiKey ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
