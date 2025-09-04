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
