import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean, index, decimal, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table compatible with Replit OpenID Connect
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"), // system_admin, admin, premium_user, user
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
  brainstormResults: jsonb("brainstorm_results"), // Store brainstorming session results
  lastBrainstormedAt: timestamp("last_brainstormed_at"), // When brainstorming was last run
  lastReportGeneratedAt: timestamp("last_report_generated_at"), // When report was last generated
  lastReportType: varchar("last_report_type"), // Type of last generated report
  title: text("title"), // User-friendly title for session identification
  sourceSessionId: varchar("source_session_id"), // Reference to original session if this is a transfer
  transferCount: integer("transfer_count").default(0), // Track how many times this has been transferred
  userId: varchar("user_id"),
  workspaceId: varchar("workspace_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated reports for storing completed report content
export const generatedReports = pgTable("generated_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(), // Reference to analysis session
  userId: varchar("user_id").notNull(), // Owner of the report
  reportType: varchar("report_type").notNull(), // executive, detailed, full
  title: text("title").notNull(), // User-friendly title
  content: text("content").notNull(), // Full report content
  format: varchar("format").notNull().default("markdown"), // markdown, html, pdf
  metadata: jsonb("metadata").default({}), // Additional report metadata (word count, generation time, etc.)
  generatedAt: timestamp("generated_at").defaultNow(),
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

// Templates for AI thinking templates and analysis frameworks
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // User-facing template name
  description: text("description"), // Brief description of template purpose
  category: varchar("category").notNull(), // business, technology, education, research
  tags: text("tags").array(), // Array of tags for categorization
  content: jsonb("content").notNull(), // Template content structure and configuration
  isPublic: boolean("is_public").default(true), // Whether template is publicly available
  usageCount: integer("usage_count").default(0), // Track how many times template has been used
  authorId: varchar("author_id"), // User who created the template
  version: integer("version").default(1), // Template version for updates
  metadata: jsonb("metadata").default({}), // Additional template metadata
  // Sprint 6 - Template Builder CRUD + Publish System
  organizationId: varchar("organization_id"), // Tenant hardening
  status: varchar("status").notNull().default("draft"), // draft, under_review, published, archived
  publishedAt: timestamp("published_at"), // When template was published
  publishedBy: varchar("published_by"), // User who published the template
  reviewedAt: timestamp("reviewed_at"), // When template was last reviewed
  reviewedBy: varchar("reviewed_by"), // User who reviewed the template
  approvalComments: text("approval_comments"), // Comments from reviewer
  contentValidation: jsonb("content_validation").default({}), // Validation results
  previousVersionId: varchar("previous_version_id"), // Link to previous version
  isTemplate: boolean("is_template").default(true), // Distinguish from instances
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("templates_status_idx").on(table.status),
  index("templates_organization_idx").on(table.organizationId),
  index("templates_author_status_idx").on(table.authorId, table.status),
]);

// Push notification subscriptions for web push support
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(), // User who owns this subscription
  endpoint: text("endpoint").notNull(), // Push service endpoint URL
  p256dh: text("p256dh").notNull(), // User agent public key for encryption
  auth: text("auth").notNull(), // Authentication secret for encryption
  userAgent: text("user_agent"), // Browser/device information
  isActive: boolean("is_active").default(true), // Whether subscription is active
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================
// TUTORIAL SYSTEM - Interactive User Guidance
// ============================================

// Tutorial definitions with steps and configuration
export const tutorials = pgTable("tutorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Tutorial name (e.g. "Getting Started", "Expert Mode Guide")
  description: text("description"), // Brief description of what tutorial covers
  category: varchar("category").notNull(), // onboarding, feature, advanced, troubleshooting
  targetFeature: varchar("target_feature"), // Which feature this tutorial covers (simple, guided, expert, templates, etc.)
  targetUserLevel: varchar("target_user_level").notNull().default("beginner"), // beginner, intermediate, expert, all
  isActive: boolean("is_active").default(true), // Whether tutorial is available
  estimatedDuration: integer("estimated_duration"), // Estimated time in minutes
  priority: integer("priority").default(0), // Display priority (higher = shown first)
  triggerConditions: jsonb("trigger_conditions").default([]), // Conditions that trigger auto-start
  completionRewards: jsonb("completion_rewards").default({}), // Badges, points, unlocks
  metadata: jsonb("metadata").default({}), // Additional configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("tutorials_category_idx").on(table.category),
  index("tutorials_active_priority_idx").on(table.isActive, table.priority),
  index("tutorials_feature_idx").on(table.targetFeature),
]);

// Individual tutorial steps with positioning and interactions
export const tutorialSteps = pgTable("tutorial_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tutorialId: varchar("tutorial_id").notNull(), // Parent tutorial
  stepNumber: integer("step_number").notNull(), // Order within tutorial
  title: text("title").notNull(), // Step title
  content: text("content").notNull(), // Step description/instructions
  targetElement: varchar("target_element"), // CSS selector or data-testid for highlighting
  targetPage: varchar("target_page"), // Page route this step appears on
  position: varchar("position").default("bottom"), // tooltip position: top, bottom, left, right, center
  stepType: varchar("step_type").notNull().default("tooltip"), // tooltip, modal, highlight, interaction, wait
  interactionType: varchar("interaction_type"), // click, input, scroll, none
  nextCondition: varchar("next_condition"), // Condition to proceed to next step
  skipAllowed: boolean("skip_allowed").default(true), // Whether step can be skipped
  autoAdvance: boolean("auto_advance").default(false), // Auto-proceed after interaction
  delayMs: integer("delay_ms").default(0), // Delay before showing step
  styling: jsonb("styling").default({}), // Custom CSS styles
  validation: jsonb("validation").default({}), // Validation rules for interactions
  metadata: jsonb("metadata").default({}), // Additional step configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("tutorial_steps_tutorial_idx").on(table.tutorialId),
  index("tutorial_steps_order_idx").on(table.tutorialId, table.stepNumber),
  index("tutorial_steps_page_idx").on(table.targetPage),
]);

// User tutorial progress and completion tracking
export const tutorialProgress = pgTable("tutorial_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(), // User taking tutorial
  tutorialId: varchar("tutorial_id").notNull(), // Tutorial being taken
  status: varchar("status").notNull().default("not_started"), // not_started, in_progress, completed, skipped, abandoned
  currentStep: integer("current_step").default(1), // Current step number
  completedSteps: jsonb("completed_steps").default([]), // Array of completed step numbers
  skippedSteps: jsonb("skipped_steps").default([]), // Array of skipped step numbers
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastInteractionAt: timestamp("last_interaction_at").defaultNow(),
  timeSpentMinutes: integer("time_spent_minutes").default(0), // Total time spent
  helpRequestsCount: integer("help_requests_count").default(0), // Times user requested help
  metadata: jsonb("metadata").default({}), // Progress analytics and notes
}, (table) => [
  index("tutorial_progress_user_idx").on(table.userId),
  index("tutorial_progress_tutorial_idx").on(table.tutorialId),
  index("tutorial_progress_status_idx").on(table.status),
  index("tutorial_progress_user_tutorial_idx").on(table.userId, table.tutorialId),
]);

// User tutorial preferences and settings
export const tutorialSettings = pgTable("tutorial_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(), // User these settings belong to
  autoStartTutorials: boolean("auto_start_tutorials").default(true), // Auto-start relevant tutorials
  showTooltips: boolean("show_tooltips").default(true), // Show contextual tooltips
  tutorialSpeed: varchar("tutorial_speed").default("normal"), // slow, normal, fast
  preferredPosition: varchar("preferred_position").default("bottom"), // Default tooltip position
  disabledCategories: jsonb("disabled_categories").default([]), // Tutorial categories to skip
  notificationPreferences: jsonb("notification_preferences").default({
    completion_rewards: true,
    progress_reminders: true,
    new_tutorials: true
  }),
  lastDismissedTutorial: varchar("last_dismissed_tutorial"), // Last tutorial user dismissed
  dismissedAt: timestamp("dismissed_at"),
  experienceLevel: varchar("experience_level").default("beginner"), // User-set experience level
  completedTutorialCount: integer("completed_tutorial_count").default(0), // Count of completed tutorials
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("tutorial_settings_user_idx").on(table.userId),
]);


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

export const insertGeneratedReportSchema = createInsertSchema(generatedReports).pick({
  sessionId: true,
  userId: true,
  reportType: true,
  title: true,
  content: true,
  format: true,
  metadata: true,
});

// insertTemplateSchema - REMOVED DUPLICATE (see Sprint 6 section)

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).pick({
  userId: true,
  endpoint: true,
  p256dh: true,
  auth: true,
  userAgent: true,
  isActive: true,
});

// Tutorial system schemas
export const insertTutorialSchema = createInsertSchema(tutorials).pick({
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
  metadata: true,
});

export const insertTutorialStepSchema = createInsertSchema(tutorialSteps).pick({
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
  metadata: true,
});

export const insertTutorialProgressSchema = createInsertSchema(tutorialProgress).pick({
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
  metadata: true,
});

export const insertTutorialSettingsSchema = createInsertSchema(tutorialSettings).pick({
  userId: true,
  autoStartTutorials: true,
  showTooltips: true,
  tutorialSpeed: true,
  preferredPosition: true,
  disabledCategories: true,
  notificationPreferences: true,
  experienceLevel: true,
});


// Template category validation - REMOVED DUPLICATE (see Sprint 6 section)

// Tutorial system validation schemas
export const tutorialCategorySchema = z.enum(["onboarding", "feature", "advanced", "troubleshooting"]);
export const tutorialUserLevelSchema = z.enum(["beginner", "intermediate", "expert", "all"]);
export const tutorialStatusSchema = z.enum(["not_started", "in_progress", "completed", "skipped", "abandoned"]);
export const tutorialStepTypeSchema = z.enum(["tooltip", "modal", "highlight", "interaction", "wait"]);
export const tutorialPositionSchema = z.enum(["top", "bottom", "left", "right", "center"]);
export const tutorialSpeedSchema = z.enum(["slow", "normal", "fast"]);
export const interactionTypeSchema = z.enum(["click", "input", "scroll", "none"]);


// Type definitions
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;

// Tutorial system types
export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type TutorialStep = typeof tutorialSteps.$inferSelect;
export type InsertTutorialStep = z.infer<typeof insertTutorialStepSchema>;
export type TutorialProgress = typeof tutorialProgress.$inferSelect;
export type InsertTutorialProgress = z.infer<typeof insertTutorialProgressSchema>;
export type TutorialSettings = typeof tutorialSettings.$inferSelect;
export type InsertTutorialSettings = z.infer<typeof insertTutorialSettingsSchema>;

// Tutorial enum types
export type TutorialCategory = z.infer<typeof tutorialCategorySchema>;
export type TutorialUserLevel = z.infer<typeof tutorialUserLevelSchema>;
export type TutorialStatus = z.infer<typeof tutorialStatusSchema>;
export type TutorialStepType = z.infer<typeof tutorialStepTypeSchema>;
export type TutorialPosition = z.infer<typeof tutorialPositionSchema>;
export type TutorialSpeed = z.infer<typeof tutorialSpeedSchema>;
export type InteractionType = z.infer<typeof interactionTypeSchema>;

// Sprint 4 billing system types
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Entitlement = typeof entitlements.$inferSelect;
export type InsertEntitlement = z.infer<typeof insertEntitlementSchema>;
export type TemplateProduct = typeof templateProducts.$inferSelect;
export type InsertTemplateProduct = z.infer<typeof insertTemplateProductSchema>;
export type TemplatePurchase = typeof templatePurchases.$inferSelect;
export type InsertTemplatePurchase = z.infer<typeof insertTemplatePurchaseSchema>;

// Sprint 4 enum types
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type BillingFeature = z.infer<typeof billingFeatureSchema>;

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

// Report generation schemas
export const reportRequestSchema = z.object({
  session_id: z.string(),
  report_type: z.enum(["executive", "detailed", "full"]),
  include_citations: z.boolean().default(true),
  include_expert_summary: z.boolean().default(true),
  format: z.enum(["markdown", "pdf", "html"]).default("markdown"),
});

export const reportResponseSchema = z.object({
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
      reasoning: z.string().optional(),
    })),
    unresolved_questions: z.array(z.string()),
  }),
  brainstorming_outcomes: z.object({
    collaborative_solutions: z.array(z.object({
      title: z.string(),
      description: z.string(),
      feasibility: z.enum(["low", "medium", "high"]),
      impact: z.enum(["low", "medium", "high"]),
      timeline: z.string().optional(),
      resources_required: z.array(z.string()).optional(),
    })),
    implementation_plan: z.array(z.object({
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
    implementation_strategy: z.object({
      approach: z.string(),
      key_milestones: z.array(z.string()),
      success_metrics: z.array(z.string()).optional(),
      risk_mitigation: z.array(z.string()).optional(),
    }),
  }).optional(),
  expert_analysis: z.object({
    domain_experts_consulted: z.array(z.object({
      expert_type: z.string(),
      role: z.string(),
      key_contributions: z.array(z.string()),
      confidence_level: z.enum(["low", "medium", "high"]),
    })),
    ai_agents_summary: z.array(z.object({
      agent_name: z.string(),
      role: z.string(),
      key_insights: z.array(z.string()),
      approach: z.string(),
    })),
  }).optional(),
  citations: z.array(z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    source: z.string().optional(),
    author: z.string().optional(),
    year: z.string().optional(),
    relevance: z.string().optional(),
  })).optional(),
  fact_check_summary: z.object({
    total_claims_verified: z.number(),
    verification_breakdown: z.object({
      verified: z.number(),
      disputed: z.number(),
      partially_verified: z.number(),
      inconclusive: z.number(),
    }),
    key_findings: z.array(z.object({
      claim: z.string(),
      status: z.string(),
      confidence: z.number().optional(),
      note: z.string().optional(),
    })),
  }).optional(),
  recommendations: z.array(z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(["low", "medium", "high"]),
    timeline: z.string().optional(),
    stakeholders: z.array(z.string()).optional(),
  })),
  appendices: z.object({
    full_debate_transcript: z.string().optional(),
    brainstorming_transcript: z.string().optional(),
    methodology_details: z.string().optional(),
    technical_specifications: z.string().optional(),
  }).optional(),
  metadata: z.object({
    generated_at: z.string(),
    session_id: z.string(),
    total_analysis_time: z.string(),
    quality_score: z.number().optional(),
    word_count: z.number().optional(),
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
export type GeneratedReport = typeof generatedReports.$inferSelect;
export type InsertGeneratedReport = z.infer<typeof insertGeneratedReportSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;
export type ThinkRequest = z.infer<typeof thinkRequestSchema>;
export type ThinkResponse = z.infer<typeof thinkResponseSchema>;
export type BrainstormResponse = z.infer<typeof brainstormResponseSchema>;
export type ReportRequest = z.infer<typeof reportRequestSchema>;
export type ReportResponse = z.infer<typeof reportResponseSchema>;
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
// PHASE 3 AUTOMATION FEATURES
// ============================================

// Time tracking for automated invoicing
export const timeLogs = pgTable("time_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(),
  userId: varchar("user_id").notNull(),
  projectId: varchar("project_id"), // Optional project association
  description: text("description").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration_minutes"), // Auto-calculated
  billableRate: decimal("billable_rate", { precision: 10, scale: 2 }),
  isBillable: boolean("is_billable").default(true).notNull(),
  isInvoiced: boolean("is_invoiced").default(false).notNull(),
  tags: jsonb("tags").default([]),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("time_logs_org_user_idx").on(table.organizationId, table.userId),
  index("time_logs_billable_idx").on(table.isBillable, table.isInvoiced),
  index("time_logs_date_idx").on(table.startTime),
]);

// Automated invoice generation
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(),
  invoiceNumber: varchar("invoice_number").unique().notNull(),
  clientEmail: varchar("client_email").notNull(),
  status: varchar("status").notNull().default("draft"), // draft, sent, paid, overdue
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("USD"),
  dueDate: timestamp("due_date").notNull(),
  sentAt: timestamp("sent_at"),
  paidAt: timestamp("paid_at"),
  lineItems: jsonb("line_items").notNull(), // Time log details
  notes: text("notes"),
  paymentTerms: text("payment_terms"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("invoices_org_idx").on(table.organizationId),
  index("invoices_status_idx").on(table.status),
  index("invoices_due_date_idx").on(table.dueDate),
]);

// Smart notification system
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  organizationId: varchar("organization_id"),
  type: varchar("type").notNull(), // invoice, system, workflow, ai_analysis
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, urgent
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: varchar("action_url"),
  isRead: boolean("is_read").default(false).notNull(),
  deliveryMethods: jsonb("delivery_methods").default(["in_app"]), // in_app, email, sms
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  readAt: timestamp("read_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("notifications_user_idx").on(table.userId),
  index("notifications_unread_idx").on(table.userId, table.isRead),
  index("notifications_scheduled_idx").on(table.scheduledFor),
]);

// Notification rules for intelligent alerts
export const notificationRules = pgTable("notification_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  organizationId: varchar("organization_id"),
  name: varchar("name").notNull(),
  trigger: varchar("trigger").notNull(), // invoice_overdue, usage_limit, analysis_complete
  conditions: jsonb("conditions").notNull(), // Rule conditions
  actions: jsonb("actions").notNull(), // What to do when triggered
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("notification_rules_user_idx").on(table.userId),
  index("notification_rules_trigger_idx").on(table.trigger, table.isActive),
]);

// Workflow automation templates
export const workflowTemplates = pgTable("workflow_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // invoicing, notifications, ai_analysis, reporting
  template: jsonb("template").notNull(), // Workflow definition
  variables: jsonb("variables").default([]), // Template variables
  isPublic: boolean("is_public").default(false).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  usageCount: integer("usage_count").default(0).notNull(),
  tags: jsonb("tags").default([]),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("workflow_templates_category_idx").on(table.category),
  index("workflow_templates_public_idx").on(table.isPublic, table.rating),
  index("workflow_templates_org_idx").on(table.organizationId),
]);

// Workflow instances (executed workflows)
export const workflowInstances = pgTable("workflow_instances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull(),
  organizationId: varchar("organization_id").notNull(),
  userId: varchar("user_id").notNull(),
  status: varchar("status").notNull().default("running"), // running, completed, failed, cancelled
  input: jsonb("input"), // Input data for workflow
  output: jsonb("output"), // Generated results
  steps: jsonb("steps").default([]), // Execution steps log
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"),
}, (table) => [
  index("workflow_instances_template_idx").on(table.templateId),
  index("workflow_instances_user_idx").on(table.userId),
  index("workflow_instances_status_idx").on(table.status),
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
// SPRINT 4 - BILLING & MARKETPLACE SYSTEM
// ============================================

// Subscription management for workspaces
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  plan: varchar("plan").notNull(), // free, pro, enterprise, custom
  seats: integer("seats").notNull().default(1), // Number of licensed seats
  status: varchar("status").notNull().default("trial"), // trial, active, canceled, past_due, unpaid
  currentPeriodEnd: timestamp("current_period_end").notNull(), // When current billing period ends
  stripeSubscriptionId: varchar("stripe_subscription_id"), // For future Stripe integration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("subscriptions_workspace_idx").on(table.workspaceId),
  index("subscriptions_status_idx").on(table.status),
  index("subscriptions_period_end_idx").on(table.currentPeriodEnd),
  // Ensure only one subscription per workspace (business rule enforced in app)
  unique("subscriptions_workspace_unique").on(table.workspaceId),
]);

// Feature entitlements based on subscriptions or purchases
export const entitlements = pgTable("entitlements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  feature: varchar("feature").notNull(), // Feature identifier (e.g. "advanced_ai", "export_pdf", "custom_templates")
  subscriptionId: varchar("subscription_id").references(() => subscriptions.id, { onDelete: "cascade" }), // FK to subscriptions
  templatePurchaseId: varchar("template_purchase_id").references(() => templatePurchases.id, { onDelete: "cascade" }), // FK to template_purchases
  grantedAt: timestamp("granted_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiry for time-limited features
}, (table) => [
  index("entitlements_workspace_idx").on(table.workspaceId),
  index("entitlements_feature_idx").on(table.feature),
  index("entitlements_subscription_idx").on(table.subscriptionId),
  index("entitlements_template_purchase_idx").on(table.templatePurchaseId),
  index("entitlements_expires_idx").on(table.expiresAt),
  // Ensure unique feature per workspace
  unique("entitlements_workspace_feature_unique").on(table.workspaceId, table.feature),
  // Check constraint to ensure exactly one of subscriptionId or templatePurchaseId is non-null
  // Note: This constraint will be enforced at application level for Drizzle compatibility
]);

// Marketplace products for premium templates
export const templateProducts = pgTable("template_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Product name
  description: text("description"), // Product description
  priceCents: integer("price_cents").notNull(), // Price in cents (e.g. 999 = $9.99)
  currency: varchar("currency").notNull().default("USD"), // USD, EUR, GBP, etc.
  templateId: varchar("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }), // Reference to templates.id
  isActive: boolean("is_active").default(true).notNull(), // Whether product is available for purchase
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("template_products_template_idx").on(table.templateId),
  index("template_products_active_idx").on(table.isActive),
  index("template_products_price_idx").on(table.priceCents),
  // Ensure unique product per template
  unique("template_products_template_unique").on(table.templateId),
]);

// Track template purchases and license keys
export const templatePurchases = pgTable("template_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Reference to users.id (purchaser)
  templateProductId: varchar("template_product_id").notNull().references(() => templateProducts.id, { onDelete: "cascade" }), // Reference to template_products.id
  priceCents: integer("price_cents").notNull(), // Actual price paid (for historical records)
  currency: varchar("currency").notNull(), // Currency used for purchase
  licenseKey: varchar("license_key").unique().notNull(), // Generated license key for verification
  purchasedAt: timestamp("purchased_at").defaultNow(),
}, (table) => [
  index("template_purchases_workspace_idx").on(table.workspaceId),
  index("template_purchases_user_idx").on(table.userId),
  index("template_purchases_product_idx").on(table.templateProductId),
  index("template_purchases_license_idx").on(table.licenseKey),
  index("template_purchases_date_idx").on(table.purchasedAt),
  // Ensure unique purchase per workspace per template product
  unique("template_purchases_workspace_product_unique").on(table.workspaceId, table.templateProductId),
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


// ============================================
// PHASE 3 AUTOMATION - Zod Schemas
// ============================================

export const insertTimeLogSchema = createInsertSchema(timeLogs).pick({
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
  metadata: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
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
  paymentTerms: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  organizationId: true,
  type: true,
  priority: true,
  title: true,
  message: true,
  actionUrl: true,
  deliveryMethods: true,
  scheduledFor: true,
  metadata: true,
});

export const insertNotificationRuleSchema = createInsertSchema(notificationRules).pick({
  userId: true,
  organizationId: true,
  name: true,
  trigger: true,
  conditions: true,
  actions: true,
  isActive: true,
});

export const insertWorkflowTemplateSchema = createInsertSchema(workflowTemplates).pick({
  organizationId: true,
  name: true,
  description: true,
  category: true,
  template: true,
  variables: true,
  isPublic: true,
  tags: true,
  createdBy: true,
});

export const insertWorkflowInstanceSchema = createInsertSchema(workflowInstances).pick({
  templateId: true,
  organizationId: true,
  userId: true,
  input: true,
  metadata: true,
});

// ============================================
// SPRINT 4 BILLING & MARKETPLACE - Zod Schemas
// ============================================

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  workspaceId: true,
  plan: true,
  seats: true,
  status: true,
  currentPeriodEnd: true,
  stripeSubscriptionId: true,
});

export const insertEntitlementSchema = createInsertSchema(entitlements).pick({
  workspaceId: true,
  feature: true,
  subscriptionId: true,
  templatePurchaseId: true,
  expiresAt: true,
});

export const insertTemplateProductSchema = createInsertSchema(templateProducts).pick({
  name: true,
  description: true,
  priceCents: true,
  currency: true,
  templateId: true,
  isActive: true,
});

export const insertTemplatePurchaseSchema = createInsertSchema(templatePurchases).pick({
  workspaceId: true,
  userId: true,
  templateProductId: true,
  priceCents: true,
  currency: true,
  licenseKey: true,
});

// Billing validation schemas
export const subscriptionPlanSchema = z.enum(["free", "pro", "enterprise", "custom"]);
export const subscriptionStatusSchema = z.enum(["trial", "active", "canceled", "past_due", "unpaid"]);
export const currencySchema = z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]);
export const billingFeatureSchema = z.enum([
  "advanced_ai", "export_pdf", "custom_templates", "premium_support",
  "unlimited_sessions", "team_collaboration", "custom_branding", "sso_integration",
  "advanced_analytics", "priority_queue", "dedicated_support", "custom_workflows"
]);

// ============================================
// SPRINT 1 - Async Job Processing & Export Tracking
// ============================================

// Track async debate processing jobs
export const debateRuns = pgTable("debate_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  mode: varchar("mode").notNull(), // simple, guided, expert
  status: varchar("status").notNull().default("running"), // running, completed, failed
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Track export operations and DLP violations
export const exportLogs = pgTable("export_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  workspaceId: varchar("workspace_id"),
  filename: text("filename"),
  dlpHits: text("dlp_hits"), // JSON string of DLP pattern matches
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for Sprint 1 tables
export const insertDebateRunSchema = createInsertSchema(debateRuns).pick({
  sessionId: true,
  mode: true,
  status: true,
  startedAt: true,
  completedAt: true,
});

export const insertExportLogSchema = createInsertSchema(exportLogs).pick({
  userId: true,
  workspaceId: true,
  filename: true,
  dlpHits: true,
});

// ============================================
// PHASE 3 AUTOMATION - Type Definitions  
// ============================================

export type TimeLog = typeof timeLogs.$inferSelect;
export type InsertTimeLog = z.infer<typeof insertTimeLogSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type NotificationRule = typeof notificationRules.$inferSelect;
export type InsertNotificationRule = z.infer<typeof insertNotificationRuleSchema>;
export type WorkflowTemplate = typeof workflowTemplates.$inferSelect;
export type InsertWorkflowTemplate = z.infer<typeof insertWorkflowTemplateSchema>;
export type WorkflowInstance = typeof workflowInstances.$inferSelect;
export type InsertWorkflowInstance = z.infer<typeof insertWorkflowInstanceSchema>;

// Sprint 1 types
export type DebateRun = typeof debateRuns.$inferSelect;
export type InsertDebateRun = z.infer<typeof insertDebateRunSchema>;
export type ExportLog = typeof exportLogs.$inferSelect;
export type InsertExportLog = z.infer<typeof insertExportLogSchema>;

// Settings types
export type OrganizationSettings = z.infer<typeof organizationSettingsSchema>;
export type BillingSettings = z.infer<typeof billingSettingsSchema>;
export type Permissions = z.infer<typeof permissionsSchema>;

// Onboarding types
export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
  type: "tooltip" | "modal" | "highlight" | "tour";
  trigger?: string;
  conditions?: string[];
  action?: string;
};

export type OnboardingFlow = {
  id: string;
  name: string;
  description: string;
  target_role: "beginner" | "intermediate" | "expert" | "all";
  trigger_conditions: string[];
  steps: OnboardingStep[];
  completion_criteria: string[];
};

export type OnboardingProgress = {
  completed_steps: string[];
  current_flow: string | null;
  experience_level: "beginner" | "intermediate" | "expert";
  skipped_flows: string[];
  last_interaction: string | null;
  feature_usage: Record<string, number>;
};

// ============================================
// SPRINT 5 - REVIEWS/APPROVALS SYSTEM
// ============================================

// Main reviews table for approval workflows
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"), // Optional organization scope
  workspaceId: varchar("workspace_id"), // Optional workspace scope
  initiatorId: varchar("initiator_id").notNull(), // User who started the review
  resourceType: varchar("resource_type").notNull(), // analysis_session, report, export, template, etc.
  resourceId: varchar("resource_id").notNull(), // ID of the resource being reviewed
  reviewType: varchar("review_type").notNull(), // content, export, policy, security, quality
  title: text("title").notNull(), // Human-readable review title
  description: text("description"), // Optional description of what's being reviewed
  status: varchar("status").notNull().default("pending"), // pending, in_progress, approved, rejected, cancelled
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, urgent
  dueDate: timestamp("due_date"), // Optional deadline for review completion
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  completedAt: timestamp("completed_at"),
  completedBy: varchar("completed_by"), // User who completed the final review
  metadata: jsonb("metadata").default({}), // Review configuration and context
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("reviews_org_idx").on(table.organizationId),
  index("reviews_workspace_idx").on(table.workspaceId),
  index("reviews_initiator_idx").on(table.initiatorId),
  index("reviews_resource_idx").on(table.resourceType, table.resourceId),
  index("reviews_status_idx").on(table.status),
  index("reviews_priority_idx").on(table.priority),
  index("reviews_due_date_idx").on(table.dueDate),
]);

// Individual steps in approval workflows
export const reviewSteps = pgTable("review_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").notNull(), // Parent review
  stepNumber: integer("step_number").notNull(), // Order in the approval sequence
  stepType: varchar("step_type").notNull(), // approval, review, verification, notification
  title: text("title").notNull(), // Step title
  description: text("description"), // Step description or instructions
  status: varchar("status").notNull().default("pending"), // pending, in_progress, completed, skipped
  isRequired: boolean("is_required").default(true).notNull(), // Whether this step is mandatory
  canSkip: boolean("can_skip").default(false).notNull(), // Whether this step can be skipped
  autoComplete: boolean("auto_complete").default(false).notNull(), // Whether step completes automatically
  conditions: jsonb("conditions").default({}), // Conditions that must be met to proceed
  completedAt: timestamp("completed_at"),
  completedBy: varchar("completed_by"), // User who completed this step
  skipReason: text("skip_reason"), // Reason if step was skipped
  metadata: jsonb("metadata").default({}), // Step-specific configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("review_steps_review_idx").on(table.reviewId),
  index("review_steps_order_idx").on(table.reviewId, table.stepNumber),
  index("review_steps_status_idx").on(table.status),
  index("review_steps_type_idx").on(table.stepType),
]);

// Assignments of reviewers to specific reviews/steps
export const reviewAssignments = pgTable("review_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").notNull(), // Parent review
  stepId: varchar("step_id"), // Optional specific step (null = applies to entire review)
  assigneeId: varchar("assignee_id").notNull(), // User assigned to review
  assigneeType: varchar("assignee_type").notNull().default("user"), // user, team, role
  assignerRole: varchar("assigner_role").notNull(), // approver, reviewer, observer, required_signer
  isRequired: boolean("is_required").default(true).notNull(), // Whether this person's approval is required
  canDelegate: boolean("can_delegate").default(false).notNull(), // Whether assignee can delegate to others
  delegatedTo: varchar("delegated_to"), // User this assignment was delegated to
  status: varchar("status").notNull().default("assigned"), // assigned, accepted, completed, declined, delegated
  response: varchar("response"), // approve, reject, request_changes, no_objection
  responseReason: text("response_reason"), // Explanation for the response
  respondedAt: timestamp("responded_at"),
  assignedAt: timestamp("assigned_at").defaultNow(),
  notifiedAt: timestamp("notified_at"), // When assignee was notified
  metadata: jsonb("metadata").default({}), // Assignment-specific data
}, (table) => [
  index("review_assignments_review_idx").on(table.reviewId),
  index("review_assignments_step_idx").on(table.stepId),
  index("review_assignments_assignee_idx").on(table.assigneeId),
  index("review_assignments_status_idx").on(table.status),
  index("review_assignments_role_idx").on(table.assignerRole),
]);

// Comments and feedback during review processes
export const reviewComments = pgTable("review_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").notNull(), // Parent review
  stepId: varchar("step_id"), // Optional specific step
  assignmentId: varchar("assignment_id"), // Optional specific assignment
  authorId: varchar("author_id").notNull(), // User who wrote the comment
  commentType: varchar("comment_type").notNull().default("comment"), // comment, question, suggestion, objection, approval_note
  content: text("content").notNull(), // Comment content
  isInternal: boolean("is_internal").default(false).notNull(), // Whether comment is internal to reviewers
  isResolved: boolean("is_resolved").default(false).notNull(), // Whether comment/issue is resolved
  resolvedBy: varchar("resolved_by"), // User who marked as resolved
  resolvedAt: timestamp("resolved_at"),
  parentCommentId: varchar("parent_comment_id"), // For threaded conversations
  attachments: jsonb("attachments").default([]), // File attachments
  metadata: jsonb("metadata").default({}), // Comment metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("review_comments_review_idx").on(table.reviewId),
  index("review_comments_step_idx").on(table.stepId),
  index("review_comments_assignment_idx").on(table.assignmentId),
  index("review_comments_author_idx").on(table.authorId),
  index("review_comments_type_idx").on(table.commentType),
  index("review_comments_parent_idx").on(table.parentCommentId),
  index("review_comments_resolved_idx").on(table.isResolved),
]);

// ============================================
// SPRINT 5 - RETENTION/LEGAL HOLD SYSTEM
// ============================================

// Data retention policies and rules
export const retentionPolicies = pgTable("retention_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Organization that owns this policy
  name: varchar("name").notNull(), // Policy name
  description: text("description"), // Policy description
  dataType: varchar("data_type").notNull(), // analysis_sessions, reports, exports, chat_messages, etc.
  retentionPeriodDays: integer("retention_period_days").notNull(), // How long to keep data
  gracePeriodDays: integer("grace_period_days").default(30).notNull(), // Grace period before deletion
  isActive: boolean("is_active").default(true).notNull(), // Whether policy is active
  priority: integer("priority").default(0).notNull(), // Policy priority (higher wins)
  conditions: jsonb("conditions").default({}), // Conditions for when this policy applies
  actions: jsonb("actions").default({}), // Actions to take when retention period expires
  exemptions: jsonb("exemptions").default([]), // Conditions that exempt data from this policy
  lastRunAt: timestamp("last_run_at"), // When policy was last executed
  nextRunAt: timestamp("next_run_at"), // When policy should run next
  createdBy: varchar("created_by").notNull(), // User who created the policy
  approvedBy: varchar("approved_by"), // User who approved the policy (if required)
  approvedAt: timestamp("approved_at"),
  metadata: jsonb("metadata").default({}), // Additional policy configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("retention_policies_org_idx").on(table.organizationId),
  index("retention_policies_data_type_idx").on(table.dataType),
  index("retention_policies_active_idx").on(table.isActive),
  index("retention_policies_next_run_idx").on(table.nextRunAt),
  index("retention_policies_priority_idx").on(table.priority),
]);

// Legal hold orders that override retention policies
export const legalHolds = pgTable("legal_holds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Organization under legal hold
  name: varchar("name").notNull(), // Legal hold name/identifier
  description: text("description"), // Description of the legal matter
  holdType: varchar("hold_type").notNull(), // litigation, investigation, audit, regulatory
  status: varchar("status").notNull().default("active"), // active, released, pending, suspended
  custodians: jsonb("custodians").default([]), // List of user IDs whose data is on hold
  dataTypes: jsonb("data_types").default([]), // Types of data covered by hold
  dateRangeStart: timestamp("date_range_start"), // Start date for data coverage
  dateRangeEnd: timestamp("date_range_end"), // End date for data coverage
  searchCriteria: jsonb("search_criteria").default({}), // Criteria for identifying relevant data
  legalCounsel: varchar("legal_counsel"), // Legal counsel managing this hold
  matter: varchar("matter"), // Legal matter/case identifier
  courtOrder: varchar("court_order"), // Court order reference if applicable
  releasedAt: timestamp("released_at"), // When hold was released
  releasedBy: varchar("released_by"), // User who released the hold
  releaseReason: text("release_reason"), // Reason for releasing hold
  createdBy: varchar("created_by").notNull(), // User who created the hold
  approvedBy: varchar("approved_by"), // User who approved the hold
  approvedAt: timestamp("approved_at"),
  metadata: jsonb("metadata").default({}), // Additional hold configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("legal_holds_org_idx").on(table.organizationId),
  index("legal_holds_status_idx").on(table.status),
  index("legal_holds_type_idx").on(table.holdType),
  index("legal_holds_date_range_idx").on(table.dateRangeStart, table.dateRangeEnd),
  index("legal_holds_counsel_idx").on(table.legalCounsel),
]);

// Scheduled retention and deletion jobs
export const retentionJobs = pgTable("retention_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Organization this job belongs to
  policyId: varchar("policy_id").notNull(), // Retention policy being executed
  jobType: varchar("job_type").notNull(), // scan, delete, archive, notify
  status: varchar("status").notNull().default("pending"), // pending, running, completed, failed, cancelled
  scheduledAt: timestamp("scheduled_at").notNull(), // When job is scheduled to run
  startedAt: timestamp("started_at"), // When job actually started
  completedAt: timestamp("completed_at"), // When job completed
  dataType: varchar("data_type").notNull(), // Type of data being processed
  targetCount: integer("target_count"), // Number of records to process
  processedCount: integer("processed_count").default(0).notNull(), // Number processed so far
  deletedCount: integer("deleted_count").default(0).notNull(), // Number actually deleted
  skippedCount: integer("skipped_count").default(0).notNull(), // Number skipped (legal hold, etc.)
  errorCount: integer("error_count").default(0).notNull(), // Number of errors encountered
  results: jsonb("results").default({}), // Detailed results of job execution
  errorLog: text("error_log"), // Error messages if job failed
  dryRun: boolean("dry_run").default(false).notNull(), // Whether this is a test run
  createdBy: varchar("created_by").notNull(), // User who scheduled the job
  metadata: jsonb("metadata").default({}), // Job-specific configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("retention_jobs_org_idx").on(table.organizationId),
  index("retention_jobs_policy_idx").on(table.policyId),
  index("retention_jobs_status_idx").on(table.status),
  index("retention_jobs_scheduled_idx").on(table.scheduledAt),
  index("retention_jobs_type_idx").on(table.jobType, table.dataType),
]);

// Classification of data for retention purposes
export const dataClassifications = pgTable("data_classifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Organization that owns this classification
  resourceType: varchar("resource_type").notNull(), // analysis_session, report, export, etc.
  resourceId: varchar("resource_id").notNull(), // ID of the classified resource
  classification: varchar("classification").notNull(), // public, internal, confidential, restricted, top_secret
  dataTypes: jsonb("data_types").default([]), // Types of data contained (pii, phi, financial, etc.)
  sensitivity: varchar("sensitivity").notNull().default("medium"), // low, medium, high, critical
  retentionCategory: varchar("retention_category"), // business_records, legal_documents, operational_data, etc.
  isAutomaticallyClassified: boolean("is_automatically_classified").default(false).notNull(), // Whether auto-classified
  confidenceScore: integer("confidence_score"), // Confidence in automatic classification (0-100)
  reviewRequired: boolean("review_required").default(false).notNull(), // Whether classification needs human review
  reviewedBy: varchar("reviewed_by"), // User who reviewed the classification
  reviewedAt: timestamp("reviewed_at"),
  classifiedBy: varchar("classified_by").notNull(), // User or system that classified the data
  justification: text("justification"), // Reason for this classification
  tags: jsonb("tags").default([]), // Additional classification tags
  metadata: jsonb("metadata").default({}), // Classification metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("data_classifications_org_idx").on(table.organizationId),
  index("data_classifications_resource_idx").on(table.resourceType, table.resourceId),
  index("data_classifications_classification_idx").on(table.classification),
  index("data_classifications_sensitivity_idx").on(table.sensitivity),
  index("data_classifications_category_idx").on(table.retentionCategory),
  index("data_classifications_review_idx").on(table.reviewRequired),
  // Ensure unique classification per resource
  unique("data_classifications_resource_unique").on(table.resourceType, table.resourceId),
]);

// ============================================
// SPRINT 5 - SCIM USER PROVISIONING SYSTEM
// ============================================

// SCIM-provisioned users from identity providers
export const scimUsers = pgTable("scim_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Organization this SCIM user belongs to
  externalId: varchar("external_id").notNull(), // ID from the identity provider
  scimId: varchar("scim_id").unique().notNull(), // SCIM protocol user ID
  userName: varchar("user_name").notNull(), // SCIM userName attribute
  email: varchar("email").notNull(), // Primary email address
  firstName: varchar("first_name"), // Given name
  lastName: varchar("last_name"), // Family name
  displayName: varchar("display_name"), // Display name
  active: boolean("active").default(true).notNull(), // Whether user is active
  localUserId: varchar("local_user_id"), // Linked local user account ID
  department: varchar("department"), // User's department
  title: varchar("title"), // Job title
  manager: varchar("manager"), // Manager's SCIM ID
  employeeNumber: varchar("employee_number"), // Employee ID
  costCenter: varchar("cost_center"), // Cost center
  division: varchar("division"), // Division/business unit
  customAttributes: jsonb("custom_attributes").default({}), // Additional SCIM attributes
  lastSyncAt: timestamp("last_sync_at"), // When this user was last synced
  syncStatus: varchar("sync_status").notNull().default("active"), // active, inactive, error, pending
  syncError: text("sync_error"), // Last sync error message
  provisionedAt: timestamp("provisioned_at").defaultNow(), // When user was first provisioned
  deprovisionedAt: timestamp("deprovisioned_at"), // When user was deprovisioned
  metadata: jsonb("metadata").default({}), // Additional SCIM metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  unique("scim_users_org_external_unique").on(table.organizationId, table.externalId),
]);

// SCIM groups for role and permission mapping
export const scimGroups = pgTable("scim_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Organization this group belongs to
  externalId: varchar("external_id").notNull(), // ID from the identity provider
  scimId: varchar("scim_id").unique().notNull(), // SCIM protocol group ID
  displayName: varchar("display_name").notNull(), // Group display name
  description: text("description"), // Group description
  groupType: varchar("group_type").default("role"), // role, team, department, project, custom
  mappedRole: varchar("mapped_role"), // Local role this group maps to
  mappedTeamId: varchar("mapped_team_id"), // Local team this group maps to
  permissions: jsonb("permissions").default([]), // Permissions granted by this group
  customAttributes: jsonb("custom_attributes").default({}), // Additional SCIM attributes
  lastSyncAt: timestamp("last_sync_at"), // When this group was last synced
  syncStatus: varchar("sync_status").notNull().default("active"), // active, inactive, error, pending
  syncError: text("sync_error"), // Last sync error message
  memberCount: integer("member_count").default(0).notNull(), // Cached member count
  provisionedAt: timestamp("provisioned_at").defaultNow(), // When group was first provisioned
  deprovisionedAt: timestamp("deprovisioned_at"), // When group was deprovisioned
  metadata: jsonb("metadata").default({}), // Additional SCIM metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  unique("scim_groups_org_external_unique").on(table.organizationId, table.externalId),
]);

// SCIM group membership relationships
export const scimGroupMemberships = pgTable("scim_group_memberships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(), // SCIM group ID
  userId: varchar("user_id").notNull(), // SCIM user ID
  membershipType: varchar("membership_type").notNull().default("direct"), // direct, inherited, computed
  source: varchar("source").default("scim"), // scim, manual, computed
  lastSyncAt: timestamp("last_sync_at"), // When this membership was last synced
  syncStatus: varchar("sync_status").notNull().default("active"), // active, pending, error
  syncError: text("sync_error"), // Last sync error message
  addedAt: timestamp("added_at").defaultNow(), // When membership was added
  removedAt: timestamp("removed_at"), // When membership was removed
  metadata: jsonb("metadata").default({}), // Additional membership metadata
}, (table) => [
  index("scim_group_memberships_group_idx").on(table.groupId),
  index("scim_group_memberships_user_idx").on(table.userId),
  index("scim_group_memberships_type_idx").on(table.membershipType),
  index("scim_group_memberships_sync_status_idx").on(table.syncStatus),
  index("scim_group_memberships_last_sync_idx").on(table.lastSyncAt),
  // Ensure unique membership per group-user pair
  unique("scim_group_memberships_group_user_unique").on(table.groupId, table.userId),
]);

// SCIM provisioning operation logs
export const provisioningLogs = pgTable("provisioning_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Organization this log belongs to
  operation: varchar("operation").notNull(), // create, read, update, delete, sync, bulk_import
  resourceType: varchar("resource_type").notNull(), // user, group, membership
  resourceId: varchar("resource_id"), // ID of the affected resource
  externalId: varchar("external_id"), // External ID from identity provider
  status: varchar("status").notNull(), // success, failure, partial, warning
  httpStatus: integer("http_status"), // HTTP status code
  requestId: varchar("request_id"), // Unique request identifier
  endpoint: varchar("endpoint"), // SCIM endpoint that was called
  method: varchar("method"), // HTTP method (GET, POST, PUT, PATCH, DELETE)
  requestBody: jsonb("request_body"), // SCIM request payload
  responseBody: jsonb("response_body"), // SCIM response payload
  errorCode: varchar("error_code"), // SCIM error code
  errorMessage: text("error_message"), // Error message
  processingTimeMs: integer("processing_time_ms"), // Processing time in milliseconds
  userAgent: varchar("user_agent"), // Client user agent
  ipAddress: varchar("ip_address"), // Client IP address
  batchId: varchar("batch_id"), // Batch identifier for bulk operations
  retryCount: integer("retry_count").default(0).notNull(), // Number of retries attempted
  metadata: jsonb("metadata").default({}), // Additional log metadata
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => [
  index("provisioning_logs_org_idx").on(table.organizationId),
  index("provisioning_logs_operation_idx").on(table.operation),
  index("provisioning_logs_resource_idx").on(table.resourceType, table.resourceId),
  index("provisioning_logs_status_idx").on(table.status),
  index("provisioning_logs_timestamp_idx").on(table.timestamp),
  index("provisioning_logs_request_idx").on(table.requestId),
  index("provisioning_logs_batch_idx").on(table.batchId),
  index("provisioning_logs_external_idx").on(table.externalId),
]);

// ============================================
// SPRINT 5 - ZOD SCHEMAS FOR VALIDATION
// ============================================

// Reviews/Approvals system schemas
export const insertReviewSchema = createInsertSchema(reviews).pick({
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
  metadata: true,
});

export const insertReviewStepSchema = createInsertSchema(reviewSteps).pick({
  reviewId: true,
  stepNumber: true,
  stepType: true,
  title: true,
  description: true,
  isRequired: true,
  canSkip: true,
  autoComplete: true,
  conditions: true,
  metadata: true,
});

export const insertReviewAssignmentSchema = createInsertSchema(reviewAssignments).pick({
  reviewId: true,
  stepId: true,
  assigneeId: true,
  assigneeType: true,
  assignerRole: true,
  isRequired: true,
  canDelegate: true,
  delegatedTo: true,
  metadata: true,
});

export const insertReviewCommentSchema = createInsertSchema(reviewComments).pick({
  reviewId: true,
  stepId: true,
  assignmentId: true,
  authorId: true,
  commentType: true,
  content: true,
  isInternal: true,
  parentCommentId: true,
  attachments: true,
  metadata: true,
});

// Retention/Legal Hold system schemas
export const insertRetentionPolicySchema = createInsertSchema(retentionPolicies).pick({
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
  metadata: true,
});

export const insertLegalHoldSchema = createInsertSchema(legalHolds).pick({
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
  metadata: true,
});

export const insertRetentionJobSchema = createInsertSchema(retentionJobs).pick({
  organizationId: true,
  policyId: true,
  jobType: true,
  scheduledAt: true,
  dataType: true,
  targetCount: true,
  dryRun: true,
  createdBy: true,
  metadata: true,
});

export const insertDataClassificationSchema = createInsertSchema(dataClassifications).pick({
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
  metadata: true,
});

// SCIM provisioning system schemas
export const insertScimUserSchema = createInsertSchema(scimUsers).pick({
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
  metadata: true,
});

export const insertScimGroupSchema = createInsertSchema(scimGroups).pick({
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
  metadata: true,
});

export const insertScimGroupMembershipSchema = createInsertSchema(scimGroupMemberships).pick({
  groupId: true,
  userId: true,
  membershipType: true,
  source: true,
  metadata: true,
});

export const insertProvisioningLogSchema = createInsertSchema(provisioningLogs).pick({
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
  metadata: true,
});

// ============================================
// SPRINT 6 - TEMPLATE BUILDER + WORKFLOW AUTOMATION + ORG INSIGHTS + TENANT HARDENING
// ============================================

// Workflow definitions for automation v1
export const workflowDefinitions = pgTable("workflow_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Tenant hardening
  name: text("name").notNull(), // Workflow name
  description: text("description"), // Workflow description
  triggerType: varchar("trigger_type").notNull(), // manual, scheduled, event, webhook
  triggerConfig: jsonb("trigger_config").notNull(), // Trigger configuration
  actions: jsonb("actions").notNull(), // Array of actions to execute
  isActive: boolean("is_active").default(true), // Whether workflow is active
  version: integer("version").default(1), // Version for updates
  createdBy: varchar("created_by").notNull(), // User who created workflow
  updatedBy: varchar("updated_by"), // User who last updated workflow
  settings: jsonb("settings").default({}), // Additional workflow settings
  metadata: jsonb("metadata").default({}), // Additional metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("workflow_definitions_org_idx").on(table.organizationId),
  index("workflow_definitions_trigger_idx").on(table.triggerType),
  index("workflow_definitions_active_idx").on(table.isActive),
]);

// Workflow executions for tracking runs
export const workflowExecutions = pgTable("workflow_executions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workflowDefinitionId: varchar("workflow_definition_id").notNull(), // Reference to definition
  organizationId: varchar("organization_id").notNull(), // Tenant hardening
  triggeredBy: varchar("triggered_by"), // User or system that triggered
  triggerData: jsonb("trigger_data"), // Input data for execution
  status: varchar("status").notNull().default("pending"), // pending, running, completed, failed, cancelled
  currentStep: integer("current_step").default(0), // Current action step
  totalSteps: integer("total_steps").default(0), // Total actions to execute
  results: jsonb("results").default([]), // Results from each action
  errorMessage: text("error_message"), // Error details if failed
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // Execution time in milliseconds
  metadata: jsonb("metadata").default({}), // Additional execution data
}, (table) => [
  index("workflow_executions_definition_idx").on(table.workflowDefinitionId),
  index("workflow_executions_org_idx").on(table.organizationId),
  index("workflow_executions_status_idx").on(table.status),
  index("workflow_executions_triggered_idx").on(table.triggeredBy),
]);

// Workflow events for queue processing
export const workflowEvents = pgTable("workflow_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Tenant hardening
  eventType: varchar("event_type").notNull(), // trigger_workflow, action_completed, webhook_received
  eventData: jsonb("event_data").notNull(), // Event payload
  workflowExecutionId: varchar("workflow_execution_id"), // Optional reference to execution
  status: varchar("status").notNull().default("pending"), // pending, processing, completed, failed
  retryCount: integer("retry_count").default(0), // Number of retry attempts
  processedAt: timestamp("processed_at"), // When event was processed
  errorMessage: text("error_message"), // Error details if failed
  scheduledFor: timestamp("scheduled_for"), // When to process (for delayed events)
  priority: integer("priority").default(0), // Event priority (higher = process first)
  source: varchar("source"), // Event source (webhook, manual, system)
  metadata: jsonb("metadata").default({}), // Additional event data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("workflow_events_org_idx").on(table.organizationId),
  index("workflow_events_type_idx").on(table.eventType),
  index("workflow_events_status_idx").on(table.status),
  index("workflow_events_scheduled_idx").on(table.scheduledFor),
  index("workflow_events_execution_idx").on(table.workflowExecutionId),
]);

// Organization analytics for insights dashboard
export const organizationAnalytics = pgTable("organization_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Target organization
  date: timestamp("date").notNull(), // Analytics date
  activeUsers: integer("active_users").default(0), // Daily active users
  totalSessions: integer("total_sessions").default(0), // Total analysis sessions
  templatesUsed: integer("templates_used").default(0), // Templates used count
  workflowsExecuted: integer("workflows_executed").default(0), // Workflows run
  apiCalls: integer("api_calls").default(0), // API requests made
  storageUsed: integer("storage_used").default(0), // Storage in bytes
  averageSessionDuration: integer("average_session_duration").default(0), // Duration in seconds
  topTemplates: jsonb("top_templates").default([]), // Most used templates
  topUsers: jsonb("top_users").default([]), // Most active users
  errorRate: decimal("error_rate", { precision: 5, scale: 4 }).default("0"), // Error percentage
  performance: jsonb("performance").default({}), // Performance metrics
  features: jsonb("features").default({}), // Feature usage stats
  metadata: jsonb("metadata").default({}), // Additional analytics data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("org_analytics_org_date_idx").on(table.organizationId, table.date),
  index("org_analytics_date_idx").on(table.date),
  unique("org_analytics_unique_org_date").on(table.organizationId, table.date),
]);

// Daily reports for automated insights
export const organizationDailyReports = pgTable("organization_daily_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Target organization
  reportDate: timestamp("report_date").notNull(), // Report date
  reportType: varchar("report_type").notNull().default("daily_summary"), // daily_summary, weekly_digest, monthly_review
  title: text("title").notNull(), // Report title
  summary: text("summary"), // Executive summary
  keyMetrics: jsonb("key_metrics").notNull(), // Important metrics
  insights: jsonb("insights").default([]), // Generated insights
  recommendations: jsonb("recommendations").default([]), // Action recommendations
  alerts: jsonb("alerts").default([]), // Important alerts
  charts: jsonb("charts").default([]), // Chart data for visualization
  generatedAt: timestamp("generated_at").defaultNow(),
  generatedBy: varchar("generated_by").default("system"), // User or system that generated
  status: varchar("status").notNull().default("generated"), // generated, sent, archived
  recipients: jsonb("recipients").default([]), // Who received the report
  metadata: jsonb("metadata").default({}), // Additional report data
}, (table) => [
  index("daily_reports_org_date_idx").on(table.organizationId, table.reportDate),
  index("daily_reports_type_idx").on(table.reportType),
  index("daily_reports_status_idx").on(table.status),
  unique("daily_reports_unique_org_date_type").on(table.organizationId, table.reportDate, table.reportType),
]);

// Enhanced usage metrics for detailed insights
export const enhancedUsageMetrics = pgTable("enhanced_usage_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull(), // Tenant hardening
  userId: varchar("user_id"), // Optional user tracking
  resourceType: varchar("resource_type").notNull(), // template, workflow, api, storage, analysis
  resourceId: varchar("resource_id"), // Specific resource ID
  action: varchar("action").notNull(), // create, read, update, delete, execute, download
  metricType: varchar("metric_type").notNull(), // usage, performance, billing, quota
  value: decimal("value", { precision: 10, scale: 2 }).notNull(), // Metric value
  unit: varchar("unit").notNull(), // count, seconds, bytes, requests, percentage
  tags: jsonb("tags").default([]), // Additional categorization
  dimensions: jsonb("dimensions").default({}), // Metric dimensions
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}), // Additional metric data
}, (table) => [
  index("enhanced_metrics_org_idx").on(table.organizationId),
  index("enhanced_metrics_resource_idx").on(table.resourceType, table.resourceId),
  index("enhanced_metrics_user_idx").on(table.userId),
  index("enhanced_metrics_timestamp_idx").on(table.timestamp),
  index("enhanced_metrics_org_resource_time_idx").on(table.organizationId, table.resourceType, table.timestamp),
]);

// ============================================
// SPRINT 5 - VALIDATION ENUMS
// ============================================

// Reviews/Approvals validation schemas
export const reviewStatusSchema = z.enum(["pending", "in_progress", "approved", "rejected", "cancelled"]);
export const reviewTypeSchema = z.enum(["content", "export", "policy", "security", "quality", "compliance", "legal"]);
export const reviewPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export const reviewStepTypeSchema = z.enum(["approval", "review", "verification", "notification", "checkpoint"]);
export const reviewStepStatusSchema = z.enum(["pending", "in_progress", "completed", "skipped"]);
export const reviewAssigneeTypeSchema = z.enum(["user", "team", "role", "group"]);
export const reviewAssignerRoleSchema = z.enum(["approver", "reviewer", "observer", "required_signer", "coordinator"]);
export const reviewAssignmentStatusSchema = z.enum(["assigned", "accepted", "completed", "declined", "delegated"]);
export const reviewResponseSchema = z.enum(["approve", "reject", "request_changes", "no_objection", "abstain"]);
export const reviewCommentTypeSchema = z.enum(["comment", "question", "suggestion", "objection", "approval_note", "change_request"]);

// Retention/Legal Hold validation schemas
export const retentionDataTypeSchema = z.enum(["analysis_sessions", "reports", "exports", "chat_messages", "user_data", "audit_logs", "all"]);
export const legalHoldTypeSchema = z.enum(["litigation", "investigation", "audit", "regulatory", "discovery", "compliance"]);
export const legalHoldStatusSchema = z.enum(["active", "released", "pending", "suspended", "expired"]);
export const retentionJobTypeSchema = z.enum(["scan", "delete", "archive", "notify", "classify"]);
export const retentionJobStatusSchema = z.enum(["pending", "running", "completed", "failed", "cancelled", "paused"]);
export const dataClassificationSchema = z.enum(["public", "internal", "confidential", "restricted", "top_secret"]);
export const dataSensitivitySchema = z.enum(["low", "medium", "high", "critical"]);
export const retentionCategorySchema = z.enum(["business_records", "legal_documents", "operational_data", "user_content", "system_logs", "temporary"]);

// SCIM provisioning validation schemas
export const scimSyncStatusSchema = z.enum(["active", "inactive", "error", "pending", "deprovisioned"]);
export const scimGroupTypeSchema = z.enum(["role", "team", "department", "project", "custom", "security"]);
export const scimMembershipTypeSchema = z.enum(["direct", "inherited", "computed", "manual"]);
export const scimMembershipSourceSchema = z.enum(["scim", "manual", "computed", "inherited"]);
export const provisioningOperationSchema = z.enum(["create", "read", "update", "delete", "sync", "bulk_import", "bulk_export"]);
export const provisioningResourceTypeSchema = z.enum(["user", "group", "membership", "schema", "resource_type"]);
export const provisioningStatusSchema = z.enum(["success", "failure", "partial", "warning", "timeout"]);

// ============================================
// SPRINT 5 - TYPE DEFINITIONS
// ============================================

// Reviews/Approvals system types
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type ReviewStep = typeof reviewSteps.$inferSelect;
export type InsertReviewStep = z.infer<typeof insertReviewStepSchema>;
export type ReviewAssignment = typeof reviewAssignments.$inferSelect;
export type InsertReviewAssignment = z.infer<typeof insertReviewAssignmentSchema>;
export type ReviewComment = typeof reviewComments.$inferSelect;
export type InsertReviewComment = z.infer<typeof insertReviewCommentSchema>;

// Retention/Legal Hold system types
export type RetentionPolicy = typeof retentionPolicies.$inferSelect;
export type InsertRetentionPolicy = z.infer<typeof insertRetentionPolicySchema>;
export type LegalHold = typeof legalHolds.$inferSelect;
export type InsertLegalHold = z.infer<typeof insertLegalHoldSchema>;
export type RetentionJob = typeof retentionJobs.$inferSelect;
export type InsertRetentionJob = z.infer<typeof insertRetentionJobSchema>;
export type DataClassification = typeof dataClassifications.$inferSelect;
export type InsertDataClassification = z.infer<typeof insertDataClassificationSchema>;

// SCIM provisioning system types
export type ScimUser = typeof scimUsers.$inferSelect;
export type InsertScimUser = z.infer<typeof insertScimUserSchema>;
export type ScimGroup = typeof scimGroups.$inferSelect;
export type InsertScimGroup = z.infer<typeof insertScimGroupSchema>;
export type ScimGroupMembership = typeof scimGroupMemberships.$inferSelect;
export type InsertScimGroupMembership = z.infer<typeof insertScimGroupMembershipSchema>;
export type ProvisioningLog = typeof provisioningLogs.$inferSelect;
export type InsertProvisioningLog = z.infer<typeof insertProvisioningLogSchema>;

// Sprint 5 enum types
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type ReviewType = z.infer<typeof reviewTypeSchema>;
export type ReviewPriority = z.infer<typeof reviewPrioritySchema>;
export type ReviewStepType = z.infer<typeof reviewStepTypeSchema>;
export type ReviewStepStatus = z.infer<typeof reviewStepStatusSchema>;
export type ReviewAssigneeType = z.infer<typeof reviewAssigneeTypeSchema>;
export type ReviewAssignerRole = z.infer<typeof reviewAssignerRoleSchema>;
export type ReviewAssignmentStatus = z.infer<typeof reviewAssignmentStatusSchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
export type ReviewCommentType = z.infer<typeof reviewCommentTypeSchema>;

export type RetentionDataType = z.infer<typeof retentionDataTypeSchema>;
export type LegalHoldType = z.infer<typeof legalHoldTypeSchema>;
export type LegalHoldStatus = z.infer<typeof legalHoldStatusSchema>;
export type RetentionJobType = z.infer<typeof retentionJobTypeSchema>;
export type RetentionJobStatus = z.infer<typeof retentionJobStatusSchema>;
export type DataClassificationType = z.infer<typeof dataClassificationSchema>;
export type DataSensitivity = z.infer<typeof dataSensitivitySchema>;
export type RetentionCategory = z.infer<typeof retentionCategorySchema>;

export type ScimSyncStatus = z.infer<typeof scimSyncStatusSchema>;
export type ScimGroupType = z.infer<typeof scimGroupTypeSchema>;
export type ScimMembershipType = z.infer<typeof scimMembershipTypeSchema>;
export type ScimMembershipSource = z.infer<typeof scimMembershipSourceSchema>;
export type ProvisioningOperation = z.infer<typeof provisioningOperationSchema>;
export type ProvisioningResourceType = z.infer<typeof provisioningResourceTypeSchema>;
export type ProvisioningStatus = z.infer<typeof provisioningStatusSchema>;

// ============================================
// SPRINT 6 - VALIDATION ENUMS + SCHEMAS
// ============================================

// Template Builder validation schemas
export const templateStatusSchema = z.enum(["draft", "under_review", "published", "archived"]);
export const templateCategorySchema = z.enum(["business", "technology", "education", "research", "marketing", "analysis", "automation"]);

// Workflow automation validation schemas
export const workflowTriggerTypeSchema = z.enum(["manual", "scheduled", "event", "webhook", "api"]);
export const workflowExecutionStatusSchema = z.enum(["pending", "running", "completed", "failed", "cancelled", "paused"]);
export const workflowEventTypeSchema = z.enum(["trigger_workflow", "action_completed", "webhook_received", "schedule_triggered", "manual_trigger"]);
export const workflowEventStatusSchema = z.enum(["pending", "processing", "completed", "failed", "retrying", "skipped"]);

// Organization insights validation schemas
export const reportTypeSchema = z.enum(["daily_summary", "weekly_digest", "monthly_review", "quarterly_report", "annual_summary"]);
export const reportStatusSchema = z.enum(["generated", "sent", "archived", "failed", "scheduled"]);
export const metricTypeSchema = z.enum(["usage", "performance", "billing", "quota", "efficiency", "engagement"]);
export const resourceTypeSchema = z.enum(["template", "workflow", "api", "storage", "analysis", "user", "organization"]);
export const actionTypeSchema = z.enum(["create", "read", "update", "delete", "execute", "download", "upload", "share", "export"]);

// Sprint 6 Zod schemas for validation
export const insertWorkflowDefinitionSchema = createInsertSchema(workflowDefinitions).pick({
  organizationId: true,
  name: true,
  description: true,
  triggerType: true,
  triggerConfig: true,
  actions: true,
  isActive: true,
  createdBy: true,
  settings: true,
  metadata: true,
});

export const insertWorkflowExecutionSchema = createInsertSchema(workflowExecutions).pick({
  workflowDefinitionId: true,
  organizationId: true,
  triggeredBy: true,
  triggerData: true,
  status: true,
  metadata: true,
});

export const insertWorkflowEventSchema = createInsertSchema(workflowEvents).pick({
  organizationId: true,
  eventType: true,
  eventData: true,
  workflowExecutionId: true,
  scheduledFor: true,
  priority: true,
  source: true,
  metadata: true,
});

export const insertOrganizationAnalyticsSchema = createInsertSchema(organizationAnalytics).pick({
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
  metadata: true,
});

export const insertOrganizationDailyReportSchema = createInsertSchema(organizationDailyReports).pick({
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
  metadata: true,
});

export const insertEnhancedUsageMetricSchema = createInsertSchema(enhancedUsageMetrics).pick({
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
  metadata: true,
});

// Enhanced template schema with Sprint 6 fields
export const insertTemplateSchema = createInsertSchema(templates).pick({
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
  metadata: true,
});

// ============================================
// SPRINT 6 - TYPE DEFINITIONS
// ============================================

// Template Builder types
export type TemplateStatus = z.infer<typeof templateStatusSchema>;
export type TemplateCategory = z.infer<typeof templateCategorySchema>;

// Workflow automation types
export type WorkflowDefinition = typeof workflowDefinitions.$inferSelect;
export type InsertWorkflowDefinition = z.infer<typeof insertWorkflowDefinitionSchema>;
export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type InsertWorkflowExecution = z.infer<typeof insertWorkflowExecutionSchema>;
export type WorkflowEvent = typeof workflowEvents.$inferSelect;
export type InsertWorkflowEvent = z.infer<typeof insertWorkflowEventSchema>;
export type WorkflowTriggerType = z.infer<typeof workflowTriggerTypeSchema>;
export type WorkflowExecutionStatus = z.infer<typeof workflowExecutionStatusSchema>;
export type WorkflowEventType = z.infer<typeof workflowEventTypeSchema>;
export type WorkflowEventStatus = z.infer<typeof workflowEventStatusSchema>;

// Organization insights types
export type OrganizationAnalytics = typeof organizationAnalytics.$inferSelect;
export type InsertOrganizationAnalytics = z.infer<typeof insertOrganizationAnalyticsSchema>;
export type OrganizationDailyReport = typeof organizationDailyReports.$inferSelect;
export type InsertOrganizationDailyReport = z.infer<typeof insertOrganizationDailyReportSchema>;
export type EnhancedUsageMetric = typeof enhancedUsageMetrics.$inferSelect;
export type InsertEnhancedUsageMetric = z.infer<typeof insertEnhancedUsageMetricSchema>;
export type ReportType = z.infer<typeof reportTypeSchema>;
export type ReportStatus = z.infer<typeof reportStatusSchema>;
export type MetricType = z.infer<typeof metricTypeSchema>;
export type ResourceType = z.infer<typeof resourceTypeSchema>;
export type ActionType = z.infer<typeof actionTypeSchema>;

