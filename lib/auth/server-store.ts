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
    const state = loadState();

    // 1. Check local server store first (by email, phone, id, or signupTrxId)
    let profile = state.profiles.find(
      p => p.email.toLowerCase() === cleanId || 
           (p.phoneWhatsapp && p.phoneWhatsapp.replace(/\s+/g, '').includes(cleanId)) ||
           p.id.toLowerCase() === cleanId
    );

    if (!profile) {
      const matchedCp = state.clipperProfiles.find(
        cp => cp.signupTrxId && cp.signupTrxId.toLowerCase() === cleanId
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
          .select('*')
          .or(`email.ilike.${sanitizedId},phone_whatsapp.ilike.%25${sanitizedId}%25`)
          .limit(1);

        if (error) {
          console.error('Supabase findUser error:', error.message);
          // Try simple email match as fallback
          const { data: emailData } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .ilike('email', sanitizedId)
            .limit(1);
          if (emailData && emailData.length > 0) {
            const row = emailData[0];
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
            const existIdx = state.profiles.findIndex(p => p.id === profile!.id);
            if (existIdx >= 0) {
              state.profiles[existIdx] = profile;
            } else {
              state.profiles.push(profile);
            }
            saveState(state);
          }
        } else if (data && data.length > 0) {
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
          // Cache into local server store (update if exists)
          const existIdx = state.profiles.findIndex(p => p.id === profile!.id);
          if (existIdx >= 0) {
            state.profiles[existIdx] = profile;
          } else {
            state.profiles.push(profile);
          }
          saveState(state);
        } else {
          // Check by signupTrxId in Supabase
          const { data: cpData } = await supabaseAdmin
            .from('clipper_profiles')
            .select('*')
            .ilike('signup_trx_id', sanitizedId)
            .limit(1);

          if (cpData && cpData.length > 0) {
            const cpRow = cpData[0];
            const { data: pData } = await supabaseAdmin
              .from('profiles')
              .select('*')
              .eq('id', cpRow.user_id)
              .limit(1);

            if (pData && pData.length > 0) {
              const row = pData[0];
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
              const existIdx = state.profiles.findIndex(p => p.id === profile!.id);
              if (existIdx >= 0) {
                state.profiles[existIdx] = profile;
              } else {
                state.profiles.push(profile);
              }
              saveState(state);
            }
          }
        }
      } catch (err) {
        console.error('Supabase lookup exception:', err);
      }
    }

    // Always refresh status from Supabase so approval changes are live
    if (profile) {
      try {
        const { data: freshData } = await supabaseAdmin
          .from('profiles')
          .select('status, password, full_name, role')
          .eq('id', profile.id)
          .limit(1);
        if (freshData && freshData.length > 0) {
          profile.status = freshData[0].status ?? profile.status;
          profile.password = freshData[0].password ?? profile.password;
          profile.fullName = freshData[0].full_name ?? profile.fullName;
          profile.role = freshData[0].role ?? profile.role;
          // Update local cache too
          const idx = state.profiles.findIndex(p => p.id === profile!.id);
          if (idx >= 0) state.profiles[idx] = { ...state.profiles[idx], ...profile };
          saveState(state);
        }
      } catch {
        // Non-fatal: use cached status
      }
    }

    if (!profile) return null;

    let clipperProfile = state.clipperProfiles.find(cp => cp.userId === profile!.id);
    if (!clipperProfile) {
      try {
        const { data } = await supabaseAdmin
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
            facebookHandle: cp.facebook_handle,
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

    // Attempt to persist to Supabase using supabaseAdmin (bypasses RLS)
    try {
      const { error: pErr } = await supabaseAdmin.from('profiles').upsert({
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
      if (pErr) {
        console.error('Supabase profile upsert error:', pErr.message);
      }

      const { error: cpErr } = await supabaseAdmin.from('clipper_profiles').upsert({
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
      if (cpErr) {
        console.error('Supabase clipper_profiles upsert error:', cpErr.message);
      }
    } catch (err) {
      console.error('Supabase registerUser exception:', err);
    }
  },

  async deleteUser(identifier: string): Promise<boolean> {
    const cleanId = identifier.trim().toLowerCase();
    const state = loadState();

    // 1. Locate matching profile in local store
    const matchedProfile = state.profiles.find(
      p => p.id.toLowerCase() === cleanId || 
           p.email.toLowerCase() === cleanId || 
           (p.phoneWhatsapp && p.phoneWhatsapp.replace(/\s+/g, '').includes(cleanId)) ||
           p.fullName.toLowerCase() === cleanId
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
      state.profiles = state.profiles.filter(p => p.id !== targetUserId);
      state.clipperProfiles = state.clipperProfiles.filter(cp => cp.userId !== targetUserId);
    }

    // Explicitly purge user requested pre-password account Nabil Hasan and DIQ7WUNHRX
    state.profiles = state.profiles.filter(p => p.fullName !== 'Nabil Hasan' && p.id !== 'usr-nabil-01');
    state.clipperProfiles = state.clipperProfiles.filter(cp => cp.signupTrxId !== 'DIQ7WUNHRX');
    saveState(state);

    // 2. Delete from Supabase
    try {
      if (targetUserId) {
        await supabaseAdmin.from('clipper_profiles').delete().eq('user_id', targetUserId);
        await supabaseAdmin.from('profiles').delete().eq('id', targetUserId);
      }
      // Also purge any record in Supabase matching DIQ7WUNHRX or Nabil Hasan
      await supabaseAdmin.from('clipper_profiles').delete().eq('signup_trx_id', 'DIQ7WUNHRX');
      await supabaseAdmin.from('profiles').delete().ilike('full_name', '%Nabil Hasan%');
    } catch (err) {
      console.error('Supabase deleteUser exception:', err);
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
