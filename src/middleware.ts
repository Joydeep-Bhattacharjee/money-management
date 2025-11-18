import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware runs on every request
export function middleware(request: NextRequest) {
  // Ensure DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not configured in environment');
    // Set a default for development
    if (process.env.NODE_ENV !== 'production') {
      process.env.DATABASE_URL = 'file:./prisma/dev.db';
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
