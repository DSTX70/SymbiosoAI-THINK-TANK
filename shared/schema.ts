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
  mode: z.enum(["simple", "guided"]),
  // Simple mode options
  require_citations: z.boolean().optional(),
  enable_fact_check: z.boolean().optional(),
  temperature: z.number().min(0).max(2).optional(),
  
  // Guided mode options
  selection_mode: z.enum(["smart", "manual", "domain", "usecase"]).optional(),
  response_length: z.enum(["brief", "moderate", "detailed"]).optional(),
  turns: z.number().min(1).max(10).optional(),
  debate_format: z.enum(["round-robin", "structured", "socratic", "collaborative"]).optional(),
  require_evidence: z.boolean().optional(),
  require_counterarguments: z.boolean().optional(),
  verification: z.object({
    require_citations: z.boolean().optional(),
    fact_check: z.boolean().optional(),
    min_sources: z.number().min(0).max(10).optional(),
  }).optional(),
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
  citations: z.array(z.string()).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type ThinkRequest = z.infer<typeof thinkRequestSchema>;
export type ThinkResponse = z.infer<typeof thinkResponseSchema>;
