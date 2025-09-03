import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { thinkRequestSchema, type ThinkResponse, insertWorkspaceSchema } from "@shared/schema";
import { runMultiAgentDebate } from "../client/src/lib/ai-service";
import { perplexityService } from "./services/perplexity";
import { registerStreamingRoutes } from "./streaming";
import type { Citation, FactCheckFinding } from "@shared/schema";
import { 
  requireAuth, 
  optionalAuth, 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  validateRegistration, 
  validateLogin 
} from "./auth";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register SSE streaming routes
  registerStreamingRoutes(app);

  // Authentication routes
  app.post("/api/auth/register", express.json(), async (req, res) => {
    try {
      const userData = validateRegistration(req.body);
      const result = await registerUser(userData);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", express.json(), async (req, res) => {
    try {
      const credentials = validateLogin(req.body);
      const result = await loginUser(credentials);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace('Bearer ', '') || req.headers['x-auth-token'] as string;
      
      if (token) {
        await logoutUser(token);
      }
      
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await getCurrentUser(req.userId);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  // Workspace management routes
  app.get("/api/workspaces", requireAuth, async (req: any, res) => {
    try {
      const workspaces = await storage.getUserWorkspaces(req.userId);
      res.json(workspaces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workspaces", requireAuth, express.json(), async (req: any, res) => {
    try {
      const workspaceData = insertWorkspaceSchema.parse({
        ...req.body,
        ownerId: req.userId
      });
      const workspace = await storage.createWorkspace(workspaceData);
      
      // Add owner as admin member
      await storage.addWorkspaceMember({
        workspaceId: workspace.id,
        userId: req.userId,
        role: "owner"
      });
      
      res.json(workspace);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/workspaces/:id", requireAuth, async (req: any, res) => {
    try {
      const workspace = await storage.getWorkspace(req.params.id);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      
      // Check if user has access
      const membership = await storage.getUserWorkspaceMembership(workspace.id, req.userId);
      if (!membership && workspace.ownerId !== req.userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(workspace);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workspaces/join", requireAuth, express.json(), async (req: any, res) => {
    try {
      const { sessionCode } = req.body;
      if (!sessionCode) {
        return res.status(400).json({ error: "Session code is required" });
      }
      
      const workspace = await storage.getWorkspaceBySessionCode(sessionCode);
      if (!workspace) {
        return res.status(404).json({ error: "Invalid session code" });
      }
      
      // Check if user is already a member
      const existingMembership = await storage.getUserWorkspaceMembership(workspace.id, req.userId);
      if (existingMembership) {
        return res.json({ workspace, message: "Already a member" });
      }
      
      // Add user as member
      await storage.addWorkspaceMember({
        workspaceId: workspace.id,
        userId: req.userId,
        role: "member"
      });
      
      res.json({ workspace, message: "Successfully joined workspace" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/workspaces/:id/members", requireAuth, async (req: any, res) => {
    try {
      // Check access
      const membership = await storage.getUserWorkspaceMembership(req.params.id, req.userId);
      const workspace = await storage.getWorkspace(req.params.id);
      
      if (!membership && workspace?.ownerId !== req.userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const members = await storage.getWorkspaceMembers(req.params.id);
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // DEV ONLY: mock verifier to keep demos reliable
  app.post("/dev-verify", express.json(), (req, res) => {
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

      // Calculate telemetry (enhanced for Expert Mode)
      const telemetry = {
        avg_ms: duration,
        quality: Math.min(5.0, Math.max(1.0, 4.5 + (Math.random() - 0.5) * 0.4)), // Simulated quality score
        tps: Math.round(1000 / duration * 10), // Tokens per second estimate
        active_agents: validatedData.mode === "expert" ? 5 : validatedData.mode === "guided" ? 4 : 3,
        models_used: validatedData.mode === "expert" && validatedData.models ? validatedData.models : undefined,
        total_tokens: validatedData.mode === "expert" ? Math.round(duration * 0.5) : undefined, // Estimate
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
