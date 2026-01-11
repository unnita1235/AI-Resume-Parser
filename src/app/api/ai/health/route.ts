import { NextResponse } from 'next/server';
import { checkHealth, isConfigured } from '@/lib/geminiClient';

export async function GET() {
  try {
    const healthResult = await checkHealth();

    const response = {
      success: healthResult.available,
      geminiStatus: healthResult.available ? 'available' : 'unavailable',
      message: healthResult.available ? 'Gemini AI is operational' : (healthResult.error || 'Gemini AI is not available'),
      responseTime: healthResult.responseTime,
      configured: isConfigured(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ success: false, geminiStatus: 'error', message: error?.message ?? String(error), configured: isConfigured() }, { status: 500 });
  }
}