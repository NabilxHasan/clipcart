import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Guard /api/auth/users at the server/edge level
  if (pathname === '/api/auth/users') {
    const adminToken = request.cookies.get('clipcart_admin_token')?.value;
    const authHeader = request.headers.get('authorization');
    const masterKey = process.env.ADMIN_MASTER_KEY || 'ClipCart@Admin2026!';

    const isAuthorized =
      adminToken === 'clipcart_admin_authorized_v1' ||
      authHeader === `Bearer ${masterKey}` ||
      authHeader === masterKey;

    if (!isAuthorized) {
      return applySecurityHeaders(
        NextResponse.json(
          { success: false, error: 'Unauthorized: Admin authentication required.' },
          { status: 401 }
        )
      );
    }
  }

  // 2. Add baseline security headers to normal responses
  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/users',
  ],
};
