import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { Profile, ClipperProfile } from '@/lib/types/database';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, clipperProfile } = body as { profile: Profile; clipperProfile: ClipperProfile };

    if (!profile || !profile.email || !profile.fullName) {
      return NextResponse.json(
        { success: false, error: 'Full name and email are required.' },
        { status: 400 }
      );
    }

    if (!profile.password || profile.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (!clipperProfile?.signupTrxId || clipperProfile.signupTrxId.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: 'A valid ৳50 bKash verification TrxID is required.' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existing = await serverAuthStore.findUser(profile.email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    // Persist user
    await serverAuthStore.registerUser(profile, clipperProfile);

    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        phoneWhatsapp: profile.phoneWhatsapp,
        role: profile.role,
        status: profile.status,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Registration failed' },
      { status: 500 }
    );
  }
}
