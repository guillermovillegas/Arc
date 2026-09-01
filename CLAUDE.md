# FAINEANT Project Instructions

Faineant is a pnpm/Turborepo monorepo for in-home beauty services. The active
applications are `apps/web` and `apps/mobile`; reusable contracts and generated
database types live in `packages/shared`.

## Architecture authority

- Supabase is the backend: Postgres, Auth, Storage, RLS, RPCs, and Edge Functions.
- `supabase/migrations/*.sql` is the only schema source of truth. There is no ORM.
- Clients use `supabase-js` directly. Put cross-row invariants in transactional
  Postgres RPCs and secret-bearing integration code in Deno Edge Functions.
- RLS and SQL grants are both required. A policy does not replace table/function
  privileges, and a grant does not replace a policy.
- Never expose service-role keys, OAuth tokens, or integration secrets to a client.
  Calendar tokens are encrypted and readable only through the service role.
- Messaging is polling-based. Do not add Socket.IO or another standalone API.

## Database changes

Create forward-only migrations with `supabase migration new`. Add pgTAP tests for
authorization, tenant isolation, and invariant changes. Verify from a fresh local
database with `pnpm db:reset && pnpm db:test`, then regenerate types with
`pnpm db:types`. Do not hand-edit `packages/shared/src/database.types.ts`.

Do not run `supabase db push`, deploy Edge Functions, or mutate the hosted project
unless the user explicitly authorizes that external change. The linked project is
not a substitute for fresh local migration verification.

## Client conventions

- TypeScript strict mode; validate untrusted user input with shared Zod schemas.
- Web uses Tailwind tokens and Radix/shadcn patterns. Preserve the sharp,
  dark-first editorial design; avoid default gray scales and ad hoc radii.
- Mobile sessions use Supabase with Expo SecureStore and AppState-driven refresh.
- Supabase Storage object paths start with the authenticated user ID so storage
  policies can enforce ownership.
- Handle loading, empty, and failure states on every remote-data surface.

## Verification

Build `@faineant/shared` before app-specific checks, or use the root Turbo tasks.

```sh
pnpm --filter @faineant/shared build
pnpm lint
pnpm typecheck
pnpm test
pnpm build
deno check --node-modules-dir=auto supabase/functions/*/index.ts
deno test --allow-env --node-modules-dir=auto supabase/functions
```

Keep historical planning documents clearly labeled as historical. Current code,
SQL migrations, tests, linked-project state, and deployed runtime evidence outrank
old roadmap claims.

<!-- concord:start -->
## Concord — shared work-state for coding agents

<!-- concord:workflow-version=7 -->

This project uses Concord MCP. Keep coordination to the five workflow tools:

- **Before editing**, call `start_work` with the task, your agent kind, your
  `display_name`, and expected files or modules. It registers presence, accepts
  assigned work when appropriate, claims the scope, and returns overlap warnings.
  Concord derives your `agent_id` from your session — omit it unless your client
  told you one.
- **`display_name` is required and is `repo/lane`** in lowercase kebab-case,
  e.g. `concord-mcp/fix-presence`. The lane is 1–3 plain-English words for what
  you are doing; verbs that read well are `fix- build- docs- release- review-
  cleanup- research-`. Say it out loud — if it sounds like an identifier, rename
  it. It is what humans read on the roster instead of your hex id.
- **When your session ends**, run `concord checkout`. Presence closes at once and
  every claim you still hold keeps annotated evidence rather than being silently
  released. A claim whose holder has departed or gone away is taken over with
  `transfer_work action=reassign force=true`, which records the lineage.
- Use `inspect_work` to read the workspace, one task, one agent, or one message
  thread. Use `update_work` for durable progress and for live prompts/replies
  to another promptable workspace agent, including while that agent is busy.
- Use `transfer_work` for assignment, acceptance, decline, release,
  reassignment, evidence-bearing handoff offers, and reopening.
- **Before finishing**, call `finish_work` once with the outcome, changed
  files, tests, assumptions, decisions, risks, guardrails, and provenance. It
  records evidence and can mark work review-ready or terminal.

Keep each claim small and resolve reported overlaps before editing. Concord
regenerates human-readable review artifacts in `.concord/`.

Enforcement remains client-dependent. `concord doctor` reports setup and
workflow adoption; optional hooks can block exact-file collisions.

In Grok Build, keep this session reachable while idle by starting one persistent
monitor for `concord inbox watch --provider grok`. Do not start a duplicate when that monitor is active.

In Cursor, start exactly one Cursor background Shell task for `concord inbox watch --provider cursor --once`.
Leave it active when the turn ends. When Cursor resumes you with its completion,
answer the emitted peer message and immediately start a fresh background monitor.

In Gemini CLI, start the exact monitor command supplied by the SessionStart hook
(`concord inbox watch --agent <agent-id> --provider gemini --once`) with `run_shell_command` and `is_background: true`. Project
settings inject background completion into the agent. Answer the peer message,
then immediately start a fresh background monitor.
<!-- concord:end -->
