# ARC — Beauty Services Marketplace

Two-sided marketplace connecting beauty service providers (barbers, nail techs, makeup artists) with clients. Book at their shop or at your door.

## Architecture

```
Arc/
├── packages/shared/        # Types, Zod schemas, constants (@arc/shared)
├── apps/
│   ├── api/                # Express + Prisma + Socket.IO
│   ├── web/                # Next.js 14 (App Router) + shadcn/ui
│   └── mobile/             # Expo + React Native (Expo Router)
├── docker-compose.yml      # Local Postgres + Redis
├── turbo.json              # Turborepo pipeline
├── docs/
│   ├── ROADMAP.md          # Feature roadmap and sprint plan
│   ├── COSTS.md            # Infrastructure and business cost breakdown
│   └── CALENDAR-SYNC.md    # Calendar integration strategy
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Express, TypeScript, Prisma, PostgreSQL |
| **Auth** | JWT (15min access + 7day refresh tokens) |
| **Payments** | Stripe Connect Express (5% platform fee) |
| **Web** | Next.js 14, Tailwind CSS 3.4, shadcn/ui (CVA + Radix) |
| **Mobile** | React Native 0.73, Expo 50, Expo Router |
| **Real-time** | Socket.IO (messaging, typing indicators) |
| **Calendar Sync** | Google Calendar API (two-way), ICS feed import |
| **Maps** | Google Maps API (Haversine geolocation) |
| **Email** | Resend (transactional) + Google Workspace (business) |
| **Monorepo** | pnpm 9 + Turborepo |
| **Testing** | Vitest (web + API), Jest (mobile) — 293 tests |

## Quick Start

```bash
# Prerequisites: Node >= 20, pnpm >= 9 (corepack enable), Docker

# Install
git clone <repo-url> && cd Arc
pnpm install

# Start Postgres + Redis
docker compose up -d

# Configure
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your keys (see Environment Variables below)

# Database
pnpm db:migrate
pnpm db:seed

# Run everything
pnpm dev
```

| App | URL | Command |
|-----|-----|---------|
| Web | http://localhost:3000 | `pnpm --filter @arc/web dev` |
| API | http://localhost:3001 | `pnpm --filter @arc/api dev` |
| Mobile | Expo Dev Server | `pnpm --filter @arc/mobile dev` |

### Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@arc.app | admin123 |
| Provider | demo.barber@arc.app | provider123 |
| Client | demo.client@arc.app | client123 |

## Environment Variables

### API (`apps/api/.env`)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | Access token signing (min 16 chars) |
| `JWT_REFRESH_SECRET` | Yes | — | Refresh token signing (min 16 chars) |
| `STRIPE_SECRET_KEY` | Yes | — | Stripe API key (sk_...) |
| `STRIPE_WEBHOOK_SECRET` | Yes | — | Stripe webhook signing (whsec_...) |
| `STRIPE_PLATFORM_FEE_PERCENT` | No | 5 | Platform fee (0-50%) |
| `GOOGLE_CLIENT_ID` | No | — | Google Calendar OAuth |
| `GOOGLE_CLIENT_SECRET` | No | — | Google Calendar OAuth |
| `GOOGLE_REDIRECT_URI` | No | localhost callback | Google OAuth redirect |
| `GOOGLE_MAPS_API_KEY` | No | — | Geolocation |
| `S3_BUCKET` | No | — | Image upload storage |
| `S3_REGION` | No | us-east-1 | AWS region |
| `TWILIO_ACCOUNT_SID` | No | — | SMS notifications |
| `TWILIO_AUTH_TOKEN` | No | — | SMS notifications |
| `ANTHROPIC_API_KEY` | No | — | AI features |
| `API_PORT` | No | 3001 | Server port |
| `WEB_URL` | No | http://localhost:3000 | Frontend URL (CORS + redirects) |

## API Endpoints

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/register` | No | Register (rate-limited) |
| POST | `/login` | No | Login (rate-limited) |
| POST | `/refresh` | No | Refresh token (rate-limited) |
| POST | `/logout` | Yes | Logout |

### Search (`/api/v1/search`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/providers` | No | Search by location/category/text |
| GET | `/providers/:slug` | No | Public provider profile |

### Bookings (`/api/v1/bookings`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/` | Client | Create booking (serializable transaction) |
| PATCH | `/:id/status` | Provider | Update status |
| GET | `/client` | Client | My bookings |
| GET | `/provider` | Provider | My bookings |

### Services (`/api/v1/services`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/` | Provider | Create service |
| GET | `/mine` | Provider | List my services |
| PUT | `/:id` | Provider | Update service |
| DELETE | `/:id` | Provider | Deactivate service |

### Availability (`/api/v1/availability`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| PUT | `/` | Provider | Set weekly schedule |
| GET | `/:providerId` | No | Get schedule |
| GET | `/:providerId/slots` | No | Available slots (merges external calendar events) |
| POST | `/overrides` | Provider | Block/modify dates |

### Calendar Sync (`/api/v1/calendar`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/connections` | Provider | List connections |
| GET | `/google/connect` | Provider | Start Google OAuth |
| GET | `/google/callback` | — | OAuth redirect handler |
| POST | `/ics` | Provider | Add ICS feed URL |
| POST | `/sync/:connectionId` | Provider | Manual sync trigger |
| DELETE | `/connections/:connectionId` | Provider | Disconnect |

### Payments (`/api/v1/payments`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/connect` | Provider | Stripe Connect onboarding |
| POST | `/intent/:bookingId` | Client | Create payment intent |
| POST | `/webhook` | — | Stripe webhook |
| GET | `/earnings` | Provider | Revenue summary |

### Messages (`/api/v1/messages`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/conversations` | Yes | List conversations |
| GET | `/conversations/:id` | Yes | Get messages |
| POST | `/send` | Yes | Send message |

### Community (`/api/v1/posts`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | No | List posts |
| GET | `/:id` | No | Post with comments |
| POST | `/` | Yes | Create post |
| POST | `/:id/comments` | Yes | Add comment |
| DELETE | `/:id` | Yes | Delete post |

### Admin (`/api/v1/admin`)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/stats` | Admin | Platform stats |
| GET | `/users` | Admin | List users |
| PATCH | `/users/:id/toggle` | Admin | Enable/disable user |
| PATCH | `/providers/:id/verify` | Admin | Verify provider |

## Database Schema

Key models (see `apps/api/prisma/schema.prisma` for full schema):

- **User** — email, role (CLIENT/PROVIDER/ADMIN), profile
- **ProviderProfile** — business info, location, Stripe account, ratings
- **Service** — name, category (13 types), duration, price
- **Booking** — client + provider + service + time + status + payment
- **Availability** — weekly recurring slots + date-specific overrides
- **CalendarConnection** — Google OAuth tokens or ICS feed URL
- **ExternalEvent** — imported events from external calendars
- **Payment** — Stripe payment tracking with platform fee split
- **Conversation/Message** — real-time messaging
- **Review** — 1-5 rating + text + photos
- **Post/Comment** — community forum

## Testing

```bash
pnpm test                          # All packages
pnpm --filter @arc/api test        # API: 85 tests (utils, middleware)
pnpm --filter @arc/web test        # Web: 107 tests (components, pages)
pnpm --filter @arc/mobile test     # Mobile: 101 tests (screens, lib)
```

| Package | Tests | Coverage |
|---------|-------|----------|
| `apps/api` | 85 | Utils (JWT, password, geo, pagination), middleware (auth, role, validation, errors) |
| `apps/web` | 107 | UI components (Button, Card, Badge, Input), utils, landing page |
| `apps/mobile` | 101 | Auth flow, all screens, API client, auth storage |
| **Total** | **293** | |

## UI Components (shadcn/ui)

Located at `apps/web/src/components/ui/`:

| Component | File | Notes |
|-----------|------|-------|
| Button | `button.tsx` | CVA variants, Radix Slot for `asChild` |
| Card | `card.tsx` | Composable (Header/Title/Description/Content/Footer) |
| Input | `input.tsx` | Label + error state support |
| Badge | `badge.tsx` | default/secondary/outline/destructive |
| Avatar | `avatar.tsx` | Radix-based with fallback |
| Separator | `separator.tsx` | Radix-based |
| Sheet | `sheet.tsx` | Radix Dialog-based mobile drawer |

## Project Documents

| Document | Purpose |
|----------|---------|
| `docs/ROADMAP.md` | Feature roadmap, sprint plan, what's built vs missing |
| `docs/COSTS.md` | Full infrastructure costs, business setup, transaction economics |
| `docs/CALENDAR-SYNC.md` | Calendar integration strategy (Google, ICS, Square, Booksy) |
| `CLAUDE.md` | Project conventions for AI assistants and new contributors |

## Scripts

```bash
pnpm dev              # Start all apps
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm typecheck        # TypeScript check all packages
pnpm test             # Run all tests
pnpm db:migrate       # Run Prisma migrations
pnpm db:push          # Push schema to DB (no migration)
pnpm db:seed          # Seed sample data
pnpm db:studio        # Open Prisma Studio
pnpm clean            # Remove all build artifacts
```
