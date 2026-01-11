import { NextResponse } from "next/server";

/**
 * Health check endpoint to verify API availability
 * Returns status of the API and any connected services
 */
export async function GET() {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      api: "operational",
      fileProcessing: "operational",
    },
    version: "1.0.0",
  };

  // Check if Google AI API key is configured (same keys as geminiClient.ts)
  const hasAiKey = !!( process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY);

  if (hasAiKey) {
    healthStatus.services = {
      ...healthStatus.services,
      ai: "operational",
    } as typeof healthStatus.services & { ai: string };
  } else {
    healthStatus.services = {
      ...healthStatus.services,
      ai: "unavailable - API key not configured",
    } as typeof healthStatus.services & { ai: string };
  }

  return NextResponse.json(healthStatus, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
