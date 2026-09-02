# FAINEANT — Requirements (current)

> **Canonical product/technical requirements.** Derived from the stakeholder
> audit notes in [`docs/stakeholder/2026-09-01-david-notes.md`](stakeholder/2026-09-01-david-notes.md)
> (plan WS-A) and the architect code audit of Sep 1–2, 2026 (Concord
> `TASK-ARCH-REQ-0901`). Phases, workstreams, and owners live in
> [`docs/PLAN.md`](PLAN.md); this file says *what must be true* and *what is true
> now*. Decisions referenced as **D#** are listed in `docs/PLAN.md` §10.
>
> **Status vocabulary:** proposed → accepted (roadmap approved) → in-progress →
> delivered (PR) → verified (David sign-off on staging/preview) → live.
> Every requirement here is **proposed** until the roadmap PR is approved.
>
> **ID scheme:** BUG (defects found by audit) · PRC (practitioner dashboard) ·
> CLI (client dashboard) · MSG (messaging) · LND (landing/public) · PRI (pricing
> & policy) · TRU (trust & safety) · PLT (platform, geo, infra).
> Paths are relative to `apps/web/src` unless prefixed; line numbers are from
> `main` @ 466d68a.

---

## 0. Learnings (what the audit changed in our understanding)

| # | Learning | Consequence |
|---|----------|-------------|
| L1 | **Readability is the #1 cross-surface complaint** (dark-on-dark, tiny nav, faint empty states) on all three surfaces. | Contrast/typography fixes are *accessibility defects*, not "design rehaul"; they go in P0 inside the current palette. The lighter palette itself is a separate decision (D9). |
| L2 | **David tests the product as an on-demand service** (map on login, pending cards, accept → ETA, "ready to travel" toggle, 15-minute no-show clock). The codebase models scheduled windows. | Biggest architecture decision of the quarter (D6). Several of his own asks still presuppose scheduled times (3-hour cancellation window, premium *hour* bands, "Pick a window" section kept). Recommendation: additive, not a replacement. |
| L3 | **Pricing becomes multi-component** (base + per-mile travel + premium hours + platform fee + tips + no-show/late-cancel fees). Today a booking stores one integer. | A server-side pricing engine with a stored breakdown must land *before* checkout (WS-D grows; PRI-1). |
| L4 | **A trust layer is being asked for**: two-way reviews hidden from clients, mandatory intro video, no-show evidence. | New subsystem (TRU-*) with schema, RLS, storage, and a policy/legal decision (D8, D12). |
| L5 | **"Practitioner" is the word.** David never says "provider"; the UI prose already agrees, only routes/identifiers say `providers`. | Resolves WS-J.2. Rename the public route with a redirect (BUG-1). |
| L6 | **The audit found broken basics, not just taste**: 10 dead links on the live landing page, the practitioner "Overview" opens the client dashboard, decline reasons are discarded, "Book again" is `#`. | These are P0 and cheap. They also explain why David's notes are thin on booking/payment flows: he could not get far. |
| L7 | **Keep-them-in-app is a stated goal** (message toasts anywhere, online dot, quotes, concierge tone). | Small cross-cutting primitives: presence heartbeat, unread poll in the dashboard layout, a shared quote component. Polling only (CLAUDE.md). |
| L8 | **Several asks need infrastructure that does not exist**: no scheduler (reminders), no geo index/map provider, no video storage, no presence, no policy/fee columns. | P1 "foundation" phase carries these so P2–P5 can be UI-heavy. Staging (D2) is a prerequisite for David to verify any of it without writing to production. |

## 1. Product-model requirements (decide before building P2+)

| ID | Requirement | Current state | Decision |
|----|-------------|---------------|----------|
| PM-1 | Practitioners signal **"Ready to travel" (available now)** with one toggle; no fixed hours required. Advance booking by time window remains possible for clients. | No availability toggle column; weekly grid UI exists (`app/dashboard/provider/schedule/page.tsx:146-197`) but `create_booking` never reads `availability` (`supabase/migrations/20260601162957_rpc_booking.sql:26-43`) — only the overlap constraint is enforced. | **D6** — recommended: additive on-demand mode; grid UI hidden, tables retained (rollback-only). |
| PM-2 | Booking lifecycle shown to practitioners is **Pending → Confirmed → Completed**; the active-service period shows nothing. | Enum has `IN_PROGRESS`; RPC only allows `CONFIRMED→IN_PROGRESS→COMPLETED` (`…20260601163632_fix_update_booking_status_auth.sql:30-35`). | UI hides In-Progress in P0; P1 migration allows `CONFIRMED→COMPLETED` directly. Enum value retained (forward-only). |
| PM-3 | **All prices visible, no hidden info** (landing principle) — base, travel, premium, total shown to both parties before confirmation. | Single `total_price_in_cents` on bookings; client cannot see fee composition. | Drives PRI-1. Conflicts with "may omit price in past visits" → **D10**. |

## 2. Defects found by the audit (fix first — P0 unless noted)

| ID | Defect | Evidence | Phase |
|----|--------|----------|-------|
| BUG-1 | `/practitioners` is linked from 5 places but the route is `/providers` → hard 404 in production (this is David's "Find a practitioner" 404). | `app/dashboard/client/bookings/page.tsx:190`, `app/_components/hero-section.tsx:31`, `components/layout/site-header.tsx:8`, `components/layout/site-footer.tsx:10`, `components/app-sidebar.tsx:63`; live: `curl -I https://faineantapp.com/practitioners` → 404. | P0 — rename route dir to `practitioners`, 301 `/providers/:path*` → `/practitioners/:path*` (D15). |
| BUG-2 | Nine more dead footer/nav links on the live landing page: `/manifesto`, `/press`, `/journal`, `/house-accounts`, `/gift`, `/for-practitioners`, `/contact`, `/cancellation`, `/apply`. | `components/layout/site-footer.tsx`; live curl 404s (Sep 1). | P0 — create `/manifesto` (LND-6), redirect `/for-practitioners` + `/apply` → practitioner registration, remove the rest until pages exist. |
| BUG-3 | Practitioner nav "Overview" routes to the **client** dashboard; there is no practitioner landing page. | `components/app-sidebar.tsx:50` → `app/dashboard/page.tsx:52` (`listClientBookings`, "Browse the salon"). | P0 — PRC-1. |
| BUG-4 | Decline reason textarea is collected and discarded. | `app/dashboard/provider/bookings/page.tsx:181` vs `:597-604`. | P0 UI (send it in the cancellation message/notes) → P1 stores `cancel_reason` (PRI-6). |
| BUG-5 | Client "Book again" is `href="#"` on every past visit. | `app/dashboard/client/bookings/page.tsx:288-293`. | P0 — link to the service page. |
| BUG-6 | `text-oxblood-400` is used but the palette defines only `oxblood-500`. | `app/dashboard/page.tsx:112`; `packages/shared/src/theme/palette.ts`. | P0. |
| BUG-7 | Sidebar item labelled "Calendar" routes to `/settings` with a plug icon; `/integrations` is a redirect shim. | `components/app-sidebar.tsx:49-59`. | P0 — label "Calendar sync", one route. |
| BUG-8 | Schedule copy says "Default to closed." while defaults open Mon–Sat 09:00–18:00. | `app/dashboard/provider/schedule/page.tsx:116` vs `:26`. | P0 copy (page hidden in P2 anyway). |
| BUG-9 | Mono font drift: layout loads JetBrains Mono, tokens and Tailwind fallback say Geist Mono. | `app/layout.tsx:12-39`, `packages/shared/src/theme/type.ts:5`. | P0 — pick one. |
| BUG-10 | A **"Test ritual"** service is publicly listed on the production landing page and at `/services/test-ritual-848cda5d`. | live HTML (Sep 1). Data, not code: an approved practitioner owns a test service. | P0 — owner deactivates it in the hosted DB (admin). Not a lane action. |
| BUG-11 | Clients cannot read their own refund rows (RLS grants provider/admin only). | `supabase/migrations/20260601145959_rls_commerce.sql:27-36`. | P3 (with WS-D). |
| BUG-12 | `listClientBookings` loads up to 1,000 practitioners via `search_providers` on every load to resolve names. | `lib/data-client.ts:274`. | P1 (perf; select the name via join/RPC). |
| BUG-13 | `service_radius` has no unit of record: DB default 25, Zod says miles, `search_providers` filters in km. | `…20260601043434_identity.sql:29`, `packages/shared/src/schemas/profile.schema.ts:16`, `…20260601164651_rpc_discovery.sql:33`. | P1 — standardise on **miles** (per-mile pricing depends on it). |
| BUG-14 | Upload docs/schema drift: `STORAGE.md` says 5 MB (migration: 8 MB); `uploadFinalizeSchema` expects a `users/` prefix nothing produces. | `supabase/STORAGE.md:3`, `packages/shared/src/schemas/upload.schema.ts:60`. | P1 (with PRC-9). |
| BUG-15 | Stripe Connect / payments / refunds / webhook and Google Calendar connect/sync fail in production: hosted secrets `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` are absent. | Sep 1 architect audit (`supabase secrets list`). | D1/D2 — configure on staging first. |
| BUG-16 | Availability is decorative: bookings outside working hours or on blocked days succeed. | `…20260601162957_rpc_booking.sql:26-43`. | Folded into D6/PM-1 (P2). |

## 3. Practitioner dashboard (PRC)

| ID | Requirement | Current state | Gap | Phase | Depends / decision |
|----|-------------|---------------|-----|-------|--------------------|
| PRC-1 | A practitioner **Overview** page: pending request cards, today's confirmed visits, net earnings snapshot, "Ready to travel" state. Map of nearby demand comes later (PLT-2). | No page (BUG-3). | missing | P0 (cards, today, earnings) · P5 (map) | — |
| PRC-2 | Pending cards show client name, **address**, requested service, client **photo**; client reviews/tags once TRU-1 exists. | Card renders name/service/price/email; `location` and `avatarUrl` fetched but unrendered (`provider/bookings/page.tsx:351-386`, dialog `:456`). | missing | P0 (address, photo) · P4 (client reviews) | TRU-1 |
| PRC-3 | **Accept / Decline**; on accept an ETA message is sent to the client automatically ("on my way, ~N min"). v1: practitioner picks an ETA band; live GPS ETA later. | Confirm/Decline exist via `update_booking_status`; no ETA concept anywhere. | missing | P2 (manual ETA via `send_message`) · P5 (live) | MSG-1, PLT-3 |
| PRC-4 | Status flow **Pending → Confirmed → Completed**; no In-Progress tab; during service the card is absent. | Tabs Pending/Confirmed/In progress/Completed/All (`provider/bookings/page.tsx:63-69`); RPC forbids `CONFIRMED→COMPLETED`. | design | P0 UI · P1 migration | PM-2 |
| PRC-5 | Filters: **Pending / Confirmed / Completed** only. Completed rows show date, time, and **net earnings**. | "All" and "In progress" present; price shown is gross. | design | P0 (filters) · P3 (net per booking) | PRI-4 |
| PRC-6 | **"Ready to travel" toggle** replaces the weekly grid: `available_now` + auto-expiry; discovery ranks available practitioners first; instant requests possible while on. Grid hidden, data retained. | Grid page + `replace_my_availability`; no toggle column; no scheduler for expiry. | missing | P2 | D6, PLT-4 |
| PRC-7 | **Services, Portfolio, Profile merged** into one section (tabs), one nav entry. | Three routes + separate nav items (`app-sidebar.tsx:49-59`). | design | P2 | — |
| PRC-8 | Service setup: pick a **trade** (barber, nail tech, stylist… + free-text "add your own"), then a **services catalog** with custom price per item. | Category `<select>` over 13 enum values; free-form name/price/duration (`provider/services/page.tsx:121-212`); no trade concept. | missing | P2 | migration: `trade` on provider_profiles (enum + custom text), service catalog table |
| PRC-9 | Portfolio: **photo and video** uploads; optional Instagram link (secondary). | Images only, 8 MB, three layers block video (bucket MIME, `upload.schema.ts:11-21`, `portfolio_items.image_url`). No Instagram field. | missing | P2 | D12 (storage limits/cost) |
| PRC-10 | Profile shows name, bio, rating, reviews, **service radius (miles)**; **mandatory intro video** (name, trade, years, short Q&A) gates publication. | Profile form has practice name, bio, address, radius only (`provider/profile/page.tsx:98-166`); no rating/reviews/video. | missing | P2 (fields) · P4 (video gate) | D12, BUG-13, TRU-2 |
| PRC-11 | **Earnings** shows net take-home only ("$92 total to date"), states tips are 100% theirs, fees only in a small secondary area, inspirational quote, no "Ledger" label, distinct motivating styling. | "Total, to date" is net of platform fee but **not** Stripe fees (`payments.provider_payout_in_cents` = total − 5%); "Ledger" heading `provider/earnings/page.tsx:116`; header copy names fees prominently `:66`; no tips, no quotes. | copy/design + data | P0 (labels, quote, fee copy demoted) · P3 (true net incl. Stripe fee, tips) | PRI-4, PRI-5 |
| PRC-12 | Copy uses **"practitioner"** everywhere, including URLs. | Prose already does; routes say `/providers` (151 identifier hits vs 55 prose). | copy | P0 | D15 |

## 4. Client dashboard (CLI)

| ID | Requirement | Current state | Gap | Phase | Depends / decision |
|----|-------------|---------------|-----|-------|--------------------|
| CLI-1 | Body text, empty states ("Your calendar is quiet"), arrival note, and labels meet **WCAG AA contrast (≥4.5:1)** on the current background; faint taupe text is not used for information. | `body` = smoke-900 `#0e0d0c`; empty state `app/dashboard/page.tsx:107` uses low-contrast tokens; `<html>` hard-coded `dark` (`app/layout.tsx:55`). | design (a11y) | P0 | D13 |
| CLI-2 | Welcome greeting ("Welcome, Quinn") in a **cursive/script** face for a luxurious feel. | No cursive family configured (`tailwind.config.ts:78-83`). | missing | P0 | — |
| CLI-3 | Overview **past visits**: status (completed / no-show; never "in progress"), date + day + time, service, practitioner name; price display per D10. | Past visits show date, service, duration + raw status, practitioner, **price** (`app/dashboard/page.tsx:189-206`). | copy/design | P0 | D10 |
| CLI-4 | Bookings feel like a **concierge**: empty state "Nothing on today's calendar. How can we help you?" with nearby practitioners / services / promotions inline. | "Nothing on the calendar. The week is yours." + CTA (`client/bookings/page.tsx:187-194`); no inline suggestions. | copy · missing | P0 (copy + inline top services) · P5 (nearby by geo) | PLT-1 |
| CLI-5 | "Find a practitioner" opens a **service-selection flow**: "What are you looking to get?" with typed input + smart suggestions and a last-visit nudge ("Last time you got a haircut"). | Link → 404 (BUG-1). Discovery page is `/providers` list. | missing | P0 (working link) · P2 (selection flow + nudge) · P5 (GPS) | BUG-1, PLT-1 |
| CLI-6 | Short **inspirational quotes** through the dashboard (shared, curated component). | Only `/community` testimonials (`app/community/page.tsx:10-27`). | missing | P0 | LND-7 (same component) |
| CLI-7 | Profile: first/last name, email, **photo**, address; **"building type"** (house, apartment, hotel, warehouse, other) replaces "neighbourhood"; arrival note bold/high-contrast; card on file unchanged. | Neighbourhood `<select>` limited to 6 Chicago values by DB CHECK (`…20260803070000_client_profile_preferences.sql:16-24`); no photo upload; card-on-file placeholder (`client/profile/page.tsx:234-237`). | missing | P0 (arrival note contrast, photo) · P1 (building_type migration) | — |
| CLI-8 | **Visit reminders are automatic** on booking (no toggle); T-24h and T-2h email (SMS later via WS-E). | Preference column `notification_reminders` exists but nothing reads it; **no scheduler** (no pg_cron, no `[cron]`). | missing | P1 | PLT-4 |
| CLI-9 | Keep "quiet rebooking" and "the occasional letter" settings as they are. | Present (`client/profile/page.tsx:247-262`). | exists | — | — |

## 5. Messaging (MSG)

| ID | Requirement | Current state | Gap | Phase | Depends / decision |
|----|-------------|---------------|-----|-------|--------------------|
| MSG-1 | Send/receive in a thread with read states, polling refresh. | List-only; no send path (`lib/data-client.ts`, `client/messages/page.tsx`). | missing | **In flight: lane B1** (`TASK-MESSAGING-V1`) | — |
| MSG-2 | **iMessage-style** thread: profile photo, date and time per message, bubbles by sender. | — | design | P0/P1 (B1 delivers the thread; styling pass after) | MSG-1 |
| MSG-3 | **Online indicator** (green dot) when the other party is active. | No presence column anywhere. | missing | P1 | PLT-5 (`profiles.last_seen_at` heartbeat, online = seen < 2 min) |
| MSG-4 | **In-app toast** when a message arrives, on any dashboard page. | — | missing | P1 | dashboard layout polls unread count (polling only, CLAUDE.md) |

## 6. Landing page & brand (LND)

| ID | Requirement | Current state | Gap | Phase | Depends / decision |
|----|-------------|---------------|-----|-------|--------------------|
| LND-1 | **No dead links** on any public page. | 10 dead links (BUG-1/2). | bug | P0 | D15 |
| LND-2 | Nav (Services, Practitioners, Manifesto, Sign in) and CTA labels are larger, bolder, higher-contrast; key CTA labels may be white. | 11 px, weight 500, cream (`components/layout/site-header.tsx:26,49`). | design | P0 | — |
| LND-3 | Hero subtext ("She has just arrived…") keeps copy and tone, rendered bolder/more legible. | `app/_components/hero-section.tsx:52`. | design | P0 | — |
| LND-4 | Lighter background direction: **warm brown (Skims-like), cream, or white**, dark text/UI on top; logo and wordmark unchanged. | Dark editorial palette site-wide (`packages/shared/src/theme/palette.ts`); `.light` theme vars exist but are unreachable. | design | P0: three static previews for David · P6: rollout | **D9** |
| LND-5 | CTAs reconsidered; explore an **interactive map** (zip-code entry → practitioners, locations, prices → booking page), Cut-app style. | CTAs "Reserve a window" (`#waitlist`) and "View practitioners" (404). No map component. | missing | P5 | D7, PLT-1, PLT-2 |
| LND-6 | **Manifesto page** with real content: why "Faineant" (idle/stuck double meaning: it's fine to feel sluggish at home — we come to you), who/what/where we are; community-driven, human tone. Optional live map later. | Route does not exist (404); only an on-page section (`app/_components/manifesto-section.tsx`). | missing | P0 (route + draft copy) · P6 (final copy, map) | copy owner: Guillermo drafts, David approves |
| LND-7 | Recurring **short quotes** ("You are the celebrity", "Be the change", "See the change from your own home") via one component. | Ad-hoc blockquotes. | missing | P0 | CLI-6 |
| LND-8 | Keep: logo/wordmark, hero image (real photos later), "Three taps. One nap." section, manifesto section typography. | Present. | exists | — | — |

## 7. Pricing & policy (PRI)

| ID | Requirement | Current state | Gap | Phase | Depends / decision |
|----|-------------|---------------|-----|-------|--------------------|
| PRI-1 | **Server-side pricing engine**: quote = base service price + travel (per-mile × distance) + premium-hour adjustment; platform fee 5% applied at capture; breakdown **stored on the booking** and shown to both parties before confirmation. | `create_booking` derives a single `total_price_in_cents` from `services.price_in_cents` (`…rpc_booking.sql:38-39`); `payments` stores amount/platform fee/payout only. | missing | P3 (schema + RPC) | PLT-1 (distance), D11 |
| PRI-2 | **Travel fee per mile** on top of service price, practitioner-configurable within platform bounds (default band $0.70–$1.00), always visible. | None. | missing | P2 (config field) · P3 (applied) | D11, BUG-13 |
| PRI-3 | **Premium hours** auto-applied by booking start time (e.g. 6–9 AM and 6–10 PM premium, 9 AM–5 PM standard). Bands and rates configurable. | None. | missing | P2 (config) · P3 (applied) | D11 |
| PRI-4 | Platform fee **5%** (confirmed); Stripe processing fee recorded per payment so practitioner net is true net; fees shown only in a secondary area. | Fee env `STRIPE_PLATFORM_FEE_PERCENT` default 5 (`supabase/functions/stripe-payment/index.ts:21`); Stripe fee never recorded. | data | P3 | WS-D |
| PRI-5 | **Tips 100% to practitioner**, stated in Earnings. | No tip column or flow. | missing | P3 | WS-D |
| PRI-6 | **Cancellation window 3 hours** (not 24). Record `cancelled_at`, `cancelled_by`, `cancel_reason`; late-cancel fee per D11. | No cancellation columns or policy surface (`…20260601043840_bookings.sql`). | missing | P1 (columns) · P3 (fee) | D11 |
| PRI-7 | **No-show flow**: after 15 min with no client contact, practitioner records (1) timestamped location photo, (2) call-history screenshot, (3) auto-message to the client; fee = **50% of service price**, split **70% practitioner / 30% Faineant**. | `NO_SHOW` is a provider-only status label; no evidence table, fee, or message automation. | missing | P3 | D11, WS-D, storage purpose `no_show_evidence` |
| PRI-8 | Policy (cancellation + no-show) is **shown and agreed to before confirmation**; the accepted policy version is stored on the booking. | None. | missing | P3 | PRI-6/7 |

## 8. Trust & safety (TRU)

| ID | Requirement | Current state | Gap | Phase | Depends / decision |
|----|-------------|---------------|-----|-------|--------------------|
| TRU-1 | **Two-way reviews**: clients review practitioners (public); practitioners review clients (**visible only to practitioners**, never to the client). | Reviews are one-way by shape (`client_id`/`provider_profile_id`, `…20260601044237_engagement.sql:1-10`) and **public to anon** (`…rls_engagement.sql:3-4`). `create_review` is client-only after `COMPLETED`. | missing (schema + RLS) | P4 | **D8** (policy/legal); recommendation: structured tags + optional note, practitioner-only read policy, disclosed in client terms |
| TRU-2 | **Intro video mandatory** for practitioners before they appear publicly. | Video impossible today (PRC-9); `is_public_provider()` = verified ∧ active. | missing | P4 | D12, PRC-9 |
| TRU-3 | Practitioners see client photo and client reviews/tags on pending cards. | Photo fetched, unrendered. | missing | P0 (photo) · P4 (reviews) | TRU-1 |
| TRU-4 | Data hygiene: no test/fixture services visible to the public in production. | "Test ritual" is public (BUG-10); QA fixtures are intentionally public (`docs/QA.md`). | data | P0 (owner) | — |

## 9. Platform, geo, infrastructure (PLT)

| ID | Requirement | Current state | Gap | Phase | Depends / decision |
|----|-------------|---------------|-----|-------|--------------------|
| PLT-1 | **Geo foundation**: `geography(Point)` columns + GiST on practitioner and booking locations; distance in **miles**; shared distance helper used by discovery and pricing. | PostGIS installed but lat/lng are `double precision` with btree; geography built per query (`…rpc_discovery.sql:30-42`). | missing | P1 | BUG-13 |
| PLT-2 | **Maps**: client overview + landing show practitioners (approximate location publicly); practitioner overview shows nearby open requests (clients opt in to share location). | No map/geolocation code at all. | missing | P5 | **D7** (provider, cost, privacy) |
| PLT-3 | **ETA** on acceptance: manual band in v1; live GPS ETA later. | None. | missing | P2 · P5 | PRC-3 |
| PLT-4 | **Scheduler** (pg_cron + existing send-email function): reminders (CLI-8), availability auto-expiry (PRC-6), no-show timers (PRI-7). | No cron anywhere; only `pg_net` triggers on insert/status update (`…20260601182110_email_webhooks.sql:25-35`). | missing | P1 | — |
| PLT-5 | **Presence**: `profiles.last_seen_at` heartbeat from the dashboard (polling), exposed to conversation participants only. | None. | missing | P1 | MSG-3 |
| PLT-6 | **Staging** with fake data; David verifies there; previews stop writing to production. | Previews share the production Supabase URL. | missing | P1 | **D2** |
| PLT-7 | Security headers on production (XFO, nosniff, Referrer-Policy, CSP). | HSTS only (`next.config.js` has no `headers()`). | missing | P1 | — |

## 10. Traceability — requirement → workstream → phase

| Phase | Workstreams | Requirements |
|-------|-------------|--------------|
| **P0 Fix & polish** (deliver Fri Sep 4) | WS-K (client+landing polish), WS-L (practitioner polish), WS-H (B1) | BUG-1…10, PRC-1 (cards/today/earnings), PRC-2 (address/photo), PRC-4/5 (UI), PRC-11 (labels/quote), PRC-12, CLI-1…6 (P0 parts), CLI-7 (contrast/photo), LND-1/2/3/6 (route+draft)/7, LND-4 previews, MSG-1 |
| **P1 Foundation** | WS-C staging, WS-M infra | PLT-1/4/5/6/7, CLI-8, PM-2 migration, PRI-6 columns, CLI-7 building_type, BUG-11…14, MSG-3/4 |
| **P2 Practitioner model** | WS-N | PM-1/PRC-6 (D6), PRC-7/8/9/10, PRI-2/3 config, PRC-3 manual ETA, CLI-5 selection flow |
| **P3 Payments & policy** | WS-D (expanded) | PRI-1/4/5/6/7/8, PRC-5 net, PRC-11 true net, card on file, BUG-11 |
| **P4 Trust** | WS-I (two-way) | TRU-1/2/3, PRC-10 video gate |
| **P5 Geo & maps** | WS-O | PLT-2/3, LND-5, CLI-4 nearby, PRC-1 map |
| **P6 Brand** | WS-G (landing rebuild) | LND-4 rollout (D9), LND-6 final copy, real photography |
| Continuous | WS-E Twilio, WS-F monorepo split (deferred, D14) | — |

## 11. Acceptance evidence (applies to every requirement)

Per `docs/PLAN.md` §6: works on the preview/staging URL with the QA identities
(`docs/QA.md`) → automated tests green (vitest, pgTAP for any schema change,
Playwright read-only smoke) → David's Monday notes → release via
`docs/DEPLOY.md`. A requirement moves to **verified** only on David's sign-off,
and to **live** only after the release verification in `docs/DEPLOY.md` §4.
