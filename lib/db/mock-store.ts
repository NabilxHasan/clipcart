// Mock Data Store for Local Development & Offline Testing
// Adheres to Section 35: Clearly marked development records that mirror the production PostgreSQL schema.

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
      email: 'admin@clipbd.com',
      role: 'SUPER_ADMIN',
      fullName: 'ClipBD Operations',
      phoneWhatsapp: '+8801337142248',
      country: 'Bangladesh',
      status: 'APPROVED',
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 'usr-mod-01',
      email: 'moderator@clipbd.com',
      role: 'MODERATOR',
      fullName: 'Senior Reviewer',
      phoneWhatsapp: '+8801800000000',
      country: 'Bangladesh',
      status: 'APPROVED',
      createdAt: '2026-09-02T10:00:00Z',
      updatedAt: '2026-09-02T10:00:00Z',
    },
    {
      id: 'usr-clipper-01',
      email: 'tanvir@creators.bd',
      role: 'CLIPPER',
      fullName: 'Tanvir Hossain',
      phoneWhatsapp: '+8801911223344',
      country: 'Bangladesh',
      status: 'APPROVED',
      createdAt: '2026-09-03T12:00:00Z',
      updatedAt: '2026-09-03T12:00:00Z',
    },
    {
      id: 'usr-clipper-02',
      email: 'nusrat@motioncraft.io',
      role: 'CLIPPER',
      fullName: 'Nusrat Jahan',
      phoneWhatsapp: '+8801755667788',
      country: 'Bangladesh',
      status: 'APPROVED',
      createdAt: '2026-09-04T14:00:00Z',
      updatedAt: '2026-09-04T14:00:00Z',
    },
  ];

  clipperProfiles: ClipperProfile[] = [
    {
      userId: 'usr-clipper-01',
      tiktokHandle: '@tanvir.edits',
      instagramHandle: '@tanvir.visuals',
      youtubeHandle: '@TanvirShorts',
      preferredPlatforms: ['TIKTOK', 'YOUTUBE'],
      editingExperience: '3 years editing podcast clips and viral reels using Premiere & CapCut',
      portfolioUrl: 'https://youtube.com/@TanvirShorts',
      paymentMethod: 'BKASH',
      paymentIdentifier: '01911223344',
      approvedViewsTotal: 185000,
      approvedEarningsTotal: 18500,
      approvedClipsTotal: 6,
      createdAt: '2026-09-03T12:00:00Z',
      updatedAt: '2026-09-10T15:00:00Z',
    },
    {
      userId: 'usr-clipper-02',
      tiktokHandle: '@nusrat_cuts',
      instagramHandle: '@nusrat.reels',
      youtubeHandle: '@NusratClipsBD',
      preferredPlatforms: ['INSTAGRAM', 'TIKTOK'],
      editingExperience: 'Short-form content creator focusing on tech breakdowns and business podcasts',
      portfolioUrl: 'https://instagram.com/nusrat.reels',
      paymentMethod: 'NAGAD',
      paymentIdentifier: '01755667788',
      approvedViewsTotal: 92000,
      approvedEarningsTotal: 9200,
      approvedClipsTotal: 4,
      createdAt: '2026-09-04T14:00:00Z',
      updatedAt: '2026-09-11T16:00:00Z',
    },
  ];

  campaigns: Campaign[] = [
    {
      id: 'cmp-001',
      title: 'Startup Stories BD — Founder Ep 42 (3-Day Sprint)',
      slug: 'startup-stories-bd-ep42',
      clientName: 'Startup Stories Bangladesh',
      description: '3-day micro-campaign! Cut high-retention short clips highlighting the biggest founder mistakes and funding insights from our interview with Chaldal founder.',
      category: 'Business & Tech',
      status: 'ACTIVE',
      totalBudget: 1000,
      remainingBudget: 750,
      payoutType: 'CPM',
      cpmRate: 50, // ৳50 per 1,000 views
      fixedReward: 0,
      maxPayoutPerClip: 500,
      minViews: 500,
      maxViews: 10000,
      startDate: '2026-09-05T00:00:00Z',
      endDate: '2026-09-25T23:59:59Z',
      platforms: ['TIKTOK', 'INSTAGRAM', 'YOUTUBE'],
      rules: [
        'Must include on-screen English/Bangla animated captions.',
        'Clip duration must be between 20 to 58 seconds (9:16 vertical).',
        'Must tag @StartupStoriesBD in caption and use hashtag #StartupBD.',
        'No misleading or clickbait titles that misrepresent the speaker.',
      ],
      restrictions: [
        'Do not use copyrighted audio tracks that cause platform muting.',
        'Do not alter the speaker voice with robotic voice-changers.',
      ],
      sourceUrl: 'https://drive.google.com/drive/folders/demo-startup-stories-ep42',
      exampleUrl: 'https://youtube.com/shorts/demo-winning-example-1',
      createdBy: 'usr-admin-01',
      createdAt: '2026-09-05T08:00:00Z',
      updatedAt: '2026-09-05T10:00:00Z',
    },
    {
      id: 'cmp-002',
      title: 'DevCast Bangladesh — AI Tools for Developers (5-Day Run)',
      slug: 'devcast-bd-ai-tools',
      clientName: 'DevCast BD',
      description: '5-day flexible campaign: highlight practical coding demos where our guest builds a local AI agent workflow in 5 minutes.',
      category: 'Software & Education',
      status: 'ACTIVE',
      totalBudget: 2500,
      remainingBudget: 1900,
      payoutType: 'CPM',
      cpmRate: 60,
      fixedReward: 0,
      maxPayoutPerClip: 1000,
      minViews: 500,
      maxViews: 20000,
      startDate: '2026-09-08T00:00:00Z',
      endDate: '2026-09-28T23:59:59Z',
      platforms: ['TIKTOK', 'YOUTUBE'],
      rules: [
        'Hook must appear within first 2 seconds.',
        'Clear screen recording clarity showing terminal/editor text.',
      ],
      restrictions: [
        'No blurry 720p re-encodes.',
      ],
      sourceUrl: 'https://drive.google.com/drive/folders/demo-devcast-ep12',
      createdBy: 'usr-admin-01',
      createdAt: '2026-09-08T09:00:00Z',
      updatedAt: '2026-09-08T09:00:00Z',
    },
    {
      id: 'cmp-003',
      title: 'GreenBengal Organic — Healthy Snacks Brand Launch (7-Day)',
      slug: 'greenbengal-organic-launch',
      clientName: 'GreenBengal Agro Ltd',
      description: '7-day product launch: clipping lifestyle cooking videos and farm-to-table origin segments into appetizing reels.',
      category: 'E-Commerce / Food',
      status: 'PENDING_PAYMENT',
      totalBudget: 5000,
      remainingBudget: 5000,
      payoutType: 'CPM',
      cpmRate: 75,
      fixedReward: 0,
      maxPayoutPerClip: 2000,
      minViews: 1000,
      startDate: '2026-09-20T00:00:00Z',
      endDate: '2026-10-20T23:59:59Z',
      platforms: ['INSTAGRAM', 'TIKTOK'],
      rules: ['Warm aesthetic, clean transitions.'],
      restrictions: ['No negative comparative claims.'],
      sourceUrl: 'https://drive.google.com/drive/folders/demo-greenbengal',
      createdBy: 'usr-admin-01',
      createdAt: '2026-09-12T14:00:00Z',
      updatedAt: '2026-09-12T14:00:00Z',
    },
  ];

  submissions: Submission[] = [
    {
      id: 'sub-001',
      campaignId: 'cmp-001',
      clipperId: 'usr-clipper-01',
      platform: 'TIKTOK',
      postUrl: 'https://tiktok.com/@tanvir.edits/video/7289182749182739182',
      caption: 'Why 90% of early-stage startups in Dhaka fail in year one 🚨 #StartupBD #FounderStories',
      notes: 'Focused on the founder funding breakdown segment at 18:24.',
      status: 'APPROVED',
      createdAt: '2026-09-07T14:20:00Z',
      updatedAt: '2026-09-09T11:00:00Z',
      campaignTitle: 'Startup Stories BD — Episode 42 Clips Campaign',
      clipperName: 'Tanvir Hossain',
      views: 65000,
      payout: 5000, // Capped at max 5000
    },
    {
      id: 'sub-002',
      campaignId: 'cmp-001',
      clipperId: 'usr-clipper-02',
      platform: 'INSTAGRAM',
      postUrl: 'https://instagram.com/reel/C3x91ZqA8kL/',
      caption: 'The single hiring mistake that cost ৳20 Lakhs 📈 #founderlife #bangladesh',
      notes: 'Added custom kinetic typography and beat cuts.',
      status: 'APPROVED',
      createdAt: '2026-09-08T18:40:00Z',
      updatedAt: '2026-09-10T09:30:00Z',
      campaignTitle: 'Startup Stories BD — Episode 42 Clips Campaign',
      clipperName: 'Nusrat Jahan',
      views: 32000,
      payout: 3200,
    },
    {
      id: 'sub-003',
      campaignId: 'cmp-001',
      clipperId: 'usr-clipper-01',
      platform: 'YOUTUBE',
      postUrl: 'https://youtube.com/shorts/9f8s7d6f5a4',
      caption: 'How Chaldal scaled logistics during monsoon season #Dhaka #TechBD',
      notes: 'High retention format.',
      status: 'PENDING_HUMAN_REVIEW',
      createdAt: '2026-09-13T16:15:00Z',
      updatedAt: '2026-09-13T16:15:00Z',
      campaignTitle: 'Startup Stories BD — Episode 42 Clips Campaign',
      clipperName: 'Tanvir Hossain',
    },
  ];

  submissionFlags: SubmissionFlag[] = [
    {
      id: 'flg-001',
      submissionId: 'sub-001',
      complianceScore: 98,
      duplicateProbability: 0,
      suspicionScore: 5,
      ruleViolations: [],
      reasoningSummary: 'URL syntax valid, unique submission, meets campaign duration requirements.',
      recommendedQueue: 'AUTO_FORWARD',
      createdAt: '2026-09-07T14:21:00Z',
    },
    {
      id: 'flg-002',
      submissionId: 'sub-002',
      complianceScore: 95,
      duplicateProbability: 0,
      suspicionScore: 8,
      ruleViolations: [],
      reasoningSummary: 'Valid Instagram Reel, clean metadata.',
      recommendedQueue: 'AUTO_FORWARD',
      createdAt: '2026-09-08T18:41:00Z',
    },
    {
      id: 'flg-003',
      submissionId: 'sub-003',
      complianceScore: 88,
      duplicateProbability: 5,
      suspicionScore: 12,
      ruleViolations: [],
      reasoningSummary: 'Automated check: Valid YouTube Shorts format. Ready for human moderator view verification.',
      recommendedQueue: 'HUMAN_REVIEW',
      createdAt: '2026-09-13T16:16:00Z',
    },
  ];

  submissionReviews: SubmissionReview[] = [
    {
      id: 'rev-001',
      submissionId: 'sub-001',
      reviewerId: 'usr-mod-01',
      decision: 'APPROVED',
      adminNote: 'Excellent kinetic typography, verified 65K real views on TikTok. Payout capped at ৳5,000.',
      createdAt: '2026-09-09T11:00:00Z',
    },
    {
      id: 'rev-002',
      submissionId: 'sub-002',
      reviewerId: 'usr-mod-01',
      decision: 'APPROVED',
      adminNote: 'Verified 32,000 views on Instagram. Payout ৳3,200.',
      createdAt: '2026-09-10T09:30:00Z',
    },
  ];

  earnings: Earning[] = [
    {
      id: 'ern-001',
      clipperId: 'usr-clipper-01',
      campaignId: 'cmp-001',
      submissionId: 'sub-001',
      views: 65000,
      cpm: 100,
      calculatedAmount: 6500,
      approvedAmount: 5000,
      status: 'APPROVED',
      createdAt: '2026-09-09T11:00:00Z',
      approvedAt: '2026-09-09T11:00:00Z',
    },
    {
      id: 'ern-002',
      clipperId: 'usr-clipper-02',
      campaignId: 'cmp-001',
      submissionId: 'sub-002',
      views: 32000,
      cpm: 100,
      calculatedAmount: 3200,
      approvedAmount: 3200,
      status: 'APPROVED',
      createdAt: '2026-09-10T09:30:00Z',
      approvedAt: '2026-09-10T09:30:00Z',
    },
  ];

  walletTransactions: WalletTransaction[] = [
    {
      id: 'tx-001',
      userId: 'usr-clipper-01',
      type: 'CREDIT_EARNING',
      amount: 5000,
      balanceAfter: 5000,
      referenceType: 'EARNING',
      referenceId: 'ern-001',
      description: 'Approved clip performance payout for Startup Stories BD Ep 42',
      createdAt: '2026-09-09T11:05:00Z',
    },
    {
      id: 'tx-002',
      userId: 'usr-clipper-01',
      type: 'DEBIT_WITHDRAWAL_SETTLED',
      amount: 3000,
      balanceAfter: 2000,
      referenceType: 'WITHDRAWAL_REQUEST',
      referenceId: 'wd-001',
      description: 'Settled withdrawal via bKash TrxID: BK928410291',
      createdAt: '2026-09-10T15:00:00Z',
    },
    {
      id: 'tx-003',
      userId: 'usr-clipper-02',
      type: 'CREDIT_EARNING',
      amount: 3200,
      balanceAfter: 3200,
      referenceType: 'EARNING',
      referenceId: 'ern-002',
      description: 'Approved clip performance payout for Startup Stories BD Ep 42',
      createdAt: '2026-09-10T09:35:00Z',
    },
  ];

  withdrawalRequests: WithdrawalRequest[] = [
    {
      id: 'wd-001',
      userId: 'usr-clipper-01',
      amount: 3000,
      paymentMethod: 'BKASH',
      paymentIdentifier: '01911223344',
      status: 'PAID',
      reviewedBy: 'usr-admin-01',
      reviewedAt: '2026-09-10T14:55:00Z',
      transactionReference: 'BK928410291',
      adminNote: 'Dispatched from official ClipBD bKash Merchant account.',
      createdAt: '2026-09-09T16:00:00Z',
      updatedAt: '2026-09-10T15:00:00Z',
      clipperName: 'Tanvir Hossain',
      clipperEmail: 'tanvir@creators.bd',
    },
    {
      id: 'wd-002',
      userId: 'usr-clipper-02',
      amount: 2500,
      paymentMethod: 'NAGAD',
      paymentIdentifier: '01755667788',
      status: 'REQUESTED',
      createdAt: '2026-09-12T11:00:00Z',
      updatedAt: '2026-09-12T11:00:00Z',
      clipperName: 'Nusrat Jahan',
      clipperEmail: 'nusrat@motioncraft.io',
    },
  ];

  paymentRecords: PaymentRecord[] = [
    {
      id: 'pay-001',
      campaignId: 'cmp-001',
      amount: 50000,
      paymentMethod: 'BANK',
      transactionReference: 'EBL-FT-82910482',
      verifiedBy: 'usr-admin-01',
      verifiedAt: '2026-09-04T16:00:00Z',
      adminNote: 'Verified wire deposit to Eastern Bank account. Campaign budget unlocked.',
      createdAt: '2026-09-04T16:00:00Z',
    },
    {
      id: 'pay-002',
      campaignId: 'cmp-002',
      amount: 30000,
      paymentMethod: 'BANK',
      transactionReference: 'BRAC-TX-1092837',
      verifiedBy: 'usr-admin-01',
      verifiedAt: '2026-09-07T12:00:00Z',
      adminNote: 'Verified payment. Campaign ready.',
      createdAt: '2026-09-07T12:00:00Z',
    },
  ];

  clientRequests: ClientRequest[] = [
    {
      id: 'cr-001',
      name: 'Rahim Ahmed',
      companyCreator: 'Dhaka FinTech Roundtables',
      whatsappNumber: '+8801712345678',
      email: 'rahim@dhakafintech.com',
      campaignObjective: 'Distribute 10 podcast episodes to reach young software engineers and entrepreneurs in Bangladesh.',
      platforms: ['TIKTOK', 'YOUTUBE'],
      estimatedBudget: 75000,
      duration: '45 days',
      contentType: 'Business & Fintech Podcast Interviews',
      sourceUrl: 'https://youtube.com/playlist?list=demo-fintech',
      requirements: 'Highlight regulatory insights and fintech founding stories.',
      status: 'CONTACTED',
      adminNotes: 'Connected on WhatsApp on Sep 11. Sending rate card and sample campaign brief.',
      createdAt: '2026-09-10T10:00:00Z',
      updatedAt: '2026-09-11T11:30:00Z',
    },
  ];

  whatsappSettings: WhatsAppSettings = {
    communityName: 'ClipCart Bangladesh Creators',
    communityInviteUrl: 'https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan',
    announcementGroupUrl: 'https://chat.whatsapp.com/LUK6WkzD9KZ2fpuZgy0pan',
    businessContactNumber: '+8801337142248',
    campaignTemplate: '🔥 NEW CAMPAIGN ON CLIPCART: {{title}}\n💰 Budget: ৳{{budget}} | Rate: ৳{{cpm}}/1k views\n🎯 Platforms: {{platforms}}\n🔗 Join & Submit: {{url}}',
    isEnabled: true,
    updatedAt: '2026-09-19T00:00:00Z',
  };

  notifications: NotificationItem[] = [
    {
      id: 'notif-001',
      userId: 'usr-clipper-01',
      type: 'SUBMISSION_APPROVED',
      title: 'Submission Approved & Credited',
      message: 'Your clip for Startup Stories BD Ep 42 was approved. ৳5,000 has been credited to your wallet.',
      linkUrl: '/dashboard/earnings',
      isRead: true,
      createdAt: '2026-09-09T11:05:00Z',
    },
    {
      id: 'notif-002',
      userId: 'usr-clipper-01',
      type: 'WITHDRAWAL_PAID',
      title: 'Withdrawal Dispatched (bKash)',
      message: 'Your withdrawal of ৳3,000 was completed. TrxID: BK928410291.',
      linkUrl: '/dashboard/withdrawals',
      isRead: false,
      createdAt: '2026-09-10T15:00:00Z',
    },
  ];

  auditLogs: AuditLog[] = [
    {
      id: 'aud-001',
      actorId: 'usr-admin-01',
      actorName: 'ClipBD Operations',
      action: 'CAMPAIGN_ACTIVATED',
      targetType: 'CAMPAIGN',
      targetId: 'cmp-001',
      metadata: { initialBudget: 50000, verifiedPaymentRef: 'EBL-FT-82910482' },
      ipAddress: '103.145.12.4',
      createdAt: '2026-09-05T08:30:00Z',
    },
    {
      id: 'aud-002',
      actorId: 'usr-mod-01',
      actorName: 'Senior Reviewer',
      action: 'SUBMISSION_APPROVED',
      targetType: 'SUBMISSION',
      targetId: 'sub-001',
      metadata: { views: 65000, payout: 5000, reason: 'Verified views' },
      ipAddress: '103.145.12.8',
      createdAt: '2026-09-09T11:00:00Z',
    },
    {
      id: 'aud-003',
      actorId: 'usr-admin-01',
      actorName: 'ClipBD Operations',
      action: 'WITHDRAWAL_PAID',
      targetType: 'WITHDRAWAL_REQUEST',
      targetId: 'wd-001',
      metadata: { amount: 3000, method: 'BKASH', trxId: 'BK928410291' },
      ipAddress: '103.145.12.4',
      createdAt: '2026-09-10T15:00:00Z',
    },
  ];

  constructor() {
    this.loadFromStorage();
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
        window.localStorage.setItem('clipcart_db_state_v1', JSON.stringify(payload));
      } catch {
        // Storage quota exceeded or blocked; safely fail silent in demo
      }
    }
  }

  loadFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem('clipcart_db_state_v1');
        if (raw) {
          const data = JSON.parse(raw);
          if (Array.isArray(data.profiles) && data.profiles.length) this.profiles = data.profiles;
          if (Array.isArray(data.clipperProfiles) && data.clipperProfiles.length) this.clipperProfiles = data.clipperProfiles;
          if (Array.isArray(data.campaigns) && data.campaigns.length) this.campaigns = data.campaigns;
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
      } catch {
        // Corrupted storage; fallback to seed state
      }
    }
  }
}

// Global Singleton in Node/Next runtime
const globalForStore = globalThis as unknown as { clipBDStore?: ClipBDStore };
export const mockStore = globalForStore.clipBDStore ?? new ClipBDStore();
if (process.env.NODE_ENV !== 'production') globalForStore.clipBDStore = mockStore;
