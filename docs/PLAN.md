# FAINEANT — Plan of Attack (Current)

> **This is the canonical forward plan.** `docs/BUILD-PLAN.md` and
> `docs/ROADMAP.md` are historical archives. Current code, SQL migrations,
> verified runtime state, and this document outrank them.
>
> **Sources:** stakeholder meeting, Aug 31 2026 (Guillermo × David, Granola
> transcript) + codebase audit the same day (Concord `TASK-DB-AUDIT`) + architect
> audit of local/Concord/hosted state, Sep 1 2026 (Concord `TASK-ARCH-AUDIT-0901`).
> **Last reviewed:** 2026-09-01.

---

## 1. Outcome and non-goals

**Outcome:** a verified, launchable platform — **find → book → pay** — shipped
in weekly, stakeholder-QA'd increments. Value proposition is getting the
service provider to the client's home; functionality and experience first,
design iteration later.

**Non-goals (for now):** the mobile app, design rehauls, provider-subscription
tiers, boost/promote mechanics, SMS-based booking concierge (all discussed as
later work).

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

## 4. Workstreams (execution graph)

| ID | Workstream | Owner | Depends on | Gate |
|----|------------|-------|------------|------|
| WS-A | **Platform audit** — test accounts, attempt bookings, log everything; Granola-narrated (page, what you see, what's broken); transcript + summary + screenshots via email | **David** | — | **Due Sep 1** |
| WS-B | **Verification backbone** — upgrade Supabase CLI (≥2.116), `migration list --linked`, audit deployed functions/secrets vs `docs/DEPLOY.md`, fresh `pnpm db:reset && pnpm db:test`, expand automated tests toward every mutation | Guillermo → **A1** | — | Ledger + functions + secrets audited Sep 1 ✔; fresh `db:test`, CLI upgrade, plan landed on `main` → A1 |
| WS-C | **Staging environment** — mirrors production, fake data only; all changes land here first | Guillermo | WS-B | Staging URL live, David testing on it |
| WS-D | **Stripe checkout + Mercury payouts** — complete checkout, refunds, webhook verification; tie Mercury to Stripe payouts; configurable platform fee (placeholder 5%; Stripe ≈2.9% + $0.30) | Guillermo | WS-J (fee %) | Test payment end-to-end on staging |
| WS-E | **Twilio SMS** — Guillermo creates account; David completes qualification: customer profile, tax form, $10 starting balance, payment details, register phone number; A2P government approval required; check "Twilio for Startups" credits | Guillermo + David | — | **Start now** — approval lead time unknown |
| WS-F | **Monorepo split** — `apps/web` → `apps/admin` (internal, never public) + `apps/web` (main: landing + customer + provider); extract shared package | Guillermo | — | Both apps build; no public admin surface |
| WS-G | **Landing rebuild + public provider pages** — Booksy-style: providers, pricing, availability visible before login; gate only at booking; linear find → book → pay | Guillermo | WS-F | David can browse providers logged-out on staging |
| WS-H | **Messaging v1** — wire `send_message` into web, thread view, read states, reliability infrastructure | Guillermo → **B1** | — | PR + Vercel preview for Friday packet; send + receive verified locally; ships after David sign-off |
| WS-I | **Reviews v1** — wire `create_review` into web, display on provider pages, eligibility tied to completed bookings | Guillermo | P1/P2 | Leave + read a review on staging |
| WS-J | **Stakeholder decisions** (below) | **David** | — | Fee % gates WS-D |

### WS-J — Decisions David owns

1. **Platform fee %** — placeholder is 5%. Unit economics from the meeting:
   at $100 average ticket, Stripe ≈2.9% + $0.30, 5% fee → ~$4.85/booking to
   the platform → **~108 bookings/week covers $500 dev + ~$100 platform
   costs.**
2. **Copy direction** — "practitioner" vs "provider" language (centralized,
   easy change).
3. **Travel/mileage fee model** — today providers set a flat price per
   service ("ritual"); no distance pricing.
4. **In-app messaging** — keep all three channels (in-app + email + SMS,
   default) or drop in-app and go email/SMS only.

### Active lanes (dispatched Sep 1)

One untracked dispatch file per lane in `.concord/dispatches/` (gitignored);
each lane claims its Concord task, works in its own worktree under
`/Users/guillermovillegas/development/faineant-worktrees/`, and closes with
`finish_work complete`. Silence between gates is normal.

| Lane | Concord task | Workstream | Branch / worktree | Gate |
|------|--------------|------------|-------------------|------|
| **A1** `faineant/verify-backbone` | `TASK-VERIFY-BACKBONE` | WS-B | `a1/verify-backbone` · `faineant-worktrees/a1-verify-backbone` | Docs/plan PR merged to `main`; fresh pgTAP + app gate green; CLI ≥ 2.116; draft PR for the rate-limit branch; merged branches pruned |
| **B1** `faineant/build-messaging` | `TASK-MESSAGING-V1` | WS-H | `b1/messaging-v1` · `faineant-worktrees/b1-messaging-v1` | PR open (not merged) with preview URL + stakeholder test script; vitest + gate green |

Queued next (not dispatched): **A2** staging (WS-C) — blocked on decision D2
below; **B2** reviews v1 (WS-I); **security headers** follow-up (§3).

## 5. Phases (focus, not hard sequence)

- **P1 — Know what we have:** WS-A + WS-B. *(this week)*
- **P2 — Fix the foundation:** WS-C + WS-F + release process from WS-B.
- **P3 — Messaging:** WS-H.
- **P4 — Reviews:** WS-I.
- **P5 — Payments:** WS-D (gated by WS-J fee decision).
- **Continuous:** WS-E (Twilio — external approval latency), WS-G (after
  WS-F), WS-J (anytime).

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

## 8. Next steps (from the meeting)

1. **David:** platform audit by **Sep 1** — Granola-narrated, emailed.
2. **Guillermo:** complete Stripe checkout + tie Mercury to payouts (WS-D).
3. **Guillermo:** create Twilio account → David qualification (WS-E).
4. **David:** confirm platform fee percentage (WS-J).
5. **Guillermo:** begin monorepo split + landing rebuild (WS-F → WS-G).

## 9. Canonical authorities

- This plan: `docs/PLAN.md`
- Architecture/conventions: `CLAUDE.md`, `AGENTS.md`
- Release: `docs/DEPLOY.md` · QA identities: `docs/QA.md` · Email compliance:
  `docs/MARKETING-EMAIL.md`
- Tracking: Concord workspace (`concord_inspect_work`) — workstreams become
  claimed tasks as execution starts.
- Dispatches: `.concord/dispatches/<lane>.md` (gitignored, one file per lane;
  the file is the complete prompt; Concord holds the pointer and gates).

## 10. Decisions pending (Sep 1)

| ID | Decision | Owner | Recommendation / default |
|----|----------|-------|--------------------------|
| D1 | Set `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`/`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` on hosted `prod` now? | Guillermo | **No.** Configure them on staging first (D2). Live Stripe on `prod` waits for WS-D checkout + fee decision (WS-J.1). |
| D2 | Authorize creating a second Supabase project (staging) + a Vercel environment pointed at it | Guillermo | **Yes, this week** — unblocks A2 (WS-C) and removes preview→prod writes. External resource; needs explicit OK. |
| D3 | Rate-limit branch `claude/email-entry-rate-limit-uhzgcx`: accept A1's draft-PR assessment, then merge under release authority (changes hosted auth rate limit + needs function redeploy) | Guillermo | Merge only via `$release-conductor` after the draft PR's CI and A1's finding are read. |
| D4 | Remove closed-lane worktrees `faineant-worktrees/auto-deploy` and `release-production-waitlist` (both clean, PRs merged) | Guillermo | **Yes** — one-line OK; architect's closure sweep removes them. |
| D5 | Fix `.mcp.json` Supabase MCP `project_ref` → `cjphfgvmbtynsfpapzrg` | Guillermo | **Yes** — local, untracked, one-line edit. |
