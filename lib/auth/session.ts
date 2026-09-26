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

    // Safety check: Purge user-requested deleted test account
    if (
      user.fullName === 'Nabil Hasan' || 
      user.id === 'usr-nabil-01' || 
      user.email?.toLowerCase().includes('nabil')
    ) {
      localStorage.removeItem(ACTIVE_USER_KEY);
      mockStore.profiles = mockStore.profiles.filter(p => p.fullName !== 'Nabil Hasan');
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

export function clearActiveUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACTIVE_USER_KEY);
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
    try {
      sessionStorage.clear();
    } catch {
      // Ignore
    }

    // Clean mockStore
    if (targetId) {
      mockStore.profiles = mockStore.profiles.filter(p => p.id !== targetId && p.fullName !== 'Nabil Hasan');
      mockStore.clipperProfiles = mockStore.clipperProfiles.filter(cp => cp.userId !== targetId && cp.signupTrxId !== 'DIQ7WUNHRX');
    } else {
      mockStore.profiles = mockStore.profiles.filter(p => p.fullName !== 'Nabil Hasan' && (p.role === 'SUPER_ADMIN' || p.role === 'ADMIN'));
      mockStore.clipperProfiles = mockStore.clipperProfiles.filter(cp => cp.signupTrxId !== 'DIQ7WUNHRX');
    }
    mockStore.saveToStorage();
  } catch {
    // Ignore error
  }
}
