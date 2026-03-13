# SymbiosoAI ThinkTank — Product Overview

## Summary
SymbiosoAI ThinkTank is an enterprise collaborative intelligence platform for multi‑agent analysis, structured debate, and decision support. It helps teams turn complex questions into evidence‑based outputs with clear consensus, dissenting views, and unresolved questions, while maintaining traceability and governance.

## Core Capabilities
- Multi‑agent analysis and debate with role‑based perspectives.
- Simple, Guided, and Expert workflows for different user maturity levels.
- Streaming responses with progressive results and status updates.
- Report generation with citations and export formats.
- Template library and playbooks to accelerate repeatable work.
- Workspaces, collaboration, and RBAC for team usage.
- Enterprise governance: audit logs, retention policies, and admin controls.

## Primary Use Cases
- Executive decision briefs and policy analysis.
- Cross‑functional risk reviews and compliance checks.
- Competitive analysis and market synthesis.
- Research synthesis and structured evidence gathering.
- Product strategy debates and scenario planning.

## How It Works (High Level)
1. User selects a mode (Simple/Guided/Expert) and provides a prompt plus optional context or documents.
2. The system configures a multi‑agent panel based on mode and settings.
3. Agents generate structured debate outputs and metadata.
4. Outputs are synthesized into consensus, dissent, unresolved questions, and citations.
5. Results can be exported, shared, and archived in workspaces with audit trails.

## Architecture Overview
- Frontend: React + TypeScript UI with mode‑specific flows and streaming UI.
- Backend: Express API with modular routes, RBAC, and entitlements.
- Data: PostgreSQL + Drizzle ORM for users, sessions, reports, templates, and audit logs.
- Integrations: Stripe billing, Slack/Jira webhooks, optional Redis queues.
- AI: Multi‑agent orchestration with configurable providers and verification services.

## Differentiators
- Multi‑agent debate structure vs. single model outputs.
- Consensus + dissent visibility instead of a single answer.
- Governance features (audit logs, retention, admin controls) built in.
- Mode‑based UX for novice through expert workflows.

## Current Limitations
- Expert mode requires workspace context and proper entitlements.
- External integrations (Stripe/Slack/Jira) require explicit configuration.
- Advanced features depend on environment variables and provider keys.

## Roadmap Pointer
See `docs/ROADMAP.md` for phased enhancements and effort estimates.
