import { NextResponse } from "next/server";

/**
 * Service status type for health check
 */
interface ServiceStatus {
  api: string;
  fileProcessing: string;
  ai: string;
}

interface HealthStatus {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  services: ServiceStatus;
  version: string;
}

/**
 * Health check endpoint to verify API availability
 * Returns status of the API and any connected services
 */
export async function GET() {
  const services: ServiceStatus = {
    api: "operational",
    fileProcessing: "operational",
    ai: "unknown",
  };

  // Check if Google AI API key is configured
  const hasAiKey = !!process.env.GOOGLE_GENAI_API_KEY;

  if (hasAiKey) {
    services.ai = "operational";
  } else {
    services.ai = "unavailable - API key not configured";
  }

  // Determine overall status based on service health
  const allOperational = Object.values(services).every(
    (status) => status === "operational"
  );
  const anyUnavailable = Object.values(services).some(
    (status) => status.includes("unavailable")
  );

  const healthStatus: HealthStatus = {
    status: allOperational ? "healthy" : anyUnavailable ? "degraded" : "healthy",
    timestamp: new Date().toISOString(),
    services,
    version: "1.0.0",
  };

  return NextResponse.json(healthStatus, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
