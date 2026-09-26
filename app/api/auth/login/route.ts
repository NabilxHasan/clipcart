import { NextResponse } from 'next/server';
import { serverAuthStore } from '@/lib/auth/server-store';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    // Rate limit check: max 5 login attempts per minute per IP
    const limit = checkRateLimit(`login:${clientIp}`, 5, 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Too many login attempts. Please wait ${limit.retryAfterSec} seconds before trying again.` 
        },
        { 
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSec) }
        }
      );
    }

    const body = await req.json();
    const identifier = body?.identifier?.trim();
    const password = body?.password?.trim();

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: 'Please enter your registered email or phone number.' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Please enter your account password.' },
        { status: 400 }
      );
    }

    // Lookup user in server store & Supabase
    const record = await serverAuthStore.findUser(identifier);

    if (!record) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No registered clipper account found for this email or phone number. Please register and complete the ৳50 bKash verification.' 
        },
        { status: 401 }
      );
    }

    const { profile, clipperProfile } = record;

    // Check account status
    if (profile.status === 'BANNED') {
      return NextResponse.json(
        { success: false, error: 'This account has been banned due to compliance violations.' },
        { status: 403 }
      );
    }

    if (profile.status === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'This account is suspended. Please contact support on WhatsApp.' },
        { status: 403 }
      );
    }

    // Strict Password Validation
    const isPasswordMatch = profile.password && profile.password === password;
    const isTrxIdMatch = clipperProfile?.signupTrxId && clipperProfile.signupTrxId.toLowerCase() === password.toLowerCase();

    if (!isPasswordMatch && !isTrxIdMatch) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please verify your password and try again.' },
        { status: 401 }
      );
    }

    // Return authenticated profile with server-verified role and status
    return NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        phoneWhatsapp: profile.phoneWhatsapp,
        country: profile.country,
        role: profile.role,
        status: profile.status,
      },
      clipperProfile,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Authentication failed' },
      { status: 500 }
    );
  }
}
