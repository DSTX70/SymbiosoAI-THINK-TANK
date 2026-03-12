# SymbiosoAI ThinkTank

Enterprise-grade collaborative intelligence platform for multi-agent debates, consensus building, and structured analysis.

## Highlights
- Multi-agent debate orchestration with Analyst, Critic, Synthesizer, and Domain Expert roles
- Simple, Guided, and Expert modes with enterprise features (templates, workspaces, collaboration)
- Interactive fact-checking, citations, and report generation
- Document upload and analysis across all modes
- Workspace and organization management with RBAC and entitlements

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Express (TypeScript, ESM)
- Data: PostgreSQL (Neon), Drizzle ORM
- Auth: Replit OpenID Connect or demo login
- Optional: Redis (queues), Stripe (billing), OpenAI/Anthropic (AI providers)

## Quick Start
1. Install dependencies.
2. Configure `.env`.
3. Run the dev server.

See the setup guide for full details: `docs/SETUP.md`.

## Documentation
- Setup: `docs/SETUP.md`
- API: `docs/API.md`
- User manual: `USER_MANUAL.md`
- Platform overview: `PLATFORM_OVERVIEW.md`
- Runbook: `docs/DR_Runbook_Sprint11.md`
- Performance and scalability: `docs/PERFORMANCE_SCALABILITY.md`

## Scripts
- `npm run dev`: start the dev server
- `npm run build`: build the client and server
- `npm start`: run the production build
- `npm run check`: typecheck
- `npm run db:push`: push schema to the database

## Repository Layout
- `src/`: frontend app
- `server/`: Express API and services
- `shared/`: shared types and schema
- `docs/`: operational and policy documentation
- `tests/`: test suites

## License
MIT
