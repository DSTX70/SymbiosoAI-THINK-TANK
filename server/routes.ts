import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { thinkRequestSchema, type ThinkResponse } from "@shared/schema";
import { runMultiAgentDebate } from "../client/src/lib/ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Think API - Multi-agent AI debate endpoint
  app.post("/api/think", async (req, res) => {
    try {
      const validatedData = thinkRequestSchema.parse(req.body);
      const startTime = Date.now();

      // Create session record
      const session = await storage.createSession({
        prompt: validatedData.prompt,
        mode: validatedData.mode,
        settings: validatedData,
      });

      // Run multi-agent AI debate
      const debateResult = await runMultiAgentDebate(validatedData.prompt, validatedData);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Calculate telemetry
      const telemetry = {
        avg_ms: duration,
        quality: Math.min(5.0, Math.max(1.0, 4.5 + (Math.random() - 0.5) * 0.4)), // Simulated quality score
        tps: Math.round(1000 / duration * 10), // Tokens per second estimate
        active_agents: validatedData.mode === "guided" ? 4 : 3,
      };

      const response: ThinkResponse = {
        consensus: debateResult.consensus,
        dissents: debateResult.dissents,
        unresolved: debateResult.unresolved,
        telemetry,
        citations: debateResult.citations,
      };

      // Update session with results
      await storage.updateSession(session.id, {
        results: response,
        telemetry,
      });

      res.json(response);
    } catch (error: any) {
      console.error("Think API error:", error);
      res.status(400).json({ 
        message: error.message || "Failed to process thinking request",
        error: error.name || "ProcessingError"
      });
    }
  });

  // Get sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getUserSessions();
      res.json(sessions);
    } catch (error: any) {
      console.error("Sessions API error:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Get specific session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error: any) {
      console.error("Session API error:", error);
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
