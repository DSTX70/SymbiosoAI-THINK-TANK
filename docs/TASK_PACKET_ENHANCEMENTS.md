# Task Packet — Product + UI/UX Enhancements

## Goal
Deliver world‑class product improvements and UX refinements across onboarding, collaboration, governance, evidence quality, and enterprise analytics.

## Scope
- Product additions: workflows, governance, evidence quality, collaboration, analytics.
- UI/UX improvements: clarity, feedback, discoverability, accessibility.
- Technical scope: new APIs, storage models, background jobs, and UI components.

## Assumptions
- API and UI are served from the same backend.
- Auth + RBAC are enforced via middleware.
- PostgreSQL is the primary source of truth.

---

## Phase 1 — Foundation (2–3 weeks)
### P1. First‑analysis wizard (60‑second setup)
**Outcome**: New users can configure agents, context, evidence strength, and output format quickly.
- Add UI wizard with 3–4 steps.
- Persist config in session or local storage.
- Wire wizard output to `mode`, `settings`, and report format.
- Add telemetry for completion rate.

**Acceptance**
- New user reaches runnable analysis within 60 seconds.
- Wizard outputs are applied to the analysis payload.

### P2. Workspace context indicator (top nav)
**Outcome**: Always visible workspace context.
- Add a small context pill (workspace name + switcher).
- In Expert mode, show active workspace.

**Acceptance**
- Expert mode shows workspace name; switcher is available.

### P3. Inline auth/entitlement error CTAs
**Outcome**: Clear user remediation.
- Add inline error blocks with CTA (Login / Join workspace / Upgrade).
- Map entitlement errors to user‑friendly messages.

**Acceptance**
- Auth/entitlement failures show CTAs, not silent failure.

---

## Phase 2 — Evidence & Governance (3–5 weeks)
### P4. Evidence strength scoring per claim
**Outcome**: Trust levels are explicit.
- Extend claim model with `strength_score` and `strength_reason`.
- Update analysis pipeline to score evidence.
- Display strength in UI with badges.

### P5. Quality gates before export
**Outcome**: Prevent weak exports.
- Add validation checks: missing citations, weak evidence, unresolved questions.
- Block export or warn user with override.

### P6. Decision log tied to debates/exports
**Outcome**: Long‑term traceability.
- Add Decision Log entity with references to session/report.
- Log consensus and key decisions.
- Display log in session view.

---

## Phase 3 — Templates & Scenarios (3–4 weeks)
### P7. Scenario library
**Outcome**: Curated templates by industry.
- Create scenario presets (industry, goal, agent set, evidence config).
- UI search + filter.
- Allow one‑click launch.

### P8. Template discovery UX
**Outcome**: Faster template discovery.
- Search, filter, recommended templates.
- Add metadata (industry, difficulty, evidence level).

---

## Phase 4 — Collaboration & Sharing (4–6 weeks)
### P9. Workspace knowledge base
**Outcome**: Shared knowledge with versioning.
- Document store with version history.
- Citation integration across sessions.
- Access controlled by workspace roles.

### P10. Granular sharing controls
**Outcome**: Enterprise‑grade sharing.
- Expiring links, view‑only, watermarking.
- Audit log entries for share events.

---

## Phase 5 — Analytics & Benchmarking (5–7 weeks)
### P11. Benchmarking mode
**Outcome**: Compare outputs over time/models.
- Allow side‑by‑side runs with multiple model configs.
- Store results with metadata (provider, version).

### P12. Org analytics dashboard
**Outcome**: Adoption and ROI metrics.
- Metrics: active users, sessions, outcomes, exports, time saved.
- Role‑gated dashboard.

---

## UI/UX Improvements (Cross‑Phase)
### U1. Mode‑specific onboarding cards
- Simple/Guided/Expert quick tips and next steps.

### U2. Progress state during debates
- Step indicator, ETA, partial results.

### U3. Global error surface with retry
- Expand existing global error to include retry CTAs.

### U4. Report export flow improvements
- Show export status, file size, preview.

### U5. Session history UX
- Richer metadata (mode, agents, evidence strength, timestamps).

### U6. AI failure states
- Show provider outage banners and fallback options.

### U7. Accessibility improvements
- Contrast, focus rings, keyboard navigation in key flows.

---

## Implementation Tickets (Ordered)
1. First‑analysis wizard UI + payload wiring.
2. Workspace context indicator + switcher.
3. Inline entitlement/auth CTAs.
4. Evidence strength scoring (schema + pipeline).
5. Quality gates pre‑export.
6. Decision log entity + UI.
7. Scenario library presets + search.
8. Template discovery UX update.
9. Knowledge base with versioned docs.
10. Granular sharing (expiring links + watermark).
11. Benchmarking mode + storage schema.
12. Org analytics dashboard + metrics pipeline.
13. Mode‑specific onboarding cards.
14. Debate progress state (step/ETA/partial).
15. Global error retry improvements.
16. Report export UX updates.
17. Session history metadata enrichment.
18. AI failure state banners and fallback.
19. Accessibility pass across top flows.

---

## Deliverables
- New product features shipped with tests.
- Updated docs for new workflows and APIs.
- UX improvements applied across core flows.
- Telemetry added for adoption and success metrics.
