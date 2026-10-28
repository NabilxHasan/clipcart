import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifyAdminSessionToken } from './lib/auth/admin-session';

// Admin-only APIs: rejected here unless the request carries a valid signed admin session.
const ADMIN_API_PATHS = new Set(['/api/auth/users', '/api/auth/delete-user', '/api/auth/reset-password']);

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Guard admin APIs at the edge (the route handlers check again)
  if (ADMIN_API_PATHS.has(pathname)) {
    const authorized = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
    if (!authorized) {
      return applySecurityHeaders(
        NextResponse.json(
          { success: false, error: 'Unauthorized: Admin authentication required.' },
          { status: 401 }
        )
      );
    }
  }

  // 2. Baseline security headers; admin pages are never cached or indexed
  const res = NextResponse.next();
  if (pathname.startsWith('/admin')) {
    res.headers.set('Cache-Control', 'private, no-store');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return applySecurityHeaders(res);
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/users', '/api/auth/delete-user', '/api/auth/reset-password'],
};
