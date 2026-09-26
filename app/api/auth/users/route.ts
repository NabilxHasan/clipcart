import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { UserStatus } from '@/lib/types/database';

async function isAuthorizedAdmin(req: Request): Promise<boolean> {
  // 1. Verify HttpOnly session cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('clipcart_admin_token')?.value;
  if (token === 'clipcart_admin_authorized_v1') {
    return true;
  }

  // 2. Fallback: Verify Authorization header with master key
  const authHeader = req.headers.get('authorization');
  const expectedKey = process.env.ADMIN_MASTER_KEY || 'ClipCart@Admin2026!';
  if (authHeader && (authHeader === `Bearer ${expectedKey}` || authHeader === expectedKey)) {
    return true;
  }

  return false;
}

export async function GET(req: Request) {
  try {
    const authorized = await isAuthorizedAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const profiles = serverAuthStore.getProfiles();
    const clipperProfiles = serverAuthStore.getClipperProfiles();

    return NextResponse.json({
      success: true,
      profiles,
      clipperProfiles,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authorized = await isAuthorizedAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, status } = body as { userId: string; status: UserStatus };

    if (!userId || !status) {
      return NextResponse.json(
        { success: false, error: 'User ID and status are required' },
        { status: 400 }
      );
    }

    const allowedStatuses: UserStatus[] = ['APPROVED', 'PENDING', 'SUSPENDED', 'BANNED'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user status value' },
        { status: 400 }
      );
    }

    const updated = serverAuthStore.updateStatus(userId, status);

    return NextResponse.json({
      success: updated,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update user' },
      { status: 500 }
    );
  }
}
