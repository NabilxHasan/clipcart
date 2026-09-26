import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: max 5 failed attempts per 5 minutes per IP
    const limit = checkRateLimit(`admin_verify:${clientIp}`, 5, 5 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Security Lockout: Too many failed passcode attempts. Please wait ${limit.retryAfterSec} seconds.` 
        },
        { 
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSec) }
        }
      );
    }

    const body = await req.json();
    const passcode = body?.passcode?.trim();

    const expectedPasscode = process.env.ADMIN_MASTER_KEY || 'ClipCart@Admin2026!';

    if (passcode && passcode === expectedPasscode) {
      const cookieStore = await cookies();
      cookieStore.set('clipcart_admin_token', 'clipcart_admin_authorized_v1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid Master Security Key' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process authentication request' },
      { status: 500 }
    );
  }
}
