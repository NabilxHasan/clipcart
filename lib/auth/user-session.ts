// Clipper Session (signed cookie)
// Set by /api/auth/login and /api/auth/register. Holds "<userId>.<expiresAtMs>.<HMAC-SHA256 hex>", signed with
// USER_SESSION_SECRET (or the admin signing secret), so API routes know which clipper is calling without
// trusting an id sent from the browser.

import { cookies } from 'next/headers';

export const USER_COOKIE = 'clipcart_user_session';
export const USER_SESSION_MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days

const encoder = new TextEncoder();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getSecret(): string | null {
  for (const s of [process.env.USER_SESSION_SECRET, process.env.ADMIN_SESSION_SECRET, process.env.ADMIN_MASTER_KEY]) {
    const v = s?.trim();
    if (v && v.length >= 12) return v;
  }
  return null;
}

async function sign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(`user:${payload}`)));
}

export async function createUserSessionToken(userId: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret || !UUID_RE.test(userId)) return null;
  const expiresAt = Date.now() + USER_SESSION_MAX_AGE_S * 1000;
  return `${userId}.${expiresAt}.${await sign(secret, `${userId}.${expiresAt}`)}`;
}

export async function verifyUserSessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  const [userId, exp, sig] = token.split('.');
  const expiresAt = Number(exp);
  if (!userId || !sig || !UUID_RE.test(userId) || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  const secret = getSecret();
  if (!secret) return null;
  return safeEqual(sig, await sign(secret, `${userId}.${expiresAt}`)) ? userId : null;
}

/** The signed-in clipper's id for route handlers and server components, or null. */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return verifyUserSessionToken(cookieStore.get(USER_COOKIE)?.value);
}

export const userCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: USER_SESSION_MAX_AGE_S,
};
