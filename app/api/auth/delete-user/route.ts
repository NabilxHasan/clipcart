import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';
import { detectSqlInjection } from '@/lib/security/anti-sqli';

async function isAuthorizedAdmin(req: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('clipcart_admin_token')?.value;
  if (token === 'clipcart_admin_authorized_v1') return true;

  const authHeader = req.headers.get('authorization');
  const expectedKey = process.env.ADMIN_MASTER_KEY || 'ClipCart@Admin2026!';
  if (authHeader && (authHeader === `Bearer ${expectedKey}` || authHeader === expectedKey)) return true;

  return false;
}

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

    const authorized = await isAuthorizedAdmin(req);
    if (!authorized) {
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
