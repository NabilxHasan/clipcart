import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { serverAuthStore } from '@/lib/auth/server-store';
import { Profile, ClipperProfile } from '@/lib/types/database';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: max 5 registrations per 10 minutes per IP
    const clientIp = getClientIp(req);
    const limit = checkRateLimit(`register:${clientIp}`, 5, 10 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Too many registration attempts. Please wait ${limit.retryAfterSec} seconds before trying again.` 
        },
        { 
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSec) }
        }
      );
    }

    const body = await req.json();
    const rawProfile = body?.profile;
    const rawClipper = body?.clipperProfile;

    const email = rawProfile?.email?.trim().toLowerCase();
    const fullName = rawProfile?.fullName?.trim();
    const password = rawProfile?.password?.trim();
    const phoneWhatsapp = rawProfile?.phoneWhatsapp?.trim();
    const country = rawProfile?.country?.trim() || 'Bangladesh';
    const signupTrxId = rawClipper?.signupTrxId?.trim().toUpperCase();

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name is required (min 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@') || email.length < 5) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (!signupTrxId || signupTrxId.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A valid ৳50 bKash verification TrxID is required.' },
        { status: 400 }
      );
    }

    // 2. Prevent duplicate accounts by email
    const existing = await serverAuthStore.findUser(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email is already registered. Please log in.' },
        { status: 409 }
      );
    }

    // 3. SECURITY: Role & Status MUST be strictly defined server-side.
    // Never trust client-supplied role or status to prevent privilege escalation.
    // PostgreSQL profiles.id requires standard UUID format
    const newUserId = randomUUID();
    const now = new Date().toISOString();

    const sanitizedProfile: Profile = {
      id: newUserId,
      email,
      fullName: fullName.slice(0, 100),
      phoneWhatsapp: phoneWhatsapp ? phoneWhatsapp.slice(0, 30) : undefined,
      country: country.slice(0, 50),
      role: 'CLIPPER',       // IMMUTABLE SERVER-ENFORCED ROLE
      status: 'PENDING',     // IMMUTABLE SERVER-ENFORCED STATUS AWAITING ৳50 AUDIT
      password,
      createdAt: now,
      updatedAt: now,
    };

    const sanitizedClipperProfile: ClipperProfile = {
      userId: newUserId,
      tiktokHandle: rawClipper?.tiktokHandle?.trim()?.slice(0, 100) || undefined,
      instagramHandle: rawClipper?.instagramHandle?.trim()?.slice(0, 100) || undefined,
      youtubeHandle: rawClipper?.youtubeHandle?.trim()?.slice(0, 100) || undefined,
      facebookHandle: rawClipper?.facebookHandle?.trim()?.slice(0, 100) || undefined,
      preferredPlatforms: Array.isArray(rawClipper?.preferredPlatforms) ? rawClipper.preferredPlatforms : ['TIKTOK', 'YOUTUBE', 'FACEBOOK'],
      editingExperience: rawClipper?.editingExperience?.trim()?.slice(0, 500) || undefined,
      portfolioUrl: rawClipper?.portfolioUrl?.trim()?.slice(0, 500) || undefined,
      paymentMethod: rawClipper?.paymentMethod === 'BANK' ? 'BANK' : 'BKASH',
      paymentIdentifier: rawClipper?.paymentIdentifier?.trim()?.slice(0, 100) || '',
      signupTrxId,
      signupPaymentMethod: 'BKASH',
      approvedViewsTotal: 0,
      approvedEarningsTotal: 0,
      approvedClipsTotal: 0,
      createdAt: now,
      updatedAt: now,
    };

    // 4. Persist user to authoritative server store & Supabase
    await serverAuthStore.registerUser(sanitizedProfile, sanitizedClipperProfile);

    return NextResponse.json({
      success: true,
      user: {
        id: sanitizedProfile.id,
        email: sanitizedProfile.email,
        fullName: sanitizedProfile.fullName,
        phoneWhatsapp: sanitizedProfile.phoneWhatsapp,
        role: sanitizedProfile.role,
        status: sanitizedProfile.status,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Registration failed' },
      { status: 500 }
    );
  }
}
