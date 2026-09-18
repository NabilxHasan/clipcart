// WhatsApp Integration & Notification Abstraction
// Fulfills Section 2, 21, 22 & 40 of Master Specification.
// Maintains "WhatsApp Integration — Pending Setup" until owner supplies actual Community credentials.
// Zero fake tokens, zero web scraping, zero unofficial automation hacks.

import { Campaign, Submission, WithdrawalRequest, WhatsAppSettings } from '../types/database';

export interface NotificationPayload {
  recipientName: string;
  targetPhone?: string;
  title: string;
  body: string;
  actionUrl?: string;
  deepLink?: string;
}

export interface NotificationProvider {
  isConfigured(): boolean;
  getStatus(): { status: 'PENDING_SETUP' | 'READY'; message: string };
  formatCampaignAnnouncement(campaign: Campaign): NotificationPayload;
  formatSubmissionStatus(submission: Submission, clipperName: string, status: string, note?: string): NotificationPayload;
  formatWithdrawalUpdate(withdrawal: WithdrawalRequest, clipperName: string, reference?: string): NotificationPayload;
  getClientInquiryUrl(prefilledMessage?: string): string | null;
  getCommunityInviteUrl(): string | null;
}

export class ManualWhatsAppProvider implements NotificationProvider {
  private settings: WhatsAppSettings;

  constructor(settings?: Partial<WhatsAppSettings>) {
    this.settings = {
      communityName: settings?.communityName || '',
      communityInviteUrl: settings?.communityInviteUrl || '',
      announcementGroupUrl: settings?.announcementGroupUrl || '',
      businessContactNumber: settings?.businessContactNumber || '',
      campaignTemplate: settings?.campaignTemplate || '🔥 NEW CAMPAIGN ON CLIPCART: {{title}}\n💰 Budget: ৳{{budget}} | Rate: ৳{{cpm}}/1k views\n🎯 Platforms: {{platforms}}\n🔗 Join & Submit: {{url}}',
      isEnabled: Boolean(settings?.isEnabled && settings?.communityInviteUrl),
      updatedAt: settings?.updatedAt || new Date().toISOString(),
    };
  }

  isConfigured(): boolean {
    return Boolean(this.settings.isEnabled && this.settings.communityInviteUrl.trim().length > 0);
  }

  getStatus(): { status: 'PENDING_SETUP' | 'READY'; message: string } {
    if (!this.isConfigured()) {
      return {
        status: 'PENDING_SETUP',
        message: 'WhatsApp Community integration is pending setup. The owner has not yet configured the community or announcement group URL.',
      };
    }
    return {
      status: 'READY',
      message: `Active community: ${this.settings.communityName || 'ClipCart Creators'}`,
    };
  }

  getCommunityInviteUrl(): string | null {
    if (!this.settings.communityInviteUrl || this.settings.communityInviteUrl.trim() === '') {
      return null;
    }
    return this.settings.communityInviteUrl;
  }

  getClientInquiryUrl(prefilledMessage = 'Hello ClipCart, I want to launch a clipping campaign for my brand/content.'): string | null {
    const phone = this.settings.businessContactNumber?.replace(/[^0-9]/g, '');
    if (!phone || phone.length < 10) {
      return null;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(prefilledMessage)}`;
  }

  formatCampaignAnnouncement(campaign: Campaign): NotificationPayload {
    const text = this.settings.campaignTemplate
      .replace('{{title}}', campaign.title)
      .replace('{{budget}}', campaign.totalBudget.toLocaleString('en-US'))
      .replace('{{cpm}}', campaign.cpmRate ? campaign.cpmRate.toString() : 'Fixed')
      .replace('{{platforms}}', campaign.platforms.join(', '))
      .replace('{{url}}', `${process.env.NEXT_PUBLIC_SITE_URL || 'https://clipcart.com'}/campaigns/${campaign.slug}`);

    return {
      recipientName: 'ClipCart Community',
      title: `New Campaign: ${campaign.title}`,
      body: text,
      actionUrl: `/campaigns/${campaign.slug}`,
      deepLink: this.settings.announcementGroupUrl || undefined,
    };
  }

  formatSubmissionStatus(submission: Submission, clipperName: string, status: string, note?: string): NotificationPayload {
    const body = `Hi ${clipperName}, your submission for "${submission.campaignTitle || 'Campaign'}" has been marked as: ${status}.${note ? ` Note: ${note}` : ''}`;
    return {
      recipientName: clipperName,
      title: `Submission Update: ${status}`,
      body,
      actionUrl: `/dashboard/submissions`,
    };
  }

  formatWithdrawalUpdate(withdrawal: WithdrawalRequest, clipperName: string, reference?: string): NotificationPayload {
    let body = `Hi ${clipperName}, your withdrawal request of ৳${withdrawal.amount.toLocaleString()} via ${withdrawal.paymentMethod} has been updated to: ${withdrawal.status}.`;
    if (reference) {
      body += ` TrxID / Ref: ${reference}.`;
    }
    return {
      recipientName: clipperName,
      title: `Payout Update: ৳${withdrawal.amount} (${withdrawal.status})`,
      body,
      actionUrl: `/dashboard/withdrawals`,
    };
  }
}
