# FAINEANT — Plan of Attack (Current)

> **This is the canonical forward plan.** `docs/BUILD-PLAN.md` and
> `docs/ROADMAP.md` are historical archives. Current code, SQL migrations,
> verified runtime state, and this document outrank them.
>
> **Sources:** stakeholder meeting, Aug 31 2026 (Guillermo × David, Granola
> transcript) + codebase audit the same day (Concord `TASK-DB-AUDIT`) + architect
> audit of local/Concord/hosted state, Sep 1 2026 (Concord `TASK-ARCH-AUDIT-0901`)
> + **David's platform-audit notes (WS-A), Sep 1 2026** and the architect code
> audit against them, Sep 1–2 (Concord `TASK-ARCH-REQ-0901`; requirements in
> `docs/REQUIREMENTS.md`).
> **Last reviewed:** 2026-09-02.

---

## 1. Outcome and non-goals

**Outcome:** a verified, launchable platform — **find → book → pay** — shipped
in weekly, stakeholder-QA'd increments. Value proposition is getting the
service provider to the client's home; functionality and experience first,
design iteration later.

**Non-goals (for now):** the mobile app, provider-subscription tiers,
boost/promote mechanics, SMS-based booking concierge (all discussed as later
work). A full visual rehaul stays deferred (P6, decision D9); **contrast and
typography fixes are in scope now** as accessibility defects (D13).

## 2. Operating cadence (as agreed in the meeting)

- **Guillermo delivers changes by Friday.**
- **David reviews over the weekend; notes due back Monday.**
- **Review meeting every Monday** (1 structured hour; async via text/email
  otherwise). David always knows what's changing before it ships.
- Ratio: **5 dev days : 2 QA days.**
- **Nothing ships unverified.** Once staging exists, all changes land there
  first; David's sign-off promotes to production.
- The plan evolves as David's audit finds issues — re-plan weekly at the
  Monday meeting.

## 3. Current state (evidenced, Sep 1)

**Production is consistent with `origin/main` on all three planes** (verified
Sep 1, read-only, via `npx supabase@2.116.0`, `gh`, and `vercel`):

- GitHub `Faineant-INC/faineant` `main` = `d1191aa` (Aug 4, PR #14). CI and
  "Verify production build" green at that commit. No PR merged since; no open PRs;
  `main` has **no branch protection**; no tags or releases exist.
- Supabase project `prod` (`cjphfgvmbtynsfpapzrg`, ACTIVE_HEALTHY): migration
  ledger **28/28 local = remote** through `20260803124545`. 10 Edge Functions
  ACTIVE (nine at v5 from Aug 3; `marketing-subscribe` v3 from Aug 5).
- Vercel project `faineant` (root `apps/web`): production deployment Ready,
  created Aug 4 19:08:37 CDT (3 s after the `main` merge commit) and aliased to
  `faineantapp.com`, `www`, and `faineant-git-main` → **production == `main`**.

**Defects found by the audit (not in the Aug 31 picture):**

- **Stripe and Google Calendar are dead in production.** Hosted secrets lack
  `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET` (the functions call `required(...)` on them). Stripe
  Connect onboarding, payment, refund, webhook, and Google connect/sync fail at
  runtime today. ICS calendar, transactional email, and marketing opt-in have
  their secrets. Expect David's audit (WS-A) to hit this.
- **Every Vercel preview runs against the production database.** One
  `NEXT_PUBLIC_SUPABASE_URL` value is shared by Production, Preview, and
  Development. This is the concrete reason WS-C (staging) exists.
- **Stranded fix:** `origin/claude/email-entry-rate-limit-uhzgcx` (Aug 21,
  "stop spurious 429s on the homepage email form", optional Turnstile, raises
  `[auth.rate_limit].email_sent`) never got a PR. Production still runs the
  Aug 5 `marketing-subscribe`. A1 opens it as a draft PR for assessment.
- **Security headers:** production serves only HSTS; no `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, or CSP (`next.config.js` has no
  `headers()`). Follow-up lane, not in A1/B1.
- `.github/workflows/qa-ui.yml` targets a `production-qa` GitHub environment that
  does not exist; the workflow has never run.

**Unchanged from Aug 31:**

- Schema: 28 migrations, 17 tables, RLS + grants, 12 pgTAP files — green in CI
  (isolated `supabase start` + `test db`) on Aug 5; not yet run on a fresh local
  stack since (A1 does this).
- Core loop built but not QA'd end-to-end. Confirmed gaps: **messaging send**
  (RPCs + RLS deployed, zero client callers → **B1**), **review creation** (RPC,
  no UI), **payment capture** (functions deployed, no checkout, no secrets).

**Local checkout (Sep 1):** `codex/plan-of-attack` and local `main` are 4 commits
behind `origin/main`; Concord rules in `AGENTS.md`/`CLAUDE.md`/`.gitignore` and
this file are uncommitted (A1 lands them). Installed Supabase CLI 2.98.2 cannot
parse `config.toml` (CI pins 2.111.0 and works). `.mcp.json` points the Supabase
MCP at `dujuixrqfarkcbdhqlkn`, a project this account does not own — it should be
`cjphfgvmbtynsfpapzrg`. Two closed-lane worktrees remain
(`faineant-worktrees/auto-deploy`, PR #13; `release-production-waitlist`,
detached at `origin/main`, PR #14) — clean, removal pending owner OK.

### WS-A received: David's audit notes (Sep 1)

Verbatim notes: `docs/stakeholder/2026-09-01-david-notes.md`. Requirements,
current-state evidence, and learnings: `docs/REQUIREMENTS.md` (§0 learnings,
§2 defects). Headline facts from the code audit against the notes:

- **10 dead links on the live landing page** (`/practitioners`, `/manifesto`,
  `/press`, `/journal`, `/house-accounts`, `/gift`, `/for-practitioners`,
  `/contact`, `/cancellation`, `/apply`). "Find a practitioner" → 404 is a
  route rename without a route (`/providers` is the real page).
- **The practitioner "Overview" nav item opens the client dashboard**; there is
  no practitioner landing page. Decline reasons are discarded; "Book again" is
  `#`; a "Test ritual" service is public in production.
- **Model gaps behind David's asks:** availability is never checked by
  `create_booking`; bookings store one price integer; reviews are one-way and
  public; no scheduler, no presence, no geo index, no video storage, no
  cancellation/no-show columns.
- **Resolved from WS-J:** fee 5% confirmed; copy = "practitioner"; travel fee =
  per-mile; in-app messaging kept (iMessage style).

## 4. Workstreams (execution graph)

| ID | Workstream | Owner | Depends on | Gate |
|----|------------|-------|------------|------|
| WS-A | **Platform audit** — test accounts, attempt bookings, log everything; Granola-narrated (page, what you see, what's broken); transcript + summary + screenshots via email | **David** | — | **Due Sep 1** |
| WS-B | **Verification backbone** — upgrade Supabase CLI (≥2.116), `migration list --linked`, audit deployed functions/secrets vs `docs/DEPLOY.md`, fresh `pnpm db:reset && pnpm db:test`, expand automated tests toward every mutation | Guillermo → **A1** | — | Ledger + functions + secrets audited Sep 1 ✔; fresh `db:test`, CLI upgrade, plan landed on `main` → A1 |
| WS-C | **Staging environment** — mirrors production, fake data only; all changes land here first | Guillermo | WS-B | Staging URL live, David testing on it |
| WS-D | **Payments, pricing engine, policy fees** — stored price breakdown (base + per-mile travel + premium hours + 5% fee), checkout, tips (100% to practitioner), Stripe-fee capture for true net, refunds, webhook; 3-hour cancellation + no-show fee (50%, split 70/30) with policy acceptance; Mercury payouts. `docs/REQUIREMENTS.md` §7 | Guillermo | WS-M, D11 | Test payment with full breakdown on staging |
| WS-E | **Twilio SMS** — Guillermo creates account; David completes qualification: customer profile, tax form, $10 starting balance, payment details, register phone number; A2P government approval required; check "Twilio for Startups" credits | Guillermo + David | — | **Start now** — approval lead time unknown |
| WS-F | **Monorepo split** — `apps/web` → `apps/admin` + `apps/web`; extract shared package. **Deferred (D14)** — not stakeholder-visible; revisit at a Monday re-plan | Guillermo | — | Both apps build; no public admin surface |
| WS-G | **Brand rollout (P6)** — lighter palette (D9), final manifesto copy, CTA rework, real photography; public practitioner pages with prices/availability visible before login (Booksy-style). `docs/REQUIREMENTS.md` §6 | Guillermo | D9, WS-O | David approves the palette on staging |
| WS-H | **Messaging v1** — wire `send_message` into web, thread view, read states, reliability infrastructure | Guillermo → **B1** | — | PR + Vercel preview for Friday packet; send + receive verified locally; ships after David sign-off |
| WS-I | **Trust: two-way reviews + intro video** — client→practitioner public; practitioner→client visible to practitioners only (D8); intro-video gate on publication (D12). `docs/REQUIREMENTS.md` §8 | Guillermo | WS-M, D8, D12 | Leave + read a review on staging; client review hidden from the client |
| WS-J | **Stakeholder decisions** (below; four resolved Sep 1) | **David** | — | D6–D12 gate P2–P5 |
| WS-K | **P0 client + landing polish** — route rename + dead links, contrast/typography, concierge copy, cursive greeting, quotes component, manifesto route with draft copy, three palette previews. `docs/REQUIREMENTS.md` §2, §4, §6 | Guillermo → **B2** | — | PR + preview by **Fri Sep 4**; David verifies Monday |
| WS-L | **P0 practitioner polish** — practitioner overview page, pending-card address/photo, Pending/Confirmed/Completed filters, earnings labels/fee copy/quote, sidebar fixes. `docs/REQUIREMENTS.md` §3 | Guillermo → **B3** | — | PR + preview by **Fri Sep 4** |
| WS-M | **Foundation infra (P1)** — pg_cron + automated visit reminders, presence heartbeat, geo columns in miles, cancellation columns, `building_type`, direct `CONFIRMED→COMPLETED`, security headers, perf fixes. `docs/REQUIREMENTS.md` §9 | Guillermo | WS-C | Migrations + pgTAP green on staging |
| WS-N | **Practitioner model (P2)** — "Ready to travel" toggle (D6), merged Services/Portfolio/Profile, trade + service catalog, travel/premium config, video uploads (D12), manual ETA on accept. `docs/REQUIREMENTS.md` §3 | Guillermo | WS-M, D6 | David toggles availability and edits a merged profile on staging |
| WS-O | **Geo & maps (P5)** — practitioner map (client + landing), open-request map (practitioner), live ETA, zip-entry landing map. `docs/REQUIREMENTS.md` §9 | Guillermo | WS-M, D7 | Map renders staging practitioners |

### WS-J — Decisions David owns

1. **Platform fee %** — **resolved Sep 1: 5%** ("Faineant takes 5%"). Unit
   economics from the Aug 31 meeting: at $100 average ticket, Stripe ≈2.9% +
   $0.30, 5% fee → ~$4.85/booking → **~108 bookings/week covers $500 dev +
   ~$100 platform costs.** Fees are shown only in a secondary area.
2. **Copy direction** — **resolved Sep 1: "practitioner"** everywhere,
   including public URLs (D15).
3. **Travel/mileage fee model** — **resolved Sep 1: per-mile on top of the
   service price**, starting band $0.70–$1.00/mile; exact rate, premium-hour
   bands, and late-cancel fee still to finalize (D11).
4. **In-app messaging** — **resolved Sep 1: keep in-app** (iMessage-style
   thread, online dot, in-app toasts) alongside email and SMS.

### Active lanes

One untracked dispatch file per lane in `.concord/dispatches/` (gitignored);
each lane claims its Concord task, works in its own worktree under
`/Users/guillermovillegas/development/faineant-worktrees/`, and closes with
`finish_work complete`. Silence between gates is normal.

| Lane | Concord task | Workstream | Branch / worktree | State / gate |
|------|--------------|------------|-------------------|--------------|
| **A1** `faineant/verify-backbone` | `TASK-VERIFY-BACKBONE` | WS-B | `a1/verify-backbone` | **Complete Sep 1** — PR #16 → `main` 466d68a; CLI 2.116; pgTAP 12/83; draft PR #15 for the rate-limit branch. Closure sweep pending (D4). |
| **B1** `faineant/build-messaging` | `TASK-MESSAGING-V1` | WS-H | `b1/messaging-v1` · `faineant-worktrees/b1-messaging-v1` | Dispatched, unclaimed. Gate: PR open (not merged) + preview + test script |
| **B2** `faineant/polish-client-landing` | `TASK-P0-CLIENT-LANDING` | WS-K | `b2/p0-client-landing` · `faineant-worktrees/b2-p0-client-landing` | Proposed — launches when this roadmap is approved. Gate: PR + preview + screenshots by Fri Sep 4 |
| **B3** `faineant/polish-practitioner` | `TASK-P0-PRACTITIONER` | WS-L | `b3/p0-practitioner` · `faineant-worktrees/b3-p0-practitioner` | Proposed — same. Owns `components/app-sidebar.tsx`; B2 must not touch it |

Queued next (not dispatched): **A2** staging (WS-C, blocked on D2); **WS-M**
foundation infra (after staging); WS-N/WS-D/WS-I/WS-O per phases below.

## 5. Phases (focus, not hard sequence; revised Sep 2)

- **P0 — Fix & polish** *(this week, deliver Fri Sep 4)*: WS-K (B2), WS-L (B3),
  WS-H (B1). Defects BUG-1…10, contrast/typography inside the current palette,
  concierge copy, practitioner overview page, filters, earnings labels, manifesto
  route with draft copy, three palette previews for David. No schema changes.
- **P1 — Foundation**: WS-C staging (D2) then WS-M infra: scheduler + automatic
  reminders, presence, geo columns in miles, cancellation columns, building
  type, direct CONFIRMED→COMPLETED, security headers, perf. Messaging polish
  (online dot, toasts). All migrations verified on staging.
- **P2 — Practitioner model**: WS-N — "Ready to travel" (D6), merged
  Services/Portfolio/Profile, trade + catalog, travel/premium pricing config,
  video uploads (D12), manual ETA on accept, client service-selection flow.
- **P3 — Payments & policy**: WS-D — pricing engine with stored breakdown,
  checkout, tips, true net earnings, 3-hour cancellation, no-show flow with
  evidence + fee, policy acceptance at confirmation, card on file.
- **P4 — Trust**: WS-I — two-way reviews with practitioner-only visibility
  (D8), intro-video gate (D12), client reviews on pending cards.
- **P5 — Geo & maps**: WS-O — practitioner/open-request maps, live ETA,
  zip-entry landing map (D7), nearby suggestions in the concierge empty state.
- **P6 — Brand**: WS-G — palette rollout (D9), final manifesto copy, CTA
  rework, real photography.
- **Continuous:** WS-E Twilio (external approval latency), WS-J decisions.
  WS-F monorepo split deferred (D14).

## 6. Acceptance and evidence gates

- **Friday delivery packet:** what changed, where to test it (staging URL),
  and the regression list to re-test.
- **David's Monday notes:** Granola transcript + summary + screenshots via
  email. Specific requirements (layout, copy, CTA, responsive behavior) —
  not "make it better." Ambiguous requirements → rework → wasted money.
- **Phase gate:** works on staging with fake data + automated tests green +
  David sign-off → then production.
- **Production changes** follow `docs/DEPLOY.md` release verification:
  migration ledger match, function versions, Vercel Ready at the same commit.

## 7. Risks

- **Monday notes slip → the whole week slips.** (stated in the meeting)
- **Twilio A2P approval** lead time unknown → start immediately.
- **Unverified production state** — WS-B may reveal drift between repo and
  hosted project; reconcile before any `db push`.
- **Scope churn** — expected; absorbed at the Monday re-plan, not mid-week.
- **Stripe/Google secrets absent in production** — Connect onboarding and
  calendar OAuth fail today; putting live or test keys on `prod` is a decision
  (D1), and the safer home is staging (D2).
- **Previews write to production data** — until WS-C, every stakeholder test on
  a preview URL mutates the production database (QA fixtures included).

## 8. Next steps (Sep 2)

1. **Guillermo:** approve this roadmap (merge the docs PR) → launch B2 and B3;
   deactivate the public "Test ritual" service (BUG-10, admin action).
2. **Guillermo:** decide D2 (staging) — unblocks P1 and stops previews writing
   to production.
3. **David:** decisions D6–D12 (§10) at Monday's meeting; price display in past
   visits (D10); final mileage/premium/no-show numbers (D11).
4. **Guillermo:** Twilio account → David qualification (WS-E) — unchanged.
5. **Both:** Friday packet = B1/B2/B3 preview URLs + test scripts +
   screenshots; Monday notes on those.

## 9. Canonical authorities

- This plan: `docs/PLAN.md`
- Architecture/conventions: `CLAUDE.md`, `AGENTS.md`
- Release: `docs/DEPLOY.md` · QA identities: `docs/QA.md` · Email compliance:
  `docs/MARKETING-EMAIL.md`
- Tracking: Concord workspace (`concord_inspect_work`) — workstreams become
  claimed tasks as execution starts.
- Requirements: `docs/REQUIREMENTS.md` (IDs cited by every lane and PR).
  Stakeholder source notes: `docs/stakeholder/<date>-<name>-notes.md`.
- Dispatches: `.concord/dispatches/<lane>.md` (gitignored, one file per lane;
  the file is the complete prompt; Concord holds the pointer and gates).

## 10. Decisions pending (Sep 1–2)

| ID | Decision | Owner | Recommendation / default |
|----|----------|-------|--------------------------|
| D1 | Set `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`/`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` on hosted `prod` now? | Guillermo | **No.** Configure them on staging first (D2). Live Stripe on `prod` waits for WS-D checkout + fee decision (WS-J.1). |
| D2 | Authorize creating a second Supabase project (staging) + a Vercel environment pointed at it | Guillermo | **Yes, this week** — unblocks A2 (WS-C) and removes preview→prod writes. External resource; needs explicit OK. |
| D3 | Rate-limit branch `claude/email-entry-rate-limit-uhzgcx`: accept A1's draft-PR assessment, then merge under release authority (changes hosted auth rate limit + needs function redeploy) | Guillermo | Merge only via `$release-conductor` after the draft PR's CI and A1's finding are read. |
| D4 | Remove closed-lane worktrees `faineant-worktrees/auto-deploy` and `release-production-waitlist` (both clean, PRs merged) | Guillermo | **Yes** — one-line OK; architect's closure sweep removes them. |
| D5 | Fix `.mcp.json` Supabase MCP `project_ref` → `cjphfgvmbtynsfpapzrg` | Guillermo | **Yes** — local, untracked, one-line edit. |
| D6 | **Product model:** replace scheduling with an on-demand "Ready to travel" toggle, or add it alongside time-window booking? | David + Guillermo | **Additive.** Toggle = "available now" signal + instant requests; advance booking by window stays (David's own 3-hour window, premium *hours*, and "Pick a window" section presuppose it). Weekly grid UI hidden; tables retained as rollback. `REQUIREMENTS.md` PM-1. |
| D7 | **Maps/geo:** map provider (Mapbox vs Google), cost, and location privacy — public practitioner pins approximate; client location shared only after acceptance; "nearby demand" map requires client opt-in | Guillermo (cost) + David (privacy stance) | Mapbox, approximate public pins, opt-in demand pins; decide before P5. |
| D8 | **Practitioner→client reviews hidden from clients** — fairness/legal exposure of hidden consumer ratings | David (+ counsel before launch) | Structured tags (punctual, ready, respectful) + optional private note, practitioner-only RLS, disclosed in client terms. No free-text scores in v1. |
| D9 | **Lighter palette direction** — warm brown (Skims-like), cream, or white | David | Pick from B2's three static previews; contrast fixes ship now inside the dark palette; rollout in P6. |
| D10 | **Show prices in client past visits?** | David | **Show** — the landing principle is "all prices visible, no hidden info". |
| D11 | **Numbers to finalize:** mileage rate ($0.70–$1.00), premium-hour bands/rates, no-show 50% with 70/30 split (confirm), late-cancel (<3 h) fee | David | Defaults: $0.85/mile; 6–9 AM and 6–10 PM premium; no-show as noted; late-cancel = same as no-show. Stored as platform settings, editable without deploy. |
| D12 | **Mandatory intro video** — storage limits (8 MB/image-only today), Supabase plan cost for video, or Instagram link as interim | Guillermo | Allow ≤60 s / ≤50 MB video via resumable upload on staging first; make mandatory only after the first 10 practitioners; Instagram link as optional interim. |
| D13 | Reclassify contrast/typography fixes from the "design rehaul" non-goal to P0 accessibility work | Guillermo | **Yes.** |
| D14 | Defer WS-F monorepo split until after P3 | Guillermo | **Yes** — not stakeholder-visible; admin stays behind role middleware. |
| D15 | Rename public route `/providers` → `/practitioners` with a permanent redirect | Guillermo | **Yes** (B2). |
