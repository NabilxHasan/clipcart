import { randomInt } from 'crypto';
import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { hasAdminSession } from '@/lib/auth/require-admin';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';
import { detectSqlInjection } from '@/lib/security/anti-sqli';

// Admin-assisted password reset (there is no email delivery yet): the admin verifies the clipper on
// WhatsApp, generates a one-time temporary password here, sends it to them, and they change it after
// logging in. The temporary password is returned once and never stored in plain text.
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'; // no 0/o, 1/l/i look-alikes

function temporaryPassword(): string {
  const group = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');
  return `${group()}-${group()}-${group()}`;
}

export async function POST(req: Request) {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }
    const limit = checkRateLimit(`reset-password:${getClientIp(req)}`, 20, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: 'Too many resets. Please wait a moment.' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const userId = typeof body?.userId === 'string' ? body.userId.trim() : '';
    if (!userId || detectSqlInjection(userId).isSuspicious) {
      return NextResponse.json({ success: false, error: 'A valid user ID is required.' }, { status: 400 });
    }

    const record = await serverAuthStore.findUser(userId);
    if (!record) {
      return NextResponse.json({ success: false, error: 'Account not found.' }, { status: 404 });
    }
    if (record.profile.role === 'SUPER_ADMIN' || record.profile.role === 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Admin access uses the master passcode, not a clipper password.' }, { status: 400 });
    }

    const tempPassword = temporaryPassword();
    if (!(await serverAuthStore.setPassword(record.profile.id, tempPassword))) {
      return NextResponse.json({ success: false, error: 'Could not save the new password. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, tempPassword, email: record.profile.email, phoneWhatsapp: record.profile.phoneWhatsapp ?? null },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Password reset failed.' }, { status: 500 });
  }
}
