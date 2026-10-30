// Founding clipper offer (shared by server and browser code)
// The first FOUNDING_LIMIT clippers sign up without the ৳50 verification fee. Their
// clipper_profiles.signup_trx_id is "FOUNDING-<random>", which is how spots are counted;
// deleting a fake account in the admin panel frees its spot. Admin approval still applies.

export const FOUNDING_LIMIT = 50;
export const FOUNDING_PREFIX = 'FOUNDING-';

export interface FoundingOffer {
  open: boolean;
  spotsLeft: number;
  limit: number;
}

export function isFoundingTrxId(trxId?: string | null): boolean {
  return !!trxId && trxId.toUpperCase().startsWith(FOUNDING_PREFIX);
}
