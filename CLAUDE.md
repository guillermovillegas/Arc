# ARC Project Instructions

## What This Is

Beauty services marketplace (barbers, nail techs, lash techs, makeup artists). Monorepo with web, API, mobile, and shared package.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **API:** Express + Prisma + PostgreSQL + Socket.IO (standalone server, NOT Vercel serverless)
- **Web:** Next.js 14.2 (App Router) + Tailwind 3.4 + shadcn/ui (CVA + Radix)
- **Mobile:** Expo 50 + React Native 0.73 + Expo Router
- **Shared:** `@arc/shared` — types, Zod schemas, constants
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

### API (Express)
- All routes validated with Zod via `validate()` middleware.
- Auth via JWT Bearer tokens. `authenticate` middleware → `requireRole()` middleware.
- Error handling via `AppError` class + global `errorHandler` middleware.
- Booking creation uses serializable Prisma transaction to prevent double-booking.
- Calendar sync: `getAvailableSlots()` merges ARC bookings + external calendar events.

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
pnpm --filter @arc/shared build   # First
pnpm --filter @arc/web build      # Then
pnpm --filter @arc/api build      # Then
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
