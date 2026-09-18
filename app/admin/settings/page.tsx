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
  ShieldCheck,
  KeyRound,
  Trash2,
  Lock,
  RefreshCw
} from 'lucide-react';
import { ClipBDRepository } from '../../../lib/db/repository';
import { mockStore } from '../../../lib/db/mock-store';
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

  // Security & Data Clean Slate
  const [currentMasterKey, setCurrentMasterKey] = useState('ClipCart@Admin2026!');
  const [newMasterKey, setNewMasterKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [wipeConfirm, setWipeConfirm] = useState(false);
  const [wipeFeedback, setWipeFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('clipcart_master_passcode');
      if (storedKey) setCurrentMasterKey(storedKey);
    }
  }, []);

  const handleUpdateMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterKey.trim() || newMasterKey.trim().length < 6) {
      alert('Master Security Key must be at least 6 characters long.');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('clipcart_master_passcode', newMasterKey.trim());
      setCurrentMasterKey(newMasterKey.trim());
      setNewMasterKey('');
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
    }
  };

  const handleClearDemoData = () => {
    mockStore.clearDemoData();
    setWipeConfirm(false);
    setWipeFeedback('All demo/test records have been wiped. Platform is running in 100% clean production mode!');
    setTimeout(() => setWipeFeedback(null), 5000);
  };

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

      {/* Master Security Key Management */}
      <div className="neo-box p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white uppercase">
              Admin Master Security Passcode
            </h2>
          </div>
          <span className="neo-sticker bg-zinc-950 text-white dark:bg-rose-600 text-[10px]">
            Owner Only
          </span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
          This Master Passcode locks the <code>/admin</code> operations desk. Anyone attempting to visit this panel without this key will be blocked by the security gate.
        </p>

        {keySaved && (
          <div className="neo-box p-3 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Master Security Passcode successfully updated! Save this key in a secure place.</span>
          </div>
        )}

        <form onSubmit={handleUpdateMasterKey} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Current Active Key</label>
              <div className="px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 font-mono text-xs font-bold text-zinc-900 dark:text-white select-all">
                {currentMasterKey}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-700 dark:text-zinc-300 font-bold block text-xs">Set New Master Passcode</label>
              <input
                type="text"
                placeholder="Enter new master key (min 6 chars)..."
                value={newMasterKey}
                onChange={(e) => setNewMasterKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:shadow-[2px_2px_0px_#e11d48]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!newMasterKey.trim()}
              className="neo-btn neo-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Update Master Passcode</span>
            </button>
          </div>
        </form>
      </div>

      {/* Production Database Clean Slate Card */}
      <div className="neo-box p-6 sm:p-8 space-y-4 border-rose-600">
        <div className="flex items-center justify-between border-b-2 border-zinc-950 dark:border-zinc-700 pb-3">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-['Unbounded'] font-bold text-zinc-950 dark:text-white uppercase">
              Production Database & Clean Slate
            </h2>
          </div>
          <span className="neo-sticker bg-amber-100 text-amber-950 border-amber-950 text-[10px]">
            Commercial Ops
          </span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
          Ensure your platform runs with zero mock hackathon records. Real campaigns you create and real clippers who register will be stored cleanly in production storage.
        </p>

        {wipeFeedback && (
          <div className="neo-box p-3 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold font-mono">
            {wipeFeedback}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-center font-mono">
          <div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold block uppercase">Live Campaigns</span>
            <span className="font-black text-zinc-950 dark:text-white text-base">{mockStore.campaigns.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold block uppercase">Real Clippers</span>
            <span className="font-black text-zinc-950 dark:text-white text-base">{mockStore.profiles.filter(p => p.role === 'CLIPPER').length}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold block uppercase">Clip Proofs</span>
            <span className="font-black text-zinc-950 dark:text-white text-base">{mockStore.submissions.length}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Wipes any remaining demo campaigns, fake clippers, or test submissions.
          </span>

          {!wipeConfirm ? (
            <button
              type="button"
              onClick={() => setWipeConfirm(true)}
              className="neo-btn bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-100 text-zinc-900 dark:text-white px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset to Clean Production</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearDemoData}
                className="neo-btn bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Wipe All Demo Data</span>
              </button>
              <button
                type="button"
                onClick={() => setWipeConfirm(false)}
                className="neo-btn bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white px-3 py-2 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
