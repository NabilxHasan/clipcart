import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';
import { detectSqlInjection } from '@/lib/security/anti-sqli';

// Clipper changes their own password. There is no server-side clipper session yet, so the current
// password is the proof of identity (same check as login, same rate limit).
export async function POST(req: Request) {
  try {
    const limit = checkRateLimit(`change-password:${getClientIp(req)}`, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many attempts. Please wait ${limit.retryAfterSec} seconds.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      );
    }

    const body = await req.json().catch(() => null);
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
    const currentPassword = typeof body?.currentPassword === 'string' ? body.currentPassword.trim() : '';
    const newPassword = typeof body?.newPassword === 'string' ? body.newPassword.trim() : '';

    if (!identifier || !currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Current and new password are required.' }, { status: 400 });
    }
    if (detectSqlInjection(identifier).isSuspicious) {
      return NextResponse.json({ success: false, error: 'Invalid account identifier.' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'New password must be at least 6 characters.' }, { status: 400 });
    }
    if (newPassword === currentPassword) {
      return NextResponse.json({ success: false, error: 'New password must be different from the current one.' }, { status: 400 });
    }

    const record = await serverAuthStore.findUser(identifier);
    if (!record || !(await serverAuthStore.verifyPassword(record.profile.id, currentPassword))) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect.' }, { status: 401 });
    }

    if (!(await serverAuthStore.setPassword(record.profile.id, newPassword))) {
      return NextResponse.json({ success: false, error: 'Could not save the new password. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Password change failed.' }, { status: 500 });
  }
}
