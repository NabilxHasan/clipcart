import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { UserStatus } from '@/lib/types/database';

export async function GET() {
  try {
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
    const body = await req.json();
    const { userId, status } = body as { userId: string; status: UserStatus };

    if (!userId || !status) {
      return NextResponse.json(
        { success: false, error: 'User ID and status are required' },
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
