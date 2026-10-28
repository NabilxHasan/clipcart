import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { hasAdminSession } from '@/lib/auth/require-admin';
import { UserStatus } from '@/lib/types/database';
import { detectSqlInjection } from '@/lib/security/anti-sqli';

export async function GET() {
  try {
    if (!(await hasAdminSession())) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    // Every account from the database (credentials never leave the server, not even to admins)
    const { profiles, clipperProfiles } = await serverAuthStore.listUsers();

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
    if (!(await hasAdminSession())) {
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

    if (detectSqlInjection(userId).isSuspicious) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format. SQL syntax rejected.' },
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

    const updated = await serverAuthStore.updateStatus(userId, status);

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
