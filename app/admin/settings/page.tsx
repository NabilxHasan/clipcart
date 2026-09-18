'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Save, 
  HelpCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { WhatsAppSettings } from '../../../lib/types/database';
import { WhatsAppPendingBadge } from '../../../components/shared/WhatsAppPendingBadge';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [communityName, setCommunityName] = useState('');
  const [communityInviteUrl, setCommunityInviteUrl] = useState('');
  const [announcementGroupUrl, setAnnouncementGroupUrl] = useState('');
  const [businessContactNumber, setBusinessContactNumber] = useState('');
  const [campaignTemplate, setCampaignTemplate] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await ClipBDRepository.getWhatsAppSettings();
      setSettings(data);
      setCommunityName(data.communityName || '');
      setCommunityInviteUrl(data.communityInviteUrl || '');
      setAnnouncementGroupUrl(data.announcementGroupUrl || '');
      setBusinessContactNumber(data.businessContactNumber || '');
      setCampaignTemplate(data.campaignTemplate);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const updated = await ClipBDRepository.updateWhatsAppSettings({
        communityName,
        communityInviteUrl,
        announcementGroupUrl,
        businessContactNumber,
        campaignTemplate,
      });

      setSettings(updated);
      setFeedback(
        updated.isEnabled
          ? 'WhatsApp Community settings configured and enabled across the site!'
          : 'Settings updated. Integration remains in Pending Setup mode until invite URL is provided.'
      );
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="neo-box p-12 text-center font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
        Loading platform settings...
      </div>
    );
  }

  const isConfigured = Boolean(settings.isEnabled && settings.communityInviteUrl);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="neo-box-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
              Platform Configuration
            </span>
            <span className="neo-sticker bg-emerald-100 text-emerald-950 border-emerald-950 text-[10px] flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              WhatsApp Decoupled Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-['Unbounded'] font-black uppercase text-zinc-950 dark:text-white tracking-tight">
            Settings & WhatsApp Setup
          </h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Decoupled architecture for community channels and business contact numbers.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold font-mono">
          {feedback}
        </div>
      )}

      {/* Official WhatsApp Requirement Box */}
      <div className="neo-box p-6 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white uppercase">
              WhatsApp Integration Status
            </h2>
          </div>
          <WhatsAppPendingBadge
            isConfigured={isConfigured}
            communityName={settings.communityName}
            inviteUrl={settings.communityInviteUrl}
          />
        </div>

        {!isConfigured ? (
          <div className="neo-box p-4.5 bg-amber-50 dark:bg-amber-950/30 border-amber-950 dark:border-amber-700 space-y-2 text-xs text-amber-950 dark:text-amber-200">
            <div className="flex items-center gap-2 font-black font-['Unbounded'] text-amber-700 dark:text-amber-300 uppercase text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp Integration — Safe Pending State</span>
            </div>
            <p className="leading-relaxed font-medium">
              WhatsApp integration is intentionally decoupled. The owner creates the actual WhatsApp Community manually. No tokens or fake links are hardcoded into the platform.
            </p>
            <div className="pt-2.5 border-t-2 border-amber-950/20 dark:border-amber-750/40 space-y-1.5 font-mono text-[11px]">
              <p className="font-bold text-zinc-950 dark:text-white uppercase text-[10px]">Information required from owner:</p>
              <ul className="list-disc list-inside space-y-0.5 text-amber-900 dark:text-amber-300 font-bold">
                <li>1. Community invite URL (e.g. <code>https://chat.whatsapp.com/invite/...</code>)</li>
                <li>2. Announcement group / invite link (read-only channel)</li>
                <li>3. WhatsApp Business contact number for direct brand inquiries</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="neo-box p-4 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-xs text-emerald-950 dark:text-emerald-200 flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Active Community configured: <strong>{settings.communityName}</strong></span>
          </div>
        )}
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="neo-box p-6 sm:p-8 space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="text-xs font-['Unbounded'] font-black uppercase tracking-wider text-zinc-950 dark:text-white border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
            Community & Channel URLs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Community Name</label>
              <input
                type="text"
                placeholder="e.g. ClipCart Creators Community"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">WhatsApp Business Contact Phone</label>
              <input
                type="text"
                placeholder="+8801XXXXXXXXX"
                value={businessContactNumber}
                onChange={(e) => setBusinessContactNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
              <span className="text-[10px] text-zinc-500 font-medium">Used for &ldquo;Chat on WhatsApp&rdquo; brand inquiry buttons.</span>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">WhatsApp Community Invite URL</label>
              <input
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={communityInviteUrl}
                onChange={(e) => setCommunityInviteUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
              <span className="text-[10px] text-zinc-500 font-medium">Leave blank to maintain safe &ldquo;Pending Setup&rdquo; state.</span>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Announcement Group URL (Optional)</label>
              <input
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={announcementGroupUrl}
                onChange={(e) => setAnnouncementGroupUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
          </div>
        </div>

        {/* Campaign Announcement Template */}
        <div className="space-y-2 pt-3 border-t-2 border-zinc-950 dark:border-zinc-700">
          <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Campaign Broadcast Message Template</label>
          <textarea
            rows={4}
            value={campaignTemplate}
            onChange={(e) => setCampaignTemplate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
          />
          <p className="text-[10px] text-zinc-500 font-mono">
            Supported variables: &#123;&#123;title&#125;&#125;, &#123;&#123;budget&#125;&#125;, &#123;&#123;cpm&#125;&#125;, &#123;&#123;platforms&#125;&#125;, &#123;&#123;url&#125;&#125;
          </p>
        </div>

        <div className="pt-3 border-t-2 border-zinc-950 dark:border-zinc-700 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="neo-btn neo-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
