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
  }
}
