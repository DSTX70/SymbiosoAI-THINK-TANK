import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { thinkRequestSchema, type ThinkResponse } from "@shared/schema";
import { runMultiAgentDebate } from "../client/src/lib/ai-service";
import { perplexityService } from "./services/perplexity";
import { registerStreamingRoutes } from "./streaming";
import type { Citation, FactCheckFinding } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register SSE streaming routes
  registerStreamingRoutes(app);
  
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
      
      // Enhance with live web search if enabled
      let enhancedCitations = debateResult.citations;
      let enhancedFactCheck = debateResult.fact_check;
      
      if (validatedData.live_web) {
        try {
          // Get live web citations
          if (validatedData.require_citations) {
            const webCitations = await perplexityService.searchForCitations(validatedData.prompt);
            enhancedCitations = [...(debateResult.citations || []), ...webCitations];
          }
          
          // Perform live fact-checking
          if (validatedData.enable_fact_check && debateResult.consensus) {
            const claims = extractClaims(debateResult.consensus);
            const factCheckFindings = await perplexityService.factCheck(claims);
            enhancedFactCheck = {
              findings: [...(debateResult.fact_check?.findings || []), ...factCheckFindings]
            };
          }
        } catch (error) {
          console.error("Live web enhancement failed:", error);
        }
      }
      
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
        citations: enhancedCitations,
        fact_check: enhancedFactCheck,
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

// Helper function to extract key claims from text for fact-checking
function extractClaims(text: string): string[] {
  // Simple claim extraction - split by sentences and filter meaningful ones
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 3).map(s => s.trim());
}
