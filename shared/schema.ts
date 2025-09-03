import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  mode: text("mode").notNull(),
  settings: jsonb("settings"),
  results: jsonb("results"),
  telemetry: jsonb("telemetry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  prompt: true,
  mode: true,
  settings: true,
});

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
    "sustainability-consultant"
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
      status: z.enum(["supported", "contradicted", "inconclusive"]),
      note: z.string().optional(),
      citations: z.array(z.object({
        title: z.string().optional(),
        url: z.string().optional(),
        source: z.string().optional(),
      })).optional(),
    })),
  }).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
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
  status: "supported" | "contradicted" | "inconclusive";
  note?: string;
  citations?: Array<{title?: string; url?: string; source?: string;}>;
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
