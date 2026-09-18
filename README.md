# CLIPCART — Production MVP Master Documentation

> **Bangladesh-First Content Clipping Agency & Performance Marketplace**  
> Connecting Brands, Podcasts, and Creators with skilled short-form video clippers across TikTok, Instagram Reels, and YouTube Shorts.

---

## 1. Product Philosophy & Operating Model

ClipCart operates on a hybrid, high-trust marketplace model designed specifically for Bangladesh's creator ecosystem:

- **Web Platform (Source of Truth)**: Brief authoring, campaign discovery, post submissions, automated AI pre-filtering, human view audits, auditable ledger balances, and manual withdrawal requests.
- **Manual Financial Operations**: **Zero automated payment gateways** (no SSLCommerz/Stripe). Brand deposits are verified via bank wire/cheque and recorded with reference numbers. Clipper withdrawals to bKash, Nagad, or Bank are manually disbursed with mandatory transaction references (TrxID).
- **Decoupled WhatsApp Integration**: Zero fabricated credentials or artificial group IDs. Built with a first-class `WhatsApp Integration — Pending Setup` state until the owner manually creates and inputs community links.
- **AI Moderation Assistant**: AI acts strictly as an advisory pre-filter (URL format validation, duplicate submission probability, spam rate heuristic). **AI never automatically executes payouts or bans accounts.** Human moderators hold final decision authority.

---

## 2. System Architecture

```
builds/clipbd/
├── app/
│   ├── (auth)/
│   │   ├── login/               # Interactive role switcher (Clipper / Admin / Moderator)
│   │   ├── register/            # Clipper onboarding with private payment destination
│   │   └── join/                # Shortcut to registration
│   ├── (public)/
│   │   ├── page.tsx             # Editorial homepage & active campaign showcase
│   │   ├── campaigns/           # Filterable campaign discovery & search
│   │   ├── campaigns/[id]/      # Brief, rules, external Drive source, clip submission
│   │   ├── client-request/      # Brand intake pipeline with WhatsApp deep-link
│   │   ├── for-clients/         # Distribution economics & brand safety guide
│   │   ├── for-clippers/        # Payout tiers, CPM rules, and bKash guidelines
│   │   ├── how-it-works/        # 4-step distribution loop breakdown
│   │   ├── faq/                 # Rules, view verification, and payout timelines
│   │   └── contact/             # Dhaka operations desk & WhatsApp status
│   ├── dashboard/               # Clipper Portal
│   │   ├── page.tsx             # Live ledger KPI cards & recent submissions feed
│   │   ├── campaigns/           # Active brief browser with quick submission
│   │   ├── submissions/         # Submission status, AI diagnostic report, review notes
│   │   ├── earnings/            # Granular double-entry transaction ledger
│   │   ├── withdrawals/         # Ledger balance check & manual payout request modal
│   │   ├── leaderboard/         # Privacy-protected rankings by verified views & clips
│   │   ├── profile/             # Social handles & masked payment destination
│   │   └── notifications/       # In-app event alerts
│   ├── admin/                   # Operations Command Center
│   │   ├── page.tsx             # Queue counters, budget pool totals, real-time audit feed
│   │   ├── campaigns/           # Campaign authoring & client payment verification desk
│   │   ├── submissions/         # Split-pane moderation desk with AI risk scoring
│   │   ├── withdrawals/         # Manual bKash/Nagad disbursal queue with TrxID notes
│   │   ├── client-requests/     # CRM pipeline (NEW -> CONTACTED -> ACTIVE)
│   │   ├── payments/            # Verified client deposit records
│   │   ├── users/               # Staff & clipper directory with server-side RBAC
│   │   ├── settings/            # WhatsApp Community & template settings
│   │   └── audit-log/           # Immutable compliance trail of all operations
│   ├── globals.css              # Editorial typography & strict anti-slop tokens
│   └── layout.tsx               # SEO metadata, Open Graph, and mobile viewport setup
├── components/
│   ├── layout/                  # Navbar, Footer, Dashboard and Admin Layouts
│   └── shared/                  # WhatsAppPendingBadge, StatusBadge
├── lib/
│   ├── db/                      # Repository layer and local development mock store
│   ├── ledger/                  # LedgerEngine: double-entry audit & balance calculation
│   ├── moderation/              # AiModeratorService: regex, duplicate detection, risk score
│   ├── whatsapp/                # ManualWhatsAppProvider abstraction & deep-links
│   └── types/                   # Complete TypeScript domain interfaces
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql # 16 relational tables with foreign keys and indexes
│       └── 002_rls_policies.sql   # Server-side Row Level Security policies
├── DESIGN.md                    # Editorial media design system & anti-slop rules
├── package.json
└── .env.example
```

---

## 3. Local Development Setup

### Prerequisites
- Node.js `>= 20.17.0` (Node 24 recommended)
- `npm.cmd` on Windows

### Steps
1. Navigate to the build directory:
   ```bash
   cd builds/clipbd
   ```
2. Install dependencies:
   ```bash
   npm.cmd install
   ```
3. Start the Next.js development server:
   ```bash
   npm.cmd run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> The application includes an in-memory repository layer (`lib/db/mock-store.ts`) that mirrors the PostgreSQL schema. You can run, test, and moderate campaigns, submissions, and withdrawals locally immediately without needing to configure remote Supabase keys upfront.

---

## 4. Production Database & Supabase Setup

When connecting to production Supabase:

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Navigate to the SQL Editor in your Supabase project dashboard.
3. Run the migrations in order:
   - Copy and execute `supabase/migrations/001_initial_schema.sql` (Creates enums, tables, foreign keys, and indexes).
   - Copy and execute `supabase/migrations/002_rls_policies.sql` (Enforces Row Level Security for clippers, clients, and staff).
4. Copy your project URL and keys to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in:
   - `DATABASE_URL`: Direct PostgreSQL connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role secret (used only in server actions)

---

## 5. WhatsApp Integration Workflow (Sections 2, 21, 40)

To maintain absolute security and prevent hallucinated credentials, WhatsApp integration is completely decoupled:

1. By default, the application runs in `"WhatsApp Integration — Pending Setup"` mode.
2. The owner manually creates:
   - A WhatsApp Community for ClipBD creators
   - A dedicated Announcement group within that Community
   - A WhatsApp Business number for brand client inquiries
3. Once created, the owner navigates to:
   ```
   /admin/settings
   ```
4. Enters the real Community invite URL, Announcement URL, and WhatsApp Business phone number.
5. Clicks **Save Settings**. The platform automatically switches badges to active links without requiring a code rebuild.

---

## 6. Financial Ledger & Safety Controls (Sections 16, 17, 18)

- **Immutable Double-Entry Ledger**: Balances are calculated dynamically (`SUM(credits) - SUM(debits)`) from `wallet_transactions`. No mutable single balance cell.
- **Locking on Withdrawal**: When a clipper requests a withdrawal, funds are immediately locked (`DEBIT_WITHDRAWAL_LOCK`). Available balance drops immediately to prevent double-spending.
- **Compensating Entries on Rejection**: If an admin rejects a withdrawal, a compensating `ADJUSTMENT_CREDIT` is posted, releasing the funds back to the clipper.
- **Mandatory TrxID**: Admin cannot mark a withdrawal as `PAID` without entering a valid transaction reference (e.g. bKash TrxID `BK928410291`).
- **Cap Enforcement**: Payout calculations strictly respect `min_views`, `max_payout_per_clip`, and ensure `remaining_budget >= 0`.

---

## 7. Role-Based Access Control (RBAC)

Enforced server-side across all operations:

| Role | Permissions |
| :--- | :--- |
| `SUPER_ADMIN` | Full access, settings mutation, user role elevation, ledger adjustments. |
| `ADMIN` | Campaign authoring, deposit verification, withdrawal execution, client CRM. |
| `MODERATOR` | Submission queue, AI flag inspection, view audits, approve/reject clips. |
| `SUPPORT` | User directory, ticket triage, client request inspection. |
| `CLIENT` | View own campaign briefs and submitted client requests. |
| `CLIPPER` | View active briefs, submit clips, track earnings, request bKash/Nagad payouts. |

---

## 8. Verification & QA

- `npm.cmd run lint` — ESLint verification
- `npm.cmd run build` — Production build check (`next build`)
- Tested responsive viewports: `360px` (Mobile Android), `390px` (iPhone), `430px` (Max), `1280px+` (Desktop Admin Desk).
