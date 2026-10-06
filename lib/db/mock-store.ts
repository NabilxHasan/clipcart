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

export const defaultLaunchCampaign: Campaign = {
  id: 'cmp-launch-01',
  title: 'ClipCart Launch Campaign',
  slug: 'clip-cart-launch-campaign',
  clientName: 'ClipCart BD',
  description:
    'ClipCart প্ল্যাটফর্মের অফিসিয়াল লঞ্চ ক্যাম্পেইন! ClipCart কীভাবে কাজ করে, ক্লিপারদের ০% ফি এবং মাত্র ৳৫০ মিনিমাম বিকাশে ক্যাশআউট নিয়ে ক্রিয়েটিভ শর্টস, টিকটক ও রিলস তৈরি করে আয় করুন। প্রতি ১,০০০ ভিউয়ে নিশ্চিত ৳৫০ CPM!',
  category: 'Tech & Creator Economy',
  status: 'ACTIVE',
  totalBudget: 1000,
  remainingBudget: 1000,
  payoutType: 'CPM',
  cpmRate: 50,
  fixedReward: 0,
  maxPayoutPerClip: 500,
  minViews: 500,
  maxViews: 20000,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  platforms: ['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK'],
  rules: [
    'ভিডিও অবশ্যই ৯:১৬ ভার্টিক্যাল ফরম্যাটে হতে হবে (২০-৫৮ সেকেন্ড)।',
    'অন-স্ক্রিন আকর্ষণীয় অ্যানিমেটেড বাংলা বা ইংরেজি ক্যাপশন থাকতে হবে।',
    'ক্যাপশনে @ClipCartBD ট্যাগ এবং #ClipCartBD হ্যাশট্যাগ ব্যবহার করতে হবে।',
    'ক্লিপারদের ০% ফি ও সরাসরি বিকাশে দ্রুত পেমেন্টের সুবিধা উল্লেখ করতে হবে।',
  ],
  restrictions: [
    'কপিরাইটযুক্ত সাউন্ড বা অডিও ব্যবহার করা যাবে না যা প্ল্যাটফর্মে মিউট হয়।',
    'অপ্রাসঙ্গিক বা বিভ্রান্তিকর ক্লিকবেইট টাইটেল ব্যবহার করা যাবে না।',
  ],
  sourceUrl: 'https://drive.google.com/drive/folders/1clipcart-official-assets',
  exampleUrl: 'https://youtube.com/shorts/clipcart-launch-demo',
  createdBy: 'usr-admin-01',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

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
  campaigns: Campaign[] = [{ ...defaultLaunchCampaign }];
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
    this.campaigns = [{ ...defaultLaunchCampaign }];
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
          if (Array.isArray(data.profiles) && data.profiles.length) {
            this.profiles = (data.profiles as Profile[]).filter((p: Profile) => p.id !== 'usr-nabil-01');
          }
          if (Array.isArray(data.clipperProfiles)) {
            this.clipperProfiles = (data.clipperProfiles as ClipperProfile[]).filter((cp: ClipperProfile) => cp.signupTrxId !== 'DIQ7WUNHRX');
          }
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
        }

        // Ensure active launch campaign is always present with ৳1,000 budget and 30-day duration
        const thirtyDaysFuture = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        if (!this.campaigns || this.campaigns.length === 0) {
          this.campaigns = [{
            ...defaultLaunchCampaign,
            startDate: new Date().toISOString(),
            endDate: thirtyDaysFuture,
          }];
        } else {
          for (const c of this.campaigns) {
            if (
              c.id === 'cmp-launch-01' ||
              c.slug === 'clip-cart-launch-campaign' ||
              c.title.toLowerCase().includes('launch') ||
              c.clientName.toLowerCase().includes('clipcart') ||
              this.campaigns.length === 1
            ) {
              c.totalBudget = 1000;
              c.remainingBudget = 1000;
              c.status = 'ACTIVE';
              c.startDate = new Date().toISOString();
              c.endDate = thirtyDaysFuture;
              c.updatedAt = new Date().toISOString();
            }
          }

          const hasLaunch = this.campaigns.some(
            c => c.id === 'cmp-launch-01' || c.slug === 'clip-cart-launch-campaign'
          );
          if (!hasLaunch) {
            this.campaigns.unshift({
              ...defaultLaunchCampaign,
              startDate: new Date().toISOString(),
              endDate: thirtyDaysFuture,
            });
          }
        }
        this.saveToStorage();
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
