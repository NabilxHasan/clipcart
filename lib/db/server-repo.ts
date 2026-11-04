// Server Data Layer (Supabase, service role)
// The single source of truth for campaigns, submissions, earnings, wallet ledger, withdrawals, client requests,
// WhatsApp settings and audit logs. Only API routes and server components import this; browsers reach it through
// /api/data/* (lib/db/repository.ts). Money moves only inside the SQL functions of migration 006.

import { supabaseAdmin } from '../supabase/admin';
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
  SubmissionFlag,
} from '../types/database';
import { LedgerEngine } from '../ledger/service';
import { AiModeratorService } from '../moderation/service';
import { detectSqlInjection, sanitizeSqlSafeText } from '../security/anti-sqli';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Links shared before the move still point at the browser-store id of the launch campaign
const LEGACY_IDS: Record<string, string> = { 'cmp-launch-01': 'clip-cart-launch-campaign' };

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export function validateAndSanitizeUrl(rawUrl: string, fieldName = 'URL'): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) throw new Error(`${fieldName} cannot be empty.`);
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`Invalid ${fieldName} format. Must be a full URL (e.g. https://...).`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`${fieldName} must use a secure http: or https: protocol.`);
  }
  if (parsed.username || parsed.password) throw new Error(`${fieldName} cannot contain embedded credentials.`);
  return parsed.toString();
}

function sanitizeText(text?: string, maxLength = 1000): string | undefined {
  if (!text) return undefined;
  return sanitizeSqlSafeText(text, maxLength);
}

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

/** Postgres RAISE EXCEPTION text without the transport prefix. */
function dbError(err: { message: string } | null): never {
  throw new Error((err?.message || 'Database error').replace(/^.*?ERROR:\s*/, ''));
}

// ---------- row mappers ----------

function toCampaign(r: Row): Campaign {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    clientName: r.client_name,
    clientId: r.client_id ?? undefined,
    description: r.description,
    category: r.category,
    status: r.status,
    totalBudget: Number(r.total_budget),
    remainingBudget: Number(r.remaining_budget),
    payoutType: r.payout_type,
    cpmRate: Number(r.cpm_rate),
    fixedReward: Number(r.fixed_reward),
    maxPayoutPerClip: Number(r.max_payout_per_clip),
    minViews: Number(r.min_views),
    maxViews: r.max_views ?? undefined,
    startDate: r.start_date,
    endDate: r.end_date,
    platforms: r.platforms ?? [],
    rules: r.rules ?? [],
    restrictions: r.restrictions ?? [],
    sourceUrl: r.source_url,
    exampleUrl: r.example_url ?? undefined,
    createdBy: r.created_by ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toFlag(r: Row): SubmissionFlag {
  return {
    id: r.id,
    submissionId: r.submission_id,
    complianceScore: r.compliance_score,
    duplicateProbability: r.duplicate_probability,
    suspicionScore: r.suspicion_score,
    ruleViolations: r.rule_violations ?? [],
    reasoningSummary: r.reasoning_summary ?? '',
    recommendedQueue: r.recommended_queue,
    createdAt: r.created_at,
  };
}

// PostgREST embeds one-to-one relations (earnings and submission_flags have a UNIQUE submission_id) as an object
const one = (x: unknown): Row | undefined => (Array.isArray(x) ? x[0] : (x as Row) ?? undefined);

function toSubmission(r: Row): Submission {
  const earning = one(r.earnings);
  const review = [...(r.submission_reviews ?? [])].sort((a: Row, b: Row) => b.created_at.localeCompare(a.created_at))[0];
  const flag = one(r.submission_flags);
  return {
    id: r.id,
    campaignId: r.campaign_id,
    clipperId: r.clipper_id,
    platform: r.platform,
    postUrl: r.post_url,
    caption: r.caption ?? undefined,
    notes: r.notes ?? undefined,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    campaignTitle: r.campaigns?.title,
    clipperName: r.profiles?.full_name,
    flags: flag ? toFlag(flag) : undefined,
    review: review
      ? {
          id: review.id,
          submissionId: r.id,
          reviewerId: review.reviewer_id ?? 'admin',
          decision: review.decision,
          rejectionReason: review.rejection_reason ?? undefined,
          adminNote: review.admin_note ?? undefined,
          createdAt: review.created_at,
        }
      : undefined,
    views: earning ? Number(earning.views) : undefined,
    payout: earning ? Number(earning.approved_amount) : undefined,
  };
}

function toTransaction(r: Row): WalletTransaction {
  return {
    id: r.id,
    userId: r.user_id,
    type: r.type,
    amount: Number(r.amount),
    balanceAfter: Number(r.balance_after),
    referenceType: r.reference_type,
    referenceId: r.reference_id ?? undefined,
    description: r.description,
    createdAt: r.created_at,
  };
}

function toWithdrawal(r: Row): WithdrawalRequest {
  return {
    id: r.id,
    userId: r.user_id,
    amount: Number(r.amount),
    paymentMethod: r.payment_method,
    paymentIdentifier: r.payment_identifier,
    status: r.status,
    reviewedBy: r.reviewed_by ?? undefined,
    reviewedAt: r.reviewed_at ?? undefined,
    transactionReference: r.transaction_reference ?? undefined,
    adminNote: r.admin_note ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    clipperName: r.profiles?.full_name,
    clipperEmail: r.profiles?.email,
  };
}

function toClientRequest(r: Row): ClientRequest {
  return {
    id: r.id,
    name: r.name,
    companyCreator: r.company_creator,
    whatsappNumber: r.whatsapp_number,
    email: r.email,
    campaignObjective: r.campaign_objective,
    platforms: r.platforms ?? [],
    estimatedBudget: Number(r.estimated_budget),
    duration: r.duration,
    contentType: r.content_type,
    sourceUrl: r.source_url ?? undefined,
    requirements: r.requirements ?? undefined,
    status: r.status,
    adminNotes: r.admin_notes ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toWhatsApp(r: Row | null): WhatsAppSettings {
  return {
    communityName: r?.community_name ?? '',
    communityInviteUrl: r?.community_invite_url ?? '',
    announcementGroupUrl: r?.announcement_group_url ?? '',
    businessContactNumber: r?.business_contact_number ?? '',
    campaignTemplate: r?.campaign_template ?? '',
    isEnabled: Boolean(r?.is_enabled),
    updatedAt: r?.updated_at ?? new Date().toISOString(),
  };
}

// clipper_profiles.editing_experience holds JSON {exp, fb} (see lib/auth/server-store.ts)
function parseExperience(raw?: string | null): { exp: string; fb: string } {
  if (raw && raw.startsWith('{')) {
    try {
      const p = JSON.parse(raw);
      return { exp: p.exp ?? '', fb: p.fb ?? '' };
    } catch {
      // plain text
    }
  }
  return { exp: raw || '', fb: '' };
}

function toClipperProfile(r: Row): ClipperProfile {
  const { exp, fb } = parseExperience(r.editing_experience);
  return {
    userId: r.user_id,
    tiktokHandle: r.tiktok_handle ?? undefined,
    instagramHandle: r.instagram_handle ?? undefined,
    youtubeHandle: r.youtube_handle ?? undefined,
    facebookHandle: fb || undefined,
    preferredPlatforms: r.preferred_platforms ?? [],
    editingExperience: exp,
    portfolioUrl: r.portfolio_url ?? undefined,
    paymentMethod: r.payment_method ?? 'BKASH',
    paymentIdentifier: r.payment_identifier ?? undefined,
    signupPaymentMethod: r.signup_payment_method ?? 'BKASH',
    approvedViewsTotal: Number(r.approved_views_total || 0),
    approvedEarningsTotal: Number(r.approved_earnings_total || 0),
    approvedClipsTotal: Number(r.approved_clips_total || 0),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const SUBMISSION_SELECT =
  '*, campaigns(title), profiles(full_name), submission_flags(*), submission_reviews(*), earnings(views, approved_amount)';

export const ServerRepo = {
  // --- CAMPAIGNS ---
  async expireCampaigns(): Promise<void> {
    await supabaseAdmin
      .from('campaigns')
      .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
      .eq('status', 'ACTIVE')
      .lt('end_date', new Date().toISOString());
  },

  async getCampaigns(statusFilter?: string): Promise<Campaign[]> {
    await this.expireCampaigns();
    let q = supabaseAdmin.from('campaigns').select('*').order('created_at', { ascending: false });
    if (statusFilter && statusFilter !== 'ALL') q = q.eq('status', statusFilter);
    return (check(await q) ?? []).map(toCampaign);
  },

  async getActiveCampaigns(): Promise<Campaign[]> {
    return this.getCampaigns('ACTIVE');
  },

  async getCampaignBySlugOrId(identifier: string): Promise<Campaign | null> {
    if (!identifier || detectSqlInjection(identifier).isSuspicious) return null;
    let clean = identifier.trim().toLowerCase();
    clean = LEGACY_IDS[clean] ?? clean;
    await this.expireCampaigns();
    const q = supabaseAdmin.from('campaigns').select('*');
    const { data } = await (UUID_RE.test(clean) ? q.eq('id', clean) : q.eq('slug', clean)).maybeSingle();
    return data ? toCampaign(data) : null;
  },

  async createCampaign(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'remainingBudget' | 'status'>): Promise<Campaign> {
    const sourceUrl = validateAndSanitizeUrl(data.sourceUrl, 'Source Footage Drive URL');
    const exampleUrl = data.exampleUrl ? validateAndSanitizeUrl(data.exampleUrl, 'Example URL') : null;
    if (!(Number(data.totalBudget) >= 500)) throw new Error('Campaign budget must be at least ৳500.');
    const title = sanitizeText(data.title, 150) || 'Untitled Campaign';
    const slugBase = (data.slug || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'campaign';
    const row = check(
      await supabaseAdmin
        .from('campaigns')
        .insert({
          title,
          slug: `${slugBase}-${Date.now().toString(36)}`,
          client_name: sanitizeText(data.clientName, 150) || 'Client',
          description: sanitizeText(data.description, 2000) || '',
          category: sanitizeText(data.category, 100) || 'General',
          status: 'PENDING_PAYMENT',
          total_budget: data.totalBudget,
          remaining_budget: data.totalBudget,
          payout_type: data.payoutType,
          cpm_rate: data.cpmRate,
          fixed_reward: data.fixedReward || 0,
          max_payout_per_clip: data.maxPayoutPerClip || 0,
          min_views: data.minViews || 0,
          max_views: data.maxViews || null,
          start_date: data.startDate,
          end_date: data.endDate,
          platforms: data.platforms,
          rules: (data.rules || []).map(r => sanitizeText(r, 500)).filter(Boolean),
          restrictions: (data.restrictions || []).map(r => sanitizeText(r, 500)).filter(Boolean),
          source_url: sourceUrl,
          example_url: exampleUrl,
        })
        .select('*')
        .single()
    );
    await this.logAudit('CAMPAIGN_CREATED', 'CAMPAIGN', row.id, { title, budget: data.totalBudget });
    return toCampaign(row);
  },

  async markCampaignPaymentReceived(
    campaignId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    transactionReference: string,
    adminNote?: string
  ): Promise<Campaign> {
    if (!UUID_RE.test(campaignId)) throw new Error('Campaign not found');
    check(
      await supabaseAdmin.from('payment_records').insert({
        campaign_id: campaignId,
        amount,
        payment_method: paymentMethod,
        transaction_reference: (transactionReference || '').trim(),
        admin_note: sanitizeText(adminNote, 500) ?? null,
      })
    );
    const row = check(
      await supabaseAdmin
        .from('campaigns')
        .update({ status: 'ACTIVE', updated_at: new Date().toISOString() })
        .eq('id', campaignId)
        .select('*')
        .single()
    );
    await this.logAudit('CAMPAIGN_PAYMENT_VERIFIED_AND_ACTIVATED', 'CAMPAIGN', campaignId, {
      amount,
      method: paymentMethod,
      reference: transactionReference,
    });
    return toCampaign(row);
  },

  async getPaymentRecords(): Promise<PaymentRecord[]> {
    const rows = check(await supabaseAdmin.from('payment_records').select('*').order('created_at', { ascending: false })) ?? [];
    return rows.map((r: Row) => ({
      id: r.id,
      campaignId: r.campaign_id,
      amount: Number(r.amount),
      paymentMethod: r.payment_method,
      transactionReference: r.transaction_reference,
      verifiedBy: r.verified_by ?? 'admin',
      verifiedAt: r.verified_at,
      adminNote: r.admin_note ?? undefined,
      createdAt: r.created_at,
    }));
  },

  // --- SUBMISSIONS ---
  async getSubmissions(filter: { clipperId?: string; campaignId?: string; status?: string }): Promise<Submission[]> {
    let q = supabaseAdmin.from('submissions').select(SUBMISSION_SELECT).order('created_at', { ascending: false });
    if (filter.clipperId) q = q.eq('clipper_id', filter.clipperId);
    if (filter.campaignId && UUID_RE.test(filter.campaignId)) q = q.eq('campaign_id', filter.campaignId);
    if (filter.status && filter.status !== 'ALL') q = q.eq('status', filter.status);
    return (check(await q) ?? []).map(toSubmission);
  },

  async createSubmission(
    clipperId: string,
    data: { campaignId: string; platform: PlatformType; postUrl: string; caption?: string; notes?: string }
  ): Promise<Submission> {
    const campaign = await this.getCampaignBySlugOrId(data.campaignId);
    if (!campaign) throw new Error('Campaign not found');
    if (campaign.status !== 'ACTIVE') throw new Error('Cannot submit to a campaign that is not currently ACTIVE');
    if (!campaign.platforms.includes(data.platform)) throw new Error('This campaign does not accept that platform.');

    const { data: clipper } = await supabaseAdmin.from('profiles').select('status').eq('id', clipperId).maybeSingle();
    if (!clipper) throw new Error('Clipper account not found. Please log in.');
    if (clipper.status !== 'APPROVED') {
      throw new Error('Your clipper account is waiting for admin approval. Submissions are accepted once an admin approves it.');
    }

    const postUrl = validateAndSanitizeUrl(data.postUrl, 'Post URL');
    const caption = sanitizeText(data.caption, 500);
    const notes = sanitizeText(data.notes, 1000);

    const { data: existing } = await supabaseAdmin
      .from('submissions')
      .select('id, campaign_id, clipper_id, platform, post_url, status, created_at, updated_at')
      .eq('campaign_id', campaign.id);
    const preFilter = AiModeratorService.evaluateSubmission({
      platform: data.platform,
      postUrl,
      caption,
      notes,
      existingSubmissions: (existing ?? []).map((r: Row) => ({
        id: r.id,
        campaignId: r.campaign_id,
        clipperId: r.clipper_id,
        platform: r.platform,
        postUrl: r.post_url,
        status: r.status,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })),
      campaignRules: campaign.rules,
    });

    const { data: row, error } = await supabaseAdmin
      .from('submissions')
      .insert({
        campaign_id: campaign.id,
        clipper_id: clipperId,
        platform: data.platform,
        post_url: postUrl,
        caption: caption ?? null,
        notes: notes ?? null,
        status: preFilter.suspicionScore > 60 ? 'FLAGGED' : 'PENDING_HUMAN_REVIEW',
      })
      .select('*')
      .single();
    if (error) {
      if (error.code === '23505') throw new Error('This clip link was already submitted to this campaign.');
      dbError(error);
    }
    await supabaseAdmin.from('submission_flags').insert({
      submission_id: row.id,
      compliance_score: preFilter.complianceScore,
      duplicate_probability: preFilter.duplicateProbability,
      suspicion_score: preFilter.suspicionScore,
      rule_violations: preFilter.ruleViolations,
      reasoning_summary: preFilter.reasoningSummary,
      recommended_queue: preFilter.recommendedQueue,
    });
    return toSubmission(row);
  },

  async reviewSubmission(data: {
    submissionId: string;
    decision: 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES';
    verifiedViews?: number;
    rejectionReason?: string;
    adminNote?: string;
  }): Promise<{ submission: Submission; payoutCreated?: number }> {
    if (!UUID_RE.test(data.submissionId)) throw new Error('Submission not found');
    const adminNote = sanitizeText(data.adminNote, 1000) ?? null;
    let payoutCreated: number | undefined;

    if (data.decision === 'APPROVED') {
      const views = Math.floor(Number(data.verifiedViews) || 0);
      const { data: res, error } = await supabaseAdmin.rpc('approve_submission', {
        p_submission_id: data.submissionId,
        p_verified_views: views,
        p_admin_note: adminNote,
      });
      if (error) dbError(error);
      payoutCreated = Number(res?.[0]?.approved_amount ?? 0);
      await this.logAudit('SUBMISSION_APPROVED', 'SUBMISSION', data.submissionId, {
        views,
        approvedAmount: payoutCreated,
        remainingBudget: Number(res?.[0]?.remaining_budget ?? 0),
      });
    } else {
      const reason = sanitizeText(data.rejectionReason, 500) ?? null;
      const { data: updated, error } = await supabaseAdmin
        .from('submissions')
        .update({ status: 'REJECTED', updated_at: new Date().toISOString() })
        .eq('id', data.submissionId)
        .not('status', 'in', '("APPROVED","REJECTED")')
        .select('id');
      if (error) dbError(error);
      if (!updated?.length) throw new Error('This submission was already reviewed.');
      check(
        await supabaseAdmin.from('submission_reviews').insert({
          submission_id: data.submissionId,
          decision: 'REJECTED',
          rejection_reason: reason,
          admin_note: adminNote,
        })
      );
      await this.logAudit('SUBMISSION_REJECTED', 'SUBMISSION', data.submissionId, { reason, note: adminNote });
    }

    const row = check(await supabaseAdmin.from('submissions').select(SUBMISSION_SELECT).eq('id', data.submissionId).single());
    return { submission: toSubmission(row), payoutCreated };
  },

  // --- WALLET & WITHDRAWALS ---
  async getClipperFinancials(userId: string) {
    const [tx, wd, subs] = await Promise.all([
      supabaseAdmin.from('wallet_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabaseAdmin.from('withdrawal_requests').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabaseAdmin.from('earnings').select('approved_amount').eq('clipper_id', userId).eq('status', 'APPROVED'),
    ]);
    const transactions = (check(tx) ?? []).map(toTransaction);
    return {
      availableBalance: LedgerEngine.computeBalance(transactions),
      pendingEarnings: 0, // unknown until an admin verifies the views (the old ৳1,000-per-clip placeholder overstated it)
      totalApprovedEarnings: (check(subs) ?? []).reduce((acc: number, e: Row) => acc + Number(e.approved_amount), 0),
      transactions,
      withdrawals: (check(wd) ?? []).map(toWithdrawal),
    };
  },

  async requestWithdrawal(userId: string, data: { amount: number; paymentMethod: PaymentMethod; paymentIdentifier: string }) {
    const identifier = (data.paymentIdentifier || '').trim();
    const amount = Math.round(Number(data.amount) * 100) / 100;
    if (!identifier || identifier.length < 5) {
      throw new Error('A valid payment identifier (bKash/Nagad number or Bank details) is required.');
    }
    if (detectSqlInjection(identifier).isSuspicious) throw new Error('Invalid payment identifier.');
    const { data: id, error } = await supabaseAdmin.rpc('request_withdrawal', {
      p_user_id: userId,
      p_amount: amount,
      p_payment_method: data.paymentMethod,
      p_payment_identifier: identifier,
    });
    if (error) dbError(error);
    await this.logAudit('WITHDRAWAL_REQUESTED', 'WITHDRAWAL_REQUEST', id, { amount, method: data.paymentMethod }, userId);
    const row = check(await supabaseAdmin.from('withdrawal_requests').select('*, profiles!withdrawal_requests_user_id_fkey(full_name, email)').eq('id', id).single());
    return toWithdrawal(row);
  },

  async getWithdrawalRequests(statusFilter?: string): Promise<WithdrawalRequest[]> {
    let q = supabaseAdmin.from('withdrawal_requests').select('*, profiles!withdrawal_requests_user_id_fkey(full_name, email)').order('created_at', { ascending: false });
    if (statusFilter && statusFilter !== 'ALL') q = q.eq('status', statusFilter);
    return (check(await q) ?? []).map(toWithdrawal);
  },

  async markWithdrawalPaid(data: { withdrawalId: string; transactionReference: string; adminNote?: string }) {
    const trx = (data.transactionReference || '').trim();
    if (trx.length < 6) {
      throw new Error('A valid Transaction Reference / TrxID (min 6 characters) is required to mark withdrawal as PAID.');
    }
    if (!UUID_RE.test(data.withdrawalId)) throw new Error('Withdrawal request not found');
    const { data: rows, error } = await supabaseAdmin
      .from('withdrawal_requests')
      .update({
        status: 'PAID',
        transaction_reference: trx,
        admin_note: sanitizeText(data.adminNote, 500) ?? null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.withdrawalId)
      .in('status', ['REQUESTED', 'UNDER_REVIEW'])
      .select('*, profiles!withdrawal_requests_user_id_fkey(full_name, email)');
    if (error) dbError(error);
    if (!rows?.length) throw new Error('Withdrawal not found or already settled.');
    await this.logAudit('WITHDRAWAL_PAID', 'WITHDRAWAL_REQUEST', data.withdrawalId, { amount: Number(rows[0].amount), trxRef: trx });
    return toWithdrawal(rows[0]);
  },

  async rejectWithdrawal(data: { withdrawalId: string; adminNote: string }) {
    if (!UUID_RE.test(data.withdrawalId)) throw new Error('Withdrawal request not found');
    const note = sanitizeText(data.adminNote, 500) || 'Rejected by moderator';
    const { error } = await supabaseAdmin.rpc('reject_withdrawal', { p_withdrawal_id: data.withdrawalId, p_admin_note: note });
    if (error) dbError(error);
    await this.logAudit('WITHDRAWAL_REJECTED', 'WITHDRAWAL_REQUEST', data.withdrawalId, { reason: note });
    const row = check(await supabaseAdmin.from('withdrawal_requests').select('*, profiles!withdrawal_requests_user_id_fkey(full_name, email)').eq('id', data.withdrawalId).single());
    return toWithdrawal(row);
  },

  // --- CLIPPER PROFILE ---
  async getClipperProfile(userId: string): Promise<ClipperProfile | null> {
    const { data } = await supabaseAdmin.from('clipper_profiles').select('*').eq('user_id', userId).maybeSingle();
    return data ? toClipperProfile(data) : null;
  },

  async updateClipperProfile(userId: string, data: Partial<ClipperProfile>): Promise<ClipperProfile> {
    const { data: current } = await supabaseAdmin.from('clipper_profiles').select('editing_experience').eq('user_id', userId).maybeSingle();
    if (!current) throw new Error('Clipper profile not found.');
    const prev = parseExperience(current.editing_experience);
    const portfolio = data.portfolioUrl && data.portfolioUrl.trim() ? validateAndSanitizeUrl(data.portfolioUrl, 'Portfolio URL') : null;
    const methods: PaymentMethod[] = ['BKASH', 'NAGAD', 'BANK', 'CASH', 'OTHER'];
    const row = check(
      await supabaseAdmin
        .from('clipper_profiles')
        .update({
          tiktok_handle: sanitizeText(data.tiktokHandle, 100) ?? null,
          instagram_handle: sanitizeText(data.instagramHandle, 100) ?? null,
          youtube_handle: sanitizeText(data.youtubeHandle, 100) ?? null,
          editing_experience: JSON.stringify({
            exp: sanitizeText(data.editingExperience, 1000) ?? prev.exp,
            fb: sanitizeText(data.facebookHandle, 150) ?? '',
          }),
          portfolio_url: portfolio,
          payment_method: methods.includes(data.paymentMethod as PaymentMethod) ? data.paymentMethod : 'BKASH',
          payment_identifier: sanitizeText(data.paymentIdentifier, 100) ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select('*')
        .single()
    );
    return toClipperProfile(row);
  },

  // --- CLIENT REQUESTS ---
  async createClientRequest(data: Omit<ClientRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ClientRequest> {
    const sourceUrl = data.sourceUrl && data.sourceUrl.trim() ? validateAndSanitizeUrl(data.sourceUrl, 'Source Footage URL') : null;
    const platforms = (data.platforms || []).filter(p => ['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK'].includes(p));
    const row = check(
      await supabaseAdmin
        .from('client_requests')
        .insert({
          name: sanitizeText(data.name, 100) || 'Client Lead',
          company_creator: sanitizeText(data.companyCreator, 150) || '',
          whatsapp_number: sanitizeText(data.whatsappNumber, 30) || '',
          email: sanitizeText(data.email, 150) || '',
          campaign_objective: sanitizeText(data.campaignObjective, 1000) || '',
          platforms,
          estimated_budget: Math.max(0, Number(data.estimatedBudget) || 0),
          duration: sanitizeText(data.duration, 100) || '',
          content_type: sanitizeText(data.contentType, 100) || '',
          source_url: sourceUrl,
          requirements: sanitizeText(data.requirements, 1000) ?? null,
        })
        .select('*')
        .single()
    );
    return toClientRequest(row);
  },

  async getClientRequests(): Promise<ClientRequest[]> {
    return (check(await supabaseAdmin.from('client_requests').select('*').order('created_at', { ascending: false })) ?? []).map(toClientRequest);
  },

  async updateClientRequestStatus(id: string, status: ClientRequest['status'], adminNotes?: string): Promise<ClientRequest> {
    if (!UUID_RE.test(id)) throw new Error('Client request not found');
    const patch: Row = { status, updated_at: new Date().toISOString() };
    if (adminNotes !== undefined) patch.admin_notes = sanitizeText(adminNotes, 1000) ?? null;
    const row = check(await supabaseAdmin.from('client_requests').update(patch).eq('id', id).select('*').single());
    await this.logAudit('CLIENT_REQUEST_STATUS_UPDATED', 'CLIENT_REQUEST', id, { status });
    return toClientRequest(row);
  },

  // --- WHATSAPP ---
  async getWhatsAppSettings(): Promise<WhatsAppSettings> {
    const { data } = await supabaseAdmin.from('whatsapp_settings').select('*').eq('id', 1).maybeSingle();
    return toWhatsApp(data);
  },

  async updateWhatsAppSettings(data: Partial<WhatsAppSettings>): Promise<WhatsAppSettings> {
    const invite = data.communityInviteUrl?.trim() ? validateAndSanitizeUrl(data.communityInviteUrl, 'Community invite URL') : '';
    const row = check(
      await supabaseAdmin
        .from('whatsapp_settings')
        .upsert({
          id: 1,
          community_name: sanitizeText(data.communityName, 150) ?? '',
          community_invite_url: invite,
          announcement_group_url: data.announcementGroupUrl?.trim() ? validateAndSanitizeUrl(data.announcementGroupUrl, 'Announcement group URL') : '',
          business_contact_number: sanitizeText(data.businessContactNumber, 30) ?? '',
          campaign_template: (data.campaignTemplate ?? '').slice(0, 2000),
          is_enabled: Boolean(invite),
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single()
    );
    await this.logAudit('WHATSAPP_SETTINGS_UPDATED', 'WHATSAPP_SETTINGS', '1', { isEnabled: Boolean(invite) });
    return toWhatsApp(row);
  },

  // --- AUDIT & METRICS ---
  async logAudit(action: string, targetType: string, targetId: string, metadata: Record<string, unknown>, actorId?: string) {
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: actorId ?? null,
      action,
      target_type: targetType,
      target_id: String(targetId),
      metadata,
    });
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const rows = check(
      await supabaseAdmin.from('audit_logs').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(300)
    ) ?? [];
    return rows.map((r: Row) => ({
      id: r.id,
      actorId: r.actor_id ?? undefined,
      actorName: r.profiles?.full_name ?? (r.actor_id ? 'Clipper' : 'Admin desk'),
      action: r.action,
      targetType: r.target_type,
      targetId: r.target_id,
      metadata: r.metadata ?? {},
      ipAddress: r.ip_address ?? undefined,
      createdAt: r.created_at,
    }));
  },

  async getAdminOverviewMetrics() {
    const head = { count: 'exact' as const, head: true };
    const [camps, subs, wds, crs, clippers, totalSubs] = await Promise.all([
      supabaseAdmin.from('campaigns').select('total_budget').eq('status', 'ACTIVE'),
      supabaseAdmin.from('submissions').select('id', head).in('status', ['PENDING_HUMAN_REVIEW', 'FLAGGED']),
      supabaseAdmin.from('withdrawal_requests').select('id', head).in('status', ['REQUESTED', 'UNDER_REVIEW']),
      supabaseAdmin.from('client_requests').select('id', head).in('status', ['NEW', 'CONTACTED']),
      supabaseAdmin.from('profiles').select('id', head).eq('role', 'CLIPPER'),
      supabaseAdmin.from('submissions').select('id', head),
    ]);
    const active = check(camps) ?? [];
    return {
      activeCampaignsCount: active.length,
      pendingSubmissionsCount: subs.count ?? 0,
      pendingWithdrawalsCount: wds.count ?? 0,
      pendingClientRequestsCount: crs.count ?? 0,
      totalRegisteredClippers: clippers.count ?? 0,
      totalActiveBudgets: active.reduce((acc: number, c: Row) => acc + Number(c.total_budget), 0),
      totalSubmissions: totalSubs.count ?? 0,
    };
  },

  async getLeaderboard() {
    const rows = check(
      await supabaseAdmin
        .from('clipper_profiles')
        .select('tiktok_handle, approved_views_total, approved_clips_total, approved_earnings_total, profiles!inner(full_name, status)')
        .gt('approved_clips_total', 0)
        .order('approved_views_total', { ascending: false })
        .limit(100)
    ) ?? [];
    return rows.map((r: Row, idx: number) => ({
      rank: idx + 1,
      name: r.profiles?.full_name || 'Anonymous Clipper',
      tiktokHandle: r.tiktok_handle ?? undefined,
      approvedViews: Number(r.approved_views_total),
      approvedClips: Number(r.approved_clips_total),
      approvedEarnings: Number(r.approved_earnings_total),
    }));
  },
};
