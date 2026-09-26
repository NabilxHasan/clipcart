import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';

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

    let identifier = 'DIQ7WUNHRX';
    try {
      const body = await req.json();
      identifier = body?.identifier || body?.userId || body?.trxId || body?.email || 'DIQ7WUNHRX';
    } catch {
      // Body may be empty if deleting default requested account
    }

    await serverAuthStore.deleteUser(identifier);

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
