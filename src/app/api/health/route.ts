import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint
 * Verifies the app is running and database is accessible
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        status: 'ok',
        message: 'Money Manager app is running',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
