import fs from 'fs';
import path from 'path';
import os from 'os';
import { Profile, ClipperProfile, UserStatus } from '../types/database';
import { supabase } from '../supabase/client';

interface ServerDbState {
  profiles: Profile[];
  clipperProfiles: ClipperProfile[];
}

const STORAGE_FILE = path.join(os.tmpdir(), 'clipcart_users_store_v1.json');

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
        password: process.env.ADMIN_MASTER_KEY || 'ClipCart@Admin2026!',
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
    const cleanId = identifier.trim().toLowerCase();
    const sanitizedId = cleanId.replace(/[,()]/g, '');
    const state = loadState();

    // 1. Check local server store first
    let profile = state.profiles.find(
      p => p.email.toLowerCase() === cleanId || (p.phoneWhatsapp && p.phoneWhatsapp.replace(/\s+/g, '').includes(cleanId))
    );

    // 2. Fallback to Supabase if not found locally
    if (!profile && sanitizedId) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .or(`email.ilike.${sanitizedId},phone_whatsapp.ilike.%${sanitizedId}%`)
          .limit(1);

        if (data && data.length > 0) {
          const row = data[0];
          profile = {
            id: row.id,
            email: row.email,
            role: row.role,
            fullName: row.full_name,
            phoneWhatsapp: row.phone_whatsapp,
            country: row.country || 'Bangladesh',
            status: row.status,
            password: row.password,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          };
          // Cache into local server store
          state.profiles.push(profile);
          saveState(state);
        }
      } catch {
        // Supabase query failed or RLS blocked; ignore
      }
    }

    if (!profile) return null;

    let clipperProfile = state.clipperProfiles.find(cp => cp.userId === profile!.id);
    if (!clipperProfile) {
      try {
        const { data } = await supabase
          .from('clipper_profiles')
          .select('*')
          .eq('user_id', profile.id)
          .limit(1);

        if (data && data.length > 0) {
          const cp = data[0];
          clipperProfile = {
            userId: cp.user_id,
            tiktokHandle: cp.tiktok_handle,
            instagramHandle: cp.instagram_handle,
            youtubeHandle: cp.youtube_handle,
            preferredPlatforms: cp.preferred_platforms || ['TIKTOK', 'YOUTUBE'],
            editingExperience: cp.editing_experience,
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

  async registerUser(profile: Profile, clipperProfile: ClipperProfile): Promise<void> {
    const state = loadState();

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

    // Attempt to persist to Supabase asynchronously (non-blocking)
    try {
      await supabase.from('profiles').upsert({
        id: profile.id,
        email: profile.email,
        role: profile.role,
        full_name: profile.fullName,
        phone_whatsapp: profile.phoneWhatsapp,
        country: profile.country,
        status: profile.status,
        password: profile.password,
        updated_at: new Date().toISOString(),
      });

      await supabase.from('clipper_profiles').upsert({
        user_id: profile.id,
        tiktok_handle: clipperProfile.tiktokHandle,
        instagram_handle: clipperProfile.instagramHandle,
        youtube_handle: clipperProfile.youtubeHandle,
        facebook_handle: clipperProfile.facebookHandle,
        preferred_platforms: clipperProfile.preferredPlatforms,
        editing_experience: clipperProfile.editingExperience,
        portfolio_url: clipperProfile.portfolioUrl,
        payment_method: clipperProfile.paymentMethod,
        payment_identifier: clipperProfile.paymentIdentifier,
        signup_trx_id: clipperProfile.signupTrxId,
        signup_payment_method: clipperProfile.signupPaymentMethod,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Supabase write error ignored; server store holds authoritative data
    }
  },

  updateStatus(userId: string, status: UserStatus): boolean {
    const state = loadState();
    const p = state.profiles.find(u => u.id === userId);
    if (p) {
      p.status = status;
      p.updatedAt = new Date().toISOString();
      saveState(state);
      return true;
    }
    return false;
  },

  clearAllData(): void {
    const initial = getInitialState();
    saveState(initial);
  },
};
