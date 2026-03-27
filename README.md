# ARC - Beauty Services Marketplace

Two-sided marketplace connecting beauty service providers (barbers, nail techs, makeup artists) with clients seeking on-demand or scheduled services.

## Architecture

```
Arc/
├── packages/shared/     # Shared types, Zod schemas, constants
├── apps/
│   ├── api/             # Express + Prisma + Socket.IO backend
│   ├── web/             # Next.js 14 frontend
│   └── mobile/          # React Native + Expo mobile app
├── docker-compose.yml   # Local Postgres + Redis
└── turbo.json           # Turborepo build pipeline
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe Connect (Express accounts) |
| Web | Next.js 14 (App Router), Tailwind CSS |
| Mobile | React Native, Expo, Expo Router |
| Real-time | Socket.IO |
| Maps | Google Maps API |
| SMS (optional) | Twilio + Claude AI |
| Monorepo | pnpm workspaces + Turborepo |

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9 (`corepack enable`)
- Docker & Docker Compose (for local DB)

### Setup

```bash
# 1. Clone and install
git clone <repo-url> && cd Arc
pnpm install

# 2. Start local database
docker compose up -d

# 3. Configure environment
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit .env files with your keys

# 4. Setup database
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed sample data

# 5. Start development
pnpm dev           # Starts all apps concurrently
```

### Seed Accounts

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@arc.app | admin123 |
| Provider | demo.barber@arc.app | provider123 |
| Client | demo.client@arc.app | client123 |

### Individual App Commands

```bash
# API only
pnpm --filter @arc/api dev        # http://localhost:3001

# Web only
pnpm --filter @arc/web dev        # http://localhost:3000

# Mobile
pnpm --filter @arc/mobile dev     # Expo dev server
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Search (Public)
- `GET /api/v1/search/providers` - Search providers (location, category, text)
- `GET /api/v1/search/providers/:slug` - Public provider profile

### Bookings
- `POST /api/v1/bookings` - Create booking
- `PATCH /api/v1/bookings/:id/status` - Update booking status
- `GET /api/v1/bookings/client` - Client's bookings
- `GET /api/v1/bookings/provider` - Provider's bookings

### Services
- `POST /api/v1/services` - Create service (provider)
- `GET /api/v1/services/mine` - Provider's services
- `PUT /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Deactivate service

### Availability
- `PUT /api/v1/availability` - Set weekly schedule (provider)
- `GET /api/v1/availability/:providerId` - Get provider schedule
- `GET /api/v1/availability/:providerId/slots?date=&serviceDuration=` - Available time slots
- `POST /api/v1/availability/overrides` - Block/modify specific dates

### Payments
- `POST /api/v1/payments/connect` - Create Stripe Connect account
- `POST /api/v1/payments/intent/:bookingId` - Create payment intent
- `POST /api/v1/payments/webhook` - Stripe webhook
- `GET /api/v1/payments/earnings` - Provider earnings

### Messages
- `GET /api/v1/messages/conversations` - List conversations
- `GET /api/v1/messages/conversations/:id` - Get messages
- `POST /api/v1/messages/send` - Send message

### Community
- `GET /api/v1/posts` - List posts
- `GET /api/v1/posts/:id` - Get post with comments
- `POST /api/v1/posts` - Create post
- `POST /api/v1/posts/:id/comments` - Add comment
- `DELETE /api/v1/posts/:id` - Delete post

### Admin
- `GET /api/v1/admin/stats` - Platform statistics
- `GET /api/v1/admin/users` - List users
- `PATCH /api/v1/admin/users/:id/toggle` - Enable/disable user
- `PATCH /api/v1/admin/providers/:id/verify` - Verify provider

## Business Model

- **Free to join** for providers - no monthly subscription
- **Transaction-based fees**: Platform takes a small percentage (configurable, default 5%) on each completed booking via Stripe Connect
- Low friction: providers join free, clients pay through the app

## Infrastructure Costs (Annual Estimates)

| Service | Cost |
|---------|------|
| Domain | ~$100/yr |
| Hosting (API) | ~$250/yr |
| Database (Postgres) | ~$300/yr |
| Google Maps API | ~$120/yr |
| Stripe | Transaction fees only (2.9% + $0.30) |
| Twilio (optional) | Per-message (~$0.0075/SMS) |

## License

Proprietary - All rights reserved.
