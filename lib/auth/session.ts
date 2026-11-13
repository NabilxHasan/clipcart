// Client & Dashboard User Session Management

import { Profile } from '../types/database';
import { mockStore } from '../db/mock-store';

const ACTIVE_USER_KEY = 'clipcart_active_user';

export function getActiveUser(): Profile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as Profile;

    // Safety check: Purge legacy pre-password demo account ID
    if (user.id === 'usr-nabil-01') {
      localStorage.removeItem(ACTIVE_USER_KEY);
      mockStore.profiles = mockStore.profiles.filter(p => p.id !== 'usr-nabil-01');
      mockStore.clipperProfiles = mockStore.clipperProfiles.filter(cp => cp.signupTrxId !== 'DIQ7WUNHRX');
      mockStore.saveToStorage();
      return null;
    }

    // Verify user exists in current store or return cached profile
    const existing = mockStore.profiles.find(p => p.id === user.id);
    return existing || user;
  } catch {
    return null;
  }
}

export function setActiveUser(user: Profile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
  }
}

const ACTIVE_USER_EVENT = 'clipcart:active-user';

/** Runs `cb` whenever refreshActiveUser() finds the profile changed on the server. Returns the unsubscribe. */
export function onActiveUserChange(cb: (user: Profile) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<Profile>).detail);
  window.addEventListener(ACTIVE_USER_EVENT, handler);
  return () => window.removeEventListener(ACTIVE_USER_EVENT, handler);
}

let refreshInFlight: Promise<Profile | 'LOGIN_REQUIRED' | null> | null = null;

/**
 * Re-reads the signed-in clipper's profile from the server (/api/auth/me) and updates the browser copy.
 * The copy in localStorage is written at sign-up (status PENDING) and at login, so without this an account an
 * admin approved later kept showing "approval pending" until the clipper cleared site data or logged in again.
 * Resolves to the fresh profile, 'LOGIN_REQUIRED' when there is no valid session, or null when the server
 * could not be reached (the cached copy is kept).
 */
export function refreshActiveUser(): Promise<Profile | 'LOGIN_REQUIRED' | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const cachedRaw = localStorage.getItem(ACTIVE_USER_KEY);
      if (!cachedRaw) return null;
      const res = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'same-origin' });
      const json = await res.json().catch(() => null);
      if (res.status === 401 && json?.code === 'LOGIN_REQUIRED') return 'LOGIN_REQUIRED';
      if (!res.ok || !json?.success || !json.user?.id) return null;

      const fresh = json.user as Profile;
      // Someone else signed in on this browser while the request was in flight: leave their copy alone
      const nowRaw = localStorage.getItem(ACTIVE_USER_KEY);
      if (!nowRaw) return null;
      const cached = JSON.parse(nowRaw) as Profile;

      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(fresh));
      // getActiveUser() prefers the mockStore copy, so that one has to be brought up to date as well
      mockStore.profiles = mockStore.profiles.filter(p => p.id !== fresh.id && p.id !== cached.id);
      mockStore.profiles.push(fresh);
      mockStore.saveToStorage();

      const changed =
        cached.id !== fresh.id ||
        cached.status !== fresh.status ||
        cached.role !== fresh.role ||
        cached.fullName !== fresh.fullName ||
        cached.email !== fresh.email ||
        cached.phoneWhatsapp !== fresh.phoneWhatsapp;
      if (changed) window.dispatchEvent(new CustomEvent<Profile>(ACTIVE_USER_EVENT, { detail: fresh }));
      return fresh;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export function clearActiveUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACTIVE_USER_KEY);
    // The signed session cookie is httpOnly, so only the server can clear it
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    try {
      sessionStorage.clear();
    } catch {
      // Ignore
    }
  }
}

export function deleteLocalUser(userIdOrTrxId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    let targetId = userIdOrTrxId;
    if (raw && !targetId) {
      try {
        const parsed = JSON.parse(raw);
        targetId = parsed.id;
      } catch {
        // Ignore
      }
    }

    localStorage.removeItem(ACTIVE_USER_KEY);
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    try {
      sessionStorage.clear();
    } catch {
      // Ignore
    }

    // Clean mockStore
    if (targetId) {
      mockStore.profiles = mockStore.profiles.filter(p => p.id !== targetId && p.id !== 'usr-nabil-01');
      mockStore.clipperProfiles = mockStore.clipperProfiles.filter(cp => cp.userId !== targetId && cp.signupTrxId !== 'DIQ7WUNHRX');
    } else {
      mockStore.profiles = mockStore.profiles.filter(p => p.id !== 'usr-nabil-01' && (p.role === 'SUPER_ADMIN' || p.role === 'ADMIN'));
      mockStore.clipperProfiles = mockStore.clipperProfiles.filter(cp => cp.signupTrxId !== 'DIQ7WUNHRX');
    }
    mockStore.saveToStorage();
  } catch {
    // Ignore error
  }
}
