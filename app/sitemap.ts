import type { MetadataRoute } from 'next';
import { ClipBDRepository } from '../lib/db/repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clipcart.bd';
  const now = new Date();

  // Core public marketing pages
  const routes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/campaigns', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/for-clippers', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/for-clients', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/how-it-works', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/faq', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const r of routes) {
    const bnUrl = `${baseUrl}${r.path}`;
    const enUrl = `${baseUrl}/en${r.path}`;

    // Default Bangla entry
    entries.push({
      url: bnUrl,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: {
        languages: {
          'bn-BD': bnUrl,
          'en-BD': enUrl,
          'x-default': bnUrl,
        },
      },
    });

    // English localized entry
    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: Math.max(0.1, r.priority - 0.05),
      alternates: {
        languages: {
          'bn-BD': bnUrl,
          'en-BD': enUrl,
          'x-default': bnUrl,
        },
      },
    });
  }

  // Active public campaigns dynamically fetched from database
  try {
    const campaigns = await ClipBDRepository.getActiveCampaigns();
    for (const c of campaigns) {
      const slugOrId = c.slug || c.id;
      const bnCampaignUrl = `${baseUrl}/campaigns/${slugOrId}`;
      const enCampaignUrl = `${baseUrl}/en/campaigns/${slugOrId}`;
      const lastMod = c.updatedAt ? new Date(c.updatedAt) : now;

      entries.push({
        url: bnCampaignUrl,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            'bn-BD': bnCampaignUrl,
            'en-BD': enCampaignUrl,
            'x-default': bnCampaignUrl,
          },
        },
      });

      entries.push({
        url: enCampaignUrl,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.75,
        alternates: {
          languages: {
            'bn-BD': bnCampaignUrl,
            'en-BD': enCampaignUrl,
            'x-default': bnCampaignUrl,
          },
        },
      });
    }
  } catch (err) {
    console.error('Failed to fetch active campaigns for sitemap:', err);
  }

  return entries;
}
