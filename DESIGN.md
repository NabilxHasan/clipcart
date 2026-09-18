# CLIPCART — Design System Specification

## 1. Aesthetic Philosophy: The Editorial Media House
ClipCart is a high-trust agency and performance marketplace, not a tech toy. The interface draws inspiration from modern editorial publications (The Verge, Bloomberg Media, Monocle) and precision transactional tools (Linear, Stripe Dashboard). 

### Strict Anti-Slop Directives
1. **Zero Purple/Violet Gradients**: The primary brand accent is an authoritative Signal Crimson (`#E11D48`) and Deep Slate (`#0F172A`), balanced with Financial Emerald (`#059669`) for positive ledger operations.
2. **No Giant Bubble Containers**: Border radius is strictly capped at `rounded-md` (6px) or `rounded-lg` (8px). No pill-shaped inputs or floating blobs.
3. **No Decorative Filler**: No generic SaaS 3D illustrations, floating particles, or glassmorphism blur traps. Every pixel renders data, workflow, or instructional copy.
4. **Honest Data States**: Zero fake metric counters ("10M views generated"). If a campaign has 0 submissions, the system plainly displays: *"No submissions yet. Be the first to claim this budget."*

---

## 2. Color Palette & Semantics

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `canvas-light` | `#F8FAFC` | Light-mode base background |
| `canvas-dark` | `#0A0C10` | Dark-mode base background & admin contrast canvas |
| `surface-light` | `#FFFFFF` | Card & modal background (light) |
| `surface-dark` | `#11141A` | Card & modal background (dark) |
| `border-subtle` | `#E2E8F0` / `#1E232D` | Hairline 1px borders |
| `text-primary` | `#0F172A` / `#F8FAFC` | High-contrast body & headlines |
| `text-muted` | `#64748B` / `#94A3B8` | Metadata, timestamps, helper copy |
| `brand-primary`| `#E11D48` | Primary CTA, action buttons, active indicators |
| `brand-hover`  | `#BE123C` | Hover state for primary actions |
| `status-green` | `#059669` | Approved submissions, paid withdrawals, active budgets |
| `status-amber` | `#D97706` | Pending review, pending payment, scheduled |
| `status-red`   | `#DC2626` | Rejected clips, suspended accounts, expired runs |
| `status-neutral`| `#475569` | Drafts, withdrawn, disabled integrations |

---

## 3. Typography & Numerics

- **Headlines & Interface**: High-legibility modern sans-serif (`Inter`, `system-ui`, `-apple-system`, `sans-serif`). Clean tracking: `-0.02em` for headlines.
- **Financial & Metrics**: Fixed-width tabular numbers (`font-mono`, `tabular-nums`) for currency (`৳ BDT`), CPM rates, view counts, and timestamps. Ensures numbers align perfectly in tables and moderation desks.
- **Scale**:
  - Display: `text-3xl` to `text-4xl` (font-extrabold, tight leading)
  - Page Title: `text-2xl` (font-bold)
  - Section Header: `text-lg` to `text-xl` (font-semibold)
  - Body: `text-sm` to `text-base` (font-normal, leading-relaxed)
  - Micro / Meta: `text-xs` (font-medium, uppercase tracking-wider for badges)

---

## 4. Layout & Spacing Rhythm

- **Max Container Width**: `max-w-6xl` for marketing and public campaigns; `max-w-7xl` or full-width fluid for admin queues and moderation consoles.
- **Density**: Moderate-to-high. Moderators must review 50+ submissions without scrolling excessively. Compact tables, split-pane drawers, and quick-action toolbars.
- **Mobile Ergonomics (360px – 430px)**:
  - Sticky bottom action bar for primary mobile actions ("Submit Clip", "Request Payout").
  - Minimum touch target: 44px height for all buttons and select targets.
  - High-contrast text legible in outdoor Bangladeshi sunlight conditions.

---

## 5. Component Inventory

1. **Status Chips & Badges**:
   - `Pending Review`: Amber dot + border-amber-200 text-amber-800 bg-amber-50
   - `Approved`: Emerald dot + border-emerald-200 text-emerald-800 bg-emerald-50
   - `Rejected`: Red dot + border-red-200 text-red-800 bg-red-50
   - `WhatsApp Pending`: Slate dot + border-slate-200 text-slate-700 bg-slate-50
2. **Campaign Brief Card**:
   - Clean card, hairline border, budget progress bar, CPM badge, platform tags (TikTok / IG / YouTube), external source drive link with external icon.
3. **Moderation Desk**:
   - Split pane or structured row: Clip URL embed preview, AI suspicion score bar (0-100), violation tags, quick keyboard triggers, reason drawer.
4. **Ledger History Table**:
   - Date, Transaction ID, Type (Credit / Debit), Amount (`+৳` / `-৳`), Balance After, Status, Reference.
