# FAINEANT Project Instructions

## What This Is

In-home beauty services in Chicago. A directory of practitioners — barbers, hair stylists, nail technicians, lash artists, makeup artists, facialists — who travel to the client's home. Monorepo with web, API, mobile, and shared package.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **API:** Express + Prisma + PostgreSQL + Socket.IO (standalone server, NOT Vercel serverless)
- **Web:** Next.js 14.2 (App Router) + Tailwind 3.4 + shadcn/ui (CVA + Radix)
- **Mobile:** Expo 50 + React Native 0.73 + Expo Router
- **Shared:** `@faineant/shared` — types, Zod schemas, brand constants, theme tokens
- **Payments:** Stripe Connect Express (5% platform fee)
- **Calendar Sync:** Google Calendar API (two-way) + ICS feed import
- **Tests:** Vitest (web + API), Jest (mobile) — 293 tests total

## Key Conventions

### TypeScript
- Strict mode everywhere. No `any` types.
- Validate all inputs with Zod (schemas in `packages/shared`).

### Web (Next.js)
- All styling is pure Tailwind utility classes. No custom CSS classes (globals.css has only directives + CSS vars).
- UI components use shadcn/ui pattern: CVA for variants, `cn()` from `@/lib/utils` for class merging, Radix primitives.
- Button font sizes use `text-[0.875rem]` arbitrary values (not `text-body-sm`) to prevent tailwind-merge from stripping color classes like `text-white`.
- Components at `src/components/ui/`. Layout at `src/components/layout/`.

### Design System

Editorial, dark-first brand. Tokens live in `packages/shared/src/theme/` (palette, type, motion) and are mirrored in `apps/web/tailwind.config.ts`. Update both when adding tokens.

**Palette** (use brand scales, not Tailwind defaults like `gray-*`/`zinc-*`):
- `smoke-{950,900,800,700,600}` — backgrounds (body is `bg-smoke-900`)
- `taupe-{500,400,300}` — borders, muted text (`taupe-300` ≈ muted-foreground)
- `champagne-{500,400,300}` — accent / hover / focus ring
- `bone-{200,100,50}` — primary foreground (body text is `text-bone-100`)
- `oxblood-500` — destructive only, used sparingly

**Theme mode:** Dark is canonical — `:root` and `.dark` share the same CSS vars. `.light` is opt-in (transactional emails, user setting). Don't add a third theme.

**Typography** — 4 families via CSS vars: `font-display` (Bricolage Grotesque), `font-sans` (Inter, default body), `font-editorial` (Cormorant Garamond, serif), `font-mono` (Geist Mono). Custom scale: `text-display-{xl,lg}`, `text-editorial-{xl,lg}`, `text-heading`, `text-subheading`, `text-body-{lg,sm}`, `text-caption`, `text-label` (0.6875rem, tracked 0.32em uppercase — used for eyebrows). Prefer scale tokens over arbitrary sizes, except on Button (see gotcha above).

**Radius:** Sharp by design. `rounded-sm` and default are both `0.125rem`. Avoid `rounded-lg`/`rounded-full` outside avatars/pills.

**Motion:** `ease-fai-smooth` (`cubic-bezier(0.16, 1, 0.3, 1)`) is the house easing; durations `duration-{fast:250,normal:400,slow:600}`. Named animations: `animate-fade-in`, `animate-fade-up`, `animate-sheet-in-{right,left,bottom,top}`, `animate-overlay-in`.

**Button variants:** `primary` (bone on smoke, default CTA), `ghost` (transparent + taupe border), `accent` (champagne fill), `outline` (hairline), `destructive` (oxblood, rare), `link`. All have uppercase 0.3em-tracked labels.

**Utility classes** (defined in `globals.css`, only ones allowed): `.rule-hairline`, `.rule-hairline-warm`, `.label-caps`, `.display-compressed`, `.monogram-watermark`. Don't add new ones — extend Tailwind theme instead.

### API (Express)
- All routes validated with Zod via `validate()` middleware.
- Auth via JWT Bearer tokens. `authenticate` middleware → `requireRole()` middleware.
- Error handling via `AppError` class + global `errorHandler` middleware.
- Booking creation uses serializable Prisma transaction to prevent double-booking.
- Calendar sync: `getAvailableSlots()` merges FAINEANT bookings + external calendar events.

### Mobile (Expo)
- Tokens stored via expo-secure-store.
- Input validation on login/register screens.
- Loading + error states on all data-fetching screens.

### Testing
- Web tests: `npx vitest run` in `apps/web/`. Setup mocks lucide-react icons explicitly (not via Proxy).
- API tests: `npx vitest run` in `apps/api/`.
- Mobile tests: `npx jest` in `apps/mobile/`.
- Always run tests after changes: `pnpm test`.

## Build Order

The shared package must build before web or API:
```bash
pnpm --filter @faineant/shared build   # First
pnpm --filter @faineant/web build      # Then
pnpm --filter @faineant/api build      # Then
```
Turborepo handles this automatically via `pnpm build`.

## Database

- Schema: `apps/api/prisma/schema.prisma`
- Local: `docker compose up -d` (Postgres on 5432, Redis on 6379)
- Migrations: `pnpm db:migrate`
- Seed: `pnpm db:seed` (creates admin, demo provider, demo client)

## Environment

API env vars defined and validated in `apps/api/src/config/env.ts` with Zod.
Copy `apps/api/.env.example` to `apps/api/.env` and fill in values.
Google Calendar sync requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

## Project Documents

- `docs/ROADMAP.md` — what's built, what's missing, sprint plan
- `docs/COSTS.md` — infrastructure costs, business setup, transaction economics, Year 1 budget
- `docs/CALENDAR-SYNC.md` — calendar integration strategy and API research
