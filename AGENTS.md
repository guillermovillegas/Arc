# Repository Guidance for Codex

Read `CLAUDE.md` for the shared architecture and engineering conventions. Treat
this file as the Codex-specific operational memory for the repository.

- Preserve unrelated or untracked work in shared checkouts. Inspect `git status`
  before editing and never reset another agent's changes.
- The repository remote is under `Faineant-INC`; the product and package namespace
  are `Faineant` / `@faineant`. Do not revive Arc package names.
- Supabase SQL migrations, RLS, grants, RPCs, pgTAP tests, and generated types must
  move together. Validate migrations from a clean local stack.
- The hosted Supabase project, Vercel projects, GitHub integration, and DNS are
  external state. Reconcile them live before release claims, and do not push,
  deploy, rename, or delete external resources without explicit authorization.
- Never commit `.env` files, service-role keys, OAuth credentials, or local CLI
  state. Public anon/publishable values still belong in deployment configuration,
  not hard-coded application source.
- A green build is not proof of production deployment. Report Git, database,
  Edge Function, Vercel, and domain status separately.
- Browser account QA lives in `apps/web/e2e`. Keep its identity registry,
  `docs/QA.md`, and role-routing behavior synchronized. Credentials come only
  from Keychain or CI secrets; never persist Playwright storage state, traces, or
  videos containing authenticated sessions.
- Production UI smoke tests are serial and read-only. Stateful browser tests need
  disposable fixtures, explicit cleanup, and a separate lane.
- Marketing email is governed by `docs/MARKETING-EMAIL.md`. Never treat a legacy
  waitlist row as consent, bypass `marketing_status`, invent a postal address,
  pre-check consent, or send live marketing to an address that did not opt in.

## Concord Orchestration Rules (HARD ENFORCED)
**You are part of a 20-agent Matrix orchestration. You must strictly adhere to these rules at all times:**
1. **Branch Isolation:** NEVER start working on the default branch (e.g., `main`, `develop`). ALWAYS create and switch to a new, isolated git branch or worktree before you begin any task.
2. **Concord Tracking:** As soon as you receive a task, use your Concord MCP tools to register the task in the `.concord/concord.db` SQLite database. Claim it immediately.
3. **Status Updates:** Update Concord at every stage of your work (`in_progress`, `review_ready`, `complete`). Concord is the absolute source of truth.
4. **Task Overlap:** Check Concord for active tasks before touching any files. If another agent has claimed a file or feature, do not touch it.
5. **Safe Resource Hygiene:** NEVER delete active worktrees or another agent's workspace. ONLY once a task has received a passing QA verdict and is officially merged (`status: complete`) may you safely remove YOUR OWN associated git worktree (`git worktree remove <path>`) and prune your local branch (`git branch -d <branch>`) to prevent disk bloat.

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
