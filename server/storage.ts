import { 
  type User, type InsertUser, type UpsertUser, type AnalysisSession, type InsertAnalysisSession,
  type Workspace, type InsertWorkspace, type WorkspaceMember, type InsertWorkspaceMember,
  type WorkspaceInvite, type InsertWorkspaceInvite, type UserPreferences,
  type GeneratedReport, type InsertGeneratedReport,
  type Template, type InsertTemplate,
  type SessionCode, type InsertSessionCode, type SessionParticipant, type InsertSessionParticipant,
  type ChatMessage, type InsertChatMessage,
  type PushSubscription, type InsertPushSubscription,
  // Tutorial system types
  type Tutorial, type InsertTutorial, type TutorialStep, type InsertTutorialStep,
  type TutorialProgress, type InsertTutorialProgress, type TutorialSettings, type InsertTutorialSettings,
  // Enterprise types
  type Organization, type InsertOrganization, type OrganizationMember, type InsertOrganizationMember,
  type Team, type InsertTeam, type TeamMember, type InsertTeamMember,
  type AuditLog, type InsertAuditLog, type SecurityEvent, type InsertSecurityEvent,
  type UsageMetric, type InsertUsageMetric, type RateLimitRule, type InsertRateLimitRule,
  type PerformanceMetric, type InsertPerformanceMetric, type ErrorLog, type InsertErrorLog,
  type HealthCheck, type InsertHealthCheck,
  // Sprint 1 types
  type DebateRun, type InsertDebateRun, type ExportLog, type InsertExportLog,
  // Billing types
  type Subscription, type InsertSubscription, type Entitlement, type InsertEntitlement,
  type SubscriptionPlan, type SubscriptionStatus, type BillingFeature,
  // Marketplace types
  type TemplateProduct, type InsertTemplateProduct, type TemplatePurchase, type InsertTemplatePurchase,
  // Sprint 5 - Reviews/Approvals system types
  type Review, type InsertReview, type ReviewStep, type InsertReviewStep,
  type ReviewAssignment, type InsertReviewAssignment, type ReviewComment, type InsertReviewComment,
  // Sprint 5 - Retention/Legal Hold system types
  type RetentionPolicy, type InsertRetentionPolicy, type LegalHold, type InsertLegalHold,
  type RetentionJob, type InsertRetentionJob, type DataClassification, type InsertDataClassification,
  // Sprint 5 - SCIM provisioning system types
  type ScimUser, type InsertScimUser, type ScimGroup, type InsertScimGroup,
  type ScimGroupMembership, type InsertScimGroupMembership, type ProvisioningLog, type InsertProvisioningLog,
  // Sprint 6 - Workflow automation types
  type WorkflowDefinition, type InsertWorkflowDefinition, type WorkflowExecution, type InsertWorkflowExecution,
  type WorkflowEvent, type InsertWorkflowEvent,
  // Sprint 6 - Organization insights types  
  type OrganizationAnalytics, type InsertOrganizationAnalytics, type OrganizationDailyReport, type InsertOrganizationDailyReport,
  type EnhancedUsageMetric, type InsertEnhancedUsageMetric,
  // Sprint 11 - Billing & Entitlements types
  type Invoice, type InsertInvoice, type DunningEvent, type InsertDunningEvent, type Seat, type InsertSeat,
  // Sprint 12 - GA Launch types
  type Docs, type InsertDocs, type AdminSettings, type InsertAdminSettings,
  type MarketplaceItems, type InsertMarketplaceItems, type ChangelogEntries, type InsertChangelogEntries,
  type Playbooks, type InsertPlaybooks,
  // Workspace Synchronization types
  type WorkspaceEvent, type InsertWorkspaceEvent, type WorkspaceConnection, type InsertWorkspaceConnection,
  users, analysisSessions, workspaces, workspaceMembers, workspaceInvites, generatedReports,
  templates, sessionCodes, sessionParticipants, chatMessages, pushSubscriptions,
  tutorials, tutorialSteps, tutorialProgress, tutorialSettings,
  organizations, organizationMembers, teams, teamMembers, auditLogs, securityEvents,
  usageMetrics, rateLimitRules, performanceMetrics, errorLogs, healthChecks,
  debateRuns, exportLogs, subscriptions, entitlements, templateProducts, templatePurchases,
  // Sprint 5 table imports
  reviews, reviewSteps, reviewAssignments, reviewComments,
  retentionPolicies, legalHolds, retentionJobs, dataClassifications,
  scimUsers, scimGroups, scimGroupMemberships, provisioningLogs,
  // Sprint 6 table imports
  workflowDefinitions, workflowExecutions, workflowEvents,
  organizationAnalytics, organizationDailyReports, enhancedUsageMetrics,
  // Sprint 11 table imports
  invoices, dunningEvents, seats,
  // Sprint 12 table imports
  docs, adminSettings, marketplaceItems, changelogEntries, playbooks,
  // Workspace Synchronization table imports
  workspaceEvents, workspaceConnections
} from "@shared/schema";
import { randomUUID } from "crypto";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, sql, and, or, not } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  // User management (Replit OpenID Connect compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPreferences(id: string, preferences: UserPreferences): Promise<User | undefined>;
  updateUserSubscription(id: string, subscription: any): Promise<User | undefined>;
  updateOnboardingProgress(id: string, progress: any): Promise<User | undefined>;
  
  // Analysis session management
  createAnalysisSession(session: InsertAnalysisSession & { results?: any; telemetry?: any; debateHistory?: any }): Promise<AnalysisSession>;
  getAnalysisSession(id: string): Promise<AnalysisSession | undefined>;
  updateAnalysisSession(id: string, updates: Partial<AnalysisSession>): Promise<AnalysisSession | undefined>;
  getUserAnalysisSessions(userId?: string): Promise<AnalysisSession[]>;
  
  // Session transfer methods for cross-mode debate continuation
  getTransferableSessions(userId?: string, excludeMode?: string): Promise<AnalysisSession[]>;
  getSessionForTransfer(sessionId: string): Promise<AnalysisSession | undefined>;
  
  // Workspace management
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  getWorkspaceBySessionCode(sessionCode: string): Promise<Workspace | undefined>;
  updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | undefined>;
  deleteWorkspace(id: string): Promise<boolean>;
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  generateSessionCode(): string;
  
  // Workspace membership
  addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember>;
  removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean>;
  getWorkspaceMembers(workspaceId: string): Promise<(WorkspaceMember & { user: User })[]>;
  getUserWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined>;
  getWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined>;
  updateMemberRole(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | undefined>;
  
  // Workspace invitations  
  createWorkspaceInvite(invite: InsertWorkspaceInvite): Promise<WorkspaceInvite>;
  getWorkspaceInvite(inviteCode: string): Promise<WorkspaceInvite | undefined>;
  acceptWorkspaceInvite(inviteCode: string, userId: string): Promise<WorkspaceMember | undefined>;
  getWorkspaceInvites(workspaceId: string): Promise<WorkspaceInvite[]>;

  // Session code operations for collaboration
  createSessionCode(sessionCode: InsertSessionCode): Promise<SessionCode>;
  getSessionCode(code: string): Promise<SessionCode | undefined>;
  addUserToSession(sessionCode: string, userId: string): Promise<void>;
  getSessionParticipants(sessionCode: string): Promise<SessionParticipant[]>;
  removeUserFromSession(sessionCode: string, userId: string): Promise<void>;

  // ============================================
  // WORKSPACE SYNCHRONIZATION - Real-time Events and Connections
  // ============================================
  
  // Workspace events for real-time synchronization
  createWorkspaceEvent(event: InsertWorkspaceEvent): Promise<WorkspaceEvent>;
  createWorkspaceEventAtomic(event: InsertWorkspaceEvent): Promise<WorkspaceEvent>;
  getWorkspaceEvent(id: string): Promise<WorkspaceEvent | undefined>;
  getWorkspaceEvents(workspaceId: string, limit?: number, offset?: number): Promise<WorkspaceEvent[]>;
  getWorkspaceEventsSince(workspaceId: string, sequenceNumber: number): Promise<WorkspaceEvent[]>;
  deleteWorkspaceEvent(id: string): Promise<boolean>;
  cleanupWorkspaceEvents(workspaceId: string, olderThanDays: number): Promise<number>;
  getNextSequenceNumber(workspaceId: string): Promise<number>;
  
  // Workspace connections for SSE management
  createWorkspaceConnection(connection: InsertWorkspaceConnection): Promise<WorkspaceConnection>;
  getWorkspaceConnection(id: string): Promise<WorkspaceConnection | undefined>;
  getActiveWorkspaceConnections(workspaceId: string): Promise<WorkspaceConnection[]>;
  getUserWorkspaceConnections(workspaceId: string, userId: string): Promise<WorkspaceConnection[]>;
  updateConnectionPing(connectionId: string): Promise<WorkspaceConnection | undefined>;
  deactivateConnection(connectionId: string): Promise<boolean>;
  deactivateUserConnections(workspaceId: string, userId: string): Promise<number>;
  cleanupStaleConnections(olderThanMinutes: number): Promise<number>;
  
  // Connection presence and activity tracking
  getWorkspaceActiveUsers(workspaceId: string): Promise<{ userId: string; user: User; connectionsCount: number; lastActivity: Date }[]>;
  isUserActiveInWorkspace(workspaceId: string, userId: string): Promise<boolean>;
  getWorkspaceConnectionsCount(workspaceId: string): Promise<number>;

  // Chat message operations for team communication
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionCode: string): Promise<ChatMessage[]>;
  deleteChatMessage(messageId: string): Promise<void>;

  // Generated report operations for report management
  createGeneratedReport(report: InsertGeneratedReport): Promise<GeneratedReport>;
  getGeneratedReport(id: string): Promise<GeneratedReport | undefined>;
  getUserGeneratedReports(userId: string): Promise<GeneratedReport[]>;
  deleteGeneratedReport(id: string): Promise<boolean>;
  getSessionReports(sessionId: string): Promise<GeneratedReport[]>;

  // Template operations for AI thinking templates
  createTemplate(template: InsertTemplate): Promise<Template>;
  getTemplate(id: string): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getPublicTemplates(): Promise<Template[]>;
  getUserTemplates(userId: string): Promise<Template[]>;
  updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  incrementTemplateUsage(id: string): Promise<Template | undefined>;

  // Push notification subscription operations for web push support
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  getPushSubscription(id: string): Promise<PushSubscription | undefined>;
  getUserPushSubscriptions(userId: string): Promise<PushSubscription[]>;
  deletePushSubscription(id: string): Promise<boolean>;
  deletePushSubscriptionByEndpoint(endpoint: string, userId: string): Promise<boolean>;
  updatePushSubscription(id: string, updates: Partial<PushSubscription>): Promise<PushSubscription | undefined>;

  // ============================================
  // TUTORIAL SYSTEM - Interactive User Guidance
  // ============================================
  
  // Tutorial management operations
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  getTutorial(id: string): Promise<Tutorial | undefined>;
  getAllTutorials(): Promise<Tutorial[]>;
  getTutorialsByCategory(category: string): Promise<Tutorial[]>;
  getActiveTutorials(): Promise<Tutorial[]>;
  updateTutorial(id: string, updates: Partial<Tutorial>): Promise<Tutorial | undefined>;
  deleteTutorial(id: string): Promise<boolean>;
  
  // Tutorial step management operations
  createTutorialStep(step: InsertTutorialStep): Promise<TutorialStep>;
  getTutorialStep(id: string): Promise<TutorialStep | undefined>;
  getTutorialSteps(tutorialId: string): Promise<TutorialStep[]>;
  updateTutorialStep(id: string, updates: Partial<TutorialStep>): Promise<TutorialStep | undefined>;
  deleteTutorialStep(id: string): Promise<boolean>;
  deleteTutorialSteps(tutorialId: string): Promise<boolean>;
  
  // Tutorial progress tracking operations
  createTutorialProgress(progress: InsertTutorialProgress): Promise<TutorialProgress>;
  getTutorialProgress(id: string): Promise<TutorialProgress | undefined>;
  getUserTutorialProgress(userId: string, tutorialId: string): Promise<TutorialProgress | undefined>;
  getUserAllTutorialProgress(userId: string): Promise<TutorialProgress[]>;
  updateTutorialProgress(id: string, updates: Partial<TutorialProgress>): Promise<TutorialProgress | undefined>;
  deleteTutorialProgress(id: string): Promise<boolean>;
  markTutorialStepCompleted(userId: string, tutorialId: string, stepNumber: number): Promise<TutorialProgress | undefined>;
  markTutorialCompleted(userId: string, tutorialId: string): Promise<TutorialProgress | undefined>;
  
  // Tutorial settings management operations
  createTutorialSettings(settings: InsertTutorialSettings): Promise<TutorialSettings>;
  getTutorialSettings(userId: string): Promise<TutorialSettings | undefined>;
  updateTutorialSettings(userId: string, updates: Partial<TutorialSettings>): Promise<TutorialSettings | undefined>;
  resetTutorialSettings(userId: string): Promise<TutorialSettings | undefined>;

  // ============================================
  // ENTERPRISE FEATURES - Organization Management
  // ============================================
  
  // Organization operations
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  getOrganization(id: string): Promise<Organization | undefined>;
  getOrganizationBySlug(slug: string): Promise<Organization | undefined>;
  updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined>;
  deleteOrganization(id: string): Promise<boolean>;
  getUserOrganizations(userId: string): Promise<Organization[]>;

  // Organization membership operations
  addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember>;
  removeOrganizationMember(organizationId: string, userId: string): Promise<boolean>;
  getOrganizationMembers(organizationId: string): Promise<(OrganizationMember & { user: User })[]>;
  getOrganizationMembership(organizationId: string, userId: string): Promise<OrganizationMember | undefined>;
  updateOrganizationMemberRole(organizationId: string, userId: string, role: string, permissions?: any): Promise<OrganizationMember | undefined>;

  // Team operations
  createTeam(team: InsertTeam): Promise<Team>;
  getTeam(id: string): Promise<Team | undefined>;
  updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;
  getOrganizationTeams(organizationId: string): Promise<Team[]>;
  getUserTeams(userId: string): Promise<Team[]>;

  // Team membership operations
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: string, userId: string): Promise<boolean>;
  getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]>;
  getTeamMembership(teamId: string, userId: string): Promise<TeamMember | undefined>;
  updateTeamMemberRole(teamId: string, userId: string, role: string): Promise<TeamMember | undefined>;

  // ============================================
  // ENTERPRISE FEATURES - Security & Audit
  // ============================================

  // Audit logging
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(organizationId?: string, userId?: string, limit?: number): Promise<AuditLog[]>;
  getAuditLogsByAction(action: string, organizationId?: string): Promise<AuditLog[]>;

  // Security events
  createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent>;
  getSecurityEvents(organizationId?: string, severity?: string): Promise<SecurityEvent[]>;
  resolveSecurityEvent(id: string, resolvedBy: string): Promise<SecurityEvent | undefined>;

  // ============================================
  // ENTERPRISE FEATURES - Usage & Monitoring
  // ============================================

  // Usage tracking
  recordUsageMetric(metric: InsertUsageMetric): Promise<UsageMetric>;
  getUsageMetrics(organizationId?: string, userId?: string, period?: string): Promise<UsageMetric[]>;
  getUsageByType(metricType: string, organizationId?: string): Promise<UsageMetric[]>;

  // Rate limiting
  createRateLimitRule(rule: InsertRateLimitRule): Promise<RateLimitRule>;
  getRateLimitRules(organizationId?: string): Promise<RateLimitRule[]>;
  updateRateLimitRule(id: string, updates: Partial<RateLimitRule>): Promise<RateLimitRule | undefined>;
  deleteRateLimitRule(id: string): Promise<boolean>;

  // Performance monitoring
  recordPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  getPerformanceMetrics(organizationId?: string, metricName?: string): Promise<PerformanceMetric[]>;

  // Error tracking
  recordError(error: InsertErrorLog): Promise<ErrorLog>;
  getErrorLogs(organizationId?: string, severity?: string): Promise<ErrorLog[]>;
  resolveError(id: string, resolvedBy: string): Promise<ErrorLog | undefined>;

  // Health monitoring
  recordHealthCheck(check: InsertHealthCheck): Promise<HealthCheck>;
  getHealthChecks(serviceName?: string): Promise<HealthCheck[]>;
  getLatestHealthStatus(): Promise<{ [serviceName: string]: HealthCheck }>;

  // ============================================
  // SPRINT 1 - Async Processing & Export Tracking
  // ============================================
  
  // Debate run tracking
  createDebateRun(run: InsertDebateRun): Promise<DebateRun>;
  getDebateRun(id: string): Promise<DebateRun | undefined>;
  updateDebateRunStatus(id: string, status: string, completedAt?: Date): Promise<DebateRun | undefined>;
  
  // Export logging
  createExportLog(log: InsertExportLog): Promise<ExportLog>;
  getExportLogs(userId?: string, workspaceId?: string): Promise<ExportLog[]>;
  
  // Export provenance tracking
  createExportProvenance(provenance: any): Promise<string>;
  getExportProvenance(exportId: string): Promise<any>;
  getExportProvenanceHistory(userId?: string, organizationId?: string): Promise<any[]>;

  // ============================================
  // SPRINT 4 - Billing & Subscription Management
  // ============================================

  // Subscription plan operations
  getSubscriptionPlans(): Promise<{ id: string; name: string; priceMonthly: number; priceYearly: number; features: string[]; limits: Record<string, number> }[]>;
  
  // Subscription operations
  createOrUpdateSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscription(id: string): Promise<Subscription | undefined>;
  getSubscriptionByWorkspace(workspaceId: string): Promise<Subscription | undefined>;
  updateSubscriptionStatus(id: string, status: SubscriptionStatus): Promise<Subscription | undefined>;
  cancelSubscription(id: string): Promise<Subscription | undefined>;
  
  // Entitlement operations
  createEntitlement(entitlement: InsertEntitlement): Promise<Entitlement>;
  getEntitlements(workspaceId: string): Promise<Entitlement[]>;
  revokeEntitlements(workspaceId: string, feature?: BillingFeature): Promise<boolean>;
  checkEntitlement(workspaceId: string, feature: BillingFeature): Promise<boolean>;

  // Stripe integration operations
  getStripeCustomerByUserId(userId: string): Promise<{ stripeCustomerId: string } | undefined>;
  updateUserStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void>;
  createSubscription(subscriptionData: Omit<InsertSubscription, 'id'>): Promise<Subscription>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined>;
  updateSubscriptionByStripeId(stripeSubscriptionId: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  getActiveSubscriptionByWorkspaceId(workspaceId: string): Promise<Subscription | undefined>;
  grantPlanEntitlements(workspaceId: string, plan: string): Promise<void>;
  revokeAllEntitlements(workspaceId: string): Promise<void>;
  isWorkspaceAdmin(userId: string, workspaceId: string): Promise<boolean>;

  // ============================================
  // SPRINT 4 - Marketplace Operations
  // ============================================

  // Template product operations
  getMarketplaceTemplates(): Promise<(TemplateProduct & { template: Template })[]>;
  getTemplateProduct(id: string): Promise<TemplateProduct | undefined>;
  createTemplateProduct(product: InsertTemplateProduct): Promise<TemplateProduct>;

  // Template purchase operations
  createTemplatePurchase(purchase: InsertTemplatePurchase): Promise<TemplatePurchase>;
  getTemplatePurchase(id: string): Promise<TemplatePurchase | undefined>;
  checkExistingPurchase(workspaceId: string, templateProductId: string): Promise<TemplatePurchase | undefined>;
  getUserPurchases(userId: string): Promise<(TemplatePurchase & { templateProduct: TemplateProduct & { template: Template } })[]>;
  getWorkspacePurchases(workspaceId: string): Promise<(TemplatePurchase & { templateProduct: TemplateProduct & { template: Template } })[]>;

  // ============================================
  // SPRINT 5 - REVIEWS/APPROVALS SYSTEM
  // ============================================

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReview(id: string): Promise<Review | undefined>;
  getReviews(organizationId?: string, workspaceId?: string): Promise<Review[]>;
  getReviewsByResource(resourceType: string, resourceId: string): Promise<Review[]>;
  getReviewsByInitiator(initiatorId: string): Promise<Review[]>;
  getReviewsByStatus(status: string, organizationId?: string): Promise<Review[]>;
  updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: string): Promise<boolean>;
  approveReview(id: string, userId: string): Promise<Review | undefined>;
  rejectReview(id: string, userId: string, reason?: string): Promise<Review | undefined>;

  // Review step operations
  createReviewStep(step: InsertReviewStep): Promise<ReviewStep>;
  getReviewStep(id: string): Promise<ReviewStep | undefined>;
  getReviewSteps(reviewId: string): Promise<ReviewStep[]>;
  updateReviewStep(id: string, updates: Partial<ReviewStep>): Promise<ReviewStep | undefined>;
  deleteReviewStep(id: string): Promise<boolean>;
  completeReviewStep(id: string, userId: string): Promise<ReviewStep | undefined>;
  skipReviewStep(id: string, userId: string, reason: string): Promise<ReviewStep | undefined>;

  // Review assignment operations
  createReviewAssignment(assignment: InsertReviewAssignment): Promise<ReviewAssignment>;
  getReviewAssignment(id: string): Promise<ReviewAssignment | undefined>;
  getReviewAssignments(reviewId: string): Promise<ReviewAssignment[]>;
  getAssignmentsByAssignee(assigneeId: string): Promise<ReviewAssignment[]>;
  updateReviewAssignment(id: string, updates: Partial<ReviewAssignment>): Promise<ReviewAssignment | undefined>;
  deleteReviewAssignment(id: string): Promise<boolean>;
  respondToAssignment(id: string, response: string, reason?: string): Promise<ReviewAssignment | undefined>;
  delegateAssignment(id: string, delegatedTo: string): Promise<ReviewAssignment | undefined>;

  // Review comment operations
  createReviewComment(comment: InsertReviewComment): Promise<ReviewComment>;
  getReviewComment(id: string): Promise<ReviewComment | undefined>;
  getReviewComments(reviewId: string): Promise<ReviewComment[]>;
  getCommentsByStep(stepId: string): Promise<ReviewComment[]>;
  getCommentsByAssignment(assignmentId: string): Promise<ReviewComment[]>;
  updateReviewComment(id: string, updates: Partial<ReviewComment>): Promise<ReviewComment | undefined>;
  deleteReviewComment(id: string): Promise<boolean>;
  resolveComment(id: string, userId: string): Promise<ReviewComment | undefined>;

  // ============================================
  // SPRINT 5 - RETENTION/LEGAL HOLD SYSTEM
  // ============================================

  // Retention policy operations
  createRetentionPolicy(policy: InsertRetentionPolicy): Promise<RetentionPolicy>;
  getRetentionPolicy(id: string): Promise<RetentionPolicy | undefined>;
  getRetentionPolicies(organizationId: string): Promise<RetentionPolicy[]>;
  getRetentionPoliciesByDataType(dataType: string, organizationId: string): Promise<RetentionPolicy[]>;
  getActiveRetentionPolicies(organizationId: string): Promise<RetentionPolicy[]>;
  updateRetentionPolicy(id: string, updates: Partial<RetentionPolicy>): Promise<RetentionPolicy | undefined>;
  deleteRetentionPolicy(id: string): Promise<boolean>;
  activateRetentionPolicy(id: string): Promise<RetentionPolicy | undefined>;
  deactivateRetentionPolicy(id: string): Promise<RetentionPolicy | undefined>;

  // Legal hold operations
  createLegalHold(hold: InsertLegalHold): Promise<LegalHold>;
  getLegalHold(id: string): Promise<LegalHold | undefined>;
  getLegalHolds(organizationId: string): Promise<LegalHold[]>;
  getActiveLegalHolds(organizationId: string): Promise<LegalHold[]>;
  getLegalHoldsByCustodian(custodianId: string): Promise<LegalHold[]>;
  getLegalHoldsByDateRange(startDate: Date, endDate: Date, organizationId: string): Promise<LegalHold[]>;
  updateLegalHold(id: string, updates: Partial<LegalHold>): Promise<LegalHold | undefined>;
  deleteLegalHold(id: string): Promise<boolean>;
  releaseLegalHold(id: string, userId: string, reason: string): Promise<LegalHold | undefined>;

  // Retention job operations
  createRetentionJob(job: InsertRetentionJob): Promise<RetentionJob>;
  getRetentionJob(id: string): Promise<RetentionJob | undefined>;
  getRetentionJobs(organizationId: string): Promise<RetentionJob[]>;
  getRetentionJobsByPolicy(policyId: string): Promise<RetentionJob[]>;
  getRetentionJobsByStatus(status: string, organizationId: string): Promise<RetentionJob[]>;
  getScheduledRetentionJobs(organizationId: string): Promise<RetentionJob[]>;
  updateRetentionJob(id: string, updates: Partial<RetentionJob>): Promise<RetentionJob | undefined>;
  deleteRetentionJob(id: string): Promise<boolean>;
  startRetentionJob(id: string): Promise<RetentionJob | undefined>;
  completeRetentionJob(id: string, results: any): Promise<RetentionJob | undefined>;
  failRetentionJob(id: string, error: string): Promise<RetentionJob | undefined>;

  // Data classification operations
  createDataClassification(classification: InsertDataClassification): Promise<DataClassification>;
  getDataClassification(id: string): Promise<DataClassification | undefined>;
  getDataClassifications(organizationId: string): Promise<DataClassification[]>;
  getDataClassificationByResource(resourceType: string, resourceId: string): Promise<DataClassification | undefined>;
  getDataClassificationsByClassification(classification: string, organizationId: string): Promise<DataClassification[]>;
  getDataClassificationsBySensitivity(sensitivity: string, organizationId: string): Promise<DataClassification[]>;
  getDataClassificationsRequiringReview(organizationId: string): Promise<DataClassification[]>;
  updateDataClassification(id: string, updates: Partial<DataClassification>): Promise<DataClassification | undefined>;
  deleteDataClassification(id: string): Promise<boolean>;
  reviewDataClassification(id: string, userId: string): Promise<DataClassification | undefined>;

  // ============================================
  // SPRINT 5 - SCIM USER PROVISIONING SYSTEM
  // ============================================

  // SCIM user operations
  createScimUser(user: InsertScimUser): Promise<ScimUser>;
  getScimUser(id: string): Promise<ScimUser | undefined>;
  getScimUserByExternalId(externalId: string, organizationId: string): Promise<ScimUser | undefined>;
  getScimUserByScimId(scimId: string): Promise<ScimUser | undefined>;
  getScimUserByEmail(email: string, organizationId: string): Promise<ScimUser | undefined>;
  getScimUsers(organizationId: string): Promise<ScimUser[]>;
  getActiveScimUsers(organizationId: string): Promise<ScimUser[]>;
  getScimUsersBySyncStatus(syncStatus: string, organizationId: string): Promise<ScimUser[]>;
  updateScimUser(id: string, updates: Partial<ScimUser>): Promise<ScimUser | undefined>;
  deleteScimUser(id: string): Promise<boolean>;
  linkScimUserToLocal(scimUserId: string, localUserId: string): Promise<ScimUser | undefined>;
  syncScimUser(id: string, syncData: any): Promise<ScimUser | undefined>;
  deprovisionScimUser(id: string): Promise<ScimUser | undefined>;

  // SCIM group operations
  createScimGroup(group: InsertScimGroup): Promise<ScimGroup>;
  getScimGroup(id: string): Promise<ScimGroup | undefined>;
  getScimGroupByExternalId(externalId: string, organizationId: string): Promise<ScimGroup | undefined>;
  getScimGroupByScimId(scimId: string): Promise<ScimGroup | undefined>;
  getScimGroups(organizationId: string): Promise<ScimGroup[]>;
  getScimGroupsByType(groupType: string, organizationId: string): Promise<ScimGroup[]>;
  getScimGroupsBySyncStatus(syncStatus: string, organizationId: string): Promise<ScimGroup[]>;
  updateScimGroup(id: string, updates: Partial<ScimGroup>): Promise<ScimGroup | undefined>;
  deleteScimGroup(id: string): Promise<boolean>;
  syncScimGroup(id: string, syncData: any): Promise<ScimGroup | undefined>;
  deprovisionScimGroup(id: string): Promise<ScimGroup | undefined>;

  // SCIM group membership operations
  createScimGroupMembership(membership: InsertScimGroupMembership): Promise<ScimGroupMembership>;
  getScimGroupMembership(id: string): Promise<ScimGroupMembership | undefined>;
  getScimGroupMemberships(groupId: string): Promise<ScimGroupMembership[]>;
  getScimUserMemberships(userId: string): Promise<ScimGroupMembership[]>;
  getScimGroupMembershipByIds(groupId: string, userId: string): Promise<ScimGroupMembership | undefined>;
  getScimGroupMembershipsBySyncStatus(syncStatus: string): Promise<ScimGroupMembership[]>;
  updateScimGroupMembership(id: string, updates: Partial<ScimGroupMembership>): Promise<ScimGroupMembership | undefined>;
  deleteScimGroupMembership(id: string): Promise<boolean>;
  addUserToScimGroup(groupId: string, userId: string, membershipType?: string): Promise<ScimGroupMembership>;
  removeUserFromScimGroup(groupId: string, userId: string): Promise<boolean>;

  // Provisioning log operations
  createProvisioningLog(log: InsertProvisioningLog): Promise<ProvisioningLog>;
  getProvisioningLog(id: string): Promise<ProvisioningLog | undefined>;
  getProvisioningLogs(organizationId: string): Promise<ProvisioningLog[]>;
  getProvisioningLogsByOperation(operation: string, organizationId: string): Promise<ProvisioningLog[]>;
  getProvisioningLogsByResourceType(resourceType: string, organizationId: string): Promise<ProvisioningLog[]>;
  getProvisioningLogsByStatus(status: string, organizationId: string): Promise<ProvisioningLog[]>;
  getProvisioningLogsByRequestId(requestId: string): Promise<ProvisioningLog[]>;
  getProvisioningLogsByBatch(batchId: string): Promise<ProvisioningLog[]>;
  getProvisioningLogsByDateRange(startDate: Date, endDate: Date, organizationId: string): Promise<ProvisioningLog[]>;
  updateProvisioningLog(id: string, updates: Partial<ProvisioningLog>): Promise<ProvisioningLog | undefined>;
  deleteProvisioningLog(id: string): Promise<boolean>;

  // ============================================
  // SPRINT 6 - TEMPLATE BUILDER CRUD + PUBLISH SYSTEM
  // ============================================
  
  // Template operations with publishing workflow
  publishTemplate(id: string, publishedBy: string, comments?: string): Promise<Template | undefined>;
  unpublishTemplate(id: string, unpublishedBy: string, reason?: string): Promise<Template | undefined>;
  getTemplatesByStatus(status: string, organizationId?: string): Promise<Template[]>;
  getTemplateVersions(templateId: string): Promise<Template[]>;
  createTemplateVersion(templateId: string, updates: Partial<Template>, createdBy: string): Promise<Template>;
  
  // ============================================
  // SPRINT 6 - WORKFLOW AUTOMATION V1
  // ============================================
  
  // Workflow definition operations
  createWorkflowDefinition(workflow: InsertWorkflowDefinition): Promise<WorkflowDefinition>;
  getWorkflowDefinition(id: string): Promise<WorkflowDefinition | undefined>;
  updateWorkflowDefinition(id: string, updates: Partial<WorkflowDefinition>): Promise<WorkflowDefinition | undefined>;
  deleteWorkflowDefinition(id: string): Promise<boolean>;
  getOrganizationWorkflowDefinitions(organizationId: string): Promise<WorkflowDefinition[]>;
  
  // Workflow execution operations
  createWorkflowExecution(execution: InsertWorkflowExecution): Promise<WorkflowExecution>;
  getWorkflowExecution(id: string): Promise<WorkflowExecution | undefined>;
  updateWorkflowExecution(id: string, updates: Partial<WorkflowExecution>): Promise<WorkflowExecution | undefined>;
  getWorkflowExecutions(workflowDefinitionId?: string, organizationId?: string, limit?: number): Promise<WorkflowExecution[]>;
  
  // Workflow event operations (for queue processing)
  createWorkflowEvent(event: InsertWorkflowEvent): Promise<WorkflowEvent>;
  getWorkflowEvent(id: string): Promise<WorkflowEvent | undefined>;
  updateWorkflowEvent(id: string, updates: Partial<WorkflowEvent>): Promise<WorkflowEvent | undefined>;
  getPendingWorkflowEvents(limit?: number): Promise<WorkflowEvent[]>;
  
  // ============================================
  // SPRINT 6 - ORGANIZATION INSIGHTS SYSTEM
  // ============================================
  
  // Organization analytics operations
  createOrganizationAnalytics(analytics: InsertOrganizationAnalytics): Promise<OrganizationAnalytics>;
  getOrganizationAnalytics(organizationId: string, date?: Date): Promise<OrganizationAnalytics | undefined>;
  getOrganizationAnalyticsRange(organizationId: string, startDate: Date, endDate: Date): Promise<OrganizationAnalytics[]>;
  updateOrganizationAnalytics(id: string, updates: Partial<OrganizationAnalytics>): Promise<OrganizationAnalytics | undefined>;
  
  // Daily reports operations
  createOrganizationDailyReport(report: InsertOrganizationDailyReport): Promise<OrganizationDailyReport>;
  getOrganizationDailyReport(organizationId: string, reportDate: Date, reportType?: string): Promise<OrganizationDailyReport | undefined>;
  getOrganizationDailyReports(organizationId: string, limit?: number): Promise<OrganizationDailyReport[]>;
  
  // Enhanced usage metrics operations
  recordEnhancedUsageMetric(metric: InsertEnhancedUsageMetric): Promise<EnhancedUsageMetric>;
  getEnhancedUsageMetrics(organizationId: string, resourceType?: string, startDate?: Date, endDate?: Date): Promise<EnhancedUsageMetric[]>;
  
  // Organization insights summary
  getOrganizationInsightsSummary(organizationId: string): Promise<any>;
  generateDailyInsightsReport(organizationId: string, date: Date): Promise<OrganizationDailyReport>;
  
  // Sprint 10 - Trial management
  startTrial(orgId: string, daysAllowed?: number): Promise<{ active: boolean; startDate: Date; endDate: Date; daysRemaining: number }>;
  getTrialStatus(orgId: string): Promise<{ active: boolean; startDate: Date | null; endDate: Date | null; daysRemaining: number }>;

  // ============================================
  // SPRINT 11 - BILLING & ENTITLEMENTS HARDENING
  // ============================================

  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoicesByOrg(orgId: string): Promise<Invoice[]>;
  updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | undefined>;

  // Dunning event operations
  createDunningEvent(event: InsertDunningEvent): Promise<DunningEvent>;
  getDunningEvent(id: string): Promise<DunningEvent | undefined>;
  getDunningEventsByInvoice(invoiceId: string): Promise<DunningEvent[]>;
  getDunningEventsByOrg(orgId: string): Promise<DunningEvent[]>;

  // Seats management operations
  createSeats(seats: InsertSeat): Promise<Seat>;
  getSeats(orgId: string): Promise<Seat | undefined>;
  updateSeats(orgId: string, seats: number): Promise<Seat | undefined>;

  // ============================================
  // SPRINT 12 - GA LAUNCH FEATURES
  // ============================================

  // Documentation operations
  createDoc(doc: InsertDocs): Promise<Docs>;
  getDoc(id: string): Promise<Docs | undefined>;
  getDocBySlug(slug: string): Promise<Docs | undefined>;
  getAllDocs(): Promise<Docs[]>;
  getDocsByCategory(category: string): Promise<Docs[]>;
  getPublishedDocs(): Promise<Docs[]>;
  updateDoc(id: string, updates: Partial<Docs>): Promise<Docs | undefined>;
  deleteDoc(id: string): Promise<boolean>;
  incrementDocViewCount(id: string): Promise<Docs | undefined>;
  searchDocs(query: string): Promise<Docs[]>;

  // Admin settings operations
  createAdminSetting(setting: InsertAdminSettings): Promise<AdminSettings>;
  getAdminSetting(key: string): Promise<AdminSettings | undefined>;
  getAllAdminSettings(): Promise<AdminSettings[]>;
  getAdminSettingsByCategory(category: string): Promise<AdminSettings[]>;
  updateAdminSetting(key: string, value: string, lastModifiedBy?: string): Promise<AdminSettings | undefined>;
  deleteAdminSetting(key: string): Promise<boolean>;

  // Marketplace operations
  createMarketplaceItem(item: InsertMarketplaceItems): Promise<MarketplaceItems>;
  getMarketplaceItem(id: string): Promise<MarketplaceItems | undefined>;
  getAllMarketplaceItems(): Promise<MarketplaceItems[]>;
  getMarketplaceItemsByCategory(category: string): Promise<MarketplaceItems[]>;
  getPublishedMarketplaceItems(): Promise<MarketplaceItems[]>;
  getFeaturedMarketplaceItems(): Promise<MarketplaceItems[]>;
  getMarketplaceItemsByPublisher(publisherId: string): Promise<MarketplaceItems[]>;
  updateMarketplaceItem(id: string, updates: Partial<MarketplaceItems>): Promise<MarketplaceItems | undefined>;
  deleteMarketplaceItem(id: string): Promise<boolean>;
  incrementMarketplaceItemViews(id: string): Promise<MarketplaceItems | undefined>;
  incrementMarketplaceItemDownloads(id: string): Promise<MarketplaceItems | undefined>;
  searchMarketplaceItems(query: string): Promise<MarketplaceItems[]>;

  // Changelog operations
  createChangelogEntry(entry: InsertChangelogEntries): Promise<ChangelogEntries>;
  getChangelogEntry(id: string): Promise<ChangelogEntries | undefined>;
  getChangelogEntryByVersion(version: string): Promise<ChangelogEntries | undefined>;
  getAllChangelogEntries(): Promise<ChangelogEntries[]>;
  getPublishedChangelogEntries(): Promise<ChangelogEntries[]>;
  getPinnedChangelogEntries(): Promise<ChangelogEntries[]>;
  getChangelogEntriesByType(type: string): Promise<ChangelogEntries[]>;
  updateChangelogEntry(id: string, updates: Partial<ChangelogEntries>): Promise<ChangelogEntries | undefined>;
  deleteChangelogEntry(id: string): Promise<boolean>;
  publishChangelogEntry(id: string, author: string): Promise<ChangelogEntries | undefined>;

  // Playbooks operations
  createPlaybook(playbook: InsertPlaybooks): Promise<Playbooks>;
  getPlaybook(id: string): Promise<Playbooks | undefined>;
  getAllPlaybooks(): Promise<Playbooks[]>;
  getPlaybooksByType(type: string): Promise<Playbooks[]>;
  getPlaybooksByRole(role: string): Promise<Playbooks[]>;
  getPlaybooksByCategory(category: string): Promise<Playbooks[]>;
  getActivePlaybooks(): Promise<Playbooks[]>;
  updatePlaybook(id: string, updates: Partial<Playbooks>): Promise<Playbooks | undefined>;
  deletePlaybook(id: string): Promise<boolean>;
  incrementPlaybookUsage(id: string): Promise<Playbooks | undefined>;
  searchPlaybooks(query: string): Promise<Playbooks[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analysisSessions: Map<string, AnalysisSession>;
  private workspaces: Map<string, Workspace>;
  private workspaceMembers: Map<string, WorkspaceMember>;
  private workspaceInvites: Map<string, WorkspaceInvite>;
  private generatedReports: Map<string, GeneratedReport>;
  private sessionCodes: Map<string, SessionCode>;
  private sessionParticipants: Map<string, SessionParticipant>;
  private chatMessages: Map<string, ChatMessage>;
  private pushSubscriptions: Map<string, PushSubscription>;
  
  // Workspace Synchronization Maps
  private workspaceEvents: Map<string, WorkspaceEvent>;
  private workspaceConnections: Map<string, WorkspaceConnection>;
  private workspaceSequenceNumbers: Map<string, number>; // Track sequence numbers per workspace

  constructor() {
    this.users = new Map();
    this.analysisSessions = new Map();
    this.workspaces = new Map();
    this.workspaceMembers = new Map();
    this.workspaceInvites = new Map();
    this.generatedReports = new Map();
    this.sessionCodes = new Map();
    this.sessionParticipants = new Map();
    this.chatMessages = new Map();
    this.pushSubscriptions = new Map();
    
    // Initialize Workspace Synchronization Maps
    this.workspaceEvents = new Map();
    this.workspaceConnections = new Map();
    this.workspaceSequenceNumbers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }


  async upsertUser(upsertData: UpsertUser): Promise<User> {
    const existing = this.users.get(upsertData.id!);
    const now = new Date();
    
    if (existing) {
      // Update existing user
      const updated: User = {
        ...existing,
        ...upsertData,
        updatedAt: now
      };
      this.users.set(upsertData.id!, updated);
      return updated;
    } else {
      // Create new user with defaults
      const user: User = {
        id: upsertData.id!,
        email: upsertData.email || null,
        firstName: upsertData.firstName || null,
        lastName: upsertData.lastName || null,
        profileImageUrl: upsertData.profileImageUrl || null,
        role: "user",
        stripeCustomerId: null,
        preferences: {
          theme: "light",
          language: "en", 
          notifications: true,
          default_model: "gpt-5",
          default_temperature: 0.7,
          auto_save: true
        },
        onboardingProgress: {
          completed_steps: [],
          current_flow: null,
          experience_level: "beginner",
          skipped_flows: [],
          last_interaction: null,
          feature_usage: {}
        },
        subscription: {
          plan: "free",
          usage_count: 0,
          monthly_limit: 10,
          reset_date: null
        },
        createdAt: now,
        updatedAt: now
      };
      this.users.set(user.id, user);
      return user;
    }
  }
  
  async updateUserPreferences(id: string, preferences: UserPreferences): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      preferences: existing.preferences ? { ...existing.preferences, ...preferences } : preferences,
      updatedAt: new Date() 
    };
    this.users.set(id, updated);
    return updated;
  }

  async updateUserSubscription(id: string, subscription: any): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      subscription: existing.subscription ? { ...existing.subscription, ...subscription } : subscription,
      updatedAt: new Date() 
    };
    this.users.set(id, updated);
    return updated;
  }

  async updateOnboardingProgress(id: string, progress: any): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      onboardingProgress: existing.onboardingProgress ? { ...existing.onboardingProgress, ...progress } : progress,
      updatedAt: new Date() 
    };
    this.users.set(id, updated);
    return updated;
  }

  async createAnalysisSession(sessionData: InsertAnalysisSession & { results?: any; telemetry?: any; debateHistory?: any }): Promise<AnalysisSession> {
    const id = randomUUID();
    const session: AnalysisSession = {
      id,
      prompt: sessionData.prompt,
      mode: sessionData.mode,
      settings: sessionData.settings || null,
      results: sessionData.results || null,
      telemetry: sessionData.telemetry || null,
      debateHistory: sessionData.debateHistory || null,
      brainstormResults: null,
      lastBrainstormedAt: null,
      lastReportGeneratedAt: null,
      lastReportType: null,
      title: sessionData.title || null,
      sourceSessionId: sessionData.sourceSessionId || null,
      transferCount: sessionData.transferCount || 0,
      userId: sessionData.userId || null,
      workspaceId: sessionData.workspaceId || null,
      createdAt: new Date(),
    };
    this.analysisSessions.set(id, session);
    return session;
  }

  async getAnalysisSession(id: string): Promise<AnalysisSession | undefined> {
    return this.analysisSessions.get(id);
  }

  async updateAnalysisSession(id: string, updates: Partial<AnalysisSession>): Promise<AnalysisSession | undefined> {
    const existing = this.analysisSessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.analysisSessions.set(id, updated);
    return updated;
  }

  async getUserAnalysisSessions(userId?: string): Promise<AnalysisSession[]> {
    const allSessions = Array.from(this.analysisSessions.values());
    const filtered = userId ? allSessions.filter(s => s.userId === userId) : allSessions;
    return filtered.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getTransferableSessions(userId?: string, excludeMode?: string): Promise<AnalysisSession[]> {
    const allSessions = Array.from(this.analysisSessions.values());
    let filtered = userId ? allSessions.filter(s => s.userId === userId) : allSessions;
    
    // Only return sessions that have results (completed debates)
    filtered = filtered.filter(s => s.results && typeof s.results === 'object' && (s.results as any).consensus);
    
    // Exclude sessions from the specified mode (e.g., don't show Expert sessions when in Expert mode)
    if (excludeMode) {
      filtered = filtered.filter(s => s.mode !== excludeMode);
    }
    
    return filtered
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, 20); // Limit to recent 20 sessions
  }

  async getSessionForTransfer(sessionId: string): Promise<AnalysisSession | undefined> {
    return this.analysisSessions.get(sessionId);
  }

  // Workspace management methods
  generateSessionCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async createWorkspace(workspaceData: InsertWorkspace): Promise<Workspace> {
    const id = randomUUID();
    const sessionCode = this.generateSessionCode();
    const now = new Date();
    const workspace: Workspace = {
      ...workspaceData,
      id,
      sessionCode,
      description: workspaceData.description || null,
      isPrivate: workspaceData.isPrivate || null,
      settings: workspaceData.settings || null,
      createdAt: now,
      updatedAt: now
    };
    this.workspaces.set(id, workspace);
    return workspace;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    return this.workspaces.get(id);
  }

  async getWorkspaceBySessionCode(sessionCode: string): Promise<Workspace | undefined> {
    return Array.from(this.workspaces.values()).find(w => w.sessionCode === sessionCode);
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | undefined> {
    const existing = this.workspaces.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.workspaces.set(id, updated);
    return updated;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    return this.workspaces.delete(id);
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    // Get workspaces where user is owner or member
    const memberWorkspaceIds = Array.from(this.workspaceMembers.values())
      .filter(m => m.userId === userId)
      .map(m => m.workspaceId);
    
    return Array.from(this.workspaces.values())
      .filter(w => w.ownerId === userId || memberWorkspaceIds.includes(w.id))
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  // Workspace membership methods  
  async addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember> {
    const id = randomUUID();
    const workspaceMember: WorkspaceMember = {
      ...member,
      id,
      role: member.role || "member",
      joinedAt: new Date()
    };
    this.workspaceMembers.set(id, workspaceMember);
    return workspaceMember;
  }

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = Array.from(this.workspaceMembers.values())
      .find(m => m.workspaceId === workspaceId && m.userId === userId);
    if (!member) return false;
    return this.workspaceMembers.delete(member.id);
  }

  async getWorkspaceMembers(workspaceId: string): Promise<(WorkspaceMember & { user: User })[]> {
    const members = Array.from(this.workspaceMembers.values())
      .filter(m => m.workspaceId === workspaceId);
    
    return members.map(member => {
      const user = this.users.get(member.userId)!;
      return { ...member, user };
    });
  }

  async getUserWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined> {
    return Array.from(this.workspaceMembers.values())
      .find(m => m.workspaceId === workspaceId && m.userId === userId);
  }
  
  async getWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined> {
    return Array.from(this.workspaceMembers.values())
      .find(m => m.workspaceId === workspaceId && m.userId === userId);
  }

  async updateMemberRole(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | undefined> {
    const member = Array.from(this.workspaceMembers.values())
      .find(m => m.workspaceId === workspaceId && m.userId === userId);
    if (!member) return undefined;
    member.role = role;
    this.workspaceMembers.set(member.id, member);
    return member;
  }

  // Workspace invitation methods
  async createWorkspaceInvite(invite: InsertWorkspaceInvite): Promise<WorkspaceInvite> {
    const id = randomUUID();
    const inviteCode = randomUUID().substring(0, 16);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const workspaceInvite: WorkspaceInvite = {
      ...invite,
      id,
      email: invite.email || null,
      role: invite.role || "member",
      inviteCode,
      status: "pending",
      expiresAt,
      createdAt: new Date()
    };
    this.workspaceInvites.set(id, workspaceInvite);
    return workspaceInvite;
  }

  async getWorkspaceInvite(inviteCode: string): Promise<WorkspaceInvite | undefined> {
    return Array.from(this.workspaceInvites.values())
      .find(i => i.inviteCode === inviteCode && i.status === "pending");
  }

  async acceptWorkspaceInvite(inviteCode: string, userId: string): Promise<WorkspaceMember | undefined> {
    const invite = await this.getWorkspaceInvite(inviteCode);
    if (!invite || invite.expiresAt! < new Date()) return undefined;

    // Mark invite as accepted
    invite.status = "accepted";
    this.workspaceInvites.set(invite.id, invite);

    // Add user as workspace member
    return await this.addWorkspaceMember({
      workspaceId: invite.workspaceId,
      userId,
      role: invite.role
    });
  }

  async getWorkspaceInvites(workspaceId: string): Promise<WorkspaceInvite[]> {
    return Array.from(this.workspaceInvites.values())
      .filter(i => i.workspaceId === workspaceId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Session code operations for collaboration
  async createSessionCode(sessionCode: InsertSessionCode): Promise<SessionCode> {
    const id = randomUUID();
    const code: SessionCode = {
      ...sessionCode,
      id,
      isActive: sessionCode.isActive ?? true,
      createdAt: new Date()
    };
    this.sessionCodes.set(id, code);
    return code;
  }

  async getSessionCode(code: string): Promise<SessionCode | undefined> {
    return Array.from(this.sessionCodes.values()).find(sc => sc.code === code && sc.isActive);
  }

  async addUserToSession(sessionCode: string, userId: string): Promise<void> {
    const id = randomUUID();
    const participant: SessionParticipant = {
      id,
      sessionCode,
      userId,
      role: "participant",
      joinedAt: new Date()
    };
    this.sessionParticipants.set(id, participant);
  }

  async getSessionParticipants(sessionCode: string): Promise<SessionParticipant[]> {
    return Array.from(this.sessionParticipants.values())
      .filter(p => p.sessionCode === sessionCode);
  }

  async removeUserFromSession(sessionCode: string, userId: string): Promise<void> {
    const participant = Array.from(this.sessionParticipants.values())
      .find(p => p.sessionCode === sessionCode && p.userId === userId);
    if (participant) {
      this.sessionParticipants.delete(participant.id);
    }
  }

  // Chat message operations
  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = {
      ...message,
      id,
      messageType: message.messageType || "chat",
      timestamp: new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatHistory(sessionCode: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.sessionCode === sessionCode)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }

  async deleteChatMessage(messageId: string): Promise<void> {
    this.chatMessages.delete(messageId);
  }

  // Generated report operations
  async createGeneratedReport(report: InsertGeneratedReport): Promise<GeneratedReport> {
    const id = randomUUID();
    const generatedReport: GeneratedReport = {
      ...report,
      id,
      format: report.format || "markdown",
      metadata: report.metadata || {},
      generatedAt: new Date()
    };
    this.generatedReports.set(id, generatedReport);
    return generatedReport;
  }

  async getGeneratedReport(id: string): Promise<GeneratedReport | undefined> {
    return this.generatedReports.get(id);
  }

  async getUserGeneratedReports(userId: string): Promise<GeneratedReport[]> {
    return Array.from(this.generatedReports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => (b.generatedAt?.getTime() || 0) - (a.generatedAt?.getTime() || 0));
  }

  async deleteGeneratedReport(id: string): Promise<boolean> {
    return this.generatedReports.delete(id);
  }

  async getSessionReports(sessionId: string): Promise<GeneratedReport[]> {
    return Array.from(this.generatedReports.values())
      .filter(report => report.sessionId === sessionId)
      .sort((a, b) => (b.generatedAt?.getTime() || 0) - (a.generatedAt?.getTime() || 0));
  }

  // Stub implementations for enterprise features (not used in memory storage)
  async createOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationBySlug(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserOrganizations(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async addOrganizationMember(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async removeOrganizationMember(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationMembers(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationMembership(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateOrganizationMemberRole(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createTeam(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTeam(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTeam(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteTeam(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationTeams(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserTeams(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async addTeamMember(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async removeTeamMember(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTeamMembers(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTeamMembership(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTeamMemberRole(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createAuditLog(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAuditLogs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAuditLogsByAction(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createSecurityEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getSecurityEvents(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async resolveSecurityEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordUsageMetric(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUsageMetrics(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUsageByType(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createRateLimitRule(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRateLimitRules(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateRateLimitRule(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteRateLimitRule(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordPerformanceMetric(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPerformanceMetrics(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordError(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getErrorLogs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async resolveError(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordHealthCheck(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getHealthChecks(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getLatestHealthStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  
  // Tutorial system methods
  async createTutorial(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTutorial(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAllTutorials(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTutorialsByCategory(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getActiveTutorials(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTutorial(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteTutorial(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createTutorialStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTutorialStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTutorialSteps(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTutorialStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteTutorialStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteTutorialSteps(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createTutorialProgress(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTutorialProgress(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserTutorialProgress(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserAllTutorialProgress(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTutorialProgress(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteTutorialProgress(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async markTutorialStepCompleted(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async markTutorialCompleted(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createTutorialSettings(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTutorialSettings(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTutorialSettings(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async resetTutorialSettings(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Push notification methods
  async createPushSubscription(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPushSubscription(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserPushSubscriptions(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deletePushSubscription(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deletePushSubscriptionByEndpoint(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updatePushSubscription(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Template methods
  async createTemplate(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTemplate(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAllTemplates(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTemplatesByCategory(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPublicTemplates(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserTemplates(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTemplate(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteTemplate(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async incrementTemplateUsage(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  
  // Billing methods
  async getSubscriptionPlans(): Promise<{ id: string; name: string; priceMonthly: number; priceYearly: number; features: string[]; limits: Record<string, number> }[]> { throw new Error('Not implemented in MemStorage'); }
  async createOrUpdateSubscription(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getSubscription(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getSubscriptionByWorkspace(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateSubscriptionStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async cancelSubscription(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createEntitlement(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getEntitlements(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async revokeEntitlements(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async checkEntitlement(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Marketplace methods  
  async getMarketplaceTemplates(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTemplateProduct(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createTemplateProduct(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createTemplatePurchase(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTemplatePurchase(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async checkExistingPurchase(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserPurchases(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getWorkspacePurchases(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Documentation methods (Sprint 12)
  async createDoc(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDoc(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDocBySlug(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAllDocs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDocsByCategory(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPublishedDocs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateDoc(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteDoc(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async incrementDocViewCount(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async searchDocs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Workspace Synchronization methods - Production-Ready Implementation
  async createWorkspaceEvent(event: InsertWorkspaceEvent): Promise<WorkspaceEvent> {
    const id = randomUUID();
    const now = new Date();
    
    // Get next sequence number for workspace
    const currentSequence = this.workspaceSequenceNumbers.get(event.workspaceId) || 0;
    const nextSequence = currentSequence + 1;
    this.workspaceSequenceNumbers.set(event.workspaceId, nextSequence);
    
    const workspaceEvent: WorkspaceEvent = {
      id,
      workspaceId: event.workspaceId,
      eventType: event.eventType,
      eventData: event.eventData,
      userId: event.userId || null,
      sessionId: event.sessionId || null,
      sequenceNumber: nextSequence,
      metadata: event.metadata || {},
      isSystem: event.isSystem || false,
      broadcastTo: event.broadcastTo || [],
      createdAt: now
    };
    
    this.workspaceEvents.set(id, workspaceEvent);
    return workspaceEvent;
  }

  async createWorkspaceEventAtomic(event: InsertWorkspaceEvent): Promise<WorkspaceEvent> {
    // In MemStorage, atomicity is guaranteed by single-threaded Node.js
    // In production, this would use database transactions
    return this.createWorkspaceEvent(event);
  }

  async getWorkspaceEvent(id: string): Promise<WorkspaceEvent | undefined> {
    return this.workspaceEvents.get(id);
  }

  async getWorkspaceEvents(workspaceId: string, limit: number = 50, offset: number = 0): Promise<WorkspaceEvent[]> {
    const allEvents = Array.from(this.workspaceEvents.values())
      .filter(event => event.workspaceId === workspaceId)
      .sort((a, b) => b.sequenceNumber - a.sequenceNumber); // DESC order
    
    return allEvents.slice(offset, offset + limit);
  }

  async getWorkspaceEventsSince(workspaceId: string, sequenceNumber: number): Promise<WorkspaceEvent[]> {
    return Array.from(this.workspaceEvents.values())
      .filter(event => 
        event.workspaceId === workspaceId && 
        event.sequenceNumber > sequenceNumber
      )
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber); // ASC order for replay
  }

  async deleteWorkspaceEvent(id: string): Promise<boolean> {
    return this.workspaceEvents.delete(id);
  }

  async cleanupWorkspaceEvents(workspaceId: string, olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    let cleanedCount = 0;
    for (const [id, event] of this.workspaceEvents.entries()) {
      if (event.workspaceId === workspaceId && event.createdAt < cutoffDate) {
        this.workspaceEvents.delete(id);
        cleanedCount++;
      }
    }
    return cleanedCount;
  }

  async getNextSequenceNumber(workspaceId: string): Promise<number> {
    const currentSequence = this.workspaceSequenceNumbers.get(workspaceId) || 0;
    return currentSequence + 1;
  }

  async createWorkspaceConnection(connection: InsertWorkspaceConnection): Promise<WorkspaceConnection> {
    const id = randomUUID();
    const now = new Date();
    
    const workspaceConnection: WorkspaceConnection = {
      id,
      workspaceId: connection.workspaceId,
      userId: connection.userId,
      connectionId: connection.connectionId,
      userAgent: connection.userAgent || null,
      ipAddress: connection.ipAddress || null,
      metadata: connection.metadata || {},
      isActive: true,
      lastPing: now,
      createdAt: now,
      updatedAt: now
    };
    
    this.workspaceConnections.set(id, workspaceConnection);
    return workspaceConnection;
  }

  async getWorkspaceConnection(id: string): Promise<WorkspaceConnection | undefined> {
    return this.workspaceConnections.get(id);
  }

  async getActiveWorkspaceConnections(workspaceId: string): Promise<WorkspaceConnection[]> {
    return Array.from(this.workspaceConnections.values())
      .filter(conn => conn.workspaceId === workspaceId && conn.isActive)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async getUserWorkspaceConnections(workspaceId: string, userId: string): Promise<WorkspaceConnection[]> {
    return Array.from(this.workspaceConnections.values())
      .filter(conn => 
        conn.workspaceId === workspaceId && 
        conn.userId === userId && 
        conn.isActive
      )
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async updateConnectionPing(connectionId: string): Promise<WorkspaceConnection | undefined> {
    // Find connection by connectionId
    for (const [id, conn] of this.workspaceConnections.entries()) {
      if (conn.connectionId === connectionId) {
        const updated = {
          ...conn,
          lastPing: new Date(),
          updatedAt: new Date()
        };
        this.workspaceConnections.set(id, updated);
        return updated;
      }
    }
    return undefined;
  }

  async deactivateConnection(connectionId: string): Promise<boolean> {
    // Find connection by connectionId and deactivate
    for (const [id, conn] of this.workspaceConnections.entries()) {
      if (conn.connectionId === connectionId) {
        const updated = {
          ...conn,
          isActive: false,
          updatedAt: new Date()
        };
        this.workspaceConnections.set(id, updated);
        return true;
      }
    }
    return false;
  }

  async deactivateUserConnections(workspaceId: string, userId: string): Promise<number> {
    let deactivatedCount = 0;
    for (const [id, conn] of this.workspaceConnections.entries()) {
      if (conn.workspaceId === workspaceId && conn.userId === userId && conn.isActive) {
        const updated = {
          ...conn,
          isActive: false,
          updatedAt: new Date()
        };
        this.workspaceConnections.set(id, updated);
        deactivatedCount++;
      }
    }
    return deactivatedCount;
  }

  async cleanupStaleConnections(olderThanMinutes: number): Promise<number> {
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - olderThanMinutes);
    
    let cleanedCount = 0;
    for (const [id, conn] of this.workspaceConnections.entries()) {
      if (conn.lastPing && conn.lastPing < cutoffTime) {
        const updated = {
          ...conn,
          isActive: false,
          updatedAt: new Date()
        };
        this.workspaceConnections.set(id, updated);
        cleanedCount++;
      }
    }
    return cleanedCount;
  }

  async getWorkspaceActiveUsers(workspaceId: string): Promise<{ userId: string; user: User; connectionsCount: number; lastActivity: Date }[]> {
    const activeConnections = await this.getActiveWorkspaceConnections(workspaceId);
    const userConnectionsMap = new Map<string, { count: number; lastActivity: Date }>();
    
    // Group connections by user
    for (const conn of activeConnections) {
      const existing = userConnectionsMap.get(conn.userId);
      const lastActivity = conn.lastPing || conn.updatedAt || conn.createdAt;
      
      if (!existing || lastActivity > existing.lastActivity) {
        userConnectionsMap.set(conn.userId, {
          count: (existing?.count || 0) + 1,
          lastActivity
        });
      }
    }
    
    // Build result with user data
    const result: { userId: string; user: User; connectionsCount: number; lastActivity: Date }[] = [];
    for (const [userId, data] of userConnectionsMap.entries()) {
      const user = this.users.get(userId);
      if (user) {
        result.push({
          userId,
          user,
          connectionsCount: data.count,
          lastActivity: data.lastActivity
        });
      }
    }
    
    return result.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  async isUserActiveInWorkspace(workspaceId: string, userId: string): Promise<boolean> {
    const userConnections = await this.getUserWorkspaceConnections(workspaceId, userId);
    return userConnections.length > 0;
  }

  async getWorkspaceConnectionsCount(workspaceId: string): Promise<number> {
    const activeConnections = await this.getActiveWorkspaceConnections(workspaceId);
    return activeConnections.length;
  }

  // Sprint 1 methods
  async createDebateRun(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDebateRun(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateDebateRunStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createExportLog(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getExportLogs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createExportProvenance(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getExportProvenance(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getExportProvenanceHistory(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Stripe integration methods
  async getStripeCustomerByUserId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateUserStripeCustomerId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createSubscription(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getSubscriptionByStripeId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateSubscriptionByStripeId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getActiveSubscriptionByWorkspaceId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async grantPlanEntitlements(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async revokeAllEntitlements(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async isWorkspaceAdmin(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 5 - Reviews/Approvals system methods
  async createReview(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReview(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviews(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewsByResource(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewsByInitiator(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewsByStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateReview(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteReview(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async approveReview(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async rejectReview(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createReviewStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewSteps(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateReviewStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteReviewStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async completeReviewStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async skipReviewStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createReviewAssignment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewAssignment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewAssignments(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAssignmentsByAssignee(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateReviewAssignment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteReviewAssignment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async respondToAssignment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async delegateAssignment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createReviewComment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewComment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getReviewComments(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getCommentsByStep(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getCommentsByAssignment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateReviewComment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteReviewComment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async resolveComment(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 5 - Retention/Legal Hold system methods
  async createRetentionPolicy(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRetentionPolicy(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRetentionPolicies(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRetentionPoliciesByDataType(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getActiveRetentionPolicies(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateRetentionPolicy(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteRetentionPolicy(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async activateRetentionPolicy(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deactivateRetentionPolicy(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createLegalHold(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getLegalHold(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getLegalHolds(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getActiveLegalHolds(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getLegalHoldsByCustodian(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getLegalHoldsByDateRange(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateLegalHold(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteLegalHold(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async releaseLegalHold(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createRetentionJob(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRetentionJob(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRetentionJobs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRetentionJobsByPolicy(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRetentionJobsByStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScheduledRetentionJobs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateRetentionJob(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteRetentionJob(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async startRetentionJob(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async completeRetentionJob(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async failRetentionJob(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createDataClassification(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDataClassification(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDataClassifications(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDataClassificationByResource(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDataClassificationsByClassification(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDataClassificationsBySensitivity(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDataClassificationsRequiringReview(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateDataClassification(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteDataClassification(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async reviewDataClassification(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 5 - SCIM provisioning system methods
  async createScimUser(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimUser(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimUsers(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimUserByExternalId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimUserByEmail(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimUsersByOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimUsersBySyncStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateScimUser(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteScimUser(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async activateScimUser(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deactivateScimUser(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createScimGroup(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroup(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroups(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupByExternalId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupsByOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupsBySyncStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateScimGroup(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteScimGroup(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createScimGroupMembership(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupMembership(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupMemberships(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimUserMemberships(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupMembershipByIds(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupMembershipsBySyncStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateScimGroupMembership(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteScimGroupMembership(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async addUserToScimGroup(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async removeUserFromScimGroup(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createProvisioningLog(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getProvisioningLog(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getProvisioningLogs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getProvisioningLogsByOperation(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getProvisioningLogsByResourceType(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getProvisioningLogsByStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getProvisioningLogsByRequestId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getProvisioningLogsByBatch(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getProvisioningLogsByDateRange(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateProvisioningLog(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteProvisioningLog(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 6 - Template builder methods
  async publishTemplate(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async unpublishTemplate(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTemplatesByStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTemplateVersions(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createTemplateVersion(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 6 - Workflow automation methods
  async createWorkflowDefinition(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getWorkflowDefinition(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateWorkflowDefinition(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteWorkflowDefinition(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationWorkflowDefinitions(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createWorkflowExecution(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getWorkflowExecution(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateWorkflowExecution(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getWorkflowExecutions(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createWorkflowEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getWorkflowEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateWorkflowEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPendingWorkflowEvents(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 6 - Organization insights methods
  async createOrganizationAnalytics(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationAnalytics(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationAnalyticsRange(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateOrganizationAnalytics(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createOrganizationDailyReport(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationDailyReport(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationDailyReports(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordEnhancedUsageMetric(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getEnhancedUsageMetrics(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationInsightsSummary(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async generateDailyInsightsReport(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async startTrial(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTrialStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 11 - Billing & entitlements methods
  async createInvoice(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getInvoice(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getInvoicesByOrg(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateInvoice(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createDunningEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDunningEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDunningEventsByInvoice(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getDunningEventsByOrg(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createSeats(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getSeats(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateSeats(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 12 - Admin settings methods
  async createAdminSetting(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAdminSetting(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAllAdminSettings(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAdminSettingsByCategory(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateAdminSetting(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteAdminSetting(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 12 - Marketplace methods
  async createMarketplaceItem(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getMarketplaceItem(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAllMarketplaceItems(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getMarketplaceItemsByCategory(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPublishedMarketplaceItems(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getFeaturedMarketplaceItems(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getMarketplaceItemsByPublisher(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateMarketplaceItem(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteMarketplaceItem(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async incrementMarketplaceItemViews(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async incrementMarketplaceItemDownloads(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async searchMarketplaceItems(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 12 - Changelog methods
  async createChangelogEntry(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getChangelogEntry(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getChangelogEntryByVersion(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAllChangelogEntries(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPublishedChangelogEntries(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPinnedChangelogEntries(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getChangelogEntriesByType(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateChangelogEntry(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteChangelogEntry(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async publishChangelogEntry(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Sprint 12 - Playbooks methods
  async createPlaybook(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPlaybook(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAllPlaybooks(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPlaybooksByType(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPlaybooksByRole(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPlaybooksByCategory(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getActivePlaybooks(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updatePlaybook(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deletePlaybook(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async incrementPlaybookUsage(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async searchPlaybooks(): Promise<any> { throw new Error('Not implemented in MemStorage'); }

  // Additional SCIM methods that were missing
  async getScimUserByScimId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getActiveScimUsers(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async linkScimUserToLocal(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async syncScimUser(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async bulkSyncScimUsers(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deprovisionScimUser(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupByScimId(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getScimGroupsByType(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async syncScimGroup(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deprovisionScimGroup(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async upsertUser(upsertData: UpsertUser): Promise<User> {
    const now = new Date();
    
    // First check by ID if provided
    let existing = upsertData.id ? await this.getUser(upsertData.id) : null;
    
    // If not found by ID but email is provided, check by email
    if (!existing && upsertData.email) {
      existing = await this.getUserByEmail(upsertData.email);
    }
    
    if (existing) {
      // Update existing user
      const updated = await this.updateUser(existing.id, {
        email: upsertData.email,
        firstName: upsertData.firstName,
        lastName: upsertData.lastName,
        profileImageUrl: upsertData.profileImageUrl,
        updatedAt: now
      });
      return updated!;
    } else {
      // Create new user with defaults
      const newUser: InsertUser = {
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
      // Set the OAuth ID if provided
      if (upsertData.id && created.id !== upsertData.id) {
        return await this.updateUser(created.id, { id: upsertData.id }) || created;
      }
      return created;
    }
  }

  async updateUserPreferences(id: string, preferences: UserPreferences): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    
    return await this.updateUser(id, { 
      preferences: existing.preferences ? { ...existing.preferences, ...preferences } : preferences
    });
  }

  async updateOnboardingProgress(id: string, progress: any): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    
    return await this.updateUser(id, { 
      onboardingProgress: existing.onboardingProgress ? { ...existing.onboardingProgress, ...progress } : progress
    });
  }

  async updateUserSubscription(id: string, subscription: any): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    
    return await this.updateUser(id, { 
      subscription: existing.subscription ? { ...existing.subscription, ...subscription } : subscription
    });
  }

  async createAnalysisSession(sessionData: InsertAnalysisSession & { results?: any; telemetry?: any; debateHistory?: any }): Promise<AnalysisSession> {
    const [session] = await db.insert(analysisSessions).values({
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
    return session;
  }

  async getAnalysisSession(id: string): Promise<AnalysisSession | undefined> {
    const [session] = await db.select().from(analysisSessions).where(eq(analysisSessions.id, id));
    return session || undefined;
  }

  async updateAnalysisSession(id: string, updates: Partial<AnalysisSession>): Promise<AnalysisSession | undefined> {
    const [session] = await db.update(analysisSessions)
      .set(updates)
      .where(eq(analysisSessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserAnalysisSessions(userId?: string): Promise<AnalysisSession[]> {
    if (userId) {
      const result = await db.select().from(analysisSessions).where(eq(analysisSessions.userId, userId)).orderBy(analysisSessions.createdAt);
      return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    const result = await db.select().from(analysisSessions).orderBy(analysisSessions.createdAt);
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Session transfer methods for cross-mode debate continuation
  async getTransferableSessions(userId?: string, excludeMode?: string): Promise<AnalysisSession[]> {
    let query = db.select().from(analysisSessions);
    
    const conditions = [];
    if (userId) {
      conditions.push(eq(analysisSessions.userId, userId));
    }
    if (excludeMode) {
      conditions.push(not(eq(analysisSessions.mode, excludeMode)));
    }
    
    if (conditions.length > 0) {
      const result = await query.where(and(...conditions)).orderBy(analysisSessions.createdAt);
      return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    
    const result = await query.orderBy(analysisSessions.createdAt);
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getSessionForTransfer(sessionId: string): Promise<AnalysisSession | undefined> {
    const [session] = await db.select().from(analysisSessions).where(eq(analysisSessions.id, sessionId));
    return session || undefined;
  }

  // Workspace management methods
  generateSessionCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async createWorkspace(workspaceData: InsertWorkspace): Promise<Workspace> {
    const sessionCode = this.generateSessionCode();
    const [workspace] = await db.insert(workspaces).values({
      ...workspaceData,
      sessionCode,
    }).returning();
    return workspace;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace || undefined;
  }

  async getWorkspaceBySessionCode(sessionCode: string): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.sessionCode, sessionCode));
    return workspace || undefined;
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | undefined> {
    const [workspace] = await db.update(workspaces)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workspaces.id, id))
      .returning();
    return workspace || undefined;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    const result = await db.delete(workspaces).where(eq(workspaces.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    // Get workspaces where user is owner or member
    const result = await db
      .select({ workspace: workspaces })
      .from(workspaces)
      .leftJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        sql`${workspaces.ownerId} = ${userId} OR ${workspaceMembers.userId} = ${userId}`
      )
      .groupBy(workspaces.id);
    
    return result.map(r => r.workspace).sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  // Workspace membership methods
  async addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember> {
    const [workspaceMember] = await db.insert(workspaceMembers).values(member).returning();
    return workspaceMember;
  }

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
    const result = await db.delete(workspaceMembers)
      .where(sql`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`);
    return (result.rowCount || 0) > 0;
  }

  async getWorkspaceMembers(workspaceId: string): Promise<(WorkspaceMember & { user: User })[]> {
    const result = await db
      .select()
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId));
    
    return result.map(row => ({
      ...row.workspace_members,
      user: row.users
    }));
  }

  async getUserWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined> {
    const [member] = await db.select().from(workspaceMembers)
      .where(sql`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`);
    return member || undefined;
  }

  async getWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined> {
    return this.getUserWorkspaceMembership(workspaceId, userId);
  }

  async updateMemberRole(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | undefined> {
    const [member] = await db.update(workspaceMembers)
      .set({ role })
      .where(sql`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`)
      .returning();
    return member || undefined;
  }

  // Workspace invitation methods
  async createWorkspaceInvite(invite: InsertWorkspaceInvite): Promise<WorkspaceInvite> {
    const inviteCode = randomUUID().substring(0, 16);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [workspaceInvite] = await db.insert(workspaceInvites).values({
      ...invite,
      inviteCode,
      expiresAt,
    }).returning();
    return workspaceInvite;
  }

  async getWorkspaceInvite(inviteCode: string): Promise<WorkspaceInvite | undefined> {
    const [invite] = await db.select().from(workspaceInvites)
      .where(sql`${workspaceInvites.inviteCode} = ${inviteCode} AND ${workspaceInvites.status} = 'pending'`);
    return invite || undefined;
  }

  async acceptWorkspaceInvite(inviteCode: string, userId: string): Promise<WorkspaceMember | undefined> {
    const invite = await this.getWorkspaceInvite(inviteCode);
    if (!invite || invite.expiresAt! < new Date()) return undefined;

    // Mark invite as accepted
    await db.update(workspaceInvites)
      .set({ status: "accepted" })
      .where(eq(workspaceInvites.id, invite.id));

    // Add user as workspace member
    return await this.addWorkspaceMember({
      workspaceId: invite.workspaceId,
      userId,
      role: invite.role
    });
  }

  async getWorkspaceInvites(workspaceId: string): Promise<WorkspaceInvite[]> {
    const result = await db.select().from(workspaceInvites)
      .where(eq(workspaceInvites.workspaceId, workspaceId))
      .orderBy(workspaceInvites.createdAt);
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }


  // Session code operations for collaboration
  async createSessionCode(sessionCodeData: InsertSessionCode): Promise<SessionCode> {
    const [sessionCode] = await db.insert(sessionCodes).values(sessionCodeData).returning();
    return sessionCode;
  }

  async getSessionCode(code: string): Promise<SessionCode | undefined> {
    const [sessionCode] = await db.select().from(sessionCodes)
      .where(sql`${sessionCodes.code} = ${code} AND ${sessionCodes.isActive} = true AND ${sessionCodes.expiresAt} > NOW()`);
    return sessionCode || undefined;
  }

  async addUserToSession(sessionCode: string, userId: string): Promise<void> {
    await db.insert(sessionParticipants).values({
      sessionCode,
      userId,
      role: "participant"
    });
  }

  async getSessionParticipants(sessionCode: string): Promise<SessionParticipant[]> {
    return await db.select().from(sessionParticipants)
      .where(eq(sessionParticipants.sessionCode, sessionCode))
      .orderBy(sessionParticipants.joinedAt);
  }

  async removeUserFromSession(sessionCode: string, userId: string): Promise<void> {
    await db.delete(sessionParticipants)
      .where(sql`${sessionParticipants.sessionCode} = ${sessionCode} AND ${sessionParticipants.userId} = ${userId}`);
  }

  // Chat message operations for team communication
  async saveChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }

  async getChatHistory(sessionCode: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages)
      .where(eq(chatMessages.sessionCode, sessionCode))
      .orderBy(chatMessages.timestamp);
  }

  async deleteChatMessage(messageId: string): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.id, messageId));
  }

  // Generated report operations for report management
  async createGeneratedReport(report: InsertGeneratedReport): Promise<GeneratedReport> {
    const [generatedReport] = await db.insert(generatedReports).values(report).returning();
    return generatedReport;
  }

  async getGeneratedReport(id: string): Promise<GeneratedReport | undefined> {
    const [report] = await db.select().from(generatedReports).where(eq(generatedReports.id, id));
    return report || undefined;
  }

  async getUserGeneratedReports(userId: string): Promise<GeneratedReport[]> {
    return await db.select().from(generatedReports)
      .where(eq(generatedReports.userId, userId))
      .orderBy(sql`${generatedReports.generatedAt} DESC`);
  }

  async deleteGeneratedReport(id: string): Promise<boolean> {
    const result = await db.delete(generatedReports).where(eq(generatedReports.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSessionReports(sessionId: string): Promise<GeneratedReport[]> {
    return await db.select().from(generatedReports)
      .where(eq(generatedReports.sessionId, sessionId))
      .orderBy(sql`${generatedReports.generatedAt} DESC`);
  }

  // Organization management methods (stubs for now)
  async createOrganization(organization: InsertOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(organization).returning();
    return org;
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || undefined;
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
    return org || undefined;
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined> {
    const [org] = await db.update(organizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return org || undefined;
  }

  async deleteOrganization(id: string): Promise<boolean> {
    const result = await db.delete(organizations).where(eq(organizations.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const result = await db
      .select({ organization: organizations })
      .from(organizations)
      .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
      .where(eq(organizationMembers.userId, userId));
    
    return result.map(r => r.organization);
  }

  async addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember> {
    const [orgMember] = await db.insert(organizationMembers).values(member).returning();
    return orgMember;
  }

  async removeOrganizationMember(organizationId: string, userId: string): Promise<boolean> {
    const result = await db.delete(organizationMembers)
      .where(sql`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`);
    return (result.rowCount || 0) > 0;
  }

  async getOrganizationMembers(organizationId: string): Promise<(OrganizationMember & { user: User })[]> {
    const result = await db
      .select()
      .from(organizationMembers)
      .innerJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, organizationId));
    
    return result.map(row => ({
      ...row.organization_members,
      user: row.users
    }));
  }

  async getOrganizationMembership(organizationId: string, userId: string): Promise<OrganizationMember | undefined> {
    const [member] = await db.select().from(organizationMembers)
      .where(sql`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`);
    return member || undefined;
  }

  async updateOrganizationMemberRole(organizationId: string, userId: string, role: string, permissions?: any): Promise<OrganizationMember | undefined> {
    const [member] = await db.update(organizationMembers)
      .set({ role, permissions })
      .where(sql`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`)
      .returning();
    return member || undefined;
  }

  async getUserOrganizationMemberships(userId: string): Promise<any[]> {
    // Return empty array for now since organization features are not fully implemented
    // This prevents the auth route from failing
    return [];
  }

  // Stub implementations for other enterprise features
  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined> {
    const [team] = await db.update(teams)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return team || undefined;
  }

  async deleteTeam(id: string): Promise<boolean> {
    const result = await db.delete(teams).where(eq(teams.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getOrganizationTeams(organizationId: string): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.organizationId, organizationId));
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const result = await db
      .select({ team: teams })
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(eq(teamMembers.userId, userId));
    
    return result.map(r => r.team);
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db.insert(teamMembers).values(member).returning();
    return teamMember;
  }

  async removeTeamMember(teamId: string, userId: string): Promise<boolean> {
    const result = await db.delete(teamMembers)
      .where(sql`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`);
    return (result.rowCount || 0) > 0;
  }

  async getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]> {
    const result = await db
      .select()
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));
    
    return result.map(row => ({
      ...row.team_members,
      user: row.users
    }));
  }

  async getTeamMembership(teamId: string, userId: string): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers)
      .where(sql`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`);
    return member || undefined;
  }

  async updateTeamMemberRole(teamId: string, userId: string, role: string): Promise<TeamMember | undefined> {
    const [member] = await db.update(teamMembers)
      .set({ role })
      .where(sql`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`)
      .returning();
    return member || undefined;
  }

  // Audit and Security stubs
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [auditLog] = await db.insert(auditLogs).values(log).returning();
    return auditLog;
  }

  async getAuditLogs(organizationId?: string, userId?: string, limit?: number): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(auditLogs.organizationId, organizationId));
    }
    if (userId) {
      conditions.push(eq(auditLogs.userId, userId));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query.orderBy(auditLogs.timestamp);
  }

  async getAuditLogsByAction(action: string, organizationId?: string): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    
    const conditions = [eq(auditLogs.action, action)];
    if (organizationId) {
      conditions.push(eq(auditLogs.organizationId, organizationId));
    }
    
    query = query.where(sql`${conditions.join(' AND ')}`);
    
    return await query.orderBy(auditLogs.timestamp);
  }

  async createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent> {
    const [securityEvent] = await db.insert(securityEvents).values(event).returning();
    return securityEvent;
  }

  async getSecurityEvents(organizationId?: string, severity?: string): Promise<SecurityEvent[]> {
    let query = db.select().from(securityEvents);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(securityEvents.organizationId, organizationId));
    }
    if (severity) {
      conditions.push(eq(securityEvents.severity, severity));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(securityEvents.timestamp);
  }

  async resolveSecurityEvent(id: string, resolvedBy: string): Promise<SecurityEvent | undefined> {
    const [event] = await db.update(securityEvents)
      .set({ resolved: true, resolvedBy, resolvedAt: new Date() })
      .where(eq(securityEvents.id, id))
      .returning();
    return event || undefined;
  }

  // Usage and Performance stubs
  async recordUsageMetric(metric: InsertUsageMetric): Promise<UsageMetric> {
    const [usageMetric] = await db.insert(usageMetrics).values(metric).returning();
    return usageMetric;
  }

  async getUsageMetrics(organizationId?: string, userId?: string, period?: string): Promise<UsageMetric[]> {
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
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(usageMetrics.createdAt);
  }

  async getUsageByType(metricType: string, organizationId?: string): Promise<UsageMetric[]> {
    let query = db.select().from(usageMetrics);
    
    const conditions = [eq(usageMetrics.metricType, metricType)];
    if (organizationId) {
      conditions.push(eq(usageMetrics.organizationId, organizationId));
    }
    
    query = query.where(sql`${conditions.join(' AND ')}`);
    
    return await query.orderBy(usageMetrics.createdAt);
  }

  async createRateLimitRule(rule: InsertRateLimitRule): Promise<RateLimitRule> {
    const [rateLimitRule] = await db.insert(rateLimitRules).values(rule).returning();
    return rateLimitRule;
  }

  async getRateLimitRules(organizationId?: string): Promise<RateLimitRule[]> {
    let query = db.select().from(rateLimitRules);
    
    if (organizationId) {
      query = query.where(eq(rateLimitRules.organizationId, organizationId));
    }
    
    return await query;
  }

  async updateRateLimitRule(id: string, updates: Partial<RateLimitRule>): Promise<RateLimitRule | undefined> {
    const [rule] = await db.update(rateLimitRules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rateLimitRules.id, id))
      .returning();
    return rule || undefined;
  }

  async deleteRateLimitRule(id: string): Promise<boolean> {
    const result = await db.delete(rateLimitRules).where(eq(rateLimitRules.id, id));
    return (result.rowCount || 0) > 0;
  }

  async recordPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const [performanceMetric] = await db.insert(performanceMetrics).values(metric).returning();
    return performanceMetric;
  }

  async getPerformanceMetrics(organizationId?: string, metricName?: string): Promise<PerformanceMetric[]> {
    let query = db.select().from(performanceMetrics);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(performanceMetrics.organizationId, organizationId));
    }
    if (metricName) {
      conditions.push(eq(performanceMetrics.metricName, metricName));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(performanceMetrics.timestamp);
  }

  async recordError(error: InsertErrorLog): Promise<ErrorLog> {
    const [errorLog] = await db.insert(errorLogs).values(error).returning();
    return errorLog;
  }

  async getErrorLogs(organizationId?: string, severity?: string): Promise<ErrorLog[]> {
    let query = db.select().from(errorLogs);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(errorLogs.organizationId, organizationId));
    }
    if (severity) {
      conditions.push(eq(errorLogs.severity, severity));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(errorLogs.timestamp);
  }

  async resolveError(id: string, resolvedBy: string): Promise<ErrorLog | undefined> {
    const [error] = await db.update(errorLogs)
      .set({ resolved: true, resolvedBy, resolvedAt: new Date() })
      .where(eq(errorLogs.id, id))
      .returning();
    return error || undefined;
  }

  async recordHealthCheck(check: InsertHealthCheck): Promise<HealthCheck> {
    const [healthCheck] = await db.insert(healthChecks).values(check).returning();
    return healthCheck;
  }

  async getHealthChecks(serviceName?: string): Promise<HealthCheck[]> {
    let query = db.select().from(healthChecks);
    
    if (serviceName) {
      query = query.where(eq(healthChecks.serviceName, serviceName));
    }
    
    return await query.orderBy(healthChecks.timestamp);
  }

  async getLatestHealthStatus(): Promise<{ [serviceName: string]: HealthCheck }> {
    const checks = await db.select().from(healthChecks).orderBy(healthChecks.timestamp);
    const latest: { [serviceName: string]: HealthCheck } = {};
    
    for (const check of checks) {
      if (!latest[check.serviceName] || (check.timestamp && latest[check.serviceName]?.timestamp && check.timestamp > latest[check.serviceName].timestamp!)) {
        latest[check.serviceName] = check;
      }
    }
    
    return latest;
  }

  // ============================================
  // SPRINT 1 - Async Processing & Export Tracking Implementation
  // ============================================
  
  async createDebateRun(run: InsertDebateRun): Promise<DebateRun> {
    const [debateRun] = await db.insert(debateRuns).values(run).returning();
    return debateRun;
  }

  async getDebateRun(id: string): Promise<DebateRun | undefined> {
    const [debateRun] = await db.select().from(debateRuns).where(eq(debateRuns.id, id));
    return debateRun || undefined;
  }

  async updateDebateRunStatus(id: string, status: string, completedAt?: Date): Promise<DebateRun | undefined> {
    const updateData: any = { status };
    if (completedAt) {
      updateData.completedAt = completedAt;
    }
    
    const [debateRun] = await db.update(debateRuns)
      .set(updateData)
      .where(eq(debateRuns.id, id))
      .returning();
    return debateRun || undefined;
  }

  async createExportLog(log: InsertExportLog): Promise<ExportLog> {
    const [exportLog] = await db.insert(exportLogs).values(log).returning();
    return exportLog;
  }

  async getExportLogs(userId?: string, workspaceId?: string): Promise<ExportLog[]> {
    let query = db.select().from(exportLogs);
    
    const conditions = [];
    if (userId) {
      conditions.push(eq(exportLogs.userId, userId));
    }
    if (workspaceId) {
      conditions.push(eq(exportLogs.workspaceId, workspaceId));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(exportLogs.createdAt);
  }

  // Export provenance tracking implementation
  async createExportProvenance(provenance: any): Promise<string> {
    // Since we don't have a dedicated provenance table, store as enhanced export log
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

  async getExportProvenance(exportId: string): Promise<any> {
    // Find provenance data stored in export logs  
    const logs = await db.select().from(exportLogs)
      .where(sql`json_extract(dlp_hits, '$.exportId') = ${exportId}`)
      .orderBy(exportLogs.createdAt);
      
    if (logs.length === 0) return null;
    
    const log = logs[0];
    try {
      return JSON.parse(log.dlpHits || '{}');
    } catch {
      return null;
    }
  }

  async getExportProvenanceHistory(userId?: string, organizationId?: string): Promise<any[]> {
    let query = db.select().from(exportLogs);
    
    const conditions = [];
    if (userId) {
      conditions.push(eq(exportLogs.userId, userId));
    }
    if (organizationId) {
      conditions.push(sql`json_extract(dlp_hits, '$.organizationId') = ${organizationId}`);
    }
    
    // Only get logs with provenance data (complianceStatus exists)
    conditions.push(sql`json_extract(dlp_hits, '$.complianceStatus') IS NOT NULL`);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const logs = await query.orderBy(exportLogs.createdAt);
    
    return logs.map(log => {
      try {
        return JSON.parse(log.dlpHits || '{}');
      } catch {
        return {};
      }
    }).filter(log => log.complianceStatus);
  }

  // ============================================
  // PUSH NOTIFICATION SUBSCRIPTIONS
  // ============================================
  
  async createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription> {
    const [pushSubscription] = await db.insert(pushSubscriptions).values(subscription).returning();
    return pushSubscription;
  }

  async getPushSubscription(id: string): Promise<PushSubscription | undefined> {
    const [pushSubscription] = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.id, id));
    return pushSubscription || undefined;
  }

  async getUserPushSubscriptions(userId: string): Promise<PushSubscription[]> {
    return await db.select().from(pushSubscriptions)
      .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.isActive, true)))
      .orderBy(pushSubscriptions.createdAt);
  }

  async deletePushSubscription(id: string): Promise<boolean> {
    const result = await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async deletePushSubscriptionByEndpoint(endpoint: string, userId: string): Promise<boolean> {
    const result = await db.delete(pushSubscriptions)
      .where(and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  async updatePushSubscription(id: string, updates: Partial<PushSubscription>): Promise<PushSubscription | undefined> {
    const [pushSubscription] = await db.update(pushSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(pushSubscriptions.id, id))
      .returning();
    return pushSubscription || undefined;
  }

  // ============================================
  // TUTORIAL SYSTEM IMPLEMENTATIONS
  // ============================================
  
  // Tutorial management operations
  async createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
    const [newTutorial] = await db.insert(tutorials).values(tutorial).returning();
    return newTutorial;
  }

  async getTutorial(id: string): Promise<Tutorial | undefined> {
    const [tutorial] = await db.select().from(tutorials).where(eq(tutorials.id, id));
    return tutorial || undefined;
  }

  async getAllTutorials(): Promise<Tutorial[]> {
    return await db.select().from(tutorials).orderBy(tutorials.priority, tutorials.name);
  }

  async getTutorialsByCategory(category: string): Promise<Tutorial[]> {
    return await db.select().from(tutorials)
      .where(eq(tutorials.category, category))
      .orderBy(tutorials.priority, tutorials.name);
  }

  async getActiveTutorials(): Promise<Tutorial[]> {
    return await db.select().from(tutorials)
      .where(eq(tutorials.isActive, true))
      .orderBy(tutorials.priority, tutorials.name);
  }

  async updateTutorial(id: string, updates: Partial<Tutorial>): Promise<Tutorial | undefined> {
    const [tutorial] = await db.update(tutorials)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tutorials.id, id))
      .returning();
    return tutorial || undefined;
  }

  async deleteTutorial(id: string): Promise<boolean> {
    // Delete all related tutorial steps first
    await db.delete(tutorialSteps).where(eq(tutorialSteps.tutorialId, id));
    
    // Delete all related progress records
    await db.delete(tutorialProgress).where(eq(tutorialProgress.tutorialId, id));
    
    // Finally delete the tutorial
    const result = await db.delete(tutorials).where(eq(tutorials.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  
  // Tutorial step management operations
  async createTutorialStep(step: InsertTutorialStep): Promise<TutorialStep> {
    const [newStep] = await db.insert(tutorialSteps).values(step).returning();
    return newStep;
  }

  async getTutorialStep(id: string): Promise<TutorialStep | undefined> {
    const [step] = await db.select().from(tutorialSteps).where(eq(tutorialSteps.id, id));
    return step || undefined;
  }

  async getTutorialSteps(tutorialId: string): Promise<TutorialStep[]> {
    return await db.select().from(tutorialSteps)
      .where(eq(tutorialSteps.tutorialId, tutorialId))
      .orderBy(tutorialSteps.stepNumber);
  }

  async updateTutorialStep(id: string, updates: Partial<TutorialStep>): Promise<TutorialStep | undefined> {
    const [step] = await db.update(tutorialSteps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tutorialSteps.id, id))
      .returning();
    return step || undefined;
  }

  async deleteTutorialStep(id: string): Promise<boolean> {
    const result = await db.delete(tutorialSteps).where(eq(tutorialSteps.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteTutorialSteps(tutorialId: string): Promise<boolean> {
    const result = await db.delete(tutorialSteps).where(eq(tutorialSteps.tutorialId, tutorialId));
    return (result.rowCount ?? 0) > 0;
  }
  
  // Tutorial progress tracking operations
  async createTutorialProgress(progress: InsertTutorialProgress): Promise<TutorialProgress> {
    const [newProgress] = await db.insert(tutorialProgress).values({
      ...progress,
      startedAt: new Date(),
      lastInteractionAt: new Date()
    }).returning();
    return newProgress;
  }

  async getTutorialProgress(id: string): Promise<TutorialProgress | undefined> {
    const [progress] = await db.select().from(tutorialProgress).where(eq(tutorialProgress.id, id));
    return progress || undefined;
  }

  async getUserTutorialProgress(userId: string, tutorialId: string): Promise<TutorialProgress | undefined> {
    const [progress] = await db.select().from(tutorialProgress)
      .where(and(
        eq(tutorialProgress.userId, userId),
        eq(tutorialProgress.tutorialId, tutorialId)
      ));
    return progress || undefined;
  }

  async getUserAllTutorialProgress(userId: string): Promise<TutorialProgress[]> {
    return await db.select().from(tutorialProgress)
      .where(eq(tutorialProgress.userId, userId))
      .orderBy(tutorialProgress.lastInteractionAt);
  }

  async updateTutorialProgress(id: string, updates: Partial<TutorialProgress>): Promise<TutorialProgress | undefined> {
    const [progress] = await db.update(tutorialProgress)
      .set({ ...updates, lastInteractionAt: new Date() })
      .where(eq(tutorialProgress.id, id))
      .returning();
    return progress || undefined;
  }

  async deleteTutorialProgress(id: string): Promise<boolean> {
    const result = await db.delete(tutorialProgress).where(eq(tutorialProgress.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async markTutorialStepCompleted(userId: string, tutorialId: string, stepNumber: number): Promise<TutorialProgress | undefined> {
    // Get or create tutorial progress
    let progress = await this.getUserTutorialProgress(userId, tutorialId);
    
    if (!progress) {
      progress = await this.createTutorialProgress({
        userId,
        tutorialId,
        status: 'in_progress',
        currentStep: stepNumber,
        completedSteps: [stepNumber],
        skippedSteps: []
      });
    } else {
      // Update progress
      const completedSteps = Array.isArray(progress.completedSteps) 
        ? [...progress.completedSteps] 
        : [];
      
      if (!completedSteps.includes(stepNumber)) {
        completedSteps.push(stepNumber);
      }

      progress = await this.updateTutorialProgress(progress.id, {
        status: 'in_progress',
        currentStep: stepNumber + 1, // Move to next step
        completedSteps: completedSteps
      });
    }
    
    return progress;
  }

  async markTutorialCompleted(userId: string, tutorialId: string): Promise<TutorialProgress | undefined> {
    let progress = await this.getUserTutorialProgress(userId, tutorialId);
    
    if (!progress) {
      // Create completed progress if none exists
      progress = await this.createTutorialProgress({
        userId,
        tutorialId,
        status: 'completed',
        completedAt: new Date()
      });
    } else {
      // Mark as completed
      progress = await this.updateTutorialProgress(progress.id, {
        status: 'completed',
        completedAt: new Date()
      });
    }

    // Update user settings with completion count
    const settings = await this.getTutorialSettings(userId);
    if (settings) {
      await this.updateTutorialSettings(userId, {
        completedTutorialCount: (settings.completedTutorialCount || 0) + 1
      });
    }
    
    return progress;
  }
  
  // Tutorial settings management operations
  async createTutorialSettings(settings: InsertTutorialSettings): Promise<TutorialSettings> {
    const [newSettings] = await db.insert(tutorialSettings).values(settings).returning();
    return newSettings;
  }

  async getTutorialSettings(userId: string): Promise<TutorialSettings | undefined> {
    const [settings] = await db.select().from(tutorialSettings).where(eq(tutorialSettings.userId, userId));
    return settings || undefined;
  }

  async updateTutorialSettings(userId: string, updates: Partial<TutorialSettings>): Promise<TutorialSettings | undefined> {
    // Try to update existing settings first
    const [settings] = await db.update(tutorialSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tutorialSettings.userId, userId))
      .returning();
    
    // If no settings exist, create them
    if (!settings) {
      return await this.createTutorialSettings({
        ...updates as InsertTutorialSettings,
        userId
      });
    }
    
    return settings;
  }

  async resetTutorialSettings(userId: string): Promise<TutorialSettings | undefined> {
    // Reset to default settings
    return await this.updateTutorialSettings(userId, {
      autoStartTutorials: true,
      showTooltips: true,
      tutorialSpeed: 'normal',
      preferredPosition: 'bottom',
      disabledCategories: [],
      notificationPreferences: {
        completion_rewards: true,
        progress_reminders: true,
        new_tutorials: true
      },
      experienceLevel: 'beginner'
    });
  }

  // ============================================
  // TEMPLATE MANAGEMENT - AI Thinking Templates
  // ============================================
  
  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db.insert(templates).values({
      ...template,
      id: randomUUID()
    }).returning();
    return newTemplate;
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates).orderBy(templates.createdAt);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db.select().from(templates)
      .where(eq(templates.category, category))
      .orderBy(templates.createdAt);
  }

  async getPublicTemplates(): Promise<Template[]> {
    return await db.select().from(templates)
      .where(eq(templates.isPublic, true))
      .orderBy(templates.usageCount, templates.createdAt);
  }

  async getUserTemplates(userId: string): Promise<Template[]> {
    return await db.select().from(templates)
      .where(eq(templates.authorId, userId))
      .orderBy(templates.createdAt);
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined> {
    const [template] = await db.update(templates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return template || undefined;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await db.delete(templates).where(eq(templates.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementTemplateUsage(id: string): Promise<Template | undefined> {
    const [template] = await db.update(templates)
      .set({ usageCount: sql`${templates.usageCount} + 1` })
      .where(eq(templates.id, id))
      .returning();
    return template || undefined;
  }

  // ============================================
  // SPRINT 4 - Billing & Subscription Management
  // ============================================

  async getSubscriptionPlans(): Promise<{ id: string; name: string; priceMonthly: number; priceYearly: number; features: string[]; limits: Record<string, number> }[]> {
    // Return static subscription plans
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
          monthly_analyses: -1, // unlimited
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
          monthly_analyses: -1, // unlimited
          users_per_workspace: -1, // unlimited
          storage_gb: 500,
          api_calls_per_minute: 200
        }
      }
    ];
  }

  async createOrUpdateSubscription(subscription: InsertSubscription): Promise<Subscription> {
    // Check if subscription already exists for workspace
    const existing = await this.getSubscriptionByWorkspace(subscription.workspaceId);
    
    if (existing) {
      // Update existing subscription
      const [updated] = await db.update(subscriptions)
        .set({ ...subscription, updatedAt: new Date() })
        .where(eq(subscriptions.workspaceId, subscription.workspaceId))
        .returning();
      return updated;
    } else {
      // Create new subscription
      const [newSubscription] = await db.insert(subscriptions).values({
        ...subscription,
        id: randomUUID()
      }).returning();
      return newSubscription;
    }
  }

  async getSubscription(id: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription || undefined;
  }

  async getSubscriptionByWorkspace(workspaceId: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.workspaceId, workspaceId));
    return subscription || undefined;
  }

  async updateSubscriptionStatus(id: string, status: SubscriptionStatus): Promise<Subscription | undefined> {
    const [updated] = await db.update(subscriptions)
      .set({ status, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return updated || undefined;
  }

  async cancelSubscription(id: string): Promise<Subscription | undefined> {
    const [canceled] = await db.update(subscriptions)
      .set({ status: 'canceled', updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return canceled || undefined;
  }

  async createEntitlement(entitlement: InsertEntitlement): Promise<Entitlement> {
    const [newEntitlement] = await db.insert(entitlements).values({
      ...entitlement,
      id: randomUUID()
    }).returning();
    return newEntitlement;
  }

  async getEntitlements(workspaceId: string): Promise<Entitlement[]> {
    return await db.select().from(entitlements).where(eq(entitlements.workspaceId, workspaceId));
  }

  async revokeEntitlements(workspaceId: string, feature?: BillingFeature): Promise<boolean> {
    const conditions = [eq(entitlements.workspaceId, workspaceId)];
    
    if (feature) {
      conditions.push(eq(entitlements.feature, feature));
    }
    
    const result = await db.delete(entitlements).where(and(...conditions));
    return (result.rowCount ?? 0) > 0;
  }

  async checkEntitlement(workspaceId: string, feature: BillingFeature): Promise<boolean> {
    const [entitlement] = await db.select()
      .from(entitlements)
      .where(and(
        eq(entitlements.workspaceId, workspaceId),
        eq(entitlements.feature, feature)
      ));
    
    if (!entitlement) return false;
    
    // Check if entitlement is expired
    if (entitlement.expiresAt && entitlement.expiresAt < new Date()) {
      return false;
    }
    
    return true;
  }

  // ============================================
  // SPRINT 4 - Marketplace Operations
  // ============================================

  async getMarketplaceTemplates(): Promise<(TemplateProduct & { template: Template })[]> {
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
        updatedAt: templates.updatedAt,
      }
    })
    .from(templateProducts)
    .innerJoin(templates, eq(templateProducts.templateId, templates.id))
    .where(eq(templateProducts.isActive, true));

    return results.map(row => ({
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

  async getTemplateProduct(id: string): Promise<TemplateProduct | undefined> {
    const [product] = await db.select().from(templateProducts).where(eq(templateProducts.id, id));
    return product || undefined;
  }

  async createTemplateProduct(product: InsertTemplateProduct): Promise<TemplateProduct> {
    const [newProduct] = await db.insert(templateProducts).values({
      ...product,
      id: randomUUID()
    }).returning();
    return newProduct;
  }

  async createTemplatePurchase(purchase: InsertTemplatePurchase): Promise<TemplatePurchase> {
    // Generate unique license key
    const licenseKey = `LIC-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    
    const [newPurchase] = await db.insert(templatePurchases).values({
      ...purchase,
      id: randomUUID(),
      licenseKey
    }).returning();
    return newPurchase;
  }

  async getTemplatePurchase(id: string): Promise<TemplatePurchase | undefined> {
    const [purchase] = await db.select().from(templatePurchases).where(eq(templatePurchases.id, id));
    return purchase || undefined;
  }

  async checkExistingPurchase(workspaceId: string, templateProductId: string): Promise<TemplatePurchase | undefined> {
    const [existing] = await db.select()
      .from(templatePurchases)
      .where(and(
        eq(templatePurchases.workspaceId, workspaceId),
        eq(templatePurchases.templateProductId, templateProductId)
      ));
    return existing || undefined;
  }

  async getUserPurchases(userId: string): Promise<(TemplatePurchase & { templateProduct: TemplateProduct & { template: Template } })[]> {
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
          updatedAt: templates.updatedAt,
        }
      }
    })
    .from(templatePurchases)
    .innerJoin(templateProducts, eq(templatePurchases.templateProductId, templateProducts.id))
    .innerJoin(templates, eq(templateProducts.templateId, templates.id))
    .where(eq(templatePurchases.userId, userId));

    return results.map(row => ({
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

  async getWorkspacePurchases(workspaceId: string): Promise<(TemplatePurchase & { templateProduct: TemplateProduct & { template: Template } })[]> {
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
          updatedAt: templates.updatedAt,
        }
      }
    })
    .from(templatePurchases)
    .innerJoin(templateProducts, eq(templatePurchases.templateProductId, templateProducts.id))
    .innerJoin(templates, eq(templateProducts.templateId, templates.id))
    .where(eq(templatePurchases.workspaceId, workspaceId));

    return results.map(row => ({
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
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async getReviews(organizationId?: string, workspaceId?: string): Promise<Review[]> {
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

  async getReviewsByResource(resourceType: string, resourceId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(and(eq(reviews.resourceType, resourceType), eq(reviews.resourceId, resourceId)))
      .orderBy(reviews.createdAt);
  }

  async getReviewsByInitiator(initiatorId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.initiatorId, initiatorId))
      .orderBy(reviews.createdAt);
  }

  async getReviewsByStatus(status: string, organizationId?: string): Promise<Review[]> {
    let query = db.select().from(reviews).where(eq(reviews.status, status));
    
    if (organizationId) {
      query = query.where(and(eq(reviews.status, status), eq(reviews.organizationId, organizationId)));
    }
    
    return await query.orderBy(reviews.createdAt);
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined> {
    const [review] = await db.update(reviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return review || undefined;
  }

  async deleteReview(id: string): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return (result.rowCount || 0) > 0;
  }

  async approveReview(id: string, userId: string): Promise<Review | undefined> {
    const [review] = await db.update(reviews)
      .set({ 
        status: 'approved', 
        approvedAt: new Date(), 
        completedBy: userId, 
        completedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(reviews.id, id))
      .returning();
    return review || undefined;
  }

  async rejectReview(id: string, userId: string, reason?: string): Promise<Review | undefined> {
    const [review] = await db.update(reviews)
      .set({ 
        status: 'rejected', 
        rejectedAt: new Date(), 
        completedBy: userId, 
        completedAt: new Date(),
        metadata: sql`jsonb_set(metadata, '{rejection_reason}', '"${reason || 'No reason provided'}"')`,
        updatedAt: new Date() 
      })
      .where(eq(reviews.id, id))
      .returning();
    return review || undefined;
  }

  // Review step operations  
  async createReviewStep(step: InsertReviewStep): Promise<ReviewStep> {
    const [newStep] = await db.insert(reviewSteps).values(step).returning();
    return newStep;
  }

  async getReviewStep(id: string): Promise<ReviewStep | undefined> {
    const [step] = await db.select().from(reviewSteps).where(eq(reviewSteps.id, id));
    return step || undefined;
  }

  async getReviewSteps(reviewId: string): Promise<ReviewStep[]> {
    return await db.select().from(reviewSteps)
      .where(eq(reviewSteps.reviewId, reviewId))
      .orderBy(reviewSteps.stepNumber);
  }

  async updateReviewStep(id: string, updates: Partial<ReviewStep>): Promise<ReviewStep | undefined> {
    const [step] = await db.update(reviewSteps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviewSteps.id, id))
      .returning();
    return step || undefined;
  }

  async deleteReviewStep(id: string): Promise<boolean> {
    const result = await db.delete(reviewSteps).where(eq(reviewSteps.id, id));
    return (result.rowCount || 0) > 0;
  }

  async completeReviewStep(id: string, userId: string): Promise<ReviewStep | undefined> {
    const [step] = await db.update(reviewSteps)
      .set({ 
        status: 'completed', 
        completedAt: new Date(), 
        completedBy: userId,
        updatedAt: new Date() 
      })
      .where(eq(reviewSteps.id, id))
      .returning();
    return step || undefined;
  }

  async skipReviewStep(id: string, userId: string, reason: string): Promise<ReviewStep | undefined> {
    const [step] = await db.update(reviewSteps)
      .set({ 
        status: 'skipped', 
        completedAt: new Date(), 
        completedBy: userId,
        metadata: sql`jsonb_set(metadata, '{skip_reason}', '"${reason}"')`,
        updatedAt: new Date() 
      })
      .where(eq(reviewSteps.id, id))
      .returning();
    return step || undefined;
  }

  // Review assignment operations - stub implementations
  async createReviewAssignment(assignment: InsertReviewAssignment): Promise<ReviewAssignment> {
    throw new Error('ReviewAssignment table not created yet - stub implementation');
  }

  async getReviewAssignment(id: string): Promise<ReviewAssignment | undefined> {
    throw new Error('ReviewAssignment table not created yet - stub implementation');
  }

  async getReviewAssignments(reviewId: string): Promise<ReviewAssignment[]> {
    throw new Error('ReviewAssignment table not created yet - stub implementation');
  }

  async getAssignmentsByAssignee(assigneeId: string): Promise<ReviewAssignment[]> {
    throw new Error('ReviewAssignment table not created yet - stub implementation');
  }

  async updateReviewAssignment(id: string, updates: Partial<ReviewAssignment>): Promise<ReviewAssignment | undefined> {
    throw new Error('ReviewAssignment table not created yet - stub implementation');
  }

  async deleteReviewAssignment(id: string): Promise<boolean> {
    throw new Error('ReviewAssignment table not created yet - stub implementation');
  }

  async respondToAssignment(id: string, response: string, reason?: string): Promise<ReviewAssignment | undefined> {
    throw new Error('ReviewAssignment table not created yet - stub implementation');
  }

  async delegateAssignment(id: string, delegatedTo: string): Promise<ReviewAssignment | undefined> {
    throw new Error('ReviewAssignment table not created yet - stub implementation');
  }

  // Review comment operations - stub implementations  
  async createReviewComment(comment: InsertReviewComment): Promise<ReviewComment> {
    throw new Error('ReviewComment table not created yet - stub implementation');
  }

  async getReviewComment(id: string): Promise<ReviewComment | undefined> {
    throw new Error('ReviewComment table not created yet - stub implementation');
  }

  async getReviewComments(reviewId: string): Promise<ReviewComment[]> {
    throw new Error('ReviewComment table not created yet - stub implementation');
  }

  async getCommentsByStep(stepId: string): Promise<ReviewComment[]> {
    throw new Error('ReviewComment table not created yet - stub implementation');
  }

  async getCommentsByAssignment(assignmentId: string): Promise<ReviewComment[]> {
    throw new Error('ReviewComment table not created yet - stub implementation');
  }

  async updateReviewComment(id: string, updates: Partial<ReviewComment>): Promise<ReviewComment | undefined> {
    throw new Error('ReviewComment table not created yet - stub implementation');
  }

  async deleteReviewComment(id: string): Promise<boolean> {
    throw new Error('ReviewComment table not created yet - stub implementation');
  }

  async resolveComment(id: string, userId: string): Promise<ReviewComment | undefined> {
    throw new Error('ReviewComment table not created yet - stub implementation');
  }

  // ============================================
  // SPRINT 5 - RETENTION/LEGAL HOLD SYSTEM
  // ============================================

  // Retention policy operations
  async createRetentionPolicy(policy: InsertRetentionPolicy): Promise<RetentionPolicy> {
    const [newPolicy] = await db.insert(retentionPolicies).values(policy).returning();
    return newPolicy;
  }

  async getRetentionPolicy(id: string): Promise<RetentionPolicy | undefined> {
    const [policy] = await db.select().from(retentionPolicies).where(eq(retentionPolicies.id, id));
    return policy || undefined;
  }

  async getRetentionPolicies(organizationId: string): Promise<RetentionPolicy[]> {
    return await db.select().from(retentionPolicies)
      .where(eq(retentionPolicies.organizationId, organizationId))
      .orderBy(retentionPolicies.priority, retentionPolicies.createdAt);
  }

  async getRetentionPoliciesByDataType(dataType: string, organizationId: string): Promise<RetentionPolicy[]> {
    return await db.select().from(retentionPolicies)
      .where(and(eq(retentionPolicies.dataType, dataType), eq(retentionPolicies.organizationId, organizationId)))
      .orderBy(retentionPolicies.priority);
  }

  async getActiveRetentionPolicies(organizationId: string): Promise<RetentionPolicy[]> {
    return await db.select().from(retentionPolicies)
      .where(and(eq(retentionPolicies.organizationId, organizationId), eq(retentionPolicies.isActive, true)))
      .orderBy(retentionPolicies.priority);
  }

  async updateRetentionPolicy(id: string, updates: Partial<RetentionPolicy>): Promise<RetentionPolicy | undefined> {
    const [policy] = await db.update(retentionPolicies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(retentionPolicies.id, id))
      .returning();
    return policy || undefined;
  }

  async deleteRetentionPolicy(id: string): Promise<boolean> {
    const result = await db.delete(retentionPolicies).where(eq(retentionPolicies.id, id));
    return (result.rowCount || 0) > 0;
  }

  async activateRetentionPolicy(id: string): Promise<RetentionPolicy | undefined> {
    const [policy] = await db.update(retentionPolicies)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(retentionPolicies.id, id))
      .returning();
    return policy || undefined;
  }

  async deactivateRetentionPolicy(id: string): Promise<RetentionPolicy | undefined> {
    const [policy] = await db.update(retentionPolicies)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(retentionPolicies.id, id))
      .returning();
    return policy || undefined;
  }

  // Legal hold operations
  async createLegalHold(hold: InsertLegalHold): Promise<LegalHold> {
    const [newHold] = await db.insert(legalHolds).values(hold).returning();
    return newHold;
  }

  async getLegalHold(id: string): Promise<LegalHold | undefined> {
    const [hold] = await db.select().from(legalHolds).where(eq(legalHolds.id, id));
    return hold || undefined;
  }

  async getLegalHolds(organizationId: string): Promise<LegalHold[]> {
    return await db.select().from(legalHolds)
      .where(eq(legalHolds.organizationId, organizationId))
      .orderBy(legalHolds.createdAt);
  }

  async getActiveLegalHolds(organizationId: string): Promise<LegalHold[]> {
    return await db.select().from(legalHolds)
      .where(and(eq(legalHolds.organizationId, organizationId), eq(legalHolds.status, 'active')))
      .orderBy(legalHolds.createdAt);
  }

  async getLegalHoldsByCustodian(custodianId: string): Promise<LegalHold[]> {
    return await db.select().from(legalHolds)
      .where(sql`custodians @> '[${custodianId}]'`)
      .orderBy(legalHolds.createdAt);
  }

  async getLegalHoldsByDateRange(startDate: Date, endDate: Date, organizationId: string): Promise<LegalHold[]> {
    return await db.select().from(legalHolds)
      .where(and(
        eq(legalHolds.organizationId, organizationId),
        sql`date_range_start <= ${endDate}`,
        sql`date_range_end >= ${startDate}`
      ))
      .orderBy(legalHolds.createdAt);
  }

  async updateLegalHold(id: string, updates: Partial<LegalHold>): Promise<LegalHold | undefined> {
    const [hold] = await db.update(legalHolds)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(legalHolds.id, id))
      .returning();
    return hold || undefined;
  }

  async deleteLegalHold(id: string): Promise<boolean> {
    const result = await db.delete(legalHolds).where(eq(legalHolds.id, id));
    return (result.rowCount || 0) > 0;
  }

  async releaseLegalHold(id: string, userId: string, reason: string): Promise<LegalHold | undefined> {
    const [hold] = await db.update(legalHolds)
      .set({ 
        status: 'released', 
        releasedBy: userId, 
        releasedAt: new Date(),
        metadata: sql`jsonb_set(metadata, '{release_reason}', '"${reason}"')`,
        updatedAt: new Date() 
      })
      .where(eq(legalHolds.id, id))
      .returning();
    return hold || undefined;
  }

  // Retention job operations - stub implementations (tables not created yet)
  async createRetentionJob(job: InsertRetentionJob): Promise<RetentionJob> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async getRetentionJob(id: string): Promise<RetentionJob | undefined> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async getRetentionJobs(organizationId: string): Promise<RetentionJob[]> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async getRetentionJobsByPolicy(policyId: string): Promise<RetentionJob[]> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async getRetentionJobsByStatus(status: string, organizationId: string): Promise<RetentionJob[]> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async getScheduledRetentionJobs(organizationId: string): Promise<RetentionJob[]> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async updateRetentionJob(id: string, updates: Partial<RetentionJob>): Promise<RetentionJob | undefined> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async deleteRetentionJob(id: string): Promise<boolean> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async startRetentionJob(id: string): Promise<RetentionJob | undefined> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async completeRetentionJob(id: string, results: any): Promise<RetentionJob | undefined> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  async failRetentionJob(id: string, error: string): Promise<RetentionJob | undefined> {
    throw new Error('RetentionJob table not created yet - stub implementation');
  }

  // Data classification operations - stub implementations (tables not created yet)
  async createDataClassification(classification: InsertDataClassification): Promise<DataClassification> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async getDataClassification(id: string): Promise<DataClassification | undefined> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async getDataClassifications(organizationId: string): Promise<DataClassification[]> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async getDataClassificationByResource(resourceType: string, resourceId: string): Promise<DataClassification | undefined> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async getDataClassificationsByClassification(classification: string, organizationId: string): Promise<DataClassification[]> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async getDataClassificationsBySensitivity(sensitivity: string, organizationId: string): Promise<DataClassification[]> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async getDataClassificationsRequiringReview(organizationId: string): Promise<DataClassification[]> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async updateDataClassification(id: string, updates: Partial<DataClassification>): Promise<DataClassification | undefined> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async deleteDataClassification(id: string): Promise<boolean> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  async reviewDataClassification(id: string, userId: string): Promise<DataClassification | undefined> {
    throw new Error('DataClassification table not created yet - stub implementation');
  }

  // ============================================
  // SPRINT 5 - SCIM USER PROVISIONING SYSTEM
  // ============================================

  // SCIM user operations
  async createScimUser(user: InsertScimUser): Promise<ScimUser> {
    const [newUser] = await db.insert(scimUsers).values(user).returning();
    return newUser;
  }

  async getScimUser(id: string): Promise<ScimUser | undefined> {
    const [user] = await db.select().from(scimUsers).where(eq(scimUsers.id, id));
    return user || undefined;
  }

  async getScimUserByExternalId(externalId: string, organizationId: string): Promise<ScimUser | undefined> {
    const [user] = await db.select().from(scimUsers)
      .where(and(eq(scimUsers.externalId, externalId), eq(scimUsers.organizationId, organizationId)));
    return user || undefined;
  }

  async getScimUserByScimId(scimId: string): Promise<ScimUser | undefined> {
    const [user] = await db.select().from(scimUsers).where(eq(scimUsers.scimId, scimId));
    return user || undefined;
  }

  async getScimUserByEmail(email: string, organizationId: string): Promise<ScimUser | undefined> {
    const [user] = await db.select().from(scimUsers)
      .where(and(eq(scimUsers.email, email), eq(scimUsers.organizationId, organizationId)));
    return user || undefined;
  }

  async getScimUsers(organizationId: string): Promise<ScimUser[]> {
    return await db.select().from(scimUsers)
      .where(eq(scimUsers.organizationId, organizationId))
      .orderBy(scimUsers.createdAt);
  }

  async getActiveScimUsers(organizationId: string): Promise<ScimUser[]> {
    return await db.select().from(scimUsers)
      .where(and(eq(scimUsers.organizationId, organizationId), eq(scimUsers.active, true)))
      .orderBy(scimUsers.createdAt);
  }

  async getScimUsersBySyncStatus(syncStatus: string, organizationId: string): Promise<ScimUser[]> {
    return await db.select().from(scimUsers)
      .where(and(eq(scimUsers.syncStatus, syncStatus), eq(scimUsers.organizationId, organizationId)))
      .orderBy(scimUsers.lastSyncAt);
  }

  async updateScimUser(id: string, updates: Partial<ScimUser>): Promise<ScimUser | undefined> {
    const [user] = await db.update(scimUsers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(scimUsers.id, id))
      .returning();
    return user || undefined;
  }

  async deleteScimUser(id: string): Promise<boolean> {
    const result = await db.delete(scimUsers).where(eq(scimUsers.id, id));
    return (result.rowCount || 0) > 0;
  }

  async linkScimUserToLocal(scimUserId: string, localUserId: string): Promise<ScimUser | undefined> {
    const [user] = await db.update(scimUsers)
      .set({ localUserId, updatedAt: new Date() })
      .where(eq(scimUsers.id, scimUserId))
      .returning();
    return user || undefined;
  }

  async syncScimUser(id: string, syncData: any): Promise<ScimUser | undefined> {
    const [user] = await db.update(scimUsers)
      .set({ 
        lastSyncAt: new Date(), 
        syncStatus: 'active',
        syncError: null,
        metadata: syncData,
        updatedAt: new Date() 
      })
      .where(eq(scimUsers.id, id))
      .returning();
    return user || undefined;
  }

  async deprovisionScimUser(id: string): Promise<ScimUser | undefined> {
    const [user] = await db.update(scimUsers)
      .set({ 
        active: false, 
        syncStatus: 'deprovisioned',
        deprovisionedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(scimUsers.id, id))
      .returning();
    return user || undefined;
  }

  // SCIM group operations
  async createScimGroup(group: InsertScimGroup): Promise<ScimGroup> {
    const [newGroup] = await db.insert(scimGroups).values(group).returning();
    return newGroup;
  }

  async getScimGroup(id: string): Promise<ScimGroup | undefined> {
    const [group] = await db.select().from(scimGroups).where(eq(scimGroups.id, id));
    return group || undefined;
  }

  async getScimGroupByExternalId(externalId: string, organizationId: string): Promise<ScimGroup | undefined> {
    const [group] = await db.select().from(scimGroups)
      .where(and(eq(scimGroups.externalId, externalId), eq(scimGroups.organizationId, organizationId)));
    return group || undefined;
  }

  async getScimGroupByScimId(scimId: string): Promise<ScimGroup | undefined> {
    const [group] = await db.select().from(scimGroups).where(eq(scimGroups.scimId, scimId));
    return group || undefined;
  }

  async getScimGroups(organizationId: string): Promise<ScimGroup[]> {
    return await db.select().from(scimGroups)
      .where(eq(scimGroups.organizationId, organizationId))
      .orderBy(scimGroups.createdAt);
  }

  async getScimGroupsByType(groupType: string, organizationId: string): Promise<ScimGroup[]> {
    return await db.select().from(scimGroups)
      .where(and(eq(scimGroups.groupType, groupType), eq(scimGroups.organizationId, organizationId)))
      .orderBy(scimGroups.createdAt);
  }

  async getScimGroupsBySyncStatus(syncStatus: string, organizationId: string): Promise<ScimGroup[]> {
    return await db.select().from(scimGroups)
      .where(and(eq(scimGroups.syncStatus, syncStatus), eq(scimGroups.organizationId, organizationId)))
      .orderBy(scimGroups.lastSyncAt);
  }

  async updateScimGroup(id: string, updates: Partial<ScimGroup>): Promise<ScimGroup | undefined> {
    const [group] = await db.update(scimGroups)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(scimGroups.id, id))
      .returning();
    return group || undefined;
  }

  async deleteScimGroup(id: string): Promise<boolean> {
    const result = await db.delete(scimGroups).where(eq(scimGroups.id, id));
    return (result.rowCount || 0) > 0;
  }

  async syncScimGroup(id: string, syncData: any): Promise<ScimGroup | undefined> {
    const [group] = await db.update(scimGroups)
      .set({ 
        lastSyncAt: new Date(), 
        syncStatus: 'active',
        syncError: null,
        metadata: syncData,
        updatedAt: new Date() 
      })
      .where(eq(scimGroups.id, id))
      .returning();
    return group || undefined;
  }

  async deprovisionScimGroup(id: string): Promise<ScimGroup | undefined> {
    const [group] = await db.update(scimGroups)
      .set({ 
        syncStatus: 'deprovisioned',
        deprovisionedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(scimGroups.id, id))
      .returning();
    return group || undefined;
  }

  // SCIM group membership operations - stub implementations (table not created yet)
  async createScimGroupMembership(membership: InsertScimGroupMembership): Promise<ScimGroupMembership> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async getScimGroupMembership(id: string): Promise<ScimGroupMembership | undefined> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async getScimGroupMemberships(groupId: string): Promise<ScimGroupMembership[]> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async getScimUserMemberships(userId: string): Promise<ScimGroupMembership[]> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async getScimGroupMembershipByIds(groupId: string, userId: string): Promise<ScimGroupMembership | undefined> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async getScimGroupMembershipsBySyncStatus(syncStatus: string): Promise<ScimGroupMembership[]> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async updateScimGroupMembership(id: string, updates: Partial<ScimGroupMembership>): Promise<ScimGroupMembership | undefined> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async deleteScimGroupMembership(id: string): Promise<boolean> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async addUserToScimGroup(groupId: string, userId: string, membershipType?: string): Promise<ScimGroupMembership> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  async removeUserFromScimGroup(groupId: string, userId: string): Promise<boolean> {
    throw new Error('ScimGroupMembership table not created yet - stub implementation');
  }

  // Provisioning log operations - stub implementations (table not created yet)
  async createProvisioningLog(log: InsertProvisioningLog): Promise<ProvisioningLog> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async getProvisioningLog(id: string): Promise<ProvisioningLog | undefined> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async getProvisioningLogs(organizationId: string): Promise<ProvisioningLog[]> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async getProvisioningLogsByOperation(operation: string, organizationId: string): Promise<ProvisioningLog[]> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async getProvisioningLogsByResourceType(resourceType: string, organizationId: string): Promise<ProvisioningLog[]> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async getProvisioningLogsByStatus(status: string, organizationId: string): Promise<ProvisioningLog[]> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async getProvisioningLogsByRequestId(requestId: string): Promise<ProvisioningLog[]> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async getProvisioningLogsByBatch(batchId: string): Promise<ProvisioningLog[]> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async getProvisioningLogsByDateRange(startDate: Date, endDate: Date, organizationId: string): Promise<ProvisioningLog[]> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async updateProvisioningLog(id: string, updates: Partial<ProvisioningLog>): Promise<ProvisioningLog | undefined> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  async deleteProvisioningLog(id: string): Promise<boolean> {
    throw new Error('ProvisioningLog table not created yet - stub implementation');
  }

  // ============================================
  // SPRINT 6 - TEMPLATE BUILDER CRUD + PUBLISH SYSTEM
  // ============================================
  
  async publishTemplate(id: string, publishedBy: string, comments?: string): Promise<Template | undefined> {
    const [template] = await db.update(templates)
      .set({ 
        status: 'published',
        publishedBy,
        publishedAt: new Date(),
        metadata: {
          publishComments: comments,
          publishHistory: []
        },
        updatedAt: new Date()
      })
      .where(eq(templates.id, id))
      .returning();
    return template || undefined;
  }

  async unpublishTemplate(id: string, unpublishedBy: string, reason?: string): Promise<Template | undefined> {
    const [template] = await db.update(templates)
      .set({
        status: 'draft',
        publishedBy: null,
        publishedAt: null,
        metadata: {
          unpublishReason: reason,
          unpublishedBy,
          unpublishedAt: new Date().toISOString()
        },
        updatedAt: new Date()
      })
      .where(eq(templates.id, id))
      .returning();
    return template || undefined;
  }

  async getTemplatesByStatus(status: string, organizationId?: string): Promise<Template[]> {
    let query = db.select().from(templates).where(eq(templates.status, status));
    
    if (organizationId) {
      query = query.where(eq(templates.organizationId, organizationId));
    }
    
    return await query.orderBy(templates.createdAt);
  }

  async getTemplateVersions(templateId: string): Promise<Template[]> {
    return await db.select().from(templates)
      .where(eq(templates.parentTemplateId, templateId))
      .orderBy(templates.version);
  }

  async createTemplateVersion(templateId: string, updates: Partial<Template>, createdBy: string): Promise<Template> {
    // Get the original template
    const [originalTemplate] = await db.select().from(templates).where(eq(templates.id, templateId));
    if (!originalTemplate) {
      throw new Error('Template not found');
    }

    // Create new version
    const [newVersion] = await db.insert(templates).values({
      ...originalTemplate,
      ...updates,
      id: randomUUID(),
      parentTemplateId: templateId,
      version: (originalTemplate.version || 1) + 1,
      authorId: createdBy,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return newVersion;
  }
  
  // ============================================
  // SPRINT 6 - WORKFLOW AUTOMATION V1
  // ============================================
  
  async createWorkflowDefinition(workflow: InsertWorkflowDefinition): Promise<WorkflowDefinition> {
    const [newWorkflow] = await db.insert(workflowDefinitions).values({
      ...workflow,
      id: randomUUID()
    }).returning();
    return newWorkflow;
  }

  async getWorkflowDefinition(id: string): Promise<WorkflowDefinition | undefined> {
    const [workflow] = await db.select().from(workflowDefinitions).where(eq(workflowDefinitions.id, id));
    return workflow || undefined;
  }

  async updateWorkflowDefinition(id: string, updates: Partial<WorkflowDefinition>): Promise<WorkflowDefinition | undefined> {
    const [workflow] = await db.update(workflowDefinitions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workflowDefinitions.id, id))
      .returning();
    return workflow || undefined;
  }

  async deleteWorkflowDefinition(id: string): Promise<boolean> {
    const result = await db.delete(workflowDefinitions).where(eq(workflowDefinitions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getOrganizationWorkflowDefinitions(organizationId: string): Promise<WorkflowDefinition[]> {
    return await db.select().from(workflowDefinitions)
      .where(eq(workflowDefinitions.organizationId, organizationId))
      .orderBy(workflowDefinitions.createdAt);
  }
  
  async createWorkflowExecution(execution: InsertWorkflowExecution): Promise<WorkflowExecution> {
    const [newExecution] = await db.insert(workflowExecutions).values({
      ...execution,
      id: randomUUID()
    }).returning();
    return newExecution;
  }

  async getWorkflowExecution(id: string): Promise<WorkflowExecution | undefined> {
    const [execution] = await db.select().from(workflowExecutions).where(eq(workflowExecutions.id, id));
    return execution || undefined;
  }

  async updateWorkflowExecution(id: string, updates: Partial<WorkflowExecution>): Promise<WorkflowExecution | undefined> {
    const [execution] = await db.update(workflowExecutions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workflowExecutions.id, id))
      .returning();
    return execution || undefined;
  }

  async getWorkflowExecutions(workflowDefinitionId?: string, organizationId?: string, limit?: number): Promise<WorkflowExecution[]> {
    let query = db.select().from(workflowExecutions);
    
    const conditions = [];
    if (workflowDefinitionId) {
      conditions.push(eq(workflowExecutions.workflowDefinitionId, workflowDefinitionId));
    }
    if (organizationId) {
      conditions.push(eq(workflowExecutions.organizationId, organizationId));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query.orderBy(workflowExecutions.startedAt);
  }
  
  async createWorkflowEvent(event: InsertWorkflowEvent): Promise<WorkflowEvent> {
    const [newEvent] = await db.insert(workflowEvents).values({
      ...event,
      id: randomUUID()
    }).returning();
    return newEvent;
  }

  async getWorkflowEvent(id: string): Promise<WorkflowEvent | undefined> {
    const [event] = await db.select().from(workflowEvents).where(eq(workflowEvents.id, id));
    return event || undefined;
  }

  async updateWorkflowEvent(id: string, updates: Partial<WorkflowEvent>): Promise<WorkflowEvent | undefined> {
    const [event] = await db.update(workflowEvents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workflowEvents.id, id))
      .returning();
    return event || undefined;
  }

  async getPendingWorkflowEvents(limit?: number): Promise<WorkflowEvent[]> {
    let query = db.select().from(workflowEvents)
      .where(eq(workflowEvents.status, 'pending'));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query.orderBy(workflowEvents.createdAt);
  }

  async getOrganizationWorkflowEvents(organizationId: string): Promise<WorkflowEvent[]> {
    return await db.select().from(workflowEvents)
      .where(eq(workflowEvents.organizationId, organizationId))
      .orderBy(workflowEvents.createdAt);
  }
  
  // ============================================
  // SPRINT 6 - ORGANIZATION INSIGHTS SYSTEM
  // ============================================
  
  async createOrganizationAnalytics(analytics: InsertOrganizationAnalytics): Promise<OrganizationAnalytics> {
    const [newAnalytics] = await db.insert(organizationAnalytics).values({
      ...analytics,
      id: randomUUID()
    }).returning();
    return newAnalytics;
  }

  async getOrganizationAnalytics(organizationId: string, date?: Date): Promise<OrganizationAnalytics | undefined> {
    let query = db.select().from(organizationAnalytics)
      .where(eq(organizationAnalytics.organizationId, organizationId));
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query = query.where(
        and(
          eq(organizationAnalytics.organizationId, organizationId),
          sql`${organizationAnalytics.date} >= ${startOfDay}`,
          sql`${organizationAnalytics.date} <= ${endOfDay}`
        )
      );
    }
    
    const [analytics] = await query.orderBy(organizationAnalytics.date);
    return analytics || undefined;
  }

  async getOrganizationAnalyticsRange(organizationId: string, startDate: Date, endDate: Date): Promise<OrganizationAnalytics[]> {
    return await db.select().from(organizationAnalytics)
      .where(
        and(
          eq(organizationAnalytics.organizationId, organizationId),
          sql`${organizationAnalytics.date} >= ${startDate}`,
          sql`${organizationAnalytics.date} <= ${endDate}`
        )
      )
      .orderBy(organizationAnalytics.date);
  }

  async updateOrganizationAnalytics(id: string, updates: Partial<OrganizationAnalytics>): Promise<OrganizationAnalytics | undefined> {
    const [analytics] = await db.update(organizationAnalytics)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizationAnalytics.id, id))
      .returning();
    return analytics || undefined;
  }
  
  async createOrganizationDailyReport(report: InsertOrganizationDailyReport): Promise<OrganizationDailyReport> {
    const [newReport] = await db.insert(organizationDailyReports).values({
      ...report,
      id: randomUUID()
    }).returning();
    return newReport;
  }

  async getOrganizationDailyReport(organizationId: string, reportDate: Date, reportType?: string): Promise<OrganizationDailyReport | undefined> {
    let query = db.select().from(organizationDailyReports)
      .where(
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
    return report || undefined;
  }

  async getOrganizationDailyReports(organizationId: string, limit?: number): Promise<OrganizationDailyReport[]> {
    let query = db.select().from(organizationDailyReports)
      .where(eq(organizationDailyReports.organizationId, organizationId));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query.orderBy(organizationDailyReports.reportDate);
  }
  
  async recordEnhancedUsageMetric(metric: InsertEnhancedUsageMetric): Promise<EnhancedUsageMetric> {
    // CRITICAL FIX: Ensure clean JSONB field handling
    const processedMetric = {
      ...metric,
      id: randomUUID(),
      // For JSONB fields, pass clean JavaScript types - no pre-serialization needed
      tags: Array.isArray(metric.tags) ? metric.tags : (metric.tags ? [metric.tags] : []),
      dimensions: typeof metric.dimensions === 'object' && metric.dimensions !== null ? metric.dimensions : {},
      metadata: typeof metric.metadata === 'object' && metric.metadata !== null ? metric.metadata : {}
    };
    
    try {
      // Clean insert - remove debugging that might interfere with array handling
      const [newMetric] = await db.insert(enhancedUsageMetrics).values(processedMetric).returning();
      console.log('✅ Successfully recorded enhanced usage metric:', newMetric.id);
      return newMetric;
    } catch (error: any) {
      console.error('❌ Database error in recordEnhancedUsageMetric:', error.message);
      console.error('Failed metric data structure:', {
        tagsType: typeof processedMetric.tags,
        tagsIsArray: Array.isArray(processedMetric.tags),
        tagsValue: processedMetric.tags,
        dimensionsType: typeof processedMetric.dimensions
      });
      
      // For debugging: try a minimal insert to isolate the issue
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
        console.log('🔧 Testing minimal insert without JSONB fields...');
        const [minimalResult] = await db.insert(enhancedUsageMetrics).values(minimalMetric).returning();
        console.log('✅ Minimal insert successful - issue is with JSONB field handling');
        return minimalResult;
      } catch (minimalError: any) {
        console.error('❌ Even minimal insert failed:', minimalError.message);
        throw error; // Re-throw original error
      }
    }
  }

  async getEnhancedUsageMetrics(organizationId: string, resourceType?: string, startDate?: Date, endDate?: Date): Promise<EnhancedUsageMetric[]> {
    let query = db.select().from(enhancedUsageMetrics)
      .where(eq(enhancedUsageMetrics.organizationId, organizationId));
    
    const conditions = [eq(enhancedUsageMetrics.organizationId, organizationId)];
    
    if (resourceType) {
      conditions.push(eq(enhancedUsageMetrics.resourceType, resourceType));
    }
    if (startDate) {
      conditions.push(sql`${enhancedUsageMetrics.timestamp} >= ${startDate}`);
    }
    if (endDate) {
      conditions.push(sql`${enhancedUsageMetrics.timestamp} <= ${endDate}`);
    }
    
    if (conditions.length > 1) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(enhancedUsageMetrics.timestamp);
  }
  
  async getOrganizationInsightsSummary(organizationId: string): Promise<any> {
    // Mock implementation for demonstration
    return {
      organizationId,
      summary: 'Mock insights summary for organization',
      generatedAt: new Date().toISOString()
    };
  }

  async generateDailyInsightsReport(organizationId: string, date: Date): Promise<OrganizationDailyReport> {
    // Get analytics for the date
    const analytics = await this.getOrganizationAnalytics(organizationId, date);
    
    // Create a daily report based on analytics
    return await this.createOrganizationDailyReport({
      organizationId,
      reportDate: date,
      reportType: 'daily_summary',
      title: `Daily Summary - ${date.toDateString()}`,
      summary: 'Auto-generated daily insights report',
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
      generatedBy: 'system'
    });
  }
  
  // Sprint 10 - Trial management implementation
  private trials: Map<string, { active: boolean; startDate: Date; endDate: Date; daysRemaining: number }> = new Map();
  
  async startTrial(orgId: string, daysAllowed: number = 14): Promise<{ active: boolean; startDate: Date; endDate: Date; daysRemaining: number }> {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (daysAllowed * 24 * 60 * 60 * 1000));
    const trialData = {
      active: true,
      startDate,
      endDate, 
      daysRemaining: daysAllowed
    };
    
    this.trials.set(orgId, trialData);
    console.log(`✅ Trial started for org ${orgId}: ${daysAllowed} days`);
    return trialData;
  }
  
  async getTrialStatus(orgId: string): Promise<{ active: boolean; startDate: Date | null; endDate: Date | null; daysRemaining: number }> {
    const trial = this.trials.get(orgId);
    if (!trial) {
      return { active: false, startDate: null, endDate: null, daysRemaining: 0 };
    }
    
    const now = new Date();
    const isExpired = now > trial.endDate;
    const daysRemaining = isExpired ? 0 : Math.max(0, Math.ceil((trial.endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
    
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
  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    try {
      const [invoice] = await db.insert(invoices).values({
        ...invoiceData,
        id: randomUUID(),
        createdAt: new Date()
      }).returning();
      return invoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    try {
      const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
      return invoice;
    } catch (error) {
      console.error('Failed to get invoice:', error);
      return undefined;
    }
  }

  async getInvoicesByOrg(orgId: string): Promise<Invoice[]> {
    try {
      return await db.select().from(invoices)
        .where(eq(invoices.orgId, orgId))
        .orderBy(invoices.createdAt);
    } catch (error) {
      console.error('Failed to get invoices by org:', error);
      return [];
    }
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | undefined> {
    try {
      const [invoice] = await db.update(invoices)
        .set(updates)
        .where(eq(invoices.id, id))
        .returning();
      return invoice;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      return undefined;
    }
  }

  // Dunning event operations
  async createDunningEvent(eventData: InsertDunningEvent): Promise<DunningEvent> {
    try {
      const [dunningEvent] = await db.insert(dunningEvents).values({
        ...eventData,
        id: randomUUID(),
        createdAt: new Date()
      }).returning();
      return dunningEvent;
    } catch (error) {
      console.error('Failed to create dunning event:', error);
      throw error;
    }
  }

  async getDunningEvent(id: string): Promise<DunningEvent | undefined> {
    try {
      const [event] = await db.select().from(dunningEvents).where(eq(dunningEvents.id, id));
      return event;
    } catch (error) {
      console.error('Failed to get dunning event:', error);
      return undefined;
    }
  }

  async getDunningEventsByInvoice(invoiceId: string): Promise<DunningEvent[]> {
    try {
      return await db.select().from(dunningEvents)
        .where(eq(dunningEvents.invoiceId, invoiceId))
        .orderBy(dunningEvents.createdAt);
    } catch (error) {
      console.error('Failed to get dunning events by invoice:', error);
      return [];
    }
  }

  async getDunningEventsByOrg(orgId: string): Promise<DunningEvent[]> {
    try {
      return await db.select().from(dunningEvents)
        .where(eq(dunningEvents.orgId, orgId))
        .orderBy(dunningEvents.createdAt);
    } catch (error) {
      console.error('Failed to get dunning events by org:', error);
      return [];
    }
  }

  // Seats management operations
  async createSeats(seatsData: InsertSeat): Promise<Seat> {
    try {
      const [seat] = await db.insert(seats).values({
        ...seatsData,
        updatedAt: new Date()
      }).returning();
      return seat;
    } catch (error) {
      console.error('Failed to create seats:', error);
      throw error;
    }
  }

  async getSeats(orgId: string): Promise<Seat | undefined> {
    try {
      const [seat] = await db.select().from(seats).where(eq(seats.orgId, orgId));
      return seat;
    } catch (error) {
      console.error('Failed to get seats:', error);
      return undefined;
    }
  }

  async updateSeats(orgId: string, seatCount: number): Promise<Seat | undefined> {
    try {
      const [seat] = await db.update(seats)
        .set({ seats: seatCount, updatedAt: new Date() })
        .where(eq(seats.orgId, orgId))
        .returning();
      return seat;
    } catch (error) {
      console.error('Failed to update seats:', error);
      return undefined;
    }
  }

  // ============================================
  // STRIPE INTEGRATION OPERATIONS
  // ============================================

  // Stripe customer operations
  async getStripeCustomerByUserId(userId: string): Promise<{ stripeCustomerId: string } | undefined> {
    try {
      const [user] = await db.select({
        stripeCustomerId: users.stripeCustomerId
      }).from(users).where(eq(users.id, userId));
      
      return user?.stripeCustomerId ? { stripeCustomerId: user.stripeCustomerId } : undefined;
    } catch (error) {
      console.error('Failed to get Stripe customer by user ID:', error);
      return undefined;
    }
  }

  async updateUserStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void> {
    try {
      await db.update(users)
        .set({ stripeCustomerId, updatedAt: new Date() })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Failed to update user Stripe customer ID:', error);
      throw error;
    }
  }

  // Subscription operations for Stripe
  async createSubscription(subscriptionData: Omit<InsertSubscription, 'id'>): Promise<Subscription> {
    try {
      const [subscription] = await db.insert(subscriptions).values({
        ...subscriptionData,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return subscription;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db.select().from(subscriptions)
        .where(eq(subscriptions.id, subscriptionId));
      return subscription;
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return undefined;
    }
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db.select().from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
      return subscription;
    } catch (error) {
      console.error('Failed to get subscription by Stripe ID:', error);
      return undefined;
    }
  }

  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db.update(subscriptions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(subscriptions.id, subscriptionId))
        .returning();
      return subscription;
    } catch (error) {
      console.error('Failed to update subscription:', error);
      return undefined;
    }
  }

  async updateSubscriptionByStripeId(stripeSubscriptionId: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db.update(subscriptions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
        .returning();
      return subscription;
    } catch (error) {
      console.error('Failed to update subscription by Stripe ID:', error);
      return undefined;
    }
  }

  async getActiveSubscriptionByWorkspaceId(workspaceId: string): Promise<Subscription | undefined> {
    try {
      const [subscription] = await db.select().from(subscriptions)
        .where(
          and(
            eq(subscriptions.workspaceId, workspaceId),
            or(
              eq(subscriptions.status, 'active'),
              eq(subscriptions.status, 'trialing'),
              eq(subscriptions.status, 'past_due')
            )
          )
        )
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);
      return subscription;
    } catch (error) {
      console.error('Failed to get active subscription by workspace ID:', error);
      return undefined;
    }
  }

  // Entitlements operations for Stripe
  async grantPlanEntitlements(workspaceId: string, plan: string): Promise<void> {
    try {
      // Get plan features from entitlements middleware
      const { PLAN_FEATURES } = await import('./middleware/entitlements');
      const features = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || [];
      
      // Grant each feature
      for (const feature of features) {
        await db.insert(entitlements).values({
          id: randomUUID(),
          workspaceId,
          feature,
          grantedAt: new Date(),
        }).onConflictDoNothing();
      }
    } catch (error) {
      console.error('Failed to grant plan entitlements:', error);
      throw error;
    }
  }

  async revokeAllEntitlements(workspaceId: string): Promise<void> {
    try {
      await db.delete(entitlements)
        .where(eq(entitlements.workspaceId, workspaceId));
    } catch (error) {
      console.error('Failed to revoke entitlements:', error);
      throw error;
    }
  }

  async isWorkspaceAdmin(userId: string, workspaceId: string): Promise<boolean> {
    try {
      const membership = await this.getWorkspaceMembership(workspaceId, userId);
      if (!membership) {
        return false;
      }
      // Check if user has admin or owner role in the workspace
      return membership.role === 'admin' || membership.role === 'owner';
    } catch (error) {
      console.error('Failed to check workspace admin status:', error);
      return false;
    }
  }

  // ============================================
  // SPRINT 12 - DOCUMENTATION OPERATIONS
  // ============================================

  // Documentation CRUD operations
  async createDoc(doc: InsertDocs): Promise<Docs> {
    try {
      const [newDoc] = await db.insert(docs).values({
        ...doc,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      return newDoc;
    } catch (error) {
      console.error('Failed to create document:', error);
      throw error;
    }
  }

  async getDoc(id: string): Promise<Docs | undefined> {
    try {
      const [doc] = await db.select().from(docs).where(eq(docs.id, id));
      return doc;
    } catch (error) {
      console.error('Failed to get document:', error);
      return undefined;
    }
  }

  async getDocBySlug(slug: string): Promise<Docs | undefined> {
    try {
      const [doc] = await db.select().from(docs).where(eq(docs.slug, slug));
      return doc;
    } catch (error) {
      console.error('Failed to get document by slug:', error);
      return undefined;
    }
  }

  async getAllDocs(): Promise<Docs[]> {
    try {
      return await db.select().from(docs).orderBy(docs.createdAt);
    } catch (error) {
      console.error('Failed to get all documents:', error);
      return [];
    }
  }

  async getDocsByCategory(category: string): Promise<Docs[]> {
    try {
      return await db.select().from(docs)
        .where(eq(docs.category, category))
        .orderBy(docs.createdAt);
    } catch (error) {
      console.error('Failed to get documents by category:', error);
      return [];
    }
  }

  async getPublishedDocs(): Promise<Docs[]> {
    try {
      return await db.select().from(docs)
        .where(eq(docs.status, 'published'))
        .orderBy(docs.createdAt);
    } catch (error) {
      console.error('Failed to get published documents:', error);
      return [];
    }
  }

  async updateDoc(id: string, updates: Partial<Docs>): Promise<Docs | undefined> {
    try {
      const [updatedDoc] = await db.update(docs)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(docs.id, id))
        .returning();
      return updatedDoc;
    } catch (error) {
      console.error('Failed to update document:', error);
      return undefined;
    }
  }

  async deleteDoc(id: string): Promise<boolean> {
    try {
      const result = await db.delete(docs).where(eq(docs.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Failed to delete document:', error);
      return false;
    }
  }

  async incrementDocViewCount(id: string): Promise<Docs | undefined> {
    try {
      const [updatedDoc] = await db.update(docs)
        .set({ 
          viewCount: sql`${docs.viewCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(docs.id, id))
        .returning();
      return updatedDoc;
    } catch (error) {
      console.error('Failed to increment document view count:', error);
      return undefined;
    }
  }

  async searchDocs(query: string): Promise<Docs[]> {
    try {
      // Search in title, content, and summary fields
      return await db.select().from(docs)
        .where(
          sql`(
            LOWER(${docs.title}) LIKE LOWER(${`%${query}%`}) OR
            LOWER(${docs.content}) LIKE LOWER(${`%${query}%`}) OR
            LOWER(${docs.summary}) LIKE LOWER(${`%${query}%`})
          )`
        )
        .orderBy(docs.updatedAt);
    } catch (error) {
      console.error('Failed to search documents:', error);
      return [];
    }
  }

  // ============================================
  // WORKSPACE SYNCHRONIZATION - Event and Connection Management
  // ============================================
  
  // Workspace event management methods
  async createWorkspaceEvent(event: InsertWorkspaceEvent): Promise<WorkspaceEvent> {
    try {
      const [workspaceEvent] = await db.insert(workspaceEvents).values(event).returning();
      return workspaceEvent;
    } catch (error) {
      console.error('Failed to create workspace event:', error);
      throw error;
    }
  }

  async createWorkspaceEventAtomic(event: InsertWorkspaceEvent): Promise<WorkspaceEvent> {
    try {
      // Use transaction to atomically generate sequence number and insert event
      return await db.transaction(async (tx) => {
        // Get the next sequence number atomically within transaction
        const [result] = await tx.select({
          maxSequence: sql<number>`COALESCE(MAX(${workspaceEvents.sequenceNumber}), 0)`
        })
        .from(workspaceEvents)
        .where(eq(workspaceEvents.workspaceId, event.workspaceId))
        .for('update'); // Lock workspace events for atomic increment
        
        const nextSequence = (result?.maxSequence || 0) + 1;
        
        // Insert event with atomic sequence number
        const [workspaceEvent] = await tx.insert(workspaceEvents).values({
          ...event,
          sequenceNumber: nextSequence
        }).returning();
        
        return workspaceEvent;
      });
    } catch (error) {
      console.error('Failed to create workspace event atomically:', error);
      throw error;
    }
  }

  async getWorkspaceEvent(id: string): Promise<WorkspaceEvent | undefined> {
    try {
      const [event] = await db.select().from(workspaceEvents).where(eq(workspaceEvents.id, id));
      return event || undefined;
    } catch (error) {
      console.error('Failed to get workspace event:', error);
      return undefined;
    }
  }

  async getWorkspaceEvents(workspaceId: string, limit: number = 50, offset: number = 0): Promise<WorkspaceEvent[]> {
    try {
      return await db.select().from(workspaceEvents)
        .where(eq(workspaceEvents.workspaceId, workspaceId))
        .orderBy(sql`${workspaceEvents.sequenceNumber} DESC`)
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Failed to get workspace events:', error);
      return [];
    }
  }

  async getWorkspaceEventsSince(workspaceId: string, sequenceNumber: number): Promise<WorkspaceEvent[]> {
    try {
      return await db.select().from(workspaceEvents)
        .where(and(
          eq(workspaceEvents.workspaceId, workspaceId),
          sql`${workspaceEvents.sequenceNumber} > ${sequenceNumber}`
        ))
        .orderBy(sql`${workspaceEvents.sequenceNumber} ASC`);
    } catch (error) {
      console.error('Failed to get workspace events since sequence:', error);
      return [];
    }
  }

  async deleteWorkspaceEvent(id: string): Promise<boolean> {
    try {
      const result = await db.delete(workspaceEvents).where(eq(workspaceEvents.id, id));
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Failed to delete workspace event:', error);
      return false;
    }
  }

  async cleanupWorkspaceEvents(workspaceId: string, olderThanDays: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      const result = await db.delete(workspaceEvents)
        .where(and(
          eq(workspaceEvents.workspaceId, workspaceId),
          sql`${workspaceEvents.createdAt} < ${cutoffDate}`
        ));
      
      return result.rowCount || 0;
    } catch (error) {
      console.error('Failed to cleanup workspace events:', error);
      return 0;
    }
  }

  async getNextSequenceNumber(workspaceId: string): Promise<number> {
    try {
      const [result] = await db.select({
        maxSequence: sql<number>`COALESCE(MAX(${workspaceEvents.sequenceNumber}), 0)`
      })
      .from(workspaceEvents)
      .where(eq(workspaceEvents.workspaceId, workspaceId));
      
      return (result?.maxSequence || 0) + 1;
    } catch (error) {
      console.error('Failed to get next sequence number:', error);
      return 1;
    }
  }

  // Workspace connection management methods
  async createWorkspaceConnection(connection: InsertWorkspaceConnection): Promise<WorkspaceConnection> {
    try {
      const [workspaceConnection] = await db.insert(workspaceConnections).values(connection).returning();
      return workspaceConnection;
    } catch (error) {
      console.error('Failed to create workspace connection:', error);
      throw error;
    }
  }

  async getWorkspaceConnection(id: string): Promise<WorkspaceConnection | undefined> {
    try {
      const [connection] = await db.select().from(workspaceConnections).where(eq(workspaceConnections.id, id));
      return connection || undefined;
    } catch (error) {
      console.error('Failed to get workspace connection:', error);
      return undefined;
    }
  }

  async getActiveWorkspaceConnections(workspaceId: string): Promise<WorkspaceConnection[]> {
    try {
      return await db.select().from(workspaceConnections)
        .where(and(
          eq(workspaceConnections.workspaceId, workspaceId),
          eq(workspaceConnections.isActive, true)
        ))
        .orderBy(workspaceConnections.connectedAt);
    } catch (error) {
      console.error('Failed to get active workspace connections:', error);
      return [];
    }
  }

  async getUserWorkspaceConnections(workspaceId: string, userId: string): Promise<WorkspaceConnection[]> {
    try {
      return await db.select().from(workspaceConnections)
        .where(and(
          eq(workspaceConnections.workspaceId, workspaceId),
          eq(workspaceConnections.userId, userId),
          eq(workspaceConnections.isActive, true)
        ))
        .orderBy(workspaceConnections.connectedAt);
    } catch (error) {
      console.error('Failed to get user workspace connections:', error);
      return [];
    }
  }

  async updateConnectionPing(connectionId: string): Promise<WorkspaceConnection | undefined> {
    try {
      const [connection] = await db.update(workspaceConnections)
        .set({ lastPing: new Date() })
        .where(eq(workspaceConnections.connectionId, connectionId))
        .returning();
      return connection || undefined;
    } catch (error) {
      console.error('Failed to update connection ping:', error);
      return undefined;
    }
  }

  async deactivateConnection(connectionId: string): Promise<boolean> {
    try {
      const result = await db.update(workspaceConnections)
        .set({ 
          isActive: false,
          disconnectedAt: new Date()
        })
        .where(eq(workspaceConnections.connectionId, connectionId));
      
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error('Failed to deactivate connection:', error);
      return false;
    }
  }

  async deactivateUserConnections(workspaceId: string, userId: string): Promise<number> {
    try {
      const result = await db.update(workspaceConnections)
        .set({ 
          isActive: false,
          disconnectedAt: new Date()
        })
        .where(and(
          eq(workspaceConnections.workspaceId, workspaceId),
          eq(workspaceConnections.userId, userId),
          eq(workspaceConnections.isActive, true)
        ));
      
      return result.rowCount || 0;
    } catch (error) {
      console.error('Failed to deactivate user connections:', error);
      return 0;
    }
  }

  async cleanupStaleConnections(olderThanMinutes: number): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setMinutes(cutoffDate.getMinutes() - olderThanMinutes);
      
      const result = await db.update(workspaceConnections)
        .set({ 
          isActive: false,
          disconnectedAt: new Date()
        })
        .where(and(
          eq(workspaceConnections.isActive, true),
          sql`${workspaceConnections.lastPing} < ${cutoffDate}`
        ));
      
      return result.rowCount || 0;
    } catch (error) {
      console.error('Failed to cleanup stale connections:', error);
      return 0;
    }
  }

  // Connection presence and activity tracking
  async getWorkspaceActiveUsers(workspaceId: string): Promise<{ userId: string; user: User; connectionsCount: number; lastActivity: Date }[]> {
    try {
      const activeConnections = await db.select({
        userId: workspaceConnections.userId,
        connectionCount: sql<number>`COUNT(*)`,
        lastActivity: sql<Date>`MAX(${workspaceConnections.lastPing})`
      })
      .from(workspaceConnections)
      .where(and(
        eq(workspaceConnections.workspaceId, workspaceId),
        eq(workspaceConnections.isActive, true)
      ))
      .groupBy(workspaceConnections.userId);

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
      console.error('Failed to get workspace active users:', error);
      return [];
    }
  }

  async isUserActiveInWorkspace(workspaceId: string, userId: string): Promise<boolean> {
    try {
      const [connection] = await db.select()
        .from(workspaceConnections)
        .where(and(
          eq(workspaceConnections.workspaceId, workspaceId),
          eq(workspaceConnections.userId, userId),
          eq(workspaceConnections.isActive, true)
        ))
        .limit(1);
      
      return !!connection;
    } catch (error) {
      console.error('Failed to check if user is active in workspace:', error);
      return false;
    }
  }

  async getWorkspaceConnectionsCount(workspaceId: string): Promise<number> {
    try {
      const [result] = await db.select({
        count: sql<number>`COUNT(*)`
      })
      .from(workspaceConnections)
      .where(and(
        eq(workspaceConnections.workspaceId, workspaceId),
        eq(workspaceConnections.isActive, true)
      ));
      
      return result?.count || 0;
    } catch (error) {
      console.error('Failed to get workspace connections count:', error);
      return 0;
    }
  }

  // ============================================
  // MISSING METHODS - Sprint 12 Admin Settings
  // ============================================
  async createAdminSetting(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getAdminSetting(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getAllAdminSettings(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getAdminSettingsByCategory(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async updateAdminSetting(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async deleteAdminSetting(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }

  // Sprint 12 Marketplace
  async createMarketplaceItem(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getMarketplaceItem(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getAllMarketplaceItems(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getMarketplaceItemsByCategory(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getPublishedMarketplaceItems(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getFeaturedMarketplaceItems(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getMarketplaceItemsByPublisher(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async updateMarketplaceItem(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async deleteMarketplaceItem(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async incrementMarketplaceItemViews(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async incrementMarketplaceItemDownloads(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async searchMarketplaceItems(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }

  // Sprint 12 Changelog  
  async createChangelogEntry(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getChangelogEntry(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getChangelogEntryByVersion(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getAllChangelogEntries(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getPublishedChangelogEntries(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getPinnedChangelogEntries(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getChangelogEntriesByType(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async updateChangelogEntry(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async deleteChangelogEntry(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async publishChangelogEntry(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }

  // Sprint 12 Playbooks
  async createPlaybook(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getPlaybook(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getAllPlaybooks(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getPlaybooksByType(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getPlaybooksByRole(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getPlaybooksByCategory(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getActivePlaybooks(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async updatePlaybook(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async deletePlaybook(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async incrementPlaybookUsage(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async searchPlaybooks(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }

  // Sprint 12 Documentation
  async createDoc(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getDoc(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getDocBySlug(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getAllDocs(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getDocsByCategory(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getPublishedDocs(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async updateDoc(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async deleteDoc(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async incrementDocViewCount(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async searchDocs(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }

  // Additional SCIM methods that may be missing
  async getScimUserByScimId(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getActiveScimUsers(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async linkScimUserToLocal(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async syncScimUser(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async bulkSyncScimUsers(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async deprovisionScimUser(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getScimGroupByScimId(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async getScimGroupsByType(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async syncScimGroup(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
  async deprovisionScimGroup(): Promise<any> { throw new Error('Not implemented in DatabaseStorage'); }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
