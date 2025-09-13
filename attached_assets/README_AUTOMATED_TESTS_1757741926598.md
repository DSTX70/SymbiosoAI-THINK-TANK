# SymbiosoAi — Sprint 1 Automated Tests
**Date:** 2025-09-13

This bundle lets Replit (or local dev) run automated tests for Sprint 1.

## What it tests
1) Queue + SSE: enqueue debate → stream progress → complete.
2) Export + DLP: clean export succeeds; P0 content blocks with `DLP_BLOCK`.
3) Demo-off gate: `/auth/demo` returns 403 when `DEMO_LOGIN_ENABLED=false`.
4) Security headers: helmet sets `x-content-type-options`, etc.

## Prereqs
- Your app server running at **http://localhost:3000** (adjust BASE_URL if needed).
- Sprint 1 code wired and Redis reachable.
- ENV: `DEMO_LOGIN_ENABLED=false` for the demo-off test.

## Install & run
```bash
npm i
npm run test:sprint1
# (optional) Run the Postman collection too)
npm run postman
```
