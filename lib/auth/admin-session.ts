// Admin Desk Session (signed cookie)
// The cookie holds "<expiresAtMs>.<HMAC-SHA256 hex>", signed with ADMIN_SESSION_SECRET (or ADMIN_MASTER_KEY),
// so it cannot be forged without the server secret. Web Crypto only: runs in Edge middleware and Node routes.

export const ADMIN_COOKIE = 'clipcart_admin_session';
export const LEGACY_ADMIN_COOKIE = 'clipcart_admin_token';
export const ADMIN_SESSION_MAX_AGE_S = 60 * 60 * 12; // 12 hours

// SHA-256 of passcodes that were published in the repo or shipped in client JS; never accept them.
const LEAKED_PASSCODE_DIGESTS = new Set([
  '65d68af870eaeca4b7c50f91ad1b5bd7acce6a4c3c89083aeaaac8dddf8c6d71',
]);
const MIN_MASTER_KEY_LENGTH = 12;

const encoder = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
}

/** The configured master passcode, or null when admin login must stay disabled (unset, too short or leaked). */
async function getMasterKey(): Promise<string | null> {
  const key = process.env.ADMIN_MASTER_KEY?.trim();
  if (!key || key.length < MIN_MASTER_KEY_LENGTH) return null;
  if (LEAKED_PASSCODE_DIGESTS.has(await sha256Hex(key))) return null;
  return key;
}

async function getSigningSecret(): Promise<string | null> {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret && secret.length >= 32) return secret;
  return getMasterKey();
}

export async function isAdminLoginConfigured(): Promise<boolean> {
  return (await getMasterKey()) !== null;
}

/** Constant-time passcode check (compares digests so length does not leak). */
export async function passcodeMatches(input: string): Promise<boolean> {
  const key = await getMasterKey();
  if (!key || !input) return false;
  return safeEqual(await sha256Hex(input), await sha256Hex(key));
}

export async function createAdminSessionToken(): Promise<string | null> {
  const secret = await getSigningSecret();
  if (!secret) return null;
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE_S * 1000;
  return `${expiresAt}.${await hmacHex(secret, `admin:${expiresAt}`)}`;
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  const expiresAt = Number(exp);
  if (!sig || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const secret = await getSigningSecret();
  if (!secret) return false;
  return safeEqual(sig, await hmacHex(secret, `admin:${expiresAt}`));
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: ADMIN_SESSION_MAX_AGE_S,
};
