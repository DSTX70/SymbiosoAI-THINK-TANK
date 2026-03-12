# Setup Guide

This guide covers local development setup for SymbiosoAI ThinkTank.

## Prerequisites
- Node.js 20 (matches `.replit` config)
- npm 10+ (or compatible)
- PostgreSQL 16
- Optional: Redis (queues), Stripe account, OpenAI/Anthropic keys

## Install
1. Install dependencies:

```bash
npm install
```

## Environment Variables
Copy `.env.example` to `.env` and fill in required values.

Required:
- `DATABASE_URL` (PostgreSQL connection string)
- `SESSION_SECRET`
- `JWT_SECRET`
- `ENCRYPTION_KEY` (32 characters)
- `WEBHOOK_SECRET`

Recommended for core features:
- `OPENAI_API_KEY` (debates and report generation)

Optional services:
- `REDIS_URL` and `REDIS_PASSWORD` (queues and background jobs)
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` (billing)

## Database
The server requires a PostgreSQL database at startup.

1. Create a database and set `DATABASE_URL`.
2. Push schema:

```bash
npm run db:push
```

## Run (Development)
Start the dev server on port `5000`:

```bash
npm run dev
```

## Build and Run (Production)
```bash
npm run build
npm start
```

## Common Notes
- The API and client are served from the same port (`PORT`, default `5000`).
- Demo login is available (`demo` / `demo123`) in development.
- In production, demo login is disabled by default. Enable it by setting either `DEMO_LOGIN_ENABLED=true` or `ENABLE_DEMO_LOGIN=true` (exposes `/api/demo-login`).
- If you are offline, you must install dependencies on a machine with access to the npm registry.
