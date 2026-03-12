# API Docs (Overview)

Base URL:
- `http://localhost:5000` (default)
- Most endpoints are under `/api`

Auth:
- Session cookie is used for authenticated routes.
- Demo login: `POST /api/demo-login` (username `demo`, password `demo123`).
- User info: `GET /api/auth/user`

## Health and Ops
- `GET /health`
- `GET /api/health`
- `GET /ops/health`
- `GET /ops/ready`
- `GET /ops/live`
- `GET /ops/metrics`
- `POST /ops/echo`

## User and Preferences
- `GET /api/auth/user`
- `GET /api/user/profile`
- `PATCH /api/user/preferences`
- `GET /api/user/onboarding-progress`
- `PATCH /api/user/onboarding-progress`

## Workspaces
- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/workspaces/:id`
- `POST /api/workspaces/join`
- `GET /api/workspaces/:id/members`

## Sessions and Collaboration
- `GET /api/sessions`
- `GET /api/sessions/transferable`
- `GET /api/sessions/:id/transfer`
- `GET /api/sessions/:id`
- `POST /api/sessions/generate-code`
- `POST /api/sessions/join/:code`
- `GET /api/sessions/code/:code/participants`
- `GET /api/sessions/code/:code/chat`
- `POST /api/sessions/code/:code/chat`

## Organizations and Teams
- `GET /api/organizations`
- `POST /api/organizations`
- `GET /api/organizations/:id`
- `PUT /api/organizations/:id`
- `GET /api/organizations/:id/members`
- `POST /api/organizations/:id/members`
- `GET /api/organizations/:id/teams`
- `POST /api/organizations/:id/teams`

## Admin and Monitoring
- `GET /api/admin/users`
- `POST /api/admin/users/:id/role`
- `GET /api/audit-logs`
- `GET /api/security-events`
- `PATCH /api/security-events/:eventId/resolve`
- `GET /api/usage/analytics`
- `GET /api/usage/quotas/:organizationId`
- `GET /api/rate-limits/rules`
- `POST /api/rate-limits/rules`
- `PUT /api/rate-limits/rules/:ruleId`
- `GET /api/monitoring/performance`
- `GET /api/monitoring/errors`
- `GET /api/monitoring/metrics/realtime`
- `POST /api/monitoring/metrics/cleanup`

## Debate, Brainstorm, Reports
- `POST /api/think`
- `GET /api/think/stream` (SSE)
- `POST /api/brainstorm`
- `POST /api/brainstorm/followup`
- `POST /api/report`
- `GET /api/reports`
- `GET /api/reports/:id`
- `DELETE /api/reports/:id`
- `POST /api/factcheck/verify-claims`

## Billing and Stripe
- `GET /api/billing/plans`
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`
- `POST /api/stripe/create-subscription`
- `POST /api/stripe/change-subscription`
- `POST /api/stripe/cancel-subscription`
- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/proration-preview`
- `GET /api/stripe/portal`
- `POST /api/stripe/webhook`
- `POST /api/billing/proration/preview`
- `POST /api/billing/dunning/simulate`
- `GET /api/billing/portal`

## Templates and Marketplace
- `GET /api/marketplace/templates`
- `POST /api/marketplace/purchase`
- `GET /api/templates`
- `GET /api/templates/:id`
- `POST /api/templates`
- `PATCH /api/templates/:id`
- `POST /api/templates/:id/use`
- `DELETE /api/templates/:id`
- `POST /api/templates/:id/publish`
- `POST /api/templates/:id/unpublish`
- `GET /api/templates/status/:status`
- `GET /api/templates/:id/versions`
- `POST /api/templates/:id/versions`

## Automation and Workflows
- `POST /api/automation/time-logs/start`
- `POST /api/automation/time-logs/:id/stop`
- `GET /api/automation/time-logs/billable`
- `POST /api/automation/invoices/generate`
- `GET /api/automation/invoices`
- `POST /api/automation/notifications`
- `GET /api/automation/notifications`
- `POST /api/automation/notifications/:id/read`
- `POST /api/automation/notification-rules`
- `POST /api/automation/workflow-templates`
- `GET /api/automation/workflow-templates`
- `POST /api/automation/workflows/execute`
- `GET /api/automation/workflow-instances`
- `POST /api/automation/check-rules`
- `POST /api/workflows`
- `GET /api/workflows`
- `GET /api/workflows/:id`
- `PUT /api/workflows/:id`
- `DELETE /api/workflows/:id`
- `POST /api/workflows/:id/trigger`
- `GET /api/workflows/executions`
- `GET /api/workflows/executions/:id`
- `POST /api/workflows/webhook/:workflowId`

## Workspace Sync
- `GET /api/workspace/:workspaceId/events`
- `POST /api/workspace/:workspaceId/broadcast`
- `GET /api/workspace/:workspaceId/connections`
- `GET /api/workspace/:workspaceId/events/history`
- `GET /api/workspace/sync/health`

## Reviews and Approvals
- `GET /api/reviews`
- `GET /api/reviews/:id`
- `GET /api/reviews/:id/steps`
- `GET /api/reviews/:id/comments`
- `POST /api/reviews/:id/approve`
- `POST /api/reviews/:id/reject`
- `POST /api/reviews/:id/comments`

## Export
- `POST /api/export`
- `GET /api/export/logs`

## Integrations
- `POST /api/slack/notify`
- `POST /api/slack/test`
- `POST /api/jira/create-ticket`
- `POST /api/jira/test`
- `GET /api/jira/issue-types/:projectKey`

## Webhooks and Push
- `POST /api/webhooks/test`
- `POST /api/push/subscribe`
- `DELETE /api/push/unsubscribe`
- `POST /api/push/test`
- `GET /api/push/subscriptions`
- `GET /api/push/vapid-public-key`

## Documentation, Tutorials, and Playbooks
- `GET /api/tutorials`
- `GET /api/tutorials/all`
- `GET /api/tutorials/category/:category`
- `GET /api/tutorials/:id`
- `POST /api/tutorials`
- `PUT /api/tutorials/:id`
- `DELETE /api/tutorials/:id`
- `GET /api/tutorials/:tutorialId/steps`
- `POST /api/tutorials/:tutorialId/steps`
- `PUT /api/tutorials/:tutorialId/steps/:stepId`
- `DELETE /api/tutorials/:tutorialId/steps/:stepId`
- `GET /api/tutorials/progress/my`
- `GET /api/tutorials/:tutorialId/progress`
- `POST /api/tutorials/:tutorialId/start`
- `POST /api/tutorials/:tutorialId/complete-step`
- `POST /api/tutorials/:tutorialId/complete`
- `POST /api/tutorials/:tutorialId/skip`
- `GET /api/tutorials/settings/my`
- `PUT /api/tutorials/settings/my`
- `POST /api/tutorials/settings/reset`
- `GET /api/tutorials/recommendations`

## Sprint 12 GA Routes
- `GET /api/docs/index`
- `GET /api/docs/article/:id`
- `GET /api/docs/slug/:slug`
- `GET /api/docs/search`
- `POST /api/docs/create`
- `PUT /api/docs/:id`
- `GET /api/admin/settings`
- `GET /api/admin/settings/:key`
- `POST /api/admin/settings`
- `PUT /api/admin/settings/:key`
- `DELETE /api/admin/settings/:key`
- `GET /api/marketplace/catalog`
- `GET /api/marketplace/item/:id`
- `GET /api/marketplace/search`
- `POST /api/marketplace/publish`
- `PUT /api/marketplace/item/:id`
- `GET /api/pricing/packages`
- `GET /api/pricing/plans/:plan`
- `POST /api/pricing/configure`
- `GET /api/changelog/list`
- `GET /api/changelog/:version`
- `POST /api/changelog/add`
- `PUT /api/changelog/:id/publish`
- `GET /api/playbooks/onboarding`
- `GET /api/playbooks/success/:role`
- `GET /api/playbooks/catalog`
- `GET /api/playbooks/:id`
- `POST /api/playbooks/create`

## SCIM
- `GET /scim/Users`
- `POST /scim/Users`
- `PATCH /scim/Users/:id`
- `DELETE /scim/Users/:id`
- `GET /scim/Groups`
- `POST /scim/Groups`
- `PATCH /scim/Groups/:id`
- `GET /scim/Groups/:id`
- `DELETE /scim/Groups/:id`

## Notes
- Many routes require authentication and specific permissions.
- Refer to `server/routes.ts` and `server/routes/*.ts` for request/response schemas.
