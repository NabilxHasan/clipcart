import fs from 'fs';
import path from 'path';
import os from 'os';
import { timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { Profile, ClipperProfile, UserStatus } from '../types/database';
import { supabaseAdmin } from '../supabase/admin';
import { classifyIdentifier, detectSqlInjection } from '../security/anti-sqli';

interface ServerDbState {
  profiles: Profile[];
  clipperProfiles: ClipperProfile[];
}

const STORAGE_FILE = path.join(os.tmpdir(), 'clipcart_users_store_v1.json');
const BCRYPT_ROUNDS = 10;

// clipper_profiles.editing_experience holds JSON {exp, fb}. Older rows also packed a plain-text "pw" in it;
// those are converted to a bcrypt hash in user_credentials (migration 004, or on that user's next login).
function parseExperience(raw?: string | null): { exp: string; fb: string; pw: string } {
  const out = { exp: raw || '', fb: '', pw: '' };
  if (raw && raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw);
      out.exp = parsed.exp ?? '';
      out.fb = parsed.fb ?? '';
      out.pw = parsed.pw ?? '';
    } catch {
      // not JSON: plain experience text
    }
  }
  return out;
}

function sameText(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function getInitialState(): ServerDbState {
  return {
    profiles: [
      {
        id: 'usr-admin-01',
        email: 'admin@clipcart.com',
        role: 'SUPER_ADMIN',
        fullName: 'ClipCart Operations',
        phoneWhatsapp: '+8801337142248',
        country: 'Bangladesh',
        status: 'APPROVED',
        createdAt: '2026-09-01T10:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z',
      },
    ],
    clipperProfiles: [],
  };
}

// In-Memory Global Store across Serverless Invocations
declare global {
  // eslint-disable-next-line no-var
  var __clipcart_server_db: ServerDbState | undefined;
}

function loadState(): ServerDbState {
  if (globalThis.__clipcart_server_db) {
    return globalThis.__clipcart_server_db;
  }

  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.profiles)) {
        parsed.profiles = parsed.profiles.map(({ password: _pw, ...p }: Profile) => p);
        globalThis.__clipcart_server_db = parsed;
        return parsed;
      }
    }
  } catch {
    // Ignore file read error and fallback
  }

  const initial = getInitialState();
  globalThis.__clipcart_server_db = initial;
  saveState(initial);
  return initial;
}

function saveState(state: ServerDbState): void {
  globalThis.__clipcart_server_db = state;
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch {
    // Ignore file write errors on read-only environments
  }
}

export const serverAuthStore = {
  getProfiles(): Profile[] {
    return loadState().profiles;
  },

  getClipperProfiles(): ClipperProfile[] {
    return loadState().clipperProfiles;
  },

  async findUser(identifier: string): Promise<{ profile: Profile; clipperProfile?: ClipperProfile } | null> {
    const classified = classifyIdentifier(identifier);
    if (classified.type === 'INVALID') {
      return null;
    }

    const state = loadState();
    let profile: Profile | undefined;

    // 1. Strict typed lookup in local server store
    if (classified.type === 'EMAIL') {
      profile = state.profiles.find(p => p.email && p.email.toLowerCase() === classified.clean);
    } else if (classified.type === 'UUID') {
      profile = state.profiles.find(p => p.id && p.id.toLowerCase() === classified.clean);
    } else if (classified.type === 'PHONE') {
      profile = state.profiles.find(p => {
        if (!p.phoneWhatsapp) return false;
        const digits = p.phoneWhatsapp.replace(/\D/g, '');
        return digits.endsWith(classified.clean.slice(-10));
      });
    } else if (classified.type === 'TRX_ID') {
      const matchedCp = state.clipperProfiles.find(
        cp => cp.signupTrxId && cp.signupTrxId.toUpperCase() === classified.clean
      );
      if (matchedCp) {
        profile = state.profiles.find(p => p.id === matchedCp.userId);
      }
    }

    // 2. Parameterized fallback to Supabase (Strictly NO raw string concatenation)
    if (!profile) {
      try {
        let row: {
          id: string;
          email: string;
          role: Profile['role'];
          full_name: string;
          phone_whatsapp?: string;
          country?: string;
          status: Profile['status'];
          updated_at?: string;
        } | null = null;

        if (classified.type === 'EMAIL') {
          const { data } = await supabaseAdmin
            .from('profiles')
            .select('id, email, role, full_name, phone_whatsapp, country, status, updated_at')
            .eq('email', classified.clean)
            .limit(1);
          if (data && data.length > 0) row = data[0];
        } else if (classified.type === 'UUID') {
          const { data } = await supabaseAdmin
            .from('profiles')
            .select('id, email, role, full_name, phone_whatsapp, country, status, updated_at')
            .eq('id', classified.clean)
            .limit(1);
          if (data && data.length > 0) row = data[0];
        } else if (classified.type === 'PHONE') {
          const localBd = classified.clean; // e.g. 01712345678
          const intlBd = '+88' + classified.clean; // e.g. +8801712345678
          const intlBdNoPlus = '88' + classified.clean; // e.g. 8801712345678
          const { data } = await supabaseAdmin
            .from('profiles')
            .select('id, email, role, full_name, phone_whatsapp, country, status, updated_at')
            .in('phone_whatsapp', [localBd, intlBd, intlBdNoPlus])
            .limit(1);
          if (data && data.length > 0) row = data[0];
        } else if (classified.type === 'TRX_ID') {
          const { data: cpData } = await supabaseAdmin
            .from('clipper_profiles')
            .select('user_id')
            .eq('signup_trx_id', classified.clean)
            .limit(1);

          if (cpData && cpData.length > 0) {
            const { data: pData } = await supabaseAdmin
              .from('profiles')
              .select('id, email, role, full_name, phone_whatsapp, country, status, updated_at')
              .eq('id', cpData[0].user_id)
              .limit(1);
            if (pData && pData.length > 0) row = pData[0];
          }
        }

        if (row) {
          profile = {
            id: row.id,
            email: row.email,
            role: row.role,
            fullName: row.full_name,
            phoneWhatsapp: row.phone_whatsapp,
            country: row.country || 'Bangladesh',
            status: row.status,
            createdAt: row.updated_at || new Date().toISOString(),
            updatedAt: row.updated_at || new Date().toISOString(),
          };
          const existIdx = state.profiles.findIndex(p => p.id === profile!.id);
          if (existIdx >= 0) {
            state.profiles[existIdx] = { ...state.profiles[existIdx], ...profile };
          } else {
            state.profiles.push(profile);
          }
          saveState(state);
        }
      } catch (err) {
        console.error('Supabase lookup exception:', err);
      }
    }

    if (!profile) return null;

    // Refresh status from Supabase using only valid columns
    try {
      const { data: freshData } = await supabaseAdmin
        .from('profiles')
        .select('id, status, full_name, role')
        .eq('id', profile.id)
        .limit(1);
      if (freshData && freshData.length > 0) {
        profile.status = freshData[0].status ?? profile.status;
        profile.fullName = freshData[0].full_name ?? profile.fullName;
        profile.role = freshData[0].role ?? profile.role;
        const idx = state.profiles.findIndex(p => p.id === profile!.id);
        if (idx >= 0) state.profiles[idx] = { ...state.profiles[idx], ...profile };
        saveState(state);
      }
    } catch {
      // Non-fatal: use cached status
    }

    let clipperProfile = state.clipperProfiles.find(cp => cp.userId === profile!.id);
    if (!clipperProfile) {
      try {
        const { data } = await supabaseAdmin
          .from('clipper_profiles')
          .select('user_id, tiktok_handle, instagram_handle, youtube_handle, preferred_platforms, editing_experience, portfolio_url, payment_method, payment_identifier, signup_trx_id, signup_payment_method, approved_views_total, approved_earnings_total, approved_clips_total, created_at, updated_at')
          .eq('user_id', profile.id)
          .limit(1);

        if (data && data.length > 0) {
          const cp = data[0];
          const { exp: actualExperience, fb: extractedFacebook } = parseExperience(cp.editing_experience);

          clipperProfile = {
            userId: cp.user_id,
            tiktokHandle: cp.tiktok_handle,
            instagramHandle: cp.instagram_handle,
            youtubeHandle: cp.youtube_handle,
            facebookHandle: extractedFacebook,
            preferredPlatforms: cp.preferred_platforms || ['TIKTOK', 'YOUTUBE'],
            editingExperience: actualExperience,
            portfolioUrl: cp.portfolio_url,
            paymentMethod: cp.payment_method || 'BKASH',
            paymentIdentifier: cp.payment_identifier,
            signupTrxId: cp.signup_trx_id,
            signupPaymentMethod: cp.signup_payment_method || 'BKASH',
            approvedViewsTotal: Number(cp.approved_views_total || 0),
            approvedEarningsTotal: Number(cp.approved_earnings_total || 0),
            approvedClipsTotal: Number(cp.approved_clips_total || 0),
            createdAt: cp.created_at,
            updatedAt: cp.updated_at,
          };
          state.clipperProfiles.push(clipperProfile);
          saveState(state);
        }
      } catch {
        // Ignore
      }
    }

    return { profile, clipperProfile };
  },

  /** Checks a login password against the stored bcrypt hash (Supabase user_credentials, else the local store). */
  async verifyPassword(userId: string, password: string): Promise<boolean> {
    if (!userId || !password) return false;
    const local = loadState().profiles.find(p => p.id === userId);

    let hash: string | undefined;
    try {
      const { data } = await supabaseAdmin
        .from('user_credentials')
        .select('password_hash')
        .eq('user_id', userId)
        .limit(1);
      hash = data?.[0]?.password_hash;
    } catch {
      // fall back to the local store
    }
    hash = hash || local?.passwordHash;
    if (hash) return bcrypt.compare(password, hash);

    // Legacy row with a plain-text password: verify once, then replace it with a hash
    try {
      const { data } = await supabaseAdmin
        .from('clipper_profiles')
        .select('editing_experience')
        .eq('user_id', userId)
        .limit(1);
      const legacyPw = parseExperience(data?.[0]?.editing_experience).pw;
      if (legacyPw && sameText(legacyPw, password)) {
        await this.setPassword(userId, password);
        return true;
      }
    } catch {
      // Ignore
    }
    return false;
  },

  /** Stores a bcrypt hash for the user; plain text is removed from editing_experience only once the hash is saved. */
  async setPassword(userId: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const state = loadState();
    const local = state.profiles.find(p => p.id === userId);
    if (local) {
      local.passwordHash = passwordHash;
      saveState(state);
    }

    const { error } = await supabaseAdmin.from('user_credentials').upsert({
      user_id: userId,
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('Supabase user_credentials upsert notice:', error.message);
      return;
    }

    const { data } = await supabaseAdmin
      .from('clipper_profiles')
      .select('editing_experience')
      .eq('user_id', userId)
      .limit(1);
    const raw = data?.[0]?.editing_experience;
    if (raw && parseExperience(raw).pw) {
      const { exp, fb } = parseExperience(raw);
      await supabaseAdmin
        .from('clipper_profiles')
        .update({ editing_experience: JSON.stringify({ exp, fb }) })
        .eq('user_id', userId);
    }
  },

  async registerUser(profile: Profile, clipperProfile: ClipperProfile, password: string): Promise<void> {
    const state = loadState();
    const { password: _plain, ...storedProfile } = profile;
    profile = { ...storedProfile, passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS) };

    // Check existing
    const existingIndex = state.profiles.findIndex(
      p => p.email.toLowerCase() === profile.email.toLowerCase() || (profile.phoneWhatsapp && p.phoneWhatsapp === profile.phoneWhatsapp)
    );

    if (existingIndex >= 0) {
      state.profiles[existingIndex] = profile;
    } else {
      state.profiles.push(profile);
    }

    const existingCpIndex = state.clipperProfiles.findIndex(cp => cp.userId === profile.id);
    if (existingCpIndex >= 0) {
      state.clipperProfiles[existingCpIndex] = clipperProfile;
    } else {
      state.clipperProfiles.push(clipperProfile);
    }

    saveState(state);

    // Persist to Supabase using only valid PostgreSQL columns
    try {
      const { error: pErr } = await supabaseAdmin.from('profiles').upsert({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        full_name: profile.fullName,
        phone_whatsapp: profile.phoneWhatsapp,
        country: profile.country,
        status: profile.status,
        updated_at: new Date().toISOString(),
      });
      if (pErr) {
        console.warn('Supabase profile upsert notice:', pErr.message);
      }

      // facebookHandle has no column of its own, so it rides along in editing_experience JSON
      const experiencePayload = JSON.stringify({
        exp: clipperProfile.editingExperience || '',
        fb: clipperProfile.facebookHandle || '',
      });

      const { error: cpErr } = await supabaseAdmin.from('clipper_profiles').upsert({
        user_id: profile.id,
        tiktok_handle: clipperProfile.tiktokHandle,
        instagram_handle: clipperProfile.instagramHandle,
        youtube_handle: clipperProfile.youtubeHandle,
        preferred_platforms: clipperProfile.preferredPlatforms,
        editing_experience: experiencePayload,
        portfolio_url: clipperProfile.portfolioUrl,
        payment_method: clipperProfile.paymentMethod,
        payment_identifier: clipperProfile.paymentIdentifier,
        signup_trx_id: clipperProfile.signupTrxId,
        signup_payment_method: clipperProfile.signupPaymentMethod,
        updated_at: new Date().toISOString(),
      });
      if (cpErr) {
        console.warn('Supabase clipper_profiles upsert notice:', cpErr.message);
      }

      // Credentials live in their own table that only the service role can read
      const { error: credErr } = await supabaseAdmin.from('user_credentials').upsert({
        user_id: profile.id,
        password_hash: profile.passwordHash,
        updated_at: new Date().toISOString(),
      });
      if (credErr) {
        console.warn('Supabase user_credentials upsert notice:', credErr.message);
      }
    } catch (err) {
      console.warn('Supabase registerUser notice:', err);
    }
  },

  async deleteUser(identifier: string): Promise<boolean> {
    const classified = classifyIdentifier(identifier);
    if (classified.type === 'INVALID') {
      return false;
    }
    const state = loadState();

    // 1. Locate matching profile in local store with strict typed equality
    let matchedProfile: Profile | undefined;
    if (classified.type === 'EMAIL') {
      matchedProfile = state.profiles.find(p => p.email && p.email.toLowerCase() === classified.clean);
    } else if (classified.type === 'UUID') {
      matchedProfile = state.profiles.find(p => p.id && p.id.toLowerCase() === classified.clean);
    } else if (classified.type === 'PHONE') {
      matchedProfile = state.profiles.find(p => {
        if (!p.phoneWhatsapp) return false;
        const digits = p.phoneWhatsapp.replace(/\D/g, '');
        return digits.endsWith(classified.clean.slice(-10));
      });
    } else if (classified.type === 'TRX_ID') {
      const cp = state.clipperProfiles.find(c => c.signupTrxId && c.signupTrxId.toUpperCase() === classified.clean);
      if (cp) matchedProfile = state.profiles.find(p => p.id === cp.userId);
    }

    // STRICT DEFENSE: Never delete Super Admin or Admin accounts
    if (
      matchedProfile?.role === 'SUPER_ADMIN' ||
      matchedProfile?.role === 'ADMIN' ||
      matchedProfile?.id === 'usr-admin-01'
    ) {
      return false;
    }

    const targetUserId = matchedProfile?.id;

    if (targetUserId) {
      state.profiles = state.profiles.filter(p => p.id !== targetUserId && p.id !== 'usr-admin-01' && p.id !== 'usr-nabil-01');
      state.clipperProfiles = state.clipperProfiles.filter(cp => cp.userId !== targetUserId && cp.signupTrxId !== 'DIQ7WUNHRX');
      saveState(state);

      // 2. Delete from Supabase safely using parameterized .eq()
      try {
        await supabaseAdmin.from('clipper_profiles').delete().eq('user_id', targetUserId);
        await supabaseAdmin.from('profiles').delete().eq('id', targetUserId);
      } catch (err) {
        console.warn('Supabase deleteUser notice:', err);
      }
      return true;
    }

    return false;
  },

  updateStatus(userId: string, status: UserStatus): boolean {
    const state = loadState();
    const p = state.profiles.find(u => u.id === userId);
    if (p) {
      p.status = status;
      p.updatedAt = new Date().toISOString();
      saveState(state);

      // Persist to Supabase so status survives server restarts (fire-and-forget)
      Promise.resolve(
        supabaseAdmin
          .from('profiles')
          .update({ status, updated_at: p.updatedAt })
          .eq('id', userId)
      ).then(({ error }) => {
        if (error) console.error('Supabase updateStatus error:', error.message);
      }).catch((err: unknown) => console.error('Supabase updateStatus exception:', err));

      return true;
    }
    return false;
  },

  clearAllData(): void {
    const initial = getInitialState();
    saveState(initial);
  },
};
