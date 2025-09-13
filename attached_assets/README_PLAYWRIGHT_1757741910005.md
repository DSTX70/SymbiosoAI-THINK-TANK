# SymbiosoAi — Sprint 1 Playwright UI Tests
**Date:** 2025-09-13

This suite adds **headless UI checks** on top of the Sprint 1 API tests. It uses Playwright to verify:
- Progress overlay appears during a run and clears on completion (UI-first where possible)
- Export button triggers a download; DLP‑blocked content surfaces a clear message
- "Why Transfer?" panel renders in contexts where it should
- Demo gate blocks the demo route in prod (403/404)

> These tests assume your app exposes UI elements with **data-testid** attributes as listed in `config/selectors.ts`.
> If your current UI doesn’t have them yet, add them (recommended) or adjust selectors accordingly.

## Install & Run
```bash
npm i --save-dev @playwright/test
npx playwright install --with-deps

# Run all tests headless
npx playwright test

# Run headed for debugging
npx playwright test --headed

# HTML report
npx playwright show-report
```

## Environment
- Base URL defaults to http://localhost:3000. Override with `BASE_URL` env:
```bash
BASE_URL=https://your-replit-url npx playwright test
```
