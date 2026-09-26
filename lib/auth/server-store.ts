import fs from 'fs';
import path from 'path';
import os from 'os';
import { Profile, ClipperProfile, UserStatus } from '../types/database';
import { supabaseAdmin } from '../supabase/admin';

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
    const digitsId = cleanId.replace(/\D/g, '');
    const state = loadState();

    // 1. Check local server store first (by email, phone, id, or signupTrxId)
    let profile = state.profiles.find(p => {
      if (p.email && p.email.toLowerCase() === cleanId) return true;
      if (p.id && p.id.toLowerCase() === cleanId) return true;
      if (p.phoneWhatsapp) {
        const cleanPhone = p.phoneWhatsapp.replace(/\s+/g, '').toLowerCase();
        if (cleanPhone === cleanId || cleanPhone.includes(cleanId)) return true;
        const digitsPhone = p.phoneWhatsapp.replace(/\D/g, '');
        if (digitsId.length >= 8 && digitsPhone.length >= 8) {
          if (digitsPhone.endsWith(digitsId) || digitsId.endsWith(digitsPhone)) return true;
        }
      }
      return false;
    });

    if (!profile) {
      const matchedCp = state.clipperProfiles.find(
        cp => cp.signupTrxId && cp.signupTrxId.trim().toLowerCase() === cleanId
      );
      if (matchedCp) {
        profile = state.profiles.find(p => p.id === matchedCp.userId);
      }
    }

    // 2. Fallback to Supabase if not found locally
    if (!profile && sanitizedId) {
      try {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('id, email, role, full_name, phone_whatsapp, country, status, updated_at')
          .or(`email.ilike.${sanitizedId},phone_whatsapp.ilike.%25${sanitizedId}%25`)
          .limit(1);

        let row = data && data.length > 0 ? data[0] : null;

        if (!row) {
          // Try direct email match as fallback
          const { data: emailData } = await supabaseAdmin
            .from('profiles')
            .select('id, email, role, full_name, phone_whatsapp, country, status, updated_at')
            .ilike('email', sanitizedId)
            .limit(1);
          if (emailData && emailData.length > 0) row = emailData[0];
        }

        if (!row && digitsId.length >= 8) {
          // Try phone search
          const { data: phoneData } = await supabaseAdmin
            .from('profiles')
            .select('id, email, role, full_name, phone_whatsapp, country, status, updated_at')
            .ilike('phone_whatsapp', `%${digitsId.slice(-8)}%`)
            .limit(1);
          if (phoneData && phoneData.length > 0) row = phoneData[0];
        }

        if (!row) {
          // Check by signupTrxId in Supabase
          const { data: cpData } = await supabaseAdmin
            .from('clipper_profiles')
            .select('user_id')
            .ilike('signup_trx_id', sanitizedId)
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
          let extractedPassword = '';
          let extractedFacebook = '';
          let actualExperience = cp.editing_experience || '';

          if (actualExperience && actualExperience.startsWith('{')) {
            try {
              const parsed = JSON.parse(actualExperience);
              if (parsed.pw) extractedPassword = parsed.pw;
              if (parsed.fb) extractedFacebook = parsed.fb;
              if (parsed.exp !== undefined) actualExperience = parsed.exp;
            } catch {
              // ignore
            }
          }

          if (extractedPassword && !profile.password) {
            profile.password = extractedPassword;
          }

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

      // Pack password and facebookHandle safely into editing_experience JSON
      const experiencePayload = JSON.stringify({
        exp: clipperProfile.editingExperience || '',
        pw: profile.password || '',
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
    } catch (err) {
      console.warn('Supabase registerUser notice:', err);
    }
  },

  async deleteUser(identifier: string): Promise<boolean> {
    const cleanId = identifier.trim().toLowerCase();
    const state = loadState();

    // 1. Locate matching profile in local store
    const matchedProfile = state.profiles.find(
      p => p.id.toLowerCase() === cleanId || 
           p.email.toLowerCase() === cleanId || 
           (p.phoneWhatsapp && p.phoneWhatsapp.replace(/\s+/g, '').includes(cleanId))
    );

    let targetUserId = matchedProfile?.id;

    if (!targetUserId) {
      const matchedCp = state.clipperProfiles.find(
        cp => cp.signupTrxId && cp.signupTrxId.toLowerCase() === cleanId
      );
      if (matchedCp) {
        targetUserId = matchedCp.userId;
      }
    }

    if (targetUserId) {
      state.profiles = state.profiles.filter(p => p.id !== targetUserId && p.id !== 'usr-nabil-01');
      state.clipperProfiles = state.clipperProfiles.filter(cp => cp.userId !== targetUserId && cp.signupTrxId !== 'DIQ7WUNHRX');
    }

    // Explicitly purge legacy dummy pre-password account usr-nabil-01 and DIQ7WUNHRX
    state.profiles = state.profiles.filter(p => p.id !== 'usr-nabil-01');
    state.clipperProfiles = state.clipperProfiles.filter(cp => cp.signupTrxId !== 'DIQ7WUNHRX');
    saveState(state);

    // 2. Delete from Supabase
    try {
      if (targetUserId) {
        await supabaseAdmin.from('clipper_profiles').delete().eq('user_id', targetUserId);
        await supabaseAdmin.from('profiles').delete().eq('id', targetUserId);
      }
      await supabaseAdmin.from('clipper_profiles').delete().eq('signup_trx_id', 'DIQ7WUNHRX');
    } catch (err) {
      console.warn('Supabase deleteUser notice:', err);
    }

    return true;
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
