// Database & Domain Types for CLIPBD

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT' | 'CLIENT' | 'CLIPPER';
export type UserStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'BANNED';
export type CampaignStatus = 'DRAFT' | 'PENDING_PAYMENT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type PayoutType = 'CPM' | 'FIXED';
export type PlatformType = 'TIKTOK' | 'INSTAGRAM' | 'YOUTUBE';
export type SubmissionStatus = 'PENDING_AI_REVIEW' | 'PENDING_HUMAN_REVIEW' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'WITHDRAWN';
export type ReviewDecision = 'APPROVED' | 'REJECTED' | 'REQUEST_CHANGES';
export type PaymentMethod = 'BKASH' | 'NAGAD' | 'BANK' | 'CASH' | 'OTHER';
export type WithdrawalStatus = 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PROCESSING' | 'PAID' | 'REJECTED' | 'CANCELLED';
export type TransactionType = 'CREDIT_EARNING' | 'DEBIT_WITHDRAWAL_LOCK' | 'DEBIT_WITHDRAWAL_SETTLED' | 'ADJUSTMENT_CREDIT' | 'ADJUSTMENT_DEBIT';
export type ClientRequestStatus = 'NEW' | 'CONTACTED' | 'NEGOTIATING' | 'PAYMENT_PENDING' | 'ACTIVE' | 'COMPLETED' | 'REJECTED';
export type NotificationType = 
  | 'NEW_CAMPAIGN'
  | 'SUBMISSION_APPROVED'
  | 'SUBMISSION_REJECTED'
  | 'EARNINGS_UPDATED'
  | 'WITHDRAWAL_REQUESTED'
  | 'WITHDRAWAL_PAID'
  | 'CAMPAIGN_ENDING'
  | 'SYSTEM_ANNOUNCEMENT';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phoneWhatsapp?: string;
  country: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClipperProfile {
  userId: string;
  tiktokHandle?: string;
  instagramHandle?: string;
  youtubeHandle?: string;
  preferredPlatforms: PlatformType[];
  editingExperience?: string;
  portfolioUrl?: string;
  paymentMethod: PaymentMethod;
  paymentIdentifier?: string; // Masked in public views
  approvedViewsTotal: number;
  approvedEarningsTotal: number;
  approvedClipsTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  clientId?: string;
  description: string;
  category: string;
  status: CampaignStatus;
  totalBudget: number;
  remainingBudget: number;
  payoutType: PayoutType;
  cpmRate: number;
  fixedReward: number;
  maxPayoutPerClip: number;
  minViews: number;
  maxViews?: number;
  startDate: string;
  endDate: string;
  platforms: PlatformType[];
  rules: string[];
  restrictions: string[];
  sourceUrl: string; // External Google Drive / cloud asset link
  exampleUrl?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  campaignId: string;
  clipperId: string;
  platform: PlatformType;
  postUrl: string;
  caption?: string;
  notes?: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  campaignTitle?: string;
  clipperName?: string;
  flags?: SubmissionFlag;
  review?: SubmissionReview;
  views?: number;
  payout?: number;
}

export interface SubmissionFlag {
  id: string;
  submissionId: string;
  complianceScore: number; // 0-100
  duplicateProbability: number; // 0-100
  suspicionScore: number; // 0-100
  ruleViolations: string[];
  reasoningSummary: string;
  recommendedQueue: 'AUTO_FORWARD' | 'HUMAN_REVIEW' | 'HIGH_PRIORITY_REVIEW';
  createdAt: string;
}

export interface SubmissionReview {
  id: string;
  submissionId: string;
  reviewerId: string;
  decision: ReviewDecision;
  rejectionReason?: string;
  adminNote?: string;
  createdAt: string;
}

export interface Earning {
  id: string;
  clipperId: string;
  campaignId: string;
  submissionId: string;
  views: number;
  cpm: number;
  calculatedAmount: number;
  approvedAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  createdAt: string;
  approvedAt?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  referenceType: string;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentIdentifier: string;
  status: WithdrawalStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  transactionReference?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  clipperName?: string;
  clipperEmail?: string;
}

export interface PaymentRecord {
  id: string;
  campaignId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  verifiedBy: string;
  verifiedAt: string;
  adminNote?: string;
  createdAt: string;
}

export interface ClientRequest {
  id: string;
  name: string;
  companyCreator: string;
  whatsappNumber: string;
  email: string;
  campaignObjective: string;
  platforms: PlatformType[];
  estimatedBudget: number;
  duration: string;
  contentType: string;
  sourceUrl?: string;
  requirements?: string;
  status: ClientRequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppSettings {
  communityName: string;
  communityInviteUrl: string;
  announcementGroupUrl: string;
  businessContactNumber: string;
  campaignTemplate: string;
  isEnabled: boolean;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  actorName?: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}
