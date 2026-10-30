import { randomBytes } from 'crypto';
import { supabaseAdmin } from './supabase/admin';
import { FOUNDING_LIMIT, FOUNDING_PREFIX, FoundingOffer } from './founding';

/** Spots left in the founding offer, counted from the database (the only source shared by all server instances). */
export async function getFoundingOffer(): Promise<FoundingOffer> {
  try {
    const { count, error } = await supabaseAdmin
      .from('clipper_profiles')
      .select('user_id', { count: 'exact', head: true })
      .like('signup_trx_id', `${FOUNDING_PREFIX}%`);
    if (error || count === null) throw error ?? new Error('Founding count unavailable');
    const spotsLeft = Math.max(0, FOUNDING_LIMIT - count);
    return { open: spotsLeft > 0, spotsLeft, limit: FOUNDING_LIMIT };
  } catch (err) {
    // Fail closed: if the spots can't be counted, sign-up falls back to the ৳50 verification
    console.warn('Founding offer check failed:', err);
    return { open: false, spotsLeft: 0, limit: FOUNDING_LIMIT };
  }
}

export function newFoundingTrxId(): string {
  return `${FOUNDING_PREFIX}${randomBytes(4).toString('hex').toUpperCase()}`;
}
