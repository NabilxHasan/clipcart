# Phase 6: SEO Measurement, Analytics & Conversion Tracking
## ClipCart Bangladesh (`https://clipcart.bd`)

---

## 1. Measurement Architecture Overview

Technical SEO and content strategy cannot be managed without precision tracking. For a two-sided marketplace like ClipCart, search engine optimization is evaluated on two distinct axes:
1. **Visibility & Crawl Health:** Indexation velocity, Core Web Vitals, organic impressions, and ranking positions across target keyword clusters.
2. **Commercial Conversion Velocity:** Conversion rate from organic search visitors to:
   - **Supply Side:** Clipper signups (`/register`, ৳50 commitment fee activation).
   - **Demand Side:** Brand campaign consultation starts (WhatsApp desk clicks, `/client-request` submissions).

---

## 2. Google Search Console (GSC) Setup & Protocol

### DNS Domain Property Verification
- **Property Type:** Domain Property (`clipcart.bd`) to aggregate all protocols (`https://`, `http://`), subdomains, and subpaths.
- **Verification Method:** DNS TXT Record via domain registrar (BTCL or authorized `.bd` DNS registrar).
  ```text
  Host: @ or clipcart.bd
  Type: TXT
  Value: google-site-verification=...
  ```

### Sitemap & Indexation Submission
1. Submit primary XML sitemap index: `https://clipcart.bd/sitemap.xml`.
2. Inspect and verify:
   - Root Bangla homepage: `https://clipcart.bd/`
   - English localized homepage: `https://clipcart.bd/en`
   - Supply hub: `https://clipcart.bd/for-clippers` & `https://clipcart.bd/en/for-clippers`
   - Demand hub: `https://clipcart.bd/for-clients` & `https://clipcart.bd/en/for-clients`
   - Active campaigns hub: `https://clipcart.bd/campaigns` & `https://clipcart.bd/en/campaigns`
   - Trust pages: `/about`, `/privacy`, `/terms`, `/contact`
3. Verify that `app/robots.ts` correctly blocks crawl budget waste on `/admin/*` and `/dashboard/*`.

---

## 3. Google Analytics 4 (GA4) Event Taxonomy

The codebase includes a lightweight tracking dispatch utility located at `lib/seo/analytics.ts`. When a GA4 Measurement ID (`G-XXXXXXXXXX`) or Google Tag Manager container is deployed, the following custom events are dispatched automatically:

| Event Name | Category | Trigger Condition | Conversion Value |
| :--- | :--- | :--- | :--- |
| `register_click` | Supply Conversion | User clicks "Join as a Clipper", "Register", or any CTA leading to `/register` | Primary Micro-Conversion |
| `whatsapp_click` | Demand / Community | User clicks Brand WhatsApp Desk or Clipper Community links | High-Intent Lead |
| `client_request_start` | Demand Conversion | User enters the `/client-request` campaign intake flow | Qualified Brand Intent |
| `client_request_submit`| Demand Conversion | Client successfully submits campaign details and footage link | Macro Conversion (৳১,০০০+ deal) |
| `campaign_brief_view` | Engagement | Clipper opens an active campaign detail view (`/campaigns/[id]`) | Intent to Clip |
| `language_switch` | UX / Localization | User toggles language between Bangla and English | Audience Segmentation |

### Sample GA4 Event Payload
```json
{
  "event": "whatsapp_click",
  "event_category": "SEO_Conversion",
  "channel": "brand_hotline",
  "landing_page": "/for-clients",
  "language": "bn-BD",
  "timestamp": "2026-10-03T05:28:09.000Z"
}
```

---

## 4. Primary & Secondary SEO KPIs (Key Performance Indicators)

### Core Crawl & Technical Health Metrics
- **Prerendered HTML Status:** 100% of public marketing routes return HTTP 200 with complete `<title>`, `<meta description>`, `<link rel="canonical">`, and `<link rel="alternate" hreflang="...">` tags.
- **Lighthouse Performance Score:** $\ge 90$ on Mobile and Desktop (achieved by migrating to self-hosted fonts in `next/font/google`).
- **Core Web Vitals Thresholds:**
  - Largest Contentful Paint (LCP): $< 1.8\text{ seconds}$
  - Interaction to Next Paint (INP): $< 150\text{ ms}$
  - Cumulative Layout Shift (CLS): $< 0.05$

### Organic Search Growth Targets (90-Day Horizon)
| KPI | Baseline (Day 0) | Month 1 Goal | Month 2 Goal | Month 3 Goal |
| :--- | :--- | :--- | :--- | :--- |
| **Indexed Pages (GSC)** | 1 (Homepage) | 25+ pages | 45+ pages | 60+ pages |
| **Total Organic Impressions / Mo** | $< 500$ | $5,000$ | $25,000$ | $100,000+$ |
| **Total Organic Clicks / Mo** | $< 50$ | $300$ | $1,500$ | $5,000+$ |
| **Target Top 3 Keyword Rankings** | 0 | 2 keywords | 6 keywords | 15+ keywords |
| **Monthly Clipper Signups via Organic** | 0 | $35$ | $120$ | $350+$ |
| **Monthly Brand Leads via Organic** | 0 | $5$ | $18$ | $45+$ |

---

## 5. Keyword Rank Tracking Setup

To monitor rank movements across Dhaka and Bangladesh nationwide, configure a rank tracker (e.g. Ahrefs, Semrush, or GSC Performance API) with the following target search queries:

### High-Priority Tracker Queries (Weekly Monitoring)
1. `ভিডিও এডিটিং করে আয়` (Target URL: `/for-clippers`)
2. `video editing income in bangladesh` (Target URL: `/en/for-clippers`)
3. `tiktok marketing agency dhaka` (Target URL: `/for-clients`)
4. `কন্টেন্ট ক্লিপিং` (Target URL: `/`)
5. `short form video marketing bangladesh` (Target URL: `/en/for-clients`)
6. `tiktok cpm bangladesh` (Target URL: `/blog/cpm-rates-bangladesh-tiktok-reels-shorts`)
7. `reels view payment bangladesh` (Target URL: `/blog/cpm-rates-bangladesh-tiktok-reels-shorts`)
8. `ক্লিপকার্ট` (Target URL: `/`)
9. `ClipCart BD` (Target URL: `/`)
10. `bkash cashout clipcart` (Target URL: `/faq`)

---

## 6. Monthly Reporting Template & Governance

On the 1st of every calendar month, the SEO engineering and growth team reviews:
1. **Google Search Console Insights:** Top winning queries, rising impressions, CTR anomalies, and any crawl errors or soft 404s.
2. **Top Performing Content:** Organic traffic to `/blog/*` articles and resulting assisted conversions to `/register` and `/client-request`.
3. **Crawl Health:** Ensure new campaigns published in the database are instantly surfaced in `app/sitemap.ts` without cache stagnation.
4. **Action Items:** Review the next month's publishing queue from `docs/seo/content-plan.md`.
