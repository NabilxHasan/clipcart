// Application Data Repository (browser side)
// Every read and write goes to /api/data/* (app/api/data/[action]/route.ts), backed by Supabase through
// lib/db/server-repo.ts, so admins, clippers and visitors all see the same campaigns, budgets, clips and wallets.
// Server components import ServerRepo directly instead. Identity is never taken from these arguments: the server
// uses the signed session cookie (clippers) or the admin desk cookie, so the id parameters are kept only for the
// existing call sites.

import {
  Campaign,
  Submission,
  WithdrawalRequest,
  ClientRequest,
  WhatsAppSettings,
  ClipperProfile,
  WalletTransaction,
  AuditLog,
  PaymentRecord,
  PlatformType,
  PaymentMethod,
  ReviewDecision,
} from '../types/database';
import { clearActiveUser } from '../auth/session';

async function call<T>(action: string, opts: { query?: Record<string, string | undefined>; body?: unknown } = {}): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined) qs.set(k, v);
  const url = `/api/data/${action}${qs.size ? `?${qs}` : ''}`;
  const res = await fetch(url, opts.body === undefined
    ? { cache: 'no-store' }
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(opts.body) });
  const json = await res.json().catch(() => ({ success: false, error: `Request failed (${res.status})` }));
  if (!json.success) {
    // Signed in before the move to server sessions (or the 30-day session ran out): sign in again
    if (json.code === 'LOGIN_REQUIRED' && typeof window !== 'undefined') {
      clearActiveUser();
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error(json.error || 'Request failed');
  }
  return json.data as T;
}

export class ClipBDRepository {
  // --- CAMPAIGNS ---
  static getCampaigns(statusFilter?: string): Promise<Campaign[]> {
    return call('campaigns', { query: { status: statusFilter } });
  }

  static getActiveCampaigns(): Promise<Campaign[]> {
    return call('activeCampaigns');
  }

  static getCampaignBySlugOrId(identifier: string): Promise<Campaign | null> {
    return call('campaign', { query: { id: identifier } });
  }

  static createCampaign(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'remainingBudget' | 'status'>, _actorId?: string): Promise<Campaign> {
    return call('createCampaign', { body: data });
  }

  static markCampaignPaymentReceived(
    campaignId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    transactionReference: string,
    _verifiedBy?: string,
    adminNote?: string
  ): Promise<Campaign> {
    return call('campaignPaymentReceived', { body: { campaignId, amount, paymentMethod, transactionReference, adminNote } });
  }

  static getPaymentRecords(): Promise<PaymentRecord[]> {
    return call('paymentRecords');
  }

  // --- SUBMISSIONS ---
  /** With clipperId: the signed-in clipper's own clips. Without: the admin review queue. */
  static getSubmissions(filter?: { campaignId?: string; clipperId?: string; status?: string }): Promise<Submission[]> {
    if (filter?.clipperId) return call('mySubmissions');
    return call('adminSubmissions', { query: { status: filter?.status, campaignId: filter?.campaignId } });
  }

  static createSubmission(data: {
    campaignId: string;
    clipperId?: string;
    platform: PlatformType;
    postUrl: string;
    caption?: string;
    notes?: string;
  }): Promise<Submission> {
    const { clipperId: _clipperId, ...body } = data;
    return call('submit', { body });
  }

  static reviewSubmission(data: {
    submissionId: string;
    reviewerId?: string;
    decision: ReviewDecision;
    verifiedViews?: number;
    rejectionReason?: string;
    adminNote?: string;
  }): Promise<{ submission: Submission; payoutCreated?: number }> {
    const { reviewerId: _reviewerId, ...body } = data;
    return call('reviewSubmission', { body });
  }

  // --- WALLET & WITHDRAWALS ---
  static getClipperFinancials(_userId?: string): Promise<{
    availableBalance: number;
    pendingEarnings: number;
    totalApprovedEarnings: number;
    transactions: WalletTransaction[];
    withdrawals: WithdrawalRequest[];
  }> {
    return call('myFinancials');
  }

  static requestWithdrawal(data: { userId?: string; amount: number; paymentMethod: PaymentMethod; paymentIdentifier: string }): Promise<WithdrawalRequest> {
    const { userId: _userId, ...body } = data;
    return call('withdraw', { body });
  }

  static getWithdrawalRequests(statusFilter?: string): Promise<WithdrawalRequest[]> {
    return call('withdrawals', { query: { status: statusFilter } });
  }

  static markWithdrawalPaid(data: { withdrawalId: string; reviewerId?: string; transactionReference: string; adminNote?: string }): Promise<WithdrawalRequest> {
    const { reviewerId: _reviewerId, ...body } = data;
    return call('markWithdrawalPaid', { body });
  }

  static rejectWithdrawal(data: { withdrawalId: string; reviewerId?: string; adminNote: string }): Promise<WithdrawalRequest> {
    const { reviewerId: _reviewerId, ...body } = data;
    return call('rejectWithdrawal', { body });
  }

  // --- CLIPPER PROFILE ---
  static getClipperProfile(_userId?: string): Promise<ClipperProfile | null> {
    return call('myClipperProfile');
  }

  static updateClipperProfile(_userId: string, data: Partial<ClipperProfile>): Promise<ClipperProfile> {
    return call('updateMyClipperProfile', { body: data });
  }

  // --- CLIENT REQUESTS ---
  static createClientRequest(data: Omit<ClientRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ClientRequest> {
    return call('clientRequest', { body: data });
  }

  static getClientRequests(): Promise<ClientRequest[]> {
    return call('clientRequests');
  }

  static updateClientRequestStatus(id: string, status: ClientRequest['status'], adminNotes?: string, _actorId?: string): Promise<ClientRequest> {
    return call('updateClientRequestStatus', { body: { id, status, adminNotes } });
  }

  // --- WHATSAPP ---
  static getWhatsAppSettings(): Promise<WhatsAppSettings> {
    return call('whatsapp');
  }

  static updateWhatsAppSettings(data: Partial<WhatsAppSettings>, _actorId?: string): Promise<WhatsAppSettings> {
    return call('updateWhatsApp', { body: data });
  }

  // --- AUDIT LOGS & METRICS ---
  static getAuditLogs(): Promise<AuditLog[]> {
    return call('auditLogs');
  }

  static getAdminOverviewMetrics(): Promise<{
    activeCampaignsCount: number;
    pendingSubmissionsCount: number;
    pendingWithdrawalsCount: number;
    pendingClientRequestsCount: number;
    totalRegisteredClippers: number;
    totalActiveBudgets: number;
    totalSubmissions: number;
  }> {
    return call('metrics');
  }

  static getLeaderboard(): Promise<Array<{
    rank: number;
    name: string;
    tiktokHandle?: string;
    approvedViews: number;
    approvedClips: number;
    approvedEarnings: number;
  }>> {
    return call('leaderboard');
  }
}

export const ClipCartRepository = ClipBDRepository;
