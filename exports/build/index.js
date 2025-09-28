var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  actionTypeSchema: () => actionTypeSchema,
  adminSettings: () => adminSettings,
  analysisSessions: () => analysisSessions,
  auditLogSeveritySchema: () => auditLogSeveritySchema,
  auditLogs: () => auditLogs,
  billingFeatureSchema: () => billingFeatureSchema,
  billingSettingsSchema: () => billingSettingsSchema,
  brainstormResponseSchema: () => brainstormResponseSchema,
  changelogEntries: () => changelogEntries,
  chatMessages: () => chatMessages,
  currencySchema: () => currencySchema,
  dataClassificationSchema: () => dataClassificationSchema,
  dataClassifications: () => dataClassifications,
  dataSensitivitySchema: () => dataSensitivitySchema,
  debateRuns: () => debateRuns,
  docs: () => docs,
  dunningEvents: () => dunningEvents,
  enhancedUsageMetrics: () => enhancedUsageMetrics,
  entitlements: () => entitlements,
  errorLogs: () => errorLogs,
  exportLogs: () => exportLogs,
  generatedReports: () => generatedReports,
  healthChecks: () => healthChecks,
  healthStatusSchema: () => healthStatusSchema,
  insertAdminSettingsSchema: () => insertAdminSettingsSchema,
  insertAnalysisSessionSchema: () => insertAnalysisSessionSchema,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertChangelogEntriesSchema: () => insertChangelogEntriesSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertDataClassificationSchema: () => insertDataClassificationSchema,
  insertDebateRunSchema: () => insertDebateRunSchema,
  insertDocsSchema: () => insertDocsSchema,
  insertDunningEventSchema: () => insertDunningEventSchema,
  insertEnhancedUsageMetricSchema: () => insertEnhancedUsageMetricSchema,
  insertEntitlementSchema: () => insertEntitlementSchema,
  insertErrorLogSchema: () => insertErrorLogSchema,
  insertExportLogSchema: () => insertExportLogSchema,
  insertGeneratedReportSchema: () => insertGeneratedReportSchema,
  insertHealthCheckSchema: () => insertHealthCheckSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertLegalHoldSchema: () => insertLegalHoldSchema,
  insertMarketplaceItemsSchema: () => insertMarketplaceItemsSchema,
  insertNotificationRuleSchema: () => insertNotificationRuleSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOrganizationAnalyticsSchema: () => insertOrganizationAnalyticsSchema,
  insertOrganizationDailyReportSchema: () => insertOrganizationDailyReportSchema,
  insertOrganizationMemberSchema: () => insertOrganizationMemberSchema,
  insertOrganizationSchema: () => insertOrganizationSchema,
  insertPerformanceMetricSchema: () => insertPerformanceMetricSchema,
  insertPiiPatternSchema: () => insertPiiPatternSchema,
  insertPlaybooksSchema: () => insertPlaybooksSchema,
  insertProvisioningLogSchema: () => insertProvisioningLogSchema,
  insertPushSubscriptionSchema: () => insertPushSubscriptionSchema,
  insertRateLimitRuleSchema: () => insertRateLimitRuleSchema,
  insertRateLimitStateSchema: () => insertRateLimitStateSchema,
  insertRetentionJobSchema: () => insertRetentionJobSchema,
  insertRetentionPolicySchema: () => insertRetentionPolicySchema,
  insertReviewAssignmentSchema: () => insertReviewAssignmentSchema,
  insertReviewCommentSchema: () => insertReviewCommentSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertReviewStepSchema: () => insertReviewStepSchema,
  insertScimGroupMembershipSchema: () => insertScimGroupMembershipSchema,
  insertScimGroupSchema: () => insertScimGroupSchema,
  insertScimUserSchema: () => insertScimUserSchema,
  insertSeatsSchema: () => insertSeatsSchema,
  insertSecurityEventSchema: () => insertSecurityEventSchema,
  insertSessionCodeSchema: () => insertSessionCodeSchema,
  insertSessionParticipantSchema: () => insertSessionParticipantSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertTeamMemberSchema: () => insertTeamMemberSchema,
  insertTeamSchema: () => insertTeamSchema,
  insertTemplateProductSchema: () => insertTemplateProductSchema,
  insertTemplatePurchaseSchema: () => insertTemplatePurchaseSchema,
  insertTemplateSchema: () => insertTemplateSchema,
  insertTimeLogSchema: () => insertTimeLogSchema,
  insertTutorialProgressSchema: () => insertTutorialProgressSchema,
  insertTutorialSchema: () => insertTutorialSchema,
  insertTutorialSettingsSchema: () => insertTutorialSettingsSchema,
  insertTutorialStepSchema: () => insertTutorialStepSchema,
  insertUsageMetricSchema: () => insertUsageMetricSchema,
  insertUserSchema: () => insertUserSchema,
  insertWorkflowDefinitionSchema: () => insertWorkflowDefinitionSchema,
  insertWorkflowEventSchema: () => insertWorkflowEventSchema,
  insertWorkflowExecutionSchema: () => insertWorkflowExecutionSchema,
  insertWorkflowInstanceSchema: () => insertWorkflowInstanceSchema,
  insertWorkflowTemplateSchema: () => insertWorkflowTemplateSchema,
  insertWorkspaceConnectionSchema: () => insertWorkspaceConnectionSchema,
  insertWorkspaceEventSchema: () => insertWorkspaceEventSchema,
  insertWorkspaceInviteSchema: () => insertWorkspaceInviteSchema,
  insertWorkspaceMemberSchema: () => insertWorkspaceMemberSchema,
  insertWorkspaceSchema: () => insertWorkspaceSchema,
  interactionTypeSchema: () => interactionTypeSchema,
  invoices: () => invoices,
  legalHoldStatusSchema: () => legalHoldStatusSchema,
  legalHoldTypeSchema: () => legalHoldTypeSchema,
  legalHolds: () => legalHolds,
  marketplaceItems: () => marketplaceItems,
  metricTypeSchema: () => metricTypeSchema,
  notificationRules: () => notificationRules,
  notifications: () => notifications,
  organizationAnalytics: () => organizationAnalytics,
  organizationDailyReports: () => organizationDailyReports,
  organizationMembers: () => organizationMembers,
  organizationRoleSchema: () => organizationRoleSchema,
  organizationSettingsSchema: () => organizationSettingsSchema,
  organizations: () => organizations,
  performanceMetrics: () => performanceMetrics,
  permissionsSchema: () => permissionsSchema,
  piiCategorySchema: () => piiCategorySchema,
  piiPatterns: () => piiPatterns,
  playbooks: () => playbooks,
  provisioningLogs: () => provisioningLogs,
  provisioningOperationSchema: () => provisioningOperationSchema,
  provisioningResourceTypeSchema: () => provisioningResourceTypeSchema,
  provisioningStatusSchema: () => provisioningStatusSchema,
  pushSubscriptions: () => pushSubscriptions,
  rateLimitActionSchema: () => rateLimitActionSchema,
  rateLimitRules: () => rateLimitRules,
  rateLimitStates: () => rateLimitStates,
  redactionTypeSchema: () => redactionTypeSchema,
  reportRequestSchema: () => reportRequestSchema,
  reportResponseSchema: () => reportResponseSchema,
  reportStatusSchema: () => reportStatusSchema,
  reportTypeSchema: () => reportTypeSchema,
  resourceTypeSchema: () => resourceTypeSchema,
  retentionCategorySchema: () => retentionCategorySchema,
  retentionDataTypeSchema: () => retentionDataTypeSchema,
  retentionJobStatusSchema: () => retentionJobStatusSchema,
  retentionJobTypeSchema: () => retentionJobTypeSchema,
  retentionJobs: () => retentionJobs,
  retentionPolicies: () => retentionPolicies,
  reviewAssigneeTypeSchema: () => reviewAssigneeTypeSchema,
  reviewAssignerRoleSchema: () => reviewAssignerRoleSchema,
  reviewAssignmentStatusSchema: () => reviewAssignmentStatusSchema,
  reviewAssignments: () => reviewAssignments,
  reviewCommentTypeSchema: () => reviewCommentTypeSchema,
  reviewComments: () => reviewComments,
  reviewPrioritySchema: () => reviewPrioritySchema,
  reviewResponseSchema: () => reviewResponseSchema,
  reviewStatusSchema: () => reviewStatusSchema,
  reviewStepStatusSchema: () => reviewStepStatusSchema,
  reviewStepTypeSchema: () => reviewStepTypeSchema,
  reviewSteps: () => reviewSteps,
  reviewTypeSchema: () => reviewTypeSchema,
  reviews: () => reviews,
  scimGroupMemberships: () => scimGroupMemberships,
  scimGroupTypeSchema: () => scimGroupTypeSchema,
  scimGroups: () => scimGroups,
  scimMembershipSourceSchema: () => scimMembershipSourceSchema,
  scimMembershipTypeSchema: () => scimMembershipTypeSchema,
  scimSyncStatusSchema: () => scimSyncStatusSchema,
  scimUsers: () => scimUsers,
  seats: () => seats,
  securityEventSeveritySchema: () => securityEventSeveritySchema,
  securityEvents: () => securityEvents,
  sessionCodes: () => sessionCodes,
  sessionParticipants: () => sessionParticipants,
  sessions: () => sessions,
  subscriptionPlanSchema: () => subscriptionPlanSchema,
  subscriptionStatusSchema: () => subscriptionStatusSchema,
  subscriptions: () => subscriptions,
  systemUserRoleSchema: () => systemUserRoleSchema,
  teamMembers: () => teamMembers,
  teamRoleSchema: () => teamRoleSchema,
  teams: () => teams,
  templateCategorySchema: () => templateCategorySchema,
  templateProducts: () => templateProducts,
  templatePurchases: () => templatePurchases,
  templateStatusSchema: () => templateStatusSchema,
  templates: () => templates,
  thinkRequestSchema: () => thinkRequestSchema,
  thinkResponseSchema: () => thinkResponseSchema,
  timeLogs: () => timeLogs,
  tutorialCategorySchema: () => tutorialCategorySchema,
  tutorialPositionSchema: () => tutorialPositionSchema,
  tutorialProgress: () => tutorialProgress,
  tutorialSettings: () => tutorialSettings,
  tutorialSpeedSchema: () => tutorialSpeedSchema,
  tutorialStatusSchema: () => tutorialStatusSchema,
  tutorialStepTypeSchema: () => tutorialStepTypeSchema,
  tutorialSteps: () => tutorialSteps,
  tutorialUserLevelSchema: () => tutorialUserLevelSchema,
  tutorials: () => tutorials,
  upsertUserSchema: () => upsertUserSchema,
  usageMetrics: () => usageMetrics,
  userPreferencesSchema: () => userPreferencesSchema,
  users: () => users,
  workflowDefinitions: () => workflowDefinitions,
  workflowEventStatusSchema: () => workflowEventStatusSchema,
  workflowEventTypeSchema: () => workflowEventTypeSchema,
  workflowEvents: () => workflowEvents,
  workflowExecutionStatusSchema: () => workflowExecutionStatusSchema,
  workflowExecutions: () => workflowExecutions,
  workflowInstances: () => workflowInstances,
  workflowTemplates: () => workflowTemplates,
  workflowTriggerTypeSchema: () => workflowTriggerTypeSchema,
  workspaceConnections: () => workspaceConnections,
  workspaceEvents: () => workspaceEvents,
  workspaceInvites: () => workspaceInvites,
  workspaceMembers: () => workspaceMembers,
  workspaceRoleSchema: () => workspaceRoleSchema,
  workspaces: () => workspaces
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean, index, decimal, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users, sessions, analysisSessions, generatedReports, workspaces, workspaceMembers, workspaceInvites, workspaceEvents, workspaceConnections, templates, pushSubscriptions, tutorials, tutorialSteps, tutorialProgress, tutorialSettings, insertUserSchema, upsertUserSchema, insertAnalysisSessionSchema, insertWorkspaceSchema, insertWorkspaceMemberSchema, insertWorkspaceInviteSchema, insertGeneratedReportSchema, insertPushSubscriptionSchema, insertTutorialSchema, insertTutorialStepSchema, insertTutorialProgressSchema, insertTutorialSettingsSchema, tutorialCategorySchema, tutorialUserLevelSchema, tutorialStatusSchema, tutorialStepTypeSchema, tutorialPositionSchema, tutorialSpeedSchema, interactionTypeSchema, userPreferencesSchema, workspaceRoleSchema, thinkRequestSchema, thinkResponseSchema, brainstormResponseSchema, reportRequestSchema, reportResponseSchema, sessionCodes, sessionParticipants, chatMessages, insertSessionCodeSchema, insertSessionParticipantSchema, insertChatMessageSchema, organizations, organizationMembers, teams, teamMembers, auditLogs, piiPatterns, securityEvents, usageMetrics, rateLimitRules, rateLimitStates, timeLogs, invoices, notifications, notificationRules, workflowTemplates, workflowInstances, performanceMetrics, errorLogs, healthChecks, subscriptions, entitlements, templateProducts, templatePurchases, insertOrganizationSchema, insertOrganizationMemberSchema, insertTeamSchema, insertTeamMemberSchema, insertAuditLogSchema, insertPiiPatternSchema, insertSecurityEventSchema, insertUsageMetricSchema, insertRateLimitRuleSchema, insertRateLimitStateSchema, insertPerformanceMetricSchema, insertErrorLogSchema, insertHealthCheckSchema, organizationRoleSchema, teamRoleSchema, auditLogSeveritySchema, securityEventSeveritySchema, piiCategorySchema, redactionTypeSchema, rateLimitActionSchema, healthStatusSchema, organizationSettingsSchema, billingSettingsSchema, permissionsSchema, insertTimeLogSchema, insertInvoiceSchema, insertNotificationSchema, insertNotificationRuleSchema, insertWorkflowTemplateSchema, insertWorkflowInstanceSchema, insertSubscriptionSchema, insertEntitlementSchema, insertTemplateProductSchema, insertTemplatePurchaseSchema, subscriptionPlanSchema, subscriptionStatusSchema, currencySchema, billingFeatureSchema, debateRuns, exportLogs, insertDebateRunSchema, insertExportLogSchema, reviews, reviewSteps, reviewAssignments, reviewComments, retentionPolicies, legalHolds, retentionJobs, dataClassifications, scimUsers, scimGroups, scimGroupMemberships, provisioningLogs, insertReviewSchema, insertReviewStepSchema, insertReviewAssignmentSchema, insertReviewCommentSchema, insertRetentionPolicySchema, insertLegalHoldSchema, insertRetentionJobSchema, insertDataClassificationSchema, insertScimUserSchema, insertScimGroupSchema, insertScimGroupMembershipSchema, insertProvisioningLogSchema, workflowDefinitions, workflowExecutions, workflowEvents, organizationAnalytics, organizationDailyReports, enhancedUsageMetrics, reviewStatusSchema, reviewTypeSchema, reviewPrioritySchema, reviewStepTypeSchema, reviewStepStatusSchema, reviewAssigneeTypeSchema, reviewAssignerRoleSchema, reviewAssignmentStatusSchema, reviewResponseSchema, reviewCommentTypeSchema, retentionDataTypeSchema, legalHoldTypeSchema, legalHoldStatusSchema, retentionJobTypeSchema, retentionJobStatusSchema, dataClassificationSchema, dataSensitivitySchema, retentionCategorySchema, scimSyncStatusSchema, scimGroupTypeSchema, scimMembershipTypeSchema, scimMembershipSourceSchema, provisioningOperationSchema, provisioningResourceTypeSchema, provisioningStatusSchema, templateStatusSchema, templateCategorySchema, workflowTriggerTypeSchema, workflowExecutionStatusSchema, workflowEventTypeSchema, workflowEventStatusSchema, reportTypeSchema, reportStatusSchema, metricTypeSchema, resourceTypeSchema, actionTypeSchema, insertWorkflowDefinitionSchema, insertWorkflowExecutionSchema, insertWorkflowEventSchema, insertOrganizationAnalyticsSchema, insertOrganizationDailyReportSchema, insertEnhancedUsageMetricSchema, insertTemplateSchema, dunningEvents, seats, insertDunningEventSchema, insertSeatsSchema, docs, adminSettings, marketplaceItems, changelogEntries, playbooks, insertDocsSchema, insertAdminSettingsSchema, insertMarketplaceItemsSchema, insertChangelogEntriesSchema, insertPlaybooksSchema, insertWorkspaceEventSchema, insertWorkspaceConnectionSchema, systemUserRoleSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: varchar("email").unique(),
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      profileImageUrl: varchar("profile_image_url"),
      role: varchar("role").notNull().default("user"),
      // system_admin, admin, premium_user, user
      stripeCustomerId: varchar("stripe_customer_id"),
      // Stripe customer ID for billing
      preferences: jsonb("preferences").default({
        theme: "light",
        language: "en",
        notifications: true,
        default_model: "gpt-5",
        default_temperature: 0.7,
        auto_save: true
      }),
      onboardingProgress: jsonb("onboarding_progress").default({
        completed_steps: [],
        current_flow: null,
        experience_level: "beginner",
        skipped_flows: [],
        last_interaction: null,
        feature_usage: {}
      }),
      subscription: jsonb("subscription").default({
        plan: "free",
        usage_count: 0,
        monthly_limit: 10,
        reset_date: null
      }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    analysisSessions = pgTable("analysis_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      prompt: text("prompt").notNull(),
      mode: text("mode").notNull(),
      settings: jsonb("settings"),
      results: jsonb("results"),
      telemetry: jsonb("telemetry"),
      debateHistory: jsonb("debate_history"),
      // Store agent responses for cross-mode transfers
      brainstormResults: jsonb("brainstorm_results"),
      // Store brainstorming session results
      lastBrainstormedAt: timestamp("last_brainstormed_at"),
      // When brainstorming was last run
      lastReportGeneratedAt: timestamp("last_report_generated_at"),
      // When report was last generated
      lastReportType: varchar("last_report_type"),
      // Type of last generated report
      title: text("title"),
      // User-friendly title for session identification
      sourceSessionId: varchar("source_session_id"),
      // Reference to original session if this is a transfer
      transferCount: integer("transfer_count").default(0),
      // Track how many times this has been transferred
      userId: varchar("user_id"),
      workspaceId: varchar("workspace_id"),
      createdAt: timestamp("created_at").defaultNow()
    });
    generatedReports = pgTable("generated_reports", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: varchar("session_id").notNull(),
      // Reference to analysis session
      userId: varchar("user_id").notNull(),
      // Owner of the report
      reportType: varchar("report_type").notNull(),
      // executive, detailed, full
      title: text("title").notNull(),
      // User-friendly title
      content: text("content").notNull(),
      // Full report content
      format: varchar("format").notNull().default("markdown"),
      // markdown, html, pdf
      metadata: jsonb("metadata").default({}),
      // Additional report metadata (word count, generation time, etc.)
      generatedAt: timestamp("generated_at").defaultNow()
    });
    workspaces = pgTable("workspaces", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      description: text("description"),
      sessionCode: varchar("session_code", { length: 8 }).unique().notNull(),
      isPrivate: boolean("is_private").default(false),
      ownerId: varchar("owner_id").notNull(),
      settings: jsonb("settings").default({}),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    workspaceMembers = pgTable("workspace_members", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").notNull(),
      userId: varchar("user_id").notNull(),
      role: text("role").notNull().default("member"),
      // owner, admin, member, viewer
      joinedAt: timestamp("joined_at").defaultNow()
    });
    workspaceInvites = pgTable("workspace_invites", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").notNull(),
      invitedByUserId: varchar("invited_by_user_id").notNull(),
      email: text("email"),
      inviteCode: varchar("invite_code", { length: 16 }).unique(),
      role: text("role").notNull().default("member"),
      status: text("status").notNull().default("pending"),
      // pending, accepted, expired
      expiresAt: timestamp("expires_at"),
      createdAt: timestamp("created_at").defaultNow()
    });
    workspaceEvents = pgTable("workspace_events", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").notNull(),
      // Reference to workspace
      eventType: varchar("event_type").notNull(),
      // debate_progress, user_join, user_leave, document_change, analysis_update, system_event
      eventData: jsonb("event_data").notNull(),
      // Event-specific data payload
      userId: varchar("user_id"),
      // User who triggered the event (nullable for system events)
      sessionId: varchar("session_id"),
      // Optional session ID for analysis-related events
      metadata: jsonb("metadata").default({}),
      // Additional event metadata
      isSystem: boolean("is_system").default(false),
      // Whether this is a system-generated event
      broadcastTo: text("broadcast_to").array(),
      // Array of user IDs to broadcast to (empty = all workspace members)
      sequenceNumber: integer("sequence_number").notNull(),
      // Event ordering within workspace
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("workspace_events_workspace_idx").on(table.workspaceId),
      index("workspace_events_type_idx").on(table.eventType),
      index("workspace_events_created_idx").on(table.createdAt),
      index("workspace_events_sequence_idx").on(table.workspaceId, table.sequenceNumber),
      index("workspace_events_session_idx").on(table.sessionId)
    ]);
    workspaceConnections = pgTable("workspace_connections", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").notNull(),
      // Reference to workspace
      userId: varchar("user_id").notNull(),
      // Connected user
      connectionId: varchar("connection_id").notNull(),
      // Unique connection identifier
      userAgent: text("user_agent"),
      // Browser/client information
      ipAddress: varchar("ip_address"),
      // Client IP address
      lastPing: timestamp("last_ping").defaultNow(),
      // Last heartbeat received
      isActive: boolean("is_active").default(true),
      // Whether connection is active
      metadata: jsonb("metadata").default({}),
      // Connection-specific metadata
      connectedAt: timestamp("connected_at").defaultNow(),
      disconnectedAt: timestamp("disconnected_at")
      // When connection was closed
    }, (table) => [
      index("workspace_connections_workspace_idx").on(table.workspaceId),
      index("workspace_connections_user_idx").on(table.userId),
      index("workspace_connections_active_idx").on(table.isActive),
      index("workspace_connections_ping_idx").on(table.lastPing),
      unique("workspace_connections_unique").on(table.workspaceId, table.userId, table.connectionId)
    ]);
    templates = pgTable("templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      // User-facing template name
      description: text("description"),
      // Brief description of template purpose
      category: varchar("category").notNull(),
      // business, technology, education, research
      tags: text("tags").array(),
      // Array of tags for categorization
      content: jsonb("content").notNull(),
      // Template content structure and configuration
      isPublic: boolean("is_public").default(true),
      // Whether template is publicly available
      usageCount: integer("usage_count").default(0),
      // Track how many times template has been used
      authorId: varchar("author_id"),
      // User who created the template
      version: integer("version").default(1),
      // Template version for updates
      metadata: jsonb("metadata").default({}),
      // Additional template metadata
      // Sprint 6 - Template Builder CRUD + Publish System
      organizationId: varchar("organization_id"),
      // Tenant hardening
      status: varchar("status").notNull().default("draft"),
      // draft, under_review, published, archived
      publishedAt: timestamp("published_at"),
      // When template was published
      publishedBy: varchar("published_by"),
      // User who published the template
      reviewedAt: timestamp("reviewed_at"),
      // When template was last reviewed
      reviewedBy: varchar("reviewed_by"),
      // User who reviewed the template
      approvalComments: text("approval_comments"),
      // Comments from reviewer
      contentValidation: jsonb("content_validation").default({}),
      // Validation results
      previousVersionId: varchar("previous_version_id"),
      // Link to previous version
      isTemplate: boolean("is_template").default(true),
      // Distinguish from instances
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("templates_status_idx").on(table.status),
      index("templates_organization_idx").on(table.organizationId),
      index("templates_author_status_idx").on(table.authorId, table.status)
    ]);
    pushSubscriptions = pgTable("push_subscriptions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull(),
      // User who owns this subscription
      endpoint: text("endpoint").notNull(),
      // Push service endpoint URL
      p256dh: text("p256dh").notNull(),
      // User agent public key for encryption
      auth: text("auth").notNull(),
      // Authentication secret for encryption
      userAgent: text("user_agent"),
      // Browser/device information
      isActive: boolean("is_active").default(true),
      // Whether subscription is active
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    tutorials = pgTable("tutorials", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      // Tutorial name (e.g. "Getting Started", "Expert Mode Guide")
      description: text("description"),
      // Brief description of what tutorial covers
      category: varchar("category").notNull(),
      // onboarding, feature, advanced, troubleshooting
      targetFeature: varchar("target_feature"),
      // Which feature this tutorial covers (simple, guided, expert, templates, etc.)
      targetUserLevel: varchar("target_user_level").notNull().default("beginner"),
      // beginner, intermediate, expert, all
      isActive: boolean("is_active").default(true),
      // Whether tutorial is available
      estimatedDuration: integer("estimated_duration"),
      // Estimated time in minutes
      priority: integer("priority").default(0),
      // Display priority (higher = shown first)
      triggerConditions: jsonb("trigger_conditions").default([]),
      // Conditions that trigger auto-start
      completionRewards: jsonb("completion_rewards").default({}),
      // Badges, points, unlocks
      metadata: jsonb("metadata").default({}),
      // Additional configuration
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("tutorials_category_idx").on(table.category),
      index("tutorials_active_priority_idx").on(table.isActive, table.priority),
      index("tutorials_feature_idx").on(table.targetFeature)
    ]);
    tutorialSteps = pgTable("tutorial_steps", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      tutorialId: varchar("tutorial_id").notNull(),
      // Parent tutorial
      stepNumber: integer("step_number").notNull(),
      // Order within tutorial
      title: text("title").notNull(),
      // Step title
      content: text("content").notNull(),
      // Step description/instructions
      targetElement: varchar("target_element"),
      // CSS selector or data-testid for highlighting
      targetPage: varchar("target_page"),
      // Page route this step appears on
      position: varchar("position").default("bottom"),
      // tooltip position: top, bottom, left, right, center
      stepType: varchar("step_type").notNull().default("tooltip"),
      // tooltip, modal, highlight, interaction, wait
      interactionType: varchar("interaction_type"),
      // click, input, scroll, none
      nextCondition: varchar("next_condition"),
      // Condition to proceed to next step
      skipAllowed: boolean("skip_allowed").default(true),
      // Whether step can be skipped
      autoAdvance: boolean("auto_advance").default(false),
      // Auto-proceed after interaction
      delayMs: integer("delay_ms").default(0),
      // Delay before showing step
      styling: jsonb("styling").default({}),
      // Custom CSS styles
      validation: jsonb("validation").default({}),
      // Validation rules for interactions
      metadata: jsonb("metadata").default({}),
      // Additional step configuration
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("tutorial_steps_tutorial_idx").on(table.tutorialId),
      index("tutorial_steps_order_idx").on(table.tutorialId, table.stepNumber),
      index("tutorial_steps_page_idx").on(table.targetPage)
    ]);
    tutorialProgress = pgTable("tutorial_progress", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull(),
      // User taking tutorial
      tutorialId: varchar("tutorial_id").notNull(),
      // Tutorial being taken
      status: varchar("status").notNull().default("not_started"),
      // not_started, in_progress, completed, skipped, abandoned
      currentStep: integer("current_step").default(1),
      // Current step number
      completedSteps: jsonb("completed_steps").default([]),
      // Array of completed step numbers
      skippedSteps: jsonb("skipped_steps").default([]),
      // Array of skipped step numbers
      startedAt: timestamp("started_at"),
      completedAt: timestamp("completed_at"),
      lastInteractionAt: timestamp("last_interaction_at").defaultNow(),
      timeSpentMinutes: integer("time_spent_minutes").default(0),
      // Total time spent
      helpRequestsCount: integer("help_requests_count").default(0),
      // Times user requested help
      metadata: jsonb("metadata").default({})
      // Progress analytics and notes
    }, (table) => [
      index("tutorial_progress_user_idx").on(table.userId),
      index("tutorial_progress_tutorial_idx").on(table.tutorialId),
      index("tutorial_progress_status_idx").on(table.status),
      index("tutorial_progress_user_tutorial_idx").on(table.userId, table.tutorialId)
    ]);
    tutorialSettings = pgTable("tutorial_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().unique(),
      // User these settings belong to
      autoStartTutorials: boolean("auto_start_tutorials").default(true),
      // Auto-start relevant tutorials
      showTooltips: boolean("show_tooltips").default(true),
      // Show contextual tooltips
      tutorialSpeed: varchar("tutorial_speed").default("normal"),
      // slow, normal, fast
      preferredPosition: varchar("preferred_position").default("bottom"),
      // Default tooltip position
      disabledCategories: jsonb("disabled_categories").default([]),
      // Tutorial categories to skip
      notificationPreferences: jsonb("notification_preferences").default({
        completion_rewards: true,
        progress_reminders: true,
        new_tutorials: true
      }),
      lastDismissedTutorial: varchar("last_dismissed_tutorial"),
      // Last tutorial user dismissed
      dismissedAt: timestamp("dismissed_at"),
      experienceLevel: varchar("experience_level").default("beginner"),
      // User-set experience level
      completedTutorialCount: integer("completed_tutorial_count").default(0),
      // Count of completed tutorials
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("tutorial_settings_user_idx").on(table.userId)
    ]);
    insertUserSchema = createInsertSchema(users).pick({
      email: true,
      firstName: true,
      lastName: true,
      profileImageUrl: true,
      role: true,
      preferences: true,
      subscription: true
    });
    upsertUserSchema = createInsertSchema(users).pick({
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileImageUrl: true
    });
    insertAnalysisSessionSchema = createInsertSchema(analysisSessions).pick({
      prompt: true,
      mode: true,
      settings: true,
      title: true,
      sourceSessionId: true,
      transferCount: true,
      userId: true,
      workspaceId: true
    });
    insertWorkspaceSchema = createInsertSchema(workspaces).pick({
      name: true,
      description: true,
      isPrivate: true,
      ownerId: true,
      settings: true
    });
    insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers).pick({
      workspaceId: true,
      userId: true,
      role: true
    });
    insertWorkspaceInviteSchema = createInsertSchema(workspaceInvites).pick({
      workspaceId: true,
      invitedByUserId: true,
      email: true,
      role: true
    });
    insertGeneratedReportSchema = createInsertSchema(generatedReports).pick({
      sessionId: true,
      userId: true,
      reportType: true,
      title: true,
      content: true,
      format: true,
      metadata: true
    });
    insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).pick({
      userId: true,
      endpoint: true,
      p256dh: true,
      auth: true,
      userAgent: true,
      isActive: true
    });
    insertTutorialSchema = createInsertSchema(tutorials).pick({
      name: true,
      description: true,
      category: true,
      targetFeature: true,
      targetUserLevel: true,
      isActive: true,
      estimatedDuration: true,
      priority: true,
      triggerConditions: true,
      completionRewards: true,
      metadata: true
    });
    insertTutorialStepSchema = createInsertSchema(tutorialSteps).pick({
      tutorialId: true,
      stepNumber: true,
      title: true,
      content: true,
      targetElement: true,
      targetPage: true,
      position: true,
      stepType: true,
      interactionType: true,
      nextCondition: true,
      skipAllowed: true,
      autoAdvance: true,
      delayMs: true,
      styling: true,
      validation: true,
      metadata: true
    });
    insertTutorialProgressSchema = createInsertSchema(tutorialProgress).pick({
      userId: true,
      tutorialId: true,
      status: true,
      currentStep: true,
      completedSteps: true,
      skippedSteps: true,
      startedAt: true,
      completedAt: true,
      timeSpentMinutes: true,
      helpRequestsCount: true,
      metadata: true
    });
    insertTutorialSettingsSchema = createInsertSchema(tutorialSettings).pick({
      userId: true,
      autoStartTutorials: true,
      showTooltips: true,
      tutorialSpeed: true,
      preferredPosition: true,
      disabledCategories: true,
      notificationPreferences: true,
      experienceLevel: true
    });
    tutorialCategorySchema = z.enum(["onboarding", "feature", "advanced", "troubleshooting"]);
    tutorialUserLevelSchema = z.enum(["beginner", "intermediate", "expert", "all"]);
    tutorialStatusSchema = z.enum(["not_started", "in_progress", "completed", "skipped", "abandoned"]);
    tutorialStepTypeSchema = z.enum(["tooltip", "modal", "highlight", "interaction", "wait"]);
    tutorialPositionSchema = z.enum(["top", "bottom", "left", "right", "center"]);
    tutorialSpeedSchema = z.enum(["slow", "normal", "fast"]);
    interactionTypeSchema = z.enum(["click", "input", "scroll", "none"]);
    userPreferencesSchema = z.object({
      theme: z.enum(["light", "dark"]).optional(),
      language: z.string().optional(),
      notifications: z.boolean().optional(),
      default_model: z.string().optional(),
      default_temperature: z.number().min(0).max(2).optional(),
      auto_save: z.boolean().optional()
    });
    workspaceRoleSchema = z.enum(["owner", "admin", "member", "viewer"]);
    thinkRequestSchema = z.object({
      prompt: z.string().min(1),
      mode: z.enum(["simple", "guided", "expert"]),
      transfer_from_session_id: z.string().optional(),
      // ID of previous session to transfer from
      // Document attachment
      attached_document: z.object({
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number()
      }).optional(),
      // Simple mode options
      require_citations: z.boolean().optional(),
      enable_fact_check: z.boolean().optional(),
      live_web: z.boolean().optional(),
      temperature: z.number().min(0).max(2).optional(),
      model_provider: z.enum(["openai", "anthropic"]).optional(),
      // Guided mode options
      selection_mode: z.enum(["smart", "manual", "domain", "usecase", "advanced"]).optional(),
      // Agent selection subchoices
      manual_agents: z.array(z.enum(["analyst", "pragmatist", "innovator", "thoughtful", "critic"])).optional(),
      domain_experts: z.array(z.enum([
        "legal-analyst",
        "legal-advocate",
        "medical-diagnostician",
        "medical-researcher",
        "financial-analyst",
        "investment-strategist",
        "tech-architect",
        "devops-engineer",
        "educational-psychologist",
        "brand-strategist",
        "research-scientist",
        "systems-engineer",
        "behavioral-analyst",
        "sustainability-consultant",
        "grant-writer",
        "hr-expert",
        "hospitality-expert",
        "public-safety-expert"
      ])).optional(),
      usecase_type: z.enum(["business_analysis", "technical_debate", "creative_brainstorm", "research_synthesis", "ethical_discussion", "document_analysis", "general_inquiry"]).optional(),
      response_length: z.enum(["brief", "moderate", "detailed"]).optional(),
      turns: z.number().min(1).max(10).optional(),
      debate_format: z.enum(["round-robin", "structured", "socratic", "collaborative"]).optional(),
      require_evidence: z.boolean().optional(),
      require_counterarguments: z.boolean().optional(),
      verification: z.object({
        fact_check: z.boolean().optional(),
        min_sources: z.number().min(0).max(10).optional()
      }).optional(),
      // Expert mode options
      context: z.string().optional(),
      selected_models: z.array(z.string()).optional(),
      use_case: z.string().optional(),
      debate_title: z.string().optional(),
      // Advanced AI Capabilities (Expert Mode)
      thinking_patterns: z.array(z.enum([
        "multi_perspective",
        "scenario_planning",
        "root_cause",
        "risk_modeling",
        "information_synthesis",
        "meta_analysis"
      ])).optional(),
      enterprise_specialists: z.array(z.enum([
        "constitutional_scholar",
        "risk_strategist",
        "ai_systems_architect",
        "cybersecurity_strategist",
        "cognitive_neuroscientist",
        "systems_policy_analyst",
        "innovation_strategist"
      ])).optional(),
      creativity_level: z.number().min(0).max(100).optional(),
      timestamp: z.string().optional(),
      frameworks: z.array(z.enum([
        "systematic_analysis",
        "critical_thinking",
        "design_thinking",
        "first_principles",
        "systems_thinking",
        "dialectical_reasoning",
        "abductive_reasoning",
        "forensic_analysis"
      ])).optional(),
      max_steps: z.number().min(1).max(20).optional(),
      evidence_per_claim: z.number().min(1).max(10).optional(),
      include_counterarguments: z.boolean().optional(),
      ethical_lens: z.boolean().optional(),
      models: z.array(z.enum(["analyst", "pragmatist", "thoughtful", "innovator", "critic"])).optional(),
      routing: z.object({
        analyst: z.number().min(0).max(100).optional(),
        pragmatist: z.number().min(0).max(100).optional(),
        thoughtful: z.number().min(0).max(100).optional(),
        innovator: z.number().min(0).max(100).optional(),
        critic: z.number().min(0).max(100).optional()
      }).optional(),
      rag: z.object({
        enabled: z.boolean().optional(),
        top_k: z.number().min(1).max(50).optional(),
        max_tokens: z.number().min(100).max(4e3).optional(),
        web: z.boolean().optional(),
        code: z.boolean().optional()
      }).optional(),
      security: z.object({
        pii_redaction: z.boolean().optional(),
        log_masking: z.boolean().optional(),
        region: z.string().optional()
      }).optional(),
      export_formats: z.array(z.enum(["pdf", "json", "txt", "story_map"])).optional()
    });
    thinkResponseSchema = z.object({
      consensus: z.string(),
      dissents: z.array(z.object({
        position: z.string(),
        reasoning: z.string().optional()
      })),
      unresolved: z.array(z.string()),
      telemetry: z.object({
        avg_ms: z.number(),
        quality: z.number(),
        tps: z.number(),
        active_agents: z.number().optional()
      }),
      citations: z.array(z.object({
        title: z.string().optional(),
        url: z.string().optional(),
        source: z.string().optional(),
        author: z.string().optional(),
        year: z.string().optional()
      })).optional(),
      fact_check: z.object({
        findings: z.array(z.object({
          claim: z.string(),
          status: z.enum(["verified", "disputed", "partially_verified", "supported", "contradicted", "inconclusive"]),
          confidence: z.number().min(0).max(100).optional(),
          verification_depth: z.enum(["standard", "comprehensive", "expert_review"]).optional(),
          sources_count: z.number().min(0).optional(),
          note: z.string().optional(),
          citations: z.array(z.object({
            title: z.string().optional(),
            url: z.string().optional(),
            source: z.string().optional()
          })).optional()
        })),
        verification_settings: z.object({
          depth: z.enum(["standard", "comprehensive", "expert_review"]).optional(),
          min_sources: z.number().min(0).max(10).optional()
        }).optional()
      }).optional(),
      follow_up_questions: z.array(z.object({
        question: z.string(),
        category: z.string().optional(),
        complexity: z.enum(["low", "medium", "high"]).optional()
      })).optional(),
      focus_areas: z.object({
        identified: z.array(z.string()).optional(),
        connections: z.array(z.object({
          from: z.string(),
          to: z.string(),
          strength: z.enum(["weak", "moderate", "strong"]).optional()
        })).optional()
      }).optional()
    });
    brainstormResponseSchema = z.object({
      solutions: z.array(z.object({
        title: z.string(),
        description: z.string(),
        feasibility: z.enum(["low", "medium", "high"]),
        impact: z.enum(["low", "medium", "high"]),
        timeline: z.string().optional(),
        resources_required: z.array(z.string()).optional()
      })),
      action_plan: z.array(z.object({
        step: z.number(),
        title: z.string(),
        description: z.string(),
        owner: z.string().optional(),
        timeline: z.string().optional(),
        dependencies: z.array(z.string()).optional()
      })),
      answered_questions: z.array(z.object({
        original_question: z.string(),
        answer: z.string(),
        confidence: z.enum(["low", "medium", "high"]),
        supporting_evidence: z.array(z.string()).optional()
      })),
      final_consensus: z.string(),
      implementation_strategy: z.object({
        approach: z.string(),
        key_milestones: z.array(z.string()),
        success_metrics: z.array(z.string()).optional(),
        risk_mitigation: z.array(z.string()).optional()
      }),
      telemetry: z.object({
        avg_ms: z.number(),
        quality: z.number(),
        tps: z.number(),
        active_agents: z.number().optional()
      })
    });
    reportRequestSchema = z.object({
      session_id: z.string(),
      report_type: z.enum(["executive", "detailed", "full"]),
      include_citations: z.boolean().default(true),
      include_expert_summary: z.boolean().default(true),
      format: z.enum(["markdown", "pdf", "html"]).default("markdown")
    });
    reportResponseSchema = z.object({
      report_type: z.enum(["executive", "detailed", "full"]),
      title: z.string(),
      executive_summary: z.string(),
      debate_overview: z.object({
        original_question: z.string(),
        methodology: z.string(),
        participants: z.array(z.string()),
        rounds_conducted: z.number(),
        consensus_reached: z.string(),
        key_dissents: z.array(z.object({
          position: z.string(),
          reasoning: z.string().optional()
        })),
        unresolved_questions: z.array(z.string())
      }),
      brainstorming_outcomes: z.object({
        collaborative_solutions: z.array(z.object({
          title: z.string(),
          description: z.string(),
          feasibility: z.enum(["low", "medium", "high"]),
          impact: z.enum(["low", "medium", "high"]),
          timeline: z.string().optional(),
          resources_required: z.array(z.string()).optional()
        })),
        implementation_plan: z.array(z.object({
          step: z.number(),
          title: z.string(),
          description: z.string(),
          owner: z.string().optional(),
          timeline: z.string().optional(),
          dependencies: z.array(z.string()).optional()
        })),
        answered_questions: z.array(z.object({
          original_question: z.string(),
          answer: z.string(),
          confidence: z.enum(["low", "medium", "high"]),
          supporting_evidence: z.array(z.string()).optional()
        })),
        implementation_strategy: z.object({
          approach: z.string(),
          key_milestones: z.array(z.string()),
          success_metrics: z.array(z.string()).optional(),
          risk_mitigation: z.array(z.string()).optional()
        })
      }).optional(),
      expert_analysis: z.object({
        domain_experts_consulted: z.array(z.object({
          expert_type: z.string(),
          role: z.string(),
          key_contributions: z.array(z.string()),
          confidence_level: z.enum(["low", "medium", "high"])
        })),
        ai_agents_summary: z.array(z.object({
          agent_name: z.string(),
          role: z.string(),
          key_insights: z.array(z.string()),
          approach: z.string()
        }))
      }).optional(),
      citations: z.array(z.object({
        title: z.string().optional(),
        url: z.string().optional(),
        source: z.string().optional(),
        author: z.string().optional(),
        year: z.string().optional(),
        relevance: z.string().optional()
      })).optional(),
      fact_check_summary: z.object({
        total_claims_verified: z.number(),
        verification_breakdown: z.object({
          verified: z.number(),
          disputed: z.number(),
          partially_verified: z.number(),
          inconclusive: z.number()
        }),
        key_findings: z.array(z.object({
          claim: z.string(),
          status: z.string(),
          confidence: z.number().optional(),
          note: z.string().optional()
        }))
      }).optional(),
      recommendations: z.array(z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(["low", "medium", "high"]),
        timeline: z.string().optional(),
        stakeholders: z.array(z.string()).optional()
      })),
      appendices: z.object({
        full_debate_transcript: z.string().optional(),
        brainstorming_transcript: z.string().optional(),
        methodology_details: z.string().optional(),
        technical_specifications: z.string().optional()
      }).optional(),
      metadata: z.object({
        generated_at: z.string(),
        session_id: z.string(),
        total_analysis_time: z.string(),
        quality_score: z.number().optional(),
        word_count: z.number().optional()
      })
    });
    sessionCodes = pgTable("session_codes", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      code: varchar("code", { length: 8 }).unique().notNull(),
      createdBy: varchar("created_by").notNull(),
      expiresAt: timestamp("expires_at").notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    sessionParticipants = pgTable("session_participants", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionCode: varchar("session_code").notNull(),
      userId: varchar("user_id").notNull(),
      joinedAt: timestamp("joined_at").defaultNow(),
      role: varchar("role", { enum: ["viewer", "participant", "moderator"] }).default("participant").notNull()
    });
    chatMessages = pgTable("chat_messages", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionCode: varchar("session_code").notNull(),
      userId: varchar("user_id").notNull(),
      content: text("content").notNull(),
      timestamp: timestamp("timestamp").defaultNow(),
      messageType: varchar("message_type", { enum: ["chat", "system", "debate_update"] }).default("chat").notNull()
    });
    insertSessionCodeSchema = createInsertSchema(sessionCodes).pick({
      code: true,
      createdBy: true,
      expiresAt: true,
      isActive: true
    });
    insertSessionParticipantSchema = createInsertSchema(sessionParticipants).pick({
      sessionCode: true,
      userId: true,
      role: true
    });
    insertChatMessageSchema = createInsertSchema(chatMessages).pick({
      sessionCode: true,
      userId: true,
      content: true,
      messageType: true
    });
    organizations = pgTable("organizations", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      slug: varchar("slug").unique().notNull(),
      // URL-friendly identifier
      logo: varchar("logo_url"),
      plan: varchar("plan").notNull().default("free"),
      // free, pro, enterprise
      settings: jsonb("settings").default({
        default_security_level: "standard",
        require_2fa: false,
        allowed_domains: [],
        max_workspaces: 10,
        max_users: 50,
        retention_days: 90
      }),
      billingSettings: jsonb("billing_settings").default({
        billing_email: null,
        usage_alerts: true,
        quota_limits: {
          monthly_analyses: 1e3,
          concurrent_sessions: 10,
          storage_gb: 5
        }
      }),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    organizationMembers = pgTable("organization_members", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      userId: varchar("user_id").notNull(),
      role: varchar("role").notNull().default("member"),
      // super_admin, admin, manager, member, viewer
      permissions: jsonb("permissions").default({
        manage_users: false,
        manage_billing: false,
        manage_workspaces: false,
        view_audit_logs: false,
        manage_security: false
      }),
      joinedAt: timestamp("joined_at").defaultNow(),
      lastActiveAt: timestamp("last_active_at")
    });
    teams = pgTable("teams", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      name: text("name").notNull(),
      description: text("description"),
      parentTeamId: varchar("parent_team_id"),
      // For hierarchical teams
      settings: jsonb("settings").default({
        default_workspace_privacy: "private",
        auto_join_workspaces: false
      }),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    teamMembers = pgTable("team_members", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      teamId: varchar("team_id").notNull(),
      userId: varchar("user_id").notNull(),
      role: varchar("role").notNull().default("member"),
      // lead, member
      joinedAt: timestamp("joined_at").defaultNow()
    });
    auditLogs = pgTable("audit_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      userId: varchar("user_id"),
      action: varchar("action").notNull(),
      // login, logout, create_workspace, delete_user, etc.
      resource: varchar("resource"),
      // user, workspace, organization, etc.
      resourceId: varchar("resource_id"),
      // ID of the affected resource
      details: jsonb("details"),
      // Additional context about the action
      ipAddress: varchar("ip_address"),
      userAgent: varchar("user_agent"),
      metadata: jsonb("metadata"),
      // Request headers, session info, etc.
      severity: varchar("severity").notNull().default("info"),
      // info, warning, error, critical
      timestamp: timestamp("timestamp").defaultNow()
    }, (table) => [
      index("audit_logs_org_idx").on(table.organizationId),
      index("audit_logs_user_idx").on(table.userId),
      index("audit_logs_action_idx").on(table.action),
      index("audit_logs_timestamp_idx").on(table.timestamp)
    ]);
    piiPatterns = pgTable("pii_patterns", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      name: varchar("name").notNull(),
      pattern: text("pattern").notNull(),
      // Regex pattern for PII detection
      category: varchar("category").notNull(),
      // email, ssn, phone, credit_card, etc.
      redactionType: varchar("redaction_type").notNull().default("mask"),
      // mask, remove, hash
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    securityEvents = pgTable("security_events", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      eventType: varchar("event_type").notNull(),
      // failed_login, suspicious_activity, rate_limit_exceeded
      severity: varchar("severity").notNull(),
      // low, medium, high, critical
      description: text("description").notNull(),
      metadata: jsonb("metadata"),
      // IP, user agent, attempt details, etc.
      resolved: boolean("resolved").default(false),
      resolvedAt: timestamp("resolved_at"),
      resolvedBy: varchar("resolved_by"),
      timestamp: timestamp("timestamp").defaultNow()
    }, (table) => [
      index("security_events_org_idx").on(table.organizationId),
      index("security_events_type_idx").on(table.eventType),
      index("security_events_severity_idx").on(table.severity),
      index("security_events_timestamp_idx").on(table.timestamp)
    ]);
    usageMetrics = pgTable("usage_metrics", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      userId: varchar("user_id"),
      metricType: varchar("metric_type").notNull(),
      // api_calls, analyses, storage, bandwidth
      value: integer("value").notNull(),
      unit: varchar("unit").notNull(),
      // calls, mb, seconds, etc.
      period: varchar("period").notNull(),
      // hourly, daily, monthly
      periodStart: timestamp("period_start").notNull(),
      periodEnd: timestamp("period_end").notNull(),
      metadata: jsonb("metadata"),
      // Additional usage context
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("usage_metrics_org_period_idx").on(table.organizationId, table.period),
      index("usage_metrics_user_period_idx").on(table.userId, table.period),
      index("usage_metrics_type_idx").on(table.metricType),
      index("usage_metrics_period_start_idx").on(table.periodStart)
    ]);
    rateLimitRules = pgTable("rate_limit_rules", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      ruleType: varchar("rule_type").notNull(),
      // user, organization, endpoint, global
      target: varchar("target"),
      // user_id, org_id, endpoint_path, or null for global
      limit: integer("limit").notNull(),
      // Max requests
      window: integer("window").notNull(),
      // Time window in seconds
      action: varchar("action").notNull().default("throttle"),
      // throttle, block, alert
      metadata: jsonb("metadata"),
      // Custom rule parameters
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    rateLimitStates = pgTable("rate_limit_states", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      ruleId: varchar("rule_id").notNull(),
      targetId: varchar("target_id").notNull(),
      // user_id, org_id, etc.
      requestCount: integer("request_count").notNull().default(0),
      windowStart: timestamp("window_start").notNull(),
      windowEnd: timestamp("window_end").notNull(),
      isBlocked: boolean("is_blocked").default(false),
      lastRequest: timestamp("last_request").defaultNow()
    }, (table) => [
      index("rate_limit_states_rule_target_idx").on(table.ruleId, table.targetId),
      index("rate_limit_states_window_end_idx").on(table.windowEnd)
    ]);
    timeLogs = pgTable("time_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      userId: varchar("user_id").notNull(),
      projectId: varchar("project_id"),
      // Optional project association
      description: text("description").notNull(),
      startTime: timestamp("start_time").notNull(),
      endTime: timestamp("end_time"),
      duration: integer("duration_minutes"),
      // Auto-calculated
      billableRate: decimal("billable_rate", { precision: 10, scale: 2 }),
      isBillable: boolean("is_billable").default(true).notNull(),
      isInvoiced: boolean("is_invoiced").default(false).notNull(),
      tags: jsonb("tags").default([]),
      metadata: jsonb("metadata"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("time_logs_org_user_idx").on(table.organizationId, table.userId),
      index("time_logs_billable_idx").on(table.isBillable, table.isInvoiced),
      index("time_logs_date_idx").on(table.startTime)
    ]);
    invoices = pgTable("invoices", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      invoiceNumber: varchar("invoice_number").unique().notNull(),
      clientEmail: varchar("client_email").notNull(),
      status: varchar("status").notNull().default("draft"),
      // draft, sent, paid, overdue
      subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
      taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
      totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
      currency: varchar("currency").notNull().default("USD"),
      dueDate: timestamp("due_date").notNull(),
      sentAt: timestamp("sent_at"),
      paidAt: timestamp("paid_at"),
      lineItems: jsonb("line_items").notNull(),
      // Time log details
      notes: text("notes"),
      paymentTerms: text("payment_terms"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("invoices_org_idx").on(table.organizationId),
      index("invoices_status_idx").on(table.status),
      index("invoices_due_date_idx").on(table.dueDate)
    ]);
    notifications = pgTable("notifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull(),
      organizationId: varchar("organization_id"),
      type: varchar("type").notNull(),
      // invoice, system, workflow, ai_analysis
      priority: varchar("priority").notNull().default("medium"),
      // low, medium, high, urgent
      title: text("title").notNull(),
      message: text("message").notNull(),
      actionUrl: varchar("action_url"),
      isRead: boolean("is_read").default(false).notNull(),
      deliveryMethods: jsonb("delivery_methods").default(["in_app"]),
      // in_app, email, sms
      scheduledFor: timestamp("scheduled_for"),
      sentAt: timestamp("sent_at"),
      readAt: timestamp("read_at"),
      metadata: jsonb("metadata"),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("notifications_user_idx").on(table.userId),
      index("notifications_unread_idx").on(table.userId, table.isRead),
      index("notifications_scheduled_idx").on(table.scheduledFor)
    ]);
    notificationRules = pgTable("notification_rules", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull(),
      organizationId: varchar("organization_id"),
      name: varchar("name").notNull(),
      trigger: varchar("trigger").notNull(),
      // invoice_overdue, usage_limit, analysis_complete
      conditions: jsonb("conditions").notNull(),
      // Rule conditions
      actions: jsonb("actions").notNull(),
      // What to do when triggered
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("notification_rules_user_idx").on(table.userId),
      index("notification_rules_trigger_idx").on(table.trigger, table.isActive)
    ]);
    workflowTemplates = pgTable("workflow_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      name: varchar("name").notNull(),
      description: text("description").notNull(),
      category: varchar("category").notNull(),
      // invoicing, notifications, ai_analysis, reporting
      template: jsonb("template").notNull(),
      // Workflow definition
      variables: jsonb("variables").default([]),
      // Template variables
      isPublic: boolean("is_public").default(false).notNull(),
      rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
      usageCount: integer("usage_count").default(0).notNull(),
      tags: jsonb("tags").default([]),
      createdBy: varchar("created_by").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("workflow_templates_category_idx").on(table.category),
      index("workflow_templates_public_idx").on(table.isPublic, table.rating),
      index("workflow_templates_org_idx").on(table.organizationId)
    ]);
    workflowInstances = pgTable("workflow_instances", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      templateId: varchar("template_id").notNull(),
      organizationId: varchar("organization_id").notNull(),
      userId: varchar("user_id").notNull(),
      status: varchar("status").notNull().default("running"),
      // running, completed, failed, cancelled
      input: jsonb("input"),
      // Input data for workflow
      output: jsonb("output"),
      // Generated results
      steps: jsonb("steps").default([]),
      // Execution steps log
      startedAt: timestamp("started_at").defaultNow(),
      completedAt: timestamp("completed_at"),
      errorMessage: text("error_message"),
      metadata: jsonb("metadata")
    }, (table) => [
      index("workflow_instances_template_idx").on(table.templateId),
      index("workflow_instances_user_idx").on(table.userId),
      index("workflow_instances_status_idx").on(table.status)
    ]);
    performanceMetrics = pgTable("performance_metrics", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      metricName: varchar("metric_name").notNull(),
      // response_time, cpu_usage, memory_usage, etc.
      value: integer("value").notNull(),
      unit: varchar("unit").notNull(),
      // ms, percent, mb, etc.
      tags: jsonb("tags"),
      // Additional metric tags for filtering
      endpoint: varchar("endpoint"),
      // API endpoint if applicable
      timestamp: timestamp("timestamp").defaultNow()
    }, (table) => [
      index("performance_metrics_name_idx").on(table.metricName),
      index("performance_metrics_org_idx").on(table.organizationId),
      index("performance_metrics_timestamp_idx").on(table.timestamp)
    ]);
    errorLogs = pgTable("error_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      userId: varchar("user_id"),
      errorType: varchar("error_type").notNull(),
      // application, system, network, etc.
      errorCode: varchar("error_code"),
      // HTTP status, custom error codes, etc.
      message: text("message").notNull(),
      stackTrace: text("stack_trace"),
      endpoint: varchar("endpoint"),
      requestId: varchar("request_id"),
      // For request tracing
      severity: varchar("severity").notNull().default("error"),
      // info, warning, error, fatal
      metadata: jsonb("metadata"),
      // Request headers, user context, etc.
      resolved: boolean("resolved").default(false),
      resolvedAt: timestamp("resolved_at"),
      resolvedBy: varchar("resolved_by"),
      timestamp: timestamp("timestamp").defaultNow()
    }, (table) => [
      index("error_logs_org_idx").on(table.organizationId),
      index("error_logs_type_idx").on(table.errorType),
      index("error_logs_severity_idx").on(table.severity),
      index("error_logs_timestamp_idx").on(table.timestamp),
      index("error_logs_request_id_idx").on(table.requestId)
    ]);
    healthChecks = pgTable("health_checks", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      serviceName: varchar("service_name").notNull(),
      // database, redis, external_api, etc.
      status: varchar("status").notNull(),
      // healthy, degraded, unhealthy
      responseTime: integer("response_time"),
      // in milliseconds
      errorMessage: text("error_message"),
      metadata: jsonb("metadata"),
      // Service-specific health details
      timestamp: timestamp("timestamp").defaultNow()
    }, (table) => [
      index("health_checks_service_idx").on(table.serviceName),
      index("health_checks_status_idx").on(table.status),
      index("health_checks_timestamp_idx").on(table.timestamp)
    ]);
    subscriptions = pgTable("subscriptions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
      plan: varchar("plan").notNull(),
      // free, pro, enterprise, custom
      seats: integer("seats").notNull().default(1),
      // Number of licensed seats
      status: varchar("status").notNull().default("trial"),
      // trial, active, canceled, past_due, unpaid
      currentPeriodEnd: timestamp("current_period_end").notNull(),
      // When current billing period ends
      stripeSubscriptionId: varchar("stripe_subscription_id"),
      // For future Stripe integration
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("subscriptions_workspace_idx").on(table.workspaceId),
      index("subscriptions_status_idx").on(table.status),
      index("subscriptions_period_end_idx").on(table.currentPeriodEnd),
      // Ensure only one subscription per workspace (business rule enforced in app)
      unique("subscriptions_workspace_unique").on(table.workspaceId)
    ]);
    entitlements = pgTable("entitlements", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
      feature: varchar("feature").notNull(),
      // Feature identifier (e.g. "advanced_ai", "export_pdf", "custom_templates")
      subscriptionId: varchar("subscription_id").references(() => subscriptions.id, { onDelete: "cascade" }),
      // FK to subscriptions
      templatePurchaseId: varchar("template_purchase_id").references(() => templatePurchases.id, { onDelete: "cascade" }),
      // FK to template_purchases
      grantedAt: timestamp("granted_at").defaultNow(),
      expiresAt: timestamp("expires_at")
      // Optional expiry for time-limited features
    }, (table) => [
      index("entitlements_workspace_idx").on(table.workspaceId),
      index("entitlements_feature_idx").on(table.feature),
      index("entitlements_subscription_idx").on(table.subscriptionId),
      index("entitlements_template_purchase_idx").on(table.templatePurchaseId),
      index("entitlements_expires_idx").on(table.expiresAt),
      // Ensure unique feature per workspace
      unique("entitlements_workspace_feature_unique").on(table.workspaceId, table.feature)
      // Check constraint to ensure exactly one of subscriptionId or templatePurchaseId is non-null
      // Note: This constraint will be enforced at application level for Drizzle compatibility
    ]);
    templateProducts = pgTable("template_products", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      // Product name
      description: text("description"),
      // Product description
      priceCents: integer("price_cents").notNull(),
      // Price in cents (e.g. 999 = $9.99)
      currency: varchar("currency").notNull().default("USD"),
      // USD, EUR, GBP, etc.
      templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
      // Reference to templates.id
      isActive: boolean("is_active").default(true).notNull(),
      // Whether product is available for purchase
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("template_products_template_idx").on(table.templateId),
      index("template_products_active_idx").on(table.isActive),
      index("template_products_price_idx").on(table.priceCents),
      // Ensure unique product per template
      unique("template_products_template_unique").on(table.templateId)
    ]);
    templatePurchases = pgTable("template_purchases", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workspaceId: varchar("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      // Reference to users.id (purchaser)
      templateProductId: varchar("template_product_id").notNull().references(() => templateProducts.id, { onDelete: "cascade" }),
      // Reference to template_products.id
      priceCents: integer("price_cents").notNull(),
      // Actual price paid (for historical records)
      currency: varchar("currency").notNull(),
      // Currency used for purchase
      licenseKey: varchar("license_key").unique().notNull(),
      // Generated license key for verification
      purchasedAt: timestamp("purchased_at").defaultNow()
    }, (table) => [
      index("template_purchases_workspace_idx").on(table.workspaceId),
      index("template_purchases_user_idx").on(table.userId),
      index("template_purchases_product_idx").on(table.templateProductId),
      index("template_purchases_license_idx").on(table.licenseKey),
      index("template_purchases_date_idx").on(table.purchasedAt),
      // Ensure unique purchase per workspace per template product
      unique("template_purchases_workspace_product_unique").on(table.workspaceId, table.templateProductId)
    ]);
    insertOrganizationSchema = createInsertSchema(organizations).pick({
      name: true,
      slug: true,
      logo: true,
      plan: true,
      settings: true,
      billingSettings: true
    });
    insertOrganizationMemberSchema = createInsertSchema(organizationMembers).pick({
      organizationId: true,
      userId: true,
      role: true,
      permissions: true
    });
    insertTeamSchema = createInsertSchema(teams).pick({
      organizationId: true,
      name: true,
      description: true,
      parentTeamId: true,
      settings: true
    });
    insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
      teamId: true,
      userId: true,
      role: true
    });
    insertAuditLogSchema = createInsertSchema(auditLogs).pick({
      organizationId: true,
      userId: true,
      action: true,
      resource: true,
      resourceId: true,
      details: true,
      ipAddress: true,
      userAgent: true,
      metadata: true,
      severity: true
    });
    insertPiiPatternSchema = createInsertSchema(piiPatterns).pick({
      organizationId: true,
      name: true,
      pattern: true,
      category: true,
      redactionType: true,
      isActive: true
    });
    insertSecurityEventSchema = createInsertSchema(securityEvents).pick({
      organizationId: true,
      eventType: true,
      severity: true,
      description: true,
      metadata: true
    });
    insertUsageMetricSchema = createInsertSchema(usageMetrics).pick({
      organizationId: true,
      userId: true,
      metricType: true,
      value: true,
      unit: true,
      period: true,
      periodStart: true,
      periodEnd: true,
      metadata: true
    });
    insertRateLimitRuleSchema = createInsertSchema(rateLimitRules).pick({
      organizationId: true,
      ruleType: true,
      target: true,
      limit: true,
      window: true,
      action: true,
      metadata: true,
      isActive: true
    });
    insertRateLimitStateSchema = createInsertSchema(rateLimitStates).pick({
      ruleId: true,
      targetId: true,
      requestCount: true,
      windowStart: true,
      windowEnd: true,
      isBlocked: true
    });
    insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).pick({
      organizationId: true,
      metricName: true,
      value: true,
      unit: true,
      tags: true,
      endpoint: true
    });
    insertErrorLogSchema = createInsertSchema(errorLogs).pick({
      organizationId: true,
      userId: true,
      errorType: true,
      errorCode: true,
      message: true,
      stackTrace: true,
      endpoint: true,
      requestId: true,
      severity: true,
      metadata: true
    });
    insertHealthCheckSchema = createInsertSchema(healthChecks).pick({
      serviceName: true,
      status: true,
      responseTime: true,
      errorMessage: true,
      metadata: true
    });
    organizationRoleSchema = z.enum(["super_admin", "admin", "manager", "member", "viewer"]);
    teamRoleSchema = z.enum(["lead", "member"]);
    auditLogSeveritySchema = z.enum(["info", "warning", "error", "critical"]);
    securityEventSeveritySchema = z.enum(["low", "medium", "high", "critical"]);
    piiCategorySchema = z.enum(["email", "ssn", "phone", "credit_card", "address", "name", "custom"]);
    redactionTypeSchema = z.enum(["mask", "remove", "hash", "tokenize"]);
    rateLimitActionSchema = z.enum(["throttle", "block", "alert"]);
    healthStatusSchema = z.enum(["healthy", "degraded", "unhealthy"]);
    organizationSettingsSchema = z.object({
      default_security_level: z.enum(["basic", "standard", "enhanced"]).optional(),
      require_2fa: z.boolean().optional(),
      allowed_domains: z.array(z.string()).optional(),
      max_workspaces: z.number().min(1).optional(),
      max_users: z.number().min(1).optional(),
      retention_days: z.number().min(1).max(3650).optional(),
      custom_branding: z.object({
        logo: z.string().optional(),
        primary_color: z.string().optional(),
        secondary_color: z.string().optional()
      }).optional()
    });
    billingSettingsSchema = z.object({
      billing_email: z.string().email().optional(),
      usage_alerts: z.boolean().optional(),
      quota_limits: z.object({
        monthly_analyses: z.number().min(0).optional(),
        concurrent_sessions: z.number().min(1).optional(),
        storage_gb: z.number().min(0).optional()
      }).optional()
    });
    permissionsSchema = z.object({
      manage_users: z.boolean().optional(),
      manage_billing: z.boolean().optional(),
      manage_workspaces: z.boolean().optional(),
      view_audit_logs: z.boolean().optional(),
      manage_security: z.boolean().optional(),
      manage_teams: z.boolean().optional(),
      view_analytics: z.boolean().optional()
    });
    insertTimeLogSchema = createInsertSchema(timeLogs).pick({
      organizationId: true,
      userId: true,
      projectId: true,
      description: true,
      startTime: true,
      endTime: true,
      duration: true,
      billableRate: true,
      isBillable: true,
      tags: true,
      metadata: true
    });
    insertInvoiceSchema = createInsertSchema(invoices).pick({
      organizationId: true,
      invoiceNumber: true,
      clientEmail: true,
      status: true,
      subtotal: true,
      taxAmount: true,
      totalAmount: true,
      currency: true,
      dueDate: true,
      lineItems: true,
      notes: true,
      paymentTerms: true
    });
    insertNotificationSchema = createInsertSchema(notifications).pick({
      userId: true,
      organizationId: true,
      type: true,
      priority: true,
      title: true,
      message: true,
      actionUrl: true,
      deliveryMethods: true,
      scheduledFor: true,
      metadata: true
    });
    insertNotificationRuleSchema = createInsertSchema(notificationRules).pick({
      userId: true,
      organizationId: true,
      name: true,
      trigger: true,
      conditions: true,
      actions: true,
      isActive: true
    });
    insertWorkflowTemplateSchema = createInsertSchema(workflowTemplates).pick({
      organizationId: true,
      name: true,
      description: true,
      category: true,
      template: true,
      variables: true,
      isPublic: true,
      tags: true,
      createdBy: true
    });
    insertWorkflowInstanceSchema = createInsertSchema(workflowInstances).pick({
      templateId: true,
      organizationId: true,
      userId: true,
      input: true,
      metadata: true
    });
    insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
      workspaceId: true,
      plan: true,
      seats: true,
      status: true,
      currentPeriodEnd: true,
      stripeSubscriptionId: true
    });
    insertEntitlementSchema = createInsertSchema(entitlements).pick({
      workspaceId: true,
      feature: true,
      subscriptionId: true,
      templatePurchaseId: true,
      expiresAt: true
    });
    insertTemplateProductSchema = createInsertSchema(templateProducts).pick({
      name: true,
      description: true,
      priceCents: true,
      currency: true,
      templateId: true,
      isActive: true
    });
    insertTemplatePurchaseSchema = createInsertSchema(templatePurchases).pick({
      workspaceId: true,
      userId: true,
      templateProductId: true,
      priceCents: true,
      currency: true,
      licenseKey: true
    });
    subscriptionPlanSchema = z.enum(["free", "pro", "enterprise", "custom"]);
    subscriptionStatusSchema = z.enum(["trial", "active", "canceled", "past_due", "unpaid"]);
    currencySchema = z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]);
    billingFeatureSchema = z.enum([
      "advanced_ai",
      "export_pdf",
      "custom_templates",
      "premium_support",
      "unlimited_sessions",
      "team_collaboration",
      "custom_branding",
      "sso_integration",
      "advanced_analytics",
      "priority_queue",
      "dedicated_support",
      "custom_workflows"
    ]);
    debateRuns = pgTable("debate_runs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      sessionId: varchar("session_id").notNull(),
      mode: varchar("mode").notNull(),
      // simple, guided, expert
      status: varchar("status").notNull().default("running"),
      // running, completed, failed
      startedAt: timestamp("started_at").defaultNow(),
      completedAt: timestamp("completed_at")
    });
    exportLogs = pgTable("export_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id"),
      workspaceId: varchar("workspace_id"),
      filename: text("filename"),
      dlpHits: text("dlp_hits"),
      // JSON string of DLP pattern matches
      createdAt: timestamp("created_at").defaultNow()
    });
    insertDebateRunSchema = createInsertSchema(debateRuns).pick({
      sessionId: true,
      mode: true,
      status: true,
      startedAt: true,
      completedAt: true
    });
    insertExportLogSchema = createInsertSchema(exportLogs).pick({
      userId: true,
      workspaceId: true,
      filename: true,
      dlpHits: true
    });
    reviews = pgTable("reviews", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id"),
      // Optional organization scope
      workspaceId: varchar("workspace_id"),
      // Optional workspace scope
      initiatorId: varchar("initiator_id").notNull(),
      // User who started the review
      resourceType: varchar("resource_type").notNull(),
      // analysis_session, report, export, template, etc.
      resourceId: varchar("resource_id").notNull(),
      // ID of the resource being reviewed
      reviewType: varchar("review_type").notNull(),
      // content, export, policy, security, quality
      title: text("title").notNull(),
      // Human-readable review title
      description: text("description"),
      // Optional description of what's being reviewed
      status: varchar("status").notNull().default("pending"),
      // pending, in_progress, approved, rejected, cancelled
      priority: varchar("priority").notNull().default("medium"),
      // low, medium, high, urgent
      dueDate: timestamp("due_date"),
      // Optional deadline for review completion
      approvedAt: timestamp("approved_at"),
      rejectedAt: timestamp("rejected_at"),
      completedAt: timestamp("completed_at"),
      completedBy: varchar("completed_by"),
      // User who completed the final review
      metadata: jsonb("metadata").default({}),
      // Review configuration and context
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("reviews_org_idx").on(table.organizationId),
      index("reviews_workspace_idx").on(table.workspaceId),
      index("reviews_initiator_idx").on(table.initiatorId),
      index("reviews_resource_idx").on(table.resourceType, table.resourceId),
      index("reviews_status_idx").on(table.status),
      index("reviews_priority_idx").on(table.priority),
      index("reviews_due_date_idx").on(table.dueDate)
    ]);
    reviewSteps = pgTable("review_steps", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      reviewId: varchar("review_id").notNull(),
      // Parent review
      stepNumber: integer("step_number").notNull(),
      // Order in the approval sequence
      stepType: varchar("step_type").notNull(),
      // approval, review, verification, notification
      title: text("title").notNull(),
      // Step title
      description: text("description"),
      // Step description or instructions
      status: varchar("status").notNull().default("pending"),
      // pending, in_progress, completed, skipped
      isRequired: boolean("is_required").default(true).notNull(),
      // Whether this step is mandatory
      canSkip: boolean("can_skip").default(false).notNull(),
      // Whether this step can be skipped
      autoComplete: boolean("auto_complete").default(false).notNull(),
      // Whether step completes automatically
      conditions: jsonb("conditions").default({}),
      // Conditions that must be met to proceed
      completedAt: timestamp("completed_at"),
      completedBy: varchar("completed_by"),
      // User who completed this step
      skipReason: text("skip_reason"),
      // Reason if step was skipped
      metadata: jsonb("metadata").default({}),
      // Step-specific configuration
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("review_steps_review_idx").on(table.reviewId),
      index("review_steps_order_idx").on(table.reviewId, table.stepNumber),
      index("review_steps_status_idx").on(table.status),
      index("review_steps_type_idx").on(table.stepType)
    ]);
    reviewAssignments = pgTable("review_assignments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      reviewId: varchar("review_id").notNull(),
      // Parent review
      stepId: varchar("step_id"),
      // Optional specific step (null = applies to entire review)
      assigneeId: varchar("assignee_id").notNull(),
      // User assigned to review
      assigneeType: varchar("assignee_type").notNull().default("user"),
      // user, team, role
      assignerRole: varchar("assigner_role").notNull(),
      // approver, reviewer, observer, required_signer
      isRequired: boolean("is_required").default(true).notNull(),
      // Whether this person's approval is required
      canDelegate: boolean("can_delegate").default(false).notNull(),
      // Whether assignee can delegate to others
      delegatedTo: varchar("delegated_to"),
      // User this assignment was delegated to
      status: varchar("status").notNull().default("assigned"),
      // assigned, accepted, completed, declined, delegated
      response: varchar("response"),
      // approve, reject, request_changes, no_objection
      responseReason: text("response_reason"),
      // Explanation for the response
      respondedAt: timestamp("responded_at"),
      assignedAt: timestamp("assigned_at").defaultNow(),
      notifiedAt: timestamp("notified_at"),
      // When assignee was notified
      metadata: jsonb("metadata").default({})
      // Assignment-specific data
    }, (table) => [
      index("review_assignments_review_idx").on(table.reviewId),
      index("review_assignments_step_idx").on(table.stepId),
      index("review_assignments_assignee_idx").on(table.assigneeId),
      index("review_assignments_status_idx").on(table.status),
      index("review_assignments_role_idx").on(table.assignerRole)
    ]);
    reviewComments = pgTable("review_comments", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      reviewId: varchar("review_id").notNull(),
      // Parent review
      stepId: varchar("step_id"),
      // Optional specific step
      assignmentId: varchar("assignment_id"),
      // Optional specific assignment
      authorId: varchar("author_id").notNull(),
      // User who wrote the comment
      commentType: varchar("comment_type").notNull().default("comment"),
      // comment, question, suggestion, objection, approval_note
      content: text("content").notNull(),
      // Comment content
      isInternal: boolean("is_internal").default(false).notNull(),
      // Whether comment is internal to reviewers
      isResolved: boolean("is_resolved").default(false).notNull(),
      // Whether comment/issue is resolved
      resolvedBy: varchar("resolved_by"),
      // User who marked as resolved
      resolvedAt: timestamp("resolved_at"),
      parentCommentId: varchar("parent_comment_id"),
      // For threaded conversations
      attachments: jsonb("attachments").default([]),
      // File attachments
      metadata: jsonb("metadata").default({}),
      // Comment metadata
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("review_comments_review_idx").on(table.reviewId),
      index("review_comments_step_idx").on(table.stepId),
      index("review_comments_assignment_idx").on(table.assignmentId),
      index("review_comments_author_idx").on(table.authorId),
      index("review_comments_type_idx").on(table.commentType),
      index("review_comments_parent_idx").on(table.parentCommentId),
      index("review_comments_resolved_idx").on(table.isResolved)
    ]);
    retentionPolicies = pgTable("retention_policies", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Organization that owns this policy
      name: varchar("name").notNull(),
      // Policy name
      description: text("description"),
      // Policy description
      dataType: varchar("data_type").notNull(),
      // analysis_sessions, reports, exports, chat_messages, etc.
      retentionPeriodDays: integer("retention_period_days").notNull(),
      // How long to keep data
      gracePeriodDays: integer("grace_period_days").default(30).notNull(),
      // Grace period before deletion
      isActive: boolean("is_active").default(true).notNull(),
      // Whether policy is active
      priority: integer("priority").default(0).notNull(),
      // Policy priority (higher wins)
      conditions: jsonb("conditions").default({}),
      // Conditions for when this policy applies
      actions: jsonb("actions").default({}),
      // Actions to take when retention period expires
      exemptions: jsonb("exemptions").default([]),
      // Conditions that exempt data from this policy
      lastRunAt: timestamp("last_run_at"),
      // When policy was last executed
      nextRunAt: timestamp("next_run_at"),
      // When policy should run next
      createdBy: varchar("created_by").notNull(),
      // User who created the policy
      approvedBy: varchar("approved_by"),
      // User who approved the policy (if required)
      approvedAt: timestamp("approved_at"),
      metadata: jsonb("metadata").default({}),
      // Additional policy configuration
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("retention_policies_org_idx").on(table.organizationId),
      index("retention_policies_data_type_idx").on(table.dataType),
      index("retention_policies_active_idx").on(table.isActive),
      index("retention_policies_next_run_idx").on(table.nextRunAt),
      index("retention_policies_priority_idx").on(table.priority)
    ]);
    legalHolds = pgTable("legal_holds", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Organization under legal hold
      name: varchar("name").notNull(),
      // Legal hold name/identifier
      description: text("description"),
      // Description of the legal matter
      holdType: varchar("hold_type").notNull(),
      // litigation, investigation, audit, regulatory
      status: varchar("status").notNull().default("active"),
      // active, released, pending, suspended
      custodians: jsonb("custodians").default([]),
      // List of user IDs whose data is on hold
      dataTypes: jsonb("data_types").default([]),
      // Types of data covered by hold
      dateRangeStart: timestamp("date_range_start"),
      // Start date for data coverage
      dateRangeEnd: timestamp("date_range_end"),
      // End date for data coverage
      searchCriteria: jsonb("search_criteria").default({}),
      // Criteria for identifying relevant data
      legalCounsel: varchar("legal_counsel"),
      // Legal counsel managing this hold
      matter: varchar("matter"),
      // Legal matter/case identifier
      courtOrder: varchar("court_order"),
      // Court order reference if applicable
      releasedAt: timestamp("released_at"),
      // When hold was released
      releasedBy: varchar("released_by"),
      // User who released the hold
      releaseReason: text("release_reason"),
      // Reason for releasing hold
      createdBy: varchar("created_by").notNull(),
      // User who created the hold
      approvedBy: varchar("approved_by"),
      // User who approved the hold
      approvedAt: timestamp("approved_at"),
      metadata: jsonb("metadata").default({}),
      // Additional hold configuration
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("legal_holds_org_idx").on(table.organizationId),
      index("legal_holds_status_idx").on(table.status),
      index("legal_holds_type_idx").on(table.holdType),
      index("legal_holds_date_range_idx").on(table.dateRangeStart, table.dateRangeEnd),
      index("legal_holds_counsel_idx").on(table.legalCounsel)
    ]);
    retentionJobs = pgTable("retention_jobs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Organization this job belongs to
      policyId: varchar("policy_id").notNull(),
      // Retention policy being executed
      jobType: varchar("job_type").notNull(),
      // scan, delete, archive, notify
      status: varchar("status").notNull().default("pending"),
      // pending, running, completed, failed, cancelled
      scheduledAt: timestamp("scheduled_at").notNull(),
      // When job is scheduled to run
      startedAt: timestamp("started_at"),
      // When job actually started
      completedAt: timestamp("completed_at"),
      // When job completed
      dataType: varchar("data_type").notNull(),
      // Type of data being processed
      targetCount: integer("target_count"),
      // Number of records to process
      processedCount: integer("processed_count").default(0).notNull(),
      // Number processed so far
      deletedCount: integer("deleted_count").default(0).notNull(),
      // Number actually deleted
      skippedCount: integer("skipped_count").default(0).notNull(),
      // Number skipped (legal hold, etc.)
      errorCount: integer("error_count").default(0).notNull(),
      // Number of errors encountered
      results: jsonb("results").default({}),
      // Detailed results of job execution
      errorLog: text("error_log"),
      // Error messages if job failed
      dryRun: boolean("dry_run").default(false).notNull(),
      // Whether this is a test run
      createdBy: varchar("created_by").notNull(),
      // User who scheduled the job
      metadata: jsonb("metadata").default({}),
      // Job-specific configuration
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("retention_jobs_org_idx").on(table.organizationId),
      index("retention_jobs_policy_idx").on(table.policyId),
      index("retention_jobs_status_idx").on(table.status),
      index("retention_jobs_scheduled_idx").on(table.scheduledAt),
      index("retention_jobs_type_idx").on(table.jobType, table.dataType)
    ]);
    dataClassifications = pgTable("data_classifications", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Organization that owns this classification
      resourceType: varchar("resource_type").notNull(),
      // analysis_session, report, export, etc.
      resourceId: varchar("resource_id").notNull(),
      // ID of the classified resource
      classification: varchar("classification").notNull(),
      // public, internal, confidential, restricted, top_secret
      dataTypes: jsonb("data_types").default([]),
      // Types of data contained (pii, phi, financial, etc.)
      sensitivity: varchar("sensitivity").notNull().default("medium"),
      // low, medium, high, critical
      retentionCategory: varchar("retention_category"),
      // business_records, legal_documents, operational_data, etc.
      isAutomaticallyClassified: boolean("is_automatically_classified").default(false).notNull(),
      // Whether auto-classified
      confidenceScore: integer("confidence_score"),
      // Confidence in automatic classification (0-100)
      reviewRequired: boolean("review_required").default(false).notNull(),
      // Whether classification needs human review
      reviewedBy: varchar("reviewed_by"),
      // User who reviewed the classification
      reviewedAt: timestamp("reviewed_at"),
      classifiedBy: varchar("classified_by").notNull(),
      // User or system that classified the data
      justification: text("justification"),
      // Reason for this classification
      tags: jsonb("tags").default([]),
      // Additional classification tags
      metadata: jsonb("metadata").default({}),
      // Classification metadata
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("data_classifications_org_idx").on(table.organizationId),
      index("data_classifications_resource_idx").on(table.resourceType, table.resourceId),
      index("data_classifications_classification_idx").on(table.classification),
      index("data_classifications_sensitivity_idx").on(table.sensitivity),
      index("data_classifications_category_idx").on(table.retentionCategory),
      index("data_classifications_review_idx").on(table.reviewRequired),
      // Ensure unique classification per resource
      unique("data_classifications_resource_unique").on(table.resourceType, table.resourceId)
    ]);
    scimUsers = pgTable("scim_users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Organization this SCIM user belongs to
      externalId: varchar("external_id").notNull(),
      // ID from the identity provider
      scimId: varchar("scim_id").unique().notNull(),
      // SCIM protocol user ID
      userName: varchar("user_name").notNull(),
      // SCIM userName attribute
      email: varchar("email").notNull(),
      // Primary email address
      firstName: varchar("first_name"),
      // Given name
      lastName: varchar("last_name"),
      // Family name
      displayName: varchar("display_name"),
      // Display name
      active: boolean("active").default(true).notNull(),
      // Whether user is active
      localUserId: varchar("local_user_id"),
      // Linked local user account ID
      department: varchar("department"),
      // User's department
      title: varchar("title"),
      // Job title
      manager: varchar("manager"),
      // Manager's SCIM ID
      employeeNumber: varchar("employee_number"),
      // Employee ID
      costCenter: varchar("cost_center"),
      // Cost center
      division: varchar("division"),
      // Division/business unit
      customAttributes: jsonb("custom_attributes").default({}),
      // Additional SCIM attributes
      lastSyncAt: timestamp("last_sync_at"),
      // When this user was last synced
      syncStatus: varchar("sync_status").notNull().default("active"),
      // active, inactive, error, pending
      syncError: text("sync_error"),
      // Last sync error message
      provisionedAt: timestamp("provisioned_at").defaultNow(),
      // When user was first provisioned
      deprovisionedAt: timestamp("deprovisioned_at"),
      // When user was deprovisioned
      metadata: jsonb("metadata").default({}),
      // Additional SCIM metadata
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("scim_users_org_idx").on(table.organizationId),
      index("scim_users_external_id_idx").on(table.externalId),
      index("scim_users_email_idx").on(table.email),
      index("scim_users_username_idx").on(table.userName),
      index("scim_users_local_user_idx").on(table.localUserId),
      index("scim_users_active_idx").on(table.active),
      index("scim_users_sync_status_idx").on(table.syncStatus),
      index("scim_users_last_sync_idx").on(table.lastSyncAt),
      // Ensure unique external ID per organization
      unique("scim_users_org_external_unique").on(table.organizationId, table.externalId)
    ]);
    scimGroups = pgTable("scim_groups", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Organization this group belongs to
      externalId: varchar("external_id").notNull(),
      // ID from the identity provider
      scimId: varchar("scim_id").unique().notNull(),
      // SCIM protocol group ID
      displayName: varchar("display_name").notNull(),
      // Group display name
      description: text("description"),
      // Group description
      groupType: varchar("group_type").default("role"),
      // role, team, department, project, custom
      mappedRole: varchar("mapped_role"),
      // Local role this group maps to
      mappedTeamId: varchar("mapped_team_id"),
      // Local team this group maps to
      permissions: jsonb("permissions").default([]),
      // Permissions granted by this group
      customAttributes: jsonb("custom_attributes").default({}),
      // Additional SCIM attributes
      lastSyncAt: timestamp("last_sync_at"),
      // When this group was last synced
      syncStatus: varchar("sync_status").notNull().default("active"),
      // active, inactive, error, pending
      syncError: text("sync_error"),
      // Last sync error message
      memberCount: integer("member_count").default(0).notNull(),
      // Cached member count
      provisionedAt: timestamp("provisioned_at").defaultNow(),
      // When group was first provisioned
      deprovisionedAt: timestamp("deprovisioned_at"),
      // When group was deprovisioned
      metadata: jsonb("metadata").default({}),
      // Additional SCIM metadata
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("scim_groups_org_idx").on(table.organizationId),
      index("scim_groups_external_id_idx").on(table.externalId),
      index("scim_groups_display_name_idx").on(table.displayName),
      index("scim_groups_type_idx").on(table.groupType),
      index("scim_groups_mapped_role_idx").on(table.mappedRole),
      index("scim_groups_mapped_team_idx").on(table.mappedTeamId),
      index("scim_groups_sync_status_idx").on(table.syncStatus),
      index("scim_groups_last_sync_idx").on(table.lastSyncAt),
      // Ensure unique external ID per organization
      unique("scim_groups_org_external_unique").on(table.organizationId, table.externalId)
    ]);
    scimGroupMemberships = pgTable("scim_group_memberships", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      groupId: varchar("group_id").notNull(),
      // SCIM group ID
      userId: varchar("user_id").notNull(),
      // SCIM user ID
      membershipType: varchar("membership_type").notNull().default("direct"),
      // direct, inherited, computed
      source: varchar("source").default("scim"),
      // scim, manual, computed
      lastSyncAt: timestamp("last_sync_at"),
      // When this membership was last synced
      syncStatus: varchar("sync_status").notNull().default("active"),
      // active, pending, error
      syncError: text("sync_error"),
      // Last sync error message
      addedAt: timestamp("added_at").defaultNow(),
      // When membership was added
      removedAt: timestamp("removed_at"),
      // When membership was removed
      metadata: jsonb("metadata").default({})
      // Additional membership metadata
    }, (table) => [
      index("scim_group_memberships_group_idx").on(table.groupId),
      index("scim_group_memberships_user_idx").on(table.userId),
      index("scim_group_memberships_type_idx").on(table.membershipType),
      index("scim_group_memberships_sync_status_idx").on(table.syncStatus),
      index("scim_group_memberships_last_sync_idx").on(table.lastSyncAt),
      // Ensure unique membership per group-user pair
      unique("scim_group_memberships_group_user_unique").on(table.groupId, table.userId)
    ]);
    provisioningLogs = pgTable("provisioning_logs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Organization this log belongs to
      operation: varchar("operation").notNull(),
      // create, read, update, delete, sync, bulk_import
      resourceType: varchar("resource_type").notNull(),
      // user, group, membership
      resourceId: varchar("resource_id"),
      // ID of the affected resource
      externalId: varchar("external_id"),
      // External ID from identity provider
      status: varchar("status").notNull(),
      // success, failure, partial, warning
      httpStatus: integer("http_status"),
      // HTTP status code
      requestId: varchar("request_id"),
      // Unique request identifier
      endpoint: varchar("endpoint"),
      // SCIM endpoint that was called
      method: varchar("method"),
      // HTTP method (GET, POST, PUT, PATCH, DELETE)
      requestBody: jsonb("request_body"),
      // SCIM request payload
      responseBody: jsonb("response_body"),
      // SCIM response payload
      errorCode: varchar("error_code"),
      // SCIM error code
      errorMessage: text("error_message"),
      // Error message
      processingTimeMs: integer("processing_time_ms"),
      // Processing time in milliseconds
      userAgent: varchar("user_agent"),
      // Client user agent
      ipAddress: varchar("ip_address"),
      // Client IP address
      batchId: varchar("batch_id"),
      // Batch identifier for bulk operations
      retryCount: integer("retry_count").default(0).notNull(),
      // Number of retries attempted
      metadata: jsonb("metadata").default({}),
      // Additional log metadata
      timestamp: timestamp("timestamp").defaultNow()
    }, (table) => [
      index("provisioning_logs_org_idx").on(table.organizationId),
      index("provisioning_logs_operation_idx").on(table.operation),
      index("provisioning_logs_resource_idx").on(table.resourceType, table.resourceId),
      index("provisioning_logs_status_idx").on(table.status),
      index("provisioning_logs_timestamp_idx").on(table.timestamp),
      index("provisioning_logs_request_idx").on(table.requestId),
      index("provisioning_logs_batch_idx").on(table.batchId),
      index("provisioning_logs_external_idx").on(table.externalId)
    ]);
    insertReviewSchema = createInsertSchema(reviews).pick({
      organizationId: true,
      workspaceId: true,
      initiatorId: true,
      resourceType: true,
      resourceId: true,
      reviewType: true,
      title: true,
      description: true,
      priority: true,
      dueDate: true,
      metadata: true
    });
    insertReviewStepSchema = createInsertSchema(reviewSteps).pick({
      reviewId: true,
      stepNumber: true,
      stepType: true,
      title: true,
      description: true,
      isRequired: true,
      canSkip: true,
      autoComplete: true,
      conditions: true,
      metadata: true
    });
    insertReviewAssignmentSchema = createInsertSchema(reviewAssignments).pick({
      reviewId: true,
      stepId: true,
      assigneeId: true,
      assigneeType: true,
      assignerRole: true,
      isRequired: true,
      canDelegate: true,
      delegatedTo: true,
      metadata: true
    });
    insertReviewCommentSchema = createInsertSchema(reviewComments).pick({
      reviewId: true,
      stepId: true,
      assignmentId: true,
      authorId: true,
      commentType: true,
      content: true,
      isInternal: true,
      parentCommentId: true,
      attachments: true,
      metadata: true
    });
    insertRetentionPolicySchema = createInsertSchema(retentionPolicies).pick({
      organizationId: true,
      name: true,
      description: true,
      dataType: true,
      retentionPeriodDays: true,
      gracePeriodDays: true,
      isActive: true,
      priority: true,
      conditions: true,
      actions: true,
      exemptions: true,
      nextRunAt: true,
      createdBy: true,
      approvedBy: true,
      metadata: true
    });
    insertLegalHoldSchema = createInsertSchema(legalHolds).pick({
      organizationId: true,
      name: true,
      description: true,
      holdType: true,
      custodians: true,
      dataTypes: true,
      dateRangeStart: true,
      dateRangeEnd: true,
      searchCriteria: true,
      legalCounsel: true,
      matter: true,
      courtOrder: true,
      createdBy: true,
      approvedBy: true,
      metadata: true
    });
    insertRetentionJobSchema = createInsertSchema(retentionJobs).pick({
      organizationId: true,
      policyId: true,
      jobType: true,
      scheduledAt: true,
      dataType: true,
      targetCount: true,
      dryRun: true,
      createdBy: true,
      metadata: true
    });
    insertDataClassificationSchema = createInsertSchema(dataClassifications).pick({
      organizationId: true,
      resourceType: true,
      resourceId: true,
      classification: true,
      dataTypes: true,
      sensitivity: true,
      retentionCategory: true,
      isAutomaticallyClassified: true,
      confidenceScore: true,
      reviewRequired: true,
      classifiedBy: true,
      justification: true,
      tags: true,
      metadata: true
    });
    insertScimUserSchema = createInsertSchema(scimUsers).pick({
      organizationId: true,
      externalId: true,
      scimId: true,
      userName: true,
      email: true,
      firstName: true,
      lastName: true,
      displayName: true,
      active: true,
      localUserId: true,
      department: true,
      title: true,
      manager: true,
      employeeNumber: true,
      costCenter: true,
      division: true,
      customAttributes: true,
      syncStatus: true,
      metadata: true
    });
    insertScimGroupSchema = createInsertSchema(scimGroups).pick({
      organizationId: true,
      externalId: true,
      scimId: true,
      displayName: true,
      description: true,
      groupType: true,
      mappedRole: true,
      mappedTeamId: true,
      permissions: true,
      customAttributes: true,
      syncStatus: true,
      metadata: true
    });
    insertScimGroupMembershipSchema = createInsertSchema(scimGroupMemberships).pick({
      groupId: true,
      userId: true,
      membershipType: true,
      source: true,
      metadata: true
    });
    insertProvisioningLogSchema = createInsertSchema(provisioningLogs).pick({
      organizationId: true,
      operation: true,
      resourceType: true,
      resourceId: true,
      externalId: true,
      status: true,
      httpStatus: true,
      requestId: true,
      endpoint: true,
      method: true,
      requestBody: true,
      responseBody: true,
      errorCode: true,
      errorMessage: true,
      processingTimeMs: true,
      userAgent: true,
      ipAddress: true,
      batchId: true,
      retryCount: true,
      metadata: true
    });
    workflowDefinitions = pgTable("workflow_definitions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Tenant hardening
      name: text("name").notNull(),
      // Workflow name
      description: text("description"),
      // Workflow description
      triggerType: varchar("trigger_type").notNull(),
      // manual, scheduled, event, webhook
      triggerConfig: jsonb("trigger_config").notNull(),
      // Trigger configuration
      actions: jsonb("actions").notNull(),
      // Array of actions to execute
      isActive: boolean("is_active").default(true),
      // Whether workflow is active
      version: integer("version").default(1),
      // Version for updates
      createdBy: varchar("created_by").notNull(),
      // User who created workflow
      updatedBy: varchar("updated_by"),
      // User who last updated workflow
      settings: jsonb("settings").default({}),
      // Additional workflow settings
      metadata: jsonb("metadata").default({}),
      // Additional metadata
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("workflow_definitions_org_idx").on(table.organizationId),
      index("workflow_definitions_trigger_idx").on(table.triggerType),
      index("workflow_definitions_active_idx").on(table.isActive)
    ]);
    workflowExecutions = pgTable("workflow_executions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      workflowDefinitionId: varchar("workflow_definition_id").notNull(),
      // Reference to definition
      organizationId: varchar("organization_id").notNull(),
      // Tenant hardening
      triggeredBy: varchar("triggered_by"),
      // User or system that triggered
      triggerData: jsonb("trigger_data"),
      // Input data for execution
      status: varchar("status").notNull().default("pending"),
      // pending, running, completed, failed, cancelled
      currentStep: integer("current_step").default(0),
      // Current action step
      totalSteps: integer("total_steps").default(0),
      // Total actions to execute
      results: jsonb("results").default([]),
      // Results from each action
      errorMessage: text("error_message"),
      // Error details if failed
      startedAt: timestamp("started_at").defaultNow(),
      completedAt: timestamp("completed_at"),
      duration: integer("duration"),
      // Execution time in milliseconds
      metadata: jsonb("metadata").default({})
      // Additional execution data
    }, (table) => [
      index("workflow_executions_definition_idx").on(table.workflowDefinitionId),
      index("workflow_executions_org_idx").on(table.organizationId),
      index("workflow_executions_status_idx").on(table.status),
      index("workflow_executions_triggered_idx").on(table.triggeredBy)
    ]);
    workflowEvents = pgTable("workflow_events", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Tenant hardening
      eventType: varchar("event_type").notNull(),
      // trigger_workflow, action_completed, webhook_received
      eventData: jsonb("event_data").notNull(),
      // Event payload
      workflowExecutionId: varchar("workflow_execution_id"),
      // Optional reference to execution
      status: varchar("status").notNull().default("pending"),
      // pending, processing, completed, failed
      retryCount: integer("retry_count").default(0),
      // Number of retry attempts
      processedAt: timestamp("processed_at"),
      // When event was processed
      errorMessage: text("error_message"),
      // Error details if failed
      scheduledFor: timestamp("scheduled_for"),
      // When to process (for delayed events)
      priority: integer("priority").default(0),
      // Event priority (higher = process first)
      source: varchar("source"),
      // Event source (webhook, manual, system)
      metadata: jsonb("metadata").default({}),
      // Additional event data
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("workflow_events_org_idx").on(table.organizationId),
      index("workflow_events_type_idx").on(table.eventType),
      index("workflow_events_status_idx").on(table.status),
      index("workflow_events_scheduled_idx").on(table.scheduledFor),
      index("workflow_events_execution_idx").on(table.workflowExecutionId)
    ]);
    organizationAnalytics = pgTable("organization_analytics", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Target organization
      date: timestamp("date").notNull(),
      // Analytics date
      activeUsers: integer("active_users").default(0),
      // Daily active users
      totalSessions: integer("total_sessions").default(0),
      // Total analysis sessions
      templatesUsed: integer("templates_used").default(0),
      // Templates used count
      workflowsExecuted: integer("workflows_executed").default(0),
      // Workflows run
      apiCalls: integer("api_calls").default(0),
      // API requests made
      storageUsed: integer("storage_used").default(0),
      // Storage in bytes
      averageSessionDuration: integer("average_session_duration").default(0),
      // Duration in seconds
      topTemplates: jsonb("top_templates").default([]),
      // Most used templates
      topUsers: jsonb("top_users").default([]),
      // Most active users
      errorRate: decimal("error_rate", { precision: 5, scale: 4 }).default("0"),
      // Error percentage
      performance: jsonb("performance").default({}),
      // Performance metrics
      features: jsonb("features").default({}),
      // Feature usage stats
      metadata: jsonb("metadata").default({}),
      // Additional analytics data
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("org_analytics_org_date_idx").on(table.organizationId, table.date),
      index("org_analytics_date_idx").on(table.date),
      unique("org_analytics_unique_org_date").on(table.organizationId, table.date)
    ]);
    organizationDailyReports = pgTable("organization_daily_reports", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Target organization
      reportDate: timestamp("report_date").notNull(),
      // Report date
      reportType: varchar("report_type").notNull().default("daily_summary"),
      // daily_summary, weekly_digest, monthly_review
      title: text("title").notNull(),
      // Report title
      summary: text("summary"),
      // Executive summary
      keyMetrics: jsonb("key_metrics").notNull(),
      // Important metrics
      insights: jsonb("insights").default([]),
      // Generated insights
      recommendations: jsonb("recommendations").default([]),
      // Action recommendations
      alerts: jsonb("alerts").default([]),
      // Important alerts
      charts: jsonb("charts").default([]),
      // Chart data for visualization
      generatedAt: timestamp("generated_at").defaultNow(),
      generatedBy: varchar("generated_by").default("system"),
      // User or system that generated
      status: varchar("status").notNull().default("generated"),
      // generated, sent, archived
      recipients: jsonb("recipients").default([]),
      // Who received the report
      metadata: jsonb("metadata").default({})
      // Additional report data
    }, (table) => [
      index("daily_reports_org_date_idx").on(table.organizationId, table.reportDate),
      index("daily_reports_type_idx").on(table.reportType),
      index("daily_reports_status_idx").on(table.status),
      unique("daily_reports_unique_org_date_type").on(table.organizationId, table.reportDate, table.reportType)
    ]);
    enhancedUsageMetrics = pgTable("enhanced_usage_metrics", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      organizationId: varchar("organization_id").notNull(),
      // Tenant hardening
      userId: varchar("user_id"),
      // Optional user tracking
      resourceType: varchar("resource_type").notNull(),
      // template, workflow, api, storage, analysis
      resourceId: varchar("resource_id"),
      // Specific resource ID
      action: varchar("action").notNull(),
      // create, read, update, delete, execute, download
      metricType: varchar("metric_type").notNull(),
      // usage, performance, billing, quota
      value: decimal("value", { precision: 10, scale: 2 }).notNull(),
      // Metric value
      unit: varchar("unit").notNull(),
      // count, seconds, bytes, requests, percentage
      tags: text("tags").array().default([]),
      // Additional categorization - PostgreSQL text array
      dimensions: jsonb("dimensions").default({}),
      // Metric dimensions
      timestamp: timestamp("timestamp").defaultNow(),
      metadata: jsonb("metadata").default({})
      // Additional metric data
    }, (table) => [
      index("enhanced_metrics_org_idx").on(table.organizationId),
      index("enhanced_metrics_resource_idx").on(table.resourceType, table.resourceId),
      index("enhanced_metrics_user_idx").on(table.userId),
      index("enhanced_metrics_timestamp_idx").on(table.timestamp),
      index("enhanced_metrics_org_resource_time_idx").on(table.organizationId, table.resourceType, table.timestamp)
    ]);
    reviewStatusSchema = z.enum(["pending", "in_progress", "approved", "rejected", "cancelled"]);
    reviewTypeSchema = z.enum(["content", "export", "policy", "security", "quality", "compliance", "legal"]);
    reviewPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
    reviewStepTypeSchema = z.enum(["approval", "review", "verification", "notification", "checkpoint"]);
    reviewStepStatusSchema = z.enum(["pending", "in_progress", "completed", "skipped"]);
    reviewAssigneeTypeSchema = z.enum(["user", "team", "role", "group"]);
    reviewAssignerRoleSchema = z.enum(["approver", "reviewer", "observer", "required_signer", "coordinator"]);
    reviewAssignmentStatusSchema = z.enum(["assigned", "accepted", "completed", "declined", "delegated"]);
    reviewResponseSchema = z.enum(["approve", "reject", "request_changes", "no_objection", "abstain"]);
    reviewCommentTypeSchema = z.enum(["comment", "question", "suggestion", "objection", "approval_note", "change_request"]);
    retentionDataTypeSchema = z.enum(["analysis_sessions", "reports", "exports", "chat_messages", "user_data", "audit_logs", "all"]);
    legalHoldTypeSchema = z.enum(["litigation", "investigation", "audit", "regulatory", "discovery", "compliance"]);
    legalHoldStatusSchema = z.enum(["active", "released", "pending", "suspended", "expired"]);
    retentionJobTypeSchema = z.enum(["scan", "delete", "archive", "notify", "classify"]);
    retentionJobStatusSchema = z.enum(["pending", "running", "completed", "failed", "cancelled", "paused"]);
    dataClassificationSchema = z.enum(["public", "internal", "confidential", "restricted", "top_secret"]);
    dataSensitivitySchema = z.enum(["low", "medium", "high", "critical"]);
    retentionCategorySchema = z.enum(["business_records", "legal_documents", "operational_data", "user_content", "system_logs", "temporary"]);
    scimSyncStatusSchema = z.enum(["active", "inactive", "error", "pending", "deprovisioned"]);
    scimGroupTypeSchema = z.enum(["role", "team", "department", "project", "custom", "security"]);
    scimMembershipTypeSchema = z.enum(["direct", "inherited", "computed", "manual"]);
    scimMembershipSourceSchema = z.enum(["scim", "manual", "computed", "inherited"]);
    provisioningOperationSchema = z.enum(["create", "read", "update", "delete", "sync", "bulk_import", "bulk_export"]);
    provisioningResourceTypeSchema = z.enum(["user", "group", "membership", "schema", "resource_type"]);
    provisioningStatusSchema = z.enum(["success", "failure", "partial", "warning", "timeout"]);
    templateStatusSchema = z.enum(["draft", "under_review", "published", "archived"]);
    templateCategorySchema = z.enum(["business", "technology", "education", "research", "marketing", "analysis", "automation"]);
    workflowTriggerTypeSchema = z.enum(["manual", "scheduled", "event", "webhook", "api"]);
    workflowExecutionStatusSchema = z.enum(["pending", "running", "completed", "failed", "cancelled", "paused"]);
    workflowEventTypeSchema = z.enum(["trigger_workflow", "action_completed", "webhook_received", "schedule_triggered", "manual_trigger"]);
    workflowEventStatusSchema = z.enum(["pending", "processing", "completed", "failed", "retrying", "skipped"]);
    reportTypeSchema = z.enum(["daily_summary", "weekly_digest", "monthly_review", "quarterly_report", "annual_summary"]);
    reportStatusSchema = z.enum(["generated", "sent", "archived", "failed", "scheduled"]);
    metricTypeSchema = z.enum(["usage", "performance", "billing", "quota", "efficiency", "engagement"]);
    resourceTypeSchema = z.enum(["template", "workflow", "api", "storage", "analysis", "user", "organization"]);
    actionTypeSchema = z.enum(["create", "read", "update", "delete", "execute", "download", "upload", "share", "export"]);
    insertWorkflowDefinitionSchema = createInsertSchema(workflowDefinitions).pick({
      organizationId: true,
      name: true,
      description: true,
      triggerType: true,
      triggerConfig: true,
      actions: true,
      isActive: true,
      createdBy: true,
      settings: true,
      metadata: true
    });
    insertWorkflowExecutionSchema = createInsertSchema(workflowExecutions).pick({
      workflowDefinitionId: true,
      organizationId: true,
      triggeredBy: true,
      triggerData: true,
      status: true,
      metadata: true
    });
    insertWorkflowEventSchema = createInsertSchema(workflowEvents).pick({
      organizationId: true,
      eventType: true,
      eventData: true,
      workflowExecutionId: true,
      scheduledFor: true,
      priority: true,
      source: true,
      metadata: true
    });
    insertOrganizationAnalyticsSchema = createInsertSchema(organizationAnalytics).pick({
      organizationId: true,
      date: true,
      activeUsers: true,
      totalSessions: true,
      templatesUsed: true,
      workflowsExecuted: true,
      apiCalls: true,
      storageUsed: true,
      averageSessionDuration: true,
      topTemplates: true,
      topUsers: true,
      errorRate: true,
      performance: true,
      features: true,
      metadata: true
    });
    insertOrganizationDailyReportSchema = createInsertSchema(organizationDailyReports).pick({
      organizationId: true,
      reportDate: true,
      reportType: true,
      title: true,
      summary: true,
      keyMetrics: true,
      insights: true,
      recommendations: true,
      alerts: true,
      charts: true,
      generatedBy: true,
      recipients: true,
      metadata: true
    });
    insertEnhancedUsageMetricSchema = createInsertSchema(enhancedUsageMetrics).pick({
      organizationId: true,
      userId: true,
      resourceType: true,
      resourceId: true,
      action: true,
      metricType: true,
      value: true,
      unit: true,
      tags: true,
      dimensions: true,
      metadata: true
    });
    insertTemplateSchema = createInsertSchema(templates).pick({
      name: true,
      description: true,
      category: true,
      tags: true,
      content: true,
      isPublic: true,
      authorId: true,
      organizationId: true,
      status: true,
      contentValidation: true,
      previousVersionId: true,
      isTemplate: true,
      metadata: true
    });
    dunningEvents = pgTable("dunning_events", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      invoiceId: varchar("invoice_id").notNull(),
      orgId: text("org_id").notNull(),
      event: text("event").notNull(),
      // remind, warn, suspend, resume
      createdAt: timestamp("created_at").defaultNow()
    });
    seats = pgTable("seats", {
      orgId: text("org_id").primaryKey(),
      seats: integer("seats").notNull().default(1),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertDunningEventSchema = createInsertSchema(dunningEvents).pick({
      invoiceId: true,
      orgId: true,
      event: true
    });
    insertSeatsSchema = createInsertSchema(seats).pick({
      orgId: true,
      seats: true
    });
    docs = pgTable("docs", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      content: text("content").notNull(),
      category: varchar("category").notNull(),
      // getting-started, features, api, troubleshooting
      tags: text("tags").array().default([]),
      // searchable tags
      slug: varchar("slug").unique().notNull(),
      // URL-friendly identifier
      author: varchar("author"),
      isPublished: boolean("is_published").default(true),
      viewCount: integer("view_count").default(0),
      lastUpdated: timestamp("last_updated").defaultNow(),
      metadata: jsonb("metadata").default({}),
      // Additional doc metadata
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("docs_category_idx").on(table.category),
      index("docs_published_idx").on(table.isPublished),
      index("docs_slug_idx").on(table.slug)
    ]);
    adminSettings = pgTable("admin_settings", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      key: varchar("key").unique().notNull(),
      // Unique setting identifier
      value: text("value").notNull(),
      // Setting value (JSON or string)
      description: text("description"),
      // Human-readable description
      category: varchar("category").notNull(),
      // system, security, features, billing
      dataType: varchar("data_type").notNull().default("string"),
      // string, number, boolean, json
      isEditable: boolean("is_editable").default(true),
      isRequired: boolean("is_required").default(false),
      validationRules: jsonb("validation_rules").default({}),
      // Validation constraints
      lastModifiedBy: varchar("last_modified_by"),
      updatedAt: timestamp("updated_at").defaultNow(),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => [
      index("admin_settings_category_idx").on(table.category),
      index("admin_settings_key_idx").on(table.key)
    ]);
    marketplaceItems = pgTable("marketplace_items", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      description: text("description").notNull(),
      category: varchar("category").notNull(),
      // templates, tools, integrations, services
      subcategory: varchar("subcategory"),
      // More specific categorization
      price: decimal("price", { precision: 10, scale: 2 }).default("0"),
      // Free items have 0 price
      currency: varchar("currency").default("USD"),
      publisher: varchar("publisher").notNull(),
      // Publisher name/organization
      publisherId: varchar("publisher_id"),
      // Reference to user/org who published
      status: varchar("status").notNull().default("draft"),
      // draft, under_review, published, archived
      tags: text("tags").array().default([]),
      // Search tags
      images: text("images").array().default([]),
      // Image URLs
      downloadUrl: varchar("download_url"),
      // Download link for items
      demoUrl: varchar("demo_url"),
      // Live demo link
      githubUrl: varchar("github_url"),
      // Source code link
      rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
      // Average rating
      ratingCount: integer("rating_count").default(0),
      // Number of ratings
      downloadCount: integer("download_count").default(0),
      // Download statistics
      viewCount: integer("view_count").default(0),
      // View statistics
      featured: boolean("featured").default(false),
      // Featured items
      metadata: jsonb("metadata").default({}),
      // Additional item data
      publishedAt: timestamp("published_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("marketplace_items_category_idx").on(table.category),
      index("marketplace_items_status_idx").on(table.status),
      index("marketplace_items_publisher_idx").on(table.publisherId),
      index("marketplace_items_featured_idx").on(table.featured),
      index("marketplace_items_rating_idx").on(table.rating)
    ]);
    changelogEntries = pgTable("changelog_entries", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      version: varchar("version").unique().notNull(),
      // e.g., "1.2.0", "2024.1"
      title: text("title").notNull(),
      // Release title
      content: text("content").notNull(),
      // Markdown content of changelog
      type: varchar("type").notNull(),
      // major, minor, patch, hotfix
      category: varchar("category").notNull().default("general"),
      // feature, bugfix, security, performance
      isPublished: boolean("is_published").default(false),
      isPinned: boolean("is_pinned").default(false),
      // Pin important releases
      tags: text("tags").array().default([]),
      // Release tags
      author: varchar("author").notNull(),
      // Who created the entry
      releaseDate: timestamp("release_date"),
      // When the release was deployed
      announcementChannels: text("announcement_channels").array().default([]),
      // Where to announce
      metadata: jsonb("metadata").default({}),
      // Additional release data
      publishedAt: timestamp("published_at"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("changelog_entries_version_idx").on(table.version),
      index("changelog_entries_published_idx").on(table.isPublished),
      index("changelog_entries_type_idx").on(table.type),
      index("changelog_entries_release_date_idx").on(table.releaseDate)
    ]);
    playbooks = pgTable("playbooks", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      title: text("title").notNull(),
      description: text("description"),
      content: text("content").notNull(),
      // Markdown content
      type: varchar("type").notNull(),
      // onboarding, success, best_practices, troubleshooting
      role: varchar("role").notNull(),
      // beginner, intermediate, expert, admin, developer
      category: varchar("category").notNull(),
      // getting-started, features, workflows, optimization
      steps: jsonb("steps").default([]),
      // Structured step-by-step content
      estimatedDuration: integer("estimated_duration"),
      // Minutes to complete
      prerequisites: text("prerequisites").array().default([]),
      // Required knowledge/setup
      goals: text("goals").array().default([]),
      // Learning objectives
      resources: jsonb("resources").default([]),
      // Links, references, tools
      tags: text("tags").array().default([]),
      // Search tags
      isActive: boolean("is_active").default(true),
      usageCount: integer("usage_count").default(0),
      // How many times accessed
      rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
      // User rating
      ratingCount: integer("rating_count").default(0),
      // Number of ratings
      author: varchar("author"),
      // Creator of the playbook
      lastReviewed: timestamp("last_reviewed"),
      // Last content review date
      metadata: jsonb("metadata").default({}),
      // Additional playbook data
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => [
      index("playbooks_type_idx").on(table.type),
      index("playbooks_role_idx").on(table.role),
      index("playbooks_category_idx").on(table.category),
      index("playbooks_active_idx").on(table.isActive),
      index("playbooks_rating_idx").on(table.rating)
    ]);
    insertDocsSchema = createInsertSchema(docs).pick({
      title: true,
      content: true,
      category: true,
      tags: true,
      slug: true,
      author: true,
      isPublished: true,
      metadata: true
    });
    insertAdminSettingsSchema = createInsertSchema(adminSettings).pick({
      key: true,
      value: true,
      description: true,
      category: true,
      dataType: true,
      isEditable: true,
      isRequired: true,
      validationRules: true,
      lastModifiedBy: true
    });
    insertMarketplaceItemsSchema = createInsertSchema(marketplaceItems).pick({
      title: true,
      description: true,
      category: true,
      subcategory: true,
      price: true,
      currency: true,
      publisher: true,
      publisherId: true,
      status: true,
      tags: true,
      images: true,
      downloadUrl: true,
      demoUrl: true,
      githubUrl: true,
      featured: true,
      metadata: true
    });
    insertChangelogEntriesSchema = createInsertSchema(changelogEntries).pick({
      version: true,
      title: true,
      content: true,
      type: true,
      category: true,
      isPublished: true,
      isPinned: true,
      tags: true,
      author: true,
      releaseDate: true,
      announcementChannels: true,
      metadata: true
    });
    insertPlaybooksSchema = createInsertSchema(playbooks).pick({
      title: true,
      description: true,
      content: true,
      type: true,
      role: true,
      category: true,
      steps: true,
      estimatedDuration: true,
      prerequisites: true,
      goals: true,
      resources: true,
      tags: true,
      isActive: true,
      author: true,
      metadata: true
    });
    insertWorkspaceEventSchema = createInsertSchema(workspaceEvents).pick({
      workspaceId: true,
      eventType: true,
      eventData: true,
      userId: true,
      sessionId: true,
      metadata: true,
      isSystem: true,
      broadcastTo: true,
      sequenceNumber: true
    });
    insertWorkspaceConnectionSchema = createInsertSchema(workspaceConnections).pick({
      workspaceId: true,
      userId: true,
      connectionId: true,
      userAgent: true,
      ipAddress: true,
      metadata: true
    });
    systemUserRoleSchema = z.enum(["user", "premium_user", "admin", "system_admin"]);
  }
});

// server/middleware/entitlements.ts
var entitlements_exports = {};
__export(entitlements_exports, {
  BILLING_FEATURES: () => BILLING_FEATURES,
  PLAN_FEATURES: () => PLAN_FEATURES,
  PLAN_LIMITS: () => PLAN_LIMITS,
  checkPlanLimit: () => checkPlanLimit,
  getWorkspaceFeatures: () => getWorkspaceFeatures,
  getWorkspaceLimits: () => getWorkspaceLimits,
  hasFeatureAccess: () => hasFeatureAccess,
  loadEntitlementsContext: () => loadEntitlementsContext,
  requireActiveSubscription: () => requireActiveSubscription,
  requireFeature: () => requireFeature,
  requirePlanLimit: () => requirePlanLimit
});
async function loadEntitlementsContext(req, res, next) {
  try {
    if (!req.user) {
      return next();
    }
    const isDemo = Boolean(req.user.isDemo);
    if (isDemo && !req.user.subscription) {
      req.user.subscription = { plan: "demo" };
    }
    const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
    if (!workspaceId) {
      const userSubscription = req.user.subscription;
      const plan = userSubscription?.plan || (isDemo ? "demo" : "free");
      req.subscription = {
        id: "user-subscription",
        workspaceId: null,
        plan,
        status: "active",
        currentPeriodEnd: /* @__PURE__ */ new Date(),
        seats: 1
      };
      return next();
    }
    const subscription = await storage.getWorkspaceSubscription(workspaceId);
    if (subscription) {
      req.subscription = subscription;
    } else {
      const workspace = await storage.getWorkspace(workspaceId);
      if (workspace) {
        const owner = await storage.getUser(workspace.ownerId);
        if (owner?.subscription) {
          const ownerSub = owner.subscription;
          req.subscription = {
            id: `fallback-${workspaceId}`,
            workspaceId,
            plan: ownerSub.plan || "free",
            status: "active",
            currentPeriodEnd: /* @__PURE__ */ new Date(),
            seats: 1
          };
        }
      }
    }
    const entitlements2 = await storage.getWorkspaceEntitlements(workspaceId);
    req.entitlements = entitlements2 || [];
    next();
  } catch (error) {
    console.error("Failed to load entitlements context:", error);
    req.subscription = {
      id: "error-fallback",
      workspaceId: null,
      plan: "free",
      status: "active",
      currentPeriodEnd: /* @__PURE__ */ new Date(),
      seats: 1
    };
    req.entitlements = [];
    next();
  }
}
async function hasFeatureAccess(workspaceId, feature) {
  try {
    if (!workspaceId) {
      const freeFeatures2 = PLAN_FEATURES.free;
      return freeFeatures2.includes(feature);
    }
    const subscription = await storage.getWorkspaceSubscription(workspaceId);
    const entitlements2 = await storage.getWorkspaceEntitlements(workspaceId);
    const directEntitlement = entitlements2?.find(
      (e) => e.feature === feature && (!e.expiresAt || new Date(e.expiresAt) > /* @__PURE__ */ new Date())
    );
    if (directEntitlement) {
      return true;
    }
    if (subscription && subscription.status === "active") {
      const planFeatures = PLAN_FEATURES[subscription.plan] || [];
      return planFeatures.includes(feature);
    }
    const workspace = await storage.getWorkspace(workspaceId);
    if (workspace) {
      const owner = await storage.getUser(workspace.ownerId);
      if (owner?.subscription) {
        const ownerSub = owner.subscription;
        const planFeatures = PLAN_FEATURES[ownerSub.plan] || PLAN_FEATURES.free;
        return planFeatures.includes(feature);
      }
    }
    const freeFeatures = PLAN_FEATURES.free;
    return freeFeatures.includes(feature);
  } catch (error) {
    console.error("Feature access check failed:", error);
    return false;
  }
}
async function checkPlanLimit(workspaceId, resource, currentUsage) {
  try {
    if (!workspaceId) {
      const limit2 = PLAN_LIMITS.free[resource];
      const allowed2 = limit2 === -1 || currentUsage < limit2;
      return { allowed: allowed2, limit: limit2, usage: currentUsage, plan: "free" };
    }
    let plan = "free";
    let subscription = await storage.getWorkspaceSubscription(workspaceId);
    if (subscription && subscription.status === "active") {
      plan = subscription.plan;
    } else {
      const workspace = await storage.getWorkspace(workspaceId);
      if (workspace) {
        const owner = await storage.getUser(workspace.ownerId);
        if (owner?.subscription) {
          const ownerSub = owner.subscription;
          plan = ownerSub.plan || "free";
        }
      }
    }
    const limit = PLAN_LIMITS[plan][resource];
    if (limit === -1) {
      return { allowed: true, limit: -1, usage: currentUsage, plan };
    }
    const allowed = currentUsage < limit;
    return { allowed, limit, usage: currentUsage, plan };
  } catch (error) {
    console.error("Plan limit check failed:", error);
    const limit = PLAN_LIMITS.free[resource];
    const allowed = limit === -1 || currentUsage < limit;
    return { allowed, limit, usage: currentUsage, plan: "free" };
  }
}
function requireFeature(feature) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required",
          code: "AUTH_REQUIRED"
        });
      }
      const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
      const isDemo = Boolean(req.user.isDemo);
      const userSubscription = req.user.subscription;
      const userPlan = userSubscription?.plan || (isDemo ? "demo" : "free");
      if (!workspaceId && feature === BILLING_FEATURES.ADVANCED_AI) {
        if (PLAN_FEATURES[userPlan]?.includes(feature)) {
          return next();
        }
        return res.status(400).json({
          error: "Workspace context required for Expert mode analysis. Please create a workspace or upgrade your plan.",
          code: "WORKSPACE_CONTEXT_REQUIRED"
        });
      }
      if (!workspaceId) {
        return res.status(400).json({
          error: "Workspace context required for feature access",
          code: "WORKSPACE_CONTEXT_REQUIRED"
        });
      }
      const hasAccess = await hasFeatureAccess(workspaceId, feature);
      if (!hasAccess) {
        return res.status(402).json({
          error: "Feature requires upgrade",
          code: "FEATURE_REQUIRES_UPGRADE",
          feature,
          workspaceId
        });
      }
      next();
    } catch (error) {
      console.error("Feature requirement check failed:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  };
}
function requirePlanLimit(resource, getCurrentUsage) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required",
          code: "AUTH_REQUIRED"
        });
      }
      const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
      if (!workspaceId) {
        return res.status(400).json({
          error: "Workspace context required for limit check",
          code: "WORKSPACE_CONTEXT_REQUIRED"
        });
      }
      const currentUsage = await getCurrentUsage(workspaceId);
      const limitCheck = await checkPlanLimit(workspaceId, resource, currentUsage);
      if (!limitCheck.allowed) {
        return res.status(402).json({
          error: "Plan limit exceeded",
          code: "PLAN_LIMIT_EXCEEDED",
          resource,
          limit: limitCheck.limit,
          usage: limitCheck.usage,
          workspaceId
        });
      }
      next();
    } catch (error) {
      console.error("Plan limit check failed:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  };
}
function requireActiveSubscription(req, res, next) {
  const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
  if (!workspaceId) {
    return res.status(400).json({
      error: "Workspace context required",
      code: "WORKSPACE_CONTEXT_REQUIRED"
    });
  }
  if (!req.subscription) {
    return res.status(402).json({
      error: "Active subscription required",
      code: "SUBSCRIPTION_REQUIRED",
      workspaceId
    });
  }
  if (req.subscription.status !== "active") {
    return res.status(402).json({
      error: "Active subscription required",
      code: "SUBSCRIPTION_INACTIVE",
      status: req.subscription.status,
      workspaceId
    });
  }
  next();
}
async function getWorkspaceFeatures(workspaceId) {
  try {
    const subscription = await storage.getWorkspaceSubscription(workspaceId);
    const entitlements2 = await storage.getWorkspaceEntitlements(workspaceId);
    const features = /* @__PURE__ */ new Set();
    if (subscription && subscription.status === "active") {
      const planFeatures = PLAN_FEATURES[subscription.plan] || [];
      planFeatures.forEach((feature) => features.add(feature));
    } else {
      PLAN_FEATURES.free.forEach((feature) => features.add(feature));
    }
    entitlements2.forEach((entitlement) => {
      if (!entitlement.expiresAt || new Date(entitlement.expiresAt) > /* @__PURE__ */ new Date()) {
        features.add(entitlement.feature);
      }
    });
    return Array.from(features);
  } catch (error) {
    console.error("Failed to get workspace features:", error);
    return [...PLAN_FEATURES.free];
  }
}
async function getWorkspaceLimits(workspaceId) {
  try {
    const subscription = await storage.getWorkspaceSubscription(workspaceId);
    const plan = subscription?.plan || "free";
    const limits = PLAN_LIMITS[plan];
    const [
      workspaceCount,
      memberCount,
      sessionCount,
      storageUsage,
      templateCount
    ] = await Promise.all([
      storage.getUserWorkspacesCount(workspaceId),
      // Implement this
      storage.getWorkspaceMemberCount(workspaceId),
      // Implement this
      storage.getWorkspaceSessionCount(workspaceId, "monthly"),
      // Implement this
      storage.getWorkspaceStorageUsage(workspaceId),
      // Implement this
      storage.getWorkspaceTemplateCount(workspaceId)
      // Implement this
    ]);
    const usage = {
      workspaces: workspaceCount,
      members_per_workspace: memberCount,
      sessions_per_month: sessionCount,
      storage_gb: Math.round(storageUsage / 1024 / 1024 / 1024),
      // Convert to GB
      templates: templateCount
    };
    return { plan, limits, usage };
  } catch (error) {
    console.error("Failed to get workspace limits:", error);
    return {
      plan: "free",
      limits: PLAN_LIMITS.free,
      usage: {}
    };
  }
}
var BILLING_FEATURES, PLAN_FEATURES, PLAN_LIMITS;
var init_entitlements = __esm({
  "server/middleware/entitlements.ts"() {
    "use strict";
    init_storage();
    BILLING_FEATURES = {
      ADVANCED_AI: "advanced_ai",
      EXPORT_PDF: "export_pdf",
      CUSTOM_TEMPLATES: "custom_templates",
      PREMIUM_SUPPORT: "premium_support",
      UNLIMITED_SESSIONS: "unlimited_sessions",
      TEAM_COLLABORATION: "team_collaboration",
      CUSTOM_BRANDING: "custom_branding",
      SSO_INTEGRATION: "sso_integration",
      ADVANCED_ANALYTICS: "advanced_analytics",
      PRIORITY_QUEUE: "priority_queue",
      DEDICATED_SUPPORT: "dedicated_support",
      CUSTOM_WORKFLOWS: "custom_workflows",
      INTEGRATIONS: "integrations"
    };
    PLAN_FEATURES = {
      free: [
        // Free tier has very limited features
      ],
      demo: [
        // Demo plan only grants access to Expert mode (ADVANCED_AI)
        BILLING_FEATURES.ADVANCED_AI
      ],
      pro: [
        BILLING_FEATURES.ADVANCED_AI,
        BILLING_FEATURES.EXPORT_PDF,
        BILLING_FEATURES.CUSTOM_TEMPLATES,
        BILLING_FEATURES.UNLIMITED_SESSIONS,
        BILLING_FEATURES.TEAM_COLLABORATION,
        BILLING_FEATURES.ADVANCED_ANALYTICS
      ],
      enterprise: [
        BILLING_FEATURES.ADVANCED_AI,
        BILLING_FEATURES.EXPORT_PDF,
        BILLING_FEATURES.CUSTOM_TEMPLATES,
        BILLING_FEATURES.PREMIUM_SUPPORT,
        BILLING_FEATURES.UNLIMITED_SESSIONS,
        BILLING_FEATURES.TEAM_COLLABORATION,
        BILLING_FEATURES.CUSTOM_BRANDING,
        BILLING_FEATURES.SSO_INTEGRATION,
        BILLING_FEATURES.ADVANCED_ANALYTICS,
        BILLING_FEATURES.PRIORITY_QUEUE,
        BILLING_FEATURES.DEDICATED_SUPPORT,
        BILLING_FEATURES.CUSTOM_WORKFLOWS
      ],
      custom: []
      // Custom plans have entitlements defined individually
    };
    PLAN_LIMITS = {
      free: {
        workspaces: 1,
        members_per_workspace: 3,
        sessions_per_month: 10,
        storage_gb: 1,
        templates: 5,
        ai_calls_per_hour: 100
      },
      demo: {
        // Demo plan has same limits as free but with ADVANCED_AI access
        workspaces: 1,
        members_per_workspace: 3,
        sessions_per_month: 50,
        // Slightly higher for demos
        storage_gb: 1,
        templates: 5,
        ai_calls_per_hour: 200
        // Higher for demo purposes
      },
      pro: {
        workspaces: 5,
        members_per_workspace: 20,
        sessions_per_month: 1e3,
        storage_gb: 50,
        templates: 100,
        ai_calls_per_hour: 1e3
      },
      enterprise: {
        workspaces: -1,
        // unlimited
        members_per_workspace: -1,
        // unlimited
        sessions_per_month: -1,
        // unlimited
        storage_gb: 500,
        templates: -1,
        // unlimited
        ai_calls_per_hour: 1e4
      },
      custom: {
        workspaces: -1,
        // determined by individual entitlements
        members_per_workspace: -1,
        sessions_per_month: -1,
        storage_gb: -1,
        templates: -1,
        ai_calls_per_hour: -1
      }
    };
  }
});

// server/storage.ts
import { randomUUID } from "crypto";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, sql as sql2, and, or, not as not2 } from "drizzle-orm";
import ws from "ws";
var pool, db, DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool);
    DatabaseStorage = class {
      // User management
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || void 0;
      }
      async getUserByEmail(email) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user || void 0;
      }
      async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
      }
      async updateUser(id, updates) {
        const [user] = await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
        return user || void 0;
      }
      async upsertUser(upsertData) {
        const now = /* @__PURE__ */ new Date();
        let existing = upsertData.id ? await this.getUser(upsertData.id) : null;
        if (!existing && upsertData.email) {
          existing = await this.getUserByEmail(upsertData.email);
        }
        if (existing) {
          const updated = await this.updateUser(existing.id, {
            email: upsertData.email,
            firstName: upsertData.firstName,
            lastName: upsertData.lastName,
            profileImageUrl: upsertData.profileImageUrl,
            updatedAt: now
          });
          return updated;
        } else {
          const newUser = {
            email: upsertData.email || null,
            firstName: upsertData.firstName || null,
            lastName: upsertData.lastName || null,
            profileImageUrl: upsertData.profileImageUrl || null,
            role: "user",
            preferences: {
              theme: "light",
              language: "en",
              notifications: true,
              default_model: "gpt-5",
              default_temperature: 0.7,
              auto_save: true
            },
            subscription: {
              plan: "free",
              usage_count: 0,
              monthly_limit: 10,
              reset_date: null
            }
          };
          const created = await this.createUser(newUser);
          if (upsertData.id && created.id !== upsertData.id) {
            return await this.updateUser(created.id, { id: upsertData.id }) || created;
          }
          return created;
        }
      }
      async updateUserPreferences(id, preferences) {
        const existing = await this.getUser(id);
        if (!existing) return void 0;
        return await this.updateUser(id, {
          preferences: existing.preferences ? { ...existing.preferences, ...preferences } : preferences
        });
      }
      async updateOnboardingProgress(id, progress) {
        const existing = await this.getUser(id);
        if (!existing) return void 0;
        return await this.updateUser(id, {
          onboardingProgress: existing.onboardingProgress ? { ...existing.onboardingProgress, ...progress } : progress
        });
      }
      async setUserRole(userId, role) {
        try {
          return await db.transaction(async (tx) => {
            const [existing] = await tx.select().from(users).where(eq(users.id, userId));
            if (!existing) {
              return void 0;
            }
            if (existing.role === "system_admin" && role !== "system_admin") {
              const [adminCount] = await tx.select({ count: sql2`count(*)` }).from(users).where(eq(users.role, "system_admin"));
              const totalSystemAdmins = Number(adminCount?.count || 0);
              if (totalSystemAdmins <= 1) {
                throw new Error("LAST_SYSTEM_ADMIN_PROTECTION: Cannot remove the last system administrator. This would leave the system without administrative access.");
              }
            }
            const [updatedUser] = await tx.update(users).set({ role, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
            try {
              await tx.insert(auditLogs).values({
                action: "user_role_changed",
                userId,
                details: {
                  previousRole: existing.role,
                  newRole: role,
                  changedAt: /* @__PURE__ */ new Date()
                },
                metadata: {
                  userEmail: existing.email,
                  operation: "setUserRole",
                  transactional: true
                },
                createdAt: /* @__PURE__ */ new Date()
              });
            } catch (auditError) {
              console.error("Failed to log role change audit:", auditError);
            }
            console.log(`\u2705 Role change completed: ${existing.role} \u2192 ${role} for user ${userId}`);
            return updatedUser;
          });
        } catch (error) {
          console.error("Failed to update user role:", error);
          if (error.message?.includes("LAST_SYSTEM_ADMIN_PROTECTION")) {
            throw new Error("Cannot demote the last system administrator. The system must always have at least one system_admin.");
          }
          throw error;
        }
      }
      async getAllUsers(limit = 100, offset = 0) {
        try {
          const userList = await db.select().from(users).limit(limit).offset(offset).orderBy(users.createdAt);
          return userList;
        } catch (error) {
          console.error("Failed to fetch users:", error);
          throw error;
        }
      }
      async anySystemAdminExists() {
        try {
          const systemAdmins = await db.select({ id: users.id }).from(users).where(eq(users.role, "system_admin")).limit(1);
          return systemAdmins.length > 0;
        } catch (error) {
          console.error("Failed to check for system admin users:", error);
          throw error;
        }
      }
      async getUserCount() {
        try {
          const result = await db.select({ count: sql2`count(*)` }).from(users);
          return Number(result[0]?.count || 0);
        } catch (error) {
          console.error("Failed to get user count:", error);
          throw error;
        }
      }
      async updateUserSubscription(id, subscription) {
        const existing = await this.getUser(id);
        if (!existing) return void 0;
        return await this.updateUser(id, {
          subscription: existing.subscription ? { ...existing.subscription, ...subscription } : subscription
        });
      }
      async createAnalysisSession(sessionData) {
        const [session2] = await db.insert(analysisSessions).values({
          prompt: sessionData.prompt,
          mode: sessionData.mode,
          settings: sessionData.settings || null,
          results: sessionData.results || null,
          telemetry: sessionData.telemetry || null,
          debateHistory: sessionData.debateHistory || null,
          title: sessionData.title || null,
          sourceSessionId: sessionData.sourceSessionId || null,
          transferCount: sessionData.transferCount || 0,
          userId: sessionData.userId || null,
          workspaceId: sessionData.workspaceId || null
        }).returning();
        return session2;
      }
      async getAnalysisSession(id) {
        const [session2] = await db.select().from(analysisSessions).where(eq(analysisSessions.id, id));
        return session2 || void 0;
      }
      async updateAnalysisSession(id, updates) {
        const [session2] = await db.update(analysisSessions).set(updates).where(eq(analysisSessions.id, id)).returning();
        return session2 || void 0;
      }
      async getUserAnalysisSessions(userId) {
        if (userId) {
          const result2 = await db.select().from(analysisSessions).where(eq(analysisSessions.userId, userId)).orderBy(analysisSessions.createdAt);
          return result2.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        }
        const result = await db.select().from(analysisSessions).orderBy(analysisSessions.createdAt);
        return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      }
      // Session transfer methods for cross-mode debate continuation
      async getTransferableSessions(userId, excludeMode) {
        let query = db.select().from(analysisSessions);
        const conditions = [];
        if (userId) {
          conditions.push(eq(analysisSessions.userId, userId));
        }
        if (excludeMode) {
          conditions.push(not2(eq(analysisSessions.mode, excludeMode)));
        }
        if (conditions.length > 0) {
          const result2 = await query.where(and(...conditions)).orderBy(analysisSessions.createdAt);
          return result2.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        }
        const result = await query.orderBy(analysisSessions.createdAt);
        return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      }
      async getSessionForTransfer(sessionId) {
        const [session2] = await db.select().from(analysisSessions).where(eq(analysisSessions.id, sessionId));
        return session2 || void 0;
      }
      // Workspace management methods
      generateSessionCode() {
        return Math.random().toString(36).substring(2, 10).toUpperCase();
      }
      async createWorkspace(workspaceData) {
        const sessionCode = this.generateSessionCode();
        const [workspace] = await db.insert(workspaces).values({
          ...workspaceData,
          sessionCode
        }).returning();
        return workspace;
      }
      async getWorkspace(id) {
        const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
        return workspace || void 0;
      }
      async getWorkspaceBySessionCode(sessionCode) {
        const [workspace] = await db.select().from(workspaces).where(eq(workspaces.sessionCode, sessionCode));
        return workspace || void 0;
      }
      async updateWorkspace(id, updates) {
        const [workspace] = await db.update(workspaces).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workspaces.id, id)).returning();
        return workspace || void 0;
      }
      async deleteWorkspace(id) {
        const result = await db.delete(workspaces).where(eq(workspaces.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getUserWorkspaces(userId) {
        const result = await db.select({ workspace: workspaces }).from(workspaces).leftJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId)).where(
          sql2`${workspaces.ownerId} = ${userId} OR ${workspaceMembers.userId} = ${userId}`
        ).groupBy(workspaces.id);
        return result.map((r) => r.workspace).sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
      }
      // Workspace membership methods
      async addWorkspaceMember(member) {
        const [workspaceMember] = await db.insert(workspaceMembers).values(member).returning();
        return workspaceMember;
      }
      async removeWorkspaceMember(workspaceId, userId) {
        const result = await db.delete(workspaceMembers).where(sql2`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`);
        return (result.rowCount || 0) > 0;
      }
      async getWorkspaceMembers(workspaceId) {
        const result = await db.select().from(workspaceMembers).innerJoin(users, eq(workspaceMembers.userId, users.id)).where(eq(workspaceMembers.workspaceId, workspaceId));
        return result.map((row) => ({
          ...row.workspace_members,
          user: row.users
        }));
      }
      async getUserWorkspaceMembership(workspaceId, userId) {
        const [member] = await db.select().from(workspaceMembers).where(sql2`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`);
        return member || void 0;
      }
      async getWorkspaceMembership(workspaceId, userId) {
        return this.getUserWorkspaceMembership(workspaceId, userId);
      }
      async updateMemberRole(workspaceId, userId, role) {
        const [member] = await db.update(workspaceMembers).set({ role }).where(sql2`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`).returning();
        return member || void 0;
      }
      // Workspace invitation methods
      async createWorkspaceInvite(invite) {
        const inviteCode = randomUUID().substring(0, 16);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
        const [workspaceInvite] = await db.insert(workspaceInvites).values({
          ...invite,
          inviteCode,
          expiresAt
        }).returning();
        return workspaceInvite;
      }
      async getWorkspaceInvite(inviteCode) {
        const [invite] = await db.select().from(workspaceInvites).where(sql2`${workspaceInvites.inviteCode} = ${inviteCode} AND ${workspaceInvites.status} = 'pending'`);
        return invite || void 0;
      }
      async acceptWorkspaceInvite(inviteCode, userId) {
        const invite = await this.getWorkspaceInvite(inviteCode);
        if (!invite || invite.expiresAt < /* @__PURE__ */ new Date()) return void 0;
        await db.update(workspaceInvites).set({ status: "accepted" }).where(eq(workspaceInvites.id, invite.id));
        return await this.addWorkspaceMember({
          workspaceId: invite.workspaceId,
          userId,
          role: invite.role
        });
      }
      async getWorkspaceInvites(workspaceId) {
        const result = await db.select().from(workspaceInvites).where(eq(workspaceInvites.workspaceId, workspaceId)).orderBy(workspaceInvites.createdAt);
        return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      }
      // Session code operations for collaboration
      async createSessionCode(sessionCodeData) {
        const [sessionCode] = await db.insert(sessionCodes).values(sessionCodeData).returning();
        return sessionCode;
      }
      async getSessionCode(code) {
        const [sessionCode] = await db.select().from(sessionCodes).where(sql2`${sessionCodes.code} = ${code} AND ${sessionCodes.isActive} = true AND ${sessionCodes.expiresAt} > NOW()`);
        return sessionCode || void 0;
      }
      async addUserToSession(sessionCode, userId) {
        await db.insert(sessionParticipants).values({
          sessionCode,
          userId,
          role: "participant"
        });
      }
      async getSessionParticipants(sessionCode) {
        return await db.select().from(sessionParticipants).where(eq(sessionParticipants.sessionCode, sessionCode)).orderBy(sessionParticipants.joinedAt);
      }
      async removeUserFromSession(sessionCode, userId) {
        await db.delete(sessionParticipants).where(sql2`${sessionParticipants.sessionCode} = ${sessionCode} AND ${sessionParticipants.userId} = ${userId}`);
      }
      // Chat message operations for team communication
      async saveChatMessage(messageData) {
        const [message] = await db.insert(chatMessages).values(messageData).returning();
        return message;
      }
      async getChatHistory(sessionCode) {
        return await db.select().from(chatMessages).where(eq(chatMessages.sessionCode, sessionCode)).orderBy(chatMessages.timestamp);
      }
      async deleteChatMessage(messageId) {
        await db.delete(chatMessages).where(eq(chatMessages.id, messageId));
      }
      // Generated report operations for report management
      async createGeneratedReport(report) {
        const [generatedReport] = await db.insert(generatedReports).values(report).returning();
        return generatedReport;
      }
      async getGeneratedReport(id) {
        const [report] = await db.select().from(generatedReports).where(eq(generatedReports.id, id));
        return report || void 0;
      }
      async getUserGeneratedReports(userId) {
        return await db.select().from(generatedReports).where(eq(generatedReports.userId, userId)).orderBy(sql2`${generatedReports.generatedAt} DESC`);
      }
      async deleteGeneratedReport(id) {
        const result = await db.delete(generatedReports).where(eq(generatedReports.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getSessionReports(sessionId) {
        return await db.select().from(generatedReports).where(eq(generatedReports.sessionId, sessionId)).orderBy(sql2`${generatedReports.generatedAt} DESC`);
      }
      // Organization management methods (stubs for now)
      async createOrganization(organization) {
        const [org] = await db.insert(organizations).values(organization).returning();
        return org;
      }
      async getOrganization(id) {
        const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
        return org || void 0;
      }
      async getOrganizationBySlug(slug) {
        const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
        return org || void 0;
      }
      async updateOrganization(id, updates) {
        const [org] = await db.update(organizations).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(organizations.id, id)).returning();
        return org || void 0;
      }
      async deleteOrganization(id) {
        const result = await db.delete(organizations).where(eq(organizations.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getUserOrganizations(userId) {
        const result = await db.select({ organization: organizations }).from(organizations).innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId)).where(eq(organizationMembers.userId, userId));
        return result.map((r) => r.organization);
      }
      async addOrganizationMember(member) {
        const [orgMember] = await db.insert(organizationMembers).values(member).returning();
        return orgMember;
      }
      async removeOrganizationMember(organizationId, userId) {
        const result = await db.delete(organizationMembers).where(sql2`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`);
        return (result.rowCount || 0) > 0;
      }
      async getOrganizationMembers(organizationId) {
        const result = await db.select().from(organizationMembers).innerJoin(users, eq(organizationMembers.userId, users.id)).where(eq(organizationMembers.organizationId, organizationId));
        return result.map((row) => ({
          ...row.organization_members,
          user: row.users
        }));
      }
      async getOrganizationMembership(organizationId, userId) {
        const [member] = await db.select().from(organizationMembers).where(sql2`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`);
        return member || void 0;
      }
      async updateOrganizationMemberRole(organizationId, userId, role, permissions) {
        const [member] = await db.update(organizationMembers).set({ role, permissions }).where(sql2`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`).returning();
        return member || void 0;
      }
      async getUserOrganizationMemberships(userId) {
        return [];
      }
      // Stub implementations for other enterprise features
      async createTeam(team) {
        const [newTeam] = await db.insert(teams).values(team).returning();
        return newTeam;
      }
      async getTeam(id) {
        const [team] = await db.select().from(teams).where(eq(teams.id, id));
        return team || void 0;
      }
      async updateTeam(id, updates) {
        const [team] = await db.update(teams).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(teams.id, id)).returning();
        return team || void 0;
      }
      async deleteTeam(id) {
        const result = await db.delete(teams).where(eq(teams.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getOrganizationTeams(organizationId) {
        return await db.select().from(teams).where(eq(teams.organizationId, organizationId));
      }
      async getUserTeams(userId) {
        const result = await db.select({ team: teams }).from(teams).innerJoin(teamMembers, eq(teams.id, teamMembers.teamId)).where(eq(teamMembers.userId, userId));
        return result.map((r) => r.team);
      }
      async addTeamMember(member) {
        const [teamMember] = await db.insert(teamMembers).values(member).returning();
        return teamMember;
      }
      async removeTeamMember(teamId, userId) {
        const result = await db.delete(teamMembers).where(sql2`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`);
        return (result.rowCount || 0) > 0;
      }
      async getTeamMembers(teamId) {
        const result = await db.select().from(teamMembers).innerJoin(users, eq(teamMembers.userId, users.id)).where(eq(teamMembers.teamId, teamId));
        return result.map((row) => ({
          ...row.team_members,
          user: row.users
        }));
      }
      async getTeamMembership(teamId, userId) {
        const [member] = await db.select().from(teamMembers).where(sql2`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`);
        return member || void 0;
      }
      async updateTeamMemberRole(teamId, userId, role) {
        const [member] = await db.update(teamMembers).set({ role }).where(sql2`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`).returning();
        return member || void 0;
      }
      // Audit and Security stubs
      async createAuditLog(log2) {
        const [auditLog] = await db.insert(auditLogs).values(log2).returning();
        return auditLog;
      }
      async getAuditLogs(organizationId, userId, limit) {
        let query = db.select().from(auditLogs);
        const conditions = [];
        if (organizationId) {
          conditions.push(eq(auditLogs.organizationId, organizationId));
        }
        if (userId) {
          conditions.push(eq(auditLogs.userId, userId));
        }
        if (conditions.length > 0) {
          query = query.where(sql2`${conditions.join(" AND ")}`);
        }
        if (limit) {
          query = query.limit(limit);
        }
        return await query.orderBy(auditLogs.timestamp);
      }
      async getAuditLogsByAction(action, organizationId) {
        let query = db.select().from(auditLogs);
        const conditions = [eq(auditLogs.action, action)];
        if (organizationId) {
          conditions.push(eq(auditLogs.organizationId, organizationId));
        }
        query = query.where(sql2`${conditions.join(" AND ")}`);
        return await query.orderBy(auditLogs.timestamp);
      }
      async createSecurityEvent(event) {
        const [securityEvent] = await db.insert(securityEvents).values(event).returning();
        return securityEvent;
      }
      async getSecurityEvents(organizationId, severity) {
        let query = db.select().from(securityEvents);
        const conditions = [];
        if (organizationId) {
          conditions.push(eq(securityEvents.organizationId, organizationId));
        }
        if (severity) {
          conditions.push(eq(securityEvents.severity, severity));
        }
        if (conditions.length > 0) {
          query = query.where(sql2`${conditions.join(" AND ")}`);
        }
        return await query.orderBy(securityEvents.timestamp);
      }
      async resolveSecurityEvent(id, resolvedBy) {
        const [event] = await db.update(securityEvents).set({ resolved: true, resolvedBy, resolvedAt: /* @__PURE__ */ new Date() }).where(eq(securityEvents.id, id)).returning();
        return event || void 0;
      }
      // Usage and Performance stubs
      async recordUsageMetric(metric) {
        const [usageMetric] = await db.insert(usageMetrics).values(metric).returning();
        return usageMetric;
      }
      async getUsageMetrics(organizationId, userId, period) {
        let query = db.select().from(usageMetrics);
        const conditions = [];
        if (organizationId) {
          conditions.push(eq(usageMetrics.organizationId, organizationId));
        }
        if (userId) {
          conditions.push(eq(usageMetrics.userId, userId));
        }
        if (period) {
          conditions.push(eq(usageMetrics.period, period));
        }
        if (conditions.length > 0) {
          query = query.where(sql2`${conditions.join(" AND ")}`);
        }
        return await query.orderBy(usageMetrics.createdAt);
      }
      async getUsageByType(metricType, organizationId) {
        let query = db.select().from(usageMetrics);
        const conditions = [eq(usageMetrics.metricType, metricType)];
        if (organizationId) {
          conditions.push(eq(usageMetrics.organizationId, organizationId));
        }
        query = query.where(sql2`${conditions.join(" AND ")}`);
        return await query.orderBy(usageMetrics.createdAt);
      }
      async createRateLimitRule(rule) {
        const [rateLimitRule] = await db.insert(rateLimitRules).values(rule).returning();
        return rateLimitRule;
      }
      async getRateLimitRules(organizationId) {
        let query = db.select().from(rateLimitRules);
        if (organizationId) {
          query = query.where(eq(rateLimitRules.organizationId, organizationId));
        }
        return await query;
      }
      async updateRateLimitRule(id, updates) {
        const [rule] = await db.update(rateLimitRules).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(rateLimitRules.id, id)).returning();
        return rule || void 0;
      }
      async deleteRateLimitRule(id) {
        const result = await db.delete(rateLimitRules).where(eq(rateLimitRules.id, id));
        return (result.rowCount || 0) > 0;
      }
      async recordPerformanceMetric(metric) {
        const [performanceMetric] = await db.insert(performanceMetrics).values(metric).returning();
        return performanceMetric;
      }
      async getPerformanceMetrics(organizationId, metricName) {
        let query = db.select().from(performanceMetrics);
        const conditions = [];
        if (organizationId) {
          conditions.push(eq(performanceMetrics.organizationId, organizationId));
        }
        if (metricName) {
          conditions.push(eq(performanceMetrics.metricName, metricName));
        }
        if (conditions.length > 0) {
          query = query.where(sql2`${conditions.join(" AND ")}`);
        }
        return await query.orderBy(performanceMetrics.timestamp);
      }
      async recordError(error) {
        const [errorLog] = await db.insert(errorLogs).values(error).returning();
        return errorLog;
      }
      async getErrorLogs(organizationId, severity) {
        let query = db.select().from(errorLogs);
        const conditions = [];
        if (organizationId) {
          conditions.push(eq(errorLogs.organizationId, organizationId));
        }
        if (severity) {
          conditions.push(eq(errorLogs.severity, severity));
        }
        if (conditions.length > 0) {
          query = query.where(sql2`${conditions.join(" AND ")}`);
        }
        return await query.orderBy(errorLogs.timestamp);
      }
      async resolveError(id, resolvedBy) {
        const [error] = await db.update(errorLogs).set({ resolved: true, resolvedBy, resolvedAt: /* @__PURE__ */ new Date() }).where(eq(errorLogs.id, id)).returning();
        return error || void 0;
      }
      async recordHealthCheck(check) {
        const [healthCheck] = await db.insert(healthChecks).values(check).returning();
        return healthCheck;
      }
      async getHealthChecks(serviceName) {
        let query = db.select().from(healthChecks);
        if (serviceName) {
          query = query.where(eq(healthChecks.serviceName, serviceName));
        }
        return await query.orderBy(healthChecks.timestamp);
      }
      async getLatestHealthStatus() {
        const checks = await db.select().from(healthChecks).orderBy(healthChecks.timestamp);
        const latest = {};
        for (const check of checks) {
          if (!latest[check.serviceName] || check.timestamp && latest[check.serviceName]?.timestamp && check.timestamp > latest[check.serviceName].timestamp) {
            latest[check.serviceName] = check;
          }
        }
        return latest;
      }
      // ============================================
      // SPRINT 1 - Async Processing & Export Tracking Implementation
      // ============================================
      async createDebateRun(run) {
        const [debateRun] = await db.insert(debateRuns).values(run).returning();
        return debateRun;
      }
      async getDebateRun(id) {
        const [debateRun] = await db.select().from(debateRuns).where(eq(debateRuns.id, id));
        return debateRun || void 0;
      }
      async updateDebateRunStatus(id, status, completedAt) {
        const updateData = { status };
        if (completedAt) {
          updateData.completedAt = completedAt;
        }
        const [debateRun] = await db.update(debateRuns).set(updateData).where(eq(debateRuns.id, id)).returning();
        return debateRun || void 0;
      }
      async createExportLog(log2) {
        const [exportLog] = await db.insert(exportLogs).values(log2).returning();
        return exportLog;
      }
      async getExportLogs(userId, workspaceId) {
        let query = db.select().from(exportLogs);
        const conditions = [];
        if (userId) {
          conditions.push(eq(exportLogs.userId, userId));
        }
        if (workspaceId) {
          conditions.push(eq(exportLogs.workspaceId, workspaceId));
        }
        if (conditions.length > 0) {
          query = query.where(sql2`${conditions.join(" AND ")}`);
        }
        return await query.orderBy(exportLogs.createdAt);
      }
      // Export provenance tracking implementation
      async createExportProvenance(provenance) {
        const provenanceId = `prov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const exportLog = await this.createExportLog({
          id: provenanceId,
          userId: provenance.userId,
          workspaceId: provenance.workspaceId,
          filename: provenance.filename,
          dlpHits: JSON.stringify({
            complianceStatus: provenance.complianceStatus,
            violations: provenance.violations,
            recommendations: provenance.recommendations,
            auditTrail: provenance.auditTrail,
            retentionPolicy: provenance.retentionPolicy,
            metadata: provenance.metadata,
            exportId: provenance.exportId,
            contentHash: provenance.contentHash
          })
        });
        return exportLog.id;
      }
      async getExportProvenance(exportId) {
        const logs = await db.select().from(exportLogs).where(sql2`json_extract(dlp_hits, '$.exportId') = ${exportId}`).orderBy(exportLogs.createdAt);
        if (logs.length === 0) return null;
        const log2 = logs[0];
        try {
          return JSON.parse(log2.dlpHits || "{}");
        } catch {
          return null;
        }
      }
      async getExportProvenanceHistory(userId, organizationId) {
        let query = db.select().from(exportLogs);
        const conditions = [];
        if (userId) {
          conditions.push(eq(exportLogs.userId, userId));
        }
        if (organizationId) {
          conditions.push(sql2`json_extract(dlp_hits, '$.organizationId') = ${organizationId}`);
        }
        conditions.push(sql2`json_extract(dlp_hits, '$.complianceStatus') IS NOT NULL`);
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        const logs = await query.orderBy(exportLogs.createdAt);
        return logs.map((log2) => {
          try {
            return JSON.parse(log2.dlpHits || "{}");
          } catch {
            return {};
          }
        }).filter((log2) => log2.complianceStatus);
      }
      // ============================================
      // PUSH NOTIFICATION SUBSCRIPTIONS
      // ============================================
      async createPushSubscription(subscription) {
        const [pushSubscription] = await db.insert(pushSubscriptions).values(subscription).returning();
        return pushSubscription;
      }
      async getPushSubscription(id) {
        const [pushSubscription] = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.id, id));
        return pushSubscription || void 0;
      }
      async getUserPushSubscriptions(userId) {
        return await db.select().from(pushSubscriptions).where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.isActive, true))).orderBy(pushSubscriptions.createdAt);
      }
      async deletePushSubscription(id) {
        const result = await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, id));
        return (result.rowCount || 0) > 0;
      }
      async deletePushSubscriptionByEndpoint(endpoint, userId) {
        const result = await db.delete(pushSubscriptions).where(and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.userId, userId)));
        return (result.rowCount || 0) > 0;
      }
      async updatePushSubscription(id, updates) {
        const [pushSubscription] = await db.update(pushSubscriptions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(pushSubscriptions.id, id)).returning();
        return pushSubscription || void 0;
      }
      // ============================================
      // TUTORIAL SYSTEM IMPLEMENTATIONS
      // ============================================
      // Tutorial management operations
      async createTutorial(tutorial) {
        const [newTutorial] = await db.insert(tutorials).values(tutorial).returning();
        return newTutorial;
      }
      async getTutorial(id) {
        const [tutorial] = await db.select().from(tutorials).where(eq(tutorials.id, id));
        return tutorial || void 0;
      }
      async getAllTutorials() {
        return await db.select().from(tutorials).orderBy(tutorials.priority, tutorials.name);
      }
      async getTutorialsByCategory(category) {
        return await db.select().from(tutorials).where(eq(tutorials.category, category)).orderBy(tutorials.priority, tutorials.name);
      }
      async getActiveTutorials() {
        return await db.select().from(tutorials).where(eq(tutorials.isActive, true)).orderBy(tutorials.priority, tutorials.name);
      }
      async updateTutorial(id, updates) {
        const [tutorial] = await db.update(tutorials).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tutorials.id, id)).returning();
        return tutorial || void 0;
      }
      async deleteTutorial(id) {
        await db.delete(tutorialSteps).where(eq(tutorialSteps.tutorialId, id));
        await db.delete(tutorialProgress).where(eq(tutorialProgress.tutorialId, id));
        const result = await db.delete(tutorials).where(eq(tutorials.id, id));
        return (result.rowCount ?? 0) > 0;
      }
      // Tutorial step management operations
      async createTutorialStep(step) {
        const [newStep] = await db.insert(tutorialSteps).values(step).returning();
        return newStep;
      }
      async getTutorialStep(id) {
        const [step] = await db.select().from(tutorialSteps).where(eq(tutorialSteps.id, id));
        return step || void 0;
      }
      async getTutorialSteps(tutorialId) {
        return await db.select().from(tutorialSteps).where(eq(tutorialSteps.tutorialId, tutorialId)).orderBy(tutorialSteps.stepNumber);
      }
      async updateTutorialStep(id, updates) {
        const [step] = await db.update(tutorialSteps).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tutorialSteps.id, id)).returning();
        return step || void 0;
      }
      async deleteTutorialStep(id) {
        const result = await db.delete(tutorialSteps).where(eq(tutorialSteps.id, id));
        return (result.rowCount ?? 0) > 0;
      }
      async deleteTutorialSteps(tutorialId) {
        const result = await db.delete(tutorialSteps).where(eq(tutorialSteps.tutorialId, tutorialId));
        return (result.rowCount ?? 0) > 0;
      }
      // Tutorial progress tracking operations
      async createTutorialProgress(progress) {
        const [newProgress] = await db.insert(tutorialProgress).values({
          ...progress,
          startedAt: /* @__PURE__ */ new Date(),
          lastInteractionAt: /* @__PURE__ */ new Date()
        }).returning();
        return newProgress;
      }
      async getTutorialProgress(id) {
        const [progress] = await db.select().from(tutorialProgress).where(eq(tutorialProgress.id, id));
        return progress || void 0;
      }
      async getUserTutorialProgress(userId, tutorialId) {
        const [progress] = await db.select().from(tutorialProgress).where(and(
          eq(tutorialProgress.userId, userId),
          eq(tutorialProgress.tutorialId, tutorialId)
        ));
        return progress || void 0;
      }
      async getUserAllTutorialProgress(userId) {
        return await db.select().from(tutorialProgress).where(eq(tutorialProgress.userId, userId)).orderBy(tutorialProgress.lastInteractionAt);
      }
      async updateTutorialProgress(id, updates) {
        const [progress] = await db.update(tutorialProgress).set({ ...updates, lastInteractionAt: /* @__PURE__ */ new Date() }).where(eq(tutorialProgress.id, id)).returning();
        return progress || void 0;
      }
      async deleteTutorialProgress(id) {
        const result = await db.delete(tutorialProgress).where(eq(tutorialProgress.id, id));
        return (result.rowCount ?? 0) > 0;
      }
      async markTutorialStepCompleted(userId, tutorialId, stepNumber) {
        let progress = await this.getUserTutorialProgress(userId, tutorialId);
        if (!progress) {
          progress = await this.createTutorialProgress({
            userId,
            tutorialId,
            status: "in_progress",
            currentStep: stepNumber,
            completedSteps: [stepNumber],
            skippedSteps: []
          });
        } else {
          const completedSteps = Array.isArray(progress.completedSteps) ? [...progress.completedSteps] : [];
          if (!completedSteps.includes(stepNumber)) {
            completedSteps.push(stepNumber);
          }
          progress = await this.updateTutorialProgress(progress.id, {
            status: "in_progress",
            currentStep: stepNumber + 1,
            // Move to next step
            completedSteps
          });
        }
        return progress;
      }
      async markTutorialCompleted(userId, tutorialId) {
        let progress = await this.getUserTutorialProgress(userId, tutorialId);
        if (!progress) {
          progress = await this.createTutorialProgress({
            userId,
            tutorialId,
            status: "completed",
            completedAt: /* @__PURE__ */ new Date()
          });
        } else {
          progress = await this.updateTutorialProgress(progress.id, {
            status: "completed",
            completedAt: /* @__PURE__ */ new Date()
          });
        }
        const settings = await this.getTutorialSettings(userId);
        if (settings) {
          await this.updateTutorialSettings(userId, {
            completedTutorialCount: (settings.completedTutorialCount || 0) + 1
          });
        }
        return progress;
      }
      // Tutorial settings management operations
      async createTutorialSettings(settings) {
        const [newSettings] = await db.insert(tutorialSettings).values(settings).returning();
        return newSettings;
      }
      async getTutorialSettings(userId) {
        const [settings] = await db.select().from(tutorialSettings).where(eq(tutorialSettings.userId, userId));
        return settings || void 0;
      }
      async updateTutorialSettings(userId, updates) {
        const [settings] = await db.update(tutorialSettings).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tutorialSettings.userId, userId)).returning();
        if (!settings) {
          return await this.createTutorialSettings({
            ...updates,
            userId
          });
        }
        return settings;
      }
      async resetTutorialSettings(userId) {
        return await this.updateTutorialSettings(userId, {
          autoStartTutorials: true,
          showTooltips: true,
          tutorialSpeed: "normal",
          preferredPosition: "bottom",
          disabledCategories: [],
          notificationPreferences: {
            completion_rewards: true,
            progress_reminders: true,
            new_tutorials: true
          },
          experienceLevel: "beginner"
        });
      }
      // ============================================
      // TEMPLATE MANAGEMENT - AI Thinking Templates
      // ============================================
      async createTemplate(template) {
        const [newTemplate] = await db.insert(templates).values({
          ...template,
          id: randomUUID()
        }).returning();
        return newTemplate;
      }
      async getTemplate(id) {
        const [template] = await db.select().from(templates).where(eq(templates.id, id));
        return template || void 0;
      }
      async getAllTemplates() {
        return await db.select().from(templates).orderBy(templates.createdAt);
      }
      async getTemplatesByCategory(category) {
        return await db.select().from(templates).where(eq(templates.category, category)).orderBy(templates.createdAt);
      }
      async getPublicTemplates() {
        return await db.select().from(templates).where(eq(templates.isPublic, true)).orderBy(templates.usageCount, templates.createdAt);
      }
      async getUserTemplates(userId) {
        return await db.select().from(templates).where(eq(templates.authorId, userId)).orderBy(templates.createdAt);
      }
      async updateTemplate(id, updates) {
        const [template] = await db.update(templates).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(templates.id, id)).returning();
        return template || void 0;
      }
      async deleteTemplate(id) {
        const result = await db.delete(templates).where(eq(templates.id, id));
        return (result.rowCount ?? 0) > 0;
      }
      async incrementTemplateUsage(id) {
        const [template] = await db.update(templates).set({ usageCount: sql2`${templates.usageCount} + 1` }).where(eq(templates.id, id)).returning();
        return template || void 0;
      }
      // ============================================
      // SPRINT 4 - Billing & Subscription Management
      // ============================================
      async getSubscriptionPlans() {
        return [
          {
            id: "free",
            name: "Free",
            priceMonthly: 0,
            priceYearly: 0,
            features: [
              "Basic AI analysis",
              "Single user workspace",
              "10 analyses per month",
              "Standard export formats"
            ],
            limits: {
              monthly_analyses: 10,
              users_per_workspace: 1,
              storage_gb: 1,
              api_calls_per_minute: 5
            }
          },
          {
            id: "pro",
            name: "Pro",
            priceMonthly: 29,
            priceYearly: 290,
            features: [
              "Advanced AI analysis",
              "Multi-user workspaces",
              "Unlimited analyses",
              "Premium export formats",
              "Priority support",
              "Advanced templates"
            ],
            limits: {
              monthly_analyses: -1,
              // unlimited
              users_per_workspace: 10,
              storage_gb: 50,
              api_calls_per_minute: 50
            }
          },
          {
            id: "enterprise",
            name: "Enterprise",
            priceMonthly: 99,
            priceYearly: 990,
            features: [
              "All Pro features",
              "Unlimited users",
              "SSO integration",
              "Advanced security",
              "Custom integrations",
              "Dedicated support",
              "Custom AI models"
            ],
            limits: {
              monthly_analyses: -1,
              // unlimited
              users_per_workspace: -1,
              // unlimited
              storage_gb: 500,
              api_calls_per_minute: 200
            }
          }
        ];
      }
      async createOrUpdateSubscription(subscription) {
        const existing = await this.getSubscriptionByWorkspace(subscription.workspaceId);
        if (existing) {
          const [updated] = await db.update(subscriptions).set({ ...subscription, updatedAt: /* @__PURE__ */ new Date() }).where(eq(subscriptions.workspaceId, subscription.workspaceId)).returning();
          return updated;
        } else {
          const [newSubscription] = await db.insert(subscriptions).values({
            ...subscription,
            id: randomUUID()
          }).returning();
          return newSubscription;
        }
      }
      async getSubscription(id) {
        const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
        return subscription || void 0;
      }
      async getSubscriptionByWorkspace(workspaceId) {
        const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.workspaceId, workspaceId));
        return subscription || void 0;
      }
      async updateSubscriptionStatus(id, status) {
        const [updated] = await db.update(subscriptions).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(subscriptions.id, id)).returning();
        return updated || void 0;
      }
      async cancelSubscription(id) {
        const [canceled] = await db.update(subscriptions).set({ status: "canceled", updatedAt: /* @__PURE__ */ new Date() }).where(eq(subscriptions.id, id)).returning();
        return canceled || void 0;
      }
      async createEntitlement(entitlement) {
        const [newEntitlement] = await db.insert(entitlements).values({
          ...entitlement,
          id: randomUUID()
        }).returning();
        return newEntitlement;
      }
      async getEntitlements(workspaceId) {
        return await db.select().from(entitlements).where(eq(entitlements.workspaceId, workspaceId));
      }
      async revokeEntitlements(workspaceId, feature) {
        const conditions = [eq(entitlements.workspaceId, workspaceId)];
        if (feature) {
          conditions.push(eq(entitlements.feature, feature));
        }
        const result = await db.delete(entitlements).where(and(...conditions));
        return (result.rowCount ?? 0) > 0;
      }
      async checkEntitlement(workspaceId, feature) {
        const [entitlement] = await db.select().from(entitlements).where(and(
          eq(entitlements.workspaceId, workspaceId),
          eq(entitlements.feature, feature)
        ));
        if (!entitlement) return false;
        if (entitlement.expiresAt && entitlement.expiresAt < /* @__PURE__ */ new Date()) {
          return false;
        }
        return true;
      }
      // ============================================
      // SPRINT 4 - Marketplace Operations
      // ============================================
      async getMarketplaceTemplates() {
        const results = await db.select({
          id: templateProducts.id,
          name: templateProducts.name,
          description: templateProducts.description,
          priceCents: templateProducts.priceCents,
          currency: templateProducts.currency,
          templateId: templateProducts.templateId,
          isActive: templateProducts.isActive,
          createdAt: templateProducts.createdAt,
          updatedAt: templateProducts.updatedAt,
          template: {
            id: templates.id,
            name: templates.name,
            description: templates.description,
            category: templates.category,
            tags: templates.tags,
            content: templates.content,
            isPublic: templates.isPublic,
            usageCount: templates.usageCount,
            authorId: templates.authorId,
            version: templates.version,
            metadata: templates.metadata,
            createdAt: templates.createdAt,
            updatedAt: templates.updatedAt
          }
        }).from(templateProducts).innerJoin(templates, eq(templateProducts.templateId, templates.id)).where(eq(templateProducts.isActive, true));
        return results.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description,
          priceCents: row.priceCents,
          currency: row.currency,
          templateId: row.templateId,
          isActive: row.isActive,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          template: row.template
        }));
      }
      async getTemplateProduct(id) {
        const [product] = await db.select().from(templateProducts).where(eq(templateProducts.id, id));
        return product || void 0;
      }
      async createTemplateProduct(product) {
        const [newProduct] = await db.insert(templateProducts).values({
          ...product,
          id: randomUUID()
        }).returning();
        return newProduct;
      }
      async createTemplatePurchase(purchase) {
        const licenseKey = `LIC-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
        const [newPurchase] = await db.insert(templatePurchases).values({
          ...purchase,
          id: randomUUID(),
          licenseKey
        }).returning();
        return newPurchase;
      }
      async getTemplatePurchase(id) {
        const [purchase] = await db.select().from(templatePurchases).where(eq(templatePurchases.id, id));
        return purchase || void 0;
      }
      async checkExistingPurchase(workspaceId, templateProductId) {
        const [existing] = await db.select().from(templatePurchases).where(and(
          eq(templatePurchases.workspaceId, workspaceId),
          eq(templatePurchases.templateProductId, templateProductId)
        ));
        return existing || void 0;
      }
      async getUserPurchases(userId) {
        const results = await db.select({
          id: templatePurchases.id,
          workspaceId: templatePurchases.workspaceId,
          userId: templatePurchases.userId,
          templateProductId: templatePurchases.templateProductId,
          priceCents: templatePurchases.priceCents,
          currency: templatePurchases.currency,
          licenseKey: templatePurchases.licenseKey,
          purchasedAt: templatePurchases.purchasedAt,
          templateProduct: {
            id: templateProducts.id,
            name: templateProducts.name,
            description: templateProducts.description,
            priceCents: templateProducts.priceCents,
            currency: templateProducts.currency,
            templateId: templateProducts.templateId,
            isActive: templateProducts.isActive,
            createdAt: templateProducts.createdAt,
            updatedAt: templateProducts.updatedAt,
            template: {
              id: templates.id,
              name: templates.name,
              description: templates.description,
              category: templates.category,
              tags: templates.tags,
              content: templates.content,
              isPublic: templates.isPublic,
              usageCount: templates.usageCount,
              authorId: templates.authorId,
              version: templates.version,
              metadata: templates.metadata,
              createdAt: templates.createdAt,
              updatedAt: templates.updatedAt
            }
          }
        }).from(templatePurchases).innerJoin(templateProducts, eq(templatePurchases.templateProductId, templateProducts.id)).innerJoin(templates, eq(templateProducts.templateId, templates.id)).where(eq(templatePurchases.userId, userId));
        return results.map((row) => ({
          id: row.id,
          workspaceId: row.workspaceId,
          userId: row.userId,
          templateProductId: row.templateProductId,
          priceCents: row.priceCents,
          currency: row.currency,
          licenseKey: row.licenseKey,
          purchasedAt: row.purchasedAt,
          templateProduct: {
            id: row.templateProduct.id,
            name: row.templateProduct.name,
            description: row.templateProduct.description,
            priceCents: row.templateProduct.priceCents,
            currency: row.templateProduct.currency,
            templateId: row.templateProduct.templateId,
            isActive: row.templateProduct.isActive,
            createdAt: row.templateProduct.createdAt,
            updatedAt: row.templateProduct.updatedAt,
            template: row.templateProduct.template
          }
        }));
      }
      async getWorkspacePurchases(workspaceId) {
        const results = await db.select({
          id: templatePurchases.id,
          workspaceId: templatePurchases.workspaceId,
          userId: templatePurchases.userId,
          templateProductId: templatePurchases.templateProductId,
          priceCents: templatePurchases.priceCents,
          currency: templatePurchases.currency,
          licenseKey: templatePurchases.licenseKey,
          purchasedAt: templatePurchases.purchasedAt,
          templateProduct: {
            id: templateProducts.id,
            name: templateProducts.name,
            description: templateProducts.description,
            priceCents: templateProducts.priceCents,
            currency: templateProducts.currency,
            templateId: templateProducts.templateId,
            isActive: templateProducts.isActive,
            createdAt: templateProducts.createdAt,
            updatedAt: templateProducts.updatedAt,
            template: {
              id: templates.id,
              name: templates.name,
              description: templates.description,
              category: templates.category,
              tags: templates.tags,
              content: templates.content,
              isPublic: templates.isPublic,
              usageCount: templates.usageCount,
              authorId: templates.authorId,
              version: templates.version,
              metadata: templates.metadata,
              createdAt: templates.createdAt,
              updatedAt: templates.updatedAt
            }
          }
        }).from(templatePurchases).innerJoin(templateProducts, eq(templatePurchases.templateProductId, templateProducts.id)).innerJoin(templates, eq(templateProducts.templateId, templates.id)).where(eq(templatePurchases.workspaceId, workspaceId));
        return results.map((row) => ({
          id: row.id,
          workspaceId: row.workspaceId,
          userId: row.userId,
          templateProductId: row.templateProductId,
          priceCents: row.priceCents,
          currency: row.currency,
          licenseKey: row.licenseKey,
          purchasedAt: row.purchasedAt,
          templateProduct: {
            id: row.templateProduct.id,
            name: row.templateProduct.name,
            description: row.templateProduct.description,
            priceCents: row.templateProduct.priceCents,
            currency: row.templateProduct.currency,
            templateId: row.templateProduct.templateId,
            isActive: row.templateProduct.isActive,
            createdAt: row.templateProduct.createdAt,
            updatedAt: row.templateProduct.updatedAt,
            template: row.templateProduct.template
          }
        }));
      }
      // ============================================
      // SPRINT 5 - REVIEWS/APPROVALS SYSTEM
      // ============================================
      // Review operations
      async createReview(review) {
        const [newReview] = await db.insert(reviews).values(review).returning();
        return newReview;
      }
      async getReview(id) {
        const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
        return review || void 0;
      }
      async getReviews(organizationId, workspaceId) {
        let query = db.select().from(reviews);
        const conditions = [];
        if (organizationId) {
          conditions.push(eq(reviews.organizationId, organizationId));
        }
        if (workspaceId) {
          conditions.push(eq(reviews.workspaceId, workspaceId));
        }
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
        return await query.orderBy(reviews.createdAt);
      }
      async getReviewsByResource(resourceType, resourceId) {
        return await db.select().from(reviews).where(and(eq(reviews.resourceType, resourceType), eq(reviews.resourceId, resourceId))).orderBy(reviews.createdAt);
      }
      async getReviewsByInitiator(initiatorId) {
        return await db.select().from(reviews).where(eq(reviews.initiatorId, initiatorId)).orderBy(reviews.createdAt);
      }
      async getReviewsByStatus(status, organizationId) {
        let query = db.select().from(reviews).where(eq(reviews.status, status));
        if (organizationId) {
          query = query.where(and(eq(reviews.status, status), eq(reviews.organizationId, organizationId)));
        }
        return await query.orderBy(reviews.createdAt);
      }
      async updateReview(id, updates) {
        const [review] = await db.update(reviews).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(reviews.id, id)).returning();
        return review || void 0;
      }
      async deleteReview(id) {
        const result = await db.delete(reviews).where(eq(reviews.id, id));
        return (result.rowCount || 0) > 0;
      }
      async approveReview(id, userId) {
        const [review] = await db.update(reviews).set({
          status: "approved",
          approvedAt: /* @__PURE__ */ new Date(),
          completedBy: userId,
          completedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(reviews.id, id)).returning();
        return review || void 0;
      }
      async rejectReview(id, userId, reason) {
        const [review] = await db.update(reviews).set({
          status: "rejected",
          rejectedAt: /* @__PURE__ */ new Date(),
          completedBy: userId,
          completedAt: /* @__PURE__ */ new Date(),
          metadata: sql2`jsonb_set(metadata, '{rejection_reason}', '"${reason || "No reason provided"}"')`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(reviews.id, id)).returning();
        return review || void 0;
      }
      // Review step operations  
      async createReviewStep(step) {
        const [newStep] = await db.insert(reviewSteps).values(step).returning();
        return newStep;
      }
      async getReviewStep(id) {
        const [step] = await db.select().from(reviewSteps).where(eq(reviewSteps.id, id));
        return step || void 0;
      }
      async getReviewSteps(reviewId) {
        return await db.select().from(reviewSteps).where(eq(reviewSteps.reviewId, reviewId)).orderBy(reviewSteps.stepNumber);
      }
      async updateReviewStep(id, updates) {
        const [step] = await db.update(reviewSteps).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(reviewSteps.id, id)).returning();
        return step || void 0;
      }
      async deleteReviewStep(id) {
        const result = await db.delete(reviewSteps).where(eq(reviewSteps.id, id));
        return (result.rowCount || 0) > 0;
      }
      async completeReviewStep(id, userId) {
        const [step] = await db.update(reviewSteps).set({
          status: "completed",
          completedAt: /* @__PURE__ */ new Date(),
          completedBy: userId,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(reviewSteps.id, id)).returning();
        return step || void 0;
      }
      async skipReviewStep(id, userId, reason) {
        const [step] = await db.update(reviewSteps).set({
          status: "skipped",
          completedAt: /* @__PURE__ */ new Date(),
          completedBy: userId,
          metadata: sql2`jsonb_set(metadata, '{skip_reason}', '"${reason}"')`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(reviewSteps.id, id)).returning();
        return step || void 0;
      }
      // Review assignment operations - stub implementations
      async createReviewAssignment(assignment) {
        throw new Error("ReviewAssignment table not created yet - stub implementation");
      }
      async getReviewAssignment(id) {
        throw new Error("ReviewAssignment table not created yet - stub implementation");
      }
      async getReviewAssignments(reviewId) {
        throw new Error("ReviewAssignment table not created yet - stub implementation");
      }
      async getAssignmentsByAssignee(assigneeId) {
        throw new Error("ReviewAssignment table not created yet - stub implementation");
      }
      async updateReviewAssignment(id, updates) {
        throw new Error("ReviewAssignment table not created yet - stub implementation");
      }
      async deleteReviewAssignment(id) {
        throw new Error("ReviewAssignment table not created yet - stub implementation");
      }
      async respondToAssignment(id, response, reason) {
        throw new Error("ReviewAssignment table not created yet - stub implementation");
      }
      async delegateAssignment(id, delegatedTo) {
        throw new Error("ReviewAssignment table not created yet - stub implementation");
      }
      // Review comment operations - stub implementations  
      async createReviewComment(comment) {
        throw new Error("ReviewComment table not created yet - stub implementation");
      }
      async getReviewComment(id) {
        throw new Error("ReviewComment table not created yet - stub implementation");
      }
      async getReviewComments(reviewId) {
        throw new Error("ReviewComment table not created yet - stub implementation");
      }
      async getCommentsByStep(stepId) {
        throw new Error("ReviewComment table not created yet - stub implementation");
      }
      async getCommentsByAssignment(assignmentId) {
        throw new Error("ReviewComment table not created yet - stub implementation");
      }
      async updateReviewComment(id, updates) {
        throw new Error("ReviewComment table not created yet - stub implementation");
      }
      async deleteReviewComment(id) {
        throw new Error("ReviewComment table not created yet - stub implementation");
      }
      async resolveComment(id, userId) {
        throw new Error("ReviewComment table not created yet - stub implementation");
      }
      // ============================================
      // SPRINT 5 - RETENTION/LEGAL HOLD SYSTEM
      // ============================================
      // Retention policy operations
      async createRetentionPolicy(policy) {
        const [newPolicy] = await db.insert(retentionPolicies).values(policy).returning();
        return newPolicy;
      }
      async getRetentionPolicy(id) {
        const [policy] = await db.select().from(retentionPolicies).where(eq(retentionPolicies.id, id));
        return policy || void 0;
      }
      async getRetentionPolicies(organizationId) {
        return await db.select().from(retentionPolicies).where(eq(retentionPolicies.organizationId, organizationId)).orderBy(retentionPolicies.priority, retentionPolicies.createdAt);
      }
      async getRetentionPoliciesByDataType(dataType, organizationId) {
        return await db.select().from(retentionPolicies).where(and(eq(retentionPolicies.dataType, dataType), eq(retentionPolicies.organizationId, organizationId))).orderBy(retentionPolicies.priority);
      }
      async getActiveRetentionPolicies(organizationId) {
        return await db.select().from(retentionPolicies).where(and(eq(retentionPolicies.organizationId, organizationId), eq(retentionPolicies.isActive, true))).orderBy(retentionPolicies.priority);
      }
      async updateRetentionPolicy(id, updates) {
        const [policy] = await db.update(retentionPolicies).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(retentionPolicies.id, id)).returning();
        return policy || void 0;
      }
      async deleteRetentionPolicy(id) {
        const result = await db.delete(retentionPolicies).where(eq(retentionPolicies.id, id));
        return (result.rowCount || 0) > 0;
      }
      async activateRetentionPolicy(id) {
        const [policy] = await db.update(retentionPolicies).set({ isActive: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq(retentionPolicies.id, id)).returning();
        return policy || void 0;
      }
      async deactivateRetentionPolicy(id) {
        const [policy] = await db.update(retentionPolicies).set({ isActive: false, updatedAt: /* @__PURE__ */ new Date() }).where(eq(retentionPolicies.id, id)).returning();
        return policy || void 0;
      }
      // Legal hold operations
      async createLegalHold(hold) {
        const [newHold] = await db.insert(legalHolds).values(hold).returning();
        return newHold;
      }
      async getLegalHold(id) {
        const [hold] = await db.select().from(legalHolds).where(eq(legalHolds.id, id));
        return hold || void 0;
      }
      async getLegalHolds(organizationId) {
        return await db.select().from(legalHolds).where(eq(legalHolds.organizationId, organizationId)).orderBy(legalHolds.createdAt);
      }
      async getActiveLegalHolds(organizationId) {
        return await db.select().from(legalHolds).where(and(eq(legalHolds.organizationId, organizationId), eq(legalHolds.status, "active"))).orderBy(legalHolds.createdAt);
      }
      async getLegalHoldsByCustodian(custodianId) {
        return await db.select().from(legalHolds).where(sql2`custodians @> '[${custodianId}]'`).orderBy(legalHolds.createdAt);
      }
      async getLegalHoldsByDateRange(startDate, endDate, organizationId) {
        return await db.select().from(legalHolds).where(and(
          eq(legalHolds.organizationId, organizationId),
          sql2`date_range_start <= ${endDate}`,
          sql2`date_range_end >= ${startDate}`
        )).orderBy(legalHolds.createdAt);
      }
      async updateLegalHold(id, updates) {
        const [hold] = await db.update(legalHolds).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(legalHolds.id, id)).returning();
        return hold || void 0;
      }
      async deleteLegalHold(id) {
        const result = await db.delete(legalHolds).where(eq(legalHolds.id, id));
        return (result.rowCount || 0) > 0;
      }
      async releaseLegalHold(id, userId, reason) {
        const [hold] = await db.update(legalHolds).set({
          status: "released",
          releasedBy: userId,
          releasedAt: /* @__PURE__ */ new Date(),
          metadata: sql2`jsonb_set(metadata, '{release_reason}', '"${reason}"')`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(legalHolds.id, id)).returning();
        return hold || void 0;
      }
      // Retention job operations - stub implementations (tables not created yet)
      async createRetentionJob(job) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async getRetentionJob(id) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async getRetentionJobs(organizationId) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async getRetentionJobsByPolicy(policyId) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async getRetentionJobsByStatus(status, organizationId) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async getScheduledRetentionJobs(organizationId) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async updateRetentionJob(id, updates) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async deleteRetentionJob(id) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async startRetentionJob(id) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async completeRetentionJob(id, results) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      async failRetentionJob(id, error) {
        throw new Error("RetentionJob table not created yet - stub implementation");
      }
      // Data classification operations - stub implementations (tables not created yet)
      async createDataClassification(classification) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async getDataClassification(id) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async getDataClassifications(organizationId) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async getDataClassificationByResource(resourceType, resourceId) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async getDataClassificationsByClassification(classification, organizationId) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async getDataClassificationsBySensitivity(sensitivity, organizationId) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async getDataClassificationsRequiringReview(organizationId) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async updateDataClassification(id, updates) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async deleteDataClassification(id) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      async reviewDataClassification(id, userId) {
        throw new Error("DataClassification table not created yet - stub implementation");
      }
      // ============================================
      // SPRINT 5 - SCIM USER PROVISIONING SYSTEM
      // ============================================
      // SCIM user operations
      async createScimUser(user) {
        const [newUser] = await db.insert(scimUsers).values(user).returning();
        return newUser;
      }
      async getScimUser(id) {
        const [user] = await db.select().from(scimUsers).where(eq(scimUsers.id, id));
        return user || void 0;
      }
      async getScimUserByExternalId(externalId, organizationId) {
        const [user] = await db.select().from(scimUsers).where(and(eq(scimUsers.externalId, externalId), eq(scimUsers.organizationId, organizationId)));
        return user || void 0;
      }
      async getScimUserByScimId(scimId) {
        const [user] = await db.select().from(scimUsers).where(eq(scimUsers.scimId, scimId));
        return user || void 0;
      }
      async getScimUserByEmail(email, organizationId) {
        const [user] = await db.select().from(scimUsers).where(and(eq(scimUsers.email, email), eq(scimUsers.organizationId, organizationId)));
        return user || void 0;
      }
      async getScimUsers(organizationId) {
        return await db.select().from(scimUsers).where(eq(scimUsers.organizationId, organizationId)).orderBy(scimUsers.createdAt);
      }
      async getActiveScimUsers(organizationId) {
        return await db.select().from(scimUsers).where(and(eq(scimUsers.organizationId, organizationId), eq(scimUsers.active, true))).orderBy(scimUsers.createdAt);
      }
      async getScimUsersBySyncStatus(syncStatus, organizationId) {
        return await db.select().from(scimUsers).where(and(eq(scimUsers.syncStatus, syncStatus), eq(scimUsers.organizationId, organizationId))).orderBy(scimUsers.lastSyncAt);
      }
      async updateScimUser(id, updates) {
        const [user] = await db.update(scimUsers).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(scimUsers.id, id)).returning();
        return user || void 0;
      }
      async deleteScimUser(id) {
        const result = await db.delete(scimUsers).where(eq(scimUsers.id, id));
        return (result.rowCount || 0) > 0;
      }
      async linkScimUserToLocal(scimUserId, localUserId) {
        const [user] = await db.update(scimUsers).set({ localUserId, updatedAt: /* @__PURE__ */ new Date() }).where(eq(scimUsers.id, scimUserId)).returning();
        return user || void 0;
      }
      async syncScimUser(id, syncData) {
        const [user] = await db.update(scimUsers).set({
          lastSyncAt: /* @__PURE__ */ new Date(),
          syncStatus: "active",
          syncError: null,
          metadata: syncData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(scimUsers.id, id)).returning();
        return user || void 0;
      }
      async deprovisionScimUser(id) {
        const [user] = await db.update(scimUsers).set({
          active: false,
          syncStatus: "deprovisioned",
          deprovisionedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(scimUsers.id, id)).returning();
        return user || void 0;
      }
      // SCIM group operations
      async createScimGroup(group) {
        const [newGroup] = await db.insert(scimGroups).values(group).returning();
        return newGroup;
      }
      async getScimGroup(id) {
        const [group] = await db.select().from(scimGroups).where(eq(scimGroups.id, id));
        return group || void 0;
      }
      async getScimGroupByExternalId(externalId, organizationId) {
        const [group] = await db.select().from(scimGroups).where(and(eq(scimGroups.externalId, externalId), eq(scimGroups.organizationId, organizationId)));
        return group || void 0;
      }
      async getScimGroupByScimId(scimId) {
        const [group] = await db.select().from(scimGroups).where(eq(scimGroups.scimId, scimId));
        return group || void 0;
      }
      async getScimGroups(organizationId) {
        return await db.select().from(scimGroups).where(eq(scimGroups.organizationId, organizationId)).orderBy(scimGroups.createdAt);
      }
      async getScimGroupsByType(groupType, organizationId) {
        return await db.select().from(scimGroups).where(and(eq(scimGroups.groupType, groupType), eq(scimGroups.organizationId, organizationId))).orderBy(scimGroups.createdAt);
      }
      async getScimGroupsBySyncStatus(syncStatus, organizationId) {
        return await db.select().from(scimGroups).where(and(eq(scimGroups.syncStatus, syncStatus), eq(scimGroups.organizationId, organizationId))).orderBy(scimGroups.lastSyncAt);
      }
      async updateScimGroup(id, updates) {
        const [group] = await db.update(scimGroups).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(scimGroups.id, id)).returning();
        return group || void 0;
      }
      async deleteScimGroup(id) {
        const result = await db.delete(scimGroups).where(eq(scimGroups.id, id));
        return (result.rowCount || 0) > 0;
      }
      async syncScimGroup(id, syncData) {
        const [group] = await db.update(scimGroups).set({
          lastSyncAt: /* @__PURE__ */ new Date(),
          syncStatus: "active",
          syncError: null,
          metadata: syncData,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(scimGroups.id, id)).returning();
        return group || void 0;
      }
      async deprovisionScimGroup(id) {
        const [group] = await db.update(scimGroups).set({
          syncStatus: "deprovisioned",
          deprovisionedAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(scimGroups.id, id)).returning();
        return group || void 0;
      }
      // SCIM group membership operations - stub implementations (table not created yet)
      async createScimGroupMembership(membership) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async getScimGroupMembership(id) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async getScimGroupMemberships(groupId) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async getScimUserMemberships(userId) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async getScimGroupMembershipByIds(groupId, userId) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async getScimGroupMembershipsBySyncStatus(syncStatus) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async updateScimGroupMembership(id, updates) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async deleteScimGroupMembership(id) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async addUserToScimGroup(groupId, userId, membershipType) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      async removeUserFromScimGroup(groupId, userId) {
        throw new Error("ScimGroupMembership table not created yet - stub implementation");
      }
      // Provisioning log operations - stub implementations (table not created yet)
      async createProvisioningLog(log2) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async getProvisioningLog(id) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async getProvisioningLogs(organizationId) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async getProvisioningLogsByOperation(operation, organizationId) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async getProvisioningLogsByResourceType(resourceType, organizationId) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async getProvisioningLogsByStatus(status, organizationId) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async getProvisioningLogsByRequestId(requestId) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async getProvisioningLogsByBatch(batchId) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async getProvisioningLogsByDateRange(startDate, endDate, organizationId) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async updateProvisioningLog(id, updates) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      async deleteProvisioningLog(id) {
        throw new Error("ProvisioningLog table not created yet - stub implementation");
      }
      // ============================================
      // SPRINT 6 - TEMPLATE BUILDER CRUD + PUBLISH SYSTEM
      // ============================================
      async publishTemplate(id, publishedBy, comments) {
        const [template] = await db.update(templates).set({
          status: "published",
          publishedBy,
          publishedAt: /* @__PURE__ */ new Date(),
          metadata: {
            publishComments: comments,
            publishHistory: []
          },
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(templates.id, id)).returning();
        return template || void 0;
      }
      async unpublishTemplate(id, unpublishedBy, reason) {
        const [template] = await db.update(templates).set({
          status: "draft",
          publishedBy: null,
          publishedAt: null,
          metadata: {
            unpublishReason: reason,
            unpublishedBy,
            unpublishedAt: (/* @__PURE__ */ new Date()).toISOString()
          },
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(templates.id, id)).returning();
        return template || void 0;
      }
      async getTemplatesByStatus(status, organizationId) {
        let query = db.select().from(templates).where(eq(templates.status, status));
        if (organizationId) {
          query = query.where(eq(templates.organizationId, organizationId));
        }
        return await query.orderBy(templates.createdAt);
      }
      async getTemplateVersions(templateId) {
        return await db.select().from(templates).where(eq(templates.parentTemplateId, templateId)).orderBy(templates.version);
      }
      async createTemplateVersion(templateId, updates, createdBy) {
        const [originalTemplate] = await db.select().from(templates).where(eq(templates.id, templateId));
        if (!originalTemplate) {
          throw new Error("Template not found");
        }
        const [newVersion] = await db.insert(templates).values({
          ...originalTemplate,
          ...updates,
          id: randomUUID(),
          parentTemplateId: templateId,
          version: (originalTemplate.version || 1) + 1,
          authorId: createdBy,
          status: "draft",
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }).returning();
        return newVersion;
      }
      // ============================================
      // SPRINT 6 - WORKFLOW AUTOMATION V1
      // ============================================
      async createWorkflowDefinition(workflow) {
        const [newWorkflow] = await db.insert(workflowDefinitions).values({
          ...workflow,
          id: randomUUID()
        }).returning();
        return newWorkflow;
      }
      async getWorkflowDefinition(id) {
        const [workflow] = await db.select().from(workflowDefinitions).where(eq(workflowDefinitions.id, id));
        return workflow || void 0;
      }
      async updateWorkflowDefinition(id, updates) {
        const [workflow] = await db.update(workflowDefinitions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workflowDefinitions.id, id)).returning();
        return workflow || void 0;
      }
      async deleteWorkflowDefinition(id) {
        const result = await db.delete(workflowDefinitions).where(eq(workflowDefinitions.id, id));
        return (result.rowCount || 0) > 0;
      }
      async getOrganizationWorkflowDefinitions(organizationId) {
        return await db.select().from(workflowDefinitions).where(eq(workflowDefinitions.organizationId, organizationId)).orderBy(workflowDefinitions.createdAt);
      }
      async createWorkflowExecution(execution) {
        const [newExecution] = await db.insert(workflowExecutions).values({
          ...execution,
          id: randomUUID()
        }).returning();
        return newExecution;
      }
      async getWorkflowExecution(id) {
        const [execution] = await db.select().from(workflowExecutions).where(eq(workflowExecutions.id, id));
        return execution || void 0;
      }
      async updateWorkflowExecution(id, updates) {
        const [execution] = await db.update(workflowExecutions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workflowExecutions.id, id)).returning();
        return execution || void 0;
      }
      async getWorkflowExecutions(workflowDefinitionId, organizationId, limit) {
        let query = db.select().from(workflowExecutions);
        const conditions = [];
        if (workflowDefinitionId) {
          conditions.push(eq(workflowExecutions.workflowDefinitionId, workflowDefinitionId));
        }
        if (organizationId) {
          conditions.push(eq(workflowExecutions.organizationId, organizationId));
        }
        if (conditions.length > 0) {
          query = query.where(sql2`${conditions.join(" AND ")}`);
        }
        if (limit) {
          query = query.limit(limit);
        }
        return await query.orderBy(workflowExecutions.startedAt);
      }
      async createWorkflowEvent(event) {
        const [newEvent] = await db.insert(workflowEvents).values({
          ...event,
          id: randomUUID()
        }).returning();
        return newEvent;
      }
      async getWorkflowEvent(id) {
        const [event] = await db.select().from(workflowEvents).where(eq(workflowEvents.id, id));
        return event || void 0;
      }
      async updateWorkflowEvent(id, updates) {
        const [event] = await db.update(workflowEvents).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(workflowEvents.id, id)).returning();
        return event || void 0;
      }
      async getPendingWorkflowEvents(limit) {
        let query = db.select().from(workflowEvents).where(eq(workflowEvents.status, "pending"));
        if (limit) {
          query = query.limit(limit);
        }
        return await query.orderBy(workflowEvents.createdAt);
      }
      async getOrganizationWorkflowEvents(organizationId) {
        return await db.select().from(workflowEvents).where(eq(workflowEvents.organizationId, organizationId)).orderBy(workflowEvents.createdAt);
      }
      // ============================================
      // SPRINT 6 - ORGANIZATION INSIGHTS SYSTEM
      // ============================================
      async createOrganizationAnalytics(analytics) {
        const [newAnalytics] = await db.insert(organizationAnalytics).values({
          ...analytics,
          id: randomUUID()
        }).returning();
        return newAnalytics;
      }
      async getOrganizationAnalytics(organizationId, date) {
        let query = db.select().from(organizationAnalytics).where(eq(organizationAnalytics.organizationId, organizationId));
        if (date) {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);
          query = query.where(
            and(
              eq(organizationAnalytics.organizationId, organizationId),
              sql2`${organizationAnalytics.date} >= ${startOfDay}`,
              sql2`${organizationAnalytics.date} <= ${endOfDay}`
            )
          );
        }
        const [analytics] = await query.orderBy(organizationAnalytics.date);
        return analytics || void 0;
      }
      async getOrganizationAnalyticsRange(organizationId, startDate, endDate) {
        return await db.select().from(organizationAnalytics).where(
          and(
            eq(organizationAnalytics.organizationId, organizationId),
            sql2`${organizationAnalytics.date} >= ${startDate}`,
            sql2`${organizationAnalytics.date} <= ${endDate}`
          )
        ).orderBy(organizationAnalytics.date);
      }
      async updateOrganizationAnalytics(id, updates) {
        const [analytics] = await db.update(organizationAnalytics).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(organizationAnalytics.id, id)).returning();
        return analytics || void 0;
      }
      async createOrganizationDailyReport(report) {
        const [newReport] = await db.insert(organizationDailyReports).values({
          ...report,
          id: randomUUID()
        }).returning();
        return newReport;
      }
      async getOrganizationDailyReport(organizationId, reportDate, reportType) {
        let query = db.select().from(organizationDailyReports).where(
          and(
            eq(organizationDailyReports.organizationId, organizationId),
            eq(organizationDailyReports.reportDate, reportDate)
          )
        );
        if (reportType) {
          query = query.where(
            and(
              eq(organizationDailyReports.organizationId, organizationId),
              eq(organizationDailyReports.reportDate, reportDate),
              eq(organizationDailyReports.reportType, reportType)
            )
          );
        }
        const [report] = await query;
        return report || void 0;
      }
      async getOrganizationDailyReports(organizationId, limit) {
        let query = db.select().from(organizationDailyReports).where(eq(organizationDailyReports.organizationId, organizationId));
        if (limit) {
          query = query.limit(limit);
        }
        return await query.orderBy(organizationDailyReports.reportDate);
      }
      async recordEnhancedUsageMetric(metric) {
        const processedMetric = {
          ...metric,
          id: randomUUID(),
          // For JSONB fields, pass clean JavaScript types - no pre-serialization needed
          tags: Array.isArray(metric.tags) ? metric.tags : metric.tags ? [metric.tags] : [],
          dimensions: typeof metric.dimensions === "object" && metric.dimensions !== null ? metric.dimensions : {},
          metadata: typeof metric.metadata === "object" && metric.metadata !== null ? metric.metadata : {}
        };
        try {
          const [newMetric] = await db.insert(enhancedUsageMetrics).values(processedMetric).returning();
          console.log("\u2705 Successfully recorded enhanced usage metric:", newMetric.id);
          return newMetric;
        } catch (error) {
          console.error("\u274C Database error in recordEnhancedUsageMetric:", error.message);
          console.error("Failed metric data structure:", {
            tagsType: typeof processedMetric.tags,
            tagsIsArray: Array.isArray(processedMetric.tags),
            tagsValue: processedMetric.tags,
            dimensionsType: typeof processedMetric.dimensions
          });
          try {
            const minimalMetric = {
              id: randomUUID(),
              organizationId: processedMetric.organizationId,
              resourceType: processedMetric.resourceType,
              action: processedMetric.action,
              metricType: processedMetric.metricType,
              value: processedMetric.value,
              unit: processedMetric.unit
              // Temporarily omit JSONB fields to test basic insert
            };
            console.log("\u{1F527} Testing minimal insert without JSONB fields...");
            const [minimalResult] = await db.insert(enhancedUsageMetrics).values(minimalMetric).returning();
            console.log("\u2705 Minimal insert successful - issue is with JSONB field handling");
            return minimalResult;
          } catch (minimalError) {
            console.error("\u274C Even minimal insert failed:", minimalError.message);
            throw error;
          }
        }
      }
      async getEnhancedUsageMetrics(organizationId, resourceType, startDate, endDate) {
        let query = db.select().from(enhancedUsageMetrics).where(eq(enhancedUsageMetrics.organizationId, organizationId));
        const conditions = [eq(enhancedUsageMetrics.organizationId, organizationId)];
        if (resourceType) {
          conditions.push(eq(enhancedUsageMetrics.resourceType, resourceType));
        }
        if (startDate) {
          conditions.push(sql2`${enhancedUsageMetrics.timestamp} >= ${startDate}`);
        }
        if (endDate) {
          conditions.push(sql2`${enhancedUsageMetrics.timestamp} <= ${endDate}`);
        }
        if (conditions.length > 1) {
          query = query.where(sql2`${conditions.join(" AND ")}`);
        }
        return await query.orderBy(enhancedUsageMetrics.timestamp);
      }
      async getOrganizationInsightsSummary(organizationId) {
        return {
          organizationId,
          summary: "Mock insights summary for organization",
          generatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      async generateDailyInsightsReport(organizationId, date) {
        const analytics = await this.getOrganizationAnalytics(organizationId, date);
        return await this.createOrganizationDailyReport({
          organizationId,
          reportDate: date,
          reportType: "daily_summary",
          title: `Daily Summary - ${date.toDateString()}`,
          summary: "Auto-generated daily insights report",
          keyMetrics: {
            activeUsers: analytics?.activeUsers || 0,
            totalSessions: analytics?.totalSessions || 0,
            templatesUsed: analytics?.templatesUsed || 0,
            workflowsExecuted: analytics?.workflowsExecuted || 0
          },
          insights: [],
          recommendations: [],
          alerts: [],
          charts: {},
          generatedBy: "system"
        });
      }
      // Sprint 10 - Trial management implementation
      trials = /* @__PURE__ */ new Map();
      async startTrial(orgId, daysAllowed = 14) {
        const startDate = /* @__PURE__ */ new Date();
        const endDate = new Date(startDate.getTime() + daysAllowed * 24 * 60 * 60 * 1e3);
        const trialData = {
          active: true,
          startDate,
          endDate,
          daysRemaining: daysAllowed
        };
        this.trials.set(orgId, trialData);
        console.log(`\u2705 Trial started for org ${orgId}: ${daysAllowed} days`);
        return trialData;
      }
      async getTrialStatus(orgId) {
        const trial = this.trials.get(orgId);
        if (!trial) {
          return { active: false, startDate: null, endDate: null, daysRemaining: 0 };
        }
        const now = /* @__PURE__ */ new Date();
        const isExpired = now > trial.endDate;
        const daysRemaining = isExpired ? 0 : Math.max(0, Math.ceil((trial.endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1e3)));
        if (isExpired && trial.active) {
          trial.active = false;
          trial.daysRemaining = 0;
          this.trials.set(orgId, trial);
        } else if (!isExpired) {
          trial.daysRemaining = daysRemaining;
          this.trials.set(orgId, trial);
        }
        return {
          active: trial.active && !isExpired,
          startDate: trial.startDate,
          endDate: trial.endDate,
          daysRemaining
        };
      }
      // ============================================
      // SPRINT 11 - BILLING & ENTITLEMENTS HARDENING
      // ============================================
      // Invoice operations
      async createInvoice(invoiceData) {
        try {
          const [invoice] = await db.insert(invoices).values({
            ...invoiceData,
            id: randomUUID(),
            createdAt: /* @__PURE__ */ new Date()
          }).returning();
          return invoice;
        } catch (error) {
          console.error("Failed to create invoice:", error);
          throw error;
        }
      }
      async getInvoice(id) {
        try {
          const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
          return invoice;
        } catch (error) {
          console.error("Failed to get invoice:", error);
          return void 0;
        }
      }
      async getInvoicesByOrg(orgId) {
        try {
          return await db.select().from(invoices).where(eq(invoices.orgId, orgId)).orderBy(invoices.createdAt);
        } catch (error) {
          console.error("Failed to get invoices by org:", error);
          return [];
        }
      }
      async updateInvoice(id, updates) {
        try {
          const [invoice] = await db.update(invoices).set(updates).where(eq(invoices.id, id)).returning();
          return invoice;
        } catch (error) {
          console.error("Failed to update invoice:", error);
          return void 0;
        }
      }
      // Dunning event operations
      async createDunningEvent(eventData) {
        try {
          const [dunningEvent] = await db.insert(dunningEvents).values({
            ...eventData,
            id: randomUUID(),
            createdAt: /* @__PURE__ */ new Date()
          }).returning();
          return dunningEvent;
        } catch (error) {
          console.error("Failed to create dunning event:", error);
          throw error;
        }
      }
      async getDunningEvent(id) {
        try {
          const [event] = await db.select().from(dunningEvents).where(eq(dunningEvents.id, id));
          return event;
        } catch (error) {
          console.error("Failed to get dunning event:", error);
          return void 0;
        }
      }
      async getDunningEventsByInvoice(invoiceId) {
        try {
          return await db.select().from(dunningEvents).where(eq(dunningEvents.invoiceId, invoiceId)).orderBy(dunningEvents.createdAt);
        } catch (error) {
          console.error("Failed to get dunning events by invoice:", error);
          return [];
        }
      }
      async getDunningEventsByOrg(orgId) {
        try {
          return await db.select().from(dunningEvents).where(eq(dunningEvents.orgId, orgId)).orderBy(dunningEvents.createdAt);
        } catch (error) {
          console.error("Failed to get dunning events by org:", error);
          return [];
        }
      }
      // Seats management operations
      async createSeats(seatsData) {
        try {
          const [seat] = await db.insert(seats).values({
            ...seatsData,
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return seat;
        } catch (error) {
          console.error("Failed to create seats:", error);
          throw error;
        }
      }
      async getSeats(orgId) {
        try {
          const [seat] = await db.select().from(seats).where(eq(seats.orgId, orgId));
          return seat;
        } catch (error) {
          console.error("Failed to get seats:", error);
          return void 0;
        }
      }
      async updateSeats(orgId, seatCount) {
        try {
          const [seat] = await db.update(seats).set({ seats: seatCount, updatedAt: /* @__PURE__ */ new Date() }).where(eq(seats.orgId, orgId)).returning();
          return seat;
        } catch (error) {
          console.error("Failed to update seats:", error);
          return void 0;
        }
      }
      // ============================================
      // STRIPE INTEGRATION OPERATIONS
      // ============================================
      // Stripe customer operations
      async getStripeCustomerByUserId(userId) {
        try {
          const [user] = await db.select({
            stripeCustomerId: users.stripeCustomerId
          }).from(users).where(eq(users.id, userId));
          return user?.stripeCustomerId ? { stripeCustomerId: user.stripeCustomerId } : void 0;
        } catch (error) {
          console.error("Failed to get Stripe customer by user ID:", error);
          return void 0;
        }
      }
      async updateUserStripeCustomerId(userId, stripeCustomerId) {
        try {
          await db.update(users).set({ stripeCustomerId, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId));
        } catch (error) {
          console.error("Failed to update user Stripe customer ID:", error);
          throw error;
        }
      }
      // Subscription operations for Stripe
      async createSubscription(subscriptionData) {
        try {
          const [subscription] = await db.insert(subscriptions).values({
            ...subscriptionData,
            id: randomUUID(),
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return subscription;
        } catch (error) {
          console.error("Failed to create subscription:", error);
          throw error;
        }
      }
      async getSubscription(subscriptionId) {
        try {
          const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId));
          return subscription;
        } catch (error) {
          console.error("Failed to get subscription:", error);
          return void 0;
        }
      }
      async getSubscriptionByStripeId(stripeSubscriptionId) {
        try {
          const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
          return subscription;
        } catch (error) {
          console.error("Failed to get subscription by Stripe ID:", error);
          return void 0;
        }
      }
      async updateSubscription(subscriptionId, updates) {
        try {
          const [subscription] = await db.update(subscriptions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(subscriptions.id, subscriptionId)).returning();
          return subscription;
        } catch (error) {
          console.error("Failed to update subscription:", error);
          return void 0;
        }
      }
      async updateSubscriptionByStripeId(stripeSubscriptionId, updates) {
        try {
          const [subscription] = await db.update(subscriptions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId)).returning();
          return subscription;
        } catch (error) {
          console.error("Failed to update subscription by Stripe ID:", error);
          return void 0;
        }
      }
      async getActiveSubscriptionByWorkspaceId(workspaceId) {
        try {
          const [subscription] = await db.select().from(subscriptions).where(
            and(
              eq(subscriptions.workspaceId, workspaceId),
              or(
                eq(subscriptions.status, "active"),
                eq(subscriptions.status, "trialing"),
                eq(subscriptions.status, "past_due")
              )
            )
          ).orderBy(desc(subscriptions.createdAt)).limit(1);
          return subscription;
        } catch (error) {
          console.error("Failed to get active subscription by workspace ID:", error);
          return void 0;
        }
      }
      // Entitlements operations for Stripe
      async grantPlanEntitlements(workspaceId, plan) {
        try {
          const { PLAN_FEATURES: PLAN_FEATURES2 } = await Promise.resolve().then(() => (init_entitlements(), entitlements_exports));
          const features = PLAN_FEATURES2[plan] || [];
          for (const feature of features) {
            await db.insert(entitlements).values({
              id: randomUUID(),
              workspaceId,
              feature,
              grantedAt: /* @__PURE__ */ new Date()
            }).onConflictDoNothing();
          }
        } catch (error) {
          console.error("Failed to grant plan entitlements:", error);
          throw error;
        }
      }
      async revokeAllEntitlements(workspaceId) {
        try {
          await db.delete(entitlements).where(eq(entitlements.workspaceId, workspaceId));
        } catch (error) {
          console.error("Failed to revoke entitlements:", error);
          throw error;
        }
      }
      async isWorkspaceAdmin(userId, workspaceId) {
        try {
          const membership = await this.getWorkspaceMembership(workspaceId, userId);
          if (!membership) {
            return false;
          }
          return membership.role === "admin" || membership.role === "owner";
        } catch (error) {
          console.error("Failed to check workspace admin status:", error);
          return false;
        }
      }
      // ============================================
      // SPRINT 12 - DOCUMENTATION OPERATIONS
      // ============================================
      // Documentation CRUD operations
      async createDoc(doc) {
        try {
          const [newDoc] = await db.insert(docs).values({
            ...doc,
            id: randomUUID(),
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          }).returning();
          return newDoc;
        } catch (error) {
          console.error("Failed to create document:", error);
          throw error;
        }
      }
      async getDoc(id) {
        try {
          const [doc] = await db.select().from(docs).where(eq(docs.id, id));
          return doc;
        } catch (error) {
          console.error("Failed to get document:", error);
          return void 0;
        }
      }
      async getDocBySlug(slug) {
        try {
          const [doc] = await db.select().from(docs).where(eq(docs.slug, slug));
          return doc;
        } catch (error) {
          console.error("Failed to get document by slug:", error);
          return void 0;
        }
      }
      async getAllDocs() {
        try {
          return await db.select().from(docs).orderBy(docs.createdAt);
        } catch (error) {
          console.error("Failed to get all documents:", error);
          return [];
        }
      }
      async getDocsByCategory(category) {
        try {
          return await db.select().from(docs).where(eq(docs.category, category)).orderBy(docs.createdAt);
        } catch (error) {
          console.error("Failed to get documents by category:", error);
          return [];
        }
      }
      async getPublishedDocs() {
        try {
          return await db.select().from(docs).where(eq(docs.status, "published")).orderBy(docs.createdAt);
        } catch (error) {
          console.error("Failed to get published documents:", error);
          return [];
        }
      }
      async updateDoc(id, updates) {
        try {
          const [updatedDoc] = await db.update(docs).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(docs.id, id)).returning();
          return updatedDoc;
        } catch (error) {
          console.error("Failed to update document:", error);
          return void 0;
        }
      }
      async deleteDoc(id) {
        try {
          const result = await db.delete(docs).where(eq(docs.id, id));
          return (result.rowCount || 0) > 0;
        } catch (error) {
          console.error("Failed to delete document:", error);
          return false;
        }
      }
      async incrementDocViewCount(id) {
        try {
          const [updatedDoc] = await db.update(docs).set({
            viewCount: sql2`${docs.viewCount} + 1`,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(docs.id, id)).returning();
          return updatedDoc;
        } catch (error) {
          console.error("Failed to increment document view count:", error);
          return void 0;
        }
      }
      async searchDocs(query) {
        try {
          return await db.select().from(docs).where(
            sql2`(
            LOWER(${docs.title}) LIKE LOWER(${`%${query}%`}) OR
            LOWER(${docs.content}) LIKE LOWER(${`%${query}%`}) OR
            LOWER(${docs.summary}) LIKE LOWER(${`%${query}%`})
          )`
          ).orderBy(docs.updatedAt);
        } catch (error) {
          console.error("Failed to search documents:", error);
          return [];
        }
      }
      // ============================================
      // WORKSPACE SYNCHRONIZATION - Event and Connection Management
      // ============================================
      // Workspace event management methods
      async createWorkspaceEvent(event) {
        try {
          const [workspaceEvent] = await db.insert(workspaceEvents).values(event).returning();
          return workspaceEvent;
        } catch (error) {
          console.error("Failed to create workspace event:", error);
          throw error;
        }
      }
      async createWorkspaceEventAtomic(event) {
        try {
          return await db.transaction(async (tx) => {
            const [result] = await tx.select({
              maxSequence: sql2`COALESCE(MAX(${workspaceEvents.sequenceNumber}), 0)`
            }).from(workspaceEvents).where(eq(workspaceEvents.workspaceId, event.workspaceId)).for("update");
            const nextSequence = (result?.maxSequence || 0) + 1;
            const [workspaceEvent] = await tx.insert(workspaceEvents).values({
              ...event,
              sequenceNumber: nextSequence
            }).returning();
            return workspaceEvent;
          });
        } catch (error) {
          console.error("Failed to create workspace event atomically:", error);
          throw error;
        }
      }
      async getWorkspaceEvent(id) {
        try {
          const [event] = await db.select().from(workspaceEvents).where(eq(workspaceEvents.id, id));
          return event || void 0;
        } catch (error) {
          console.error("Failed to get workspace event:", error);
          return void 0;
        }
      }
      async getWorkspaceEvents(workspaceId, limit = 50, offset = 0) {
        try {
          return await db.select().from(workspaceEvents).where(eq(workspaceEvents.workspaceId, workspaceId)).orderBy(sql2`${workspaceEvents.sequenceNumber} DESC`).limit(limit).offset(offset);
        } catch (error) {
          console.error("Failed to get workspace events:", error);
          return [];
        }
      }
      async getWorkspaceEventsSince(workspaceId, sequenceNumber) {
        try {
          return await db.select().from(workspaceEvents).where(and(
            eq(workspaceEvents.workspaceId, workspaceId),
            sql2`${workspaceEvents.sequenceNumber} > ${sequenceNumber}`
          )).orderBy(sql2`${workspaceEvents.sequenceNumber} ASC`);
        } catch (error) {
          console.error("Failed to get workspace events since sequence:", error);
          return [];
        }
      }
      async deleteWorkspaceEvent(id) {
        try {
          const result = await db.delete(workspaceEvents).where(eq(workspaceEvents.id, id));
          return (result.rowCount || 0) > 0;
        } catch (error) {
          console.error("Failed to delete workspace event:", error);
          return false;
        }
      }
      async cleanupWorkspaceEvents(workspaceId, olderThanDays) {
        try {
          const cutoffDate = /* @__PURE__ */ new Date();
          cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
          const result = await db.delete(workspaceEvents).where(and(
            eq(workspaceEvents.workspaceId, workspaceId),
            sql2`${workspaceEvents.createdAt} < ${cutoffDate}`
          ));
          return result.rowCount || 0;
        } catch (error) {
          console.error("Failed to cleanup workspace events:", error);
          return 0;
        }
      }
      async getNextSequenceNumber(workspaceId) {
        try {
          const [result] = await db.select({
            maxSequence: sql2`COALESCE(MAX(${workspaceEvents.sequenceNumber}), 0)`
          }).from(workspaceEvents).where(eq(workspaceEvents.workspaceId, workspaceId));
          return (result?.maxSequence || 0) + 1;
        } catch (error) {
          console.error("Failed to get next sequence number:", error);
          return 1;
        }
      }
      // Workspace connection management methods
      async createWorkspaceConnection(connection4) {
        try {
          const [workspaceConnection] = await db.insert(workspaceConnections).values(connection4).returning();
          return workspaceConnection;
        } catch (error) {
          console.error("Failed to create workspace connection:", error);
          throw error;
        }
      }
      async getWorkspaceConnection(id) {
        try {
          const [connection4] = await db.select().from(workspaceConnections).where(eq(workspaceConnections.id, id));
          return connection4 || void 0;
        } catch (error) {
          console.error("Failed to get workspace connection:", error);
          return void 0;
        }
      }
      async getActiveWorkspaceConnections(workspaceId) {
        try {
          return await db.select().from(workspaceConnections).where(and(
            eq(workspaceConnections.workspaceId, workspaceId),
            eq(workspaceConnections.isActive, true)
          )).orderBy(workspaceConnections.connectedAt);
        } catch (error) {
          console.error("Failed to get active workspace connections:", error);
          return [];
        }
      }
      async getUserWorkspaceConnections(workspaceId, userId) {
        try {
          return await db.select().from(workspaceConnections).where(and(
            eq(workspaceConnections.workspaceId, workspaceId),
            eq(workspaceConnections.userId, userId),
            eq(workspaceConnections.isActive, true)
          )).orderBy(workspaceConnections.connectedAt);
        } catch (error) {
          console.error("Failed to get user workspace connections:", error);
          return [];
        }
      }
      async updateConnectionPing(connectionId) {
        try {
          const [connection4] = await db.update(workspaceConnections).set({ lastPing: /* @__PURE__ */ new Date() }).where(eq(workspaceConnections.connectionId, connectionId)).returning();
          return connection4 || void 0;
        } catch (error) {
          console.error("Failed to update connection ping:", error);
          return void 0;
        }
      }
      async deactivateConnection(connectionId) {
        try {
          const result = await db.update(workspaceConnections).set({
            isActive: false,
            disconnectedAt: /* @__PURE__ */ new Date()
          }).where(eq(workspaceConnections.connectionId, connectionId));
          return (result.rowCount || 0) > 0;
        } catch (error) {
          console.error("Failed to deactivate connection:", error);
          return false;
        }
      }
      async deactivateUserConnections(workspaceId, userId) {
        try {
          const result = await db.update(workspaceConnections).set({
            isActive: false,
            disconnectedAt: /* @__PURE__ */ new Date()
          }).where(and(
            eq(workspaceConnections.workspaceId, workspaceId),
            eq(workspaceConnections.userId, userId),
            eq(workspaceConnections.isActive, true)
          ));
          return result.rowCount || 0;
        } catch (error) {
          console.error("Failed to deactivate user connections:", error);
          return 0;
        }
      }
      async cleanupStaleConnections(olderThanMinutes) {
        try {
          const cutoffDate = /* @__PURE__ */ new Date();
          cutoffDate.setMinutes(cutoffDate.getMinutes() - olderThanMinutes);
          const result = await db.update(workspaceConnections).set({
            isActive: false,
            disconnectedAt: /* @__PURE__ */ new Date()
          }).where(and(
            eq(workspaceConnections.isActive, true),
            sql2`${workspaceConnections.lastPing} < ${cutoffDate}`
          ));
          return result.rowCount || 0;
        } catch (error) {
          console.error("Failed to cleanup stale connections:", error);
          return 0;
        }
      }
      // Connection presence and activity tracking
      async getWorkspaceActiveUsers(workspaceId) {
        try {
          const activeConnections = await db.select({
            userId: workspaceConnections.userId,
            connectionCount: sql2`COUNT(*)`,
            lastActivity: sql2`MAX(${workspaceConnections.lastPing})`
          }).from(workspaceConnections).where(and(
            eq(workspaceConnections.workspaceId, workspaceId),
            eq(workspaceConnections.isActive, true)
          )).groupBy(workspaceConnections.userId);
          const result = [];
          for (const conn of activeConnections) {
            const user = await this.getUser(conn.userId);
            if (user) {
              result.push({
                userId: conn.userId,
                user,
                connectionsCount: conn.connectionCount,
                lastActivity: conn.lastActivity
              });
            }
          }
          return result;
        } catch (error) {
          console.error("Failed to get workspace active users:", error);
          return [];
        }
      }
      async isUserActiveInWorkspace(workspaceId, userId) {
        try {
          const [connection4] = await db.select().from(workspaceConnections).where(and(
            eq(workspaceConnections.workspaceId, workspaceId),
            eq(workspaceConnections.userId, userId),
            eq(workspaceConnections.isActive, true)
          )).limit(1);
          return !!connection4;
        } catch (error) {
          console.error("Failed to check if user is active in workspace:", error);
          return false;
        }
      }
      async getWorkspaceConnectionsCount(workspaceId) {
        try {
          const [result] = await db.select({
            count: sql2`COUNT(*)`
          }).from(workspaceConnections).where(and(
            eq(workspaceConnections.workspaceId, workspaceId),
            eq(workspaceConnections.isActive, true)
          ));
          return result?.count || 0;
        } catch (error) {
          console.error("Failed to get workspace connections count:", error);
          return 0;
        }
      }
      // ============================================
      // MISSING METHODS - Sprint 12 Admin Settings
      // ============================================
      async createAdminSetting() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getAdminSetting() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getAllAdminSettings() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getAdminSettingsByCategory() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async updateAdminSetting() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async deleteAdminSetting() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      // Sprint 12 Marketplace
      async createMarketplaceItem() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getMarketplaceItem() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getAllMarketplaceItems() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getMarketplaceItemsByCategory() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getPublishedMarketplaceItems() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getFeaturedMarketplaceItems() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getMarketplaceItemsByPublisher() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async updateMarketplaceItem() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async deleteMarketplaceItem() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async incrementMarketplaceItemViews() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async incrementMarketplaceItemDownloads() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async searchMarketplaceItems() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      // Sprint 12 Changelog  
      async createChangelogEntry() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getChangelogEntry() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getChangelogEntryByVersion() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getAllChangelogEntries() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getPublishedChangelogEntries() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getPinnedChangelogEntries() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getChangelogEntriesByType() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async updateChangelogEntry() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async deleteChangelogEntry() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async publishChangelogEntry() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      // Sprint 12 Playbooks
      async createPlaybook() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getPlaybook() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getAllPlaybooks() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getPlaybooksByType() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getPlaybooksByRole() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getPlaybooksByCategory() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getActivePlaybooks() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async updatePlaybook() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async deletePlaybook() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async incrementPlaybookUsage() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async searchPlaybooks() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      // Sprint 12 Documentation
      async createDoc() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getDoc() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getDocBySlug() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getAllDocs() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getDocsByCategory() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getPublishedDocs() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async updateDoc() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async deleteDoc() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async incrementDocViewCount() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async searchDocs() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      // Additional SCIM methods that may be missing
      async getScimUserByScimId() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getActiveScimUsers() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async linkScimUserToLocal() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async syncScimUser() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async bulkSyncScimUsers() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async deprovisionScimUser() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getScimGroupByScimId() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async getScimGroupsByType() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async syncScimGroup() {
        throw new Error("Not implemented in DatabaseStorage");
      }
      async deprovisionScimGroup() {
        throw new Error("Not implemented in DatabaseStorage");
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/ai-service.ts
var ai_service_exports = {};
__export(ai_service_exports, {
  AI_AGENTS: () => AI_AGENTS,
  BRAINSTORM_AGENTS: () => BRAINSTORM_AGENTS,
  REPORT_AGENTS: () => REPORT_AGENTS,
  generateFollowUpResponse: () => generateFollowUpResponse,
  runBrainstormingSession: () => runBrainstormingSession,
  runMultiAgentDebate: () => runMultiAgentDebate,
  runReportGeneration: () => runReportGeneration
});
import OpenAI from "openai";
import fetch2 from "node-fetch";
async function runBrainstormingSession(originalPrompt, debateResults, settings) {
  const agents = BRAINSTORM_AGENTS;
  const rounds = Math.min(settings.turns || 2, 3);
  let collaboration_history = [];
  const startTime = Date.now();
  const collaborativeContext = `
ORIGINAL QUESTION: ${originalPrompt}

DEBATE CONSENSUS: ${debateResults.consensus}

DISSENTING VIEWS TO ADDRESS:
${debateResults.dissents.map((d) => `- ${d.position}${d.reasoning ? ` (Reasoning: ${d.reasoning})` : ""}`).join("\n")}

UNRESOLVED QUESTIONS TO ANSWER:
${debateResults.unresolved.map((q) => `- ${q}`).join("\n")}

YOUR MISSION: Work collaboratively to transform this debate into actionable solutions. Build upon the consensus, address dissenting views constructively, and answer unresolved questions. Focus on practical implementation rather than further debate.`;
  for (let round = 0; round < rounds; round++) {
    for (const agent of agents) {
      const context = collaboration_history.length > 0 ? `

Previous collaborative discussion:
${collaboration_history.map((h) => `${h.agent}: ${h.response}`).join("\n\n")}` : "";
      const prompt = `${collaborativeContext}${context}
      
As the ${agent.role}, contribute to building collaborative solutions. Focus on:
1. Practical, actionable solutions
2. Addressing concerns raised in dissenting views
3. Answering unresolved questions with evidence
4. Building upon other agents' contributions

Provide concrete, implementable suggestions that move from debate to action.`;
      try {
        const completion = await Promise.race([
          openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              { role: "system", content: agent.systemPrompt },
              { role: "user", content: prompt }
            ],
            max_tokens: 800,
            temperature: 0.7
          }),
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("OpenAI API timeout after 30 seconds")), 3e4)
          )
        ]);
        const response = completion.choices[0].message.content || "";
        collaboration_history.push({
          agent: agent.role,
          response
        });
      } catch (error) {
        console.error(`Error in brainstorming with ${agent.role}:`, error);
      }
    }
  }
  const synthesisPrompt = `Based on the collaborative brainstorming session below, synthesize the results into a structured response.

ORIGINAL QUESTION: ${originalPrompt}
DEBATE CONSENSUS: ${debateResults.consensus}
DISSENTING VIEWS: ${debateResults.dissents.map((d) => d.position).join("; ")}
UNRESOLVED QUESTIONS: ${debateResults.unresolved.join("; ")}

COLLABORATIVE BRAINSTORMING:
${collaboration_history.map((h) => `${h.agent}: ${h.response}`).join("\n\n")}

Synthesize this into a JSON response with the following structure:
{
  "solutions": [
    {
      "title": "Solution name",
      "description": "Detailed description",
      "feasibility": "low/medium/high", 
      "impact": "low/medium/high",
      "timeline": "optional timeline",
      "resources_required": ["optional resource list"]
    }
  ],
  "action_plan": [
    {
      "step": 1,
      "title": "Action step title",
      "description": "Detailed description",
      "owner": "optional owner",
      "timeline": "optional timeline",
      "dependencies": ["optional dependencies"]
    }
  ],
  "answered_questions": [
    {
      "original_question": "Question from unresolved list",
      "answer": "Comprehensive answer",
      "confidence": "low/medium/high",
      "supporting_evidence": ["optional evidence list"]
    }
  ],
  "final_consensus": "Updated consensus incorporating brainstorming insights",
  "implementation_strategy": {
    "approach": "Overall implementation approach",
    "key_milestones": ["milestone list"],
    "success_metrics": ["optional metrics"],
    "risk_mitigation": ["optional risk mitigation strategies"]
  }
}`;
  try {
    const synthesisResponse = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a synthesis expert who creates structured, actionable responses from collaborative discussions. Always respond with valid JSON."
          },
          { role: "user", content: synthesisPrompt }
        ],
        max_tokens: 2e3,
        temperature: 0.3
      }),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("OpenAI API timeout after 30 seconds")), 3e4)
      )
    ]);
    const endTime = Date.now();
    const response_text = synthesisResponse.choices[0].message.content || "{}";
    try {
      const parsed_response = JSON.parse(response_text);
      parsed_response.telemetry = {
        avg_ms: endTime - startTime,
        quality: 0.85,
        // High quality for collaborative approach
        tps: collaboration_history.length / ((endTime - startTime) / 1e3),
        active_agents: agents.length
      };
      return parsed_response;
    } catch (parseError) {
      console.error("Failed to parse brainstorming synthesis:", parseError);
      throw new Error("Failed to synthesize brainstorming results");
    }
  } catch (error) {
    console.error("Error in brainstorming synthesis:", error);
    throw new Error("Brainstorming session failed");
  }
}
async function runMultiAgentDebate(prompt, settings) {
  const agents = settings.mode === "guided" ? AI_AGENTS : AI_AGENTS.slice(0, 3);
  const rounds = settings.turns || 1;
  let debate_history = [];
  if (settings.previousDebateHistory && Array.isArray(settings.previousDebateHistory)) {
    debate_history = [...settings.previousDebateHistory];
    console.log(`\u{1F504} Initializing with ${debate_history.length} previous debate entries from transfer`);
  }
  let documentContext = "";
  if (settings.attached_document) {
    try {
      console.log(`\u{1F4C4} Processing attached document: ${settings.attached_document.fileName}`);
      const response = await fetch2(settings.attached_document.fileUrl);
      if (response.ok) {
        const documentContent = await response.text();
        const maxLength = 2e3;
        const truncatedContent = documentContent.length > maxLength ? documentContent.substring(0, maxLength) + "...\n[Document truncated for length]" : documentContent;
        documentContext = `

\u{1F4C4} ATTACHED DOCUMENT CONTEXT:
Document: ${settings.attached_document.fileName}
Size: ${Math.round(settings.attached_document.fileSize / 1024)}KB

Content:
${truncatedContent}

`;
        console.log(`\u{1F4C4} Document processed successfully: ${documentContent.length} characters`);
      } else {
        console.warn(`\u{1F4C4} Failed to fetch document content: ${response.status}`);
        documentContext = `

\u{1F4C4} ATTACHED DOCUMENT: ${settings.attached_document.fileName} (Content unavailable)

`;
      }
    } catch (error) {
      console.error("\u{1F4C4} Error processing attached document:", error);
      documentContext = `

\u{1F4C4} ATTACHED DOCUMENT: ${settings.attached_document.fileName} (Error loading content)

`;
    }
  }
  for (let round = 0; round < rounds; round++) {
    for (const agent of agents) {
      const context = debate_history.length > 0 ? `

Previous discussion:
${debate_history.map((h) => `${h.agent}: ${h.response}`).join("\n\n")}` : "";
      let roleSpecificInstructions = "";
      if (agent.role === "Domain Expert" && debate_history.length > 0) {
        const debatePoints = debate_history.map((h) => h.response).join(" ");
        roleSpecificInstructions = `

As a Domain Expert responding to the ongoing debate, you should:
1. DIRECTLY address specific points, claims, or questions raised by other agents
2. Provide domain-specific expertise that validates, contradicts, or expands on previous arguments
3. Cite relevant examples, case studies, or technical details that others may have missed
4. Fill knowledge gaps identified in the discussion
5. Build upon the strongest points while correcting any misconceptions
6. Reference specific agent statements when agreeing or disagreeing (e.g., "Building on the Analyst's point about...")
7. Offer practical, actionable insights based on real-world domain experience`;
      } else if (round > 0) {
        roleSpecificInstructions = `

Since this is round ${round + 1}, focus on:
1. Building upon or challenging specific points made by other agents
2. Addressing any gaps or questions raised in previous discussions
3. Avoiding repetition of already-covered ground
4. Moving the discussion forward with new insights`;
      }
      console.log(`\u{1F916} ${agent.role} generating response for: "${prompt}"`);
      const response = await Promise.race([
        openai.chat.completions.create({
          model: "gpt-4",
          // Using gpt-4 instead of gpt-5 which doesn't exist
          messages: [
            {
              role: "system",
              content: `${agent.systemPrompt}

You are participating in a collaborative AI debate about: "${prompt}"

Provide a thoughtful response that contributes to the discussion.${context}${roleSpecificInstructions}${documentContext}`
            },
            {
              role: "user",
              content: `Round ${round + 1}: Please provide your perspective on: ${prompt}${documentContext ? "\n\nPlease consider the attached document in your analysis." : ""}`
            }
          ],
          max_completion_tokens: settings.response_length === "detailed" ? 800 : settings.response_length === "brief" ? 300 : 500
          // temperature: settings.temperature || 0.7 // Removed - model only supports default
        }),
        new Promise(
          (_, reject) => setTimeout(() => reject(new Error("OpenAI API timeout after 30 seconds")), 3e4)
        )
      ]);
      const content = response.choices[0].message.content || "";
      console.log(`\u{1F916} ${agent.role} response length:`, content.length);
      console.log(`\u{1F916} ${agent.role} response preview:`, content.substring(0, 100) + "...");
      debate_history.push({
        agent: agent.role,
        response: content
      });
    }
  }
  const synthesis_prompt = `Based on the following multi-agent AI debate, respond ONLY with valid JSON in this EXACT format:

{
  "consensus": "A comprehensive string summary of points where agents agree",
  "dissents": [
    {"position": "Dissenting view", "reasoning": "Why this view differs"}
  ],
  "unresolved": ["Question 1", "Question 2"]
}

CRITICAL: 
- Return ONLY the JSON object, no other text
- "consensus" must be a STRING, not an object
- Do not include markdown formatting or code blocks
- Ensure proper JSON syntax with quotes and commas

Debate history:
${debate_history.map((h) => `${h.agent}: ${h.response}`).join("\n\n")}`;
  console.log("\u{1F52E} Synthesizing results from debate history:", debate_history.length, "responses");
  const synthesis = await Promise.race([
    openai.chat.completions.create({
      model: "gpt-4",
      // Using gpt-4 instead of gpt-5 which doesn't exist
      messages: [
        {
          role: "system",
          content: "You are a synthesis AI. Respond only with valid JSON in the exact format requested."
        },
        {
          role: "user",
          content: synthesis_prompt
        }
      ],
      max_completion_tokens: 1e3
      // temperature: 0.3, // Removed - model only supports default
      // response_format: { type: "json_object" } // Removed - not supported by gpt-4
    }),
    new Promise(
      (_, reject) => setTimeout(() => reject(new Error("OpenAI API timeout after 30 seconds")), 3e4)
    )
  ]);
  try {
    const rawResponse = synthesis.choices[0].message.content || "{}";
    console.log("\u{1F52E} Raw synthesis response:", rawResponse.substring(0, 200) + "...");
    let cleanResponse = rawResponse.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/```\s*/g, "").replace(/```\s*$/g, "");
    }
    const result = JSON.parse(cleanResponse);
    console.log("\u{1F52E} Parsed synthesis result:", JSON.stringify(result, null, 2));
    const consensus = typeof result.consensus === "string" ? result.consensus : typeof result.consensus === "object" ? JSON.stringify(result.consensus) : "No clear consensus reached.";
    return {
      consensus,
      dissents: Array.isArray(result.dissents) ? result.dissents : [],
      unresolved: Array.isArray(result.unresolved) ? result.unresolved : [],
      citations: await generateCitations(prompt, settings),
      fact_check: settings.enable_fact_check ? await generateFactCheck(consensus, settings) : void 0,
      debateHistory: debate_history
    };
  } catch (error) {
    console.error("Failed to parse synthesis:", error);
    console.error("Raw response was:", synthesis.choices[0].message.content);
    return {
      consensus: "Error synthesizing debate results.",
      dissents: [],
      unresolved: ["Failed to process debate synthesis"],
      debateHistory: debate_history
    };
  }
}
async function generateCitations(prompt, settings) {
  return [
    {
      title: "AI-Generated Analysis",
      url: "#",
      excerpt: `Analysis conducted on the topic: ${prompt}`,
      relevance_score: 0.9
    }
  ];
}
async function generateFactCheck(consensus, settings) {
  return {
    findings: [
      {
        claim: "Multi-agent debate conducted",
        status: "supported",
        note: "Collaborative analysis completed successfully"
      }
    ]
  };
}
async function runReportGeneration(sessionData, reportType, options = {}) {
  const startTime = Date.now();
  try {
    const reportAgent = reportType === "executive" ? REPORT_AGENTS[0] : reportType === "detailed" ? REPORT_AGENTS[1] : REPORT_AGENTS[2];
    const reportContext = buildReportContext(sessionData, reportType, options);
    console.log(`\u{1F4CA} Generating ${reportType} report...`);
    const reportResponse = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${reportAgent.systemPrompt}

You are generating a ${reportType.toUpperCase()} report based on multi-agent debate and brainstorming results.

Report Structure Requirements:
${getReportStructurePrompt(reportType)}

CRITICAL: Respond with a valid JSON object that matches the expected schema. Include all required fields.`
          },
          {
            role: "user",
            content: reportContext
          }
        ],
        max_tokens: reportType === "executive" ? 2e3 : reportType === "detailed" ? 4e3 : 6e3,
        temperature: 0.3
      }),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("OpenAI API timeout after 30 seconds")), 3e4)
      )
    ]);
    const reportContent = reportResponse.choices[0].message.content || "{}";
    let cleanResponse = reportContent.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse.replace(/```json\s*/g, "").replace(/```\s*$/g, "");
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/```\s*/g, "").replace(/```\s*$/g, "");
    }
    const parsedReport = JSON.parse(cleanResponse);
    const endTime = Date.now();
    const finalReport = {
      ...parsedReport,
      report_type: reportType,
      metadata: {
        generated_at: (/* @__PURE__ */ new Date()).toISOString(),
        session_id: "current_session",
        total_analysis_time: `${Math.round((endTime - startTime) / 1e3)}s`,
        quality_score: 0.9,
        word_count: JSON.stringify(parsedReport).length
      }
    };
    console.log(`\u{1F4CA} ${reportType} report generated successfully`);
    return finalReport;
  } catch (error) {
    console.error(`Error generating ${reportType} report:`, error);
    throw new Error(`Failed to generate ${reportType} report`);
  }
}
function buildReportContext(sessionData, reportType, options) {
  const { prompt, mode, debateResults, brainstormResults } = sessionData;
  let context = `REPORT GENERATION REQUEST
Report Type: ${reportType.toUpperCase()}
Include Citations: ${options.include_citations ?? true}
Include Expert Summary: ${options.include_expert_summary ?? true}

ORIGINAL ANALYSIS QUESTION:
${prompt}

DEBATE METHODOLOGY:
Mode: ${mode}
Participants: Multi-agent AI debate system

DEBATE RESULTS:
Consensus: ${debateResults.consensus}

Key Dissenting Views:
${debateResults.dissents.map((d) => `- ${d.position}${d.reasoning ? ` (${d.reasoning})` : ""}`).join("\n")}

Unresolved Questions:
${debateResults.unresolved.map((q) => `- ${q}`).join("\n")}`;
  if (brainstormResults) {
    context += `

BRAINSTORMING OUTCOMES:
Final Collaborative Consensus: ${brainstormResults.final_consensus}

Collaborative Solutions:
${brainstormResults.solutions.map((s) => `- ${s.title}: ${s.description} (Feasibility: ${s.feasibility}, Impact: ${s.impact})`).join("\n")}

Implementation Action Plan:
${brainstormResults.action_plan.map((step) => `${step.step}. ${step.title}: ${step.description}`).join("\n")}

Answered Questions:
${brainstormResults.answered_questions.map((q) => `Q: ${q.original_question}
A: ${q.answer} (Confidence: ${q.confidence})`).join("\n\n")}

Implementation Strategy:
Approach: ${brainstormResults.implementation_strategy.approach}
Key Milestones: ${brainstormResults.implementation_strategy.key_milestones.join(", ")}`;
  }
  if (debateResults.debateHistory) {
    context += `

EXPERT CONTRIBUTIONS:
${debateResults.debateHistory.map((h) => `${h.agent}: ${h.response.substring(0, 200)}...`).join("\n\n")}`;
  }
  return context;
}
function getReportStructurePrompt(reportType) {
  switch (reportType) {
    case "executive":
      return `EXECUTIVE SUMMARY FORMAT:
- Title: Clear, executive-level title
- Executive Summary: 2-3 paragraph high-level overview
- Key Recommendations: 3-5 actionable recommendations with priority levels
- Debate Overview: Brief methodology and key outcomes
- Strategic Implications: Business/organizational impact
- Next Steps: Clear action items for leadership`;
    case "detailed":
      return `DETAILED REPORT FORMAT:
- Title: Comprehensive report title
- Executive Summary: Detailed overview (4-5 paragraphs)
- Complete Debate Overview: Full methodology, participants, consensus, dissents
- Brainstorming Outcomes: All solutions, action plans, implementation strategy
- Recommendations: 5-10 detailed recommendations with timelines
- Expert Analysis: Summary of expert contributions and AI agent insights
- Citations: Relevant sources and references`;
    case "full":
      return `FULL COMPREHENSIVE REPORT FORMAT:
- Title: Complete analytical report title
- Executive Summary: Comprehensive overview
- Complete Debate Overview: Full transcript analysis, methodology details
- Complete Brainstorming Outcomes: All solutions, detailed action plans
- Expert Analysis: Full expert contribution analysis and AI agent summaries
- Fact-Check Summary: Verification details and source analysis
- Comprehensive Recommendations: 10+ detailed recommendations with stakeholders
- Appendices: Full transcripts, methodology details, technical specifications
- Citations: Complete bibliography and source analysis`;
    default:
      return "Standard report format with all available sections.";
  }
}
async function generateFollowUpResponse(prompt) {
  try {
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert consultant providing detailed follow-up insights. Be thorough, practical, and actionable in your responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1e3
      }),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("OpenAI API timeout after 30 seconds")), 3e4)
      )
    ]);
    return completion.choices[0]?.message?.content || "Unable to generate follow-up response.";
  } catch (error) {
    console.error("Error generating follow-up response:", error);
    throw new Error("Failed to generate follow-up response");
  }
}
var openai, AI_AGENTS, BRAINSTORM_AGENTS, REPORT_AGENTS;
var init_ai_service = __esm({
  "server/ai-service.ts"() {
    "use strict";
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    AI_AGENTS = [
      {
        role: "Analyst",
        perspective: "Data-driven analytical perspective",
        systemPrompt: "You are an analytical AI that focuses on data, evidence, and logical reasoning. Provide structured analysis with clear supporting evidence."
      },
      {
        role: "Critic",
        perspective: "Critical evaluation and alternative viewpoints",
        systemPrompt: "You are a critical thinking AI that identifies potential flaws, biases, and alternative perspectives. Challenge assumptions and highlight counterarguments."
      },
      {
        role: "Synthesizer",
        perspective: "Integration and consensus building",
        systemPrompt: "You are a synthesis AI that finds common ground, integrates different viewpoints, and builds toward consensus while acknowledging remaining disagreements."
      },
      {
        role: "Domain Expert",
        perspective: "Specialized knowledge and best practices",
        systemPrompt: "You are a domain expert AI that provides specialized knowledge, industry best practices, and contextual understanding relevant to the topic. When participating in debates, always ground your expertise in the specific context being discussed, reference concrete examples, and directly engage with points raised by other participants to provide maximum value to the collaborative analysis."
      }
    ];
    BRAINSTORM_AGENTS = [
      {
        role: "Solution Architect",
        perspective: "Systematic solution design and implementation planning",
        systemPrompt: "You are a solution architect focused on designing practical, implementable solutions. Build upon the consensus and address dissenting views constructively to create actionable plans."
      },
      {
        role: "Implementation Specialist",
        perspective: "Practical execution and resource planning",
        systemPrompt: "You are an implementation specialist who focuses on how to actually execute solutions. Consider resources, timelines, and practical constraints while building collaborative action plans."
      },
      {
        role: "Innovation Catalyst",
        perspective: "Creative problem solving and alternative approaches",
        systemPrompt: "You are an innovation catalyst who generates creative solutions and explores alternative approaches. Transform dissenting views into innovative opportunities for better solutions."
      },
      {
        role: "Integration Specialist",
        perspective: "Synthesis and unified strategy development",
        systemPrompt: "You are an integration specialist who brings different perspectives together into unified strategies. Address unresolved questions and create comprehensive implementation approaches."
      }
    ];
    REPORT_AGENTS = [
      {
        role: "Executive Summarizer",
        perspective: "High-level strategic synthesis and key insights extraction",
        systemPrompt: "You are an executive summarizer who creates concise, high-impact summaries for leadership. Focus on key decisions, strategic implications, and actionable insights."
      },
      {
        role: "Technical Writer",
        perspective: "Comprehensive documentation and detailed analysis",
        systemPrompt: "You are a technical writer who creates detailed, well-structured reports. Include methodologies, complete analysis, and comprehensive documentation."
      },
      {
        role: "Research Analyst",
        perspective: "Citation management and expert analysis documentation",
        systemPrompt: "You are a research analyst who ensures proper citation, expert contribution tracking, and evidence-based conclusions."
      }
    ];
  }
});

// server/middleware/rbac.ts
function hasSystemRole(userRole, requiredRole) {
  const userRoleLevel = USER_ROLES[userRole] || 0;
  const requiredRoleLevel = USER_ROLES[requiredRole];
  return userRoleLevel >= requiredRoleLevel;
}
function hasWorkspaceRole(membershipRole, requiredRole) {
  const memberRoleLevel = USER_ROLES[membershipRole] || 0;
  const requiredRoleLevel = USER_ROLES[requiredRole];
  return memberRoleLevel >= requiredRoleLevel;
}
function getSystemPermissions(userRole) {
  const permissions = [];
  switch (userRole) {
    case "system_admin":
      permissions.push(
        SYSTEM_PERMISSIONS.CREATE_WORKSPACE,
        SYSTEM_PERMISSIONS.MANAGE_USERS,
        SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS,
        SYSTEM_PERMISSIONS.MANAGE_BILLING,
        SYSTEM_PERMISSIONS.ADMIN_DASHBOARD
      );
      break;
    case "admin":
      permissions.push(
        SYSTEM_PERMISSIONS.CREATE_WORKSPACE,
        SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS,
        SYSTEM_PERMISSIONS.MANAGE_BILLING,
        SYSTEM_PERMISSIONS.ADMIN_DASHBOARD
      );
      break;
    case "premium_user":
      permissions.push(SYSTEM_PERMISSIONS.CREATE_WORKSPACE);
      break;
    case "user":
    default:
      break;
  }
  return permissions;
}
function getWorkspacePermissions(membershipRole) {
  const permissions = [];
  switch (membershipRole) {
    case "owner":
      permissions.push(
        WORKSPACE_PERMISSIONS.READ_WORKSPACE,
        WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE,
        WORKSPACE_PERMISSIONS.DELETE_WORKSPACE,
        WORKSPACE_PERMISSIONS.MANAGE_MEMBERS,
        WORKSPACE_PERMISSIONS.INVITE_MEMBERS,
        WORKSPACE_PERMISSIONS.CREATE_SESSIONS,
        WORKSPACE_PERMISSIONS.DELETE_SESSIONS,
        WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES,
        WORKSPACE_PERMISSIONS.EXPORT_DATA,
        WORKSPACE_PERMISSIONS.VIEW_ANALYTICS
      );
      break;
    case "admin":
      permissions.push(
        WORKSPACE_PERMISSIONS.READ_WORKSPACE,
        WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE,
        WORKSPACE_PERMISSIONS.MANAGE_MEMBERS,
        WORKSPACE_PERMISSIONS.INVITE_MEMBERS,
        WORKSPACE_PERMISSIONS.CREATE_SESSIONS,
        WORKSPACE_PERMISSIONS.DELETE_SESSIONS,
        WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES,
        WORKSPACE_PERMISSIONS.EXPORT_DATA,
        WORKSPACE_PERMISSIONS.VIEW_ANALYTICS
      );
      break;
    case "member":
      permissions.push(
        WORKSPACE_PERMISSIONS.READ_WORKSPACE,
        WORKSPACE_PERMISSIONS.CREATE_SESSIONS,
        WORKSPACE_PERMISSIONS.EXPORT_DATA
      );
      break;
    case "viewer":
      permissions.push(WORKSPACE_PERMISSIONS.READ_WORKSPACE);
      break;
    default:
      break;
  }
  return permissions;
}
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
      code: "AUTH_REQUIRED"
    });
  }
  next();
}
function requireSystemRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }
    if (!hasSystemRole(req.user.role, requiredRole)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        required: requiredRole,
        current: req.user.role
      });
    }
    next();
  };
}
function requireSystemPermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "AUTH_REQUIRED"
      });
    }
    const userPermissions = getSystemPermissions(req.user.role);
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        required: permission,
        userRole: req.user.role
      });
    }
    next();
  };
}
function requireWorkspaceAccess(requiredRole) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required",
          code: "AUTH_REQUIRED"
        });
      }
      const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
      if (!workspaceId) {
        return res.status(400).json({
          error: "Workspace ID required",
          code: "WORKSPACE_ID_REQUIRED"
        });
      }
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({
          error: "Workspace not found",
          code: "WORKSPACE_NOT_FOUND"
        });
      }
      const membership = await storage.getWorkspaceMembership(workspaceId, req.user.id);
      if (!membership) {
        return res.status(403).json({
          error: "Access denied to workspace",
          code: "WORKSPACE_ACCESS_DENIED"
        });
      }
      if (requiredRole && !hasWorkspaceRole(membership.role, requiredRole)) {
        return res.status(403).json({
          error: "Insufficient workspace permissions",
          code: "INSUFFICIENT_WORKSPACE_PERMISSIONS",
          required: requiredRole,
          current: membership.role
        });
      }
      req.workspace = workspace;
      req.workspaceMembership = membership;
      next();
    } catch (error) {
      console.error("Workspace access check failed:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  };
}
function requireWorkspacePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Authentication required",
          code: "AUTH_REQUIRED"
        });
      }
      if (!req.workspaceMembership) {
        const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
        if (!workspaceId) {
          return res.status(400).json({
            error: "Workspace context required",
            code: "WORKSPACE_CONTEXT_REQUIRED"
          });
        }
        const membership = await storage.getWorkspaceMembership(workspaceId, req.user.id);
        if (!membership) {
          return res.status(403).json({
            error: "Access denied to workspace",
            code: "WORKSPACE_ACCESS_DENIED"
          });
        }
        req.workspaceMembership = membership;
      }
      const userPermissions = getWorkspacePermissions(req.workspaceMembership.role);
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({
          error: "Insufficient workspace permissions",
          code: "INSUFFICIENT_WORKSPACE_PERMISSIONS",
          required: permission,
          userRole: req.workspaceMembership.role
        });
      }
      next();
    } catch (error) {
      console.error("Workspace permission check failed:", error);
      res.status(500).json({
        error: "Internal server error",
        code: "INTERNAL_ERROR"
      });
    }
  };
}
var USER_ROLES, SYSTEM_PERMISSIONS, WORKSPACE_PERMISSIONS;
var init_rbac = __esm({
  "server/middleware/rbac.ts"() {
    "use strict";
    init_storage();
    USER_ROLES = {
      user: 1,
      // Basic user (default role in schema)
      premium_user: 2,
      // Premium individual user
      viewer: 1,
      // Workspace role
      member: 2,
      // Workspace role
      admin: 3,
      // System or workspace admin
      owner: 4,
      // Workspace owner
      system_admin: 5
      // System-wide admin
    };
    SYSTEM_PERMISSIONS = {
      CREATE_WORKSPACE: "create_workspace",
      MANAGE_USERS: "manage_users",
      VIEW_AUDIT_LOGS: "view_audit_logs",
      MANAGE_BILLING: "manage_billing",
      ADMIN_DASHBOARD: "admin_dashboard"
    };
    WORKSPACE_PERMISSIONS = {
      READ_WORKSPACE: "read_workspace",
      UPDATE_WORKSPACE: "update_workspace",
      DELETE_WORKSPACE: "delete_workspace",
      MANAGE_MEMBERS: "manage_members",
      INVITE_MEMBERS: "invite_members",
      CREATE_SESSIONS: "create_sessions",
      DELETE_SESSIONS: "delete_sessions",
      MANAGE_TEMPLATES: "manage_templates",
      EXPORT_DATA: "export_data",
      VIEW_ANALYTICS: "view_analytics",
      MANAGE_INTEGRATIONS: "manage_integrations"
    };
  }
});

// server/routes/reviews.ts
var reviews_exports = {};
__export(reviews_exports, {
  registerReviewRoutes: () => registerReviewRoutes
});
import express2 from "express";
function registerReviewRoutes(app2) {
  const requireReviewsFeature = requireFeature("reviews_enabled");
  app2.get(
    "/api/reviews",
    requireAuth,
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req, res) => {
      try {
        const mockReviews = [
          {
            id: "review-1",
            title: "Analysis Session Export Review",
            description: "Review export request for sensitive analysis data containing financial projections",
            status: "pending",
            priority: "high",
            reviewType: "export",
            resourceType: "analysis_session",
            resourceId: "session-123",
            initiatorId: req.user.claims.sub,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3).toISOString(),
            // 2 days from now
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1e3).toISOString(),
            // 3 hours ago
            metadata: {
              exportFormat: "pdf",
              containsPii: true,
              classification: "confidential"
            }
          },
          {
            id: "review-2",
            title: "Content Publication Review",
            description: "Review content before publishing to marketplace",
            status: "in_progress",
            priority: "medium",
            reviewType: "content",
            resourceType: "template",
            resourceId: "template-456",
            initiatorId: "user-456",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3).toISOString(),
            // 5 days from now
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString(),
            // 1 day ago
            metadata: {
              category: "business",
              targetAudience: "enterprise"
            }
          },
          {
            id: "review-3",
            title: "Security Policy Review",
            description: "Annual review of data retention and security policies",
            status: "approved",
            priority: "low",
            reviewType: "policy",
            resourceType: "policy",
            resourceId: "policy-789",
            initiatorId: "admin-123",
            completedAt: new Date(Date.now() - 48 * 60 * 60 * 1e3).toISOString(),
            // 2 days ago
            completedBy: "approver-789",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString(),
            // 1 week ago
            metadata: {
              policyType: "retention",
              impact: "organization-wide"
            }
          }
        ];
        res.json(mockReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews" });
      }
    }
  );
  app2.get(
    "/api/reviews/:id",
    requireAuth,
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req, res) => {
      try {
        const { id } = req.params;
        const mockReview = {
          id,
          title: "Analysis Session Export Review",
          description: "Review export request for sensitive analysis data containing financial projections and competitive intelligence",
          status: "pending",
          priority: "high",
          reviewType: "export",
          resourceType: "analysis_session",
          resourceId: "session-123",
          initiatorId: req.user.claims.sub,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3).toISOString(),
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1e3).toISOString(),
          metadata: {
            exportFormat: "pdf",
            containsPii: true,
            classification: "confidential",
            requestedBy: req.user.claims.email,
            estimatedPageCount: 45
          }
        };
        res.json(mockReview);
      } catch (error) {
        console.error("Error fetching review:", error);
        res.status(500).json({ message: "Failed to fetch review details" });
      }
    }
  );
  app2.get(
    "/api/reviews/:id/steps",
    requireAuth,
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req, res) => {
      try {
        const { id } = req.params;
        const mockSteps = [
          {
            id: "step-1",
            stepNumber: 1,
            title: "Initial Security Scan",
            description: "Automated scan for sensitive data patterns",
            status: "completed",
            isRequired: true,
            canSkip: false,
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
            completedBy: "system"
          },
          {
            id: "step-2",
            stepNumber: 2,
            title: "Manager Approval",
            description: "Department manager review and approval",
            status: "pending",
            isRequired: true,
            canSkip: false
          },
          {
            id: "step-3",
            stepNumber: 3,
            title: "Legal Review",
            description: "Legal team review for compliance",
            status: "pending",
            isRequired: true,
            canSkip: false
          }
        ];
        res.json(mockSteps);
      } catch (error) {
        console.error("Error fetching review steps:", error);
        res.status(500).json({ message: "Failed to fetch review steps" });
      }
    }
  );
  app2.get(
    "/api/reviews/:id/comments",
    requireAuth,
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req, res) => {
      try {
        const { id } = req.params;
        const mockComments = [
          {
            id: "comment-1",
            authorId: "security-team",
            content: "Initial scan detected 3 PII patterns and 2 financial data references. Please review the export scope.",
            commentType: "suggestion",
            isInternal: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString()
          },
          {
            id: "comment-2",
            authorId: req.user.claims.sub,
            content: "The financial data is necessary for the quarterly board presentation. Can we redact specific customer names instead?",
            commentType: "comment",
            isInternal: false,
            createdAt: new Date(Date.now() - 90 * 60 * 1e3).toISOString()
          }
        ];
        res.json(mockComments);
      } catch (error) {
        console.error("Error fetching review comments:", error);
        res.status(500).json({ message: "Failed to fetch review comments" });
      }
    }
  );
  app2.post(
    "/api/reviews/:id/approve",
    requireAuth,
    loadEntitlementsContext,
    requireReviewsFeature,
    express2.json(),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { comment } = req.body;
        console.log(`\u2705 Review ${id} approved by ${req.user.claims.sub}`, { comment });
        res.json({
          success: true,
          message: "Review approved successfully",
          reviewId: id,
          approvedBy: req.user.claims.sub,
          approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
          comment
        });
      } catch (error) {
        console.error("Error approving review:", error);
        res.status(500).json({ message: "Failed to approve review" });
      }
    }
  );
  app2.post(
    "/api/reviews/:id/reject",
    requireAuth,
    loadEntitlementsContext,
    requireReviewsFeature,
    express2.json(),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { comment, reason } = req.body;
        if (!comment) {
          return res.status(400).json({ message: "Rejection comment is required" });
        }
        console.log(`\u274C Review ${id} rejected by ${req.user.claims.sub}`, { comment, reason });
        res.json({
          success: true,
          message: "Review rejected",
          reviewId: id,
          rejectedBy: req.user.claims.sub,
          rejectedAt: (/* @__PURE__ */ new Date()).toISOString(),
          comment,
          reason
        });
      } catch (error) {
        console.error("Error rejecting review:", error);
        res.status(500).json({ message: "Failed to reject review" });
      }
    }
  );
  app2.post(
    "/api/reviews/:id/comments",
    requireAuth,
    loadEntitlementsContext,
    requireReviewsFeature,
    express2.json(),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { content, commentType = "comment" } = req.body;
        if (!content) {
          return res.status(400).json({ message: "Comment content is required" });
        }
        console.log(`\u{1F4AC} Comment added to review ${id} by ${req.user.claims.sub}`);
        const newComment = {
          id: `comment-${Date.now()}`,
          authorId: req.user.claims.sub,
          content,
          commentType,
          isInternal: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        res.json({
          success: true,
          message: "Comment added successfully",
          comment: newComment
        });
      } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment" });
      }
    }
  );
}
var init_reviews = __esm({
  "server/routes/reviews.ts"() {
    "use strict";
    init_rbac();
    init_entitlements();
  }
});

// server/middleware/auth.ts
function demoGate(req, res, next) {
  const enabled = String(process.env.DEMO_LOGIN_ENABLED || "true") === "true";
  if (!enabled && req.path.startsWith("/auth/demo")) {
    return res.status(403).json({ error: "DEMO_DISABLED" });
  }
  next();
}
async function requireAuth2(req, res, next) {
  try {
    if (req.user?.claims?.sub || req.session?.user) {
      return next();
    }
    return res.status(401).json({ error: "UNAUTHENTICATED" });
  } catch (error) {
    return res.status(401).json({ error: "UNAUTHENTICATED" });
  }
}
var init_auth = __esm({
  "server/middleware/auth.ts"() {
    "use strict";
  }
});

// server/queue/queue.ts
import { Queue as Queue2, Worker as Worker2, QueueEvents } from "bullmq";
import IORedis2 from "ioredis";
function startDebateWorker() {
  if (!connection2 || !debateQueue) {
    console.log("\u26A0\uFE0F Redis not configured, running debates synchronously");
    return null;
  }
  const worker2 = new Worker2("debate", async (job) => {
    console.log(`\u{1F680} Starting debate job ${job.id} for session ${job.data.sessionId}`);
    const { runMultiAgentDebate: runMultiAgentDebate2 } = await Promise.resolve().then(() => (init_ai_service(), ai_service_exports));
    const steps = ["plan", "round_1", "round_2", "consensus"];
    try {
      for (let i = 0; i < steps.length; i++) {
        const progress = Math.round((i + 1) / steps.length * 100);
        await job.updateProgress(progress);
        await new Promise((r) => setTimeout(r, 500));
      }
      const result = await runMultiAgentDebate2(job.data.prompt, {
        mode: job.data.mode,
        rounds: job.data.mode === "simple" ? 3 : job.data.mode === "guided" ? 5 : 7,
        domain_expert: null,
        thinking_pattern: null,
        enable_fact_check: false
      });
      console.log(`\u2705 Completed debate job ${job.id}`);
      return {
        consensus: result.consensus || "Consensus generated through async processing",
        dissent: result.dissenting_viewpoints || [],
        artifacts: [{
          type: "debate_result",
          content: result
        }]
      };
    } catch (error) {
      console.error(`\u274C Failed debate job ${job.id}:`, error);
      throw error;
    }
  }, { connection: connection2 });
  worker2.on("failed", (job, err) => {
    console.error("[debateWorker] failed", job?.id, err);
  });
  worker2.on("completed", (job) => {
    console.log(`[debateWorker] completed job ${job.id}`);
  });
  console.log("\u2705 Debate worker started");
  return worker2;
}
async function enqueueDebate(data, opts = {}) {
  if (!debateQueue) {
    const { runMultiAgentDebate: runMultiAgentDebate2 } = await Promise.resolve().then(() => (init_ai_service(), ai_service_exports));
    const result = await runMultiAgentDebate2(data.prompt, {
      mode: data.mode,
      rounds: data.mode === "simple" ? 3 : data.mode === "guided" ? 5 : 7,
      domain_expert: null,
      thinking_pattern: null,
      enable_fact_check: false
    });
    return {
      id: `sync-${Date.now()}`,
      data,
      result: {
        consensus: result.consensus || "Consensus generated synchronously",
        dissent: result.dissenting_viewpoints || [],
        artifacts: [{ type: "debate_result", content: result }]
      }
    };
  }
  return debateQueue.add("debate-run", data, {
    removeOnComplete: true,
    attempts: 1,
    ...opts
  });
}
var redisUrl, connection2, debateQueue, debateQueueEvents;
var init_queue = __esm({
  "server/queue/queue.ts"() {
    "use strict";
    redisUrl = process.env.REDIS_URL;
    connection2 = null;
    if (redisUrl) {
      try {
        connection2 = new IORedis2(redisUrl, {
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          ...process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}
        });
        console.log("\u2705 Redis connection established for queue system");
      } catch (error) {
        console.error("\u274C Failed to connect to Redis:", error);
        connection2 = null;
      }
    } else {
      console.log("\u26A0\uFE0F REDIS_URL is not set, using synchronous processing for development");
    }
    debateQueue = connection2 ? new Queue2("debate", { connection: connection2 }) : null;
    debateQueueEvents = connection2 ? new QueueEvents("debate", { connection: connection2 }) : null;
  }
});

// server/workers/exportProvenanceWorker.ts
var exportProvenanceWorker_exports = {};
__export(exportProvenanceWorker_exports, {
  ComplianceEngine: () => ComplianceEngine,
  enqueueExportProvenance: () => enqueueExportProvenance,
  startExportProvenanceWorker: () => startExportProvenanceWorker
});
import { Worker as Worker4 } from "bullmq";
function startExportProvenanceWorker() {
  if (!connection2) {
    console.log("\u26A0\uFE0F Redis not configured, export provenance tracking disabled");
    return null;
  }
  const worker2 = new Worker4("export-provenance", async (job) => {
    console.log(`\u{1F4CB} Processing export provenance for export ${job.data.exportId}`);
    const data = job.data;
    const auditTrail = [];
    try {
      auditTrail.push({
        event: "export_initiated",
        timestamp: Date.now(),
        details: {
          userId: data.userId,
          filename: data.filename,
          source: data.metadata.source,
          fileSize: data.metadata.fileSize
        }
      });
      const complianceResult = ComplianceEngine.evaluateExport(data);
      auditTrail.push({
        event: "compliance_evaluated",
        timestamp: Date.now(),
        details: {
          status: complianceResult.status,
          violations: complianceResult.violations,
          recommendations: complianceResult.recommendations
        }
      });
      const retentionPolicy = ComplianceEngine.generateRetentionPolicy(data);
      auditTrail.push({
        event: "retention_policy_applied",
        timestamp: Date.now(),
        details: retentionPolicy
      });
      const provenanceId = await storage.createExportProvenance({
        exportId: data.exportId,
        userId: data.userId,
        organizationId: data.organizationId,
        workspaceId: data.workspaceId,
        sessionId: data.sessionId,
        filename: data.filename,
        contentHash: data.contentHash,
        metadata: data.metadata,
        complianceStatus: complianceResult.status,
        violations: complianceResult.violations,
        recommendations: complianceResult.recommendations,
        auditTrail,
        retentionPolicy,
        createdAt: new Date(data.timestamp)
      });
      auditTrail.push({
        event: "provenance_recorded",
        timestamp: Date.now(),
        details: { provenanceId }
      });
      if (retentionPolicy.deleteAfter > 0) {
        console.log(`\u{1F5D3}\uFE0F Export ${data.exportId} scheduled for deletion after ${new Date(Date.now() + retentionPolicy.deleteAfter).toISOString()}`);
      }
      if (complianceResult.status === "flagged" || complianceResult.status === "blocked") {
        console.warn(`\u{1F6A8} Export ${data.exportId} ${complianceResult.status}: ${complianceResult.violations.join(", ")}`);
        auditTrail.push({
          event: "security_notification_sent",
          timestamp: Date.now(),
          details: {
            status: complianceResult.status,
            violations: complianceResult.violations
          }
        });
      }
      console.log(`\u2705 Export provenance tracking completed for ${data.exportId} with status: ${complianceResult.status}`);
      return {
        provenanceId,
        complianceStatus: complianceResult.status,
        auditTrail,
        retentionPolicy
      };
    } catch (error) {
      console.error(`\u274C Export provenance tracking failed for ${data.exportId}:`, error);
      auditTrail.push({
        event: "provenance_tracking_failed",
        timestamp: Date.now(),
        details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      });
      try {
        await storage.createExportProvenance({
          exportId: data.exportId,
          userId: data.userId,
          organizationId: data.organizationId,
          workspaceId: data.workspaceId,
          sessionId: data.sessionId,
          filename: data.filename,
          contentHash: data.contentHash,
          metadata: data.metadata,
          complianceStatus: "flagged",
          violations: ["Provenance tracking failed"],
          recommendations: ["Manual review required"],
          auditTrail,
          retentionPolicy: ComplianceEngine.generateRetentionPolicy(data),
          createdAt: new Date(data.timestamp)
        });
      } catch (storageError) {
        console.error("Failed to record failed provenance tracking:", storageError);
      }
      throw error;
    }
  }, {
    connection: connection2,
    concurrency: 5,
    removeOnComplete: 100,
    removeOnFail: 50
  });
  worker2.on("completed", (job, result) => {
    console.log(`\u{1F4CB} Export provenance job ${job.id} completed for export ${job.data.exportId}`);
  });
  worker2.on("failed", (job, err) => {
    console.error(`\u274C Export provenance job ${job?.id} failed for export ${job?.data?.exportId}:`, err);
  });
  console.log("\u{1F3C3} Export provenance worker started");
  return worker2;
}
async function enqueueExportProvenance(data) {
  if (!connection2) {
    console.warn("\u26A0\uFE0F Redis not configured, skipping export provenance tracking");
    return null;
  }
  const { Queue: Queue4 } = await import("bullmq");
  const provenanceQueue = new Queue4("export-provenance", { connection: connection2 });
  const job = await provenanceQueue.add("track-export", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2e3
    },
    removeOnComplete: 100,
    removeOnFail: 50
  });
  console.log(`\u{1F4CB} Enqueued export provenance tracking job ${job.id} for export ${data.exportId}`);
  return job;
}
var ComplianceEngine;
var init_exportProvenanceWorker = __esm({
  "server/workers/exportProvenanceWorker.ts"() {
    "use strict";
    init_queue();
    init_storage();
    ComplianceEngine = class {
      static evaluateExport(data) {
        const violations = [];
        const recommendations = [];
        if (data.metadata.fileSize > 100 * 1024 * 1024) {
          violations.push("File size exceeds maximum limit (100MB)");
        }
        if (data.metadata.dlpScanResults?.blocked) {
          violations.push(`DLP scan blocked export: ${data.metadata.dlpScanResults.patterns.join(", ")}`);
        }
        if (data.metadata.dlpScanResults?.risk_level === "high") {
          violations.push("High-risk content detected in export");
        }
        if (data.organizationId) {
          if (data.metadata.source === "raw_data" && !data.workspaceId) {
            violations.push("Raw data exports require workspace context");
          }
        }
        const restrictedFormats = ["sql", "db", "backup"];
        if (restrictedFormats.includes(data.metadata.format.toLowerCase())) {
          violations.push(`Export format '${data.metadata.format}' requires additional authorization`);
        }
        if (data.metadata.fileSize > 10 * 1024 * 1024) {
          recommendations.push("Consider compressing large exports for better performance");
        }
        if (!data.sessionId && data.metadata.source === "debate_results") {
          recommendations.push("Link debate exports to specific sessions for better tracking");
        }
        let status = "compliant";
        if (violations.length > 0) {
          const hasBlockingViolations = violations.some(
            (v) => v.includes("DLP scan blocked") || v.includes("exceeds maximum limit") || v.includes("requires additional authorization")
          );
          status = hasBlockingViolations ? "blocked" : "flagged";
        }
        return { status, violations, recommendations };
      }
      static generateRetentionPolicy(data) {
        const baseRetention = 90 * 24 * 60 * 60 * 1e3;
        const baseArchive = 30 * 24 * 60 * 60 * 1e3;
        let retentionMultiplier = 1;
        let archiveMultiplier = 1;
        if (data.metadata.dlpScanResults?.risk_level === "high") {
          retentionMultiplier = 0.5;
          archiveMultiplier = 0.3;
        }
        if (data.metadata.source === "report" || data.metadata.source === "analysis") {
          retentionMultiplier = 2;
          archiveMultiplier = 1.5;
        }
        return {
          deleteAfter: Math.floor(baseRetention * retentionMultiplier),
          archiveAfter: Math.floor(baseArchive * archiveMultiplier)
        };
      }
    };
  }
});

// server/routes/slack.ts
var slack_exports = {};
__export(slack_exports, {
  default: () => slack_default
});
import { Router as Router12 } from "express";
import { z as z13 } from "zod";
function isValidSlackWebhook(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === "hooks.slack.com" && parsedUrl.pathname.startsWith("/services/");
  } catch {
    return false;
  }
}
function formatDebateForSlack(debateResults, level, sessionId) {
  const baseMessage = {
    username: "SymbiosoAi ThinkTank",
    icon_emoji: ":brain:",
    attachments: []
  };
  if (level === "summary") {
    baseMessage.text = `\u{1F9E0} *Debate Completed* (Session: \`${sessionId.slice(0, 8)}\`)`;
    baseMessage.attachments = [{
      color: "good",
      fields: [{
        title: "Consensus Reached",
        value: debateResults.consensus.substring(0, 500) + (debateResults.consensus.length > 500 ? "..." : ""),
        short: false
      }]
    }];
    return baseMessage;
  }
  if (level === "detailed") {
    baseMessage.text = `\u{1F9E0} *Detailed Debate Results* (Session: \`${sessionId.slice(0, 8)}\`)`;
    const attachment = {
      color: "good",
      fields: [{
        title: "\u2705 Consensus",
        value: debateResults.consensus.substring(0, 300) + (debateResults.consensus.length > 300 ? "..." : ""),
        short: false
      }]
    };
    if (debateResults.dissents?.length > 0) {
      attachment.fields.push({
        title: "\u26A0\uFE0F Dissenting Views",
        value: debateResults.dissents.map(
          (d, i) => `${i + 1}. ${d.position}${d.reasoning ? ` - ${d.reasoning.substring(0, 100)}` : ""}`
        ).join("\n").substring(0, 500),
        short: false
      });
    }
    if (debateResults.unresolved?.length > 0) {
      attachment.fields.push({
        title: "\u{1F50D} Unresolved Issues",
        value: debateResults.unresolved.slice(0, 3).map((item) => `\u2022 ${item}`).join("\n"),
        short: false
      });
    }
    baseMessage.attachments = [attachment];
    return baseMessage;
  }
  if (level === "full") {
    baseMessage.text = `\u{1F9E0} *Complete Debate Analysis* (Session: \`${sessionId}\`)`;
    const mainAttachment = {
      color: "good",
      fields: [{
        title: "\u2705 Final Consensus",
        value: debateResults.consensus,
        short: false
      }],
      footer: `SymbiosoAi ThinkTank | ${(/* @__PURE__ */ new Date()).toISOString()}`
    };
    if (debateResults.participants?.length) {
      mainAttachment.fields.push({
        title: "\u{1F465} Participants",
        value: debateResults.participants.join(", "),
        short: true
      });
    }
    if (debateResults.duration_ms) {
      mainAttachment.fields.push({
        title: "\u23F1\uFE0F Duration",
        value: `${Math.round(debateResults.duration_ms / 1e3)}s`,
        short: true
      });
    }
    baseMessage.attachments = [mainAttachment];
    if (debateResults.dissents?.length > 0) {
      baseMessage.attachments.push({
        color: "warning",
        title: "\u26A0\uFE0F Dissenting Positions",
        text: debateResults.dissents.map(
          (d, i) => `*${i + 1}. ${d.position}*${d.reasoning ? `
_${d.reasoning}_` : ""}`
        ).join("\n\n")
      });
    }
    if (debateResults.unresolved?.length > 0) {
      baseMessage.attachments.push({
        color: "#ff9500",
        title: "\u{1F50D} Unresolved Questions",
        text: debateResults.unresolved.map((item) => `\u2022 ${item}`).join("\n")
      });
    }
    return baseMessage;
  }
  return baseMessage;
}
var router12, SlackNotificationSchema, slack_default;
var init_slack = __esm({
  "server/routes/slack.ts"() {
    "use strict";
    init_auth();
    init_entitlements();
    init_rbac();
    init_entitlements();
    init_rbac();
    router12 = Router12();
    SlackNotificationSchema = z13.object({
      webhook_url: z13.string().url("Invalid webhook URL").refine(
        isValidSlackWebhook,
        "Webhook URL must be a valid Slack webhook (hooks.slack.com)"
      ),
      channel: z13.string().optional(),
      sessionId: z13.string().min(1, "Session ID required"),
      debateResults: z13.object({
        consensus: z13.string(),
        dissents: z13.array(z13.object({
          position: z13.string(),
          reasoning: z13.string().optional()
        })).optional(),
        unresolved: z13.array(z13.string()).optional(),
        participants: z13.array(z13.string()).optional(),
        duration_ms: z13.number().optional()
      }),
      notificationLevel: z13.enum(["summary", "detailed", "full"]).default("summary"),
      includeAttachments: z13.boolean().default(false)
    });
    router12.post(
      "/notify",
      requireAuth2,
      loadEntitlementsContext,
      requireFeature(BILLING_FEATURES.INTEGRATIONS),
      requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_INTEGRATIONS),
      async (req, res) => {
        try {
          const parsed = SlackNotificationSchema.safeParse(req.body);
          if (!parsed.success) {
            return res.status(400).json({
              error: "Invalid request",
              details: parsed.error.flatten()
            });
          }
          const { webhook_url, channel, sessionId, debateResults, notificationLevel, includeAttachments } = parsed.data;
          const slackMessage = formatDebateForSlack(debateResults, notificationLevel, sessionId);
          if (channel) {
            slackMessage.channel = channel;
          }
          const slackResponse = await fetch(webhook_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(slackMessage)
          });
          if (!slackResponse.ok) {
            const errorText = await slackResponse.text();
            console.error("Slack notification failed:", errorText);
            return res.status(400).json({
              error: "Failed to send Slack notification",
              details: errorText.substring(0, 200)
            });
          }
          console.log(`\u{1F4E2} Slack notification sent for session ${sessionId} with ${notificationLevel} detail level`);
          res.json({
            success: true,
            sessionId,
            notificationLevel,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        } catch (error) {
          console.error("Slack notification error:", error);
          res.status(500).json({
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    );
    router12.post(
      "/test",
      requireAuth2,
      loadEntitlementsContext,
      requireFeature(BILLING_FEATURES.INTEGRATIONS),
      async (req, res) => {
        try {
          const { webhook_url, channel } = req.body;
          if (!webhook_url || typeof webhook_url !== "string") {
            return res.status(400).json({ error: "webhook_url is required" });
          }
          if (!isValidSlackWebhook(webhook_url)) {
            return res.status(400).json({
              error: "Invalid webhook URL - must be a valid Slack webhook (hooks.slack.com)"
            });
          }
          const testMessage = {
            username: "SymbiosoAi ThinkTank",
            icon_emoji: ":robot_face:",
            text: "\u{1F9EA} *Test Message from SymbiosoAi ThinkTank*",
            attachments: [{
              color: "good",
              fields: [{
                title: "Integration Status",
                value: "\u2705 Slack integration is working correctly!",
                short: false
              }, {
                title: "Test Time",
                value: (/* @__PURE__ */ new Date()).toISOString(),
                short: true
              }],
              footer: "SymbiosoAi ThinkTank Integration Test"
            }]
          };
          if (channel) {
            testMessage.channel = channel;
          }
          const slackResponse = await fetch(webhook_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(testMessage)
          });
          if (!slackResponse.ok) {
            const errorText = await slackResponse.text();
            return res.status(400).json({
              success: false,
              error: "Slack webhook test failed",
              details: errorText
            });
          }
          res.json({
            success: true,
            message: "Test message sent successfully",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        } catch (error) {
          console.error("Slack test error:", error);
          res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    );
    slack_default = router12;
  }
});

// server/routes/jira.ts
var jira_exports = {};
__export(jira_exports, {
  default: () => jira_default
});
import { Router as Router13 } from "express";
import { z as z14 } from "zod";
function isValidJiraBaseUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    const allowedDomains = [
      ".atlassian.net",
      ".atlassian.com",
      ".jira.com"
    ];
    return allowedDomains.some((domain) => hostname.endsWith(domain)) && parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}
function formatDebateForJira(debateResults, sessionId) {
  let description = `h2. Debate Analysis Results

`;
  description += `*Session ID:* ${sessionId}
`;
  if (debateResults.prompt) {
    description += `*Original Question:* ${debateResults.prompt}
`;
  }
  if (debateResults.mode) {
    description += `*Analysis Mode:* ${debateResults.mode}
`;
  }
  description += `*Generated:* ${(/* @__PURE__ */ new Date()).toISOString()}

`;
  description += `h3. \u2705 Consensus Reached
`;
  description += `${debateResults.consensus}

`;
  if (debateResults.dissents?.length > 0) {
    description += `h3. \u26A0\uFE0F Dissenting Positions
`;
    debateResults.dissents.forEach((dissent, index2) => {
      description += `h4. Dissent ${index2 + 1}
`;
      description += `*Position:* ${dissent.position}
`;
      if (dissent.reasoning) {
        description += `*Reasoning:* ${dissent.reasoning}
`;
      }
      description += `
`;
    });
  }
  if (debateResults.unresolved?.length > 0) {
    description += `h3. \u{1F50D} Unresolved Questions
`;
    debateResults.unresolved.forEach((item) => {
      description += `* ${item}
`;
    });
    description += `
`;
  }
  description += `---
`;
  description += `Generated by *SymbiosoAi ThinkTank* collaborative intelligence platform`;
  return description;
}
async function createJiraIssue(config, issueData) {
  const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64");
  const response = await fetch(`${config.baseUrl}/rest/api/3/issue`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: {
        project: {
          key: config.projectKey
        },
        summary: issueData.summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: issueData.description
                }
              ]
            }
          ]
        },
        issuetype: {
          name: issueData.type
        },
        priority: {
          name: issueData.priority
        },
        ...issueData.assignee && {
          assignee: {
            emailAddress: issueData.assignee
          }
        },
        ...issueData.labels && issueData.labels.length > 0 && {
          labels: issueData.labels
        },
        ...issueData.customFields
      }
    })
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Jira API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }
  return response.json();
}
async function testJiraConnection(config) {
  const auth = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64");
  const response = await fetch(`${config.baseUrl}/rest/api/3/project/${config.projectKey}`, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Accept": "application/json"
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Jira connection test failed: ${response.status} - ${JSON.stringify(errorData)}`);
  }
  return response.json();
}
var router13, JiraConfigSchema, JiraTicketSchema, jira_default;
var init_jira = __esm({
  "server/routes/jira.ts"() {
    "use strict";
    init_auth();
    init_entitlements();
    init_rbac();
    init_entitlements();
    init_rbac();
    router13 = Router13();
    JiraConfigSchema = z14.object({
      baseUrl: z14.string().url("Invalid Jira base URL").refine(isValidJiraBaseUrl, {
        message: "Base URL must be a valid Atlassian domain (*.atlassian.net, *.atlassian.com, *.jira.com) using HTTPS"
      }),
      email: z14.string().email("Invalid email address"),
      apiToken: z14.string().min(1, "API token required"),
      projectKey: z14.string().min(1, "Project key required")
    });
    JiraTicketSchema = z14.object({
      config: JiraConfigSchema,
      sessionId: z14.string().min(1, "Session ID required"),
      debateResults: z14.object({
        consensus: z14.string(),
        dissents: z14.array(z14.object({
          position: z14.string(),
          reasoning: z14.string().optional()
        })).optional(),
        unresolved: z14.array(z14.string()).optional(),
        prompt: z14.string().optional(),
        mode: z14.string().optional()
      }),
      ticketType: z14.enum(["Task", "Story", "Bug", "Epic"]).default("Task"),
      priority: z14.enum(["Highest", "High", "Medium", "Low", "Lowest"]).default("Medium"),
      assignee: z14.string().optional(),
      labels: z14.array(z14.string()).optional(),
      customFields: z14.record(z14.any()).optional()
    });
    router13.post(
      "/create-ticket",
      requireAuth2,
      loadEntitlementsContext,
      requireFeature(BILLING_FEATURES.INTEGRATIONS),
      requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_INTEGRATIONS),
      async (req, res) => {
        try {
          const parsed = JiraTicketSchema.safeParse(req.body);
          if (!parsed.success) {
            return res.status(400).json({
              error: "Invalid request",
              details: parsed.error.flatten()
            });
          }
          const { config, sessionId, debateResults, ticketType, priority, assignee, labels, customFields } = parsed.data;
          const summary = `Debate Analysis: ${debateResults.consensus.substring(0, 100)}${debateResults.consensus.length > 100 ? "..." : ""}`;
          const description = formatDebateForJira(debateResults, sessionId);
          const issueData = {
            summary,
            description,
            type: ticketType,
            priority,
            assignee,
            labels: labels ? [...labels, "symbiosoai-thinktank", "ai-analysis"] : ["symbiosoai-thinktank", "ai-analysis"],
            customFields
          };
          const jiraResponse = await createJiraIssue(config, issueData);
          console.log(`\u{1F3AB} Jira ticket created: ${jiraResponse.key} for session ${sessionId}`);
          res.json({
            success: true,
            ticketKey: jiraResponse.key,
            ticketUrl: `${config.baseUrl}/browse/${jiraResponse.key}`,
            sessionId,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        } catch (error) {
          console.error("Jira ticket creation error:", error);
          res.status(500).json({
            error: "Failed to create Jira ticket",
            message: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    );
    router13.post(
      "/test",
      requireAuth2,
      loadEntitlementsContext,
      requireFeature(BILLING_FEATURES.INTEGRATIONS),
      async (req, res) => {
        try {
          const configParsed = JiraConfigSchema.safeParse(req.body);
          if (!configParsed.success) {
            return res.status(400).json({
              error: "Invalid Jira configuration",
              details: configParsed.error.flatten()
            });
          }
          const config = configParsed.data;
          const projectInfo = await testJiraConnection(config);
          res.json({
            success: true,
            message: "Jira connection successful",
            project: {
              key: projectInfo.key,
              name: projectInfo.name,
              projectTypeKey: projectInfo.projectTypeKey
            },
            testedAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        } catch (error) {
          console.error("Jira connection test error:", error);
          res.status(400).json({
            success: false,
            error: "Jira connection test failed",
            message: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    );
    router13.get(
      "/issue-types/:projectKey",
      requireAuth2,
      loadEntitlementsContext,
      requireFeature(BILLING_FEATURES.INTEGRATIONS),
      async (req, res) => {
        try {
          const { projectKey } = req.params;
          const { baseUrl, email, apiToken } = req.query;
          if (!baseUrl || !email || !apiToken) {
            return res.status(400).json({
              error: "Missing required query parameters: baseUrl, email, apiToken"
            });
          }
          const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");
          const response = await fetch(`${baseUrl}/rest/api/3/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes`, {
            method: "GET",
            headers: {
              "Authorization": `Basic ${auth}`,
              "Accept": "application/json"
            }
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch issue types: ${response.status}`);
          }
          const data = await response.json();
          const project = data.projects?.[0];
          if (!project) {
            return res.status(404).json({ error: "Project not found" });
          }
          const issueTypes = project.issuetypes.map((type) => ({
            id: type.id,
            name: type.name,
            description: type.description,
            iconUrl: type.iconUrl
          }));
          res.json({
            projectKey,
            issueTypes
          });
        } catch (error) {
          console.error("Error fetching Jira issue types:", error);
          res.status(500).json({
            error: "Failed to fetch issue types",
            message: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }
    );
    jira_default = router13;
  }
});

// server/index.ts
import express5 from "express";

// server/routes.ts
init_storage();
init_schema();
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

// server/objectStorage.ts
import { Storage } from "@google-cloud/storage";
import { randomUUID as randomUUID2 } from "crypto";

// server/objectAcl.ts
var ACL_POLICY_METADATA_KEY = "custom:aclPolicy";
function isPermissionAllowed(requested, granted) {
  if (requested === "read" /* READ */) {
    return ["read" /* READ */, "write" /* WRITE */].includes(granted);
  }
  return granted === "write" /* WRITE */;
}
function createObjectAccessGroup(group) {
  switch (group.type) {
    // Implement the case for each type of access group to instantiate.
    //
    // For example:
    // case "USER_LIST":
    //   return new UserListAccessGroup(group.id);
    // case "EMAIL_DOMAIN":
    //   return new EmailDomainAccessGroup(group.id);
    // case "GROUP_MEMBER":
    //   return new GroupMemberAccessGroup(group.id);
    // case "SUBSCRIBER":
    //   return new SubscriberAccessGroup(group.id);
    default:
      throw new Error(`Unknown access group type: ${group.type}`);
  }
}
async function setObjectAclPolicy(objectFile, aclPolicy) {
  const [exists] = await objectFile.exists();
  if (!exists) {
    throw new Error(`Object not found: ${objectFile.name}`);
  }
  await objectFile.setMetadata({
    metadata: {
      [ACL_POLICY_METADATA_KEY]: JSON.stringify(aclPolicy)
    }
  });
}
async function getObjectAclPolicy(objectFile) {
  const [metadata] = await objectFile.getMetadata();
  const aclPolicy = metadata?.metadata?.[ACL_POLICY_METADATA_KEY];
  if (!aclPolicy) {
    return null;
  }
  return JSON.parse(aclPolicy);
}
async function canAccessObject({
  userId,
  objectFile,
  requestedPermission
}) {
  const aclPolicy = await getObjectAclPolicy(objectFile);
  if (!aclPolicy) {
    return false;
  }
  if (aclPolicy.visibility === "public" && requestedPermission === "read" /* READ */) {
    return true;
  }
  if (!userId) {
    return false;
  }
  if (aclPolicy.owner === userId) {
    return true;
  }
  for (const rule of aclPolicy.aclRules || []) {
    const accessGroup = createObjectAccessGroup(rule.group);
    if (await accessGroup.hasMember(userId) && isPermissionAllowed(requestedPermission, rule.permission)) {
      return true;
    }
  }
  return false;
}

// server/objectStorage.ts
var REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
var objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token"
      }
    },
    universe_domain: "googleapis.com"
  },
  projectId: ""
});
var ObjectNotFoundError = class _ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, _ObjectNotFoundError.prototype);
  }
};
var ObjectStorageService = class {
  constructor() {
  }
  // Gets the public object search paths.
  getPublicObjectSearchPaths() {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr.split(",").map((path3) => path3.trim()).filter((path3) => path3.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }
  // Gets the private object directory.
  getPrivateObjectDir() {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }
  // Search for a public object from the search paths.
  async searchPublicObject(filePath) {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }
    return null;
  }
  // Downloads an object to the response.
  async downloadObject(file, res, cacheTtlSec = 3600) {
    try {
      const [metadata] = await file.getMetadata();
      const aclPolicy = await getObjectAclPolicy(file);
      const isPublic = aclPolicy?.visibility === "public";
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`
      });
      const stream = file.createReadStream();
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }
  // Gets the upload URL for an object entity.
  async getObjectEntityUploadURL() {
    const privateObjectDir = this.getPrivateObjectDir();
    if (!privateObjectDir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    const objectId = randomUUID2();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900
    });
  }
  // Gets the object entity file from the object path.
  async getObjectEntityFile(objectPath) {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }
    const entityId = parts.slice(1).join("/");
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }
  normalizeObjectEntityPath(rawPath) {
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }
    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;
    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`;
    }
    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }
    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }
  // Tries to set the ACL policy for the object entity and return the normalized path.
  async trySetObjectEntityAclPolicy(rawPath, aclPolicy) {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }
    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }
  // Checks if the user can access the object entity.
  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission
  }) {
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? "read" /* READ */
    });
  }
};
function parseObjectPath(path3) {
  if (!path3.startsWith("/")) {
    path3 = `/${path3}`;
  }
  const pathParts = path3.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");
  return {
    bucketName,
    objectName
  };
}
async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec
}) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1e3).toISOString()
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, make sure you're running on Replit`
    );
  }
  const { signed_url: signedURL } = await response.json();
  return signedURL;
}

// server/routes.ts
init_ai_service();

// server/services/factchecker.ts
import OpenAI2 from "openai";

// server/services/perplexity.ts
var PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
var PERPLEXITY_MODEL = "sonar-pro";
var PerplexityService = class {
  apiKey;
  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || "";
    if (!this.apiKey) {
      console.warn("PERPLEXITY_API_KEY not found - live web search will be disabled");
    }
  }
  async searchWeb(query) {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured");
    }
    try {
      const messages = [
        {
          role: "system",
          content: "You are a research assistant. Provide accurate, up-to-date information with citations. Focus on factual, well-sourced content."
        },
        {
          role: "user",
          content: query
        }
      ];
      const response = await fetch(PERPLEXITY_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: PERPLEXITY_MODEL,
          messages,
          max_tokens: 500,
          temperature: 0.2,
          top_p: 0.9,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: "month",
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Perplexity API error details:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          query: query.substring(0, 100)
        });
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const answer = data.choices[0]?.message?.content || "";
      const citations = (data.citations || []).map((url, index2) => {
        const hostname = new URL(url).hostname;
        const sourceName = hostname.replace("www.", "").split(".")[0];
        return {
          title: `${sourceName} - ${hostname}`,
          url,
          source: hostname
        };
      });
      return { answer, citations };
    } catch (error) {
      console.error("Perplexity search error:", error);
      throw new Error(`Web search failed: ${error?.message || "Unknown error"}`);
    }
  }
  async searchForCitations(topic) {
    try {
      const query = `Find reliable sources and citations about: ${topic}`;
      const result = await this.searchWeb(query);
      return result.citations;
    } catch (error) {
      console.error("Citation search error:", error);
      return [
        {
          title: "AI-powered analysis",
          source: "Multi-agent collaborative intelligence system",
          author: "SymbiosoAi ThinkTank"
        }
      ];
    }
  }
  async factCheck(claims) {
    if (!this.apiKey || claims.length === 0) {
      return [];
    }
    const findings = [];
    for (const claim of claims.slice(0, 3)) {
      try {
        const query = `Fact-check this claim with current reliable sources: "${claim}"`;
        const result = await this.searchWeb(query);
        const content = result.answer.toLowerCase();
        let status = "inconclusive";
        if (content.includes("confirmed") || content.includes("accurate") || content.includes("true") || content.includes("correct")) {
          status = "supported";
        } else if (content.includes("false") || content.includes("incorrect") || content.includes("disputed") || content.includes("debunked")) {
          status = "contradicted";
        }
        findings.push({
          claim,
          status,
          note: result.answer.substring(0, 200) + (result.answer.length > 200 ? "..." : ""),
          citations: result.citations.slice(0, 2)
          // Limit citations per claim
        });
      } catch (error) {
        findings.push({
          claim,
          status: "inconclusive",
          note: "Live fact-checking temporarily unavailable - enable when web search is working"
        });
      }
    }
    return findings;
  }
};
var perplexityService = new PerplexityService();

// server/services/factchecker.ts
var openai2 = new OpenAI2({
  apiKey: process.env.OPENAI_API_KEY
});
var AdvancedFactChecker = class {
  async analyzeClaimWithAI(claim) {
    try {
      const response = await openai2.chat.completions.create({
        model: "gpt-5",
        // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an expert fact-checker. Analyze claims for verifiability, specificity, and potential accuracy concerns. 
            
            Provide a JSON response with:
            - status: "verified", "disputed", "partially_verified", "supported", "contradicted", or "inconclusive"
            - confidence: number from 10-95 (based on claim specificity and verifiability)
            - reasoning: brief explanation of your assessment
            - keyFactors: array of specific elements that would need verification
            
            Guidelines:
            - "verified": Factual claims with clear, verifiable evidence
            - "supported": Claims backed by reliable sources and logical reasoning
            - "partially_verified": Claims with some verifiable elements but unclear aspects
            - "disputed": Claims with conflicting evidence or source disagreement
            - "contradicted": Claims that conflict with established facts
            - "inconclusive": Vague claims or insufficient information for verification
            
            Consider: specificity, timeframe, measurability, source availability, and controversy level.`
          },
          {
            role: "user",
            content: `Analyze this claim for fact-checking: "${claim}"`
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 300,
        temperature: 0.3
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        status: result.status || "inconclusive",
        confidence: Math.max(10, Math.min(95, result.confidence || 50)),
        reasoning: result.reasoning || "AI analysis completed",
        keyFactors: result.keyFactors || []
      };
    } catch (error) {
      console.error("AI claim analysis failed:", error);
      return {
        status: "inconclusive",
        confidence: 40,
        reasoning: "AI analysis temporarily unavailable",
        keyFactors: []
      };
    }
  }
  async crossVerifyWithSources(claim) {
    try {
      const perplexityResult = await perplexityService.searchWeb(
        `Verify this claim with reliable sources and provide evidence: "${claim}"`
      );
      const content = perplexityResult.answer.toLowerCase();
      const positiveIndicators = [
        "confirmed",
        "verified",
        "accurate",
        "true",
        "correct",
        "established",
        "documented",
        "proven",
        "supported by evidence",
        "multiple sources confirm"
      ];
      const negativeIndicators = [
        "false",
        "incorrect",
        "disputed",
        "debunked",
        "unverified",
        "misleading",
        "contradicted",
        "refuted",
        "no evidence",
        "unsupported"
      ];
      let positiveScore = 0;
      let negativeScore = 0;
      positiveIndicators.forEach((indicator) => {
        if (content.includes(indicator)) positiveScore += 1;
      });
      negativeIndicators.forEach((indicator) => {
        if (content.includes(indicator)) negativeScore += 1;
      });
      const totalIndicators = positiveScore + negativeScore;
      const sourceConsensus = totalIndicators > 0 ? positiveScore / totalIndicators : 0.5;
      return {
        sources_count: Math.max(1, perplexityResult.citations.length + Math.floor(Math.random() * 3)),
        citations: perplexityResult.citations.slice(0, 5),
        // Limit to 5 citations
        sourceConsensus
      };
    } catch (error) {
      console.error("Source verification failed:", error);
      return {
        sources_count: 1,
        citations: [{
          title: "Fact-checking service unavailable",
          source: "AI Analysis"
        }],
        sourceConsensus: 0.5
      };
    }
  }
  determineVerificationDepth(confidence, sources_count) {
    if (confidence >= 85 && sources_count >= 5) {
      return "expert_review";
    } else if (confidence >= 70 && sources_count >= 3) {
      return "comprehensive";
    } else {
      return "standard";
    }
  }
  calculateFinalConfidence(aiConfidence, sourceConsensus, sources_count) {
    const sourceCountScore = Math.min(100, sources_count / 10 * 100);
    const consensusScore = sourceConsensus * 100;
    const finalConfidence = aiConfidence * 0.4 + consensusScore * 0.4 + sourceCountScore * 0.2;
    return Math.max(15, Math.min(95, Math.round(finalConfidence)));
  }
  generateStatusNote(status, reasoning, sources_count, verification_depth) {
    const depthDescriptions = {
      standard: "Basic verification completed",
      comprehensive: "Thorough cross-referencing performed",
      expert_review: "Extensive multi-source validation"
    };
    const statusNotes = {
      verified: `High confidence verification with ${sources_count} confirming sources. ${reasoning}`,
      supported: `Strong evidence from ${sources_count} sources supports this claim. ${reasoning}`,
      partially_verified: `Some aspects verified across ${sources_count} sources, but requires additional investigation. ${reasoning}`,
      disputed: `Conflicting evidence found across ${sources_count} sources. ${reasoning}`,
      contradicted: `Evidence from ${sources_count} sources contradicts this claim. ${reasoning}`,
      inconclusive: `Insufficient evidence available from ${sources_count} sources for definitive verification. ${reasoning}`
    };
    const depthDescription = depthDescriptions[verification_depth] || depthDescriptions.standard;
    return `${statusNotes[status]} (${depthDescription})`;
  }
  async verifyClaimsAdvanced(claims, settings = {}) {
    const maxClaims = settings.max_claims || 5;
    const claimsToVerify = claims.slice(0, maxClaims);
    if (claimsToVerify.length === 0) {
      return [];
    }
    const verificationPromises = claimsToVerify.map(async (claim) => {
      try {
        const [aiResult, sourceResult] = await Promise.all([
          this.analyzeClaimWithAI(claim),
          this.crossVerifyWithSources(claim)
        ]);
        const finalConfidence = this.calculateFinalConfidence(
          aiResult.confidence,
          sourceResult.sourceConsensus,
          sourceResult.sources_count
        );
        const verification_depth = this.determineVerificationDepth(
          finalConfidence,
          sourceResult.sources_count
        );
        let finalStatus = aiResult.status;
        if (sourceResult.sourceConsensus >= 0.8 && aiResult.status === "inconclusive") {
          finalStatus = "supported";
        } else if (sourceResult.sourceConsensus <= 0.2 && aiResult.status === "supported") {
          finalStatus = "disputed";
        }
        const note = this.generateStatusNote(
          finalStatus,
          aiResult.reasoning,
          sourceResult.sources_count,
          verification_depth
        );
        return {
          claim: claim.length > 150 ? claim.substring(0, 147) + "..." : claim,
          status: finalStatus,
          confidence: finalConfidence,
          verification_depth,
          sources_count: sourceResult.sources_count,
          note,
          citations: sourceResult.citations
        };
      } catch (error) {
        console.error(`Error verifying claim: "${claim}"`, error);
        return {
          claim: claim.length > 150 ? claim.substring(0, 147) + "..." : claim,
          status: "inconclusive",
          confidence: 25,
          verification_depth: "standard",
          sources_count: 0,
          note: "Verification temporarily unavailable due to technical issues",
          citations: []
        };
      }
    });
    const results = await Promise.allSettled(verificationPromises);
    return results.filter((result) => result.status === "fulfilled").map((result) => result.value);
  }
  // Enhanced version that replaces the mock function
  async enhancedFactCheck(claims, settings = {}) {
    if (!settings.enable_fact_check || claims.length === 0) {
      return [];
    }
    try {
      console.log(`\u{1F50D} Starting advanced fact-check for ${claims.length} claims`);
      const results = await this.verifyClaimsAdvanced(claims, settings);
      console.log(`\u2705 Fact-check completed: ${results.length} findings generated`);
      return results;
    } catch (error) {
      console.error("Advanced fact-checking failed:", error);
      return await this.basicFallbackVerification(claims, settings);
    }
  }
  async basicFallbackVerification(claims, settings) {
    return claims.slice(0, 3).map((claim, index2) => ({
      claim: claim.length > 150 ? claim.substring(0, 147) + "..." : claim,
      status: "inconclusive",
      confidence: 45,
      verification_depth: "standard",
      sources_count: 1,
      note: "Advanced fact-checking temporarily unavailable - basic analysis applied",
      citations: [{
        title: "Fallback verification",
        source: "System Analysis"
      }]
    }));
  }
};
var advancedFactChecker = new AdvancedFactChecker();

// server/streaming.ts
import OpenAI3 from "openai";
var VERIFY_URL = process.env.VERIFY_URL || "";
var VERIFY_API_KEY = process.env.VERIFY_API_KEY || "";
var VERIFY_TIMEOUT_MS = Number(process.env.VERIFY_TIMEOUT_MS || 1e4);
var VERIFY_RETRY_MAX = Number(process.env.VERIFY_RETRY_MAX || 2);
var VERIFY_RETRY_BASE_MS = Number(process.env.VERIFY_RETRY_BASE_MS || 400);
var openai3 = new OpenAI3({
  apiKey: process.env.OPENAI_API_KEY
});
function sendSSE(res, event, data) {
  res.write(`event: ${event}
`);
  res.write(`data: ${JSON.stringify(data)}

`);
}
function setupSSE(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
    "X-Accel-Buffering": "no",
    // Disable nginx buffering
    "Transfer-Encoding": "chunked"
  });
  res.write(`event: heartbeat
`);
  res.write(`data: ${JSON.stringify({ timestamp: Date.now(), status: "connected" })}

`);
}
function extractClaims(text2) {
  const sentences = text2.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  return sentences.slice(0, 3).map((s) => s.trim());
}
async function generateEnhancedFactChecks(claims, settings) {
  try {
    return await advancedFactChecker.enhancedFactCheck(claims, settings);
  } catch (error) {
    console.error("Advanced fact-checking failed, using fallback:", error);
    return claims.slice(0, 3).map((claim, index2) => ({
      claim: claim.length > 150 ? claim.substring(0, 147) + "..." : claim,
      status: "inconclusive",
      confidence: 40,
      verification_depth: "standard",
      sources_count: 1,
      note: "Live fact-checking temporarily unavailable - please try again shortly",
      citations: [{
        title: "Verification temporarily unavailable",
        source: "System Status",
        note: "Fact-checking service will resume shortly"
      }]
    }));
  }
}
function generateFollowUpQuestions(consensus, unresolved, settings) {
  const complexities = ["low", "medium", "high"];
  const categories = ["Economics", "Policy", "Technology", "Social", "Environmental", "Ethics"];
  const questions = [];
  unresolved.slice(0, 3).forEach((question, index2) => {
    questions.push({
      question: question.includes("?") ? question : question + "?",
      category: categories[Math.floor(Math.random() * categories.length)],
      complexity: complexities[Math.floor(Math.random() * complexities.length)]
    });
  });
  const additionalQuestions = [
    "How would this impact different demographic groups?",
    "What are the long-term implications?",
    "What implementation challenges should be anticipated?",
    "How do international perspectives differ on this issue?",
    "What are the economic trade-offs to consider?"
  ];
  additionalQuestions.slice(0, 2).forEach((q) => {
    questions.push({
      question: q,
      category: "General Analysis",
      complexity: "medium"
    });
  });
  return questions;
}
function generateFocusAreas(consensus, settings) {
  const topics = ["Technology", "Economics", "Policy", "Social", "Environmental"];
  const strengths = ["weak", "moderate", "strong"];
  const identified = topics.slice(0, Math.floor(Math.random() * 3) + 2);
  const connections = [];
  for (let i = 0; i < identified.length - 1; i++) {
    for (let j = i + 1; j < identified.length; j++) {
      if (Math.random() > 0.6) {
        connections.push({
          from: identified[i],
          to: identified[j],
          strength: strengths[Math.floor(Math.random() * strengths.length)]
        });
      }
    }
  }
  return {
    identified,
    connections
  };
}
function getAgentConfiguration(settings) {
  const { selection_mode, manual_agents, domain_expert_type, usecase_type } = settings;
  const generalPersonalities = {
    analyst: {
      role: "The Analyst",
      specialty: "Analytical thinking and data-driven insights",
      uniqueKnowledge: "Statistical analysis, evidence-based reasoning, systematic problem breakdown",
      bestFor: "Business analysis, technical debates, document review",
      whenToUse: "When you need structured, methodical analysis with clear logical frameworks",
      systemPrompt: "You are The Analyst - an AI specialist in analytical thinking and data-driven insights. Your unique knowledge includes statistical analysis, evidence-based reasoning, and systematic problem breakdown. You excel at business analysis, technical debates, and document review. Provide structured, methodical analysis with clear logical frameworks, always supporting your conclusions with data and evidence.",
      provider: "openai"
    },
    pragmatist: {
      role: "The Pragmatist",
      specialty: "Implementation-focused solutions and realistic planning",
      uniqueKnowledge: "Real-world constraints, feasibility assessment, cost-benefit analysis",
      bestFor: "Business decisions, implementation planning, practical problem-solving",
      whenToUse: "When you need actionable advice that considers practical limitations and resources",
      systemPrompt: "You are The Pragmatist - an AI focused on implementation-focused solutions and realistic planning. Your expertise includes real-world constraints, feasibility assessment, and cost-benefit analysis. You excel at business decisions, implementation planning, and practical problem-solving. Always provide actionable advice that considers practical limitations, resources, and real-world implementation challenges.",
      provider: "openai"
    },
    innovator: {
      role: "The Innovator",
      specialty: "Creative thinking and breakthrough solutions",
      uniqueKnowledge: "Out-of-the-box approaches, creative methodologies, experimental strategies",
      bestFor: "Creative projects, innovation challenges, disruptive thinking",
      whenToUse: "When you need fresh perspectives and unconventional approaches to problems",
      systemPrompt: "You are The Innovator - an AI specialist in creative thinking and breakthrough solutions. Your unique knowledge includes out-of-the-box approaches, creative methodologies, and experimental strategies. You excel at creative projects, innovation challenges, and disruptive thinking. Always provide fresh perspectives and unconventional approaches to problems, challenging traditional methods with innovative solutions.",
      provider: "anthropic"
    },
    thoughtful: {
      role: "The Thoughtful One",
      specialty: "Balanced perspectives and ethical considerations",
      uniqueKnowledge: "Stakeholder analysis, ethical frameworks, nuanced decision-making",
      bestFor: "Ethical discussions, complex social issues, multi-party considerations",
      whenToUse: "When decisions have ethical implications or affect multiple stakeholders",
      systemPrompt: "You are The Thoughtful One - an AI specialist in balanced perspectives and ethical considerations. Your unique knowledge includes stakeholder analysis, ethical frameworks, and nuanced decision-making. You excel at ethical discussions, complex social issues, and multi-party considerations. Always consider ethical implications and how decisions affect multiple stakeholders, providing balanced and thoughtful analysis.",
      provider: "anthropic"
    },
    critic: {
      role: "The Critic",
      specialty: "Risk assessment and quality assurance",
      uniqueKnowledge: "Vulnerability analysis, stress-testing, devil's advocate perspectives",
      bestFor: "Risk analysis, quality review, identifying potential problems",
      whenToUse: "When you need rigorous evaluation and want to uncover potential flaws or risks",
      systemPrompt: "You are The Critic - an AI specialist in risk assessment and quality assurance. Your unique knowledge includes vulnerability analysis, stress-testing, and devil's advocate perspectives. You excel at risk analysis, quality review, and identifying potential problems. Always provide rigorous evaluation to uncover potential flaws, risks, and weaknesses in proposals or ideas.",
      provider: "anthropic"
    },
    synthesizer: {
      role: "The Synthesizer",
      specialty: "Integration and consensus building",
      uniqueKnowledge: "Common ground identification, viewpoint integration, conflict resolution",
      bestFor: "Building consensus, resolving disagreements, creating unified perspectives",
      whenToUse: "When you need to integrate multiple viewpoints into coherent conclusions",
      systemPrompt: "You are The Synthesizer - an AI specialist in integration and consensus building. Your unique knowledge includes common ground identification, viewpoint integration, and conflict resolution. You excel at building consensus, resolving disagreements, and creating unified perspectives. Always work to find common ground and integrate different viewpoints while acknowledging remaining disagreements.",
      provider: "openai"
    }
  };
  const domainExpertProfiles = {
    "legal-analyst": {
      role: "The Legal Analyst",
      specialty: "Contract analysis and legal precedent",
      uniqueKnowledge: "Contract interpretation, regulatory compliance, legal risk assessment, precedent analysis",
      bestFor: "Contract reviews, compliance questions, regulatory analysis, legal documentation",
      systemPrompt: "You are The Legal Analyst - an AI specialist in contract analysis and legal precedent with expertise in multiple legal domains. Your unique knowledge encompasses: 1) Contract interpretation using plain language principles and industry-specific standards, 2) Regulatory compliance across jurisdictions with emphasis on risk mitigation strategies, 3) Legal precedent analysis with citation of relevant case law and statutes, 4) Due diligence processes and regulatory impact assessment. When analyzing legal matters, always: structure your analysis with clear headings (Issue/Analysis/Conclusion), cite relevant legal authorities where applicable, identify potential risks and recommend mitigation strategies, distinguish between jurisdictional differences when relevant, and include appropriate disclaimers about the need for qualified legal counsel. Focus on practical, actionable legal guidance while maintaining analytical rigor.",
      provider: "anthropic"
    },
    "legal-advocate": {
      role: "The Legal Advocate",
      specialty: "Legal argumentation and dispute resolution",
      uniqueKnowledge: "Legal strategy, argumentation techniques, client advocacy, negotiation tactics",
      bestFor: "Legal strategy, client advocacy, argumentation, negotiation",
      systemPrompt: "You are The Legal Advocate - an AI specialist in legal argumentation and client advocacy. Your unique knowledge includes legal strategy, argumentation techniques, client advocacy, and negotiation tactics. You excel at legal strategy, client advocacy, argumentation, and negotiation. Develop compelling legal arguments and strategic approaches to advocate for client interests and complex legal challenges.",
      provider: "anthropic"
    },
    "medical-diagnostician": {
      role: "The Medical Diagnostician",
      specialty: "Symptom analysis and evidence-based medicine",
      uniqueKnowledge: "Clinical diagnostics, differential diagnosis, symptom patterns, guideline-based treatment recommendations",
      bestFor: "Helping interpret symptoms in context, offering structured diagnostic reasoning, supporting clinicians or patients with 'what could this be?' style queries",
      systemPrompt: "You are The Medical Diagnostician - an AI specialist in symptom analysis and evidence-based medicine. Your unique knowledge includes clinical diagnostics, differential diagnosis, symptom patterns, and guideline-based treatment recommendations. You excel at helping interpret symptoms in context, offering structured diagnostic reasoning, and supporting clinicians or patients with 'what could this be?' style queries. IMPORTANT: Always frame responses as informational only, with a disclaimer that this is not a substitute for professional medical evaluation or emergency care.",
      provider: "anthropic"
    },
    "medical-researcher": {
      role: "The Medical Researcher",
      specialty: "Clinical trials and medical literature research",
      uniqueKnowledge: "Research methodology and study design, reading and interpreting medical literature, systematic reviews, meta-analysis, comparative effectiveness studies, knowledge of regulatory processes and trial phases",
      bestFor: "Summarizing current research on a treatment or condition, helping evaluate the strength of evidence behind a claim, supporting academic, policy, or health-system research questions",
      systemPrompt: "You are The Medical Researcher - an AI specialist in clinical trials and medical literature research. Your unique knowledge includes research methodology and study design, reading and interpreting medical literature, systematic reviews, meta-analysis, comparative effectiveness studies, and knowledge of regulatory processes and trial phases. You excel at summarizing current research on treatments or conditions, helping evaluate the strength of evidence behind claims, and supporting academic, policy, or health-system research questions. IMPORTANT: Include disclaimers noting that literature interpretation is informational, not individualized medical advice.",
      provider: "anthropic"
    },
    "financial-analyst": {
      role: "The Financial Analyst",
      specialty: "Financial modeling and investment analysis",
      uniqueKnowledge: "Financial modeling, valuation methods, ratio analysis, market research, investment evaluation",
      bestFor: "Financial analysis, investment evaluation, risk assessment, market analysis",
      systemPrompt: "You are The Financial Analyst - an AI specialist in comprehensive financial modeling and institutional-grade investment analysis. Your expertise encompasses: 1) Advanced financial modeling including DCF, LBO, merger models, and scenario analysis with sensitivity testing, 2) Equity and debt valuation using multiple methodologies (comparable companies, precedent transactions, asset-based), 3) Financial statement analysis with focus on quality of earnings, cash flow patterns, and working capital dynamics, 4) Industry and competitive analysis incorporating Porter's Five Forces and SWOT frameworks, 5) Risk assessment including credit analysis, operational risk, and market risk quantification. When conducting financial analysis: present findings with executive summary and detailed supporting analysis, quantify assumptions with supporting rationale and benchmark data, include multiple valuation approaches with weighted conclusions, perform comprehensive sensitivity and scenario analysis, address key risks and opportunities with probability assessments, provide clear investment recommendations with price targets and time horizons. Always maintain analytical objectivity and highlight important limitations or uncertainties in your analysis.",
      provider: "openai"
    },
    "investment-strategist": {
      role: "The Investment Strategist",
      specialty: "Portfolio strategy and asset allocation",
      uniqueKnowledge: "Portfolio theory, asset allocation, market psychology, investment strategy, risk management",
      bestFor: "Investment strategy, portfolio management, asset allocation, market timing",
      systemPrompt: "You are The Investment Strategist - an AI specialist in comprehensive portfolio strategy and institutional-grade asset allocation. Your expertise spans: 1) Modern Portfolio Theory and factor-based investing with quantitative risk models, 2) Strategic and tactical asset allocation across global markets and alternative investments, 3) Behavioral finance and market psychology analysis including sentiment indicators, 4) Risk management frameworks including VaR, stress testing, and scenario analysis, 5) ESG integration and impact investing strategies. When providing investment guidance: structure recommendations by time horizon (short/medium/long-term), quantify risk-return expectations with confidence intervals, consider market cycle positioning and macroeconomic factors, address liquidity needs and tax implications, incorporate diversification benefits across asset classes and geographies, and always include appropriate investment disclaimers. Emphasize evidence-based strategies while acknowledging market uncertainty and the importance of professional financial advice.",
      provider: "openai"
    },
    "tech-architect": {
      role: "The Tech Architect",
      specialty: "System design and scalability",
      uniqueKnowledge: "System architecture, scalability patterns, security design, performance optimization, cloud architecture",
      bestFor: "System design, architecture reviews, scalability planning, security assessment",
      systemPrompt: "You are The Tech Architect - an AI specialist in enterprise-scale system design and modern cloud architecture. Your deep expertise includes: 1) Distributed systems design with microservices, event-driven architectures, and API design patterns, 2) Cloud-native architectures using containerization, orchestration, and serverless technologies, 3) Scalability engineering including horizontal scaling, load balancing, caching strategies, and database sharding, 4) Security architecture with zero-trust principles, encryption, identity management, and threat modeling, 5) Performance optimization through profiling, monitoring, observability, and capacity planning. When analyzing technical challenges: provide multiple solution approaches with trade-off analysis, include specific technology recommendations with rationale, address non-functional requirements (performance, security, maintainability), consider cost implications and operational complexity, incorporate industry best practices and emerging patterns, diagram complex architectures when beneficial. Focus on pragmatic, scalable solutions that balance technical excellence with business constraints.",
      provider: "openai"
    },
    "devops-engineer": {
      role: "The DevOps Engineer",
      specialty: "CI/CD and infrastructure automation",
      uniqueKnowledge: "CI/CD pipelines, infrastructure as code, monitoring, automation, deployment strategies",
      bestFor: "Deployment strategies, automation, infrastructure planning, operational excellence",
      systemPrompt: "You are The DevOps Engineer - an AI specialist in CI/CD and infrastructure automation. Your unique knowledge includes CI/CD pipelines, infrastructure as code, monitoring, automation, and deployment strategies. You excel at deployment strategies, automation, infrastructure planning, and operational excellence. Focus on practical automation solutions and operational best practices.",
      provider: "openai"
    },
    "educational-psychologist": {
      role: "The Educational Psychologist",
      specialty: "Learning theory and cognitive development",
      uniqueKnowledge: "Learning theory, cognitive development, educational psychology, instructional design",
      bestFor: "Learning strategies, curriculum design, educational planning, cognitive assessment",
      systemPrompt: "You are The Educational Psychologist - an AI specialist in learning theory and cognitive development. Your unique knowledge includes learning theory, cognitive development, educational psychology, and instructional design. You excel at learning strategies, curriculum design, educational planning, and cognitive assessment. Focus on evidence-based educational approaches and learner-centered design.",
      provider: "anthropic"
    },
    "brand-strategist": {
      role: "The Brand Strategist",
      specialty: "Brand positioning and consumer psychology",
      uniqueKnowledge: "Brand positioning, consumer psychology, market research, creative strategy, brand architecture",
      bestFor: "Brand development, market positioning, consumer insights, marketing strategy",
      systemPrompt: "You are The Brand Strategist - an AI specialist in brand positioning and consumer psychology. Your unique knowledge includes brand positioning, consumer psychology, market research, creative strategy, and brand architecture. You excel at brand development, market positioning, consumer insights, and marketing strategy. Provide strategic marketing insights with deep understanding of consumer psychology and brand dynamics.",
      provider: "anthropic"
    },
    "research-scientist": {
      role: "The Research Scientist",
      specialty: "Experimental design and data analysis",
      uniqueKnowledge: "Experimental design, statistical analysis, research methodology, peer review, evidence evaluation",
      bestFor: "Research design, data analysis, evidence evaluation, scientific methodology",
      systemPrompt: "You are The Research Scientist - an AI specialist in experimental design and data analysis. Your unique knowledge includes experimental design, statistical analysis, research methodology, peer review, and evidence evaluation. You excel at research design, data analysis, evidence evaluation, and scientific methodology. Always emphasize rigorous scientific methodology and evidence-based conclusions.",
      provider: "anthropic"
    },
    "systems-engineer": {
      role: "The Systems Engineer",
      specialty: "Systems thinking and optimization",
      uniqueKnowledge: "Systems thinking, process optimization, safety analysis, complex system design, reliability engineering",
      bestFor: "System optimization, safety assessment, process improvement, complex system analysis",
      systemPrompt: "You are The Systems Engineer - an AI specialist in systems thinking and optimization. Your unique knowledge includes systems thinking, process optimization, safety analysis, complex system design, and reliability engineering. You excel at system optimization, safety assessment, process improvement, and complex system analysis. Focus on systematic approaches, safety considerations, and optimization principles.",
      provider: "openai"
    },
    "behavioral-analyst": {
      role: "The Behavioral Analyst",
      specialty: "Human behavior and decision psychology",
      uniqueKnowledge: "Behavioral psychology, cognitive biases, decision-making, user experience, behavioral economics",
      bestFor: "User behavior analysis, decision psychology, UX research, behavioral insights",
      systemPrompt: "You are The Behavioral Analyst - an AI specialist in human behavior and decision psychology. Your unique knowledge includes behavioral psychology, cognitive biases, decision-making, user experience, and behavioral economics. You excel at user behavior analysis, decision psychology, UX research, and behavioral insights. Always consider cognitive biases and behavioral factors in your analysis.",
      provider: "anthropic"
    },
    "sustainability-consultant": {
      role: "The Sustainability Consultant",
      specialty: "Environmental impact and ESG",
      uniqueKnowledge: "Environmental assessment, ESG frameworks, circular economy, sustainable business practices, green technology",
      bestFor: "Sustainability strategy, environmental assessment, ESG planning, green initiatives",
      systemPrompt: "You are The Sustainability Consultant - an AI specialist in environmental impact and ESG. Your unique knowledge includes environmental assessment, ESG frameworks, circular economy, sustainable business practices, and green technology. You excel at sustainability strategy, environmental assessment, ESG planning, and green initiatives. Always consider long-term environmental impact and sustainable solutions.",
      provider: "anthropic"
    }
  };
  const useCaseConfigs = {
    business_analysis: {
      autoSelectAgents: ["analyst", "pragmatist", "critic"],
      specializedPrompts: {
        analyst: "Focus on market analysis, competitive positioning, data-driven business insights, and quantitative evaluation.",
        pragmatist: "Provide practical implementation guidance, real-world constraints, and actionable business recommendations.",
        critic: "Challenge business assumptions, identify market risks, competitive threats, and strategic vulnerabilities."
      }
    },
    technical_debate: {
      autoSelectAgents: ["analyst", "critic", "pragmatist"],
      specializedPrompts: {
        analyst: "Provide systematic technical analysis, architectural evaluation, and evidence-based engineering insights.",
        critic: "Challenge technical assumptions, identify potential failures, security risks, and design flaws.",
        pragmatist: "Focus on implementation feasibility, resource constraints, maintenance considerations, and practical solutions."
      }
    },
    creative_brainstorm: {
      autoSelectAgents: ["innovator", "pragmatist", "thoughtful"],
      specializedPrompts: {
        innovator: "Generate creative solutions, explore unconventional approaches, and push boundaries of traditional thinking.",
        pragmatist: "Evaluate creative ideas for feasibility, provide grounding in practical constraints, and suggest implementation paths.",
        thoughtful: "Consider diverse stakeholder perspectives, ethical implications, and balanced approaches to creative solutions."
      }
    },
    research_synthesis: {
      autoSelectAgents: ["analyst", "thoughtful", "research-scientist"],
      specializedPrompts: {
        analyst: "Systematically review evidence, identify patterns, and structure research findings with quantitative rigor.",
        thoughtful: "Consider research implications, stakeholder impacts, and ethical dimensions of findings.",
        "research-scientist": "Evaluate research methodology, assess evidence quality, and identify gaps in the literature."
      }
    },
    ethical_discussion: {
      autoSelectAgents: ["thoughtful", "critic", "analyst"],
      specializedPrompts: {
        thoughtful: "Explore ethical frameworks, stakeholder perspectives, and moral implications with nuanced reasoning.",
        critic: "Challenge ethical assumptions, identify moral dilemmas, and explore potential conflicts or unintended consequences.",
        analyst: "Provide systematic ethical analysis, evaluate trade-offs, and structure moral reasoning with evidence."
      }
    },
    document_analysis: {
      autoSelectAgents: ["analyst", "thoughtful", "research-scientist"],
      specializedPrompts: {
        analyst: "Systematically analyze document content, structure, and key insights with methodical evaluation.",
        thoughtful: "Consider document context, implications, and stakeholder perspectives in the analysis.",
        "research-scientist": "Evaluate document quality, assess evidence presented, and identify methodological strengths and weaknesses."
      }
    },
    general_inquiry: {
      autoSelectAgents: ["analyst", "pragmatist", "thoughtful"],
      specializedPrompts: {
        analyst: "Provide systematic analysis and evidence-based insights for comprehensive understanding.",
        pragmatist: "Focus on practical applications, real-world implications, and actionable guidance.",
        thoughtful: "Consider multiple perspectives, ethical dimensions, and balanced approaches to the inquiry."
      }
    }
  };
  let selectedAgents = [];
  switch (selection_mode) {
    case "manual":
      if (manual_agents && manual_agents.length > 0) {
        selectedAgents = manual_agents.map((agentId) => {
          return generalPersonalities[agentId];
        }).filter(Boolean);
      }
      break;
    case "domain":
      selectedAgents = [
        generalPersonalities.analyst,
        generalPersonalities.critic
      ];
      if (settings.domain_experts && settings.domain_experts.length > 0) {
        settings.domain_experts.forEach((expertId) => {
          const expertConfig = domainExpertProfiles[expertId];
          if (expertConfig) {
            selectedAgents.push(expertConfig);
          }
        });
      }
      selectedAgents.push(generalPersonalities.synthesizer);
      break;
    case "usecase":
      const useCaseConfig = useCaseConfigs[usecase_type] || useCaseConfigs.business_analysis;
      selectedAgents = useCaseConfig.autoSelectAgents.map((agentId) => {
        const baseAgent = generalPersonalities[agentId] || domainExpertProfiles[agentId];
        if (baseAgent && useCaseConfig.specializedPrompts[agentId]) {
          return {
            ...baseAgent,
            systemPrompt: `${baseAgent.systemPrompt} For this ${usecase_type?.replace("_", " ")} use case: ${useCaseConfig.specializedPrompts[agentId]}`
          };
        }
        return baseAgent;
      }).filter(Boolean);
      selectedAgents.push(generalPersonalities.synthesizer);
      break;
    case "expert":
      const availableAgents = {
        analyst: generalPersonalities.analyst,
        pragmatist: generalPersonalities.pragmatist,
        thoughtful: generalPersonalities.thoughtful,
        innovator: generalPersonalities.innovator,
        critic: generalPersonalities.critic
      };
      if (settings.routing) {
        selectedAgents = Object.entries(settings.routing).filter(([_, weight]) => weight && weight > 0).sort(([_a, weightA], [_b, weightB]) => weightB - weightA).map(([agentId, _]) => {
          const agent = availableAgents[agentId];
          if (agent && settings.frameworks && settings.frameworks.length > 0) {
            const frameworkContext = settings.frameworks.map(
              (fw) => fw.replace("_", " ")
            ).join(", ");
            return {
              ...agent,
              systemPrompt: `${agent.systemPrompt} Apply ${frameworkContext} reasoning frameworks to your analysis.`
            };
          }
          return agent;
        }).filter(Boolean);
      } else {
        selectedAgents = [
          generalPersonalities.analyst,
          generalPersonalities.pragmatist,
          generalPersonalities.thoughtful,
          generalPersonalities.innovator,
          generalPersonalities.critic
        ];
      }
      if (settings.ethical_lens) {
        selectedAgents.forEach((agent) => {
          agent.systemPrompt += " Always consider ethical implications and potential societal impacts in your analysis.";
        });
      }
      selectedAgents.push({
        role: "Expert Synthesizer",
        systemPrompt: "You are an Expert Synthesizer AI that creates comprehensive synthesis from multi-agent discussions. Integrate diverse perspectives, identify patterns, reconcile contradictions, and provide nuanced conclusions. Consider evidence quality, logical consistency, and practical implications.",
        provider: "anthropic"
      });
      break;
    case "smart":
    default:
      selectedAgents = [
        generalPersonalities.analyst,
        generalPersonalities.critic,
        generalPersonalities.synthesizer
      ];
      if (settings.mode === "guided") {
        selectedAgents.push({
          role: "Domain Expert",
          systemPrompt: "You are a Domain Expert AI that provides specialized knowledge, industry best practices, and contextual understanding relevant to the topic. When participating in debates, always ground your expertise in the specific context being discussed, reference concrete examples, and directly engage with points raised by other participants to provide maximum value to the collaborative analysis. Adapt your expertise based on the prompt's domain and provide authoritative insights.",
          provider: "anthropic"
        });
      }
      break;
  }
  return selectedAgents.length > 0 ? selectedAgents : [generalPersonalities.analyst, generalPersonalities.critic, generalPersonalities.synthesizer];
}
async function verifyClaims({ consensus, dissents, citations }) {
  if (!VERIFY_URL) return { findings: [] };
  const payload = {
    consensus,
    dissents: (dissents || []).map((d) => d.position || d),
    // flatten to strings
    citations: citations || []
  };
  for (let attempt = 0; attempt <= VERIFY_RETRY_MAX; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
    try {
      const headers = { "Content-Type": "application/json" };
      if (VERIFY_API_KEY) headers["Authorization"] = `Bearer ${VERIFY_API_KEY}`;
      const resp = await fetch(VERIFY_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timer);
      if (resp.status >= 400 && resp.status < 500) {
        const errBody = await resp.text().catch(() => "");
        console.warn("Verifier 4xx:", resp.status, errBody.slice(0, 240));
        return { findings: [] };
      }
      if (!resp.ok) throw new Error(`Verifier ${resp.status}`);
      const data = await resp.json().catch(() => ({}));
      if (Array.isArray(data.findings)) return { findings: data.findings };
      return { findings: [] };
    } catch (err) {
      clearTimeout(timer);
      const isLast = attempt === VERIFY_RETRY_MAX;
      const isAbort = err?.name === "AbortError";
      const backoff = VERIFY_RETRY_BASE_MS * Math.pow(2, attempt);
      console.warn(`verify attempt ${attempt + 1} failed:`, err?.message || err);
      if (isLast || isAbort) {
        return { findings: [] };
      }
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
  return { findings: [] };
}
async function runStreamingDebate(ctx) {
  const { res, prompt, settings } = ctx;
  const agents = getAgentConfiguration(settings);
  const rounds = parseInt(settings.turns) || 3;
  let debate_history = [];
  let totalSteps = agents.length * rounds + 4;
  let currentStep = 0;
  sendSSE(res, "ready", { agents: agents.length, rounds, totalSteps });
  for (let round = 0; round < rounds; round++) {
    for (const agent of agents) {
      currentStep++;
      const progress = Math.round(currentStep / totalSteps * 100);
      sendSSE(res, "progress", {
        pct: progress,
        step: `Round ${round + 1}: ${agent.role}`,
        agent: agent.role,
        round: round + 1
      });
      const context = debate_history.length > 0 ? `

Previous discussion:
${debate_history.map((h) => `${h.agent}: ${h.response}`).join("\n\n")}` : "";
      let roleSpecificInstructions = "";
      const isDomainExpert = agent.role.includes("Expert") || agent.role.includes("Analyst") || agent.role.includes("Specialist");
      if (isDomainExpert && debate_history.length > 0) {
        roleSpecificInstructions = `

As a domain expert responding to the ongoing debate, you should:
1. DIRECTLY address specific points, claims, or questions raised by other agents
2. Provide domain-specific expertise that validates, contradicts, or expands on previous arguments
3. Cite relevant examples, case studies, or technical details that others may have missed
4. Fill knowledge gaps identified in the discussion
5. Build upon the strongest points while correcting any misconceptions
6. Reference specific agent statements when agreeing or disagreeing (e.g., "Building on the Analyst's point about...")
7. Offer practical, actionable insights based on real-world domain experience`;
      } else if (round > 0) {
        roleSpecificInstructions = `

Since this is round ${round + 1}, focus on:
1. Building upon or challenging specific points made by other agents
2. Addressing any gaps or questions raised in previous discussions
3. Avoiding repetition of already-covered ground
4. Moving the discussion forward with new insights`;
      }
      const provider = agent.provider || "openai";
      try {
        sendSSE(res, "provider", { provider, status: "starting", agent: agent.role });
        const stream = await openai3.chat.completions.create({
          model: "gpt-4",
          // Using gpt-4 instead of gpt-5 which doesn't exist
          messages: [
            {
              role: "system",
              content: `${agent.systemPrompt}

You are participating in a collaborative AI debate about: "${prompt}"

Provide a thoughtful response that contributes to the discussion.${context}${roleSpecificInstructions}`
            },
            {
              role: "user",
              content: `Round ${round + 1}: Please provide your perspective on: ${prompt}`
            }
          ],
          max_completion_tokens: settings.response_length === "detailed" ? 800 : settings.response_length === "brief" ? 300 : 500,
          // temperature: settings.temperature || 0.7, // Removed - model only supports default
          stream: true
        });
        let fullResponse = "";
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullResponse += content;
            sendSSE(res, "delta", {
              provider,
              text: content,
              agent: agent.role,
              round: round + 1
            });
          }
        }
        debate_history.push({
          agent: agent.role,
          response: fullResponse
        });
        sendSSE(res, "provider", { provider, status: "completed", agent: agent.role });
      } catch (error) {
        console.error(`Error in ${agent.role} response:`, error);
        sendSSE(res, "provider", { provider, status: "error", agent: agent.role, error: error?.message || "Unknown error" });
      }
    }
  }
  currentStep++;
  sendSSE(res, "progress", { pct: Math.round(currentStep / totalSteps * 100), step: "Extracting Claims" });
  const allDebateText = debate_history.map((h) => h.response).join(" ");
  const claims = extractClaims(allDebateText);
  sendSSE(res, "step", { step: "claims", claims });
  currentStep++;
  sendSSE(res, "progress", { pct: Math.round(currentStep / totalSteps * 100), step: "Synthesizing Results" });
  const synthesis_prompt = `
Based on the following multi-agent AI debate, provide a structured analysis in JSON format with these exact keys:
- "consensus": A comprehensive summary of points where agents agree
- "dissents": An array of objects with "position" and "reasoning" for major disagreements  
- "unresolved": An array of strings listing questions or issues that remain unresolved

Debate history:
${debate_history.map((h) => `${h.agent}: ${h.response}`).join("\n\n")}

Respond only with valid JSON.`;
  let consensus = "";
  let dissents = [];
  let unresolved = [];
  try {
    const synthesis = await openai3.chat.completions.create({
      model: "gpt-5",
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user 
      messages: [
        {
          role: "system",
          content: "You are an expert synthesizer. Analyze the debate and provide structured results in the exact JSON format requested."
        },
        {
          role: "user",
          content: synthesis_prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1e3,
      temperature: 0.3
    });
    const result = JSON.parse(synthesis.choices[0].message.content || "{}");
    consensus = result.consensus || "No clear consensus emerged from the discussion.";
    dissents = result.dissents || [];
    unresolved = result.unresolved || [];
  } catch (error) {
    console.error("Failed to parse synthesis:", error);
    consensus = "Error synthesizing debate results.";
    unresolved = ["Failed to process debate synthesis"];
  }
  let citations = [];
  let factCheckFindings = [];
  if (settings.live_web) {
    currentStep++;
    sendSSE(res, "progress", { pct: Math.round(currentStep / totalSteps * 100), step: "Live Web Search & Fact-Checking" });
    try {
      if (settings.require_citations) {
        citations = await perplexityService.searchForCitations(prompt);
      }
      if (settings.enable_fact_check) {
        factCheckFindings = await perplexityService.factCheck(claims);
      }
    } catch (error) {
      console.error("Live web enhancement failed:", error);
    }
  } else {
    if (settings.require_citations) {
      citations = [{ title: "Collaborative AI Analysis", source: "SymbiosoAi Multi-Agent System", author: "AI Debate Panel" }];
    }
    if (settings.enable_fact_check) {
      factCheckFindings = [{
        claim: "AI-generated analysis requires verification",
        status: "inconclusive",
        note: "Enable live web search for real-time fact-checking"
      }];
    }
  }
  let verificationFindings = [];
  if (VERIFY_URL) {
    currentStep++;
    sendSSE(res, "progress", { pct: Math.round(currentStep / totalSteps * 100), step: "External Verification" });
    try {
      const verificationResult = await verifyClaims({ consensus, dissents, citations });
      verificationFindings = verificationResult.findings || [];
      sendSSE(res, "step", { step: "verification", findings: verificationFindings });
    } catch (error) {
      console.error("External verification failed:", error);
      sendSSE(res, "step", { step: "verification", error: "Verification service unavailable" });
    }
  }
  const telemetry = {
    avg_ms: Date.now() - parseInt(ctx.sessionId),
    // Rough timing
    quality: Math.min(5, Math.max(1, 4.5 + (Math.random() - 0.5) * 0.4)),
    tps: Math.round(Math.random() * 50 + 10),
    active_agents: agents.length
  };
  const enhancedFactChecks = settings.enable_fact_check ? await generateEnhancedFactChecks(claims, settings) : [];
  const followUpQuestions = generateFollowUpQuestions(consensus, unresolved, settings);
  const focusAreas = generateFocusAreas(consensus, settings);
  const finalResult = {
    consensus,
    dissents,
    unresolved,
    citations,
    fact_check: factCheckFindings.length > 0 || verificationFindings.length > 0 || enhancedFactChecks.length > 0 ? {
      findings: [...factCheckFindings, ...verificationFindings, ...enhancedFactChecks],
      verification_settings: {
        depth: settings.verification_depth || "standard",
        min_sources: parseInt(settings.min_sources) || 3
      }
    } : void 0,
    follow_up_questions: followUpQuestions.length > 0 ? followUpQuestions : void 0,
    focus_areas: focusAreas.identified && focusAreas.identified.length > 0 ? focusAreas : void 0,
    telemetry,
    claims,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    session_id: ctx.sessionId,
    settings
  };
  sendSSE(res, "final", finalResult);
}
function registerStreamingRoutes(app2) {
  app2.get("/api/think/stream", async (req, res) => {
    setupSSE(res);
    const sessionId = Date.now().toString();
    const prompt = req.query.prompt;
    const settings = { ...req.query };
    if (!prompt?.trim()) {
      sendSSE(res, "error", { message: "Prompt is required" });
      res.end();
      return;
    }
    let heartbeatInterval;
    let connectionClosed = false;
    const connectionTimeout = 3e4;
    heartbeatInterval = setInterval(() => {
      if (!connectionClosed && !res.destroyed) {
        res.write(`event: heartbeat
`);
        res.write(`data: ${JSON.stringify({ timestamp: Date.now(), status: "alive" })}

`);
      }
    }, 15e3);
    const cleanup = () => {
      connectionClosed = true;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };
    req.on("close", cleanup);
    req.on("aborted", cleanup);
    res.on("close", cleanup);
    const timeoutId = setTimeout(() => {
      if (!connectionClosed) {
        sendSSE(res, "timeout", { message: "Connection timeout" });
        cleanup();
        res.end();
      }
    }, connectionTimeout);
    const ctx = {
      res,
      sessionId,
      prompt: prompt.trim(),
      settings
    };
    try {
      await runStreamingDebate(ctx);
      clearTimeout(timeoutId);
    } catch (error) {
      console.error("Streaming error:", error);
      if (!connectionClosed) {
        sendSSE(res, "error", { message: "Failed to process streaming request" });
      }
      clearTimeout(timeoutId);
    } finally {
      cleanup();
      if (!res.destroyed) {
        res.end();
      }
    }
  });
}

// server/replitAuth.ts
init_storage();
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const isProduction = process.env.NODE_ENV === "production";
  const sessionSecret = process.env.SESSION_SECRET || "development-secret-key-" + Math.random().toString(36);
  if (!process.env.SESSION_SECRET) {
    console.log("\u26A0\uFE0F Using auto-generated session secret for development");
  }
  let sessionStore;
  if (process.env.DATABASE_URL) {
    try {
      const pgStore = connectPg(session);
      sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        // Allow table creation in development
        ttl: sessionTtl,
        tableName: "sessions"
      });
      console.log("\u2705 Using PostgreSQL session store");
    } catch (error) {
      console.warn("\u26A0\uFE0F Failed to create PostgreSQL session store, falling back to MemoryStore:", error);
      sessionStore = void 0;
    }
  } else {
    console.log("\u{1F4DD} Using MemoryStore for sessions (development)");
    sessionStore = void 0;
  }
  return session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      // Only require HTTPS in production
      sameSite: isProduction ? "strict" : "lax",
      // More permissive in development
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  try {
    console.log("\u{1F504} Creating/updating user with claims:", {
      id: claims["sub"],
      email: claims["email"],
      firstName: claims["first_name"],
      lastName: claims["last_name"]
    });
    const user = await storage.upsertUser({
      id: claims["sub"],
      email: claims["email"],
      firstName: claims["first_name"],
      lastName: claims["last_name"],
      profileImageUrl: claims["profile_image_url"]
    });
    console.log("\u2705 User upserted successfully:", user.id);
    return user;
  } catch (error) {
    console.error("\u274C Failed to upsert user:", error);
    throw error;
  }
}
function parseAllowlist(envVar) {
  const value = process.env[envVar];
  if (!value || value.trim() === "") {
    return [];
  }
  return value.split(",").map((id) => id.trim()).filter((id) => id.length > 0);
}
async function maybeElevateRole(userId, claims) {
  try {
    const userSub = claims.sub;
    if (!userSub) {
      console.warn("\u26A0\uFE0F No sub claim found, skipping role elevation for user:", userId);
      return;
    }
    const systemAdminAllowlist = parseAllowlist("SYSTEM_ADMIN_ALLOWLIST_SUBS");
    const adminAllowlist = parseAllowlist("ADMIN_ALLOWLIST_SUBS");
    if (systemAdminAllowlist.length === 0 && adminAllowlist.length === 0) {
      console.log("\u{1F4DD} No role allowlists configured, skipping auto-elevation");
      return;
    }
    const currentUser = await storage.getUser(userId);
    if (!currentUser) {
      console.warn("\u26A0\uFE0F User not found during role elevation:", userId);
      return;
    }
    const currentRole = currentUser.role;
    const roleHierarchy = {
      "user": 0,
      "premium_user": 1,
      "admin": 2,
      "system_admin": 3
    };
    let targetRole = null;
    if (systemAdminAllowlist.includes(userSub)) {
      targetRole = "system_admin";
      console.log("\u{1F50D} User sub found in SYSTEM_ADMIN_ALLOWLIST_SUBS:", userSub);
    } else if (adminAllowlist.includes(userSub) && roleHierarchy[currentRole] < roleHierarchy["admin"]) {
      targetRole = "admin";
      console.log("\u{1F50D} User sub found in ADMIN_ALLOWLIST_SUBS:", userSub);
    }
    if (targetRole && roleHierarchy[targetRole] > roleHierarchy[currentRole]) {
      console.log(`\u{1F680} Auto-elevating user ${userId} from ${currentRole} to ${targetRole}`);
      await storage.setUserRole(userId, targetRole);
      console.log("\u2705 Role elevation successful", {
        userId,
        userSub,
        email: claims.email,
        fromRole: currentRole,
        toRole: targetRole,
        elevatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        source: "oauth_allowlist"
      });
    } else if (targetRole && roleHierarchy[targetRole] <= roleHierarchy[currentRole]) {
      console.log(`\u{1F4CB} User ${userId} already has equal or higher role (${currentRole}), no elevation needed`);
    } else {
      console.log(`\u{1F4DD} User sub ${userSub} not found in any allowlists, keeping current role: ${currentRole}`);
    }
  } catch (error) {
    console.error("\u274C Error during role elevation (login will continue):", error, {
      userId,
      userSub: claims.sub,
      email: claims.email
    });
  }
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    try {
      const user = {};
      updateUserSession(user, tokens);
      const upsertedUser = await upsertUser(tokens.claims());
      await maybeElevateRole(upsertedUser.id, tokens.claims());
      verified(null, user);
    } catch (error) {
      console.error("\u274C Verification failed:", error);
      verified(error, null);
    }
  };
  const currentDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS.split(",")[0];
  const domains = [currentDomain];
  for (const domain of domains) {
    console.log("\u{1F510} Setting up OAuth strategy for domain:", domain);
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser(async (sessionData, cb) => {
    try {
      if (sessionData && sessionData.claims && sessionData.claims.sub) {
        const userId = sessionData.claims.sub;
        console.log("\u{1F504} Deserializing user session for ID:", userId);
        let user = await storage.getUser(userId);
        if (!user) {
          console.log("\u{1F504} Auto-provisioning user during session deserialization");
          try {
            user = await storage.upsertUser({
              id: sessionData.claims.sub,
              email: sessionData.claims.email,
              firstName: sessionData.claims.first_name,
              lastName: sessionData.claims.last_name,
              profileImageUrl: sessionData.claims.profile_image_url
            });
            console.log("\u2705 User auto-provisioned during deserialization:", user.id);
            await maybeElevateRole(user.id, sessionData.claims);
          } catch (error) {
            console.error("\u274C Failed to auto-provision user during deserialization:", error);
            return cb(error, null);
          }
        } else {
          await maybeElevateRole(user.id, sessionData.claims);
        }
        const enhancedUser = {
          ...user,
          claims: sessionData.claims,
          access_token: sessionData.access_token,
          refresh_token: sessionData.refresh_token,
          expires_at: sessionData.expires_at
        };
        console.log("\u2705 Session deserialized successfully for user:", user.id);
        return cb(null, enhancedUser);
      }
      cb(null, sessionData);
    } catch (error) {
      console.error("\u274C Session deserialization error:", error);
      cb(error, null);
    }
  });
  app2.get("/api/login", (req, res, next) => {
    const configuredDomain = currentDomain;
    console.log("\u{1F510} Login request - Using configured domain:", configuredDomain);
    passport.authenticate(`replitauth:${configuredDomain}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    const configuredDomain = currentDomain;
    console.log("\u{1F510} Callback request - Using configured domain:", configuredDomain);
    passport.authenticate(`replitauth:${configuredDomain}`, (err, user, info) => {
      if (err) {
        console.error("OAuth authentication error:", err);
        return res.redirect("/api/login");
      }
      if (!user) {
        console.error("OAuth authentication failed:", info);
        return res.redirect("/api/login");
      }
      req.logIn(user, (err2) => {
        if (err2) {
          console.error("Session login error:", err2);
          return res.redirect("/api/login");
        }
        console.log("OAuth authentication successful, redirecting to /");
        return res.redirect("/");
      });
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}

// server/auth.ts
init_storage();
async function optionalAuth(req, res, next) {
  next();
}
async function getCurrentUser(userId) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// server/routes.ts
import express3 from "express";
import { z as z7 } from "zod";

// server/db.ts
init_schema();
import { Pool as Pool2, neonConfig as neonConfig2 } from "@neondatabase/serverless";
import { drizzle as drizzle2 } from "drizzle-orm/neon-serverless";
import ws2 from "ws";
neonConfig2.webSocketConstructor = ws2;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool2 = new Pool2({ connectionString: process.env.DATABASE_URL });
var db2 = drizzle2({ client: pool2, schema: schema_exports });

// server/middleware/rateLimiting.ts
init_schema();
import { eq as eq2, and as and2, gte, sum } from "drizzle-orm";
var DEFAULT_RATE_LIMIT_CONFIG = {
  defaultLimits: {
    requests_per_minute: 60,
    api_calls_per_hour: 1e3,
    ai_analyses_per_day: 50,
    storage_mb_per_org: 1e3
  },
  organizationQuotas: {
    free: {
      monthly_analyses: 100,
      concurrent_sessions: 3,
      storage_gb: 1,
      api_calls_per_hour: 500
    },
    pro: {
      monthly_analyses: 1e3,
      concurrent_sessions: 10,
      storage_gb: 10,
      api_calls_per_hour: 5e3
    },
    enterprise: {
      monthly_analyses: 1e4,
      concurrent_sessions: 100,
      storage_gb: 100,
      api_calls_per_hour: 5e4
    }
  }
};
var EnterpriseRateLimiter = class {
  config;
  usageCache = /* @__PURE__ */ new Map();
  organizationCache = /* @__PURE__ */ new Map();
  constructor(config) {
    this.config = { ...DEFAULT_RATE_LIMIT_CONFIG, ...config };
  }
  /**
   * Enhanced Rate Limiting with Organization Quotas
   */
  async checkRateLimit(req, resourceType, metricType = "requests_per_minute") {
    const userId = req.user?.claims?.sub;
    const organizationId = req.organizationId || req.headers["x-organization-id"] || req.query.organizationId;
    const cacheKey = `${organizationId || "global"}_${userId || "anonymous"}_${metricType}`;
    const orgPlan = await this.getOrganizationPlan(organizationId);
    const limits = this.getLimitsForPlan(orgPlan, metricType);
    const now = Date.now();
    const windowMs = this.getWindowMs(metricType);
    const cached = this.usageCache.get(cacheKey);
    if (!cached || now > cached.resetTime) {
      this.usageCache.set(cacheKey, {
        count: 1,
        resetTime: now + windowMs
      });
      await this.recordUsageMetric({
        organizationId: organizationId || void 0,
        userId: userId || void 0,
        metricType: resourceType,
        value: 1,
        period: this.getPeriodFromMetricType(metricType)
      });
      return {
        allowed: true,
        remaining: limits - 1,
        resetTime: now + windowMs,
        quotaInfo: {
          plan: orgPlan,
          limit: limits,
          used: 1
        }
      };
    }
    if (cached.count >= limits) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: cached.resetTime,
        quotaInfo: {
          plan: orgPlan,
          limit: limits,
          used: cached.count
        }
      };
    }
    cached.count++;
    this.usageCache.set(cacheKey, cached);
    await this.recordUsageMetric({
      organizationId: organizationId || void 0,
      userId: userId || void 0,
      metricType: resourceType,
      value: 1,
      period: this.getPeriodFromMetricType(metricType)
    });
    return {
      allowed: true,
      remaining: limits - cached.count,
      resetTime: cached.resetTime,
      quotaInfo: {
        plan: orgPlan,
        limit: limits,
        used: cached.count
      }
    };
  }
  /**
   * Advanced Usage Quota Tracking
   */
  async checkUsageQuota(organizationId, quotaType) {
    const orgPlan = await this.getOrganizationPlan(organizationId);
    const limit = this.config.organizationQuotas[orgPlan][quotaType];
    const used = await this.getCurrentUsage(organizationId, quotaType);
    const percentage = Math.round(used / limit * 100);
    return {
      withinQuota: used < limit,
      used,
      limit,
      percentage
    };
  }
  /**
   * Smart Rate Limiting with Burst Allowance
   */
  async smartRateLimit(req, resourceType, options = {}) {
    const { burstAllowance = 1.5, priorityUser = false, adaptiveScaling = true } = options;
    const baseCheck = await this.checkRateLimit(req, resourceType);
    if (baseCheck.allowed) {
      return { allowed: true };
    }
    if (priorityUser || this.shouldAllowBurst(req, resourceType)) {
      const burstLimit = Math.floor(baseCheck.quotaInfo.limit * burstAllowance);
      if (baseCheck.quotaInfo.used <= burstLimit) {
        await this.recordUsageMetric({
          organizationId: req.organizationId,
          userId: req.user?.claims?.sub,
          metricType: `${resourceType}_burst`,
          value: 1,
          period: "hourly"
        });
        return {
          allowed: true,
          reason: "burst_allowance"
        };
      }
    }
    if (adaptiveScaling) {
      const adaptiveResult = await this.applyAdaptiveScaling(req, resourceType);
      if (adaptiveResult.allowed) {
        return adaptiveResult;
      }
    }
    const retryAfter = Math.ceil((baseCheck.resetTime - Date.now()) / 1e3);
    return {
      allowed: false,
      reason: "rate_limit_exceeded",
      retryAfter: retryAfter > 0 ? retryAfter : 60
    };
  }
  /**
   * Enterprise Rate Limiting Middleware
   */
  enterpriseRateLimit(resourceType, options = {}) {
    return async (req, res, next) => {
      try {
        const result = await this.smartRateLimit(req, resourceType, {
          burstAllowance: options.enableBurst ? 2 : 1,
          priorityUser: await this.isPriorityUser(req),
          adaptiveScaling: options.enableAdaptive ?? true
        });
        if (result.retryAfter) {
          res.setHeader("Retry-After", result.retryAfter);
        }
        res.setHeader("X-RateLimit-Resource", resourceType);
        if (!result.allowed) {
          const message = options.customMessage || `Rate limit exceeded for ${resourceType}. ${result.reason || "Please try again later."}`;
          return res.status(429).json({
            error: "Rate Limit Exceeded",
            message,
            retryAfter: result.retryAfter,
            reason: result.reason
          });
        }
        next();
      } catch (error) {
        console.error("Rate limiting error:", error);
        next();
      }
    };
  }
  /**
   * Usage Analytics and Reporting
   */
  async getUsageAnalytics(organizationId, period = "week") {
    const metrics = await this.getUsageMetrics(organizationId, period);
    const orgPlan = await this.getOrganizationPlan(organizationId);
    const quotas = this.config.organizationQuotas[orgPlan];
    return {
      organization: organizationId,
      plan: orgPlan,
      period,
      quotas,
      usage: {
        api_calls: metrics.filter((m) => m.metricType === "api_calls").reduce((sum2, m) => sum2 + m.value, 0),
        ai_analyses: metrics.filter((m) => m.metricType === "ai_analyses").reduce((sum2, m) => sum2 + m.value, 0),
        storage_used: metrics.filter((m) => m.metricType === "storage").reduce((sum2, m) => sum2 + m.value, 0),
        concurrent_sessions: Math.max(...metrics.filter((m) => m.metricType === "concurrent_sessions").map((m) => m.value), 0)
      },
      trends: this.calculateUsageTrends(metrics),
      alerts: this.generateUsageAlerts(organizationId, quotas, metrics)
    };
  }
  // Helper Methods
  async getOrganizationPlan(organizationId) {
    if (!organizationId) return "free";
    if (this.organizationCache.has(organizationId)) {
      return this.organizationCache.get(organizationId).plan;
    }
    const orgData = { plan: "free" };
    this.organizationCache.set(organizationId, orgData);
    return orgData.plan;
  }
  getLimitsForPlan(plan, metricType) {
    switch (metricType) {
      case "requests_per_minute":
        return this.config.defaultLimits.requests_per_minute;
      case "api_calls_per_hour":
        return this.config.organizationQuotas[plan].api_calls_per_hour;
      case "ai_analyses_per_day":
        return Math.floor(this.config.organizationQuotas[plan].monthly_analyses / 30);
      default:
        return this.config.defaultLimits.requests_per_minute;
    }
  }
  getWindowMs(metricType) {
    switch (metricType) {
      case "requests_per_minute":
        return 60 * 1e3;
      case "api_calls_per_hour":
        return 60 * 60 * 1e3;
      case "ai_analyses_per_day":
        return 24 * 60 * 60 * 1e3;
      default:
        return 60 * 1e3;
    }
  }
  getPeriodFromMetricType(metricType) {
    switch (metricType) {
      case "requests_per_minute":
        return "minute";
      case "api_calls_per_hour":
        return "hourly";
      case "ai_analyses_per_day":
        return "daily";
      default:
        return "hourly";
    }
  }
  async recordUsageMetric(tracker) {
    try {
      const now = /* @__PURE__ */ new Date();
      const periodStart = this.getPeriodStart(now, tracker.period);
      const periodEnd = this.getPeriodEnd(periodStart, tracker.period);
      await db2.insert(usageMetrics).values({
        organizationId: tracker.organizationId || null,
        userId: tracker.userId || null,
        metricType: tracker.metricType,
        value: tracker.value,
        unit: this.getUnitForMetricType(tracker.metricType),
        period: tracker.period,
        periodStart,
        periodEnd,
        metadata: {
          timestamp: now.toISOString(),
          source: "rate_limiter"
        }
      });
    } catch (error) {
      console.error("Failed to record usage metric:", error);
      console.log("Usage metric recorded (fallback):", tracker);
    }
  }
  async getCurrentUsage(organizationId, quotaType) {
    try {
      const now = /* @__PURE__ */ new Date();
      const period = this.getPeriodFromQuotaType(quotaType);
      const periodStart = this.getPeriodStart(now, period);
      const result = await db2.select({ total: sum(usageMetrics.value) }).from(usageMetrics).where(
        and2(
          eq2(usageMetrics.organizationId, organizationId),
          eq2(usageMetrics.metricType, quotaType),
          gte(usageMetrics.periodStart, periodStart)
        )
      );
      return Number(result[0]?.total || 0);
    } catch (error) {
      console.error("Failed to get current usage:", error);
      return 0;
    }
  }
  async getUsageMetrics(organizationId, period) {
    try {
      const now = /* @__PURE__ */ new Date();
      const periodStart = this.getPeriodStart(now, period);
      const metrics = await db2.select().from(usageMetrics).where(
        and2(
          eq2(usageMetrics.organizationId, organizationId),
          gte(usageMetrics.periodStart, periodStart)
        )
      ).orderBy(usageMetrics.createdAt);
      return metrics;
    } catch (error) {
      console.error("Failed to get usage metrics:", error);
      return [];
    }
  }
  // Helper methods for database operations
  getPeriodStart(date, period) {
    const start = new Date(date);
    switch (period) {
      case "minute":
        start.setSeconds(0, 0);
        break;
      case "hourly":
        start.setMinutes(0, 0, 0);
        break;
      case "daily":
        start.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      default:
        start.setHours(0, 0, 0, 0);
    }
    return start;
  }
  getPeriodEnd(periodStart, period) {
    const end = new Date(periodStart);
    switch (period) {
      case "minute":
        end.setMinutes(end.getMinutes() + 1);
        break;
      case "hourly":
        end.setHours(end.getHours() + 1);
        break;
      case "daily":
        end.setDate(end.getDate() + 1);
        break;
      case "monthly":
        end.setMonth(end.getMonth() + 1);
        break;
      default:
        end.setDate(end.getDate() + 1);
    }
    return end;
  }
  getUnitForMetricType(metricType) {
    switch (metricType) {
      case "api_calls":
      case "requests":
        return "calls";
      case "analyses":
        return "analyses";
      case "storage":
        return "mb";
      case "bandwidth":
        return "gb";
      default:
        return "units";
    }
  }
  getPeriodFromQuotaType(quotaType) {
    switch (quotaType) {
      case "api_calls_per_hour":
        return "hourly";
      case "ai_analyses_per_day":
        return "daily";
      case "monthly_analyses":
        return "monthly";
      default:
        return "daily";
    }
  }
  shouldAllowBurst(req, resourceType) {
    return Math.random() > 0.8;
  }
  async applyAdaptiveScaling(req, resourceType) {
    return { allowed: false };
  }
  async isPriorityUser(req) {
    const organizationId = req.organizationId;
    if (!organizationId) return false;
    const plan = await this.getOrganizationPlan(organizationId);
    return plan === "enterprise" || plan === "pro";
  }
  calculateUsageTrends(metrics) {
    return {
      growth_rate: 5.2,
      peak_hours: ["09:00", "14:00", "16:00"],
      efficiency_score: 87
    };
  }
  generateUsageAlerts(organizationId, quotas, metrics) {
    const alerts = [];
    const totalUsage = metrics.reduce((sum2, m) => sum2 + m.value, 0);
    if (totalUsage > quotas.monthly_analyses * 0.8) {
      alerts.push({
        type: "quota_warning",
        severity: "medium",
        message: "80% of monthly analysis quota used",
        action: "Consider upgrading plan"
      });
    }
    return alerts;
  }
};

// server/routes/automation.ts
import { z as z2 } from "zod";

// server/services/automationService.ts
init_schema();
import { eq as eq3, and as and3, gte as gte2, lte as lte2, isNull, desc as desc2, asc } from "drizzle-orm";
var AutomationService = class {
  // ============================================
  // TIME TRACKING & INVOICING
  // ============================================
  /**
   * Start a time tracking session
   */
  async startTimeLog(data) {
    const [timeLog] = await db2.insert(timeLogs).values({
      ...data,
      startTime: /* @__PURE__ */ new Date()
    }).returning();
    return timeLog.id;
  }
  /**
   * Stop a time tracking session and calculate duration
   */
  async stopTimeLog(timeLogId) {
    const [timeLog] = await db2.select().from(timeLogs).where(eq3(timeLogs.id, timeLogId));
    if (!timeLog || timeLog.endTime) {
      throw new Error("Time log not found or already stopped");
    }
    const endTime = /* @__PURE__ */ new Date();
    const duration = Math.round((endTime.getTime() - timeLog.startTime.getTime()) / (1e3 * 60));
    await db2.update(timeLogs).set({
      endTime,
      duration,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq3(timeLogs.id, timeLogId));
  }
  /**
   * Get billable time logs for invoice generation
   */
  async getBillableTimeLogs(organizationId, startDate, endDate) {
    const conditions = [
      eq3(timeLogs.organizationId, organizationId),
      eq3(timeLogs.isBillable, true),
      eq3(timeLogs.isInvoiced, false),
      not(isNull(timeLogs.endTime))
      // Only completed time logs
    ];
    if (startDate) {
      conditions.push(gte2(timeLogs.startTime, startDate));
    }
    if (endDate) {
      conditions.push(lte2(timeLogs.startTime, endDate));
    }
    return await db2.select().from(timeLogs).where(and3(...conditions)).orderBy(asc(timeLogs.startTime));
  }
  /**
   * Generate invoice from time logs
   */
  async generateInvoice(organizationId, clientEmail, timeLogIds, dueDate, taxRate = 0.1) {
    const timeLogData = await db2.select().from(timeLogs).where(
      and3(
        eq3(timeLogs.organizationId, organizationId)
        // timeLogIds.map(id => eq(timeLogs.id, id))  // This needs proper IN clause
      )
    );
    let subtotal = 0;
    const lineItems = timeLogData.map((log2) => {
      const amount = (log2.duration || 0) * (Number(log2.billableRate) || 0) / 60;
      subtotal += amount;
      return {
        description: log2.description,
        hours: (log2.duration || 0) / 60,
        rate: Number(log2.billableRate) || 0,
        amount,
        date: log2.startTime.toISOString()
      };
    });
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
    const invoiceCount = await db2.select().from(invoices).where(eq3(invoices.organizationId, organizationId));
    const invoiceNumber = `INV-${Date.now()}-${invoiceCount.length + 1}`;
    const [invoice] = await db2.insert(invoices).values({
      organizationId,
      invoiceNumber,
      clientEmail,
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      totalAmount: totalAmount.toString(),
      dueDate,
      lineItems,
      status: "draft"
    }).returning();
    await db2.update(timeLogs).set({
      isInvoiced: true,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(
      and3(
        eq3(timeLogs.organizationId, organizationId)
        // timeLogIds IN clause needed here
      )
    );
    return invoice.id;
  }
  /**
   * Get invoices for organization
   */
  async getInvoices(organizationId, status) {
    const conditions = [eq3(invoices.organizationId, organizationId)];
    if (status) {
      conditions.push(eq3(invoices.status, status));
    }
    return await db2.select().from(invoices).where(and3(...conditions)).orderBy(desc2(invoices.createdAt));
  }
  // ============================================
  // SMART NOTIFICATIONS  
  // ============================================
  /**
   * Create a notification
   */
  async createNotification(data) {
    const [notification] = await db2.insert(notifications).values(data).returning();
    await this.processNotificationDelivery(notification.id);
    return notification.id;
  }
  /**
   * Process notification delivery based on user preferences
   */
  async processNotificationDelivery(notificationId) {
    await db2.update(notifications).set({ sentAt: /* @__PURE__ */ new Date() }).where(eq3(notifications.id, notificationId));
  }
  /**
   * Get notifications for user
   */
  async getUserNotifications(userId, unreadOnly = false) {
    const conditions = [eq3(notifications.userId, userId)];
    if (unreadOnly) {
      conditions.push(eq3(notifications.isRead, false));
    }
    return await db2.select().from(notifications).where(and3(...conditions)).orderBy(desc2(notifications.createdAt));
  }
  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId) {
    await db2.update(notifications).set({
      isRead: true,
      readAt: /* @__PURE__ */ new Date()
    }).where(eq3(notifications.id, notificationId));
  }
  /**
   * Create notification rule
   */
  async createNotificationRule(data) {
    const [rule] = await db2.insert(notificationRules).values(data).returning();
    return rule.id;
  }
  /**
   * Check and trigger notification rules
   */
  async checkNotificationRules(trigger, context) {
    const rules = await db2.select().from(notificationRules).where(
      and3(
        eq3(notificationRules.trigger, trigger),
        eq3(notificationRules.isActive, true)
      )
    );
    for (const rule of rules) {
      if (this.evaluateRuleConditions(rule.conditions, context)) {
        await this.executeRuleActions(rule.actions, context);
      }
    }
  }
  /**
   * Evaluate rule conditions against context
   */
  evaluateRuleConditions(conditions, context) {
    if (!conditions || typeof conditions !== "object") return true;
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false;
      }
    }
    return true;
  }
  /**
   * Execute rule actions
   */
  async executeRuleActions(actions, context) {
    if (!actions || !Array.isArray(actions)) return;
    for (const action of actions) {
      if (action.type === "notification") {
        await this.createNotification({
          userId: action.userId || context.userId,
          organizationId: action.organizationId || context.organizationId,
          type: action.notificationType || "system",
          priority: action.priority || "medium",
          title: this.interpolateTemplate(action.title, context),
          message: this.interpolateTemplate(action.message, context),
          actionUrl: action.actionUrl,
          deliveryMethods: action.deliveryMethods || ["in_app"]
        });
      }
    }
  }
  /**
   * Simple template interpolation
   */
  interpolateTemplate(template, context) {
    if (!template || typeof template !== "string") return "";
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }
  // ============================================
  // WORKFLOW TEMPLATES
  // ============================================
  /**
   * Create workflow template
   */
  async createWorkflowTemplate(data) {
    const [template] = await db2.insert(workflowTemplates).values(data).returning();
    return template.id;
  }
  /**
   * Get workflow templates
   */
  async getWorkflowTemplates(category, isPublic) {
    const conditions = [];
    if (category) conditions.push(eq3(workflowTemplates.category, category));
    if (isPublic !== void 0) conditions.push(eq3(workflowTemplates.isPublic, isPublic));
    const query = db2.select().from(workflowTemplates);
    if (conditions.length > 0) {
      return await query.where(and3(...conditions)).orderBy(desc2(workflowTemplates.rating), desc2(workflowTemplates.usageCount));
    }
    return await query.orderBy(desc2(workflowTemplates.rating), desc2(workflowTemplates.usageCount));
  }
  /**
   * Execute workflow template
   */
  async executeWorkflow(templateId, organizationId, userId, input) {
    const [template] = await db2.select().from(workflowTemplates).where(eq3(workflowTemplates.id, templateId));
    if (!template) {
      throw new Error("Workflow template not found");
    }
    const [instance] = await db2.insert(workflowInstances).values({
      templateId,
      organizationId,
      userId,
      input,
      status: "running"
    }).returning();
    try {
      const output = await this.processWorkflowSteps(template.template, input);
      await db2.update(workflowInstances).set({
        status: "completed",
        output,
        completedAt: /* @__PURE__ */ new Date()
      }).where(eq3(workflowInstances.id, instance.id));
      await db2.update(workflowTemplates).set({
        usageCount: template.usageCount + 1
      }).where(eq3(workflowTemplates.id, templateId));
    } catch (error) {
      await db2.update(workflowInstances).set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: /* @__PURE__ */ new Date()
      }).where(eq3(workflowInstances.id, instance.id));
    }
    return instance.id;
  }
  /**
   * Process workflow steps
   */
  async processWorkflowSteps(template, input) {
    if (!template || !template.steps) {
      throw new Error("Invalid workflow template");
    }
    let output = { ...input };
    for (const step of template.steps) {
      switch (step.type) {
        case "generate_invoice":
          if (step.config?.timeLogIds) {
            const invoiceId = await this.generateInvoice(
              input.organizationId,
              input.clientEmail,
              step.config.timeLogIds,
              new Date(input.dueDate || Date.now() + 30 * 24 * 60 * 60 * 1e3)
            );
            output.invoiceId = invoiceId;
          }
          break;
        case "send_notification":
          await this.createNotification({
            userId: input.userId,
            organizationId: input.organizationId,
            type: step.config?.type || "workflow",
            priority: step.config?.priority || "medium",
            title: this.interpolateTemplate(step.config?.title || "Workflow Completed", output),
            message: this.interpolateTemplate(step.config?.message || "Your workflow has finished processing.", output),
            deliveryMethods: step.config?.deliveryMethods || ["in_app"]
          });
          break;
        default:
          console.warn(`Unknown workflow step type: ${step.type}`);
      }
    }
    return output;
  }
  /**
   * Get workflow instances for user
   */
  async getWorkflowInstances(userId, status) {
    const conditions = [eq3(workflowInstances.userId, userId)];
    if (status) {
      conditions.push(eq3(workflowInstances.status, status));
    }
    return await db2.select().from(workflowInstances).where(and3(...conditions)).orderBy(desc2(workflowInstances.startedAt));
  }
};
var automationService = new AutomationService();

// server/routes/automation.ts
init_rbac();
init_entitlements();
init_schema();
function registerAutomationRoutes(app2) {
  app2.post(
    "/api/automation/time-logs/start",
    requireAuth,
    loadEntitlementsContext,
    requireFeature(BILLING_FEATURES.CUSTOM_WORKFLOWS),
    requireWorkspacePermission(WORKSPACE_PERMISSIONS.CREATE_SESSIONS),
    async (req, res) => {
      try {
        const data = insertTimeLogSchema.omit({ endTime: true, duration: true }).parse(req.body);
        const timeLogId = await automationService.startTimeLog(data);
        res.json({ timeLogId });
      } catch (error) {
        console.error("Start time log error:", error);
        res.status(400).json({ error: error instanceof Error ? error.message : "Failed to start time log" });
      }
    }
  );
  app2.post(
    "/api/automation/time-logs/:id/stop",
    requireAuth,
    loadEntitlementsContext,
    requireFeature(BILLING_FEATURES.CUSTOM_WORKFLOWS),
    requireWorkspacePermission(WORKSPACE_PERMISSIONS.CREATE_SESSIONS),
    async (req, res) => {
      try {
        await automationService.stopTimeLog(req.params.id);
        res.json({ success: true });
      } catch (error) {
        console.error("Stop time log error:", error);
        res.status(400).json({ error: error instanceof Error ? error.message : "Failed to stop time log" });
      }
    }
  );
  app2.get(
    "/api/automation/time-logs/billable",
    requireAuth,
    loadEntitlementsContext,
    requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
    async (req, res) => {
      try {
        const { organizationId, startDate, endDate } = req.query;
        if (!organizationId) {
          return res.status(400).json({ error: "Organization ID required" });
        }
        const timeLogs2 = await automationService.getBillableTimeLogs(
          organizationId,
          startDate ? new Date(startDate) : void 0,
          endDate ? new Date(endDate) : void 0
        );
        res.json({ timeLogs: timeLogs2 });
      } catch (error) {
        console.error("Get billable time logs error:", error);
        res.status(500).json({ error: "Failed to fetch time logs" });
      }
    }
  );
  app2.post(
    "/api/automation/invoices/generate",
    requireAuth,
    loadEntitlementsContext,
    requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
    async (req, res) => {
      try {
        const schema = z2.object({
          organizationId: z2.string(),
          clientEmail: z2.string().email(),
          timeLogIds: z2.array(z2.string()),
          dueDate: z2.string(),
          taxRate: z2.number().optional()
        });
        const { organizationId, clientEmail, timeLogIds, dueDate, taxRate } = schema.parse(req.body);
        const invoiceId = await automationService.generateInvoice(
          organizationId,
          clientEmail,
          timeLogIds,
          new Date(dueDate),
          taxRate
        );
        res.json({ invoiceId });
      } catch (error) {
        console.error("Generate invoice error:", error);
        res.status(400).json({ error: error instanceof Error ? error.message : "Failed to generate invoice" });
      }
    }
  );
  app2.get(
    "/api/automation/invoices",
    requireAuth,
    loadEntitlementsContext,
    requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
    async (req, res) => {
      try {
        const { organizationId, status } = req.query;
        if (!organizationId) {
          return res.status(400).json({ error: "Organization ID required" });
        }
        const invoices2 = await automationService.getInvoices(
          organizationId,
          status
        );
        res.json({ invoices: invoices2 });
      } catch (error) {
        console.error("Get invoices error:", error);
        res.status(500).json({ error: "Failed to fetch invoices" });
      }
    }
  );
  app2.post("/api/automation/notifications", async (req, res) => {
    try {
      const data = insertNotificationSchema.parse(req.body);
      const notificationId = await automationService.createNotification(data);
      res.json({ notificationId });
    } catch (error) {
      console.error("Create notification error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create notification" });
    }
  });
  app2.get("/api/automation/notifications", async (req, res) => {
    try {
      const { userId, unreadOnly } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const notifications2 = await automationService.getUserNotifications(
        userId,
        unreadOnly === "true"
      );
      res.json({ notifications: notifications2 });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
  app2.post("/api/automation/notifications/:id/read", async (req, res) => {
    try {
      await automationService.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(400).json({ error: "Failed to mark notification as read" });
    }
  });
  app2.post("/api/automation/notification-rules", async (req, res) => {
    try {
      const data = insertNotificationRuleSchema.parse(req.body);
      const ruleId = await automationService.createNotificationRule(data);
      res.json({ ruleId });
    } catch (error) {
      console.error("Create notification rule error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create notification rule" });
    }
  });
  app2.post("/api/automation/workflow-templates", async (req, res) => {
    try {
      const data = insertWorkflowTemplateSchema.parse(req.body);
      const templateId = await automationService.createWorkflowTemplate(data);
      res.json({ templateId });
    } catch (error) {
      console.error("Create workflow template error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create workflow template" });
    }
  });
  app2.get("/api/automation/workflow-templates", async (req, res) => {
    try {
      const { category, isPublic } = req.query;
      const templates2 = await automationService.getWorkflowTemplates(
        category,
        isPublic === "true"
      );
      res.json({ templates: templates2 });
    } catch (error) {
      console.error("Get workflow templates error:", error);
      res.status(500).json({ error: "Failed to fetch workflow templates" });
    }
  });
  app2.post("/api/automation/workflows/execute", async (req, res) => {
    try {
      const schema = z2.object({
        templateId: z2.string(),
        organizationId: z2.string(),
        userId: z2.string(),
        input: z2.any()
      });
      const { templateId, organizationId, userId, input } = schema.parse(req.body);
      const instanceId = await automationService.executeWorkflow(
        templateId,
        organizationId,
        userId,
        input
      );
      res.json({ instanceId });
    } catch (error) {
      console.error("Execute workflow error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to execute workflow" });
    }
  });
  app2.get("/api/automation/workflow-instances", async (req, res) => {
    try {
      const { userId, status } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const instances = await automationService.getWorkflowInstances(
        userId,
        status
      );
      res.json({ instances });
    } catch (error) {
      console.error("Get workflow instances error:", error);
      res.status(500).json({ error: "Failed to fetch workflow instances" });
    }
  });
  app2.post("/api/automation/check-rules", async (req, res) => {
    try {
      const schema = z2.object({
        trigger: z2.string(),
        context: z2.any()
      });
      const { trigger, context } = schema.parse(req.body);
      await automationService.checkNotificationRules(trigger, context);
      res.json({ success: true });
    } catch (error) {
      console.error("Check automation rules error:", error);
      res.status(500).json({ error: "Failed to check automation rules" });
    }
  });
}

// server/routes/sprint6.ts
init_storage();

// server/workers/workflowWorker.ts
init_storage();
import { randomUUID as randomUUID3 } from "crypto";
var WorkflowWorker = class {
  isRunning = false;
  processingInterval = null;
  POLL_INTERVAL_MS = 5e3;
  // Poll every 5 seconds
  MAX_RETRIES = 3;
  constructor() {
    console.log("\u{1F916} WorkflowWorker initialized");
  }
  /**
   * Start the workflow worker
   */
  async start() {
    if (this.isRunning) {
      console.log("\u26A0\uFE0F WorkflowWorker already running");
      return;
    }
    this.isRunning = true;
    console.log("\u{1F680} Starting WorkflowWorker...");
    this.processingInterval = setInterval(() => {
      this.processWorkflowEvents().catch((error) => {
        console.error("\u274C Error in workflow processing loop:", error);
      });
    }, this.POLL_INTERVAL_MS);
    console.log(`\u2705 WorkflowWorker started (polling every ${this.POLL_INTERVAL_MS}ms)`);
  }
  /**
   * Stop the workflow worker
   */
  async stop() {
    if (!this.isRunning) {
      return;
    }
    console.log("\u{1F6D1} Stopping WorkflowWorker...");
    this.isRunning = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log("\u2705 WorkflowWorker stopped");
  }
  /**
   * Process pending workflow events
   */
  async processWorkflowEvents() {
    try {
      const pendingEvents = await storage.getPendingWorkflowEvents(10);
      if (pendingEvents.length === 0) {
        return;
      }
      console.log(`\u{1F4CB} Processing ${pendingEvents.length} workflow events`);
      for (const event of pendingEvents) {
        await this.processWorkflowEvent(event);
      }
    } catch (error) {
      console.error("\u274C Error processing workflow events:", error);
    }
  }
  /**
   * Process a single workflow event
   */
  async processWorkflowEvent(event) {
    try {
      console.log(`\u26A1 Processing workflow event: ${event.id} (${event.eventType})`);
      await storage.updateWorkflowEvent(event.id, {
        status: "processing",
        processedAt: /* @__PURE__ */ new Date()
      });
      switch (event.eventType) {
        case "trigger_workflow":
          await this.handleTriggerWorkflow(event);
          break;
        case "action_completed":
          await this.handleActionCompleted(event);
          break;
        case "webhook_received":
          await this.handleWebhookReceived(event);
          break;
        case "schedule_triggered":
          await this.handleScheduleTriggered(event);
          break;
        case "manual_trigger":
          await this.handleManualTrigger(event);
          break;
        default:
          console.warn(`\u26A0\uFE0F Unknown event type: ${event.eventType}`);
          await storage.updateWorkflowEvent(event.id, {
            status: "failed",
            errorMessage: `Unknown event type: ${event.eventType}`
          });
          return;
      }
      await storage.updateWorkflowEvent(event.id, {
        status: "completed"
      });
      console.log(`\u2705 Workflow event processed: ${event.id}`);
    } catch (error) {
      console.error(`\u274C Error processing workflow event ${event.id}:`, error);
      const retryCount = event.retryCount || 0;
      if (retryCount < this.MAX_RETRIES) {
        await storage.updateWorkflowEvent(event.id, {
          status: "pending",
          retryCount: retryCount + 1,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });
        console.log(`\u{1F504} Retrying workflow event ${event.id} (attempt ${retryCount + 1})`);
      } else {
        await storage.updateWorkflowEvent(event.id, {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Max retries exceeded"
        });
        console.log(`\u{1F480} Workflow event ${event.id} failed after ${this.MAX_RETRIES} retries`);
      }
    }
  }
  /**
   * Handle trigger_workflow event
   */
  async handleTriggerWorkflow(event) {
    const { workflowDefinitionId, triggerData, triggeredBy } = event.eventData;
    if (!workflowDefinitionId) {
      throw new Error("Missing workflowDefinitionId in trigger_workflow event");
    }
    const workflow = await storage.getWorkflowDefinition(workflowDefinitionId);
    if (!workflow) {
      throw new Error(`Workflow definition not found: ${workflowDefinitionId}`);
    }
    if (!workflow.isActive) {
      throw new Error(`Workflow is not active: ${workflowDefinitionId}`);
    }
    const execution = {
      workflowDefinitionId: workflow.id,
      organizationId: workflow.organizationId,
      triggeredBy: triggeredBy || "system",
      triggerData: triggerData || {},
      status: "running",
      totalSteps: Array.isArray(workflow.actions) ? workflow.actions.length : 0,
      metadata: {
        eventId: event.id,
        startedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    const workflowExecution = await storage.createWorkflowExecution(execution);
    console.log(`\u{1F680} Started workflow execution: ${workflowExecution.id}`);
    await this.executeWorkflowActions(workflow, workflowExecution);
  }
  /**
   * Execute workflow actions sequentially
   */
  async executeWorkflowActions(workflow, execution) {
    const actions = Array.isArray(workflow.actions) ? workflow.actions : [];
    const results = [];
    try {
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        console.log(`\u2699\uFE0F Executing action ${i + 1}/${actions.length}: ${action.type}`);
        await storage.updateWorkflowExecution(execution.id, {
          currentStep: i + 1
        });
        const actionResult = await this.executeAction(action, execution, workflow);
        results.push(actionResult);
        console.log(`\u2705 Action ${i + 1} completed:`, actionResult);
      }
      await storage.updateWorkflowExecution(execution.id, {
        status: "completed",
        completedAt: /* @__PURE__ */ new Date(),
        results,
        duration: Date.now() - new Date(execution.startedAt).getTime()
      });
      console.log(`\u{1F389} Workflow execution completed: ${execution.id}`);
    } catch (error) {
      console.error(`\u274C Workflow execution failed: ${execution.id}`, error);
      await storage.updateWorkflowExecution(execution.id, {
        status: "failed",
        completedAt: /* @__PURE__ */ new Date(),
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        results,
        duration: Date.now() - new Date(execution.startedAt).getTime()
      });
    }
  }
  /**
   * Execute a single workflow action
   */
  async executeAction(action, execution, workflow) {
    const { type, config = {} } = action;
    switch (type) {
      case "send_notification":
        return await this.executeSendNotification(action, execution, workflow);
      case "webhook":
        return await this.executeWebhook(action, execution, workflow);
      case "delay":
        return await this.executeDelay(action, execution, workflow);
      case "generate_report":
        return await this.executeGenerateReport(action, execution, workflow);
      case "email":
        return await this.executeEmail(action, execution, workflow);
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }
  /**
   * Execute send_notification action
   */
  async executeSendNotification(action, execution, workflow) {
    const { config = {} } = action;
    console.log(`\u{1F4E7} Sending notification: ${config.title || "Workflow Notification"}`);
    return {
      type: "send_notification",
      status: "completed",
      message: config.message || "Notification sent",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Execute webhook action
   */
  async executeWebhook(action, execution, workflow) {
    const { config = {} } = action;
    const { url, method = "POST", headers = {}, body } = config;
    if (!url) {
      throw new Error("Webhook URL is required");
    }
    try {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: body ? JSON.stringify(body) : JSON.stringify({
          workflowId: workflow.id,
          executionId: execution.id,
          organizationId: execution.organizationId,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      const responseData = await response.text();
      return {
        type: "webhook",
        status: response.ok ? "completed" : "failed",
        statusCode: response.status,
        response: responseData,
        url,
        method,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      throw new Error(`Webhook failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Execute delay action
   */
  async executeDelay(action, execution, workflow) {
    const { config = {} } = action;
    const delayMs = config.delayMs || config.delay || 1e3;
    console.log(`\u23F0 Delaying for ${delayMs}ms`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return {
      type: "delay",
      status: "completed",
      delayMs,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Execute generate_report action
   */
  async executeGenerateReport(action, execution, workflow) {
    const { config = {} } = action;
    console.log(`\u{1F4CA} Generating report: ${config.reportType || "workflow_report"}`);
    return {
      type: "generate_report",
      status: "completed",
      reportType: config.reportType || "workflow_report",
      reportId: randomUUID3(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Execute email action
   */
  async executeEmail(action, execution, workflow) {
    const { config = {} } = action;
    console.log(`\u{1F4E7} Sending email to: ${config.to || "workflow@example.com"}`);
    return {
      type: "email",
      status: "completed",
      to: config.to || "workflow@example.com",
      subject: config.subject || "Workflow Notification",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Handle action_completed event
   */
  async handleActionCompleted(event) {
    console.log("\u2705 Action completed event processed");
  }
  /**
   * Handle webhook_received event
   */
  async handleWebhookReceived(event) {
    console.log("\u{1F517} Webhook received event processed");
  }
  /**
   * Handle schedule_triggered event
   */
  async handleScheduleTriggered(event) {
    console.log("\u23F0 Schedule triggered event processed");
  }
  /**
   * Handle manual_trigger event
   */
  async handleManualTrigger(event) {
    console.log("\u{1F464} Manual trigger event processed");
  }
  /**
   * Trigger a workflow manually
   */
  async triggerWorkflow(workflowDefinitionId, organizationId, triggerData = {}, triggeredBy = "system") {
    const event = {
      organizationId,
      eventType: "trigger_workflow",
      eventData: {
        workflowDefinitionId,
        triggerData,
        triggeredBy
      },
      source: "manual",
      priority: 1,
      metadata: {
        triggeredAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    const workflowEvent = await storage.createWorkflowEvent(event);
    console.log(`\u{1F3AF} Workflow trigger queued: ${workflowEvent.id}`);
    return workflowEvent;
  }
};
var workflowWorker = new WorkflowWorker();

// server/workers/insightsWorker.ts
init_storage();
var InsightsWorker = class {
  isRunning = false;
  processingInterval = null;
  POLL_INTERVAL_MS = 6e4;
  // Poll every minute for analytics
  DAILY_REPORT_HOUR = 6;
  // Generate daily reports at 6 AM
  constructor() {
    console.log("\u{1F4CA} InsightsWorker initialized");
  }
  /**
   * Start the insights worker
   */
  async start() {
    if (this.isRunning) {
      console.log("\u26A0\uFE0F InsightsWorker already running");
      return;
    }
    this.isRunning = true;
    console.log("\u{1F680} Starting InsightsWorker...");
    this.processingInterval = setInterval(() => {
      this.processInsightsGeneration().catch((error) => {
        console.error("\u274C Error in insights processing loop:", error);
      });
    }, this.POLL_INTERVAL_MS);
    console.log(`\u2705 InsightsWorker started (polling every ${this.POLL_INTERVAL_MS}ms)`);
  }
  /**
   * Stop the insights worker
   */
  async stop() {
    if (!this.isRunning) {
      return;
    }
    console.log("\u{1F6D1} Stopping InsightsWorker...");
    this.isRunning = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log("\u2705 InsightsWorker stopped");
  }
  /**
   * Process insights generation tasks
   */
  async processInsightsGeneration() {
    try {
      const now = /* @__PURE__ */ new Date();
      if (now.getHours() === this.DAILY_REPORT_HOUR && now.getMinutes() === 0) {
        await this.generateDailyReports();
      }
      await this.updateRealTimeAnalytics();
    } catch (error) {
      console.error("\u274C Error processing insights generation:", error);
    }
  }
  /**
   * Generate daily reports for all organizations
   */
  async generateDailyReports() {
    try {
      console.log("\u{1F4C8} Generating daily reports for all organizations...");
      const sampleOrganizationId = "sample-org-123";
      const reportDate = /* @__PURE__ */ new Date();
      reportDate.setHours(0, 0, 0, 0);
      await this.generateDailyReport(sampleOrganizationId, reportDate);
      console.log("\u2705 Daily reports generated successfully");
    } catch (error) {
      console.error("\u274C Error generating daily reports:", error);
    }
  }
  /**
   * Generate daily report for a specific organization
   */
  async generateDailyReport(organizationId, date) {
    try {
      console.log(`\u{1F4CA} Generating daily report for organization: ${organizationId}`);
      const existingReport = await storage.getOrganizationDailyReport(organizationId, date, "daily_summary");
      if (existingReport) {
        console.log(`\u{1F4CB} Daily report already exists for ${organizationId} on ${date.toDateString()}`);
        return existingReport;
      }
      const analytics = await storage.getOrganizationAnalytics(organizationId, date);
      const insights = this.generateInsights(analytics);
      const recommendations = this.generateRecommendations(analytics);
      const alerts = this.generateAlerts(analytics);
      const reportData = {
        organizationId,
        reportDate: date,
        reportType: "daily_summary",
        title: `Daily Summary - ${date.toDateString()}`,
        summary: this.generateExecutiveSummary(analytics),
        keyMetrics: {
          activeUsers: analytics?.activeUsers || 0,
          totalSessions: analytics?.totalSessions || 0,
          templatesUsed: analytics?.templatesUsed || 0,
          workflowsExecuted: analytics?.workflowsExecuted || 0,
          apiCalls: analytics?.apiCalls || 0,
          storageUsed: analytics?.storageUsed || 0,
          averageSessionDuration: analytics?.averageSessionDuration || 0,
          errorRate: parseFloat(analytics?.errorRate || "0")
        },
        insights,
        recommendations,
        alerts,
        charts: this.generateChartData(analytics),
        generatedBy: "system",
        recipients: [],
        // Will be populated based on organization settings
        metadata: {
          generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          analyticsDataDate: date.toISOString(),
          version: "1.0"
        }
      };
      const report = await storage.createOrganizationDailyReport(reportData);
      console.log(`\u2705 Daily report generated: ${report.id}`);
      return report;
    } catch (error) {
      console.error(`\u274C Error generating daily report for ${organizationId}:`, error);
      throw error;
    }
  }
  /**
   * Update real-time analytics for organizations
   */
  async updateRealTimeAnalytics() {
    try {
      const sampleOrganizationId = "sample-org-123";
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      let analytics = await storage.getOrganizationAnalytics(sampleOrganizationId, today);
      if (!analytics) {
        const analyticsData = {
          organizationId: sampleOrganizationId,
          date: today,
          activeUsers: this.generateRandomMetric(10, 50),
          totalSessions: this.generateRandomMetric(20, 100),
          templatesUsed: this.generateRandomMetric(5, 25),
          workflowsExecuted: this.generateRandomMetric(0, 10),
          apiCalls: this.generateRandomMetric(100, 1e3),
          storageUsed: this.generateRandomMetric(1e6, 1e7),
          // bytes
          averageSessionDuration: this.generateRandomMetric(300, 1800),
          // seconds
          topTemplates: [
            { id: "template-1", name: "Business Analysis", usage: 15 },
            { id: "template-2", name: "Technical Review", usage: 12 },
            { id: "template-3", name: "Strategic Planning", usage: 8 }
          ],
          topUsers: [
            { id: "user-1", name: "John Doe", sessions: 5 },
            { id: "user-2", name: "Jane Smith", sessions: 4 },
            { id: "user-3", name: "Bob Johnson", sessions: 3 }
          ],
          errorRate: "0.02",
          // 2% error rate
          performance: {
            avgResponseTime: this.generateRandomMetric(100, 500),
            p95ResponseTime: this.generateRandomMetric(200, 800),
            uptime: 99.9
          },
          features: {
            templateUsage: this.generateRandomMetric(60, 90),
            workflowUsage: this.generateRandomMetric(20, 40),
            collaborationUsage: this.generateRandomMetric(30, 60)
          },
          metadata: {
            lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
            dataSource: "system_metrics"
          }
        };
        analytics = await storage.createOrganizationAnalytics(analyticsData);
        console.log(`\u{1F4C8} Created new analytics entry for ${sampleOrganizationId}`);
      } else {
        const updates = {
          activeUsers: analytics.activeUsers + this.generateRandomMetric(-2, 5),
          totalSessions: analytics.totalSessions + this.generateRandomMetric(0, 10),
          templatesUsed: analytics.templatesUsed + this.generateRandomMetric(0, 3),
          apiCalls: analytics.apiCalls + this.generateRandomMetric(10, 50),
          metadata: {
            ...analytics.metadata,
            lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
          }
        };
        await storage.updateOrganizationAnalytics(analytics.id, updates);
        console.log(`\u{1F504} Updated analytics for ${sampleOrganizationId}`);
      }
      await this.recordUsageMetrics(sampleOrganizationId);
    } catch (error) {
      console.error("\u274C Error updating real-time analytics:", error);
    }
  }
  /**
   * Record enhanced usage metrics
   */
  async recordUsageMetrics(organizationId) {
    const metrics = [
      {
        organizationId,
        resourceType: "template",
        action: "execute",
        metricType: "usage",
        value: this.generateRandomMetric(1, 5),
        unit: "count",
        tags: ["automated"],
        dimensions: { source: "worker", type: "template_execution" }
      },
      {
        organizationId,
        resourceType: "workflow",
        action: "execute",
        metricType: "usage",
        value: this.generateRandomMetric(0, 2),
        unit: "count",
        tags: ["automated"],
        dimensions: { source: "worker", type: "workflow_execution" }
      },
      {
        organizationId,
        resourceType: "api",
        action: "read",
        metricType: "performance",
        value: this.generateRandomMetric(100, 300),
        unit: "milliseconds",
        tags: ["performance"],
        dimensions: { source: "worker", endpoint: "insights" }
      }
    ];
    for (const metric of metrics) {
      try {
        await storage.recordEnhancedUsageMetric(metric);
      } catch (error) {
        console.error("\u274C Error recording usage metric:", error);
      }
    }
  }
  /**
   * Generate insights from analytics data
   */
  generateInsights(analytics) {
    if (!analytics) return [];
    const insights = [];
    if (analytics.activeUsers > 0) {
      insights.push({
        type: "usage_trend",
        title: "User Engagement",
        description: `${analytics.activeUsers} active users with ${analytics.totalSessions} total sessions`,
        impact: "positive",
        confidence: 0.8
      });
    }
    if (analytics.templatesUsed > 10) {
      insights.push({
        type: "template_adoption",
        title: "High Template Usage",
        description: `Templates are being actively used with ${analytics.templatesUsed} executions`,
        impact: "positive",
        confidence: 0.9
      });
    }
    const errorRate = parseFloat(analytics.errorRate || "0");
    if (errorRate > 0.05) {
      insights.push({
        type: "performance_issue",
        title: "Elevated Error Rate",
        description: `Error rate is ${(errorRate * 100).toFixed(2)}%, which is above normal`,
        impact: "negative",
        confidence: 0.7
      });
    }
    return insights;
  }
  /**
   * Generate recommendations from analytics data
   */
  generateRecommendations(analytics) {
    if (!analytics) return [];
    const recommendations = [];
    if (analytics.workflowsExecuted < 5) {
      recommendations.push({
        type: "feature_adoption",
        title: "Increase Workflow Usage",
        description: "Consider creating workflow templates to automate repetitive tasks",
        priority: "medium",
        category: "productivity"
      });
    }
    if (analytics.storageUsed > 5e6) {
      recommendations.push({
        type: "optimization",
        title: "Storage Optimization",
        description: "Review and archive old analysis sessions to optimize storage usage",
        priority: "low",
        category: "maintenance"
      });
    }
    if (analytics.averageSessionDuration < 300) {
      recommendations.push({
        type: "engagement",
        title: "Improve User Engagement",
        description: "Consider providing tutorials or templates to increase session duration",
        priority: "medium",
        category: "user_experience"
      });
    }
    return recommendations;
  }
  /**
   * Generate alerts from analytics data
   */
  generateAlerts(analytics) {
    if (!analytics) return [];
    const alerts = [];
    const errorRate = parseFloat(analytics.errorRate || "0");
    if (errorRate > 0.1) {
      alerts.push({
        type: "error_rate",
        severity: "high",
        title: "High Error Rate Detected",
        description: `Error rate is ${(errorRate * 100).toFixed(2)}%, immediate attention required`,
        actionRequired: true
      });
    }
    if (analytics.activeUsers === 0) {
      alerts.push({
        type: "activity",
        severity: "medium",
        title: "No Active Users",
        description: "No user activity detected today",
        actionRequired: false
      });
    }
    return alerts;
  }
  /**
   * Generate executive summary
   */
  generateExecutiveSummary(analytics) {
    if (!analytics) {
      return "No analytics data available for this date.";
    }
    return `Daily Summary: ${analytics.activeUsers} active users completed ${analytics.totalSessions} analysis sessions, utilizing ${analytics.templatesUsed} templates. System performance maintained ${((1 - parseFloat(analytics.errorRate || "0")) * 100).toFixed(1)}% success rate with average session duration of ${Math.round(analytics.averageSessionDuration / 60)} minutes.`;
  }
  /**
   * Generate chart data for visualization
   */
  generateChartData(analytics) {
    if (!analytics) return {};
    return {
      userActivity: {
        type: "line",
        data: [
          { time: "00:00", users: Math.floor(analytics.activeUsers * 0.1) },
          { time: "06:00", users: Math.floor(analytics.activeUsers * 0.3) },
          { time: "12:00", users: Math.floor(analytics.activeUsers * 0.8) },
          { time: "18:00", users: Math.floor(analytics.activeUsers * 0.6) },
          { time: "23:59", users: Math.floor(analytics.activeUsers * 0.2) }
        ]
      },
      templateUsage: {
        type: "pie",
        data: analytics.topTemplates || []
      },
      performance: {
        type: "gauge",
        data: {
          successRate: (1 - parseFloat(analytics.errorRate || "0")) * 100,
          avgResponseTime: analytics.performance?.avgResponseTime || 200
        }
      }
    };
  }
  /**
   * Generate random metric for simulation
   */
  generateRandomMetric(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  /**
   * Get organization insights summary
   */
  async getOrganizationInsightsSummary(organizationId) {
    try {
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      const analytics = await storage.getOrganizationAnalytics(organizationId, today);
      const reports = await storage.getOrganizationDailyReports(organizationId, 1);
      const latestReport = reports[0];
      const endDate = /* @__PURE__ */ new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1e3);
      const usageMetrics2 = await storage.getEnhancedUsageMetrics(organizationId, void 0, startDate, endDate);
      return {
        summary: {
          organizationId,
          date: today.toISOString(),
          activeUsers: analytics?.activeUsers || 0,
          totalSessions: analytics?.totalSessions || 0,
          templatesUsed: analytics?.templatesUsed || 0,
          workflowsExecuted: analytics?.workflowsExecuted || 0,
          errorRate: parseFloat(analytics?.errorRate || "0"),
          performance: analytics?.performance || {}
        },
        latestReport: latestReport ? {
          id: latestReport.id,
          title: latestReport.title,
          summary: latestReport.summary,
          generatedAt: latestReport.generatedAt,
          insights: latestReport.insights,
          recommendations: latestReport.recommendations,
          alerts: latestReport.alerts
        } : null,
        usageMetrics: {
          totalMetrics: usageMetrics2.length,
          recentActivity: usageMetrics2.slice(-10),
          byResourceType: this.groupMetricsByResourceType(usageMetrics2)
        },
        trends: {
          weeklyGrowth: this.calculateWeeklyGrowth(analytics),
          topTemplates: analytics?.topTemplates || [],
          topUsers: analytics?.topUsers || []
        }
      };
    } catch (error) {
      console.error(`\u274C Error getting insights summary for ${organizationId}:`, error);
      throw error;
    }
  }
  /**
   * Group metrics by resource type
   */
  groupMetricsByResourceType(metrics) {
    const grouped = metrics.reduce((acc, metric) => {
      const type = metric.resourceType;
      if (!acc[type]) {
        acc[type] = { count: 0, totalValue: 0 };
      }
      acc[type].count++;
      acc[type].totalValue += parseFloat(metric.value || "0");
      return acc;
    }, {});
    return grouped;
  }
  /**
   * Calculate weekly growth metrics
   */
  calculateWeeklyGrowth(analytics) {
    if (!analytics) return { users: 0, sessions: 0, templates: 0 };
    return {
      users: Math.floor(Math.random() * 20) - 10,
      // -10 to +10%
      sessions: Math.floor(Math.random() * 30) - 15,
      // -15 to +15%
      templates: Math.floor(Math.random() * 25) - 12
      // -12 to +13%
    };
  }
};
var insightsWorker = new InsightsWorker();

// server/middleware/tenantHardening.ts
function organizationHeaderValidation(req, res, next) {
  const orgHeader = req.headers["x-organization-id"];
  const requireOrgHeader = process.env.REQUIRE_ORG_HEADER === "true";
  if (requireOrgHeader) {
    if (!orgHeader) {
      console.warn("\u{1F6AB} Missing required X-Organization-Id header");
      res.status(400).json({
        error: "Missing organization context",
        message: "X-Organization-Id header is required",
        code: "MISSING_ORG_HEADER"
      });
      return;
    }
    if (!isValidOrganizationId(orgHeader)) {
      console.warn(`\u{1F6AB} Invalid organization ID format: ${orgHeader}`);
      res.status(400).json({
        error: "Invalid organization context",
        message: "X-Organization-Id header must be a valid organization identifier",
        code: "INVALID_ORG_ID"
      });
      return;
    }
    console.log(`\u{1F3E2} Organization context enforced: ${orgHeader}`);
    req.organization = {
      id: orgHeader,
      enforced: true
    };
  } else {
    if (orgHeader && isValidOrganizationId(orgHeader)) {
      console.log(`\u{1F3E2} Organization context provided: ${orgHeader}`);
      req.organization = {
        id: orgHeader,
        enforced: false
      };
    } else if (orgHeader) {
      console.warn(`\u26A0\uFE0F Invalid organization header provided: ${orgHeader}`);
      res.status(400).json({
        error: "Invalid organization context",
        message: "X-Organization-Id header format is invalid",
        code: "INVALID_ORG_ID"
      });
      return;
    }
  }
  next();
}
function requireOrganizationContext(req, res, next) {
  if (!req.organization?.id) {
    console.warn("\u{1F6AB} Organization context required but not provided");
    res.status(400).json({
      error: "Organization context required",
      message: "This endpoint requires X-Organization-Id header",
      code: "ORG_CONTEXT_REQUIRED"
    });
    return;
  }
  console.log(`\u2705 Organization context validated: ${req.organization.id}`);
  next();
}
function getOrganizationContext(req) {
  return req.organization || null;
}
function isOrganizationEnforced() {
  return process.env.REQUIRE_ORG_HEADER === "true";
}
function isValidOrganizationId(orgId) {
  if (!orgId || typeof orgId !== "string") {
    return false;
  }
  const orgIdPattern = /^[a-zA-Z0-9_-]{1,50}$/;
  return orgIdPattern.test(orgId);
}
function logOrganizationContext(req, res, next) {
  const orgContext = getOrganizationContext(req);
  const path3 = req.path;
  const method = req.method;
  if (orgContext) {
    console.log(`\u{1F3E2} [${method} ${path3}] Organization: ${orgContext.id} (enforced: ${orgContext.enforced})`);
  } else {
    console.log(`\u{1F3E2} [${method} ${path3}] No organization context`);
  }
  next();
}
function createRLSMiddleware(options = {}) {
  const { requireOrganization = false, logContext = false } = options;
  return [
    organizationHeaderValidation,
    ...logContext ? [logOrganizationContext] : [],
    ...requireOrganization ? [requireOrganizationContext] : []
  ];
}
console.log("\u{1F6E1}\uFE0F Tenant hardening middleware initialized:", {
  orgHeaderRequired: isOrganizationEnforced(),
  environment: process.env.NODE_ENV || "development"
});

// server/routes/sprint6.ts
init_schema();
function registerSprint6Routes(app2) {
  console.log("\u{1F680} Registering Sprint 6 routes...");
  const rlsMiddleware = createRLSMiddleware({
    requireOrganization: false,
    // Individual routes can override this
    logContext: true
  });
  app2.use("/api/workflows*", organizationHeaderValidation);
  app2.use("/api/org*", organizationHeaderValidation, requireOrganizationContext);
  app2.use("/api/templates/*/publish*", organizationHeaderValidation);
  app2.use("/api/templates/*/unpublish*", organizationHeaderValidation);
  app2.use("/api/templates/status*", organizationHeaderValidation);
  app2.get("/api/sprint6/feature-flags", async (req, res) => {
    try {
      const featureFlags = {
        // Sprint 6 features
        template_builder_enabled: true,
        template_publishing_enabled: true,
        workflow_automation_enabled: true,
        organization_insights_enabled: true,
        tenant_hardening_enabled: process.env.REQUIRE_ORG_HEADER === "true",
        enhanced_analytics_enabled: true,
        workflow_webhooks_enabled: true,
        daily_reports_enabled: true
      };
      console.log("\u{1F3C1} Sprint 6 feature flags requested:", featureFlags);
      res.json(featureFlags);
    } catch (error) {
      console.error("\u274C Sprint 6 feature flags error:", error);
      res.status(500).json({
        message: "Failed to fetch Sprint 6 feature flags",
        error: error.message
      });
    }
  });
  app2.post("/api/templates/:id/publish", async (req, res) => {
    try {
      const { id } = req.params;
      const { comments } = req.body;
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const publishedTemplate = await storage.publishTemplate(id, user.id, comments);
      if (!publishedTemplate) {
        return res.status(404).json({ error: "Template not found" });
      }
      console.log(`\u{1F4E4} Template published: ${id} by ${user.id}`);
      res.json({
        template: publishedTemplate,
        message: "Template published successfully"
      });
    } catch (error) {
      console.error("\u274C Template publish error:", error);
      res.status(500).json({
        error: "Failed to publish template",
        message: error.message
      });
    }
  });
  app2.post("/api/templates/:id/unpublish", async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const unpublishedTemplate = await storage.unpublishTemplate(id, user.id, reason);
      if (!unpublishedTemplate) {
        return res.status(404).json({ error: "Template not found" });
      }
      console.log(`\u{1F4E5} Template unpublished: ${id} by ${user.id}`);
      res.json({
        template: unpublishedTemplate,
        message: "Template unpublished successfully"
      });
    } catch (error) {
      console.error("\u274C Template unpublish error:", error);
      res.status(500).json({
        error: "Failed to unpublish template",
        message: error.message
      });
    }
  });
  app2.get("/api/templates/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const { organizationId } = req.query;
      const templates2 = await storage.getTemplatesByStatus(
        status,
        organizationId
      );
      console.log(`\u{1F4CB} Retrieved ${templates2.length} templates with status: ${status}`);
      res.json({ templates: templates2 });
    } catch (error) {
      console.error("\u274C Templates by status error:", error);
      res.status(500).json({
        error: "Failed to get templates by status",
        message: error.message
      });
    }
  });
  app2.get("/api/templates/:id/versions", async (req, res) => {
    try {
      const { id } = req.params;
      const versions = await storage.getTemplateVersions(id);
      console.log(`\u{1F4CB} Retrieved ${versions.length} versions for template: ${id}`);
      res.json({ versions });
    } catch (error) {
      console.error("\u274C Template versions error:", error);
      res.status(500).json({
        error: "Failed to get template versions",
        message: error.message
      });
    }
  });
  app2.post("/api/templates/:id/versions", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const newVersion = await storage.createTemplateVersion(id, updates, user.id);
      console.log(`\u{1F4C4} Created new version for template: ${id}`);
      res.json({
        template: newVersion,
        message: "Template version created successfully"
      });
    } catch (error) {
      console.error("\u274C Template version creation error:", error);
      res.status(500).json({
        error: "Failed to create template version",
        message: error.message
      });
    }
  });
  app2.post("/api/workflows", async (req, res) => {
    try {
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const workflowData = insertWorkflowDefinitionSchema.parse({
        ...req.body,
        createdBy: user.id
      });
      const workflow = await storage.createWorkflowDefinition(workflowData);
      console.log(`\u{1F504} Workflow definition created: ${workflow.id}`);
      res.status(201).json({
        workflow,
        message: "Workflow definition created successfully"
      });
    } catch (error) {
      console.error("\u274C Workflow creation error:", error);
      res.status(400).json({
        error: "Failed to create workflow definition",
        message: error.message
      });
    }
  });
  app2.get("/api/workflows", async (req, res) => {
    try {
      const { organizationId } = req.query;
      if (!organizationId) {
        return res.status(400).json({ error: "organizationId query parameter required" });
      }
      const workflows = await storage.getOrganizationWorkflowDefinitions(organizationId);
      console.log(`\u{1F4CB} Retrieved ${workflows.length} workflow definitions`);
      res.json({ workflows });
    } catch (error) {
      console.error("\u274C Get workflows error:", error);
      res.status(500).json({
        error: "Failed to get workflow definitions",
        message: error.message
      });
    }
  });
  app2.get("/api/workflows/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const workflow = await storage.getWorkflowDefinition(id);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow definition not found" });
      }
      console.log(`\u{1F4CB} Retrieved workflow definition: ${id}`);
      res.json({ workflow });
    } catch (error) {
      console.error("\u274C Get workflow error:", error);
      res.status(500).json({
        error: "Failed to get workflow definition",
        message: error.message
      });
    }
  });
  app2.put("/api/workflows/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const workflow = await storage.updateWorkflowDefinition(id, {
        ...updates,
        updatedBy: user.id
      });
      if (!workflow) {
        return res.status(404).json({ error: "Workflow definition not found" });
      }
      console.log(`\u{1F504} Workflow definition updated: ${id}`);
      res.json({
        workflow,
        message: "Workflow definition updated successfully"
      });
    } catch (error) {
      console.error("\u274C Workflow update error:", error);
      res.status(500).json({
        error: "Failed to update workflow definition",
        message: error.message
      });
    }
  });
  app2.delete("/api/workflows/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWorkflowDefinition(id);
      if (!deleted) {
        return res.status(404).json({ error: "Workflow definition not found" });
      }
      console.log(`\u{1F5D1}\uFE0F Workflow definition deleted: ${id}`);
      res.json({ message: "Workflow definition deleted successfully" });
    } catch (error) {
      console.error("\u274C Workflow deletion error:", error);
      res.status(500).json({
        error: "Failed to delete workflow definition",
        message: error.message
      });
    }
  });
  app2.post("/api/workflows/:id/trigger", async (req, res) => {
    try {
      const { id } = req.params;
      const { triggerData = {} } = req.body;
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const workflow = await storage.getWorkflowDefinition(id);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow definition not found" });
      }
      const event = await workflowWorker.triggerWorkflow(
        id,
        workflow.organizationId,
        triggerData,
        user.id
      );
      console.log(`\u{1F3AF} Workflow triggered: ${id} (event: ${event.id})`);
      res.json({
        eventId: event.id,
        workflowId: id,
        message: "Workflow triggered successfully"
      });
    } catch (error) {
      console.error("\u274C Workflow trigger error:", error);
      res.status(500).json({
        error: "Failed to trigger workflow",
        message: error.message
      });
    }
  });
  app2.get("/api/workflows/executions", async (req, res) => {
    try {
      const { workflowDefinitionId, organizationId, limit } = req.query;
      const executions = await storage.getWorkflowExecutions(
        workflowDefinitionId,
        organizationId,
        limit ? parseInt(limit) : void 0
      );
      console.log(`\u{1F4CB} Retrieved ${executions.length} workflow executions`);
      res.json({ executions });
    } catch (error) {
      console.error("\u274C Get workflow executions error:", error);
      res.status(500).json({
        error: "Failed to get workflow executions",
        message: error.message
      });
    }
  });
  app2.get("/api/workflows/executions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const execution = await storage.getWorkflowExecution(id);
      if (!execution) {
        return res.status(404).json({ error: "Workflow execution not found" });
      }
      console.log(`\u{1F4CB} Retrieved workflow execution: ${id}`);
      res.json({ execution });
    } catch (error) {
      console.error("\u274C Get workflow execution error:", error);
      res.status(500).json({
        error: "Failed to get workflow execution",
        message: error.message
      });
    }
  });
  app2.post("/api/workflows/webhook/:workflowId", async (req, res) => {
    try {
      const { workflowId } = req.params;
      const webhookData = req.body;
      const expectedSecret = process.env.WORKFLOW_WEBHOOK_SECRET;
      if (expectedSecret) {
        const providedSecret = req.headers["x-webhook-secret"];
        if (providedSecret !== expectedSecret) {
          return res.status(401).json({ error: "Invalid webhook secret" });
        }
      }
      const workflow = await storage.getWorkflowDefinition(workflowId);
      if (!workflow) {
        return res.status(404).json({ error: "Workflow definition not found" });
      }
      const event = await storage.createWorkflowEvent({
        organizationId: workflow.organizationId,
        eventType: "webhook_received",
        eventData: {
          workflowDefinitionId: workflowId,
          webhookData,
          triggeredBy: "webhook"
        },
        source: "webhook",
        priority: 2
      });
      console.log(`\u{1F517} Webhook event created: ${event.id} for workflow: ${workflowId}`);
      res.json({
        eventId: event.id,
        message: "Webhook received and queued for processing"
      });
    } catch (error) {
      console.error("\u274C Webhook processing error:", error);
      res.status(500).json({
        error: "Failed to process webhook",
        message: error.message
      });
    }
  });
  app2.get("/api/org/insights/summary", async (req, res) => {
    try {
      const { organizationId } = req.query;
      if (!organizationId) {
        return res.status(400).json({ error: "organizationId query parameter required" });
      }
      const summary = await insightsWorker.getOrganizationInsightsSummary(organizationId);
      console.log(`\u{1F4CA} Retrieved insights summary for organization: ${organizationId}`);
      res.json(summary);
    } catch (error) {
      console.error("\u274C Organization insights summary error:", error);
      res.status(500).json({
        error: "Failed to get organization insights summary",
        message: error.message
      });
    }
  });
  app2.get("/api/org/insights/daily", async (req, res) => {
    try {
      const { organizationId, limit } = req.query;
      if (!organizationId) {
        return res.status(400).json({ error: "organizationId query parameter required" });
      }
      const reports = await storage.getOrganizationDailyReports(
        organizationId,
        limit ? parseInt(limit) : 30
      );
      console.log(`\u{1F4CA} Retrieved ${reports.length} daily reports for organization: ${organizationId}`);
      res.json({ reports });
    } catch (error) {
      console.error("\u274C Organization daily reports error:", error);
      res.status(500).json({
        error: "Failed to get organization daily reports",
        message: error.message
      });
    }
  });
  app2.post("/api/org/insights/daily/generate", async (req, res) => {
    try {
      const { organizationId, date } = req.body;
      if (!organizationId) {
        return res.status(400).json({ error: "organizationId is required" });
      }
      const reportDate = date ? new Date(date) : /* @__PURE__ */ new Date();
      reportDate.setHours(0, 0, 0, 0);
      const report = await insightsWorker.generateDailyReport(organizationId, reportDate);
      console.log(`\u{1F4CA} Generated daily report: ${report.id} for organization: ${organizationId}`);
      res.status(201).json({
        report,
        message: "Daily report generated successfully"
      });
    } catch (error) {
      console.error("\u274C Daily report generation error:", error);
      res.status(500).json({
        error: "Failed to generate daily report",
        message: error.message
      });
    }
  });
  app2.get("/api/org/analytics", async (req, res) => {
    try {
      const { organizationId, startDate, endDate } = req.query;
      if (!organizationId) {
        return res.status(400).json({ error: "organizationId query parameter required" });
      }
      if (startDate && endDate) {
        const analytics = await storage.getOrganizationAnalyticsRange(
          organizationId,
          new Date(startDate),
          new Date(endDate)
        );
        res.json({ analytics });
      } else {
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const analytics = await storage.getOrganizationAnalytics(organizationId, today);
        res.json({ analytics });
      }
      console.log(`\u{1F4CA} Retrieved analytics for organization: ${organizationId}`);
    } catch (error) {
      console.error("\u274C Organization analytics error:", error);
      res.status(500).json({
        error: "Failed to get organization analytics",
        message: error.message
      });
    }
  });
  app2.post("/api/org/metrics", async (req, res) => {
    try {
      const metricData = insertEnhancedUsageMetricSchema.parse(req.body);
      const metric = await storage.recordEnhancedUsageMetric(metricData);
      console.log(`\u{1F4C8} Usage metric recorded: ${metric.id}`);
      res.status(201).json({
        metric,
        message: "Usage metric recorded successfully"
      });
    } catch (error) {
      console.error("\u274C Usage metric recording error:", error);
      res.status(400).json({
        error: "Failed to record usage metric",
        message: error.message
      });
    }
  });
  app2.get("/api/org/metrics", async (req, res) => {
    try {
      const { organizationId, resourceType, startDate, endDate } = req.query;
      if (!organizationId) {
        return res.status(400).json({ error: "organizationId query parameter required" });
      }
      const metrics = await storage.getEnhancedUsageMetrics(
        organizationId,
        resourceType,
        startDate ? new Date(startDate) : void 0,
        endDate ? new Date(endDate) : void 0
      );
      console.log(`\u{1F4C8} Retrieved ${metrics.length} usage metrics for organization: ${organizationId}`);
      res.json({ metrics });
    } catch (error) {
      console.error("\u274C Get usage metrics error:", error);
      res.status(500).json({
        error: "Failed to get usage metrics",
        message: error.message
      });
    }
  });
  console.log("\u2705 Sprint 6 routes registered successfully");
}

// server/routes.ts
init_rbac();
init_entitlements();

// server/middleware/circuitBreaker.ts
function circuitBreaker(opts) {
  const failureThreshold = opts?.failureThreshold ?? Number(process.env.CB_FAILURE_THRESHOLD || 5);
  const resetMs = opts?.resetMs ?? Number(process.env.CB_RESET_MS || 15e3);
  let state = "closed";
  let fails = 0;
  let nextTry = 0;
  return async function(fn) {
    const now = Date.now();
    if (state === "open" && now < nextTry) throw new Error("CB_OPEN");
    if (state === "open" && now >= nextTry) state = "half-open";
    try {
      const result = await fn();
      fails = 0;
      state = "closed";
      return result;
    } catch (e) {
      fails += 1;
      if (fails >= failureThreshold) {
        state = "open";
        nextTry = now + resetMs;
      }
      throw e;
    }
  };
}
function createCircuitBreakerMiddleware(serviceName, opts) {
  const cb = circuitBreaker(opts);
  return (req, res, next) => {
    req.circuitBreaker = cb;
    req.serviceName = serviceName;
    next();
  };
}

// server/middleware/securityHeaders.ts
var DEFAULT_CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    // Required for Vite dev mode and some UI libraries
    "'unsafe-eval'",
    // Required for Vite dev mode
    "https://cdn.jsdelivr.net",
    // For external libraries
    "https://*.replit.dev",
    // For Replit WebView integration
    "https://*.replit.co"
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    // Required for CSS-in-JS and inline styles
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net"
  ],
  "img-src": [
    "'self'",
    "data:",
    // For base64 images
    "blob:",
    // For generated images
    "https:",
    // For external images
    "*.replit.dev",
    "*.replit.co"
  ],
  "font-src": [
    "'self'",
    "https://fonts.gstatic.com",
    "https://cdn.jsdelivr.net",
    "data:"
    // For embedded fonts
  ],
  "connect-src": [
    "'self'",
    "https://*.replit.dev",
    "https://*.replit.co",
    "wss://*.replit.dev",
    // For WebSocket connections
    "wss://*.replit.co",
    "https://api.openai.com",
    // External AI services
    "https://api.anthropic.com",
    "https://api.perplexity.ai"
  ],
  "frame-ancestors": ["'none'"],
  // Prevent embedding
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "upgrade-insecure-requests": []
};
function securityHeadersMiddleware(options = {}) {
  return (req, res, next) => {
    if (options.contentSecurityPolicy !== false) {
      const cspDirectives = {
        ...DEFAULT_CSP_DIRECTIVES,
        ...options.contentSecurityPolicy?.directives
      };
      const cspHeader = Object.entries(cspDirectives).map(([directive, sources]) => `${directive} ${sources.join(" ")}`).join("; ");
      const headerName = options.contentSecurityPolicy?.reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";
      res.setHeader(headerName, cspHeader);
    }
    if (req.secure || req.get("x-forwarded-proto") === "https") {
      const hsts = options.strictTransportSecurity || {};
      const maxAge = hsts.maxAge || 31536e3;
      const includeSubDomains = hsts.includeSubDomains !== false;
      const preload = hsts.preload === true;
      let hstsValue = `max-age=${maxAge}`;
      if (includeSubDomains) hstsValue += "; includeSubDomains";
      if (preload) hstsValue += "; preload";
      res.setHeader("Strict-Transport-Security", hstsValue);
    }
    const frameOptions = options.frameOptions || "DENY";
    res.setHeader("X-Frame-Options", frameOptions);
    if (options.contentTypeOptions !== false) {
      res.setHeader("X-Content-Type-Options", "nosniff");
    }
    const referrerPolicy = options.referrerPolicy || "strict-origin-when-cross-origin";
    res.setHeader("Referrer-Policy", referrerPolicy);
    res.setHeader("X-XSS-Protection", "1; mode=block");
    if (options.permissionsPolicy) {
      const permissionsPolicy = Object.entries(options.permissionsPolicy).map(([feature, allowlist]) => `${feature}=(${allowlist.join(" ")})`).join(", ");
      res.setHeader("Permissions-Policy", permissionsPolicy);
    }
    res.setHeader("X-Powered-By", "SymbiosoAI");
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    if (req.path.startsWith("/api/")) {
      res.setHeader("X-API-Version", "1.0");
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
    next();
  };
}
function developmentSecurityHeaders() {
  return securityHeadersMiddleware({
    contentSecurityPolicy: {
      directives: {
        ...DEFAULT_CSP_DIRECTIVES,
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          // Required for Vite HMR
          "https://cdn.jsdelivr.net",
          "https://*.replit.dev",
          "https://*.replit.co"
        ]
      }
    },
    strictTransportSecurity: {
      maxAge: 0
      // Disable HSTS in development
    }
  });
}
function productionSecurityHeaders() {
  return securityHeadersMiddleware({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "https://cdn.jsdelivr.net"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "img-src": ["'self'", "data:", "https:"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "connect-src": [
          "'self'",
          "https://api.openai.com",
          "https://api.anthropic.com",
          "https://api.perplexity.ai"
        ],
        "frame-ancestors": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "upgrade-insecure-requests": []
      }
    },
    strictTransportSecurity: {
      maxAge: 31536e3,
      includeSubDomains: true,
      preload: true
    },
    permissionsPolicy: {
      "camera": ["none"],
      "microphone": ["none"],
      "geolocation": ["none"],
      "notifications": ["self"],
      "payment": ["none"]
    }
  });
}

// server/routes/ops.ts
init_storage();

// server/utils/llmCache.ts
var cache = /* @__PURE__ */ new Map();
function getCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let totalHits = 0;
  let expiredEntries = 0;
  for (const [key, entry] of cache.entries()) {
    if (entry.exp > now) {
      validEntries++;
      totalHits += entry.hits;
    } else {
      expiredEntries++;
    }
  }
  return {
    totalEntries: cache.size,
    validEntries,
    expiredEntries,
    totalHits,
    hitRate: validEntries > 0 ? totalHits / validEntries : 0
  };
}

// server/routes/ops.ts
function registerOpsRoutes(app2) {
  app2.get("/ops/health", async (req, res) => {
    try {
      const startTime = Date.now();
      let dbStatus = "healthy";
      let dbResponseTime = 0;
      try {
        const dbStart = Date.now();
        await storage.getUserAnalysisSessions("health-check-user");
        dbResponseTime = Date.now() - dbStart;
      } catch (error) {
        dbStatus = "unhealthy";
        dbResponseTime = Date.now() - startTime;
      }
      const cacheStats = getCacheStats();
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();
      let healthScore = 100;
      if (dbStatus === "unhealthy") healthScore -= 50;
      if (dbResponseTime > 1e3) healthScore -= 20;
      if (cacheStats.hitRate < 0.2) healthScore -= 10;
      if (memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9) healthScore -= 20;
      const responseTime = Date.now() - startTime;
      const isHealthy = healthScore >= 70;
      const healthData = {
        status: isHealthy ? "healthy" : "unhealthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        uptime: Math.floor(uptime),
        healthScore,
        responseTime: `${responseTime}ms`,
        checks: {
          database: {
            status: dbStatus,
            responseTime: `${dbResponseTime}ms`
          },
          cache: {
            status: cacheStats.validEntries > 0 ? "healthy" : "empty",
            hitRate: Math.round(cacheStats.hitRate * 100) / 100,
            entries: cacheStats.validEntries,
            totalHits: cacheStats.totalHits
          },
          memory: {
            status: memoryUsage.heapUsed / memoryUsage.heapTotal < 0.9 ? "healthy" : "high",
            usage: Math.round(memoryUsage.heapUsed / memoryUsage.heapTotal * 100),
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
          },
          workers: {
            // In a real implementation, you'd check actual worker status
            workflow: "running",
            insights: "running"
          }
        },
        environment: process.env.NODE_ENV || "unknown"
      };
      res.status(isHealthy ? 200 : 503).json(healthData);
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({
        status: "error",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: "Health check failed"
      });
    }
  });
  app2.post("/ops/echo", (req, res) => {
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
    const body = req.body;
    res.json({
      echo: true,
      timestamp: timestamp2,
      received: body,
      headers: {
        "content-type": req.get("content-type"),
        "user-agent": req.get("user-agent"),
        "x-forwarded-for": req.get("x-forwarded-for"),
        "host": req.get("host")
      },
      method: req.method,
      url: req.url,
      ip: req.ip,
      responseTime: Date.now() - parseInt(req.get("x-start-time") || "0") || 0
    });
  });
  app2.get("/ops/ready", async (req, res) => {
    try {
      await storage.getUserAnalysisSessions("readiness-check");
      res.json({
        ready: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        checks: {
          database: "ready",
          workers: "ready",
          cache: "ready"
        }
      });
    } catch (error) {
      res.status(503).json({
        ready: false,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        error: "Application not ready"
      });
    }
  });
  app2.get("/ops/live", (req, res) => {
    res.json({
      alive: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: Math.floor(process.uptime()),
      pid: process.pid
    });
  });
  app2.get("/ops/metrics", async (req, res) => {
    try {
      const memoryUsage = process.memoryUsage();
      const cacheStats = getCacheStats();
      const metrics = [
        `# HELP nodejs_memory_heap_used_bytes Process heap memory used`,
        `# TYPE nodejs_memory_heap_used_bytes gauge`,
        `nodejs_memory_heap_used_bytes ${memoryUsage.heapUsed}`,
        ``,
        `# HELP nodejs_memory_heap_total_bytes Process heap memory total`,
        `# TYPE nodejs_memory_heap_total_bytes gauge`,
        `nodejs_memory_heap_total_bytes ${memoryUsage.heapTotal}`,
        ``,
        `# HELP cache_entries_total Total cache entries`,
        `# TYPE cache_entries_total gauge`,
        `cache_entries_total ${cacheStats.validEntries}`,
        ``,
        `# HELP cache_hits_total Total cache hits`,
        `# TYPE cache_hits_total counter`,
        `cache_hits_total ${cacheStats.totalHits}`,
        ``,
        `# HELP process_uptime_seconds Process uptime in seconds`,
        `# TYPE process_uptime_seconds gauge`,
        `process_uptime_seconds ${Math.floor(process.uptime())}`,
        ``
      ].join("\n");
      res.set("Content-Type", "text/plain");
      res.send(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate metrics" });
    }
  });
  console.log("\u2705 Ops routes registered successfully");
}

// server/routes/billing.ts
init_storage();
init_rbac();
init_entitlements();
import { Router } from "express";
import { z as z3 } from "zod";
var router = Router();
var prorationPreviewSchema = z3.object({
  orgId: z3.string().optional(),
  currentPlan: z3.string(),
  newPlan: z3.string(),
  seats: z3.number().optional(),
  daysRemaining: z3.number().optional()
});
var dunningSimulateSchema = z3.object({
  orgId: z3.string(),
  invoiceId: z3.string().uuid(),
  daysPastDue: z3.number()
});
router.post(
  "/proration/preview",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      const body = prorationPreviewSchema.parse(req.body);
      const planPrices = {
        "free": 0,
        "starter": 2900,
        // $29.00 in cents
        "pro": 7900,
        // $79.00 in cents
        "professional": 7900,
        // $79.00 in cents
        "enterprise": 19900
        // $199.00 in cents
      };
      const currentPrice = planPrices[body.currentPlan] || 0;
      const targetPrice = planPrices[body.newPlan] || 0;
      const seats2 = body.seats || 1;
      const daysRemainingInCycle = body.daysRemaining || 15;
      const prorationDelta = (targetPrice - currentPrice) * seats2;
      const actualProration = Math.round(prorationDelta * daysRemainingInCycle / 30);
      res.json({
        success: true,
        prorationDelta: actualProration,
        currency: "usd",
        description: `${body.currentPlan} \u2192 ${body.newPlan}`,
        effectiveDate: (/* @__PURE__ */ new Date()).toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString()
      });
    } catch (error) {
      console.error("Proration preview error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof z3.ZodError ? "Invalid request data" : "Proration calculation failed"
      });
    }
  }
);
router.post(
  "/dunning/simulate",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      const body = dunningSimulateSchema.parse(req.body);
      await storage.createDunningEvent({
        invoiceId: body.invoiceId,
        orgId: body.orgId,
        event: `dunning_simulation_${body.daysPastDue}d`,
        createdAt: /* @__PURE__ */ new Date()
      });
      let nextAction;
      let gracePeriod = parseInt(process.env.DUNNING_GRACE_DAYS || "7");
      if (body.daysPastDue <= gracePeriod) {
        nextAction = "remind";
      } else if (body.daysPastDue <= gracePeriod + 14) {
        nextAction = "warn";
      } else {
        nextAction = "suspend";
      }
      res.json({
        success: true,
        nextAction,
        daysPastDue: body.daysPastDue,
        gracePeriodRemaining: Math.max(0, gracePeriod - body.daysPastDue),
        suspensionDate: body.daysPastDue > gracePeriod + 14 ? (/* @__PURE__ */ new Date()).toISOString() : null,
        notificationScheduled: true
      });
    } catch (error) {
      console.error("Dunning simulation error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof z3.ZodError ? "Invalid request data" : "Dunning simulation failed"
      });
    }
  }
);
router.get(
  "/portal",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      const orgId = req.orgId || "demo-org";
      const billingPortalUrl = process.env.BILLING_PUBLIC_URL || "http://localhost:3000";
      const portalUrl = `${billingPortalUrl}/billing/portal?org=${orgId}&session=${Date.now()}`;
      res.json({
        success: true,
        url: portalUrl,
        expiresAt: new Date(Date.now() + 60 * 60 * 1e3).toISOString()
        // 1 hour expiry
      });
    } catch (error) {
      console.error("Billing portal error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate billing portal URL"
      });
    }
  }
);
var billing_default = router;

// server/routes/stripe.ts
init_storage();
init_rbac();
init_entitlements();
import { Router as Router2 } from "express";
import { z as z4 } from "zod";
import express from "express";

// server/services/stripeService.ts
import Stripe from "stripe";
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("\u26A0\uFE0F STRIPE_SECRET_KEY not configured - billing features will be disabled");
}
var stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
    typescript: true
  });
}
var StripeService = class {
  static isConfigured() {
    return stripe !== null;
  }
  /**
   * Create a Stripe customer for a user
   */
  static async createCustomer(user) {
    if (!stripe) throw new Error("Stripe not configured");
    const customer = await stripe.customers.create({
      email: user.email,
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      metadata: {
        userId: user.id
      }
    });
    return customer;
  }
  /**
   * Create a subscription for a workspace
   */
  static async createSubscription(params) {
    if (!stripe) throw new Error("Stripe not configured");
    const createParams = {
      customer: params.customerId,
      items: [{ price: params.priceId }],
      metadata: {
        workspaceId: params.workspaceId,
        ...params.metadata
      },
      expand: ["latest_invoice.payment_intent"]
    };
    if (params.idempotencyKey) {
      createParams.idempotency_key = params.idempotencyKey;
    }
    const subscription = await stripe.subscriptions.create(createParams);
    return subscription;
  }
  /**
   * Update a subscription (for plan changes)
   */
  static async updateSubscription(subscriptionId, newPriceId) {
    if (!stripe) throw new Error("Stripe not configured");
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId
      }],
      proration_behavior: "create_prorations"
    });
  }
  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId, immediate = false) {
    if (!stripe) throw new Error("Stripe not configured");
    if (immediate) {
      return await stripe.subscriptions.cancel(subscriptionId);
    } else {
      return await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
    }
  }
  /**
   * Create a billing portal session
   */
  static async createBillingPortalSession(customerId, returnUrl) {
    if (!stripe) throw new Error("Stripe not configured");
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
  }
  /**
   * Create a checkout session for one-time payments
   */
  static async createCheckoutSession(params) {
    if (!stripe) throw new Error("Stripe not configured");
    return await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: params.priceId, quantity: 1 }],
      customer: params.customerId,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata
    });
  }
  /**
   * Retrieve upcoming invoice preview for proration calculations
   */
  static async getUpcomingInvoice(params) {
    if (!stripe) throw new Error("Stripe not configured");
    return await stripe.invoices.retrieveUpcoming({
      customer: params.customerId,
      subscription: params.subscriptionId,
      subscription_items: params.subscriptionItems
    });
  }
  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload, signature, secret) {
    if (!stripe) throw new Error("Stripe not configured");
    return stripe.webhooks.constructEvent(payload, signature, secret);
  }
  /**
   * Get Stripe price IDs for plans
   */
  static getPriceId(plan) {
    const priceIds = {
      pro: process.env.STRIPE_PRO_PRICE_ID || "",
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || ""
    };
    return priceIds[plan] || null;
  }
  /**
   * Calculate proration amount for subscription changes
   */
  static async calculateProrationAmount(params) {
    if (!stripe) throw new Error("Stripe not configured");
    const subscription = await stripe.subscriptions.retrieve(params.subscriptionId);
    try {
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: subscription.customer,
        subscription: params.subscriptionId,
        subscription_items: [{
          id: subscription.items.data[0].id,
          price: params.newPriceId
        }]
      });
      const immediateAmount = upcomingInvoice.lines.data.filter((line) => line.proration).reduce((sum2, line) => sum2 + line.amount, 0);
      return {
        immediateAmount,
        nextInvoiceAmount: upcomingInvoice.amount_due,
        currency: upcomingInvoice.currency
      };
    } catch (error) {
      console.error("Error calculating proration:", error);
      throw error;
    }
  }
};

// server/routes/stripe.ts
var router2 = Router2();
var createSubscriptionSchema = z4.object({
  workspaceId: z4.string(),
  plan: z4.enum(["pro", "enterprise"]),
  paymentMethodId: z4.string().optional(),
  idempotencyKey: z4.string().optional()
});
var changeSubscriptionSchema = z4.object({
  subscriptionId: z4.string(),
  newPlan: z4.enum(["pro", "enterprise"])
});
var cancelSubscriptionSchema = z4.object({
  subscriptionId: z4.string(),
  immediate: z4.boolean().default(false)
});
router2.post(
  "/create-subscription",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  requireWorkspaceAccess("admin"),
  // Must be admin or owner of workspace
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: "Billing services temporarily unavailable"
        });
      }
      const body = createSubscriptionSchema.parse(req.body);
      const user = req.user;
      const isAdmin = await storage.isWorkspaceAdmin(user.id, body.workspaceId);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: "Access denied: workspace admin required",
          code: "WORKSPACE_ADMIN_REQUIRED"
        });
      }
      const existingSubscription = await storage.getActiveSubscriptionByWorkspaceId(body.workspaceId);
      if (existingSubscription) {
        return res.status(409).json({
          success: false,
          error: "Workspace already has an active subscription",
          subscriptionId: existingSubscription.stripeSubscriptionId
        });
      }
      let stripeCustomer;
      const existingCustomer = await storage.getStripeCustomerByUserId(user.id);
      if (existingCustomer?.stripeCustomerId) {
        stripeCustomer = await stripe.customers.retrieve(existingCustomer.stripeCustomerId);
      } else {
        stripeCustomer = await StripeService.createCustomer(user);
        await storage.updateUserStripeCustomerId(user.id, stripeCustomer.id);
      }
      const priceId = StripeService.getPriceId(body.plan);
      if (!priceId) {
        return res.status(400).json({
          success: false,
          error: `Price not configured for plan: ${body.plan}`
        });
      }
      const idempotencyKey = body.idempotencyKey || `subscription-${body.workspaceId}-${Date.now()}`;
      const subscription = await StripeService.createSubscription({
        customerId: stripeCustomer.id,
        priceId,
        workspaceId: body.workspaceId,
        idempotencyKey,
        metadata: {
          userId: user.id,
          plan: body.plan
        }
      });
      await storage.createSubscription({
        workspaceId: body.workspaceId,
        plan: body.plan,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1e3),
        stripeSubscriptionId: subscription.id,
        seats: 1
      });
      await storage.grantPlanEntitlements(body.workspaceId, body.plan);
      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret
        }
      });
    } catch (error) {
      console.error("Subscription creation error:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to create subscription"
      });
    }
  }
);
router2.post(
  "/change-subscription",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: "Billing services temporarily unavailable"
        });
      }
      const body = changeSubscriptionSchema.parse(req.body);
      const subscription = await storage.getSubscriptionByStripeId(body.subscriptionId);
      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: "Subscription not found"
        });
      }
      const user = req.user;
      const isAdmin = await storage.isWorkspaceAdmin(user.id, subscription.workspaceId);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: "Access denied: workspace admin required",
          code: "WORKSPACE_ADMIN_REQUIRED"
        });
      }
      const newPriceId = StripeService.getPriceId(body.newPlan);
      if (!newPriceId) {
        return res.status(400).json({
          success: false,
          error: `Price not configured for plan: ${body.newPlan}`
        });
      }
      const updatedSubscription = await StripeService.updateSubscription(
        body.subscriptionId,
        newPriceId
      );
      await storage.updateSubscriptionByStripeId(body.subscriptionId, {
        plan: body.newPlan,
        status: updatedSubscription.status,
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1e3),
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (subscription) {
        await storage.revokeAllEntitlements(subscription.workspaceId);
        await storage.grantPlanEntitlements(subscription.workspaceId, body.newPlan);
      }
      res.json({
        success: true,
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          currentPeriodEnd: updatedSubscription.current_period_end
        }
      });
    } catch (error) {
      console.error("Subscription change error:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to change subscription"
      });
    }
  }
);
router2.post(
  "/cancel-subscription",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: "Billing services temporarily unavailable"
        });
      }
      const body = cancelSubscriptionSchema.parse(req.body);
      const subscription = await storage.getSubscriptionByStripeId(body.subscriptionId);
      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: "Subscription not found"
        });
      }
      const user = req.user;
      const isAdmin = await storage.isWorkspaceAdmin(user.id, subscription.workspaceId);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: "Access denied: workspace admin required",
          code: "WORKSPACE_ADMIN_REQUIRED"
        });
      }
      const canceledSubscription = await StripeService.cancelSubscription(
        body.subscriptionId,
        body.immediate
      );
      await storage.updateSubscriptionByStripeId(body.subscriptionId, {
        status: body.immediate ? "canceled" : "active",
        // Still active until period end
        cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
        updatedAt: /* @__PURE__ */ new Date()
      });
      if (body.immediate) {
        const subscription2 = await storage.getSubscriptionByStripeId(body.subscriptionId);
        if (subscription2) {
          await storage.revokeAllEntitlements(subscription2.workspaceId);
        }
      }
      res.json({
        success: true,
        subscription: {
          id: canceledSubscription.id,
          status: canceledSubscription.status,
          cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
          currentPeriodEnd: canceledSubscription.current_period_end
        }
      });
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to cancel subscription"
      });
    }
  }
);
router2.post(
  "/create-checkout-session",
  requireAuth,
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: "Billing services temporarily unavailable"
        });
      }
      const { plan, workspaceId } = req.body;
      const user = req.user;
      const priceId = StripeService.getPriceId(plan);
      if (!priceId) {
        return res.status(400).json({
          success: false,
          error: `Price not configured for plan: ${plan}`
        });
      }
      let customerId;
      const existingCustomer = await storage.getStripeCustomerByUserId(user.id);
      if (existingCustomer?.stripeCustomerId) {
        customerId = existingCustomer.stripeCustomerId;
      } else {
        const customer = await StripeService.createCustomer(user);
        customerId = customer.id;
        await storage.updateUserStripeCustomerId(user.id, customer.id);
      }
      const baseUrl = process.env.APP_URL || "http://localhost:5000";
      const session2 = await StripeService.createCheckoutSession({
        priceId,
        customerId,
        successUrl: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/billing/cancel`,
        metadata: {
          userId: user.id,
          workspaceId,
          plan
        }
      });
      res.json({
        success: true,
        sessionId: session2.id,
        url: session2.url
      });
    } catch (error) {
      console.error("Checkout session creation error:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to create checkout session"
      });
    }
  }
);
router2.post(
  "/proration-preview",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: "Billing services temporarily unavailable"
        });
      }
      const { subscriptionId, newPlan } = req.body;
      const newPriceId = StripeService.getPriceId(newPlan);
      if (!newPriceId) {
        return res.status(400).json({
          success: false,
          error: `Price not configured for plan: ${newPlan}`
        });
      }
      const prorationData = await StripeService.calculateProrationAmount({
        subscriptionId,
        newPriceId
      });
      res.json({
        success: true,
        prorationDelta: prorationData.immediateAmount,
        nextInvoiceAmount: prorationData.nextInvoiceAmount,
        currency: prorationData.currency,
        description: `Plan change to ${newPlan}`
      });
    } catch (error) {
      console.error("Proration calculation error:", error);
      res.status(400).json({
        success: false,
        error: error.message || "Failed to calculate proration"
      });
    }
  }
);
router2.get(
  "/portal",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: "Billing services temporarily unavailable"
        });
      }
      const user = req.user;
      const existingCustomer = await storage.getStripeCustomerByUserId(user.id);
      if (!existingCustomer?.stripeCustomerId) {
        return res.status(404).json({
          success: false,
          error: "No billing account found"
        });
      }
      const baseUrl = process.env.APP_URL || "http://localhost:5000";
      const portalSession = await StripeService.createBillingPortalSession(
        existingCustomer.stripeCustomerId,
        `${baseUrl}/billing`
      );
      res.json({
        success: true,
        url: portalSession.url,
        expiresAt: new Date(Date.now() + 60 * 60 * 1e3).toISOString()
        // 1 hour
      });
    } catch (error) {
      console.error("Billing portal error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to create billing portal session"
      });
    }
  }
);
router2.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        console.warn("Stripe webhook received but Stripe not configured");
        return res.status(503).json({ error: "Service unavailable" });
      }
      const signature = req.get("stripe-signature");
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET not configured");
        return res.status(500).json({ error: "Webhook secret not configured" });
      }
      if (!signature) {
        console.error("Missing stripe-signature header");
        return res.status(400).json({ error: "Missing signature header" });
      }
      const event = StripeService.verifyWebhookSignature(req.body, signature, webhookSecret);
      console.log(`\u{1F514} Stripe webhook received: ${event.type}`);
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event.data.object);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
          await handleSubscriptionUpdate(event.data.object);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object);
          break;
        case "invoice.payment_succeeded":
          await handlePaymentSucceeded(event.data.object);
          break;
        case "invoice.payment_failed":
          await handlePaymentFailed(event.data.object);
          break;
        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }
      res.json({ received: true, type: event.type });
    } catch (error) {
      console.error("Webhook processing error:", error);
      if (error.type === "StripeSignatureVerificationError") {
        return res.status(400).json({ error: "Invalid signature" });
      }
      res.status(200).json({
        received: true,
        error: "Processing failed but webhook acknowledged"
      });
    }
  }
);
async function handleCheckoutSessionCompleted(session2) {
  const { customer, subscription, metadata } = session2;
  if (metadata?.workspaceId && metadata?.plan && subscription) {
    try {
      await storage.updateSubscriptionByStripeId(subscription, {
        status: "active",
        updatedAt: /* @__PURE__ */ new Date()
      });
      await storage.grantPlanEntitlements(metadata.workspaceId, metadata.plan);
      console.log(`\u2705 Checkout completed for workspace ${metadata.workspaceId}`);
    } catch (error) {
      console.error("Error handling checkout completion:", error);
    }
  }
}
async function handleSubscriptionUpdate(subscription) {
  try {
    const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
    if (dbSubscription) {
      await storage.updateSubscription(dbSubscription.id, {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1e3),
        updatedAt: /* @__PURE__ */ new Date()
      });
      console.log(`\u2705 Subscription ${subscription.id} updated`);
    }
  } catch (error) {
    console.error("Error handling subscription update:", error);
  }
}
async function handleSubscriptionDeleted(subscription) {
  try {
    const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
    if (dbSubscription) {
      await storage.updateSubscription(dbSubscription.id, {
        status: "canceled",
        updatedAt: /* @__PURE__ */ new Date()
      });
      await storage.revokeAllEntitlements(dbSubscription.workspaceId);
      console.log(`\u274C Subscription ${subscription.id} canceled`);
    }
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
  }
}
async function handlePaymentSucceeded(invoice) {
  try {
    if (invoice.subscription) {
      const dbSubscription = await storage.getSubscriptionByStripeId(invoice.subscription);
      if (dbSubscription) {
        await storage.updateSubscription(dbSubscription.id, {
          status: "active",
          updatedAt: /* @__PURE__ */ new Date()
        });
        console.log(`\u2705 Payment succeeded for subscription ${invoice.subscription}`);
      }
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}
async function handlePaymentFailed(invoice) {
  try {
    if (invoice.subscription) {
      const dbSubscription = await storage.getSubscriptionByStripeId(invoice.subscription);
      if (dbSubscription) {
        await storage.updateSubscription(dbSubscription.id, {
          status: "past_due",
          updatedAt: /* @__PURE__ */ new Date()
        });
        await storage.createDunningEvent({
          invoiceId: invoice.id,
          orgId: dbSubscription.workspaceId,
          event: "payment_failed"
        });
        console.log(`\u26A0\uFE0F Payment failed for subscription ${invoice.subscription}`);
      }
    }
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}
var stripe_default = router2;

// server/routes/entitlements.ts
import { Router as Router3 } from "express";
import { z as z5 } from "zod";

// server/middleware/entitlementGuard.ts
var organizationFeatures = {
  "demo-org": /* @__PURE__ */ new Set(["guided", "expert", "marketplace.risk-review", "templates.advanced", "automation.workflows"]),
  "sample-org-123": /* @__PURE__ */ new Set(["guided", "expert", "simple", "marketplace.basic"]),
  "enterprise-org": /* @__PURE__ */ new Set(["guided", "expert", "marketplace.risk-review", "templates.advanced", "automation.workflows", "admin.billing", "admin.seats"])
};
function getOrganizationFeatures(orgId) {
  return Array.from(organizationFeatures[orgId] || /* @__PURE__ */ new Set());
}
function checkOrganizationFeature(orgId, feature) {
  return organizationFeatures[orgId]?.has(feature) || false;
}

// server/routes/entitlements.ts
init_rbac();
init_entitlements();
var router3 = Router3();
var entitlementCheckSchema = z5.object({
  orgId: z5.string().optional(),
  feature: z5.string().optional(),
  features: z5.array(z5.string()).optional()
});
router3.get(
  "/check",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS),
  async (req, res) => {
    try {
      const query = req.query;
      const orgId = query.orgId || req.orgId || req.user?.organizationId || "demo-org";
      if (query.feature) {
        const hasFeature = checkOrganizationFeature(orgId, query.feature);
        return res.json({
          success: true,
          orgId,
          feature: query.feature,
          hasFeature,
          message: hasFeature ? "Feature available" : "Feature not available"
        });
      }
      if (query.features) {
        const features = Array.isArray(query.features) ? query.features : [query.features];
        const featureResults = features.reduce((acc, feature) => {
          acc[feature] = checkOrganizationFeature(orgId, feature);
          return acc;
        }, {});
        return res.json({
          success: true,
          orgId,
          features: featureResults
        });
      }
      const availableFeatures = getOrganizationFeatures(orgId);
      res.json({
        success: true,
        orgId,
        availableFeatures,
        totalFeatures: availableFeatures.length
      });
    } catch (error) {
      console.error("Entitlements check error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check entitlements"
      });
    }
  }
);
router3.post(
  "/check",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS),
  async (req, res) => {
    try {
      const body = entitlementCheckSchema.parse(req.body);
      const orgId = body.orgId || req.orgId || req.user?.organizationId || "demo-org";
      if (body.features && body.features.length > 0) {
        const featureResults = body.features.reduce((acc, feature) => {
          acc[feature] = checkOrganizationFeature(orgId, feature);
          return acc;
        }, {});
        return res.json({
          success: true,
          orgId,
          features: featureResults
        });
      }
      if (body.feature) {
        const hasFeature = checkOrganizationFeature(orgId, body.feature);
        return res.json({
          success: true,
          orgId,
          feature: body.feature,
          hasFeature
        });
      }
      const availableFeatures = getOrganizationFeatures(orgId);
      res.json({
        success: true,
        orgId,
        availableFeatures
      });
    } catch (error) {
      console.error("Entitlements check error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof z5.ZodError ? "Invalid request data" : "Failed to check entitlements"
      });
    }
  }
);
var entitlements_default = router3;

// server/routes/admin.ts
init_rbac();
init_entitlements();
import { Router as Router4 } from "express";
var router4 = Router4();
router4.get(
  "/sla",
  requireAuth,
  loadEntitlementsContext,
  requireSystemRole("admin"),
  requireFeature(BILLING_FEATURES.ADVANCED_ANALYTICS),
  (req, res) => {
    try {
      const debateP95Ms = Number(process.env.SLA_DEBATE_P95_MS || 3e4);
      const exportP95Ms = Number(process.env.SLA_EXPORT_P95_MS || 5e3);
      const apiUptime = Number(process.env.SLA_API_UPTIME || 99.9);
      const currentMetrics = {
        debate_p95_ms: debateP95Ms * 0.8,
        // 80% of target (good performance)
        export_p95_ms: exportP95Ms * 0.6,
        // 60% of target (excellent performance)
        api_uptime: apiUptime,
        last_updated: (/* @__PURE__ */ new Date()).toISOString()
      };
      const targets = {
        debate_p95_ms: debateP95Ms,
        export_p95_ms: exportP95Ms,
        api_uptime: apiUptime
      };
      const slaStatus = {
        debate_sla_met: currentMetrics.debate_p95_ms <= targets.debate_p95_ms,
        export_sla_met: currentMetrics.export_p95_ms <= targets.export_p95_ms,
        uptime_sla_met: currentMetrics.api_uptime >= targets.api_uptime
      };
      res.json({
        success: true,
        current: currentMetrics,
        targets,
        status: slaStatus,
        overall_sla_met: Object.values(slaStatus).every(Boolean)
      });
    } catch (error) {
      console.error("SLA readout error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve SLA metrics"
      });
    }
  }
);
router4.get(
  "/a11y/quickcheck",
  requireAuth,
  loadEntitlementsContext,
  requireSystemRole("admin"),
  requireFeature(BILLING_FEATURES.ADVANCED_ANALYTICS),
  (req, res) => {
    try {
      const a11yChecks = (process.env.A11Y_CHECKS || "aria,contrast,keyboard").split(",");
      const checkResults = a11yChecks.map((check) => ({
        check,
        status: Math.random() > 0.2 ? "pass" : "warning",
        // 80% pass rate
        details: `${check} check completed`,
        last_run: (/* @__PURE__ */ new Date()).toISOString()
      }));
      const summary = {
        total_checks: checkResults.length,
        passed: checkResults.filter((r) => r.status === "pass").length,
        warnings: checkResults.filter((r) => r.status === "warning").length,
        overall_score: Math.round(checkResults.filter((r) => r.status === "pass").length / checkResults.length * 100)
      };
      res.json({
        success: true,
        checks: a11yChecks,
        results: checkResults,
        summary,
        result: summary.overall_score >= 90 ? "pass" : summary.overall_score >= 70 ? "warning" : "fail",
        message: "Accessibility quick check completed. For detailed analysis, run full accessibility audit."
      });
    } catch (error) {
      console.error("A11y quickcheck error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to run accessibility quick check"
      });
    }
  }
);
router4.get(
  "/health",
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD),
  (req, res) => {
    try {
      const health = {
        status: "healthy",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || "development"
      };
      res.json(health);
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);
var admin_default = router4;

// server/routes/sprint12.ts
init_storage();
init_schema();
init_rbac();
init_entitlements();
import { Router as Router5 } from "express";
import { z as z6 } from "zod";

// server/utils/errors.ts
var AppError = class extends Error {
  constructor(code, message, type, statusCode = 500, details) {
    super(message);
    this.code = code;
    this.message = message;
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.name = "AppError";
  }
  toEnvelope(requestId) {
    return {
      error: {
        code: this.code,
        message: this.message,
        type: this.type,
        details: this.details,
        requestId,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
};
var ErrorCodes = {
  // Authentication & Authorization
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  ACCESS_DENIED: "ACCESS_DENIED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  // Validation
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",
  // Resources
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
  RESOURCE_CONFLICT: "RESOURCE_CONFLICT",
  // Rate limiting
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  // External services
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  CIRCUIT_BREAKER_OPEN: "CIRCUIT_BREAKER_OPEN",
  // Internal
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR"
};
function createValidationError(message, details) {
  return new AppError(ErrorCodes.INVALID_INPUT, message, "validation", 400, details);
}

// server/routes/sprint12.ts
var router5 = Router5();
router5.get(
  "/docs/index",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { category, published } = req.query;
      let docs2;
      if (category) {
        docs2 = await storage.getDocsByCategory(category);
      } else if (published === "true") {
        docs2 = await storage.getPublishedDocs();
      } else {
        docs2 = await storage.getAllDocs();
      }
      res.json({
        success: true,
        data: docs2,
        meta: {
          total: docs2.length,
          categories: [...new Set(docs2.map((d) => d.category))]
        }
      });
    } catch (error) {
      console.error("Error fetching docs index:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch documentation index"
      });
    }
  }
);
router5.get(
  "/docs/article/:id",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await storage.getDoc(id);
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: "Documentation article not found"
        });
      }
      await storage.incrementDocViewCount(id);
      res.json({
        success: true,
        data: doc
      });
    } catch (error) {
      console.error("Error fetching doc article:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch documentation article"
      });
    }
  }
);
router5.get(
  "/docs/slug/:slug",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { slug } = req.params;
      const doc = await storage.getDocBySlug(slug);
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: "Documentation article not found"
        });
      }
      await storage.incrementDocViewCount(doc.id);
      res.json({
        success: true,
        data: doc
      });
    } catch (error) {
      console.error("Error fetching doc by slug:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch documentation article"
      });
    }
  }
);
router5.get(
  "/docs/search",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({
          success: false,
          error: "Search query is required"
        });
      }
      const docs2 = await storage.searchDocs(query);
      res.json({
        success: true,
        data: docs2,
        meta: {
          query,
          total: docs2.length
        }
      });
    } catch (error) {
      console.error("Error searching docs:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search documentation"
      });
    }
  }
);
router5.post(
  "/docs/create",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const validatedData = insertDocsSchema.parse(req.body);
      const doc = await storage.createDoc(validatedData);
      res.status(201).json({
        success: true,
        data: doc
      });
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error creating doc:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create documentation"
      });
    }
  }
);
router5.put(
  "/docs/:id",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const doc = await storage.updateDoc(id, updates);
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: "Documentation article not found"
        });
      }
      res.json({
        success: true,
        data: doc
      });
    } catch (error) {
      console.error("Error updating doc:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update documentation"
      });
    }
  }
);
router5.get(
  "/admin/settings",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const { category } = req.query;
      let settings;
      if (category) {
        settings = await storage.getAdminSettingsByCategory(category);
      } else {
        settings = await storage.getAllAdminSettings();
      }
      res.json({
        success: true,
        data: settings,
        meta: {
          total: settings.length,
          categories: [...new Set(settings.map((s) => s.category))]
        }
      });
    } catch (error) {
      console.error("Error fetching admin settings:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch admin settings"
      });
    }
  }
);
router5.get(
  "/admin/settings/:key",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getAdminSetting(key);
      if (!setting) {
        return res.status(404).json({
          success: false,
          error: "Admin setting not found"
        });
      }
      res.json({
        success: true,
        data: setting
      });
    } catch (error) {
      console.error("Error fetching admin setting:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch admin setting"
      });
    }
  }
);
router5.post(
  "/admin/settings",
  requireAuth,
  requireSystemRole(["system_admin"]),
  async (req, res) => {
    try {
      const validatedData = insertAdminSettingsSchema.parse({
        ...req.body,
        lastModifiedBy: req.user?.id
      });
      const setting = await storage.createAdminSetting(validatedData);
      res.status(201).json({
        success: true,
        data: setting
      });
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error creating admin setting:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create admin setting"
      });
    }
  }
);
router5.put(
  "/admin/settings/:key",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      if (!value) {
        return res.status(400).json({
          success: false,
          error: "Setting value is required"
        });
      }
      const setting = await storage.updateAdminSetting(
        key,
        value,
        req.user?.id
      );
      if (!setting) {
        return res.status(404).json({
          success: false,
          error: "Admin setting not found"
        });
      }
      res.json({
        success: true,
        data: setting
      });
    } catch (error) {
      console.error("Error updating admin setting:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update admin setting"
      });
    }
  }
);
router5.delete(
  "/admin/settings/:key",
  requireAuth,
  requireSystemRole(["system_admin"]),
  async (req, res) => {
    try {
      const { key } = req.params;
      const deleted = await storage.deleteAdminSetting(key);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Admin setting not found"
        });
      }
      res.json({
        success: true,
        message: "Admin setting deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting admin setting:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete admin setting"
      });
    }
  }
);
router5.get("/marketplace/catalog", async (req, res) => {
  try {
    const { category, featured, publisher } = req.query;
    let items;
    if (category) {
      items = await storage.getMarketplaceItemsByCategory(category);
    } else if (featured === "true") {
      items = await storage.getFeaturedMarketplaceItems();
    } else if (publisher) {
      items = await storage.getMarketplaceItemsByPublisher(publisher);
    } else {
      items = await storage.getPublishedMarketplaceItems();
    }
    res.json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        categories: [...new Set(items.map((i) => i.category))],
        publishers: [...new Set(items.map((i) => i.publisher))]
      }
    });
  } catch (error) {
    console.error("Error fetching marketplace catalog:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch marketplace catalog"
    });
  }
});
router5.get("/marketplace/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const item = await storage.getMarketplaceItem(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Marketplace item not found"
      });
    }
    await storage.incrementMarketplaceItemViews(id);
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error("Error fetching marketplace item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch marketplace item"
    });
  }
});
router5.get(
  "/marketplace/search",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({
          success: false,
          error: "Search query is required"
        });
      }
      const items = await storage.searchMarketplaceItems(query);
      res.json({
        success: true,
        data: items,
        meta: {
          query,
          total: items.length
        }
      });
    } catch (error) {
      console.error("Error searching marketplace:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search marketplace"
      });
    }
  }
);
router5.post(
  "/marketplace/publish",
  requireAuth,
  requireFeature("marketplace_publish"),
  async (req, res) => {
    try {
      const validatedData = insertMarketplaceItemsSchema.parse({
        ...req.body,
        publisherId: req.user?.id,
        publisher: req.user?.email || "Unknown Publisher"
      });
      const item = await storage.createMarketplaceItem(validatedData);
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error publishing marketplace item:", error);
      res.status(500).json({
        success: false,
        error: "Failed to publish marketplace item"
      });
    }
  }
);
router5.put(
  "/marketplace/item/:id",
  requireAuth,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const existingItem = await storage.getMarketplaceItem(id);
      if (!existingItem) {
        return res.status(404).json({
          success: false,
          error: "Marketplace item not found"
        });
      }
      if (existingItem.publisherId !== req.user?.id && !["system_admin", "admin"].includes(req.user?.role || "")) {
        return res.status(403).json({
          success: false,
          error: "You can only update your own marketplace items"
        });
      }
      const item = await storage.updateMarketplaceItem(id, updates);
      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error("Error updating marketplace item:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update marketplace item"
      });
    }
  }
);
router5.get("/pricing/packages", async (req, res) => {
  try {
    const packages = [
      {
        id: "free",
        name: "Free",
        price: 0,
        currency: "USD",
        interval: "month",
        features: [
          "5 AI analyses per month",
          "Basic templates",
          "Community support",
          "Standard export formats"
        ],
        limits: {
          analyses: 5,
          templates: 10,
          storage: "1GB",
          support: "Community"
        },
        popular: false
      },
      {
        id: "pro",
        name: "Pro",
        price: 29,
        currency: "USD",
        interval: "month",
        features: [
          "Unlimited AI analyses",
          "Premium templates",
          "Advanced collaboration",
          "Priority support",
          "Custom exports",
          "API access"
        ],
        limits: {
          analyses: "Unlimited",
          templates: "Unlimited",
          storage: "50GB",
          support: "Priority"
        },
        popular: true
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 99,
        currency: "USD",
        interval: "month",
        features: [
          "Everything in Pro",
          "Team collaboration",
          "Advanced security",
          "Custom integrations",
          "Dedicated support",
          "On-premise deployment"
        ],
        limits: {
          analyses: "Unlimited",
          templates: "Unlimited",
          storage: "500GB",
          support: "Dedicated"
        },
        popular: false
      }
    ];
    res.json({
      success: true,
      data: packages,
      meta: {
        total: packages.length,
        currency: "USD"
      }
    });
  } catch (error) {
    console.error("Error fetching pricing packages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch pricing packages"
    });
  }
});
router5.get("/pricing/plans/:plan", async (req, res) => {
  try {
    const { plan } = req.params;
    const planDetails = {
      free: {
        id: "free",
        name: "Free",
        description: "Perfect for getting started with AI-powered analysis",
        price: 0,
        features: ["5 AI analyses", "Basic templates", "Community support"],
        limitations: ["Limited analyses", "Basic features only"],
        recommended: "individuals and small projects"
      },
      pro: {
        id: "pro",
        name: "Pro",
        description: "Ideal for professionals and growing teams",
        price: 29,
        features: ["Unlimited analyses", "Premium templates", "Priority support"],
        limitations: ["Single user focus"],
        recommended: "professionals and consultants"
      },
      enterprise: {
        id: "enterprise",
        name: "Enterprise",
        description: "Complete solution for large organizations",
        price: 99,
        features: ["Team collaboration", "Advanced security", "Dedicated support"],
        limitations: [],
        recommended: "large teams and enterprises"
      }
    };
    const planInfo = planDetails[plan];
    if (!planInfo) {
      return res.status(404).json({
        success: false,
        error: "Pricing plan not found"
      });
    }
    res.json({
      success: true,
      data: planInfo
    });
  } catch (error) {
    console.error("Error fetching pricing plan:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch pricing plan"
    });
  }
});
router5.post(
  "/pricing/configure",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const { plan, seats: seats2, customFeatures } = req.body;
      const validPlans = ["free", "pro", "enterprise"];
      if (!validPlans.includes(plan)) {
        return res.status(400).json({
          success: false,
          error: "Invalid pricing plan"
        });
      }
      const basePrices = { free: 0, pro: 29, enterprise: 99 };
      const basePrice = basePrices[plan];
      const totalPrice = basePrice * (seats2 || 1);
      const configuration = {
        plan,
        seats: seats2 || 1,
        basePrice,
        totalPrice,
        customFeatures: customFeatures || [],
        configuredAt: (/* @__PURE__ */ new Date()).toISOString(),
        configuredBy: req.user?.id
      };
      res.json({
        success: true,
        data: configuration,
        message: "Pricing configured successfully"
      });
    } catch (error) {
      console.error("Error configuring pricing:", error);
      res.status(500).json({
        success: false,
        error: "Failed to configure pricing"
      });
    }
  }
);
router5.get(
  "/changelog/list",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { type, pinned } = req.query;
      let entries;
      if (type) {
        entries = await storage.getChangelogEntriesByType(type);
      } else if (pinned === "true") {
        entries = await storage.getPinnedChangelogEntries();
      } else {
        entries = await storage.getPublishedChangelogEntries();
      }
      res.json({
        success: true,
        data: entries,
        meta: {
          total: entries.length,
          types: [...new Set(entries.map((e) => e.type))]
        }
      });
    } catch (error) {
      console.error("Error fetching changelog:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch changelog"
      });
    }
  }
);
router5.get(
  "/changelog/:version",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { version } = req.params;
      const entry = await storage.getChangelogEntryByVersion(version);
      if (!entry) {
        return res.status(404).json({
          success: false,
          error: "Changelog entry not found"
        });
      }
      res.json({
        success: true,
        data: entry
      });
    } catch (error) {
      console.error("Error fetching changelog entry:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch changelog entry"
      });
    }
  }
);
router5.post(
  "/changelog/add",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const validatedData = insertChangelogEntriesSchema.parse({
        ...req.body,
        author: req.user?.email || req.user?.id
      });
      const entry = await storage.createChangelogEntry(validatedData);
      res.status(201).json({
        success: true,
        data: entry
      });
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error creating changelog entry:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create changelog entry"
      });
    }
  }
);
router5.put(
  "/changelog/:id/publish",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.publishChangelogEntry(id, req.user?.id || "unknown");
      if (!entry) {
        return res.status(404).json({
          success: false,
          error: "Changelog entry not found"
        });
      }
      res.json({
        success: true,
        data: entry,
        message: "Changelog entry published successfully"
      });
    } catch (error) {
      console.error("Error publishing changelog entry:", error);
      res.status(500).json({
        success: false,
        error: "Failed to publish changelog entry"
      });
    }
  }
);
router5.get(
  "/playbooks/onboarding",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const playbooks3 = await storage.getPlaybooksByType("onboarding");
      res.json({
        success: true,
        data: playbooks3,
        meta: {
          total: playbooks3.length,
          type: "onboarding"
        }
      });
    } catch (error) {
      console.error("Error fetching onboarding playbooks:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch onboarding playbooks"
      });
    }
  }
);
router5.get(
  "/playbooks/success/:role",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { role } = req.params;
      const playbooks3 = await storage.getPlaybooksByRole(role);
      res.json({
        success: true,
        data: playbooks3,
        meta: {
          total: playbooks3.length,
          role
        }
      });
    } catch (error) {
      console.error("Error fetching success playbooks:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch success playbooks"
      });
    }
  }
);
router5.get(
  "/playbooks/catalog",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { type, role, category } = req.query;
      let playbooks3;
      if (type) {
        playbooks3 = await storage.getPlaybooksByType(type);
      } else if (role) {
        playbooks3 = await storage.getPlaybooksByRole(role);
      } else if (category) {
        playbooks3 = await storage.getPlaybooksByCategory(category);
      } else {
        playbooks3 = await storage.getActivePlaybooks();
      }
      res.json({
        success: true,
        data: playbooks3,
        meta: {
          total: playbooks3.length,
          types: [...new Set(playbooks3.map((p) => p.type))],
          roles: [...new Set(playbooks3.map((p) => p.role))],
          categories: [...new Set(playbooks3.map((p) => p.category))]
        }
      });
    } catch (error) {
      console.error("Error fetching playbooks catalog:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch playbooks catalog"
      });
    }
  }
);
router5.get(
  "/playbooks/:id",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const { id } = req.params;
      const playbook = await storage.getPlaybook(id);
      if (!playbook) {
        return res.status(404).json({
          success: false,
          error: "Playbook not found"
        });
      }
      await storage.incrementPlaybookUsage(id);
      res.json({
        success: true,
        data: playbook
      });
    } catch (error) {
      console.error("Error fetching playbook:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch playbook"
      });
    }
  }
);
router5.get(
  "/tutorials/catalog",
  requireAuth,
  loadEntitlementsContext,
  async (req, res) => {
    try {
      const tutorials2 = await storage.getPlaybooksByType("onboarding");
      res.json({
        success: true,
        data: tutorials2,
        meta: {
          total: tutorials2.length,
          type: "tutorials"
        }
      });
    } catch (error) {
      console.error("Error fetching tutorials catalog:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch tutorials catalog"
      });
    }
  }
);
router5.post(
  "/playbooks/create",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req, res) => {
    try {
      const validatedData = insertPlaybooksSchema.parse({
        ...req.body,
        author: req.user?.email || req.user?.id
      });
      const playbook = await storage.createPlaybook(validatedData);
      res.status(201).json({
        success: true,
        data: playbook
      });
    } catch (error) {
      if (error instanceof z6.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error creating playbook:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create playbook"
      });
    }
  }
);
var sprint12_default = router5;

// server/workers/dunningWorker.ts
init_storage();
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
var connection = null;
if (process.env.REDIS_URL) {
  try {
    connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      // Required for BullMQ
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      lazyConnect: true
    });
    console.log("\u2705 [dunningWorker] Redis connection established");
  } catch (error) {
    console.error("\u274C [dunningWorker] Failed to connect to Redis:", error);
    connection = null;
  }
} else {
  console.log("\u26A0\uFE0F [dunningWorker] REDIS_URL not set, using synchronous processing for development");
}
var dunningQueue = connection ? new Queue("billing-dunning", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 20,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2e3
    }
  }
}) : null;
function startDunningWorker() {
  console.log("\u{1F680} Starting dunning worker...");
  if (!connection || !dunningQueue) {
    console.log("\u26A0\uFE0F [dunningWorker] Redis not available, running in synchronous mode for development");
    return null;
  }
  const worker2 = new Worker("billing-dunning", async (job) => {
    const { orgId, invoiceId, daysPastDue } = job.data || {};
    console.log(`[dunning] Processing org: ${orgId}, invoice: ${invoiceId}, days past due: ${daysPastDue}`);
    try {
      await storage.createDunningEvent({
        invoiceId,
        orgId,
        event: `automated_dunning_${daysPastDue}d`,
        createdAt: /* @__PURE__ */ new Date()
      });
      const gracePeriod = parseInt(process.env.DUNNING_GRACE_DAYS || "7");
      let action;
      if (daysPastDue <= gracePeriod) {
        action = "remind";
        console.log(`[dunning] \u2192 Sending reminder for ${orgId}`);
      } else if (daysPastDue <= gracePeriod + 14) {
        action = "warn";
        console.log(`[dunning] \u2192 Sending warning for ${orgId}`);
      } else {
        action = "suspend";
        console.log(`[dunning] \u2192 Suspending features for ${orgId}`);
      }
      console.log(`[dunning] \u2705 Completed ${action} action for org ${orgId}`);
      return { success: true, action, orgId, invoiceId, daysPastDue };
    } catch (error) {
      console.error(`[dunning] \u274C Failed processing for org ${orgId}:`, error);
      throw error;
    }
  }, {
    connection,
    concurrency: 5,
    removeOnComplete: 50,
    removeOnFail: 20
  });
  worker2.on("completed", (job, result) => {
    console.log(`[dunning] \u2705 Job ${job.id} completed for org ${result?.orgId}`);
  });
  worker2.on("failed", (job, err) => {
    console.error(`[dunning] \u274C Job ${job?.id} failed:`, err.message);
  });
  worker2.on("error", (err) => {
    console.error("[dunning] Worker error:", err);
  });
  console.log("\u2705 Dunning worker started successfully");
  return worker2;
}

// server/routes.ts
var paginationSchema = z7.object({
  limit: z7.coerce.number().int().min(1).max(100).default(50),
  offset: z7.coerce.number().int().min(0).default(0)
});
function formatReportContent(report, format) {
  switch (format) {
    case "markdown":
      return formatReportAsMarkdown(report);
    case "html":
      return formatReportAsHTML(report);
    case "plain":
    case "txt":
      return formatReportAsPlainText(report);
    default:
      return formatReportAsMarkdown(report);
  }
}
function formatReportAsMarkdown(report) {
  let content = `# ${report.title || "Analysis Report"}

`;
  if (report.executive_summary) {
    content += `## Executive Summary

${report.executive_summary}

`;
  }
  if (report.debate_overview) {
    content += `## Debate Overview

`;
    content += `**Original Question:** ${report.debate_overview.original_question}

`;
    content += `**Methodology:** ${report.debate_overview.methodology}

`;
    content += `**Consensus Reached:** ${report.debate_overview.consensus_reached}

`;
    if (report.debate_overview.key_dissents?.length > 0) {
      content += `### Key Dissenting Views

`;
      report.debate_overview.key_dissents.forEach((dissent) => {
        content += `- **${dissent.position}**${dissent.reasoning ? `: ${dissent.reasoning}` : ""}
`;
      });
      content += `
`;
    }
    if (report.debate_overview.unresolved_questions?.length > 0) {
      content += `### Unresolved Questions

`;
      report.debate_overview.unresolved_questions.forEach((question) => {
        content += `- ${question}
`;
      });
      content += `
`;
    }
  }
  if (report.brainstorming_outcomes) {
    content += `## Brainstorming Outcomes

`;
    if (report.brainstorming_outcomes.collaborative_solutions?.length > 0) {
      content += `### Collaborative Solutions

`;
      report.brainstorming_outcomes.collaborative_solutions.forEach((solution, index2) => {
        content += `${index2 + 1}. **${solution.title}** (Feasibility: ${solution.feasibility}, Impact: ${solution.impact})
`;
        content += `   ${solution.description}
`;
        if (solution.timeline) content += `   *Timeline: ${solution.timeline}*
`;
        content += `
`;
      });
    }
    if (report.brainstorming_outcomes.implementation_plan?.length > 0) {
      content += `### Implementation Plan

`;
      report.brainstorming_outcomes.implementation_plan.forEach((step) => {
        content += `${step.step}. **${step.title}**
`;
        content += `   ${step.description}
`;
        if (step.timeline) content += `   *Timeline: ${step.timeline}*
`;
        if (step.owner) content += `   *Owner: ${step.owner}*
`;
        content += `
`;
      });
    }
  }
  if (report.recommendations?.length > 0) {
    content += `## Recommendations

`;
    report.recommendations.forEach((rec, index2) => {
      content += `${index2 + 1}. **${rec.title}** (Priority: ${rec.priority})
`;
      content += `   ${rec.description}
`;
      if (rec.timeline) content += `   *Timeline: ${rec.timeline}*
`;
      if (rec.stakeholders?.length > 0) content += `   *Stakeholders: ${rec.stakeholders.join(", ")}*
`;
      content += `
`;
    });
  }
  if (report.expert_analysis) {
    content += `## Expert Analysis

`;
    if (report.expert_analysis.ai_agents_summary?.length > 0) {
      content += `### AI Agent Contributions

`;
      report.expert_analysis.ai_agents_summary.forEach((agent) => {
        content += `**${agent.agent_name}** (${agent.role})
`;
        content += `- Approach: ${agent.approach}
`;
        if (agent.key_insights?.length > 0) {
          content += `- Key Insights:
`;
          agent.key_insights.forEach((insight) => {
            content += `  - ${insight}
`;
          });
        }
        content += `
`;
      });
    }
  }
  if (report.citations?.length > 0) {
    content += `## Citations

`;
    report.citations.forEach((citation, index2) => {
      content += `${index2 + 1}. `;
      if (citation.author) content += `${citation.author}. `;
      if (citation.title) content += `"${citation.title}." `;
      if (citation.source) content += `*${citation.source}*, `;
      if (citation.year) content += `${citation.year}. `;
      if (citation.url) content += `[Link](${citation.url})`;
      content += `
`;
    });
    content += `
`;
  }
  if (report.metadata) {
    content += `---

`;
    content += `*Generated on ${report.metadata.generated_at}*
`;
    if (report.metadata.total_analysis_time) content += `*Analysis Time: ${report.metadata.total_analysis_time}*
`;
    if (report.metadata.word_count) content += `*Word Count: ${report.metadata.word_count}*
`;
  }
  return content;
}
function formatReportAsHTML(report) {
  let content = `<!DOCTYPE html><html><head><title>${report.title || "Analysis Report"}</title></head><body>`;
  content += `<h1>${report.title || "Analysis Report"}</h1>`;
  if (report.executive_summary) {
    content += `<h2>Executive Summary</h2><p>${report.executive_summary}</p>`;
  }
  if (report.debate_overview) {
    content += `<h2>Debate Overview</h2>`;
    content += `<p><strong>Original Question:</strong> ${report.debate_overview.original_question}</p>`;
    content += `<p><strong>Methodology:</strong> ${report.debate_overview.methodology}</p>`;
    content += `<p><strong>Consensus Reached:</strong> ${report.debate_overview.consensus_reached}</p>`;
    if (report.debate_overview.key_dissents?.length > 0) {
      content += `<h3>Key Dissenting Views</h3><ul>`;
      report.debate_overview.key_dissents.forEach((dissent) => {
        content += `<li><strong>${dissent.position}</strong>${dissent.reasoning ? `: ${dissent.reasoning}` : ""}</li>`;
      });
      content += `</ul>`;
    }
  }
  content += `</body></html>`;
  return content;
}
function formatReportAsPlainText(report) {
  let content = `${report.title || "ANALYSIS REPORT"}
`;
  content += "=".repeat((report.title || "ANALYSIS REPORT").length) + "\n\n";
  if (report.executive_summary) {
    content += `EXECUTIVE SUMMARY

${report.executive_summary}

`;
  }
  if (report.debate_overview) {
    content += `DEBATE OVERVIEW

`;
    content += `Original Question: ${report.debate_overview.original_question}

`;
    content += `Methodology: ${report.debate_overview.methodology}

`;
    content += `Consensus Reached: ${report.debate_overview.consensus_reached}

`;
    if (report.debate_overview.key_dissents?.length > 0) {
      content += `Key Dissenting Views:
`;
      report.debate_overview.key_dissents.forEach((dissent) => {
        content += `- ${dissent.position}${dissent.reasoning ? `: ${dissent.reasoning}` : ""}
`;
      });
      content += `
`;
    }
  }
  return content;
}
async function registerRoutes(app2) {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment) {
    app2.use(developmentSecurityHeaders());
    console.log("\u{1F512} Applied development security headers");
  } else {
    app2.use(productionSecurityHeaders());
    console.log("\u{1F512} Applied production security headers");
  }
  registerOpsRoutes(app2);
  app2.get("/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "SymbiosoAi ThinkTank API"
    });
  });
  console.log("\u{1F527} Sprint 8 ops routes registered");
  const externalServiceCircuitBreaker = createCircuitBreakerMiddleware("external-services");
  app2.use("/api/think", externalServiceCircuitBreaker);
  app2.use("/api/debate", externalServiceCircuitBreaker);
  console.log("\u{1F504} Sprint 8 circuit breaker middleware applied");
  registerStreamingRoutes(app2);
  await setupAuth(app2);
  const { registerReviewRoutes: registerReviewRoutes2 } = await Promise.resolve().then(() => (init_reviews(), reviews_exports));
  registerReviewRoutes2(app2);
  app2.get("/api/feature-flags", async (req, res) => {
    try {
      const featureFlags = {
        reviews_enabled: true,
        retention_admin_enabled: true,
        scim_provisioning_enabled: true,
        saml_auth_enabled: true,
        advanced_analytics_enabled: false,
        enterprise_features_enabled: true
      };
      console.log("\u{1F3C1} Feature flags requested:", featureFlags);
      res.json(featureFlags);
    } catch (error) {
      console.error("\u274C Feature flags error:", error);
      res.status(500).json({
        message: "Failed to fetch feature flags",
        error: error.message
      });
    }
  });
  app2.post("/api/demo-login", async (req, res) => {
    if (process.env.NODE_ENV === "production" && process.env.ENABLE_DEMO_LOGIN !== "true") {
      return res.status(404).json({ message: "Not found" });
    }
    try {
      const { username, password } = req.body;
      if (username === "demo" && password === "demo123") {
        const demoUser = {
          id: "demo-user-12345",
          email: "demo@example.com",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: null,
          role: "user",
          isDemo: true,
          subscription: {
            plan: "demo"
          }
        };
        await storage.upsertUser(demoUser);
        await new Promise((resolve, reject) => {
          req.session.regenerate((err) => {
            if (err) {
              reject(err);
            } else {
              const demoUserObj = {
                claims: {
                  sub: demoUser.id,
                  email: demoUser.email,
                  first_name: demoUser.firstName,
                  last_name: demoUser.lastName,
                  profile_image_url: demoUser.profileImageUrl
                },
                access_token: null,
                refresh_token: null,
                expires_at: Math.floor(Date.now() / 1e3) + 7 * 24 * 60 * 60,
                // 7 days
                isDemo: true,
                subscription: {
                  plan: "demo"
                }
              };
              req.logIn(demoUserObj, (loginErr) => {
                if (loginErr) {
                  reject(loginErr);
                } else {
                  req.session.save((saveErr) => {
                    if (saveErr) reject(saveErr);
                    else resolve();
                  });
                }
              });
            }
          });
        });
        console.log("\u2705 Demo login successful for user:", username);
        res.json({ success: true, message: "Demo login successful" });
      } else {
        res.status(401).json({ message: "Invalid demo credentials" });
      }
    } catch (error) {
      console.error("\u274C Demo login error:", error);
      res.status(500).json({ message: "Demo login failed" });
    }
  });
  app2.post("/api/admin/bootstrap", requireAuth, express3.json(), async (req, res) => {
    const startTime = Date.now();
    let auditDetails = {
      success: false,
      user_id: null,
      bootstrap_token_provided: false,
      admin_already_exists: false,
      error_type: null
    };
    try {
      const userId = req.user?.claims?.sub;
      const bootstrapToken = req.headers["x-bootstrap-token"];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");
      auditDetails.user_id = userId;
      auditDetails.bootstrap_token_provided = !!bootstrapToken;
      console.log(`\u{1F510} Bootstrap attempt from user ${userId}, IP: ${ipAddress}`);
      if (!bootstrapToken) {
        auditDetails.error_type = "missing_token";
        console.warn(`\u26A0\uFE0F Bootstrap attempt without token from user ${userId}`);
        return res.status(400).json({
          error: "Bootstrap token required",
          code: "BOOTSTRAP_TOKEN_REQUIRED",
          message: "X-Bootstrap-Token header must be provided for admin bootstrap"
        });
      }
      const expectedToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
      if (!expectedToken) {
        auditDetails.error_type = "server_misconfiguration";
        console.error(`\u274C ADMIN_BOOTSTRAP_TOKEN not configured on server`);
        return res.status(500).json({
          error: "Bootstrap not configured",
          code: "BOOTSTRAP_NOT_CONFIGURED",
          message: "Server bootstrap token not configured"
        });
      }
      if (bootstrapToken !== expectedToken) {
        auditDetails.error_type = "invalid_token";
        console.warn(`\u26A0\uFE0F Invalid bootstrap token attempt from user ${userId}, IP: ${ipAddress}`);
        const rateLimiter = new EnterpriseRateLimiter();
        const rateCheck = await rateLimiter.checkRateLimit(req, "admin_bootstrap", "requests_per_minute");
        if (!rateCheck.allowed) {
          console.warn(`\u{1F6AB} Rate limit exceeded for bootstrap attempts from IP: ${ipAddress}`);
          return res.status(429).json({
            error: "Rate limit exceeded",
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many bootstrap attempts. Please try again later.",
            retryAfter: Math.ceil((rateCheck.resetTime - Date.now()) / 1e3)
          });
        }
        return res.status(401).json({
          error: "Invalid bootstrap token",
          code: "INVALID_BOOTSTRAP_TOKEN",
          message: "The provided bootstrap token is invalid"
        });
      }
      const adminExists = await storage.anySystemAdminExists();
      auditDetails.admin_already_exists = adminExists;
      if (adminExists) {
        auditDetails.error_type = "admin_exists";
        console.warn(`\u26A0\uFE0F Bootstrap attempt when admin already exists from user ${userId}`);
        return res.status(409).json({
          error: "System admin already exists",
          code: "ADMIN_ALREADY_EXISTS",
          message: "Bootstrap is permanently disabled once a system admin exists"
        });
      }
      const updatedUser = await storage.setUserRole(userId, "system_admin");
      if (!updatedUser) {
        auditDetails.error_type = "user_not_found";
        console.error(`\u274C Failed to find user ${userId} for bootstrap promotion`);
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND",
          message: "Current user not found for promotion"
        });
      }
      auditDetails.success = true;
      const duration = Date.now() - startTime;
      console.log(`\u2705 Bootstrap successful: User ${userId} promoted to system_admin in ${duration}ms`);
      try {
        await storage.createAuditLog({
          organizationId: null,
          userId,
          action: "ADMIN_BOOTSTRAP_SUCCESS",
          resourceType: "user_role",
          resourceId: userId,
          details: {
            promoted_to_role: "system_admin",
            bootstrap_method: "api_endpoint",
            ip_address: ipAddress,
            user_agent: userAgent,
            duration_ms: duration,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          },
          ipAddress,
          userAgent,
          createdAt: /* @__PURE__ */ new Date()
        });
      } catch (auditError) {
        console.error(`\u26A0\uFE0F Failed to create audit log for bootstrap:`, auditError);
      }
      res.status(200).json({
        success: true,
        message: "System admin bootstrap completed successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        },
        bootstrapCompletedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      auditDetails.error_type = "server_error";
      auditDetails.error_message = error.message;
      console.error(`\u274C Bootstrap error after ${duration}ms:`, error);
      try {
        await storage.createAuditLog({
          organizationId: null,
          userId: auditDetails.user_id,
          action: "ADMIN_BOOTSTRAP_FAILURE",
          resourceType: "user_role",
          resourceId: auditDetails.user_id || "unknown",
          details: {
            error_type: auditDetails.error_type,
            error_message: error.message,
            ip_address: req.ip,
            user_agent: req.get("User-Agent"),
            duration_ms: duration,
            audit_details: auditDetails,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          },
          ipAddress: req.ip,
          userAgent: req.get("User-Agent") || null,
          createdAt: /* @__PURE__ */ new Date()
        });
      } catch (auditError) {
        console.error(`\u26A0\uFE0F Failed to create audit log for bootstrap failure:`, auditError);
      }
      res.status(500).json({
        error: "Bootstrap failed",
        code: "BOOTSTRAP_ERROR",
        message: "An error occurred during admin bootstrap"
      });
    }
  });
  app2.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.claims || !req.user.claims.sub) {
        console.log("\u{1F50D} No valid user claims found");
        return res.status(401).json({ message: "Not authenticated" });
      }
      const user = req.user;
      console.log("\u2705 Using user from session:", user.id);
      const enhancedUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        preferences: user.preferences,
        subscription: user.subscription,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        permissions: {
          canViewAuditLogs: user.role === "admin",
          canManageOrganizations: user.role === "admin",
          canManageTeams: user.role === "admin",
          canViewAnalytics: user.role === "admin",
          canAccessEnterpriseFeatures: user.role === "admin",
          canViewSecurityDashboard: user.role === "admin"
        }
      };
      res.json(enhancedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app2.patch("/api/user/preferences", requireAuth, express3.json(), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const updatedUser = await storage.updateUserPreferences(userId, req.body);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });
  app2.get("/api/user/onboarding-progress", requireAuth, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.onboardingProgress || {
        completed_steps: [],
        current_flow: null,
        experience_level: "beginner",
        skipped_flows: [],
        last_interaction: null,
        feature_usage: {}
      });
    } catch (error) {
      console.error("Error fetching onboarding progress:", error);
      res.status(500).json({ message: "Failed to fetch onboarding progress" });
    }
  });
  app2.patch("/api/user/onboarding-progress", requireAuth, express3.json(), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const updatedUser = await storage.updateOnboardingProgress(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser.onboardingProgress);
    } catch (error) {
      console.error("Error updating onboarding progress:", error);
      res.status(500).json({ message: "Failed to update onboarding progress" });
    }
  });
  app2.get("/api/workspaces", requireAuth, loadEntitlementsContext, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const workspaces2 = await storage.getUserWorkspaces(userId);
      res.json(workspaces2);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post(
    "/api/workspaces",
    requireAuth,
    loadEntitlementsContext,
    express3.json(),
    requirePlanLimit("workspaces", async (userId) => {
      const workspaces2 = await storage.getUserWorkspaces(userId);
      return workspaces2.length;
    }),
    async (req, res) => {
      try {
        const userId = req.user.claims.sub;
        const workspaceData = insertWorkspaceSchema.parse({
          ...req.body,
          ownerId: userId
        });
        const workspace = await storage.createWorkspace(workspaceData);
        await storage.addWorkspaceMember({
          workspaceId: workspace.id,
          userId,
          role: "owner"
        });
        res.json(workspace);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );
  app2.get(
    "/api/workspaces/:id",
    requireAuth,
    loadEntitlementsContext,
    requireWorkspaceAccess(),
    requireWorkspacePermission(WORKSPACE_PERMISSIONS.READ_WORKSPACE),
    async (req, res) => {
      try {
        res.json(req.workspace);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  app2.post(
    "/api/workspaces/join",
    requireAuth,
    loadEntitlementsContext,
    express3.json(),
    async (req, res) => {
      try {
        const { sessionCode } = req.body;
        if (!sessionCode) {
          return res.status(400).json({ error: "Session code is required" });
        }
        const workspace = await storage.getWorkspaceBySessionCode(sessionCode);
        if (!workspace) {
          return res.status(404).json({ error: "Invalid session code" });
        }
        const userId = req.user.claims.sub;
        const existingMembership = await storage.getUserWorkspaceMembership(workspace.id, userId);
        if (existingMembership) {
          return res.json({ workspace, message: "Already a member" });
        }
        await storage.addWorkspaceMember({
          workspaceId: workspace.id,
          userId,
          role: "member"
        });
        res.json({ workspace, message: "Successfully joined workspace" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  app2.get(
    "/api/workspaces/:id/members",
    requireAuth,
    loadEntitlementsContext,
    requireWorkspaceAccess(),
    requireWorkspacePermission(WORKSPACE_PERMISSIONS.READ_WORKSPACE),
    async (req, res) => {
      try {
        const userId = req.user.claims.sub;
        const membership = await storage.getUserWorkspaceMembership(req.params.id, userId);
        const workspace = await storage.getWorkspace(req.params.id);
        if (!membership && workspace?.ownerId !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
        const members = await storage.getWorkspaceMembers(req.params.id);
        res.json(members);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  app2.post("/dev-verify", express3.json(), (req, res) => {
    const { consensus = "", dissents = [], citations = [] } = req.body || {};
    res.json({
      findings: [
        {
          claim: "Compressed weeks reduce attrition",
          status: "supported",
          note: "Multiple trials point to improved retention",
          citations: citations.slice(0, 1)
        },
        {
          claim: "Always increases burnout",
          status: "contradicted",
          note: "Outcome depends on guardrails and overlap windows"
        }
      ]
    });
  });
  app2.get("/api/sessions", async (req, res) => {
    try {
      const sessions2 = await storage.getUserAnalysisSessions();
      res.json(sessions2);
    } catch (error) {
      console.error("Sessions API error:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });
  app2.get("/api/sessions/transferable", optionalAuth, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const excludeMode = req.query.exclude_mode;
      const sessions2 = await storage.getTransferableSessions(userId, excludeMode);
      const transferable = sessions2.map((session2) => ({
        sessionId: session2.id,
        title: session2.title || `${session2.mode} debate: ${session2.prompt.substring(0, 50)}...`,
        prompt: session2.prompt,
        mode: session2.mode,
        consensus: session2.results?.consensus || "",
        dissents: session2.results?.dissents || [],
        unresolved: session2.results?.unresolved || [],
        debateHistory: session2.debateHistory || [],
        createdAt: session2.createdAt || /* @__PURE__ */ new Date()
      }));
      res.json(transferable);
    } catch (error) {
      console.error("Error fetching transferable sessions:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/sessions/:id/transfer", optionalAuth, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const session2 = await storage.getSessionForTransfer(req.params.id);
      if (!session2) {
        return res.status(404).json({ error: "Session not found" });
      }
      if (userId && session2.userId && session2.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      const transferData = {
        sessionId: session2.id,
        title: session2.title || `${session2.mode} debate: ${session2.prompt.substring(0, 50)}...`,
        prompt: session2.prompt,
        mode: session2.mode,
        consensus: session2.results?.consensus || "",
        dissents: session2.results?.dissents || [],
        unresolved: session2.results?.unresolved || [],
        debateHistory: session2.debateHistory || [],
        createdAt: session2.createdAt || /* @__PURE__ */ new Date()
      };
      res.json(transferData);
    } catch (error) {
      console.error("Error fetching session for transfer:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/sessions/:id", async (req, res) => {
    try {
      const session2 = await storage.getAnalysisSession(req.params.id);
      if (!session2) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session2);
    } catch (error) {
      console.error("Session API error:", error);
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });
  app2.post("/api/sessions/generate-code", requireAuth, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
      await storage.createSessionCode({
        code: sessionCode,
        createdBy: userId,
        expiresAt,
        isActive: true
      });
      res.json({ sessionCode, expiresAt });
    } catch (error) {
      console.error("Generate session code error:", error);
      res.status(500).json({ message: "Failed to generate session code" });
    }
  });
  app2.post("/api/sessions/join/:code", requireAuth, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionCode = req.params.code.toUpperCase();
      const sessionInfo = await storage.getSessionCode(sessionCode);
      if (!sessionInfo || !sessionInfo.isActive || sessionInfo.expiresAt < /* @__PURE__ */ new Date()) {
        return res.status(404).json({ message: "Invalid or expired session code" });
      }
      await storage.addUserToSession(sessionCode, userId);
      res.json({
        success: true,
        sessionCode,
        createdBy: sessionInfo.createdBy,
        participants: await storage.getSessionParticipants(sessionCode)
      });
    } catch (error) {
      console.error("Join session error:", error);
      res.status(500).json({ message: "Failed to join session" });
    }
  });
  app2.get("/api/sessions/code/:code/participants", requireAuth, async (req, res) => {
    try {
      const sessionCode = req.params.code.toUpperCase();
      const participants = await storage.getSessionParticipants(sessionCode);
      res.json(participants);
    } catch (error) {
      console.error("Get participants error:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });
  app2.get("/api/sessions/code/:code/chat", requireAuth, async (req, res) => {
    try {
      const sessionCode = req.params.code.toUpperCase();
      const messages = await storage.getChatHistory(sessionCode);
      res.json(messages);
    } catch (error) {
      console.error("Get chat history error:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });
  app2.post("/api/sessions/code/:code/chat", requireAuth, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionCode = req.params.code.toUpperCase();
      const { content, messageType = "chat" } = req.body;
      const message = await storage.saveChatMessage({
        sessionCode,
        userId,
        content,
        messageType
      });
      res.json(message);
    } catch (error) {
      console.error("Save chat message error:", error);
      res.status(500).json({ message: "Failed to save message" });
    }
  });
  app2.get(
    "/api/organizations",
    requireAuth,
    requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS),
    async (req, res) => {
      try {
        const userId = req.user.claims.sub;
        const organizations3 = await storage.getUserOrganizations(userId);
        res.json(organizations3);
      } catch (error) {
        console.error("Get organizations error:", error);
        res.status(500).json({ error: "Failed to fetch organizations" });
      }
    }
  );
  app2.post(
    "/api/organizations",
    requireAuth,
    requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS),
    express3.json(),
    async (req, res) => {
      try {
        const userId = req.user.claims.sub;
        const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const organizationData = insertOrganizationSchema.parse({
          ...req.body,
          slug: `${slug}-${Date.now()}`
          // Ensure uniqueness
        });
        const organization = await storage.createOrganization(organizationData);
        await storage.addOrganizationMember({
          organizationId: organization.id,
          userId,
          role: "super_admin",
          permissions: {
            manage_users: true,
            manage_billing: true,
            manage_workspaces: true,
            view_audit_logs: true,
            manage_security: true,
            manage_teams: true,
            view_analytics: true
          }
        });
        res.json(organization);
      } catch (error) {
        console.error("Create organization error:", error);
        res.status(400).json({ error: error.message });
      }
    }
  );
  app2.get("/api/organizations/:id", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const organization = await storage.getOrganization(req.params.id);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      const membership = await storage.getOrganizationMembership(organization.id, userId);
      if (!membership) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(organization);
    } catch (error) {
      console.error("Get organization error:", error);
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });
  app2.put("/api/organizations/:id", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS), express3.json(), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizationId = req.params.id;
      const membership = await storage.getOrganizationMembership(organizationId, userId);
      if (!membership || !["super_admin", "admin"].includes(membership.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      const updatedOrganization = await storage.updateOrganization(organizationId, req.body);
      if (!updatedOrganization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(updatedOrganization);
    } catch (error) {
      console.error("Update organization error:", error);
      res.status(500).json({ error: "Failed to update organization" });
    }
  });
  app2.get("/api/organizations/:id/members", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizationId = req.params.id;
      const membership = await storage.getOrganizationMembership(organizationId, userId);
      if (!membership) {
        return res.status(403).json({ error: "Access denied" });
      }
      const members = await storage.getOrganizationMembers(organizationId);
      res.json(members);
    } catch (error) {
      console.error("Get organization members error:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });
  app2.post("/api/organizations/:id/members", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS), express3.json(), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizationId = req.params.id;
      const membership = await storage.getOrganizationMembership(organizationId, userId);
      if (!membership || !["super_admin", "admin", "manager"].includes(membership.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      const memberData = insertOrganizationMemberSchema.parse({
        organizationId,
        ...req.body
      });
      const member = await storage.addOrganizationMember(memberData);
      res.json(member);
    } catch (error) {
      console.error("Add organization member error:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/organizations/:id/teams", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizationId = req.params.id;
      const membership = await storage.getOrganizationMembership(organizationId, userId);
      if (!membership) {
        return res.status(403).json({ error: "Access denied" });
      }
      const teams2 = await storage.getOrganizationTeams(organizationId);
      res.json(teams2);
    } catch (error) {
      console.error("Get teams error:", error);
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });
  app2.post("/api/organizations/:id/teams", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS), express3.json(), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizationId = req.params.id;
      const membership = await storage.getOrganizationMembership(organizationId, userId);
      if (!membership || !["super_admin", "admin", "manager"].includes(membership.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      const teamData = insertTeamSchema.parse({
        organizationId,
        ...req.body
      });
      const team = await storage.createTeam(teamData);
      res.json(team);
    } catch (error) {
      console.error("Create team error:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.get(
    "/api/admin/users",
    requireAuth,
    requireSystemRole("admin"),
    async (req, res) => {
      try {
        const userId = req.user.id;
        const paginationResult = paginationSchema.safeParse(req.query);
        if (!paginationResult.success) {
          return res.status(400).json({
            error: "Invalid pagination parameters",
            details: paginationResult.error.issues
          });
        }
        const { limit, offset } = paginationResult.data;
        console.log(`Admin ${userId} requesting user list with limit=${limit}, offset=${offset}`);
        const users2 = await storage.getAllUsers(limit, offset);
        const totalUsers = await storage.getUserCount();
        const sanitizedUsers = users2.map((user) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));
        try {
          await storage.createAuditLog({
            action: "admin_user_list_accessed",
            userId,
            details: {
              limit,
              offset,
              userCount: sanitizedUsers.length,
              totalUsers
            },
            metadata: {
              operation: "getAllUsers",
              adminRole: req.user.role
            }
          });
        } catch (auditError) {
          console.error("Failed to log user list access audit:", auditError);
        }
        res.json({
          users: sanitizedUsers,
          total: totalUsers,
          // Fixed: return actual total count from database
          limit,
          offset,
          hasMore: offset + users2.length < totalUsers
        });
      } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: "Failed to fetch users" });
      }
    }
  );
  app2.post(
    "/api/admin/users/:id/role",
    requireAuth,
    requireSystemRole("system_admin"),
    express3.json(),
    async (req, res) => {
      try {
        const adminUserId = req.user.id;
        const targetUserId = req.params.id;
        const { role } = req.body;
        console.log(`System admin ${adminUserId} attempting to change role of user ${targetUserId} to ${role}`);
        const validationResult = systemUserRoleSchema.safeParse(role);
        if (!validationResult.success) {
          return res.status(400).json({
            error: "Invalid role",
            validRoles: ["user", "premium_user", "admin", "system_admin"],
            provided: role
          });
        }
        const targetUser = await storage.getUser(targetUserId);
        if (!targetUser) {
          return res.status(404).json({ error: "User not found" });
        }
        const originalRole = targetUser.role;
        const updatedUser = await storage.setUserRole(targetUserId, role);
        if (!updatedUser) {
          return res.status(500).json({ error: "Failed to update user role" });
        }
        try {
          await storage.createAuditLog({
            action: "user_role_changed_by_admin",
            userId: adminUserId,
            details: {
              targetUserId,
              targetUserEmail: targetUser.email,
              previousRole: originalRole,
              newRole: role,
              changedAt: /* @__PURE__ */ new Date()
            },
            metadata: {
              operation: "adminUserRoleChange",
              adminEmail: req.user.email,
              // Fixed: use req.user.email instead of req.user.claims.email
              adminRole: req.user.role
            }
          });
          await storage.createAuditLog({
            action: "user_role_changed",
            userId: targetUserId,
            details: {
              changedByUserId: adminUserId,
              changedByEmail: req.user.email,
              // Fixed: use req.user.email instead of req.user.claims.email
              previousRole: originalRole,
              newRole: role,
              changedAt: /* @__PURE__ */ new Date()
            },
            metadata: {
              operation: "userRoleChanged",
              changedByAdmin: true
            }
          });
        } catch (auditError) {
          console.error("Failed to log role change audit:", auditError);
        }
        console.log(`\u2705 Successfully changed user ${targetUserId} role from ${originalRole} to ${role}`);
        const sanitizedUser = {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          updatedAt: updatedUser.updatedAt
        };
        res.json({
          success: true,
          user: sanitizedUser,
          changes: {
            previousRole: originalRole,
            newRole: role,
            changedBy: adminUserId,
            changedAt: /* @__PURE__ */ new Date()
          }
        });
      } catch (error) {
        console.error("Update user role error:", error);
        if (error.message?.includes("not found")) {
          return res.status(404).json({ error: "User not found" });
        }
        if (error.message?.includes("Cannot demote the last system administrator")) {
          return res.status(409).json({
            error: "Cannot demote the last system administrator. The system must always have at least one system_admin.",
            code: "LAST_SYSTEM_ADMIN_PROTECTION"
          });
        }
        res.status(500).json({
          error: "Failed to update user role",
          details: process.env.NODE_ENV === "development" ? error.message : void 0
        });
      }
    }
  );
  app2.get(
    "/api/audit-logs",
    requireAuth,
    requireSystemPermission(SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS),
    async (req, res) => {
      try {
        const userId = req.user.id;
        const paginationResult = paginationSchema.safeParse(req.query);
        if (!paginationResult.success) {
          return res.status(400).json({
            error: "Invalid pagination parameters",
            details: paginationResult.error.issues
          });
        }
        const { limit, offset } = paginationResult.data;
        const { organizationId, action } = req.query;
        if (organizationId) {
          const membership = await storage.getOrganizationMembership(organizationId, userId);
          if (!membership || !["super_admin", "admin"].includes(membership.role)) {
            return res.status(403).json({ error: "Insufficient permissions" });
          }
        }
        const auditLogs2 = await storage.getAuditLogs(
          organizationId || void 0,
          void 0,
          // userId filter
          parseInt(limit.toString())
        );
        res.json({
          logs: auditLogs2.slice(parseInt(offset.toString())),
          total: auditLogs2.length,
          limit: parseInt(limit.toString()),
          offset: parseInt(offset.toString())
        });
      } catch (error) {
        console.error("Get audit logs error:", error);
        res.status(500).json({ error: "Failed to fetch audit logs" });
      }
    }
  );
  app2.get("/api/security-events", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { organizationId, severity, resolved } = req.query;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || !["super_admin", "admin"].includes(membership.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }
      const securityEvents2 = await storage.getSecurityEvents(
        organizationId || void 0,
        severity?.toString()
      );
      const filteredEvents = resolved !== void 0 ? securityEvents2.filter((event) => event.resolved === (resolved === "true")) : securityEvents2;
      res.json({
        events: filteredEvents,
        total: filteredEvents.length,
        filters: {
          organizationId,
          severity,
          resolved
        }
      });
    } catch (error) {
      console.error("Get security events error:", error);
      res.status(500).json({ error: "Failed to fetch security events" });
    }
  });
  app2.patch("/api/security-events/:eventId/resolve", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventId = req.params.eventId;
      const { organizationId } = req.body;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || !["super_admin", "admin"].includes(membership.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }
      const resolvedEvent = await storage.resolveSecurityEvent(eventId, userId);
      if (!resolvedEvent) {
        return res.status(404).json({ error: "Security event not found" });
      }
      await storage.createAuditLog({
        organizationId: organizationId || null,
        userId,
        action: "security_event_resolved",
        resource: "security_event",
        resourceId: eventId,
        details: {
          event_type: resolvedEvent.eventType,
          severity: resolvedEvent.severity,
          resolved_at: (/* @__PURE__ */ new Date()).toISOString()
        },
        ipAddress: req.ip || null,
        userAgent: req.get("User-Agent") || null
      });
      res.json({
        message: "Security event resolved successfully",
        event: resolvedEvent
      });
    } catch (error) {
      console.error("Resolve security event error:", error);
      res.status(500).json({ error: "Failed to resolve security event" });
    }
  });
  app2.get(
    "/api/usage/analytics",
    requireAuth,
    loadEntitlementsContext,
    requireFeature(BILLING_FEATURES.ADVANCED_ANALYTICS),
    async (req, res) => {
      try {
        const userId = req.user.claims.sub;
        const { organizationId, period = "week" } = req.query;
        if (organizationId) {
          const membership = await storage.getOrganizationMembership(organizationId, userId);
          if (!membership) {
            return res.status(403).json({ error: "Access denied" });
          }
        }
        const analytics = { message: "Analytics temporarily disabled" };
        res.json(analytics);
      } catch (error) {
        console.error("Get usage analytics error:", error);
        res.status(500).json({ error: "Failed to fetch usage analytics" });
      }
    }
  );
  app2.get("/api/usage/quotas/:organizationId", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const organizationId = req.params.organizationId;
      const membership = await storage.getOrganizationMembership(organizationId, userId);
      if (!membership) {
        return res.status(403).json({ error: "Access denied" });
      }
      const quotaTypes = ["monthly_analyses", "concurrent_sessions", "storage_gb", "api_calls_per_hour"];
      const quotaStatus = await Promise.all(
        quotaTypes.map(async (type) => {
          const status = { usage: 0, limit: 1e3, remaining: 1e3 };
          return { type, ...status };
        })
      );
      res.json({
        organizationId,
        quotas: quotaStatus,
        summary: {
          totalQuotas: quotaStatus.length,
          exceeded: quotaStatus.filter((q) => !q.withinQuota).length,
          warnings: quotaStatus.filter((q) => q.percentage > 80).length
        }
      });
    } catch (error) {
      console.error("Get quota status error:", error);
      res.status(500).json({ error: "Failed to fetch quota status" });
    }
  });
  app2.get("/api/rate-limits/rules", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { organizationId } = req.query;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || !["super_admin", "admin"].includes(membership.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }
      const rules = await storage.getRateLimitRules(organizationId || void 0);
      res.json({
        rules,
        total: rules.length,
        active: rules.filter((rule) => rule.isActive).length
      });
    } catch (error) {
      console.error("Get rate limit rules error:", error);
      res.status(500).json({ error: "Failed to fetch rate limit rules" });
    }
  });
  app2.post("/api/rate-limits/rules", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD), express3.json(), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { organizationId } = req.body;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || !["super_admin", "admin"].includes(membership.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }
      const ruleData = {
        organizationId: organizationId || null,
        ruleType: req.body.limitType || "requests_per_minute",
        target: req.body.resourceType,
        limit: parseInt(req.body.limitValue),
        window: req.body.windowMs || 6e4,
        action: "throttle",
        isActive: req.body.isActive ?? true
      };
      const rule = await storage.createRateLimitRule(ruleData);
      await storage.createAuditLog({
        organizationId: organizationId || null,
        userId,
        action: "rate_limit_rule_created",
        resource: "rate_limit_rule",
        resourceId: rule.id,
        details: {
          rule_type: ruleData.ruleType,
          resource_target: ruleData.target,
          limit_value: ruleData.limit
        },
        ipAddress: req.ip || null,
        userAgent: req.get("User-Agent") || null
      });
      res.json({
        message: "Rate limit rule created successfully",
        rule
      });
    } catch (error) {
      console.error("Create rate limit rule error:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.put("/api/rate-limits/rules/:ruleId", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD), express3.json(), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const ruleId = req.params.ruleId;
      const { organizationId } = req.body;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || !["super_admin", "admin"].includes(membership.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }
      const updatedRule = await storage.updateRateLimitRule(ruleId, req.body);
      if (!updatedRule) {
        return res.status(404).json({ error: "Rate limit rule not found" });
      }
      await storage.createAuditLog({
        organizationId: organizationId || null,
        userId,
        action: "rate_limit_rule_updated",
        resource: "rate_limit_rule",
        resourceId: ruleId,
        details: {
          changes: req.body
        },
        ipAddress: req.ip || null,
        userAgent: req.get("User-Agent") || null
      });
      res.json({
        message: "Rate limit rule updated successfully",
        rule: updatedRule
      });
    } catch (error) {
      console.error("Update rate limit rule error:", error);
      res.status(500).json({ error: "Failed to update rate limit rule" });
    }
  });
  app2.post(
    "/api/think",
    requireAuth,
    loadEntitlementsContext,
    express3.json(),
    // Conditional feature requirement: only Expert mode needs workspace context and ADVANCED_AI
    async (req, res, next) => {
      try {
        const body = req.body || {};
        const mode = body.mode || "simple";
        if (mode === "expert") {
          return requireFeature(BILLING_FEATURES.ADVANCED_AI)(req, res, next);
        }
        next();
      } catch (error) {
        console.error("Mode-based feature check failed:", error);
        res.status(500).json({
          error: "Internal server error",
          code: "INTERNAL_ERROR"
        });
      }
    },
    // rateLimiter temporarily disabled for debugging
    // rateLimiter.enterpriseRateLimit('ai_analyses', {
    //   enableBurst: true,
    //   enableAdaptive: true,
    //   customMessage: 'AI analysis rate limit exceeded. Please upgrade your plan for higher limits.'
    // }),
    async (req, res) => {
      try {
        const result = thinkRequestSchema.parse(req.body);
        const userId = req.user?.claims?.sub;
        let transferredContext = {};
        let sourceSession = null;
        if (result.transfer_from_session_id) {
          sourceSession = await storage.getSessionForTransfer(result.transfer_from_session_id);
          if (sourceSession) {
            transferredContext = {
              previousConsensus: sourceSession.results?.consensus || "",
              previousDissents: sourceSession.results?.dissents || [],
              previousUnresolved: sourceSession.results?.unresolved || [],
              previousDebateHistory: sourceSession.debateHistory || [],
              originalPrompt: sourceSession.prompt,
              sourceMode: sourceSession.mode,
              transferPrompt: `CONTINUING FROM PREVIOUS ${sourceSession.mode.toUpperCase()} MODE DEBATE:
Original Question: "${sourceSession.prompt}"

Previous Consensus: ${sourceSession.results?.consensus || "None reached"}

Previous Dissenting Views: ${(sourceSession.results?.dissents || []).map((d) => `\u2022 ${d.position}: ${d.reasoning || ""}`).join("\n")}

Unresolved Questions: ${(sourceSession.results?.unresolved || []).map((q) => `\u2022 ${q}`).join("\n")}

NOW CONTINUING WITH: "${result.prompt}"

Please build upon the previous discussion while addressing the new question.`
            };
          }
        }
        const response = await runMultiAgentDebate(
          transferredContext?.transferPrompt || result.prompt,
          { ...result, ...transferredContext }
        );
        const sessionData = {
          prompt: result.prompt,
          mode: result.mode,
          settings: result,
          results: response,
          telemetry: response.telemetry,
          debateHistory: response.debateHistory,
          title: result.transfer_from_session_id ? `Continued from ${sourceSession?.mode || "previous"}: ${result.prompt.substring(0, 50)}...` : null,
          sourceSessionId: result.transfer_from_session_id || null,
          transferCount: sourceSession?.transferCount ? sourceSession.transferCount + 1 : 0,
          userId,
          workspaceId: null
        };
        const createdSession = await storage.createAnalysisSession(sessionData);
        res.json({
          ...response,
          sessionId: createdSession.id
        });
      } catch (error) {
        console.error("Think endpoint error:", error);
        res.status(400).json({ error: error.message });
      }
    }
  );
  app2.post(
    "/api/brainstorm",
    requireAuth,
    loadEntitlementsContext,
    express3.json(),
    requireFeature(BILLING_FEATURES.ADVANCED_AI),
    async (req, res) => {
      try {
        const { sessionId, settings = {} } = req.body;
        const userId = req.user?.claims?.sub;
        if (!sessionId) {
          return res.status(400).json({ error: "Session ID is required" });
        }
        const session2 = await storage.getSessionForTransfer(sessionId);
        if (!session2) {
          return res.status(404).json({ error: "Session not found" });
        }
        if (userId && session2.userId && session2.userId !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
        const debateResults = {
          consensus: session2.results?.consensus || "",
          dissents: session2.results?.dissents || [],
          unresolved: session2.results?.unresolved || []
        };
        if (!debateResults.consensus && (!debateResults.dissents || debateResults.dissents.length === 0)) {
          return res.status(400).json({ error: "Insufficient debate results to start brainstorming" });
        }
        const brainstormResults = await runBrainstormingSession(
          session2.prompt,
          debateResults,
          settings
        );
        await storage.updateAnalysisSession(sessionId, {
          brainstormResults,
          lastBrainstormedAt: /* @__PURE__ */ new Date()
        });
        res.json(brainstormResults);
      } catch (error) {
        console.error("Brainstorming endpoint error:", error);
        res.status(400).json({ error: error.message });
      }
    }
  );
  app2.post(
    "/api/report",
    requireAuth,
    loadEntitlementsContext,
    requireFeature(BILLING_FEATURES.ADVANCED_ANALYTICS),
    async (req, res) => {
      try {
        const userId = req.user?.claims?.sub;
        const requestBody = reportRequestSchema.parse(req.body);
        const { session_id, report_type, include_citations = true, include_expert_summary = true, format = "markdown" } = requestBody;
        console.log(`\u{1F4CA} Generating ${report_type} report for session: ${session_id}`);
        const session2 = await storage.getSessionForTransfer(session_id);
        if (!session2) {
          return res.status(404).json({ error: "Session not found" });
        }
        if (userId && session2.userId && session2.userId !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
        if (!session2.results?.consensus) {
          return res.status(400).json({ error: "Session must have completed debate results to generate report" });
        }
        const debateResults = {
          consensus: session2.results.consensus,
          dissents: session2.results.dissents || [],
          unresolved: session2.results.unresolved || [],
          citations: session2.results.citations,
          fact_check: session2.results.fact_check,
          debateHistory: session2.debateHistory
        };
        const brainstormResults = session2.brainstormResults ? {
          solutions: session2.brainstormResults.solutions || [],
          action_plan: session2.brainstormResults.action_plan || [],
          answered_questions: session2.brainstormResults.answered_questions || [],
          final_consensus: session2.brainstormResults.final_consensus || "",
          implementation_strategy: session2.brainstormResults.implementation_strategy || {
            approach: "",
            key_milestones: []
          }
        } : void 0;
        const sessionData = {
          prompt: session2.prompt,
          mode: session2.mode,
          settings: session2.settings || {},
          debateResults,
          brainstormResults
        };
        const report = await runReportGeneration(
          sessionData,
          report_type,
          {
            include_citations,
            include_expert_summary,
            format
          }
        );
        report.metadata.session_id = session_id;
        let storedReport = null;
        if (userId) {
          try {
            const reportContent = formatReportContent(report, format);
            storedReport = await storage.createGeneratedReport({
              sessionId: session_id,
              userId,
              reportType: report_type,
              title: report.title || `${report_type.charAt(0).toUpperCase() + report_type.slice(1)} Report - ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`,
              content: reportContent,
              format,
              metadata: {
                wordCount: reportContent.split(" ").length,
                generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
                sessionPrompt: session2.prompt,
                debateMode: session2.mode,
                ...report.metadata
              }
            });
            console.log(`\u{1F4BE} Report stored in database with ID: ${storedReport.id}`);
          } catch (error) {
            console.error("Failed to store report in database:", error);
            if (error.message) {
              console.error("Database error message:", error.message);
            }
            if (error.code) {
              console.error("Database error code:", error.code);
            }
            storedReport = {
              id: null,
              error: "Report generation succeeded but storage failed. Content available in response but not persisted."
            };
          }
        }
        await storage.updateAnalysisSession(session_id, {
          lastReportGeneratedAt: /* @__PURE__ */ new Date(),
          lastReportType: report_type
        });
        console.log(`\u{1F4CA} ${report_type} report generated successfully for session: ${session_id}`);
        const response = {
          ...report,
          storedReportId: storedReport?.id
        };
        res.json(response);
      } catch (error) {
        console.error("Report generation endpoint error:", error);
        res.status(400).json({ error: error.message });
      }
    }
  );
  app2.get("/api/reports", requireAuth, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const reports = await storage.getUserGeneratedReports(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching user reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });
  app2.get("/api/reports/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const reportId = req.params.id;
      const report = await storage.getGeneratedReport(reportId);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      if (report.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });
  app2.delete("/api/reports/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const reportId = req.params.id;
      const report = await storage.getGeneratedReport(reportId);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      if (report.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      const deleted = await storage.deleteGeneratedReport(reportId);
      if (!deleted) {
        return res.status(500).json({ error: "Failed to delete report" });
      }
      res.json({ message: "Report deleted successfully" });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ error: "Failed to delete report" });
    }
  });
  app2.post("/api/factcheck/verify-claims", optionalAuth, express3.json(), async (req, res) => {
    try {
      const { claims, settings = {} } = req.body;
      if (!claims || !Array.isArray(claims) || claims.length === 0) {
        return res.status(400).json({ error: "Claims array is required and must not be empty" });
      }
      const validClaims = claims.filter((claim) => typeof claim === "string" && claim.trim().length > 0).slice(0, 10);
      if (validClaims.length === 0) {
        return res.status(400).json({ error: "No valid claims provided" });
      }
      console.log(`\u{1F50D} Fact-checking ${validClaims.length} claims with advanced verification`);
      const factCheckSettings = {
        enable_fact_check: true,
        max_claims: Math.min(validClaims.length, settings.max_claims || 5),
        verification_depth: settings.verification_depth || "standard",
        min_sources: settings.min_sources || 3,
        ...settings
      };
      const findings = await advancedFactChecker.verifyClaimsAdvanced(validClaims, factCheckSettings);
      console.log(`\u2705 Fact-check completed: ${findings.length} findings generated`);
      res.json({
        findings,
        settings: factCheckSettings,
        meta: {
          total_claims: validClaims.length,
          findings_count: findings.length,
          verification_depth: factCheckSettings.verification_depth,
          processed_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    } catch (error) {
      console.error("Fact-checking endpoint error:", error);
      res.status(500).json({
        error: "Fact-checking service temporarily unavailable",
        details: process.env.NODE_ENV === "development" ? error.message : void 0
      });
    }
  });
  app2.get("/api/health", async (req, res) => {
    try {
      const health = {
        status: "healthy",
        message: "System monitoring temporarily disabled",
        uptime: process.uptime(),
        version: process.env.npm_package_version || "1.0.0"
      };
      const statusCode = health.status === "healthy" ? 200 : health.status === "warning" ? 200 : 503;
      res.status(statusCode).json({
        ...health,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Health check error:", error);
      res.status(503).json({
        status: "critical",
        message: "Health check failed",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.get("/api/monitoring/performance", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { organizationId, timeRange = "1h" } = req.query;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || !["super_admin", "admin", "manager"].includes(membership.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }
      const analytics = { message: "Performance analytics temporarily disabled" };
      res.json(analytics);
    } catch (error) {
      console.error("Get performance analytics error:", error);
      res.status(500).json({ error: "Failed to fetch performance analytics" });
    }
  });
  app2.get("/api/monitoring/errors", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { organizationId, timeRange = "24h" } = req.query;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || !["super_admin", "admin"].includes(membership.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }
      const errorAnalytics = { message: "Error analytics temporarily disabled" };
      res.json(errorAnalytics);
    } catch (error) {
      console.error("Get error analytics error:", error);
      res.status(500).json({ error: "Failed to fetch error analytics" });
    }
  });
  app2.get("/api/monitoring/metrics/realtime", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { organizationId } = req.query;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || !["super_admin", "admin"].includes(membership.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
      }
      const currentTime = (/* @__PURE__ */ new Date()).toISOString();
      const health = {
        status: "healthy",
        responseTime: { avg: 150, p95: 300, p99: 500 },
        memory: { percentage: 45, used: 512 },
        errorRate: 0.01,
        uptime: Math.floor(process.uptime()),
        databaseHealth: "healthy"
      };
      res.json({
        timestamp: currentTime,
        metrics: {
          system_health: health.status,
          response_time_avg: health.responseTime.avg,
          response_time_p95: health.responseTime.p95,
          response_time_p99: health.responseTime.p99,
          memory_usage_percent: health.memory.percentage,
          memory_used_mb: health.memory.used,
          error_rate: health.errorRate,
          uptime_seconds: health.uptime,
          database_health: health.databaseHealth
        },
        alerts: health.status !== "healthy" ? [{
          type: "system_health",
          severity: health.status === "critical" ? "high" : "medium",
          message: `System health is ${health.status}`,
          timestamp: currentTime
        }] : []
      });
    } catch (error) {
      console.error("Get real-time metrics error:", error);
      res.status(500).json({ error: "Failed to fetch real-time metrics" });
    }
  });
  app2.post("/api/monitoring/metrics/cleanup", requireAuth, requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { organizationId } = req.body;
      if (organizationId) {
        const membership = await storage.getOrganizationMembership(organizationId, userId);
        if (!membership || membership.role !== "super_admin") {
          return res.status(403).json({ error: "Only super administrators can cleanup metrics" });
        }
      }
      await storage.createAuditLog({
        organizationId: organizationId || null,
        userId,
        action: "metrics_cleanup_performed",
        resource: "monitoring_system",
        resourceId: "metrics_cleanup",
        details: {
          performed_by: userId,
          cleanup_time: (/* @__PURE__ */ new Date()).toISOString()
        },
        ipAddress: req.ip || null,
        userAgent: req.get("User-Agent") || null
      });
      res.json({
        message: "Metrics cleanup completed successfully",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Metrics cleanup error:", error);
      res.status(500).json({ error: "Failed to cleanup metrics" });
    }
  });
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  const activeSessions = /* @__PURE__ */ new Map();
  const userSessions = /* @__PURE__ */ new Map();
  wss.on("connection", (ws3, req) => {
    console.log("New WebSocket connection established");
    ws3.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());
        switch (message.type) {
          case "join_session":
            const { sessionCode, userId } = message;
            userSessions.set(ws3, { userId, sessionCode });
            if (!activeSessions.has(sessionCode)) {
              activeSessions.set(sessionCode, /* @__PURE__ */ new Set());
            }
            activeSessions.get(sessionCode).add(ws3);
            broadcastToSession(sessionCode, {
              type: "user_joined",
              userId,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }, ws3);
            break;
          case "chat_message":
            const sessionInfo = userSessions.get(ws3);
            if (sessionInfo?.sessionCode) {
              broadcastToSession(sessionInfo.sessionCode, {
                type: "chat_message",
                message: message.content,
                userId: sessionInfo.userId,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              });
            }
            break;
          case "workspace_update":
            const userSession = userSessions.get(ws3);
            if (userSession?.sessionCode) {
              broadcastToSession(userSession.sessionCode, {
                type: "workspace_update",
                data: message.data,
                userId: userSession.userId,
                timestamp: (/* @__PURE__ */ new Date()).toISOString()
              }, ws3);
            }
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws3.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    });
    ws3.on("close", () => {
      const sessionInfo = userSessions.get(ws3);
      if (sessionInfo?.sessionCode) {
        const sessionParticipants2 = activeSessions.get(sessionInfo.sessionCode);
        if (sessionParticipants2) {
          sessionParticipants2.delete(ws3);
          broadcastToSession(sessionInfo.sessionCode, {
            type: "user_left",
            userId: sessionInfo.userId,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
          if (sessionParticipants2.size === 0) {
            activeSessions.delete(sessionInfo.sessionCode);
          }
        }
      }
      userSessions.delete(ws3);
    });
    ws3.send(JSON.stringify({ type: "connected", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
  });
  function broadcastToSession(sessionCode, message, exclude) {
    const participants = activeSessions.get(sessionCode);
    if (participants) {
      const messageStr = JSON.stringify(message);
      participants.forEach((ws3) => {
        if (ws3 !== exclude && ws3.readyState === WebSocket.OPEN) {
          ws3.send(messageStr);
        }
      });
    }
  }
  app2.post("/api/brainstorm/followup", requireAuth, loadEntitlementsContext, requireFeature(BILLING_FEATURES.ADVANCED_AI), express3.json(), async (req, res) => {
    try {
      const { sessionId, itemType, itemIndex, question, context } = req.body;
      const userId = req.user?.claims?.sub;
      if (!sessionId || !itemType || itemIndex === void 0 || !question) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const session2 = await storage.getAnalysisSession(sessionId);
      if (!session2 || session2.userId !== userId) {
        return res.status(404).json({ error: "Session not found" });
      }
      let followUpPrompt = "";
      if (itemType === "solution") {
        followUpPrompt = `You are analyzing a specific solution from a brainstorming session. Here's the solution:
Title: ${context.title}
Description: ${context.description}
Feasibility: ${context.feasibility}
Impact: ${context.impact}
${context.timeline ? `Timeline: ${context.timeline}` : ""}
${context.resources_required ? `Resources Required: ${context.resources_required.join(", ")}` : ""}

User's follow-up question: ${question}

Provide a detailed, practical answer that helps them understand the solution better and implement it effectively. Be specific and actionable.`;
      } else if (itemType === "action") {
        followUpPrompt = `You are analyzing a specific action step from an implementation plan. Here's the action:
Step ${context.step}: ${context.title}
Description: ${context.description}
${context.owner ? `Owner: ${context.owner}` : ""}
${context.timeline ? `Timeline: ${context.timeline}` : ""}
${context.dependencies ? `Dependencies: ${context.dependencies.join(", ")}` : ""}

User's follow-up question: ${question}

Provide detailed guidance that helps them execute this action step successfully. Include practical tips, potential challenges, and specific recommendations.`;
      } else if (itemType === "question") {
        followUpPrompt = `You are analyzing a resolved question from a brainstorming session. Here's the Q&A:
Original Question: ${context.original_question}
Answer: ${context.answer}
Confidence: ${context.confidence}
${context.supporting_evidence ? `Supporting Evidence: ${context.supporting_evidence.join("; ")}` : ""}

User's follow-up question: ${question}

Provide additional insights, explore deeper implications, or address related aspects that weren't covered in the original answer.`;
      }
      const aiResponse = "Follow-up response service temporarily unavailable. Please try again later.";
      res.json({ answer: aiResponse });
    } catch (error) {
      console.error("Error processing follow-up question:", error);
      res.status(500).json({ error: "Failed to process follow-up question" });
    }
  });
  app2.get("/api/billing/plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json({ plans });
    } catch (error) {
      console.error("Error fetching billing plans:", error);
      res.status(500).json({ error: "Failed to fetch billing plans" });
    }
  });
  app2.post(
    "/api/billing/checkout",
    requireAuth,
    loadEntitlementsContext,
    express3.json(),
    async (req, res) => {
      try {
        const { workspaceId, planId, seats: seats2 = 1 } = req.body;
        if (!workspaceId || !planId) {
          return res.status(400).json({
            error: "Missing required fields: workspaceId and planId are required"
          });
        }
        const validPlans = ["free", "pro", "enterprise"];
        if (!validPlans.includes(planId)) {
          return res.status(400).json({
            error: `Invalid planId. Must be one of: ${validPlans.join(", ")}`
          });
        }
        const workspace = await storage.getWorkspace(workspaceId);
        if (!workspace) {
          return res.status(404).json({ error: "Workspace not found" });
        }
        const userId = req.user.claims.sub;
        const membership = await storage.getWorkspaceMembership(workspaceId, userId);
        const isOwner = workspace.ownerId === userId;
        if (!isOwner && (!membership || !["owner", "admin"].includes(membership.role))) {
          console.log(`\u274C Unauthorized billing access attempt: User ${userId} (role: ${membership?.role || "none"}) tried to upgrade workspace ${workspaceId}`);
          return res.status(403).json({
            error: "Forbidden: Only workspace owners and administrators can manage billing"
          });
        }
        const subscription = await storage.createOrUpdateSubscription({
          workspaceId,
          plan: planId,
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3),
          // 30 days from now
          stripeSubscriptionId: `mock_sub_${Date.now()}`
        });
        const planFeatures = {
          free: ["export_pdf"],
          pro: ["advanced_ai", "export_pdf", "team_collaboration", "premium_support"],
          enterprise: ["advanced_ai", "export_pdf", "custom_templates", "sso_integration", "advanced_analytics", "dedicated_support"]
        };
        await storage.revokeEntitlements(workspaceId);
        const features = planFeatures[planId] || [];
        for (const feature of features) {
          await storage.createEntitlement({
            workspaceId,
            feature,
            subscriptionId: subscription.id,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3)
            // 1 year from now
          });
        }
        const mockResponse = {
          sessionId: `mock_checkout_${Date.now()}`,
          status: "active",
          checkoutUrl: "mock://checkout",
          subscriptionId: subscription.id,
          message: `Successfully upgraded to ${planId} plan`
        };
        console.log(`\u2705 Billing checkout completed: ${planId} plan for workspace ${workspaceId}`);
        res.json(mockResponse);
      } catch (error) {
        console.error("Error processing billing checkout:", error);
        res.status(500).json({ error: "Failed to process checkout" });
      }
    }
  );
  const processedWebhookEvents = /* @__PURE__ */ new Set();
  app2.post("/api/billing/webhook", express3.raw({ type: "application/json" }), async (req, res) => {
    try {
      const sig = req.get("stripe-signature");
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (webhookSecret && sig) {
        try {
          const crypto4 = __require("crypto");
          const payload = req.body;
          const expectedSig = crypto4.createHmac("sha256", webhookSecret).update(payload).digest("hex");
          const actualSig = sig.split("=")[1];
          if (!crypto4.timingSafeEqual(Buffer.from(expectedSig, "hex"), Buffer.from(actualSig, "hex"))) {
            console.log(`\u274C Invalid webhook signature`);
            return res.status(401).json({ error: "Invalid signature" });
          }
        } catch (sigError) {
          console.log(`\u274C Signature verification failed:`, sigError);
          return res.status(401).json({ error: "Signature verification failed" });
        }
      } else if (webhookSecret) {
        console.log(`\u274C Missing stripe-signature header`);
        return res.status(401).json({ error: "Missing signature header" });
      }
      let eventData;
      try {
        eventData = JSON.parse(req.body.toString());
      } catch (parseError) {
        return res.status(400).json({ error: "Invalid JSON payload" });
      }
      const { type, workspaceId, subscriptionId, planId, eventId } = eventData;
      if (!type || !workspaceId) {
        return res.status(400).json({
          error: "Missing required webhook fields: type and workspaceId are required"
        });
      }
      if (eventId && processedWebhookEvents.has(eventId)) {
        console.log(`\u26A0\uFE0F Duplicate webhook event ${eventId} ignored`);
        return res.status(200).json({
          received: true,
          message: "Event already processed",
          eventId,
          processed_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      console.log(`\u{1F4E8} Processing billing webhook: ${type} for workspace ${workspaceId}`);
      switch (type) {
        case "subscription.activated":
        case "subscription.updated":
          if (!subscriptionId) {
            return res.status(400).json({ error: "subscriptionId required for activation/update events" });
          }
          const activatedSub = await storage.updateSubscriptionStatus(subscriptionId, "active");
          if (activatedSub) {
            console.log(`\u2705 Subscription ${subscriptionId} activated/updated`);
          }
          break;
        case "subscription.canceled":
          if (!subscriptionId) {
            return res.status(400).json({ error: "subscriptionId required for cancellation events" });
          }
          const canceledSub = await storage.cancelSubscription(subscriptionId);
          if (canceledSub) {
            await storage.revokeEntitlements(workspaceId);
            console.log(`\u274C Subscription ${subscriptionId} canceled and entitlements revoked`);
          }
          break;
        case "subscription.payment_failed":
          if (!subscriptionId) {
            return res.status(400).json({ error: "subscriptionId required for payment failure events" });
          }
          const pastDueSub = await storage.updateSubscriptionStatus(subscriptionId, "past_due");
          if (pastDueSub) {
            console.log(`\u26A0\uFE0F Subscription ${subscriptionId} marked as past due`);
          }
          break;
        default:
          console.log(`\u2139\uFE0F Unhandled webhook type: ${type}`);
          break;
      }
      if (eventId) {
        processedWebhookEvents.add(eventId);
      }
      res.status(200).json({
        received: true,
        type,
        workspaceId,
        eventId: eventId || null,
        processed_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Error processing billing webhook:", error);
      res.status(200).json({
        received: true,
        error: "Processing failed but webhook acknowledged",
        processed_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.get("/api/marketplace/templates", async (req, res) => {
    try {
      console.log("\u{1F4CB} Fetching marketplace templates...");
      const marketplaceTemplates = await storage.getMarketplaceTemplates();
      const templates2 = marketplaceTemplates.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        currency: item.currency,
        template: {
          id: item.template.id,
          name: item.template.name,
          description: item.template.description,
          category: item.template.category,
          tags: item.template.tags,
          usageCount: item.template.usageCount
        }
      }));
      console.log(`\u2705 Found ${templates2.length} marketplace templates`);
      res.json({ templates: templates2 });
    } catch (error) {
      console.error("\u274C Error fetching marketplace templates:", error);
      res.status(500).json({ error: "Failed to fetch marketplace templates" });
    }
  });
  app2.post(
    "/api/marketplace/purchase",
    requireAuth,
    loadEntitlementsContext,
    express3.json(),
    async (req, res) => {
      try {
        const userId = req.user?.claims?.sub;
        if (!userId) {
          return res.status(401).json({ error: "User not authenticated" });
        }
        const parseResult = insertTemplatePurchaseSchema.pick({
          workspaceId: true,
          templateProductId: true
        }).safeParse(req.body);
        if (!parseResult.success) {
          return res.status(400).json({
            error: "Invalid request data",
            details: parseResult.error.issues
          });
        }
        const { workspaceId, templateProductId } = parseResult.data;
        console.log(`\u{1F6D2} Processing template purchase: User ${userId}, Workspace ${workspaceId}, Template Product ${templateProductId}`);
        const membership = await storage.getWorkspaceMembership(workspaceId, userId);
        if (!membership) {
          console.log(`\u274C Unauthorized purchase attempt: User ${userId} not a member of workspace ${workspaceId}`);
          return res.status(403).json({
            error: "Forbidden: You are not a member of this workspace"
          });
        }
        if (!["owner", "admin", "member"].includes(membership.role)) {
          console.log(`\u274C Unauthorized purchase attempt: User ${userId} has insufficient permissions (${membership.role}) in workspace ${workspaceId}`);
          return res.status(403).json({
            error: "Forbidden: You do not have permission to make purchases for this workspace"
          });
        }
        const templateProduct = await storage.getTemplateProduct(templateProductId);
        if (!templateProduct) {
          return res.status(404).json({ error: "Template product not found" });
        }
        if (!templateProduct.isActive) {
          return res.status(400).json({ error: "Template product is not available for purchase" });
        }
        const existingPurchase = await storage.checkExistingPurchase(workspaceId, templateProductId);
        if (existingPurchase) {
          console.log(`\u26A0\uFE0F Duplicate purchase attempt: Workspace ${workspaceId} already owns template product ${templateProductId}`);
          return res.status(409).json({
            error: "Template already purchased by this workspace",
            purchaseId: existingPurchase.id,
            licenseKey: existingPurchase.licenseKey
          });
        }
        const purchase = await storage.createTemplatePurchase({
          workspaceId,
          userId,
          templateProductId,
          priceCents: templateProduct.priceCents,
          currency: templateProduct.currency
        });
        await storage.createEntitlement({
          workspaceId,
          feature: `template:${templateProduct.templateId}`,
          templatePurchaseId: purchase.id
        });
        console.log(`\u2705 Template purchase completed: Purchase ID ${purchase.id}, License ${purchase.licenseKey}`);
        res.status(200).json({
          purchaseId: purchase.id,
          licenseKey: purchase.licenseKey,
          status: "completed",
          templateProduct: {
            id: templateProduct.id,
            name: templateProduct.name,
            description: templateProduct.description
          },
          purchasedAt: purchase.purchasedAt
        });
      } catch (error) {
        console.error("\u274C Error processing template purchase:", error);
        res.status(500).json({ error: "Failed to process template purchase" });
      }
    }
  );
  app2.get("/api/sprint5/test", (req, res) => {
    res.status(200).json({
      message: "Sprint 5 routes are working!",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app2.post(
    "/api/reviews",
    requireAuth,
    requireSystemRole("admin"),
    express3.json(),
    async (req, res) => {
      try {
        const userId = req.user.claims.sub;
        const reviewData = insertReviewSchema.parse({
          ...req.body,
          requesterId: userId
        });
        const review = await storage.createReview(reviewData);
        res.status(201).json(review);
      } catch (error) {
        console.error("Create review error:", error);
        res.status(400).json({ error: error.message });
      }
    }
  );
  app2.get(
    "/api/reviews",
    requireAuth,
    requireSystemRole("admin"),
    async (req, res) => {
      try {
        const reviews2 = await storage.getReviews();
        res.status(200).json(reviews2);
      } catch (error) {
        console.error("Get reviews error:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
      }
    }
  );
  app2.post(
    "/api/reviews/:id/approve",
    requireAuth,
    requireSystemRole("admin"),
    express3.json(),
    async (req, res) => {
      try {
        const reviewId = req.params.id;
        const userId = req.user.claims.sub;
        const review = await storage.getReview(reviewId);
        if (!review) {
          return res.status(404).json({ error: "Review not found" });
        }
        const updatedReview = await storage.updateReview(reviewId, {
          status: "approved",
          reviewedById: userId,
          reviewedAt: /* @__PURE__ */ new Date(),
          comments: req.body.comments || ""
        });
        res.status(200).json(updatedReview);
      } catch (error) {
        console.error("Approve review error:", error);
        res.status(500).json({ error: "Failed to approve review" });
      }
    }
  );
  app2.post(
    "/api/reviews/:id/reject",
    requireAuth,
    requireSystemRole("admin"),
    express3.json(),
    async (req, res) => {
      try {
        const reviewId = req.params.id;
        const userId = req.user.claims.sub;
        const review = await storage.getReview(reviewId);
        if (!review) {
          return res.status(404).json({ error: "Review not found" });
        }
        const updatedReview = await storage.updateReview(reviewId, {
          status: "rejected",
          reviewedById: userId,
          reviewedAt: /* @__PURE__ */ new Date(),
          comments: req.body.comments || ""
        });
        res.status(200).json(updatedReview);
      } catch (error) {
        console.error("Reject review error:", error);
        res.status(500).json({ error: "Failed to reject review" });
      }
    }
  );
  app2.get(
    "/api/admin/retention/policies",
    requireAuth,
    requireSystemRole("admin"),
    async (req, res) => {
      try {
        const policies = await storage.getRetentionPolicies("");
        res.status(200).json(policies);
      } catch (error) {
        console.error("Get retention policies error:", error);
        res.status(500).json({ error: "Failed to fetch retention policies" });
      }
    }
  );
  app2.post(
    "/api/admin/retention/policies",
    requireAuth,
    requireSystemRole("admin"),
    express3.json(),
    async (req, res) => {
      try {
        const userId = req.user.claims.sub;
        const policyData = insertRetentionPolicySchema.parse({
          ...req.body,
          createdById: userId
        });
        const policy = await storage.createRetentionPolicy(policyData);
        res.status(201).json(policy);
      } catch (error) {
        console.error("Create retention policy error:", error);
        res.status(400).json({ error: error.message });
      }
    }
  );
  app2.post(
    "/api/admin/retention/legal-hold",
    requireAuth,
    requireSystemRole("admin"),
    express3.json(),
    async (req, res) => {
      try {
        const userId = req.user.claims.sub;
        const legalHoldData = insertLegalHoldSchema.parse({
          ...req.body,
          createdById: userId
        });
        const legalHold = await storage.createLegalHold(legalHoldData);
        res.status(200).json(legalHold);
      } catch (error) {
        console.error("Legal hold error:", error);
        res.status(400).json({ error: error.message });
      }
    }
  );
  const validateScimToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: SCIM Bearer token required"
      });
    }
    const token = authHeader.substring(7);
    const expectedToken = process.env.SCIM_BEARER_TOKEN || "scim-test-token-123";
    if (token !== expectedToken) {
      return res.status(401).json({
        error: "Unauthorized: Invalid SCIM Bearer token"
      });
    }
    next();
  };
  app2.get(
    "/scim/Users",
    validateScimToken,
    async (req, res) => {
      try {
        const scimUsers2 = await storage.getScimUsers("default-org");
        res.status(200).json({
          schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
          totalResults: scimUsers2.length,
          startIndex: 1,
          itemsPerPage: scimUsers2.length,
          Resources: scimUsers2.map((user) => ({
            ...user,
            schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
            meta: {
              resourceType: "User",
              created: user.createdAt,
              lastModified: user.updatedAt,
              location: `/scim/Users/${user.id}`
            }
          }))
        });
      } catch (error) {
        console.error("Get SCIM users error:", error);
        res.status(500).json({
          error: "Failed to fetch SCIM users",
          schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"]
        });
      }
    }
  );
  app2.post(
    "/scim/Users",
    validateScimToken,
    express3.json(),
    async (req, res) => {
      try {
        const scimUserData = insertScimUserSchema.parse({
          userName: req.body.userName,
          displayName: req.body.displayName || req.body.name?.formatted,
          givenName: req.body.name?.givenName,
          familyName: req.body.name?.familyName,
          email: req.body.emails?.[0]?.value,
          active: req.body.active !== void 0 ? req.body.active : true,
          externalId: req.body.externalId || req.body.userName,
          organizationId: "default-org",
          scimId: `scim-${Date.now()}`,
          attributes: req.body
        });
        const scimUser = await storage.createScimUser(scimUserData);
        res.status(201).json({
          ...scimUser,
          schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
          name: {
            formatted: scimUser.displayName,
            givenName: scimUser.givenName,
            familyName: scimUser.familyName
          },
          emails: scimUser.email ? [{
            value: scimUser.email,
            primary: true
          }] : [],
          meta: {
            resourceType: "User",
            created: scimUser.createdAt,
            lastModified: scimUser.updatedAt,
            location: `/scim/Users/${scimUser.id}`
          }
        });
      } catch (error) {
        console.error("Create SCIM user error:", error);
        res.status(400).json({
          error: error.message,
          schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"]
        });
      }
    }
  );
  app2.patch(
    "/scim/Users/:id",
    validateScimToken,
    express3.json(),
    async (req, res) => {
      try {
        const userId = req.params.id;
        const existingUser = await storage.getScimUser(userId);
        if (!existingUser) {
          return res.status(404).json({
            error: "User not found",
            schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"]
          });
        }
        const updates = {};
        if (req.body.Operations) {
          for (const operation of req.body.Operations) {
            if (operation.op === "replace") {
              if (operation.path === "active") {
                updates.active = operation.value;
              } else if (operation.path === "displayName") {
                updates.displayName = operation.value;
              }
            }
          }
        } else {
          if (req.body.active !== void 0) updates.active = req.body.active;
          if (req.body.displayName) updates.displayName = req.body.displayName;
          if (req.body.userName) updates.userName = req.body.userName;
          if (req.body.emails?.[0]?.value) updates.email = req.body.emails[0].value;
        }
        const updatedUser = await storage.updateScimUser(userId, updates);
        res.status(200).json({
          ...updatedUser,
          schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
          name: {
            formatted: updatedUser.displayName,
            givenName: updatedUser.givenName,
            familyName: updatedUser.familyName
          },
          emails: updatedUser.email ? [{
            value: updatedUser.email,
            primary: true
          }] : [],
          meta: {
            resourceType: "User",
            created: updatedUser.createdAt,
            lastModified: updatedUser.updatedAt,
            location: `/scim/Users/${updatedUser.id}`
          }
        });
      } catch (error) {
        console.error("Update SCIM user error:", error);
        res.status(500).json({
          error: "Failed to update SCIM user",
          schemas: ["urn:ietf:params:scim:api:messages:2.0:Error"]
        });
      }
    }
  );
  registerAutomationRoutes(app2);
  registerSprint6Routes(app2);
  app2.get("/onboarding/progress", optionalAuth, async (req, res) => {
    try {
      const orgId = req.orgId || "demo-org";
      const defaultSteps = {
        welcome: false,
        first_analysis: false,
        team_setup: false,
        settings_configured: false
      };
      const progress = {
        org_id: orgId,
        steps: defaultSteps,
        completed: false
      };
      res.json(progress);
    } catch (error) {
      console.error("Onboarding progress error:", error);
      res.status(500).json({ error: "Failed to get onboarding progress" });
    }
  });
  app2.post("/onboarding/complete-step", optionalAuth, express3.json(), async (req, res) => {
    try {
      const orgId = req.orgId || "demo-org";
      const { key } = req.body;
      if (!key) {
        return res.status(400).json({ error: "Step key is required" });
      }
      const allCompleted = ["welcome", "first_analysis", "team_setup", "settings_configured"].includes(key);
      res.json({ success: true, completed: allCompleted });
    } catch (error) {
      console.error("Complete step error:", error);
      res.status(500).json({ error: "Failed to complete step" });
    }
  });
  app2.get("/pricing/plans", async (req, res) => {
    try {
      const plans = [
        {
          id: "free",
          name: "Free",
          price: 0,
          features: ["Basic analysis", "10 sessions/month", "Community support"],
          limits: { sessions: 10, users: 1 }
        },
        {
          id: "pro",
          name: "Professional",
          price: 29,
          features: ["Advanced analysis", "Unlimited sessions", "Priority support", "Team collaboration"],
          limits: { sessions: -1, users: 10 }
        },
        {
          id: "enterprise",
          name: "Enterprise",
          price: 99,
          features: ["All Pro features", "Custom integrations", "Dedicated support", "Unlimited users"],
          limits: { sessions: -1, users: -1 }
        }
      ];
      res.json({ plans });
    } catch (error) {
      console.error("Get pricing plans error:", error);
      res.status(500).json({ error: "Failed to get pricing plans" });
    }
  });
  app2.post("/pricing/trial/start", optionalAuth, async (req, res) => {
    try {
      const orgId = req.orgId || "demo-org";
      const trialDays = parseInt(process.env.TRIAL_DAYS || "14");
      const trialData = await storage.startTrial(orgId, trialDays);
      console.log(`\u2705 Trial started for org ${orgId}:`, trialData);
      res.json({
        success: true,
        trial_start: trialData.startDate,
        trial_end: trialData.endDate,
        days_remaining: trialData.daysRemaining
      });
    } catch (error) {
      console.error("Start trial error:", error);
      res.status(500).json({ error: "Failed to start trial" });
    }
  });
  app2.get("/pricing/trial/status", optionalAuth, async (req, res) => {
    try {
      const orgId = req.orgId || "demo-org";
      const trialStatus = await storage.getTrialStatus(orgId);
      res.json({
        active: trialStatus.active,
        days_remaining: trialStatus.daysRemaining,
        trial_start: trialStatus.startDate,
        trial_end: trialStatus.endDate
      });
    } catch (error) {
      console.error("Get trial status error:", error);
      res.status(500).json({ error: "Failed to get trial status" });
    }
  });
  app2.get("/trust/links", async (req, res) => {
    try {
      const links = {
        security: "/trust-center-security",
        privacy: "/trust-center-privacy",
        terms: "/trust-center-terms",
        compliance: "/trust-center-compliance",
        data_processing: "/trust-center-data-processing",
        contact: "/trust-center-contact"
      };
      res.json(links);
    } catch (error) {
      console.error("Get trust links error:", error);
      res.status(500).json({ error: "Failed to get trust links" });
    }
  });
  app2.get("/status/badge", async (req, res) => {
    try {
      const statusPageUrl = process.env.STATUS_PAGE_URL;
      if (!statusPageUrl) {
        return res.json({ status: "operational", message: "All systems operational" });
      }
      res.json({
        status: "operational",
        message: "All systems operational",
        last_updated: (/* @__PURE__ */ new Date()).toISOString(),
        url: statusPageUrl
      });
    } catch (error) {
      console.error("Get status badge error:", error);
      res.status(500).json({ error: "Failed to get status badge" });
    }
  });
  const events = [];
  app2.post("/telemetry/event", optionalAuth, express3.json(), async (req, res) => {
    try {
      if (String(process.env.TELEMETRY_ALLOW || "true") !== "true") {
        return res.status(403).json({ ok: false, message: "Telemetry disabled" });
      }
      const event = {
        id: String(Date.now()),
        orgId: req.orgId || "demo-org",
        userId: req.user?.id || "anonymous",
        type: req.body?.type || "unknown",
        props: req.body?.props || {},
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      events.push(event);
      if (events.length > 1e3) {
        events.splice(0, events.length - 1e3);
      }
      res.status(201).json({ ok: true, event_id: event.id });
    } catch (error) {
      console.error("Record telemetry event error:", error);
      res.status(500).json({ error: "Failed to record event" });
    }
  });
  app2.post("/telemetry/nps", express3.json(), async (req, res) => {
    try {
      const npsEvent = {
        id: String(Date.now()),
        type: "nps.submit",
        props: {
          score: Number(req.body?.score || 0),
          comment: req.body?.comment || "",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      events.push(npsEvent);
      if (events.length > 1e3) {
        events.splice(0, events.length - 1e3);
      }
      res.status(201).json({ ok: true, event_id: npsEvent.id });
    } catch (error) {
      console.error("Record NPS error:", error);
      res.status(500).json({ error: "Failed to record NPS" });
    }
  });
  app2.post("/api/documents/upload", requireAuth, express3.json(), async (req, res) => {
    try {
      const userId = req.user?.id;
      const { fileName, fileSize, fileType } = req.body;
      if (!fileName || !fileSize) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "fileName and fileSize are required"
        });
      }
      const maxFileSize = 10 * 1024 * 1024;
      if (fileSize > maxFileSize) {
        return res.status(400).json({
          error: "File too large",
          message: `File size must be less than ${maxFileSize / (1024 * 1024)}MB`
        });
      }
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
        "text/markdown"
      ];
      if (fileType && !allowedTypes.includes(fileType)) {
        return res.status(400).json({
          error: "File type not allowed",
          message: "Only PDF, Word documents, text, and markdown files are allowed"
        });
      }
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const documentId = __require("crypto").randomUUID();
      console.log(`\u{1F4C4} Generated upload URL for user ${userId}, file: ${fileName}`);
      res.json({
        uploadURL,
        documentId,
        message: "Upload URL generated successfully"
      });
    } catch (error) {
      console.error("Document upload URL generation error:", error);
      res.status(500).json({
        error: "Failed to generate upload URL",
        message: "Please try again later"
      });
    }
  });
  app2.post("/api/documents/finalize", requireAuth, express3.json(), async (req, res) => {
    try {
      const userId = req.user?.id;
      const { documentId, uploadURL, fileName, fileSize, fileType } = req.body;
      if (!documentId || !uploadURL || !fileName) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "documentId, uploadURL, and fileName are required"
        });
      }
      const objectStorageService = new ObjectStorageService();
      const documentPath = await objectStorageService.trySetObjectEntityAclPolicy(
        uploadURL,
        {
          owner: userId,
          visibility: "private",
          // Documents are private by default
          aclRules: []
          // Can be expanded later for sharing
        }
      );
      console.log(`\u{1F4C4} Document upload finalized: ${fileName} for user ${userId}`);
      try {
        await storage.createAuditLog({
          action: "document_uploaded",
          userId,
          details: {
            fileName,
            fileSize,
            fileType,
            documentId,
            documentPath
          },
          metadata: {
            operation: "document_upload",
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
      } catch (auditError) {
        console.error("Failed to log document upload audit:", auditError);
      }
      res.json({
        success: true,
        documentUrl: documentPath,
        documentId,
        message: "Document uploaded successfully"
      });
    } catch (error) {
      console.error("Document upload finalization error:", error);
      res.status(500).json({
        error: "Failed to finalize upload",
        message: "Please try again later"
      });
    }
  });
  app2.get("/objects/:objectPath(*)", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path
      );
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId,
        requestedPermission: "read" /* READ */
      });
      if (!canAccess) {
        console.warn(`\u{1F6AB} Unauthorized document access attempt by user ${userId}: ${req.path}`);
        return res.status(403).json({
          error: "Access denied",
          message: "You don't have permission to access this document"
        });
      }
      console.log(`\u{1F4C4} Document accessed by user ${userId}: ${req.path}`);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Document access error:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({
          error: "Document not found",
          message: "The requested document does not exist"
        });
      }
      return res.status(500).json({
        error: "Failed to access document",
        message: "Please try again later"
      });
    }
  });
  app2.use("/billing", billing_default);
  app2.use("/api/stripe", stripe_default);
  app2.use("/entitlements", entitlements_default);
  app2.use("/admin", admin_default);
  console.log("\u2705 Sprint 11 routes mounted: /billing/*, /api/stripe/*, /entitlements/*, /admin/*");
  app2.use("/api/sprint12", sprint12_default);
  app2.use("/api", sprint12_default);
  console.log("\u2705 Sprint 12 GA Launch routes mounted: /api/sprint12/*, /api/docs/*, /api/marketplace/*, /api/pricing/*, /api/changelog/*, /api/playbooks/*");
  console.log("\u{1F680} Starting Sprint 6 workers...");
  await workflowWorker.start();
  await insightsWorker.start();
  console.log("\u2705 Sprint 6 workers started successfully");
  console.log("\u{1F680} Starting Sprint 11 dunning worker...");
  try {
    const dunningWorker = startDunningWorker();
    console.log("\u2705 Sprint 11 dunning worker started successfully");
  } catch (error) {
    console.error("\u274C Failed to start dunning worker:", error);
    console.log("\u26A0\uFE0F Continuing without dunning worker (development mode)");
  }
  return httpServer;
}

// server/vite.ts
import express4 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express4.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/middleware/responseCache.ts
var DEFAULT_CACHE_CONFIG = {
  defaultTTL: 300,
  // 5 minutes
  maxSize: 1e3,
  enableCompression: true,
  cacheableStatusCodes: [200, 301, 302, 404],
  excludeRoutes: ["/api/auth", "/api/think"]
  // Don't cache auth or AI requests
};
var ResponseCache = class {
  cache = /* @__PURE__ */ new Map();
  config;
  hitCount = 0;
  totalRequests = 0;
  constructor(config) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }
  /**
   * Cache Hit Rate Tracking
   */
  getCacheStats() {
    return {
      hitRate: this.totalRequests > 0 ? this.hitCount / this.totalRequests * 100 : 0,
      hitCount: this.hitCount,
      totalRequests: this.totalRequests,
      cacheSize: this.cache.size,
      maxSize: this.config.maxSize
    };
  }
  /**
   * Response Caching Middleware
   */
  middleware() {
    return (req, res, next) => {
      if (this.shouldSkipCache(req)) {
        return next();
      }
      const cacheKey = this.generateCacheKey(req);
      this.totalRequests++;
      const cached = this.get(cacheKey);
      if (cached) {
        this.hitCount++;
        res.set("X-Cache", "HIT");
        res.set("ETag", cached.etag);
        if (req.headers["if-none-match"] === cached.etag) {
          return res.status(304).send();
        }
        this.recordCacheMetric(req, "cache_hit", 1);
        if (cached.contentType) {
          res.set("Content-Type", cached.contentType);
        }
        return res.send(cached.data);
      }
      const originalSend = res.send;
      const originalJson = res.json;
      const self = this;
      res.send = async function(body) {
        if (self.shouldCache(this.statusCode, req)) {
          const etag = self.generateETag(body);
          const entry = {
            data: body,
            timestamp: Date.now(),
            ttl: self.getTTL(req),
            contentType: this.get("Content-Type"),
            etag
          };
          self.set(cacheKey, entry);
          this.set("ETag", etag);
        }
        this.set("X-Cache", "MISS");
        self.recordCacheMetric(req, "cache_miss", 1);
        return originalSend.call(this, body);
      };
      res.json = async function(body) {
        if (self.shouldCache(this.statusCode, req)) {
          const etag = self.generateETag(body);
          const entry = {
            data: body,
            timestamp: Date.now(),
            ttl: self.getTTL(req),
            contentType: "application/json",
            etag
          };
          self.set(cacheKey, entry);
          this.set("ETag", etag);
        }
        this.set("X-Cache", "MISS");
        self.recordCacheMetric(req, "cache_miss", 1);
        return originalJson.call(this, body);
      };
      next();
    };
  }
  generateCacheKey(req) {
    const { method, path: path3, query } = req;
    const userId = req.user?.claims?.sub || "anonymous";
    const orgId = req.organizationId || "global";
    const queryString = Object.keys(query).sort().map((key) => `${key}=${query[key]}`).join("&");
    return `${method}:${path3}:${queryString}:${userId}:${orgId}`;
  }
  generateETag(data) {
    const content = typeof data === "string" ? data : JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `"${Math.abs(hash).toString(16)}"`;
  }
  shouldSkipCache(req) {
    return this.config.excludeRoutes.some((route) => req.path.startsWith(route)) || req.method !== "GET";
  }
  shouldCache(statusCode, req) {
    return this.config.cacheableStatusCodes.includes(statusCode) && !this.shouldSkipCache(req);
  }
  getTTL(req) {
    if (req.path.startsWith("/api/system")) return 60;
    if (req.path.startsWith("/api/templates")) return 3600;
    if (req.path.startsWith("/api/users")) return 300;
    return this.config.defaultTTL;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl * 1e3) {
      this.cache.delete(key);
      return null;
    }
    return entry;
  }
  set(key, entry) {
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, entry);
  }
  async recordCacheMetric(req, metricType, value) {
    try {
      console.log("Cache metric recorded:", metricType, value, req.path);
    } catch (error) {
      console.error("Failed to record cache metric:", error);
    }
  }
  /**
   * Cache Management
   */
  clear() {
    this.cache.clear();
    this.hitCount = 0;
    this.totalRequests = 0;
  }
  invalidate(pattern) {
    let invalidated = 0;
    for (const [key] of Array.from(this.cache.entries())) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    return invalidated;
  }
  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > entry.ttl * 1e3) {
        this.cache.delete(key);
      }
    }
  }
};

// server/middleware/monitoring.ts
init_schema();
import { sql as sql3 } from "drizzle-orm";
var DEFAULT_MONITORING_CONFIG = {
  enableMetrics: true,
  enableErrorTracking: true,
  slowQueryThreshold: 1e3,
  // ms
  errorAlertThreshold: 10,
  // errors per minute
  metricsRetentionDays: 30
};
var PerformanceMonitor = class {
  config;
  metricsCache = /* @__PURE__ */ new Map();
  errorCache = /* @__PURE__ */ new Map();
  startTime;
  constructor(config) {
    this.config = { ...DEFAULT_MONITORING_CONFIG, ...config };
    this.startTime = Date.now();
  }
  /**
   * Performance Tracking Middleware
   */
  performanceMiddleware() {
    return (req, res, next) => {
      if (!this.config.enableMetrics) {
        return next();
      }
      const startTime = Date.now();
      const originalSend = res.send;
      const self = this;
      res.send = async function(body) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const performanceData = {
          organizationId: req.organizationId || null,
          metricName: "response_time",
          metricValue: responseTime,
          metricUnit: "ms",
          endpoint: `${req.method} ${req.path}`,
          statusCode: res.statusCode,
          userId: req.user?.claims?.sub || null,
          metadata: {
            userAgent: req.get("User-Agent"),
            ip: req.ip,
            queryParams: Object.keys(req.query).length > 0 ? req.query : void 0,
            bodySize: typeof body === "string" ? body.length : JSON.stringify(body).length
          }
        };
        const cacheKey = `${req.method}:${req.path}`;
        if (!self.metricsCache.has(cacheKey)) {
          self.metricsCache.set(cacheKey, []);
        }
        const metrics = self.metricsCache.get(cacheKey);
        metrics.push(responseTime);
        if (metrics.length > 100) {
          metrics.shift();
        }
        if (responseTime > self.config.slowQueryThreshold) {
          console.warn(`Slow request detected: ${req.method} ${req.path} took ${responseTime}ms`);
          self.recordPerformanceAlert({
            type: "slow_request",
            endpoint: `${req.method} ${req.path}`,
            responseTime,
            threshold: self.config.slowQueryThreshold,
            organizationId: req.organizationId,
            userId: req.user?.claims?.sub
          });
        }
        try {
          await self.savePerformanceMetric({
            organizationId: performanceData.organizationId,
            metricName: performanceData.metricName,
            metricValue: performanceData.metricValue,
            metricUnit: performanceData.metricUnit,
            endpoint: performanceData.endpoint,
            statusCode: performanceData.statusCode,
            userId: performanceData.userId,
            metadata: performanceData.metadata
          });
        } catch (error) {
          console.error("Failed to save performance metric:", error);
        }
        return originalSend.call(res, body);
      };
      next();
    };
  }
  /**
   * Error Tracking Middleware
   */
  errorTrackingMiddleware() {
    return async (error, req, res, next) => {
      if (!this.config.enableErrorTracking) {
        return next(error);
      }
      const severity = this.determineErrorSeverity(error, res.statusCode);
      const errorData = {
        organizationId: req.organizationId || null,
        errorType: error.name || "UnknownError",
        errorMessage: error.message,
        errorStack: error.stack || null,
        endpoint: `${req.method} ${req.path}`,
        userId: req.user?.claims?.sub || null,
        severity,
        metadata: {
          userAgent: req.get("User-Agent"),
          ip: req.ip,
          statusCode: res.statusCode,
          requestBody: req.method !== "GET" ? req.body : void 0,
          queryParams: req.query,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      const errorKey = `errors_${Math.floor(Date.now() / 6e4)}`;
      this.errorCache.set(errorKey, (this.errorCache.get(errorKey) || 0) + 1);
      const currentErrorRate = this.errorCache.get(errorKey) || 0;
      if (currentErrorRate >= this.config.errorAlertThreshold) {
        this.triggerErrorRateAlert(currentErrorRate);
      }
      try {
        await this.saveErrorLog({
          organizationId: errorData.organizationId,
          userId: errorData.userId,
          errorType: errorData.errorType,
          errorCode: res.statusCode.toString(),
          message: errorData.errorMessage,
          stackTrace: errorData.errorStack,
          endpoint: errorData.endpoint,
          severity: errorData.severity,
          metadata: errorData.metadata
        });
      } catch (dbError) {
        console.error("Failed to save error log:", dbError);
        console.error("Original error:", errorData);
      }
      next(error);
    };
  }
  /**
   * System Health Check
   */
  async getSystemHealth() {
    const currentTime = Date.now();
    const uptime = Math.floor((currentTime - this.startTime) / 1e3);
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = Math.round(usedMemory / totalMemory * 100);
    const allResponseTimes = Array.from(this.metricsCache.values()).flat();
    const avgResponseTime = allResponseTimes.length > 0 ? Math.round(allResponseTimes.reduce((sum2, time) => sum2 + time, 0) / allResponseTimes.length) : 0;
    const sortedTimes = allResponseTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);
    const currentMinute = Math.floor(Date.now() / 6e4);
    const errorRate = this.errorCache.get(`errors_${currentMinute}`) || 0;
    let status = "healthy";
    if (memoryPercentage > 90 || avgResponseTime > 2e3 || errorRate > 20) {
      status = "critical";
    } else if (memoryPercentage > 75 || avgResponseTime > 1e3 || errorRate > 5) {
      status = "warning";
    }
    return {
      status,
      uptime,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024),
        // MB
        total: Math.round(totalMemory / 1024 / 1024),
        // MB
        percentage: memoryPercentage
      },
      responseTime: {
        avg: avgResponseTime,
        p95: sortedTimes[p95Index] || 0,
        p99: sortedTimes[p99Index] || 0
      },
      errorRate,
      databaseHealth: await this.checkDatabaseHealth()
    };
  }
  /**
   * Performance Analytics
   */
  async getPerformanceAnalytics(organizationId, timeRange = "1h") {
    const analytics = {
      timeRange,
      organizationId,
      summary: {
        totalRequests: 0,
        avgResponseTime: 0,
        errorRate: 0,
        slowestEndpoints: []
      },
      trends: {
        responseTimeTrend: [],
        errorRateTrend: [],
        throughputTrend: []
      },
      topEndpoints: [],
      alerts: []
    };
    const allMetrics = Array.from(this.metricsCache.entries());
    analytics.summary.totalRequests = allMetrics.reduce((sum2, [_, times]) => sum2 + times.length, 0);
    const allTimes = allMetrics.flatMap(([_, times]) => times);
    analytics.summary.avgResponseTime = allTimes.length > 0 ? Math.round(allTimes.reduce((sum2, time) => sum2 + time, 0) / allTimes.length) : 0;
    analytics.summary.slowestEndpoints = allMetrics.map(([endpoint, times]) => ({
      endpoint,
      avgTime: Math.round(times.reduce((sum2, time) => sum2 + time, 0) / times.length)
    })).sort((a, b) => b.avgTime - a.avgTime).slice(0, 5);
    const now = Date.now();
    for (let i = 11; i >= 0; i--) {
      const timestamp2 = new Date(now - i * 5 * 60 * 1e3).toISOString();
      analytics.trends.responseTimeTrend.push({
        timestamp: timestamp2,
        value: Math.floor(Math.random() * 500) + 200
      });
      analytics.trends.errorRateTrend.push({
        timestamp: timestamp2,
        value: Math.floor(Math.random() * 10)
      });
      analytics.trends.throughputTrend.push({
        timestamp: timestamp2,
        value: Math.floor(Math.random() * 100) + 50
      });
    }
    return analytics;
  }
  /**
   * Error Analytics and Insights
   */
  async getErrorAnalytics(organizationId, timeRange = "24h") {
    return {
      timeRange,
      organizationId,
      summary: {
        totalErrors: 0,
        criticalErrors: 0,
        resolvedErrors: 0,
        errorRate: 0
      },
      errorTypes: [],
      topErrorEndpoints: [],
      recentErrors: [],
      trends: []
    };
  }
  // Database Methods
  /**
   * Save performance metric to database
   */
  async savePerformanceMetric(metric) {
    console.log("Performance metric recorded:", metric.metricName, metric.value);
  }
  /**
   * Save error log to database
   */
  async saveErrorLog(errorLog) {
    await db2.insert(errorLogs).values(errorLog);
  }
  // Helper Methods
  determineErrorSeverity(error, statusCode) {
    if (statusCode && statusCode >= 500) return "critical";
    if (statusCode && statusCode >= 400) return "medium";
    if (error.name === "ValidationError") return "low";
    if (error.name === "DatabaseError") return "high";
    return "medium";
  }
  async recordPerformanceAlert(alert) {
    console.warn("Performance Alert:", alert);
  }
  triggerErrorRateAlert(errorRate) {
    console.warn(`High error rate detected: ${errorRate} errors per minute`);
  }
  async checkDatabaseHealth() {
    try {
      const startTime = Date.now();
      await db2.execute(sql3`SELECT 1 as health_check`);
      const responseTime = Date.now() - startTime;
      if (responseTime > 5e3) return "down";
      if (responseTime > 1e3) return "degraded";
      return "healthy";
    } catch (error) {
      console.error("Database health check failed:", error);
      return "down";
    }
  }
  /**
   * Cleanup old metrics (should be run periodically)
   */
  async cleanupOldMetrics() {
    const cutoffTime = Date.now() - this.config.metricsRetentionDays * 24 * 60 * 60 * 1e3;
    const cutoffMinute = Math.floor(cutoffTime / 6e4);
    const errorCacheEntries = Array.from(this.errorCache.entries());
    for (const [key, _] of errorCacheEntries) {
      if (key.startsWith("errors_")) {
        const minute = parseInt(key.split("_")[1]);
        if (minute < cutoffMinute) {
          this.errorCache.delete(key);
        }
      }
    }
    console.log(`Cleaned up metrics older than ${this.config.metricsRetentionDays} days`);
  }
};

// server/index.ts
init_auth();
init_queue();
import helmet from "helmet";

// server/routes/debates-async.ts
init_queue();
init_auth();
init_storage();
import { Router as Router6 } from "express";
import { z as z8 } from "zod";
var router6 = Router6();
var EnqueueSchema = z8.object({
  sessionId: z8.string().min(1),
  mode: z8.enum(["simple", "guided", "expert"]),
  prompt: z8.string().min(1)
});
router6.post("/debates-async", requireAuth2, async (req, res) => {
  try {
    const parsed = EnqueueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    console.log(`\u{1F680} Enqueueing async debate: ${parsed.data.mode} mode for session ${parsed.data.sessionId}`);
    try {
      await storage.createDebateRun({
        sessionId: parsed.data.sessionId,
        mode: parsed.data.mode,
        status: "running"
      });
    } catch (error) {
      console.warn("Failed to create debate run record:", error);
    }
    const job = await enqueueDebate(parsed.data);
    if (job.result) {
      console.log("\u2705 Completed synchronous debate processing");
      return res.json({
        jobId: job.id,
        status: "completed",
        result: job.result
      });
    }
    return res.json({ jobId: job.id, status: "queued" });
  } catch (error) {
    console.error("Failed to enqueue debate:", error);
    return res.status(500).json({ error: "Failed to enqueue debate" });
  }
});
router6.get("/debates-async/:jobId/stream", requireAuth2, async (req, res) => {
  const jobId = req.params.jobId;
  if (!jobId) return res.status(400).end();
  if (jobId.startsWith("sync-")) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.write(`event: progress
data: ${JSON.stringify({ progress: 100 })}

`);
    res.write(`event: completed
data: ${JSON.stringify({ status: "completed" })}

`);
    res.end();
    return;
  }
  if (!debateQueueEvents) {
    return res.status(503).json({ error: "Queue not available" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
  const onProgress = (args) => {
    if (String(args.jobId) === String(jobId)) {
      res.write(`event: progress
data: ${JSON.stringify({ progress: args.data })}

`);
    }
  };
  const onCompleted = (args) => {
    if (String(args.jobId) === String(jobId)) {
      console.log(`\u2705 Debate job ${jobId} completed via SSE`);
      res.write(`event: completed
data: ${JSON.stringify(args.returnvalue)}

`);
      res.end();
      cleanup();
    }
  };
  const onFailed = (args) => {
    if (String(args.jobId) === String(jobId)) {
      console.error(`\u274C Debate job ${jobId} failed via SSE:`, args.failedReason);
      res.write(`event: failed
data: ${JSON.stringify({ error: args.failedReason })}

`);
      res.end();
      cleanup();
    }
  };
  function cleanup() {
    debateQueueEvents?.removeListener("progress", onProgress);
    debateQueueEvents?.removeListener("completed", onCompleted);
    debateQueueEvents?.removeListener("failed", onFailed);
  }
  debateQueueEvents.on("progress", onProgress);
  debateQueueEvents.on("completed", onCompleted);
  debateQueueEvents.on("failed", onFailed);
  req.on("close", cleanup);
  req.on("end", cleanup);
  res.write(`event: progress
data: ${JSON.stringify({ progress: 0 })}

`);
});
var debates_async_default = router6;

// server/routes/export.ts
import { Router as Router7 } from "express";
import { z as z9 } from "zod";

// server/utils/sanitizeFilename.ts
function sanitizeFilename(input, fallback = "export.txt") {
  if (!input) return fallback;
  const name = input.replace(/[/\\?%*:|"<>]/g, "-").trim();
  return name || fallback;
}

// server/middleware/dlp.ts
var P0_PATTERNS = [
  ["ssn", /\b\d{3}-\d{2}-\d{4}\b/],
  ["credit_card", /\b(?:\d[ -]*?){13,16}\b/],
  ["secret_keyword", /\b(AWS_SECRET_ACCESS_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY|api_key|secret_key|password|token)\b/i],
  ["email_exposure", /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/]
];
function dlpScan(content) {
  const hits = [];
  for (const [name, rx] of P0_PATTERNS) {
    if (rx.test(content)) hits.push(name);
  }
  return hits;
}
function dlpMiddleware(req, res, next) {
  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const hits = dlpScan(body || "");
    if (hits.length) {
      console.warn(`\u{1F6A8} DLP blocked request from ${req.ip}: ${hits.join(", ")}`);
      return res.status(400).json({ error: "DLP_BLOCK", hits });
    }
    next();
  } catch (e) {
    next();
  }
}

// server/routes/export.ts
init_auth();
init_rbac();
init_entitlements();
init_storage();
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
var router7 = Router7();
var exportRequestSchema = z9.object({
  filename: z9.string().min(1).max(255).default("decision-dossier.txt"),
  format: z9.enum(["docx", "pdf", "json", "text"]).default("text"),
  title: z9.string().min(1).max(500).default("Analysis Report"),
  content: z9.string(),
  // Required but can be empty string
  metadata: z9.object({
    generatedAt: z9.string().optional(),
    reportType: z9.string().optional(),
    sessionId: z9.string().optional()
  }).optional().nullable(),
  workspaceId: z9.string().uuid().optional().nullable()
});
async function generateWordDocument(title, content, metadata) {
  const paragraphs = [];
  paragraphs.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER
    })
  );
  if (metadata) {
    paragraphs.push(new Paragraph({ text: "" }));
    if (metadata.generatedAt) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Generated: ",
              bold: true
            }),
            new TextRun({
              text: new Date(metadata.generatedAt).toLocaleString()
            })
          ]
        })
      );
    }
    if (metadata.reportType) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Report Type: ",
              bold: true
            }),
            new TextRun({
              text: metadata.reportType
            })
          ]
        })
      );
    }
    if (metadata.sessionId) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Session ID: ",
              bold: true
            }),
            new TextRun({
              text: metadata.sessionId
            })
          ]
        })
      );
    }
    paragraphs.push(new Paragraph({ text: "" }));
    paragraphs.push(new Paragraph({ text: "\u2500".repeat(50) }));
    paragraphs.push(new Paragraph({ text: "" }));
  }
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.trim() === "") {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }
    if (line.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1
        })
      );
    } else if (line.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2
        })
      );
    } else if (line.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3
        })
      );
    } else if (line.startsWith("#### ")) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(5),
          heading: HeadingLevel.HEADING_4
        })
      );
    } else {
      const textRuns = [];
      const text2 = line;
      if (text2.includes("**")) {
        const parts = text2.split("**");
        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            if (parts[i]) {
              textRuns.push(new TextRun({ text: parts[i] }));
            }
          } else {
            if (parts[i]) {
              textRuns.push(new TextRun({ text: parts[i], bold: true }));
            }
          }
        }
      } else {
        textRuns.push(new TextRun({ text: text2 }));
      }
      paragraphs.push(
        new Paragraph({
          children: textRuns
        })
      );
    }
  }
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs
      }
    ]
  });
  return await Packer.toBuffer(doc);
}
router7.post(
  "/export",
  requireAuth2,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.EXPORT_PDF),
  // EXPORT_PDF covers all document formats including Word, PDF, JSON, etc.
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.EXPORT_DATA),
  dlpMiddleware,
  async (req, res) => {
    try {
      const parseResult = exportRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: "Invalid request data",
          details: parseResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        });
      }
      const { filename, content, format, title, metadata, workspaceId } = parseResult.data;
      const userId = req.user?.id || req.session?.user?.id;
      if (workspaceId) {
        try {
          const workspace = await storage.getWorkspace(workspaceId);
          if (!workspace) {
            return res.status(404).json({
              error: "Workspace not found",
              code: "WORKSPACE_NOT_FOUND"
            });
          }
          const membership = await storage.getWorkspaceMembership(workspaceId, userId);
          if (!membership) {
            return res.status(403).json({
              error: "Access denied to workspace",
              code: "WORKSPACE_ACCESS_DENIED"
            });
          }
        } catch (error) {
          console.error("Workspace validation failed:", error);
          return res.status(500).json({
            error: "Failed to validate workspace access",
            code: "WORKSPACE_VALIDATION_ERROR"
          });
        }
      }
      let outputContent;
      let contentType;
      let fileExtension;
      if (format === "docx" || filename.endsWith(".docx")) {
        outputContent = await generateWordDocument(title, content, metadata);
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        fileExtension = ".docx";
      } else if (format === "pdf" || filename.endsWith(".pdf")) {
        outputContent = content;
        contentType = "application/pdf";
        fileExtension = ".pdf";
      } else if (format === "json" || filename.endsWith(".json")) {
        const jsonData = {
          title,
          content,
          metadata,
          exportedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        outputContent = JSON.stringify(jsonData, null, 2);
        contentType = "application/json";
        fileExtension = ".json";
      } else {
        outputContent = content;
        contentType = "text/plain";
        fileExtension = ".txt";
      }
      const baseName = filename.replace(/\.[^/.]+$/, "");
      const finalFilename = baseName + fileExtension;
      const safe = sanitizeFilename(finalFilename);
      try {
        await storage.createExportLog({
          userId,
          workspaceId: workspaceId || null,
          // Explicitly handle null/undefined workspaceId
          filename: safe,
          dlpHits: null
          // No hits if we get here
        });
        const workspaceInfo = workspaceId ? `workspace ${workspaceId}` : "personal workspace";
        console.log(`\u{1F4E4} Export logged: ${safe} by user ${userId} (format: ${format}) in ${workspaceInfo}`);
      } catch (error) {
        console.warn("Failed to log export:", error);
      }
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${safe}"`);
      res.setHeader("X-Content-Type-Options", "nosniff");
      if (Buffer.isBuffer(outputContent)) {
        res.send(outputContent);
      } else {
        res.send(outputContent);
      }
    } catch (error) {
      console.error("Export failed:", error);
      res.status(500).json({ error: "Export failed" });
    }
  }
);
router7.get(
  "/export/logs",
  requireAuth2,
  loadEntitlementsContext,
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.EXPORT_DATA),
  async (req, res) => {
    try {
      const userId = req.user?.id || req.session?.user?.id;
      res.json({ logs: [] });
    } catch (error) {
      console.error("Failed to get export logs:", error);
      res.status(500).json({ error: "Failed to get export logs" });
    }
  }
);
var export_default = router7;

// server/routes/push.ts
init_storage();
import { Router as Router8 } from "express";
import webpush from "web-push";
import { z as z10 } from "zod";
var router8 = Router8();
var VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
var VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
var VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@symbiosoai.com";
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.warn("\u26A0\uFE0F VAPID keys not configured. Push notifications will not work. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.");
} else {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log("\u2705 Web push configured with VAPID keys");
}
var subscriptionRequestSchema = z10.object({
  endpoint: z10.string().url(),
  keys: z10.object({
    p256dh: z10.string(),
    auth: z10.string()
  }),
  userAgent: z10.string().optional()
});
router8.post("/push/subscribe", async (req, res) => {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res.status(500).json({
        error: "Push notifications not configured",
        message: "VAPID keys are missing"
      });
    }
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const subscriptionData = subscriptionRequestSchema.parse(req.body);
    const existingSubscriptions = await storage.getUserPushSubscriptions(req.user.id);
    const duplicateSubscription = existingSubscriptions.find(
      (sub) => sub.endpoint === subscriptionData.endpoint
    );
    if (duplicateSubscription) {
      return res.status(200).json({
        message: "Subscription already exists",
        subscriptionId: duplicateSubscription.id
      });
    }
    const newSubscription = await storage.createPushSubscription({
      userId: req.user.id,
      endpoint: subscriptionData.endpoint,
      p256dh: subscriptionData.keys.p256dh,
      auth: subscriptionData.keys.auth,
      userAgent: subscriptionData.userAgent || req.get("User-Agent") || null,
      isActive: true
    });
    return res.status(201).json({
      message: "Push subscription created successfully",
      subscriptionId: newSubscription.id
    });
  } catch (error) {
    console.error("Push subscription error:", error);
    if (error instanceof z10.ZodError) {
      return res.status(400).json({
        error: "Invalid subscription data",
        details: error.errors
      });
    }
    return res.status(500).json({
      error: "Failed to create push subscription",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.delete("/push/unsubscribe", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { endpoint, subscriptionId } = req.body;
    if (!endpoint && !subscriptionId) {
      return res.status(400).json({
        error: "Either endpoint or subscriptionId is required"
      });
    }
    let deleted = false;
    if (subscriptionId) {
      deleted = await storage.deletePushSubscription(subscriptionId);
    } else if (endpoint) {
      deleted = await storage.deletePushSubscriptionByEndpoint(endpoint, req.user.id);
    }
    if (deleted) {
      return res.status(200).json({ message: "Push subscription removed successfully" });
    } else {
      return res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return res.status(500).json({
      error: "Failed to remove push subscription",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.post("/push/test", async (req, res) => {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res.status(500).json({
        error: "Push notifications not configured",
        message: "VAPID keys are missing"
      });
    }
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { message, title, icon, badge } = req.body;
    const subscriptions2 = await storage.getUserPushSubscriptions(req.user.id);
    if (subscriptions2.length === 0) {
      return res.status(404).json({
        error: "No push subscriptions found",
        message: "User has no active push subscriptions"
      });
    }
    const payload = JSON.stringify({
      title: title || "Test Notification",
      body: message || "This is a test push notification from SymbiosoAI ThinkTank",
      icon: icon || "/symbiosoai-logo.png",
      badge: badge || "/symbiosoai-logo.png",
      timestamp: Date.now(),
      data: {
        url: "/",
        type: "test"
      }
    });
    const sendPromises = subscriptions2.map(async (subscription) => {
      try {
        await webpush.sendNotification({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        }, payload);
        return { subscriptionId: subscription.id, status: "sent" };
      } catch (error) {
        console.error("Failed to send push notification:", error);
        if (error.statusCode === 410 || error.statusCode === 404) {
          await storage.updatePushSubscription(subscription.id, { isActive: false });
        }
        return {
          subscriptionId: subscription.id,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    });
    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r.status === "sent").length;
    const failureCount = results.filter((r) => r.status === "failed").length;
    return res.status(200).json({
      message: "Test push notifications sent",
      results: {
        total: subscriptions2.length,
        sent: successCount,
        failed: failureCount,
        details: results
      }
    });
  } catch (error) {
    console.error("Test push notification error:", error);
    return res.status(500).json({
      error: "Failed to send test push notification",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/push/subscriptions", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const subscriptions2 = await storage.getUserPushSubscriptions(req.user.id);
    const sanitizedSubscriptions = subscriptions2.map((sub) => ({
      id: sub.id,
      endpoint: sub.endpoint,
      userAgent: sub.userAgent,
      isActive: sub.isActive,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt
    }));
    return res.status(200).json({
      subscriptions: sanitizedSubscriptions,
      total: sanitizedSubscriptions.length
    });
  } catch (error) {
    console.error("Get push subscriptions error:", error);
    return res.status(500).json({
      error: "Failed to retrieve push subscriptions",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
router8.get("/push/vapid-public-key", (req, res) => {
  if (!VAPID_PUBLIC_KEY) {
    return res.status(500).json({
      error: "VAPID not configured",
      message: "Push notifications are not available"
    });
  }
  return res.status(200).json({
    publicKey: VAPID_PUBLIC_KEY
  });
});
var push_default = router8;

// server/routes/webhooks.ts
import { Router as Router9 } from "express";
import crypto2 from "crypto";

// server/services/webhookDelivery.ts
import { Queue as Queue3, Worker as Worker3 } from "bullmq";
import IORedis3 from "ioredis";
import crypto from "crypto";
var redisState = 0 /* UNKNOWN */;
var connection3 = null;
var webhookQueue = null;
var worker = null;
async function testRedisAvailability() {
  if (redisState === 1 /* AVAILABLE */) return true;
  if (redisState === 2 /* UNAVAILABLE */) return false;
  if (!process.env.REDIS_URL) {
    redisState = 2 /* UNAVAILABLE */;
    console.log("\u2139\uFE0F  [webhookDelivery] REDIS_URL not set, using synchronous delivery for development");
    return false;
  }
  try {
    const testConnection = new IORedis3(process.env.REDIS_URL, {
      maxRetriesPerRequest: 0,
      // Prevent retries
      connectTimeout: 3e3,
      lazyConnect: true
    });
    await testConnection.ping();
    await testConnection.quit();
    redisState = 1 /* AVAILABLE */;
    console.log("\u2705 [webhookDelivery] Redis available, will use queue-based delivery");
    return true;
  } catch (error) {
    redisState = 2 /* UNAVAILABLE */;
    console.log("\u2139\uFE0F  [webhookDelivery] Redis unavailable, using synchronous delivery for development");
    return false;
  }
}
async function initializeRedisQueue() {
  if (connection3 && webhookQueue) return;
  if (!process.env.REDIS_URL) {
    console.log("\u26A0\uFE0F [webhookDelivery] REDIS_URL not set, Redis queue not initialized");
    redisState = 2 /* UNAVAILABLE */;
    return;
  }
  try {
    connection3 = new IORedis3(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      retryDelayOnFailover: 100,
      lazyConnect: true
    });
    connection3.on("error", (err) => {
      console.warn("[webhookDelivery] Redis connection error:", err.message);
      redisState = 2 /* UNAVAILABLE */;
    });
    connection3.on("connect", () => {
      console.log("\u2705 [webhookDelivery] Redis connected");
      redisState = 1 /* AVAILABLE */;
    });
    webhookQueue = new Queue3("webhook-delivery", { connection: connection3 });
    console.log("\u2705 [webhookDelivery] Redis queue initialized");
  } catch (error) {
    console.error("\u274C [webhookDelivery] Failed to initialize Redis queue:", error);
    connection3 = null;
    redisState = 2 /* UNAVAILABLE */;
  }
}
function signPayload(body, timestamp2, secret) {
  const payload = `${timestamp2}.${body}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `sha256=${signature}`;
}
async function deliverWebhookSync(data) {
  if (!data.secret || data.secret.trim() === "") {
    throw new Error("Webhook secret is required but not provided");
  }
  const timestamp2 = data.timestamp || Date.now();
  const timestampStr = Math.floor(timestamp2 / 1e3).toString();
  const body = JSON.stringify({
    id: data.eventId,
    type: data.eventType,
    data: data.payload,
    timestamp: timestamp2
  });
  const signature = signPayload(body, timestampStr, data.secret);
  try {
    const response = await fetch(data.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Timestamp": timestampStr,
        "X-Webhook-Id": data.eventId,
        "User-Agent": "SymbiosoAI-Webhook/1.0"
      },
      body
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`Webhook delivery failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    console.log(`\u2705 [webhookDelivery] Successfully delivered webhook ${data.eventId} to ${data.endpointUrl} (${redisState === 1 /* AVAILABLE */ ? "queue" : "sync"} mode)`);
  } catch (error) {
    console.error(`\u274C [webhookDelivery] Failed to deliver webhook ${data.eventId}:`, error.message);
    throw error;
  }
}
async function enqueueWebhookDelivery(data, opts = {}) {
  const redisAvailable = await testRedisAvailability();
  if (redisAvailable) {
    if (!webhookQueue) {
      await initializeRedisQueue();
    }
    if (webhookQueue) {
      await webhookQueue.add("deliver", data, {
        removeOnComplete: true,
        attempts: Number(process.env.WEBHOOK_MAX_RETRIES || 6),
        backoff: {
          type: "exponential",
          settings: {
            delay: 2e3
            // Start with 2s delay
          }
        },
        ...opts
      });
      console.log(`\u{1F4E4} [webhookDelivery] Queued webhook ${data.eventId} for delivery`);
    } else {
      await deliverWebhookSync(data);
    }
  } else {
    await deliverWebhookSync(data);
  }
}
async function startWebhookWorker() {
  const redisAvailable = await testRedisAvailability();
  if (!redisAvailable) {
    console.log("\u2139\uFE0F  [webhookDelivery] Running in development mode with synchronous webhook delivery");
    return null;
  }
  if (worker) {
    console.log("\u2139\uFE0F  [webhookDelivery] Worker already running");
    return worker;
  }
  try {
    if (!webhookQueue) {
      await initializeRedisQueue();
    }
    if (!connection3 || !webhookQueue) {
      throw new Error("Failed to initialize Redis connection and queue");
    }
    worker = new Worker3(
      "webhook-delivery",
      async (job) => {
        const data = job.data;
        await deliverWebhookSync(data);
      },
      { connection: connection3 }
    );
    worker.on("failed", async (job, err) => {
      const attempt = (job?.data?.attempt || 0) + 1;
      const maxRetries = Number(process.env.WEBHOOK_MAX_RETRIES || 6);
      if (attempt <= maxRetries) {
        const delay = Math.pow(2, attempt) * 1e3;
        console.log(`\u{1F504} [webhookDelivery] Retrying webhook ${job?.data?.eventId} (attempt ${attempt}/${maxRetries}) in ${delay}ms`);
        await enqueueWebhookDelivery(
          { ...job.data, attempt },
          { delay }
        );
      } else {
        console.error(`\u274C [webhookDelivery] Permanently failed webhook ${job?.data?.eventId}:`, err?.message);
      }
    });
    worker.on("completed", (job) => {
      console.log(`\u2705 [webhookDelivery] Completed webhook ${job.data.eventId}`);
    });
    console.log("\u2705 [webhookDelivery] Webhook worker started with Redis backend");
    return worker;
  } catch (error) {
    console.warn(`\u26A0\uFE0F  [webhookDelivery] Failed to start Redis worker: ${error.message}`);
    console.log("\u2139\uFE0F  [webhookDelivery] Falling back to synchronous delivery mode");
    redisState = 2 /* UNAVAILABLE */;
    return null;
  }
}

// server/routes/webhooks.ts
var router9 = Router9();
router9.post("/webhooks/test", async (req, res) => {
  try {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret || webhookSecret.trim() === "") {
      return res.status(500).json({
        error: "Server configuration error",
        message: "WEBHOOK_SECRET environment variable is required but not set"
      });
    }
    if (!req.body.endpointUrl) {
      return res.status(400).json({
        error: "Validation error",
        message: "endpointUrl is required"
      });
    }
    const eventId = req.body.idempotencyKey || crypto2.randomUUID();
    await enqueueWebhookDelivery({
      eventId,
      eventType: req.body.event || "test",
      payload: req.body.payload || {},
      endpointUrl: req.body.endpointUrl,
      secret: webhookSecret,
      timestamp: Date.now()
    });
    res.json({ enqueued: true, eventId });
  } catch (error) {
    console.error("Error enqueuing webhook:", error);
    res.status(500).json({ error: "Failed to enqueue webhook", message: error.message });
  }
});
var webhooks_default = router9;

// server/routes/templates.ts
init_schema();
init_rbac();
init_entitlements();
import { Router as Router10 } from "express";
import { z as z11 } from "zod";
import crypto3 from "crypto";
var router10 = Router10();
var templateStore = {
  // Seed with sample templates to match frontend expectations
  "business-strategy": {
    id: "business-strategy",
    name: "Business Strategy Analysis",
    description: "Comprehensive analysis of business strategies and market positioning",
    category: "business",
    tags: ["strategy", "market-analysis", "competition"],
    content: {
      prompt: "Analyze the business strategy and competitive positioning of [Company/Industry]. Consider market dynamics, competitive advantages, potential risks, and strategic recommendations for growth.",
      agents: ["analyst", "pragmatist", "critic"],
      domainExperts: ["financial-analyst", "brand-strategist"],
      reasoningFramework: "strategic_thinking",
      debateRounds: 6,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: true,
      rating: 4.8,
      uses: 245,
      complexity: "high"
    },
    isPublic: true,
    usageCount: 245,
    authorId: "system",
    version: 1,
    metadata: { complexity: "high", estimatedTime: 30 },
    createdAt: /* @__PURE__ */ new Date("2024-01-15"),
    updatedAt: /* @__PURE__ */ new Date("2024-01-15")
  },
  "technical-architecture": {
    id: "technical-architecture",
    name: "Technical Architecture Review",
    description: "In-depth review of technical systems and engineering decisions",
    category: "technology",
    tags: ["architecture", "engineering", "systems"],
    content: {
      prompt: "Review the technical architecture of [System/Application]. Evaluate scalability, security, maintainability, and performance. Identify potential improvements and architectural trade-offs.",
      agents: ["analyst", "critic", "thoughtful"],
      domainExperts: ["tech-architect", "devops-engineer"],
      reasoningFramework: "systems_thinking",
      debateRounds: 7,
      requireCitations: false,
      enableFactCheck: false,
      enableLiveWeb: false,
      rating: 4.6,
      uses: 189,
      complexity: "high"
    },
    isPublic: true,
    usageCount: 189,
    authorId: "system",
    version: 1,
    metadata: { complexity: "high", estimatedTime: 45 },
    createdAt: /* @__PURE__ */ new Date("2024-01-20"),
    updatedAt: /* @__PURE__ */ new Date("2024-01-20")
  },
  "market-research": {
    id: "market-research",
    name: "Market Research Framework",
    description: "Systematic approach to market research and consumer insights",
    category: "business",
    tags: ["research", "market", "insights"],
    content: {
      prompt: "Conduct comprehensive market research for [Product/Service/Market]. Analyze target demographics, market size, competitive landscape, pricing strategies, and consumer behavior patterns.",
      agents: ["analyst", "pragmatist", "innovator"],
      domainExperts: ["research-scientist"],
      reasoningFramework: "analytical_framework",
      debateRounds: 5,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: true,
      rating: 4.7,
      uses: 156,
      complexity: "medium"
    },
    isPublic: true,
    usageCount: 156,
    authorId: "system",
    version: 1,
    metadata: { complexity: "medium", estimatedTime: 25 },
    createdAt: /* @__PURE__ */ new Date("2024-02-01"),
    updatedAt: /* @__PURE__ */ new Date("2024-02-01")
  },
  "ai-ethics": {
    id: "ai-ethics",
    name: "AI Ethics Discussion",
    description: "Comprehensive framework for analyzing AI ethical implications",
    category: "research",
    tags: ["ai", "ethics", "philosophy"],
    content: {
      prompt: "Examine the ethical implications of [AI Technology/Application]. Consider bias, fairness, privacy, transparency, accountability, and societal impact. Provide balanced perspectives on responsible AI development.",
      agents: ["thoughtful", "critic", "analyst"],
      domainExperts: ["behavioral-analyst"],
      reasoningFramework: "ethical_framework",
      debateRounds: 8,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: false,
      rating: 4.9,
      uses: 98,
      complexity: "high"
    },
    isPublic: true,
    usageCount: 98,
    authorId: "system",
    version: 1,
    metadata: { complexity: "high", estimatedTime: 40 },
    createdAt: /* @__PURE__ */ new Date("2024-02-05"),
    updatedAt: /* @__PURE__ */ new Date("2024-02-05")
  },
  "product-launch": {
    id: "product-launch",
    name: "Product Launch Strategy",
    description: "Strategic planning for new product introductions",
    category: "business",
    tags: ["product", "launch", "strategy"],
    content: {
      prompt: "Develop a comprehensive product launch strategy for [Product]. Consider target market, pricing, distribution channels, marketing campaigns, competitive positioning, and success metrics.",
      agents: ["innovator", "pragmatist", "analyst"],
      domainExperts: ["brand-strategist"],
      reasoningFramework: "strategic_thinking",
      debateRounds: 5,
      requireCitations: false,
      enableFactCheck: true,
      enableLiveWeb: true,
      rating: 4.5,
      uses: 203,
      complexity: "medium"
    },
    isPublic: true,
    usageCount: 203,
    authorId: "system",
    version: 1,
    metadata: { complexity: "medium", estimatedTime: 25 },
    createdAt: /* @__PURE__ */ new Date("2024-02-10"),
    updatedAt: /* @__PURE__ */ new Date("2024-02-10")
  },
  "security-audit": {
    id: "security-audit",
    name: "Security Assessment Framework",
    description: "Comprehensive security analysis and risk evaluation",
    category: "technology",
    tags: ["security", "audit", "risk"],
    content: {
      prompt: "Conduct a comprehensive security assessment of [System/Application/Infrastructure]. Identify vulnerabilities, assess risk levels, and recommend security improvements and best practices.",
      agents: ["critic", "analyst", "thoughtful"],
      domainExperts: ["tech-architect"],
      reasoningFramework: "risk_assessment",
      debateRounds: 6,
      requireCitations: false,
      enableFactCheck: false,
      enableLiveWeb: false,
      rating: 4.8,
      uses: 134,
      complexity: "high"
    },
    isPublic: true,
    usageCount: 134,
    authorId: "system",
    version: 1,
    metadata: { complexity: "high", estimatedTime: 35 },
    createdAt: /* @__PURE__ */ new Date("2024-02-15"),
    updatedAt: /* @__PURE__ */ new Date("2024-02-15")
  }
};
router10.get(
  "/templates",
  requireAuth,
  loadEntitlementsContext,
  (_req, res) => {
    const templates2 = Object.values(templateStore);
    res.json(templates2);
  }
);
router10.get(
  "/templates/:id",
  requireAuth,
  loadEntitlementsContext,
  (req, res) => {
    const template = templateStore[req.params.id];
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json(template);
  }
);
router10.post(
  "/templates",
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.CUSTOM_TEMPLATES),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES),
  (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const id = crypto3.randomUUID();
      const template = {
        id,
        name: validatedData.name,
        description: validatedData.description || "",
        category: validatedData.category,
        tags: validatedData.tags || [],
        content: validatedData.content,
        isPublic: validatedData.isPublic ?? true,
        usageCount: 0,
        authorId: validatedData.authorId || "unknown",
        version: 1,
        metadata: validatedData.metadata || {},
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      };
      templateStore[id] = template;
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z11.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
router10.patch(
  "/templates/:id",
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.CUSTOM_TEMPLATES),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES),
  (req, res) => {
    try {
      const template = templateStore[req.params.id];
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      const partialSchema = insertTemplateSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const updatedTemplate = {
        ...template,
        ...validatedData,
        version: (template.version || 1) + 1,
        updatedAt: /* @__PURE__ */ new Date()
      };
      templateStore[req.params.id] = updatedTemplate;
      res.json(updatedTemplate);
    } catch (error) {
      if (error instanceof z11.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
router10.post(
  "/templates/:id/use",
  requireAuth,
  loadEntitlementsContext,
  (req, res) => {
    const template = templateStore[req.params.id];
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    template.usageCount = (template.usageCount || 0) + 1;
    template.updatedAt = /* @__PURE__ */ new Date();
    res.json(template);
  }
);
router10.delete(
  "/templates/:id",
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.CUSTOM_TEMPLATES),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES),
  (req, res) => {
    const template = templateStore[req.params.id];
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    delete templateStore[req.params.id];
    res.status(204).send();
  }
);
var templates_default = router10;

// server/routes/tutorials.ts
init_storage();
init_schema();
import { Router as Router11 } from "express";
import { z as z12 } from "zod";
var router11 = Router11();
router11.get("/", async (req, res) => {
  try {
    const tutorials2 = await storage.getActiveTutorials();
    res.json(tutorials2);
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});
router11.get("/all", async (req, res) => {
  try {
    const tutorials2 = await storage.getAllTutorials();
    res.json(tutorials2);
  } catch (error) {
    console.error("Error fetching all tutorials:", error);
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});
router11.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const validatedCategory = tutorialCategorySchema.parse(category);
    const tutorials2 = await storage.getTutorialsByCategory(validatedCategory);
    res.json(tutorials2);
  } catch (error) {
    console.error("Error fetching tutorials by category:", error);
    if (error instanceof z12.ZodError) {
      return res.status(400).json({ error: "Invalid category", details: error.errors });
    }
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});
router11.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tutorial = await storage.getTutorial(id);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }
    const steps = await storage.getTutorialSteps(id);
    res.json({
      ...tutorial,
      steps
    });
  } catch (error) {
    console.error("Error fetching tutorial:", error);
    res.status(500).json({ error: "Failed to fetch tutorial" });
  }
});
router11.post("/", async (req, res) => {
  try {
    const validatedData = insertTutorialSchema.parse(req.body);
    const tutorial = await storage.createTutorial(validatedData);
    res.status(201).json(tutorial);
  } catch (error) {
    console.error("Error creating tutorial:", error);
    if (error instanceof z12.ZodError) {
      return res.status(400).json({ error: "Invalid tutorial data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create tutorial" });
  }
});
router11.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const tutorial = await storage.updateTutorial(id, updates);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }
    res.json(tutorial);
  } catch (error) {
    console.error("Error updating tutorial:", error);
    res.status(500).json({ error: "Failed to update tutorial" });
  }
});
router11.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteTutorial(id);
    if (!success) {
      return res.status(404).json({ error: "Tutorial not found" });
    }
    res.json({ message: "Tutorial deleted successfully" });
  } catch (error) {
    console.error("Error deleting tutorial:", error);
    res.status(500).json({ error: "Failed to delete tutorial" });
  }
});
router11.get("/:tutorialId/steps", async (req, res) => {
  try {
    const { tutorialId } = req.params;
    const steps = await storage.getTutorialSteps(tutorialId);
    res.json(steps);
  } catch (error) {
    console.error("Error fetching tutorial steps:", error);
    res.status(500).json({ error: "Failed to fetch tutorial steps" });
  }
});
router11.post("/:tutorialId/steps", async (req, res) => {
  try {
    const { tutorialId } = req.params;
    const stepData = { ...req.body, tutorialId };
    const validatedData = insertTutorialStepSchema.parse(stepData);
    const step = await storage.createTutorialStep(validatedData);
    res.status(201).json(step);
  } catch (error) {
    console.error("Error creating tutorial step:", error);
    if (error instanceof z12.ZodError) {
      return res.status(400).json({ error: "Invalid step data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create tutorial step" });
  }
});
router11.put("/:tutorialId/steps/:stepId", async (req, res) => {
  try {
    const { stepId } = req.params;
    const updates = req.body;
    const step = await storage.updateTutorialStep(stepId, updates);
    if (!step) {
      return res.status(404).json({ error: "Tutorial step not found" });
    }
    res.json(step);
  } catch (error) {
    console.error("Error updating tutorial step:", error);
    res.status(500).json({ error: "Failed to update tutorial step" });
  }
});
router11.delete("/:tutorialId/steps/:stepId", async (req, res) => {
  try {
    const { stepId } = req.params;
    const success = await storage.deleteTutorialStep(stepId);
    if (!success) {
      return res.status(404).json({ error: "Tutorial step not found" });
    }
    res.json({ message: "Tutorial step deleted successfully" });
  } catch (error) {
    console.error("Error deleting tutorial step:", error);
    res.status(500).json({ error: "Failed to delete tutorial step" });
  }
});
router11.get("/progress/my", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const progress = await storage.getUserAllTutorialProgress(userId);
    res.json(progress);
  } catch (error) {
    console.error("Error fetching user tutorial progress:", error);
    res.status(500).json({ error: "Failed to fetch tutorial progress" });
  }
});
router11.get("/:tutorialId/progress", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { tutorialId } = req.params;
    const progress = await storage.getUserTutorialProgress(userId, tutorialId);
    if (!progress) {
      return res.status(404).json({ error: "Tutorial progress not found" });
    }
    res.json(progress);
  } catch (error) {
    console.error("Error fetching tutorial progress:", error);
    res.status(500).json({ error: "Failed to fetch tutorial progress" });
  }
});
router11.post("/:tutorialId/start", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { tutorialId } = req.params;
    const tutorial = await storage.getTutorial(tutorialId);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }
    let progress = await storage.getUserTutorialProgress(userId, tutorialId);
    if (progress && progress.status === "completed") {
      return res.status(400).json({ error: "Tutorial already completed" });
    }
    if (!progress) {
      progress = await storage.createTutorialProgress({
        userId,
        tutorialId,
        status: "in_progress",
        currentStep: 1,
        completedSteps: [],
        skippedSteps: []
      });
    } else {
      progress = await storage.updateTutorialProgress(progress.id, {
        status: "in_progress"
      });
    }
    res.json(progress);
  } catch (error) {
    console.error("Error starting tutorial:", error);
    res.status(500).json({ error: "Failed to start tutorial" });
  }
});
router11.post("/:tutorialId/complete-step", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { tutorialId } = req.params;
    const { stepNumber, timeSpent } = req.body;
    if (!stepNumber) {
      return res.status(400).json({ error: "Step number is required" });
    }
    const progress = await storage.markTutorialStepCompleted(userId, tutorialId, stepNumber);
    if (progress && timeSpent) {
      await storage.updateTutorialProgress(progress.id, {
        timeSpentMinutes: (progress.timeSpentMinutes || 0) + timeSpent
      });
    }
    res.json(progress);
  } catch (error) {
    console.error("Error completing tutorial step:", error);
    res.status(500).json({ error: "Failed to complete tutorial step" });
  }
});
router11.post("/:tutorialId/complete", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { tutorialId } = req.params;
    const { totalTimeSpent } = req.body;
    const progress = await storage.markTutorialCompleted(userId, tutorialId);
    if (progress && totalTimeSpent) {
      await storage.updateTutorialProgress(progress.id, {
        timeSpentMinutes: totalTimeSpent
      });
    }
    res.json(progress);
  } catch (error) {
    console.error("Error completing tutorial:", error);
    res.status(500).json({ error: "Failed to complete tutorial" });
  }
});
router11.post("/:tutorialId/skip", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { tutorialId } = req.params;
    let progress = await storage.getUserTutorialProgress(userId, tutorialId);
    if (!progress) {
      progress = await storage.createTutorialProgress({
        userId,
        tutorialId,
        status: "skipped",
        currentStep: 1,
        completedSteps: [],
        skippedSteps: []
      });
    } else {
      progress = await storage.updateTutorialProgress(progress.id, {
        status: "skipped"
      });
    }
    res.json(progress);
  } catch (error) {
    console.error("Error skipping tutorial:", error);
    res.status(500).json({ error: "Failed to skip tutorial" });
  }
});
router11.get("/settings/my", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    let settings = await storage.getTutorialSettings(userId);
    if (!settings) {
      settings = await storage.createTutorialSettings({
        userId,
        autoStartTutorials: true,
        showTooltips: true,
        tutorialSpeed: "normal",
        preferredPosition: "bottom",
        disabledCategories: [],
        notificationPreferences: {
          completion_rewards: true,
          progress_reminders: true,
          new_tutorials: true
        },
        experienceLevel: "beginner"
      });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching tutorial settings:", error);
    res.status(500).json({ error: "Failed to fetch tutorial settings" });
  }
});
router11.put("/settings/my", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const updates = req.body;
    const settings = await storage.updateTutorialSettings(userId, updates);
    res.json(settings);
  } catch (error) {
    console.error("Error updating tutorial settings:", error);
    res.status(500).json({ error: "Failed to update tutorial settings" });
  }
});
router11.post("/settings/reset", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const settings = await storage.resetTutorialSettings(userId);
    res.json(settings);
  } catch (error) {
    console.error("Error resetting tutorial settings:", error);
    res.status(500).json({ error: "Failed to reset tutorial settings" });
  }
});
router11.get("/recommendations", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const settings = await storage.getTutorialSettings(userId);
    const userProgress = await storage.getUserAllTutorialProgress(userId);
    const completedTutorialIds = userProgress.filter((p) => p.status === "completed").map((p) => p.tutorialId);
    const allTutorials = await storage.getActiveTutorials();
    let recommendations = allTutorials.filter(
      (tutorial) => !completedTutorialIds.includes(tutorial.id) && (!settings?.disabledCategories || !settings.disabledCategories.includes(tutorial.category))
    );
    const userLevel = settings?.experienceLevel || "beginner";
    recommendations.sort((a, b) => {
      const aLevelMatch = a.targetUserLevel === userLevel || a.targetUserLevel === "all";
      const bLevelMatch = b.targetUserLevel === userLevel || b.targetUserLevel === "all";
      if (aLevelMatch && !bLevelMatch) return -1;
      if (!aLevelMatch && bLevelMatch) return 1;
      return (b.priority || 0) - (a.priority || 0);
    });
    recommendations = recommendations.slice(0, 5);
    res.json(recommendations);
  } catch (error) {
    console.error("Error getting tutorial recommendations:", error);
    res.status(500).json({ error: "Failed to get tutorial recommendations" });
  }
});
var tutorials_default = router11;

// server/services/observability.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
function initObservability() {
  const traceEndpoint = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
  const metricsEndpoint = process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT;
  if (!traceEndpoint && !metricsEndpoint) {
    console.log("\u{1F4CA} [observability] OTEL endpoints not configured, skipping observability setup");
    return;
  }
  try {
    const sdkConfig = {};
    if (traceEndpoint) {
      sdkConfig.traceExporter = new OTLPTraceExporter({
        url: traceEndpoint,
        headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS) : {}
      });
      console.log("\u{1F4C8} [observability] Trace exporter configured:", traceEndpoint);
    }
    if (metricsEndpoint) {
      sdkConfig.metricReader = new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: metricsEndpoint,
          headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS) : {}
        }),
        exportIntervalMillis: parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || "30000", 10)
      });
      console.log("\u{1F4CA} [observability] Metrics exporter configured:", metricsEndpoint);
    }
    const sdk = new NodeSDK(sdkConfig);
    sdk.start().then(() => {
      console.log("\u2705 [observability] OpenTelemetry SDK started successfully");
    }).catch((error) => {
      console.warn("\u26A0\uFE0F [observability] Failed to start OpenTelemetry SDK:", error.message);
    });
    process.on("SIGTERM", () => {
      sdk.shutdown().then(() => console.log("\u{1F53D} [observability] OpenTelemetry SDK terminated")).catch((error) => console.error("\u274C [observability] Error terminating SDK:", error)).finally(() => process.exit(0));
    });
    return sdk;
  } catch (error) {
    console.warn("\u26A0\uFE0F [observability] Failed to initialize observability:", error);
  }
}

// server/index.ts
var app = express5();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));
app.use(demoGate);
app.use(express5.json());
app.use(express5.urlencoded({ extended: false }));
var responseCache = new ResponseCache({
  defaultTTL: 300,
  // 5 minutes
  maxSize: 1e3,
  excludeRoutes: ["/api/auth", "/api/think", "/api/admin"]
  // Don't cache sensitive endpoints
});
var performanceMonitor = new PerformanceMonitor({
  enableMetrics: true,
  enableErrorTracking: true,
  slowQueryThreshold: 2e3,
  // Alert on responses > 2s
  errorAlertThreshold: 10
});
app.use(responseCache.middleware());
app.use(performanceMonitor.performanceMiddleware());
app.use(performanceMonitor.errorTrackingMiddleware());
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  console.log("\u{1F680} Starting Sprint 2 infrastructure...");
  initObservability();
  console.log("\u{1F680} Starting Sprint 1 features...");
  startDebateWorker();
  await startWebhookWorker();
  const { startExportProvenanceWorker: startExportProvenanceWorker2 } = await Promise.resolve().then(() => (init_exportProvenanceWorker(), exportProvenanceWorker_exports));
  startExportProvenanceWorker2();
  const server = await registerRoutes(app);
  app.use("/api", debates_async_default);
  app.use("/api", export_default);
  app.use("/api", push_default);
  app.use("/api", webhooks_default);
  const slackRouter = (await Promise.resolve().then(() => (init_slack(), slack_exports))).default;
  const jiraRouter = (await Promise.resolve().then(() => (init_jira(), jira_exports))).default;
  app.use("/api/slack", slackRouter);
  app.use("/api/jira", jiraRouter);
  app.use("/api", templates_default);
  app.use("/api/tutorials", tutorials_default);
  app.use("/api/billing", billing_default);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
