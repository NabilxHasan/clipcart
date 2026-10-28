import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';
import { hasAdminSession } from '@/lib/auth/require-admin';
import { detectSqlInjection } from '@/lib/security/anti-sqli';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const limit = checkRateLimit(`delete-user:${clientIp}`, 10, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    if (!(await hasAdminSession())) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required to delete accounts.' },
        { status: 401 }
      );
    }

    let identifier = '';
    try {
      const body = await req.json();
      identifier = (body?.identifier || body?.userId || body?.trxId || body?.email || '').trim();
    } catch {
      return NextResponse.json({ success: false, error: 'Request body required.' }, { status: 400 });
    }

    if (!identifier) {
      return NextResponse.json({ success: false, error: 'Identifier required.' }, { status: 400 });
    }

    if (detectSqlInjection(identifier).isSuspicious) {
      return NextResponse.json(
        { success: false, error: 'Security Alert: Invalid input detected. SQL injection syntax is blocked.' },
        { status: 400 }
      );
    }

    const deleted = await serverAuthStore.deleteUser(identifier);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Account not found or protected from deletion.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully from server and database.',
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Deletion failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  return POST(req);
}
