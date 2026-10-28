import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';
import {
  ADMIN_COOKIE,
  LEGACY_ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  isAdminLoginConfigured,
  passcodeMatches,
} from '@/lib/auth/admin-session';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit: max 5 attempts per 5 minutes per IP
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

    // Fail closed: no usable ADMIN_MASTER_KEY in the environment means nobody can unlock the desk
    if (!(await isAdminLoginConfigured())) {
      return NextResponse.json(
        { success: false, error: 'Admin login is disabled until ADMIN_MASTER_KEY is set on the server.' },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => null);
    const passcode = typeof body?.passcode === 'string' ? body.passcode.trim() : '';

    if (passcode && (await passcodeMatches(passcode))) {
      const token = await createAdminSessionToken();
      if (!token) {
        return NextResponse.json({ success: false, error: 'Admin session could not be created.' }, { status: 503 });
      }
      const cookieStore = await cookies();
      cookieStore.set(ADMIN_COOKIE, token, adminCookieOptions);
      cookieStore.delete(LEGACY_ADMIN_COOKIE);

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
