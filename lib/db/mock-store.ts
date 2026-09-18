// ClipCart - Production Local Store & Hydration Engine
// Persistent storage engine for campaigns, clippers, submissions, and payments.

import {
  Profile,
  ClipperProfile,
  Campaign,
  Submission,
  SubmissionFlag,
  SubmissionReview,
  Earning,
  WalletTransaction,
  WithdrawalRequest,
  PaymentRecord,
  ClientRequest,
  WhatsAppSettings,
  NotificationItem,
  AuditLog,
} from '../types/database';

class ClipBDStore {
  profiles: Profile[] = [
    {
      id: 'usr-admin-01',
      email: 'admin@clipcart.com',
      role: 'SUPER_ADMIN',
      fullName: 'ClipCart Operations',
      phoneWhatsapp: '+8801337142248',
      country: 'Bangladesh',
      status: 'APPROVED',
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-01T10:00:00Z',
    },
  ];

  clipperProfiles: ClipperProfile[] = [];
  campaigns: Campaign[] = [];
  submissions: Submission[] = [];
  submissionFlags: SubmissionFlag[] = [];
  submissionReviews: SubmissionReview[] = [];
  earnings: Earning[] = [];
  walletTransactions: WalletTransaction[] = [];
  withdrawalRequests: WithdrawalRequest[] = [];
  paymentRecords: PaymentRecord[] = [];
  clientRequests: ClientRequest[] = [];

  whatsappSettings: WhatsAppSettings = {
    communityName: 'ClipCart Bangladesh Creators',
    communityInviteUrl: 'https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan',
    announcementGroupUrl: 'https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan',
    businessContactNumber: '+8801337142248',
    campaignTemplate: '🔥 NEW CAMPAIGN ON CLIPCART: {{title}}\n💰 Budget: ৳{{budget}} | Rate: ৳{{cpm}}/1k views\n🎯 Platforms: {{platforms}}\n🔗 Join & Submit: {{url}}',
    isEnabled: true,
    updatedAt: '2026-09-19T00:00:00Z',
  };

  notifications: NotificationItem[] = [];

  auditLogs: AuditLog[] = [
    {
      id: 'aud-init-01',
      actorId: 'usr-admin-01',
      actorName: 'ClipCart Operations',
      action: 'PLATFORM_INITIALIZED',
      targetType: 'PLATFORM',
      targetId: 'clipcart-bd',
      metadata: { mode: 'PRODUCTION_COMMERCIAL' },
      ipAddress: '103.145.12.4',
      createdAt: new Date().toISOString(),
    },
  ];

  constructor() {
    this.loadFromStorage();
  }

  clearDemoData() {
    this.campaigns = [];
    this.submissions = [];
    this.submissionFlags = [];
    this.submissionReviews = [];
    this.earnings = [];
    this.walletTransactions = [];
    this.withdrawalRequests = [];
    this.paymentRecords = [];
    this.clientRequests = [];
    this.clipperProfiles = [];
    this.profiles = this.profiles.filter(p => p.role === 'SUPER_ADMIN' || p.role === 'ADMIN');
    this.saveToStorage();
  }

  saveToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const payload = {
          profiles: this.profiles,
          clipperProfiles: this.clipperProfiles,
          campaigns: this.campaigns,
          submissions: this.submissions,
          submissionFlags: this.submissionFlags,
          submissionReviews: this.submissionReviews,
          earnings: this.earnings,
          walletTransactions: this.walletTransactions,
          withdrawalRequests: this.withdrawalRequests,
          paymentRecords: this.paymentRecords,
          clientRequests: this.clientRequests,
          whatsappSettings: this.whatsappSettings,
          notifications: this.notifications,
          auditLogs: this.auditLogs,
        };
        window.localStorage.setItem('clipcart_db_state_v2', JSON.stringify(payload));
      } catch {
        // Storage quota exceeded or blocked; safely fail silent
      }
    }
  }

  loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Remove legacy hackathon demo storage
        if (window.localStorage.getItem('clipcart_db_state_v1')) {
          window.localStorage.removeItem('clipcart_db_state_v1');
        }

        const raw = window.localStorage.getItem('clipcart_db_state_v2');
        if (raw) {
          const data = JSON.parse(raw);
          if (Array.isArray(data.profiles) && data.profiles.length) this.profiles = data.profiles;
          if (Array.isArray(data.clipperProfiles)) this.clipperProfiles = data.clipperProfiles;
          if (Array.isArray(data.campaigns)) this.campaigns = data.campaigns;
          if (Array.isArray(data.submissions)) this.submissions = data.submissions;
          if (Array.isArray(data.submissionFlags)) this.submissionFlags = data.submissionFlags;
          if (Array.isArray(data.submissionReviews)) this.submissionReviews = data.submissionReviews;
          if (Array.isArray(data.earnings)) this.earnings = data.earnings;
          if (Array.isArray(data.walletTransactions)) this.walletTransactions = data.walletTransactions;
          if (Array.isArray(data.withdrawalRequests)) this.withdrawalRequests = data.withdrawalRequests;
          if (Array.isArray(data.paymentRecords)) this.paymentRecords = data.paymentRecords;
          if (Array.isArray(data.clientRequests)) this.clientRequests = data.clientRequests;
          if (data.whatsappSettings && data.whatsappSettings.communityInviteUrl) this.whatsappSettings = data.whatsappSettings;
          if (Array.isArray(data.notifications)) this.notifications = data.notifications;
          if (Array.isArray(data.auditLogs)) this.auditLogs = data.auditLogs;
        } else {
          this.saveToStorage();
        }
      } catch {
        // Corrupted storage; fallback to initial state
      }
    }
  }
}

// Global Singleton in Node/Next runtime
const globalForStore = globalThis as unknown as { clipBDStore?: ClipBDStore };
export const mockStore = globalForStore.clipBDStore ?? new ClipBDStore();
if (process.env.NODE_ENV !== 'production') globalForStore.clipBDStore = mockStore;
