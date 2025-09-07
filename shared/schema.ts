import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table compatible with Replit OpenID Connect
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"), // admin, premium_user, user
  preferences: jsonb("preferences").default({
    theme: "light",
    language: "en", 
    notifications: true,
    default_model: "gpt-5",
    default_temperature: 0.7,
    auto_save: true
  }),
  subscription: jsonb("subscription").default({
    plan: "free",
    usage_count: 0,
    monthly_limit: 10,
    reset_date: null
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session storage table for Replit OpenID Connect
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Analysis sessions for storing debate results  
export const analysisSessions = pgTable("analysis_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  mode: text("mode").notNull(),
  settings: jsonb("settings"),
  results: jsonb("results"),
  telemetry: jsonb("telemetry"),
  debateHistory: jsonb("debate_history"), // Store agent responses for cross-mode transfers
  title: text("title"), // User-friendly title for session identification
  sourceSessionId: varchar("source_session_id"), // Reference to original session if this is a transfer
  transferCount: integer("transfer_count").default(0), // Track how many times this has been transferred
  userId: varchar("user_id"),
  workspaceId: varchar("workspace_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Workspaces for team collaboration
export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  sessionCode: varchar("session_code", { length: 8 }).unique().notNull(),
  isPrivate: boolean("is_private").default(false),
  ownerId: varchar("owner_id").notNull(),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workspace membership with roles
export const workspaceMembers = pgTable("workspace_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull().default("member"), // owner, admin, member, viewer
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Invitation system for workspace collaboration
export const workspaceInvites = pgTable("workspace_invites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  invitedByUserId: varchar("invited_by_user_id").notNull(),
  email: text("email"),
  inviteCode: varchar("invite_code", { length: 16 }).unique(),
  role: text("role").notNull().default("member"),
  status: text("status").notNull().default("pending"), // pending, accepted, expired
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});


// Zod schemas for data validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  preferences: true,
  subscription: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertAnalysisSessionSchema = createInsertSchema(analysisSessions).pick({
  prompt: true,
  mode: true,
  settings: true,
  title: true,
  sourceSessionId: true,
  transferCount: true,
  userId: true,
  workspaceId: true,
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).pick({
  name: true,
  description: true,
  isPrivate: true,
  ownerId: true,
  settings: true,
});

export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers).pick({
  workspaceId: true,
  userId: true,
  role: true,
});

export const insertWorkspaceInviteSchema = createInsertSchema(workspaceInvites).pick({
  workspaceId: true,
  invitedByUserId: true,
  email: true,
  role: true,
});

// User preferences schema
export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  language: z.string().optional(),
  notifications: z.boolean().optional(),
  default_model: z.string().optional(),
  default_temperature: z.number().min(0).max(2).optional(),
  auto_save: z.boolean().optional(),
});

// Workspace role validation
export const workspaceRoleSchema = z.enum(["owner", "admin", "member", "viewer"]);

export const thinkRequestSchema = z.object({
  prompt: z.string().min(1),
  mode: z.enum(["simple", "guided", "expert"]),
  transfer_from_session_id: z.string().optional(), // ID of previous session to transfer from
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
    "legal-analyst", "legal-advocate",
    "medical-diagnostician", "medical-researcher",
    "financial-analyst", "investment-strategist",
    "tech-architect", "devops-engineer",
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
    min_sources: z.number().min(0).max(10).optional(),
  }).optional(),
  
  // Expert mode options
  context: z.string().optional(),
  selected_models: z.array(z.string()).optional(),
  use_case: z.string().optional(),
  debate_title: z.string().optional(),
  
  // Advanced AI Capabilities (Expert Mode)
  thinking_patterns: z.array(z.enum([
    "multi_perspective", "scenario_planning", "root_cause", 
    "risk_modeling", "information_synthesis", "meta_analysis"
  ])).optional(),
  enterprise_specialists: z.array(z.enum([
    "constitutional_scholar", "risk_strategist", "ai_systems_architect",
    "cybersecurity_strategist", "cognitive_neuroscientist", "systems_policy_analyst", 
    "innovation_strategist"
  ])).optional(),
  creativity_level: z.number().min(0).max(100).optional(),
  timestamp: z.string().optional(),
  frameworks: z.array(z.enum([
    "systematic_analysis", "critical_thinking", "design_thinking", "first_principles", 
    "systems_thinking", "dialectical_reasoning", "abductive_reasoning", "forensic_analysis"
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
    critic: z.number().min(0).max(100).optional(),
  }).optional(),
  rag: z.object({
    enabled: z.boolean().optional(),
    top_k: z.number().min(1).max(50).optional(),
    max_tokens: z.number().min(100).max(4000).optional(),
    web: z.boolean().optional(),
    code: z.boolean().optional(),
  }).optional(),
  security: z.object({
    pii_redaction: z.boolean().optional(),
    log_masking: z.boolean().optional(),
    region: z.string().optional(),
  }).optional(),
  export_formats: z.array(z.enum(["pdf", "json", "txt", "story_map"])).optional(),
});

export const thinkResponseSchema = z.object({
  consensus: z.string(),
  dissents: z.array(z.object({
    position: z.string(),
    reasoning: z.string().optional(),
  })),
  unresolved: z.array(z.string()),
  telemetry: z.object({
    avg_ms: z.number(),
    quality: z.number(),
    tps: z.number(),
    active_agents: z.number().optional(),
  }),
  citations: z.array(z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    source: z.string().optional(),
    author: z.string().optional(),
    year: z.string().optional(),
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
        source: z.string().optional(),
      })).optional(),
    })),
    verification_settings: z.object({
      depth: z.enum(["standard", "comprehensive", "expert_review"]).optional(),
      min_sources: z.number().min(0).max(10).optional(),
    }).optional(),
  }).optional(),
  follow_up_questions: z.array(z.object({
    question: z.string(),
    category: z.string().optional(),
    complexity: z.enum(["low", "medium", "high"]).optional(),
  })).optional(),
  focus_areas: z.object({
    identified: z.array(z.string()).optional(),
    connections: z.array(z.object({
      from: z.string(),
      to: z.string(),
      strength: z.enum(["weak", "moderate", "strong"]).optional(),
    })).optional(),
  }).optional(),
});

// Brainstorming phase response schema
export const brainstormResponseSchema = z.object({
  solutions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    feasibility: z.enum(["low", "medium", "high"]),
    impact: z.enum(["low", "medium", "high"]),
    timeline: z.string().optional(),
    resources_required: z.array(z.string()).optional(),
  })),
  action_plan: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string(),
    owner: z.string().optional(),
    timeline: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
  })),
  answered_questions: z.array(z.object({
    original_question: z.string(),
    answer: z.string(),
    confidence: z.enum(["low", "medium", "high"]),
    supporting_evidence: z.array(z.string()).optional(),
  })),
  final_consensus: z.string(),
  implementation_strategy: z.object({
    approach: z.string(),
    key_milestones: z.array(z.string()),
    success_metrics: z.array(z.string()).optional(),
    risk_mitigation: z.array(z.string()).optional(),
  }),
  telemetry: z.object({
    avg_ms: z.number(),
    quality: z.number(),
    tps: z.number(),
    active_agents: z.number().optional(),
  }),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type AnalysisSession = typeof analysisSessions.$inferSelect;
export type InsertAnalysisSession = z.infer<typeof insertAnalysisSessionSchema>;
export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = z.infer<typeof insertWorkspaceMemberSchema>;
export type WorkspaceInvite = typeof workspaceInvites.$inferSelect;
export type InsertWorkspaceInvite = z.infer<typeof insertWorkspaceInviteSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;
export type ThinkRequest = z.infer<typeof thinkRequestSchema>;
export type ThinkResponse = z.infer<typeof thinkResponseSchema>;
export type BrainstormResponse = z.infer<typeof brainstormResponseSchema>;
export type Citation = {
  title?: string;
  url?: string;
  source?: string;
  author?: string;
  year?: string;
};
export type FactCheckFinding = {
  claim: string;
  status: "verified" | "disputed" | "partially_verified" | "supported" | "contradicted" | "inconclusive";
  confidence?: number;
  verification_depth?: "standard" | "comprehensive" | "expert_review";
  sources_count?: number;
  note?: string;
  citations?: Array<{title?: string; url?: string; source?: string;}>;
};

export type FollowUpQuestion = {
  question: string;
  category?: string;
  complexity?: "low" | "medium" | "high";
};

export type FocusAreas = {
  identified?: string[];
  connections?: Array<{
    from: string;
    to: string;
    strength?: "weak" | "moderate" | "strong";
  }>;
};

export type AgentConfig = {
  role: string;
  systemPrompt: string;
  provider?: "openai" | "anthropic";
};

export type AgentSelection = {
  mode: "smart" | "manual" | "domain" | "usecase";
  manual_agents?: string[];
  domain_expert_type?: string;
  usecase_type?: string;
};

// Cross-mode debate transfer types
export type SessionTransfer = {
  sessionId: string;
  title: string;
  prompt: string;
  mode: string;
  consensus: string;
  dissents: Array<{ position: string; reasoning?: string }>;
  unresolved: string[];
  debateHistory?: Array<{ agent: string; response: string }>;
  createdAt: Date;
};

// Session codes for real-time collaboration
export const sessionCodes = pgTable("session_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 8 }).unique().notNull(),
  createdBy: varchar("created_by").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertSessionCode = typeof sessionCodes.$inferInsert;
export type SessionCode = typeof sessionCodes.$inferSelect;

// Session participants for tracking who's in each collaborative session
export const sessionParticipants = pgTable("session_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionCode: varchar("session_code").notNull(),
  userId: varchar("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  role: varchar("role", { enum: ["viewer", "participant", "moderator"] }).default("participant").notNull(),
});

export type InsertSessionParticipant = typeof sessionParticipants.$inferInsert;
export type SessionParticipant = typeof sessionParticipants.$inferSelect;

// Chat messages for live team communication during debates
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionCode: varchar("session_code").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  messageType: varchar("message_type", { enum: ["chat", "system", "debate_update"] }).default("chat").notNull(),
});

export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Zod schemas for collaboration features
export const insertSessionCodeSchema = createInsertSchema(sessionCodes).pick({
  code: true,
  createdBy: true,
  expiresAt: true,
  isActive: true,
});

export const insertSessionParticipantSchema = createInsertSchema(sessionParticipants).pick({
  sessionCode: true,
  userId: true,
  role: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  sessionCode: true,
  userId: true,
  content: true,
  messageType: true,
});

// ============================================
// ENTERPRISE FEATURES - Organization Hierarchy
// ============================================

// Organizations - top-level entities for enterprise customers
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: varchar("slug").unique().notNull(), // URL-friendly identifier
  logo: varchar("logo_url"),
  plan: varchar("plan").notNull().default("free"), // free, pro, enterprise
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
      monthly_analyses: 1000,
      concurrent_sessions: 10,
      storage_gb: 5
    }
  }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organization membership with hierarchical roles
export const organizationMembers = pgTable("organization_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: varchar("role").notNull().default("member"), // super_admin, admin, manager, member, viewer
  permissions: jsonb("permissions").default({
    manage_users: false,
    manage_billing: false,
    manage_workspaces: false,
    view_audit_logs: false,
    manage_security: false
  }),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
});

// Teams within organizations for better structure
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  parentTeamId: varchar("parent_team_id"), // For hierarchical teams
  settings: jsonb("settings").default({
    default_workspace_privacy: "private",
    auto_join_workspaces: false
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team membership
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: varchar("role").notNull().default("member"), // lead, member
  joinedAt: timestamp("joined_at").defaultNow(),
});

// ============================================
// ENTERPRISE FEATURES - Advanced Security
// ============================================

// Comprehensive audit logging
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  userId: varchar("user_id"),
  action: varchar("action").notNull(), // login, logout, create_workspace, delete_user, etc.
  resource: varchar("resource"), // user, workspace, organization, etc.
  resourceId: varchar("resource_id"), // ID of the affected resource
  details: jsonb("details"), // Additional context about the action
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  metadata: jsonb("metadata"), // Request headers, session info, etc.
  severity: varchar("severity").notNull().default("info"), // info, warning, error, critical
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => [
  index("audit_logs_org_idx").on(table.organizationId),
  index("audit_logs_user_idx").on(table.userId),
  index("audit_logs_action_idx").on(table.action),
  index("audit_logs_timestamp_idx").on(table.timestamp),
]);

// PII patterns and redaction rules
export const piiPatterns = pgTable("pii_patterns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  name: varchar("name").notNull(),
  pattern: text("pattern").notNull(), // Regex pattern for PII detection
  category: varchar("category").notNull(), // email, ssn, phone, credit_card, etc.
  redactionType: varchar("redaction_type").notNull().default("mask"), // mask, remove, hash
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security events and incidents
export const securityEvents = pgTable("security_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  eventType: varchar("event_type").notNull(), // failed_login, suspicious_activity, rate_limit_exceeded
  severity: varchar("severity").notNull(), // low, medium, high, critical
  description: text("description").notNull(),
  metadata: jsonb("metadata"), // IP, user agent, attempt details, etc.
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by"),
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => [
  index("security_events_org_idx").on(table.organizationId),
  index("security_events_type_idx").on(table.eventType),
  index("security_events_severity_idx").on(table.severity),
  index("security_events_timestamp_idx").on(table.timestamp),
]);

// ============================================
// ENTERPRISE FEATURES - Rate Limiting & Quotas
// ============================================

// Usage tracking for rate limiting and billing
export const usageMetrics = pgTable("usage_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  userId: varchar("user_id"),
  metricType: varchar("metric_type").notNull(), // api_calls, analyses, storage, bandwidth
  value: integer("value").notNull(),
  unit: varchar("unit").notNull(), // calls, mb, seconds, etc.
  period: varchar("period").notNull(), // hourly, daily, monthly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  metadata: jsonb("metadata"), // Additional usage context
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("usage_metrics_org_period_idx").on(table.organizationId, table.period),
  index("usage_metrics_user_period_idx").on(table.userId, table.period),
  index("usage_metrics_type_idx").on(table.metricType),
  index("usage_metrics_period_start_idx").on(table.periodStart),
]);

// Rate limiting rules and configurations
export const rateLimitRules = pgTable("rate_limit_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  ruleType: varchar("rule_type").notNull(), // user, organization, endpoint, global
  target: varchar("target"), // user_id, org_id, endpoint_path, or null for global
  limit: integer("limit").notNull(), // Max requests
  window: integer("window").notNull(), // Time window in seconds
  action: varchar("action").notNull().default("throttle"), // throttle, block, alert
  metadata: jsonb("metadata"), // Custom rule parameters
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Active rate limit states (in-memory cache backup)
export const rateLimitStates = pgTable("rate_limit_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ruleId: varchar("rule_id").notNull(),
  targetId: varchar("target_id").notNull(), // user_id, org_id, etc.
  requestCount: integer("request_count").notNull().default(0),
  windowStart: timestamp("window_start").notNull(),
  windowEnd: timestamp("window_end").notNull(),
  isBlocked: boolean("is_blocked").default(false),
  lastRequest: timestamp("last_request").defaultNow(),
}, (table) => [
  index("rate_limit_states_rule_target_idx").on(table.ruleId, table.targetId),
  index("rate_limit_states_window_end_idx").on(table.windowEnd),
]);

// ============================================
// ENTERPRISE FEATURES - Performance & Monitoring
// ============================================

// System performance metrics
export const performanceMetrics = pgTable("performance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  metricName: varchar("metric_name").notNull(), // response_time, cpu_usage, memory_usage, etc.
  value: integer("value").notNull(),
  unit: varchar("unit").notNull(), // ms, percent, mb, etc.
  tags: jsonb("tags"), // Additional metric tags for filtering
  endpoint: varchar("endpoint"), // API endpoint if applicable
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => [
  index("performance_metrics_name_idx").on(table.metricName),
  index("performance_metrics_org_idx").on(table.organizationId),
  index("performance_metrics_timestamp_idx").on(table.timestamp),
]);

// Error tracking and monitoring
export const errorLogs = pgTable("error_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  userId: varchar("user_id"),
  errorType: varchar("error_type").notNull(), // application, system, network, etc.
  errorCode: varchar("error_code"), // HTTP status, custom error codes, etc.
  message: text("message").notNull(),
  stackTrace: text("stack_trace"),
  endpoint: varchar("endpoint"),
  requestId: varchar("request_id"), // For request tracing
  severity: varchar("severity").notNull().default("error"), // info, warning, error, fatal
  metadata: jsonb("metadata"), // Request headers, user context, etc.
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: varchar("resolved_by"),
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => [
  index("error_logs_org_idx").on(table.organizationId),
  index("error_logs_type_idx").on(table.errorType),
  index("error_logs_severity_idx").on(table.severity),
  index("error_logs_timestamp_idx").on(table.timestamp),
  index("error_logs_request_id_idx").on(table.requestId),
]);

// System health checks and status
export const healthChecks = pgTable("health_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceName: varchar("service_name").notNull(), // database, redis, external_api, etc.
  status: varchar("status").notNull(), // healthy, degraded, unhealthy
  responseTime: integer("response_time"), // in milliseconds
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"), // Service-specific health details
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => [
  index("health_checks_service_idx").on(table.serviceName),
  index("health_checks_status_idx").on(table.status),
  index("health_checks_timestamp_idx").on(table.timestamp),
]);

// ============================================
// ENTERPRISE FEATURES - Zod Schemas
// ============================================

// Organization schemas
export const insertOrganizationSchema = createInsertSchema(organizations).pick({
  name: true,
  slug: true,
  logo: true,
  plan: true,
  settings: true,
  billingSettings: true,
});

export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers).pick({
  organizationId: true,
  userId: true,
  role: true,
  permissions: true,
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  organizationId: true,
  name: true,
  description: true,
  parentTeamId: true,
  settings: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  teamId: true,
  userId: true,
  role: true,
});

// Security schemas
export const insertAuditLogSchema = createInsertSchema(auditLogs).pick({
  organizationId: true,
  userId: true,
  action: true,
  resource: true,
  resourceId: true,
  details: true,
  ipAddress: true,
  userAgent: true,
  metadata: true,
  severity: true,
});

export const insertPiiPatternSchema = createInsertSchema(piiPatterns).pick({
  organizationId: true,
  name: true,
  pattern: true,
  category: true,
  redactionType: true,
  isActive: true,
});

export const insertSecurityEventSchema = createInsertSchema(securityEvents).pick({
  organizationId: true,
  eventType: true,
  severity: true,
  description: true,
  metadata: true,
});

// Usage and rate limiting schemas
export const insertUsageMetricSchema = createInsertSchema(usageMetrics).pick({
  organizationId: true,
  userId: true,
  metricType: true,
  value: true,
  unit: true,
  period: true,
  periodStart: true,
  periodEnd: true,
  metadata: true,
});

export const insertRateLimitRuleSchema = createInsertSchema(rateLimitRules).pick({
  organizationId: true,
  ruleType: true,
  target: true,
  limit: true,
  window: true,
  action: true,
  metadata: true,
  isActive: true,
});

export const insertRateLimitStateSchema = createInsertSchema(rateLimitStates).pick({
  ruleId: true,
  targetId: true,
  requestCount: true,
  windowStart: true,
  windowEnd: true,
  isBlocked: true,
});

// Monitoring schemas
export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).pick({
  organizationId: true,
  metricName: true,
  value: true,
  unit: true,
  tags: true,
  endpoint: true,
});

export const insertErrorLogSchema = createInsertSchema(errorLogs).pick({
  organizationId: true,
  userId: true,
  errorType: true,
  errorCode: true,
  message: true,
  stackTrace: true,
  endpoint: true,
  requestId: true,
  severity: true,
  metadata: true,
});

export const insertHealthCheckSchema = createInsertSchema(healthChecks).pick({
  serviceName: true,
  status: true,
  responseTime: true,
  errorMessage: true,
  metadata: true,
});

// Role and permission validation schemas
export const organizationRoleSchema = z.enum(["super_admin", "admin", "manager", "member", "viewer"]);
export const teamRoleSchema = z.enum(["lead", "member"]);
export const auditLogSeveritySchema = z.enum(["info", "warning", "error", "critical"]);
export const securityEventSeveritySchema = z.enum(["low", "medium", "high", "critical"]);
export const piiCategorySchema = z.enum(["email", "ssn", "phone", "credit_card", "address", "name", "custom"]);
export const redactionTypeSchema = z.enum(["mask", "remove", "hash", "tokenize"]);
export const rateLimitActionSchema = z.enum(["throttle", "block", "alert"]);
export const healthStatusSchema = z.enum(["healthy", "degraded", "unhealthy"]);

// Organization settings validation
export const organizationSettingsSchema = z.object({
  default_security_level: z.enum(["basic", "standard", "enhanced"]).optional(),
  require_2fa: z.boolean().optional(),
  allowed_domains: z.array(z.string()).optional(),
  max_workspaces: z.number().min(1).optional(),
  max_users: z.number().min(1).optional(),
  retention_days: z.number().min(1).max(3650).optional(),
  custom_branding: z.object({
    logo: z.string().optional(),
    primary_color: z.string().optional(),
    secondary_color: z.string().optional(),
  }).optional(),
});

// Billing settings validation
export const billingSettingsSchema = z.object({
  billing_email: z.string().email().optional(),
  usage_alerts: z.boolean().optional(),
  quota_limits: z.object({
    monthly_analyses: z.number().min(0).optional(),
    concurrent_sessions: z.number().min(1).optional(),
    storage_gb: z.number().min(0).optional(),
  }).optional(),
});

// Permission validation schema
export const permissionsSchema = z.object({
  manage_users: z.boolean().optional(),
  manage_billing: z.boolean().optional(),
  manage_workspaces: z.boolean().optional(),
  view_audit_logs: z.boolean().optional(),
  manage_security: z.boolean().optional(),
  manage_teams: z.boolean().optional(),
  view_analytics: z.boolean().optional(),
});

// ============================================
// ENTERPRISE FEATURES - Type Definitions
// ============================================

// Organization types
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

// Security types
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type PiiPattern = typeof piiPatterns.$inferSelect;
export type InsertPiiPattern = z.infer<typeof insertPiiPatternSchema>;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;

// Usage and rate limiting types
export type UsageMetric = typeof usageMetrics.$inferSelect;
export type InsertUsageMetric = z.infer<typeof insertUsageMetricSchema>;
export type RateLimitRule = typeof rateLimitRules.$inferSelect;
export type InsertRateLimitRule = z.infer<typeof insertRateLimitRuleSchema>;
export type RateLimitState = typeof rateLimitStates.$inferSelect;
export type InsertRateLimitState = z.infer<typeof insertRateLimitStateSchema>;

// Monitoring types
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type ErrorLog = typeof errorLogs.$inferSelect;
export type InsertErrorLog = z.infer<typeof insertErrorLogSchema>;
export type HealthCheck = typeof healthChecks.$inferSelect;
export type InsertHealthCheck = z.infer<typeof insertHealthCheckSchema>;

// Enum types
export type OrganizationRole = z.infer<typeof organizationRoleSchema>;
export type TeamRole = z.infer<typeof teamRoleSchema>;
export type AuditLogSeverity = z.infer<typeof auditLogSeveritySchema>;
export type SecurityEventSeverity = z.infer<typeof securityEventSeveritySchema>;
export type PiiCategory = z.infer<typeof piiCategorySchema>;
export type RedactionType = z.infer<typeof redactionTypeSchema>;
export type RateLimitAction = z.infer<typeof rateLimitActionSchema>;
export type HealthStatus = z.infer<typeof healthStatusSchema>;

// Settings types
export type OrganizationSettings = z.infer<typeof organizationSettingsSchema>;
export type BillingSettings = z.infer<typeof billingSettingsSchema>;
export type Permissions = z.infer<typeof permissionsSchema>;
