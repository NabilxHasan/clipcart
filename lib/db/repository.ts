// Application Data Repository
// Bridges business logic to persistence layer with financial safety checks.

import { mockStore } from './mock-store';
import {
  Campaign,
  Submission,
  WithdrawalRequest,
  ClientRequest,
  WhatsAppSettings,
  Profile,
  ClipperProfile,
  WalletTransaction,
  AuditLog,
  PlatformType,
  PaymentMethod,
  ReviewDecision,
} from '../types/database';
import { LedgerEngine } from '../ledger/service';
import { AiModeratorService } from '../moderation/service';

export function validateAndSanitizeUrl(rawUrl: string, fieldName = 'URL'): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    throw new Error(`${fieldName} cannot be empty.`);
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`Invalid ${fieldName} format. Must be a full URL (e.g. https://...).`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`${fieldName} must use a secure http: or https: protocol.`);
  }
  if (parsed.username || parsed.password) {
    throw new Error(`${fieldName} cannot contain embedded credentials.`);
  }
  return parsed.toString();
}

export function sanitizeText(text?: string, maxLength = 1000): string | undefined {
  if (!text) return undefined;
  // Strip control characters (except newlines and tabs)
  const cleaned = text.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '').trim();
  return cleaned.slice(0, maxLength);
}

export class ClipBDRepository {
  // --- AUTH & PROFILES ---
  static async getProfiles(): Promise<Profile[]> {
    return mockStore.profiles;
  }

  static async getProfileById(userId: string): Promise<Profile | null> {
    return mockStore.profiles.find(p => p.id === userId) || null;
  }

  static async getClipperProfile(userId: string): Promise<ClipperProfile | null> {
    return mockStore.clipperProfiles.find(cp => cp.userId === userId) || null;
  }

  static async updateClipperProfile(userId: string, data: Partial<ClipperProfile>): Promise<ClipperProfile> {
    if (data.portfolioUrl && data.portfolioUrl.trim()) {
      data.portfolioUrl = validateAndSanitizeUrl(data.portfolioUrl, 'Portfolio URL');
    }
    const idx = mockStore.clipperProfiles.findIndex(cp => cp.userId === userId);
    if (idx >= 0) {
      mockStore.clipperProfiles[idx] = {
        ...mockStore.clipperProfiles[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      mockStore.saveToStorage();
      return mockStore.clipperProfiles[idx];
    }
    const newProfile: ClipperProfile = {
      userId,
      preferredPlatforms: data.preferredPlatforms || ['TIKTOK'],
      paymentMethod: data.paymentMethod || 'BKASH',
      paymentIdentifier: data.paymentIdentifier || '',
      approvedViewsTotal: 0,
      approvedEarningsTotal: 0,
      approvedClipsTotal: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    mockStore.clipperProfiles.push(newProfile);
    mockStore.saveToStorage();
    return newProfile;
  }

  // --- CAMPAIGNS ---
  static async getCampaigns(statusFilter?: string): Promise<Campaign[]> {
    if (statusFilter && statusFilter !== 'ALL') {
      return mockStore.campaigns.filter(c => c.status === statusFilter);
    }
    return mockStore.campaigns;
  }

  static async getActiveCampaigns(): Promise<Campaign[]> {
    return mockStore.campaigns.filter(c => c.status === 'ACTIVE');
  }

  static async getCampaignBySlugOrId(identifier: string): Promise<Campaign | null> {
    return mockStore.campaigns.find(c => c.id === identifier || c.slug === identifier) || null;
  }

  static async createCampaign(data: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'remainingBudget' | 'status'>, actorId: string): Promise<Campaign> {
    const validatedDrive = validateAndSanitizeUrl(data.sourceUrl, 'Source Footage Drive URL');
    const validatedExample = data.exampleUrl ? validateAndSanitizeUrl(data.exampleUrl, 'Example URL') : undefined;
    const cleanTitle = sanitizeText(data.title, 150) || 'Untitled Campaign';
    const cleanDesc = sanitizeText(data.description, 2000) || '';

    if (data.totalBudget < 500) {
      throw new Error('Campaign budget must be at least ৳500.');
    }

    const id = `cmp-${Date.now().toString(36)}`;
    const newCampaign: Campaign = {
      ...data,
      title: cleanTitle,
      description: cleanDesc,
      sourceUrl: validatedDrive,
      exampleUrl: validatedExample,
      id,
      status: 'PENDING_PAYMENT',
      remainingBudget: data.totalBudget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStore.campaigns.unshift(newCampaign);
    mockStore.saveToStorage();

    this.logAudit({
      actorId,
      action: 'CAMPAIGN_CREATED',
      targetType: 'CAMPAIGN',
      targetId: id,
      metadata: { title: cleanTitle, budget: data.totalBudget },
    });

    return newCampaign;
  }

  static async markCampaignPaymentReceived(
    campaignId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    transactionReference: string,
    verifiedBy: string,
    adminNote?: string
  ): Promise<Campaign> {
    const campaign = mockStore.campaigns.find(c => c.id === campaignId);
    if (!campaign) throw new Error('Campaign not found');

    // Record verified client payment
    const paymentId = `pay-${Date.now().toString(36)}`;
    mockStore.paymentRecords.push({
      id: paymentId,
      campaignId,
      amount,
      paymentMethod,
      transactionReference: (transactionReference || '').trim(),
      verifiedBy,
      verifiedAt: new Date().toISOString(),
      adminNote: sanitizeText(adminNote, 500),
      createdAt: new Date().toISOString(),
    });

    // Activate campaign
    campaign.status = 'ACTIVE';
    campaign.updatedAt = new Date().toISOString();
    mockStore.saveToStorage();

    this.logAudit({
      actorId: verifiedBy,
      action: 'CAMPAIGN_PAYMENT_VERIFIED_AND_ACTIVATED',
      targetType: 'CAMPAIGN',
      targetId: campaignId,
      metadata: { amount, method: paymentMethod, reference: transactionReference },
    });

    return campaign;
  }

  // --- SUBMISSIONS & MODERATION ---
  static async getSubmissions(filter?: { campaignId?: string; clipperId?: string; status?: string }): Promise<Submission[]> {
    let list = [...mockStore.submissions];
    if (filter?.campaignId) list = list.filter(s => s.campaignId === filter.campaignId);
    if (filter?.clipperId) list = list.filter(s => s.clipperId === filter.clipperId);
    if (filter?.status && filter.status !== 'ALL') list = list.filter(s => s.status === filter.status);

    // Populate joined metadata
    return list.map(s => {
      const campaign = mockStore.campaigns.find(c => c.id === s.campaignId);
      const clipper = mockStore.profiles.find(p => p.id === s.clipperId);
      const flag = mockStore.submissionFlags.find(f => f.submissionId === s.id);
      const review = mockStore.submissionReviews.find(r => r.submissionId === s.id);
      const earning = mockStore.earnings.find(e => e.submissionId === s.id);

      return {
        ...s,
        campaignTitle: campaign?.title,
        clipperName: clipper?.fullName,
        flags: flag,
        review,
        views: earning?.views,
        payout: earning?.approvedAmount,
      };
    });
  }

  static async createSubmission(data: {
    campaignId: string;
    clipperId: string;
    platform: PlatformType;
    postUrl: string;
    caption?: string;
    notes?: string;
  }): Promise<Submission> {
    const campaign = mockStore.campaigns.find(c => c.id === data.campaignId);
    if (!campaign) throw new Error('Campaign not found');
    if (campaign.status !== 'ACTIVE') throw new Error('Cannot submit to a campaign that is not currently ACTIVE');

    // Strict authentication check: clipper must be an APPROVED verified account
    const clipper = mockStore.profiles.find(p => p.id === data.clipperId);
    if (!clipper) {
      throw new Error('Clipper account not found. Please log in.');
    }
    if (clipper.status !== 'APPROVED') {
      throw new Error(
        'Your clipper account is pending ৳50 sign-up verification. Submissions are only accepted once your account is verified by admins.'
      );
    }

    // Strict security check: Neutralize stored XSS / malicious schemes
    const sanitizedPostUrl = validateAndSanitizeUrl(data.postUrl, 'Post URL');
    const sanitizedCaption = sanitizeText(data.caption, 500);
    const sanitizedNotes = sanitizeText(data.notes, 1000);

    // Run AI / Heuristic Pre-filter
    const preFilterResult = AiModeratorService.evaluateSubmission({
      platform: data.platform,
      postUrl: sanitizedPostUrl,
      caption: sanitizedCaption,
      notes: sanitizedNotes,
      existingSubmissions: mockStore.submissions,
      campaignRules: campaign.rules,
    });

    const submissionId = `sub-${Date.now().toString(36)}`;
    const flagId = `flg-${Date.now().toString(36)}`;

    // Store automated evaluation flag
    mockStore.submissionFlags.push({
      id: flagId,
      submissionId,
      ...preFilterResult,
      createdAt: new Date().toISOString(),
    });

    const newSub: Submission = {
      id: submissionId,
      campaignId: data.campaignId,
      clipperId: data.clipperId,
      platform: data.platform,
      postUrl: sanitizedPostUrl,
      caption: sanitizedCaption,
      notes: sanitizedNotes,
      status: preFilterResult.suspicionScore > 60 ? 'FLAGGED' : 'PENDING_HUMAN_REVIEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.submissions.unshift(newSub);
    mockStore.saveToStorage();
    return newSub;
  }

  static async reviewSubmission(data: {
    submissionId: string;
    reviewerId: string;
    decision: ReviewDecision;
    verifiedViews?: number;
    rejectionReason?: string;
    adminNote?: string;
  }): Promise<{ submission: Submission; payoutCreated?: number }> {
    const sub = mockStore.submissions.find(s => s.id === data.submissionId);
    if (!sub) throw new Error('Submission not found');
    const campaign = mockStore.campaigns.find(c => c.id === sub.campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const reviewId = `rev-${Date.now().toString(36)}`;
    mockStore.submissionReviews.push({
      id: reviewId,
      submissionId: sub.id,
      reviewerId: data.reviewerId,
      decision: data.decision,
      rejectionReason: data.rejectionReason,
      adminNote: data.adminNote,
      createdAt: new Date().toISOString(),
    });

    let payoutCreated: number | undefined;

    if (data.decision === 'APPROVED') {
      const views = data.verifiedViews || 0;
      const payoutResult = LedgerEngine.calculatePayout(campaign, views);

      if (!payoutResult.meetsMinViews) {
        throw new Error(`Submission has ${views} views, which is less than the campaign minimum of ${campaign.minViews} views.`);
      }

      // Record Earning
      const earningId = `ern-${Date.now().toString(36)}`;
      mockStore.earnings.push({
        id: earningId,
        clipperId: sub.clipperId,
        campaignId: campaign.id,
        submissionId: sub.id,
        views,
        cpm: campaign.cpmRate,
        calculatedAmount: payoutResult.calculatedAmount,
        approvedAmount: payoutResult.approvedAmount,
        status: 'APPROVED',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      });

      // Update campaign remaining budget
      campaign.remainingBudget = Math.max(0, campaign.remainingBudget - payoutResult.approvedAmount);

      // Add Credit to User Wallet Ledger
      const userTransactions = mockStore.walletTransactions.filter(t => t.userId === sub.clipperId);
      const currentBalance = LedgerEngine.computeBalance(userTransactions);
      const newBalance = currentBalance + payoutResult.approvedAmount;

      mockStore.walletTransactions.push({
        id: `tx-${Date.now().toString(36)}`,
        userId: sub.clipperId,
        type: 'CREDIT_EARNING',
        amount: payoutResult.approvedAmount,
        balanceAfter: newBalance,
        referenceType: 'EARNING',
        referenceId: earningId,
        description: `Approved clip performance payout (${views.toLocaleString()} verified views on ${sub.platform})`,
        createdAt: new Date().toISOString(),
      });

      // Update Clipper Profile Totals
      const cp = mockStore.clipperProfiles.find(c => c.userId === sub.clipperId);
      if (cp) {
        cp.approvedViewsTotal += views;
        cp.approvedEarningsTotal += payoutResult.approvedAmount;
        cp.approvedClipsTotal += 1;
      }

      sub.status = 'APPROVED';
      payoutCreated = payoutResult.approvedAmount;

      this.logAudit({
        actorId: data.reviewerId,
        action: 'SUBMISSION_APPROVED',
        targetType: 'SUBMISSION',
        targetId: sub.id,
        metadata: { views, approvedAmount: payoutResult.approvedAmount, campaignId: campaign.id },
      });
    } else {
      sub.status = 'REJECTED';
      this.logAudit({
        actorId: data.reviewerId,
        action: 'SUBMISSION_REJECTED',
        targetType: 'SUBMISSION',
        targetId: sub.id,
        metadata: { reason: data.rejectionReason, note: data.adminNote },
      });
    }

    sub.updatedAt = new Date().toISOString();
    mockStore.saveToStorage();
    return { submission: sub, payoutCreated };
  }

  // --- LEDGER & WITHDRAWALS ---
  static async getClipperFinancials(userId: string): Promise<{
    availableBalance: number;
    pendingEarnings: number;
    totalApprovedEarnings: number;
    transactions: WalletTransaction[];
    withdrawals: WithdrawalRequest[];
  }> {
    const transactions = mockStore.walletTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const withdrawals = mockStore.withdrawalRequests
      .filter(w => w.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const availableBalance = LedgerEngine.computeBalance(transactions);

    // Calculate pending earnings from submissions under review
    const pendingSubs = mockStore.submissions.filter(s => s.clipperId === userId && s.status !== 'APPROVED' && s.status !== 'REJECTED');
    const pendingEarnings = pendingSubs.length * 1000; // Estimated placeholder for dashboard indicators

    const userEarnings = mockStore.earnings.filter(e => e.clipperId === userId && e.status === 'APPROVED');
    const totalApprovedEarnings = userEarnings.reduce((acc, curr) => acc + curr.approvedAmount, 0);

    return {
      availableBalance,
      pendingEarnings,
      totalApprovedEarnings,
      transactions,
      withdrawals,
    };
  }

  static async requestWithdrawal(data: {
    userId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentIdentifier: string;
  }): Promise<WithdrawalRequest> {
    const userTx = mockStore.walletTransactions.filter(t => t.userId === data.userId);
    const balance = LedgerEngine.computeBalance(userTx);

    const validation = LedgerEngine.validateWithdrawal(balance, data.amount, data.paymentMethod, data.paymentIdentifier);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const withdrawalId = `wd-${Date.now().toString(36)}`;
    const user = mockStore.profiles.find(p => p.id === data.userId);
    if (!user || user.status !== 'APPROVED') {
      throw new Error('Only verified clippers with an APPROVED account can request withdrawals.');
    }

    // 1. Lock funds immediately in wallet ledger
    mockStore.walletTransactions.push({
      id: `tx-${Date.now().toString(36)}`,
      userId: data.userId,
      type: 'DEBIT_WITHDRAWAL_LOCK',
      amount: data.amount,
      balanceAfter: balance - data.amount,
      referenceType: 'WITHDRAWAL_REQUEST',
      referenceId: withdrawalId,
      description: `Withdrawal request locked for ${data.paymentMethod} payout to ${data.paymentIdentifier.slice(-4).padStart(data.paymentIdentifier.length, '*')}`,
      createdAt: new Date().toISOString(),
    });

    // 2. Create withdrawal request
    const request: WithdrawalRequest = {
      id: withdrawalId,
      userId: data.userId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentIdentifier: data.paymentIdentifier,
      status: 'REQUESTED',
      clipperName: user?.fullName,
      clipperEmail: user?.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.withdrawalRequests.unshift(request);

    this.logAudit({
      actorId: data.userId,
      action: 'WITHDRAWAL_REQUESTED',
      targetType: 'WITHDRAWAL_REQUEST',
      targetId: withdrawalId,
      metadata: { amount: data.amount, method: data.paymentMethod },
    });

    mockStore.saveToStorage();
    return request;
  }

  static async getWithdrawalRequests(statusFilter?: string): Promise<WithdrawalRequest[]> {
    let list = [...mockStore.withdrawalRequests];
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter(w => w.status === statusFilter);
    }
    return list.map(w => {
      const user = mockStore.profiles.find(p => p.id === w.userId);
      return {
        ...w,
        clipperName: user?.fullName,
        clipperEmail: user?.email,
      };
    });
  }

  static async markWithdrawalPaid(data: {
    withdrawalId: string;
    reviewerId: string;
    transactionReference: string;
    adminNote?: string;
  }): Promise<WithdrawalRequest> {
    const item = mockStore.withdrawalRequests.find(w => w.id === data.withdrawalId);
    if (!item) throw new Error('Withdrawal request not found');

    if (item.status !== 'REQUESTED' && item.status !== 'UNDER_REVIEW') {
      throw new Error(`Cannot mark withdrawal as PAID: current status is already ${item.status}.`);
    }

    if (!data.transactionReference || data.transactionReference.trim().length < 6) {
      throw new Error('A valid Transaction Reference / TrxID (min 6 characters) is required to mark withdrawal as PAID.');
    }

    item.status = 'PAID';
    item.reviewedBy = data.reviewerId;
    item.reviewedAt = new Date().toISOString();
    item.transactionReference = data.transactionReference.trim();
    item.adminNote = sanitizeText(data.adminNote, 500);
    item.updatedAt = new Date().toISOString();

    this.logAudit({
      actorId: data.reviewerId,
      action: 'WITHDRAWAL_PAID',
      targetType: 'WITHDRAWAL_REQUEST',
      targetId: item.id,
      metadata: { amount: item.amount, method: item.paymentMethod, trxRef: data.transactionReference },
    });

    mockStore.saveToStorage();
    return item;
  }

  static async rejectWithdrawal(data: {
    withdrawalId: string;
    reviewerId: string;
    adminNote: string;
  }): Promise<WithdrawalRequest> {
    const item = mockStore.withdrawalRequests.find(w => w.id === data.withdrawalId);
    if (!item) throw new Error('Withdrawal request not found');

    if (item.status !== 'REQUESTED' && item.status !== 'UNDER_REVIEW') {
      throw new Error(`Cannot reject withdrawal: current status is already ${item.status}. Duplicate refund prevented.`);
    }

    const cleanNote = sanitizeText(data.adminNote, 500) || 'Rejected by moderator';

    item.status = 'REJECTED';
    item.reviewedBy = data.reviewerId;
    item.reviewedAt = new Date().toISOString();
    item.adminNote = cleanNote;
    item.updatedAt = new Date().toISOString();

    // Revert the locked funds by issuing a compensating CREDIT_ADJUSTMENT
    const userTx = mockStore.walletTransactions.filter(t => t.userId === item.userId);
    const balance = LedgerEngine.computeBalance(userTx);

    mockStore.walletTransactions.push({
      id: `tx-${Date.now().toString(36)}`,
      userId: item.userId,
      type: 'ADJUSTMENT_CREDIT',
      amount: item.amount,
      balanceAfter: balance + item.amount,
      referenceType: 'WITHDRAWAL_REJECTED',
      referenceId: item.id,
      description: `Reversal of locked funds for rejected withdrawal: ${cleanNote}`,
      createdAt: new Date().toISOString(),
    });

    this.logAudit({
      actorId: data.reviewerId,
      action: 'WITHDRAWAL_REJECTED',
      targetType: 'WITHDRAWAL_REQUEST',
      targetId: item.id,
      metadata: { amount: item.amount, reason: cleanNote },
    });

    mockStore.saveToStorage();
    return item;
  }

  // --- CLIENT CRM REQUESTS ---
  static async createClientRequest(data: Omit<ClientRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ClientRequest> {
    const validatedSource = data.sourceUrl && data.sourceUrl.trim() ? validateAndSanitizeUrl(data.sourceUrl, 'Source Footage URL') : undefined;
    const cleanName = sanitizeText(data.name, 100) || 'Client Lead';
    const cleanCompany = sanitizeText(data.companyCreator, 150) || '';
    const cleanObjective = sanitizeText(data.campaignObjective, 1000) || '';
    const cleanReqs = sanitizeText(data.requirements, 1000);

    const id = `cr-${Date.now().toString(36)}`;
    const newReq: ClientRequest = {
      ...data,
      name: cleanName,
      companyCreator: cleanCompany,
      campaignObjective: cleanObjective,
      requirements: cleanReqs,
      sourceUrl: validatedSource,
      id,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStore.clientRequests.unshift(newReq);
    mockStore.saveToStorage();
    return newReq;
  }

  static async getClientRequests(): Promise<ClientRequest[]> {
    return mockStore.clientRequests;
  }

  static async updateClientRequestStatus(id: string, status: ClientRequest['status'], adminNotes?: string, actorId?: string): Promise<ClientRequest> {
    const req = mockStore.clientRequests.find(r => r.id === id);
    if (!req) throw new Error('Client request not found');
    req.status = status;
    if (adminNotes !== undefined) req.adminNotes = sanitizeText(adminNotes, 1000);
    req.updatedAt = new Date().toISOString();
    mockStore.saveToStorage();

    this.logAudit({
      actorId,
      action: 'CLIENT_REQUEST_STATUS_UPDATED',
      targetType: 'CLIENT_REQUEST',
      targetId: id,
      metadata: { status, adminNotes },
    });

    return req;
  }

  // --- WHATSAPP CONFIGURATION ---
  static async getWhatsAppSettings(): Promise<WhatsAppSettings> {
    return mockStore.whatsappSettings;
  }

  static async updateWhatsAppSettings(data: Partial<WhatsAppSettings>, actorId?: string): Promise<WhatsAppSettings> {
    mockStore.whatsappSettings = {
      ...mockStore.whatsappSettings,
      ...data,
      isEnabled: Boolean(data.communityInviteUrl && data.communityInviteUrl.trim().length > 0),
      updatedAt: new Date().toISOString(),
    };
    mockStore.saveToStorage();

    this.logAudit({
      actorId,
      action: 'WHATSAPP_SETTINGS_UPDATED',
      targetType: 'WHATSAPP_SETTINGS',
      targetId: '1',
      metadata: { isEnabled: mockStore.whatsappSettings.isEnabled },
    });

    return mockStore.whatsappSettings;
  }

  // --- AUDIT LOGS & METRICS ---
  static async getAuditLogs(): Promise<AuditLog[]> {
    return mockStore.auditLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static logAudit(entry: Omit<AuditLog, 'id' | 'createdAt'>): void {
    const actor = mockStore.profiles.find(p => p.id === entry.actorId);
    mockStore.auditLogs.unshift({
      id: `aud-${Date.now().toString(36)}`,
      actorName: actor?.fullName || 'System',
      ...entry,
      createdAt: new Date().toISOString(),
    });
    mockStore.saveToStorage();
  }

  static async getAdminOverviewMetrics(): Promise<{
    activeCampaignsCount: number;
    pendingSubmissionsCount: number;
    pendingWithdrawalsCount: number;
    pendingClientRequestsCount: number;
    totalRegisteredClippers: number;
    totalActiveBudgets: number;
  }> {
    const activeCampaigns = mockStore.campaigns.filter(c => c.status === 'ACTIVE');
    const pendingSubmissions = mockStore.submissions.filter(s => s.status === 'PENDING_HUMAN_REVIEW' || s.status === 'FLAGGED');
    const pendingWithdrawals = mockStore.withdrawalRequests.filter(w => w.status === 'REQUESTED' || w.status === 'UNDER_REVIEW');
    const pendingClientRequests = mockStore.clientRequests.filter(r => r.status === 'NEW' || r.status === 'CONTACTED');
    const clippers = mockStore.profiles.filter(p => p.role === 'CLIPPER');
    const totalActiveBudgets = activeCampaigns.reduce((acc, c) => acc + c.totalBudget, 0);

    return {
      activeCampaignsCount: activeCampaigns.length,
      pendingSubmissionsCount: pendingSubmissions.length,
      pendingWithdrawalsCount: pendingWithdrawals.length,
      pendingClientRequestsCount: pendingClientRequests.length,
      totalRegisteredClippers: clippers.length,
      totalActiveBudgets,
    };
  }

  static async getLeaderboard(): Promise<Array<{
    rank: number;
    name: string;
    tiktokHandle?: string;
    approvedViews: number;
    approvedClips: number;
    approvedEarnings: number;
  }>> {
    const sorted = [...mockStore.clipperProfiles].sort((a, b) => b.approvedViewsTotal - a.approvedViewsTotal);
    return sorted.map((cp, idx) => {
      const user = mockStore.profiles.find(p => p.id === cp.userId);
      return {
        rank: idx + 1,
        name: user?.fullName || 'Anonymous Clipper',
        tiktokHandle: cp.tiktokHandle,
        approvedViews: cp.approvedViewsTotal,
        approvedClips: cp.approvedClipsTotal,
        approvedEarnings: cp.approvedEarningsTotal,
      };
    });
  }
}

export const ClipCartRepository = ClipBDRepository;
