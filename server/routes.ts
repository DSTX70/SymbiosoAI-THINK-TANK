import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { thinkRequestSchema, type ThinkResponse, insertWorkspaceSchema } from "@shared/schema";
import { runMultiAgentDebate } from "../client/src/lib/ai-service";
import { perplexityService } from "./services/perplexity";
import { registerStreamingRoutes } from "./streaming";
import type { Citation, FactCheckFinding } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { optionalAuth, getCurrentUser } from "./auth";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register SSE streaming routes
  registerStreamingRoutes(app);
  
  // Initialize Replit OpenID Connect authentication
  await setupAuth(app);

  // Authentication routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // User profile and preferences routes
  app.get('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  
  app.patch('/api/user/preferences', isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updatedUser = await storage.updateUserPreferences(userId, req.body);
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error updating preferences:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Workspace management routes
  app.get("/api/workspaces", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workspaces = await storage.getUserWorkspaces(userId);
      res.json(workspaces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workspaces", isAuthenticated, express.json(), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workspaceData = insertWorkspaceSchema.parse({
        ...req.body,
        ownerId: userId
      });
      const workspace = await storage.createWorkspace(workspaceData);
      
      // Add owner as admin member
      await storage.addWorkspaceMember({
        workspaceId: workspace.id,
        userId: userId,
        role: "owner"
      });
      
      res.json(workspace);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/workspaces/:id", isAuthenticated, async (req: any, res) => {
    try {
      const workspace = await storage.getWorkspace(req.params.id);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      
      const userId = req.user.claims.sub;
      // Check if user has access
      const membership = await storage.getUserWorkspaceMembership(workspace.id, userId);
      if (!membership && workspace.ownerId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(workspace);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workspaces/join", isAuthenticated, express.json(), async (req: any, res) => {
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
      // Check if user is already a member
      const existingMembership = await storage.getUserWorkspaceMembership(workspace.id, userId);
      if (existingMembership) {
        return res.json({ workspace, message: "Already a member" });
      }
      
      // Add user as member
      await storage.addWorkspaceMember({
        workspaceId: workspace.id,
        userId: userId,
        role: "member"
      });
      
      res.json({ workspace, message: "Successfully joined workspace" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/workspaces/:id/members", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Check access
      const membership = await storage.getUserWorkspaceMembership(req.params.id, userId);
      const workspace = await storage.getWorkspace(req.params.id);
      
      if (!membership && workspace?.ownerId !== userId) {
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

  // Session code management for collaboration
  app.post("/api/sessions/generate-code", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await storage.createSessionCode({
        code: sessionCode,
        createdBy: userId,
        expiresAt,
        isActive: true
      });
      
      res.json({ sessionCode, expiresAt });
    } catch (error: any) {
      console.error("Generate session code error:", error);
      res.status(500).json({ message: "Failed to generate session code" });
    }
  });

  app.post("/api/sessions/join/:code", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionCode = req.params.code.toUpperCase();
      
      const sessionInfo = await storage.getSessionCode(sessionCode);
      if (!sessionInfo || !sessionInfo.isActive || sessionInfo.expiresAt < new Date()) {
        return res.status(404).json({ message: "Invalid or expired session code" });
      }
      
      // Add user to session
      await storage.addUserToSession(sessionCode, userId);
      
      res.json({ 
        success: true, 
        sessionCode,
        createdBy: sessionInfo.createdBy,
        participants: await storage.getSessionParticipants(sessionCode)
      });
    } catch (error: any) {
      console.error("Join session error:", error);
      res.status(500).json({ message: "Failed to join session" });
    }
  });

  app.get("/api/sessions/code/:code/participants", isAuthenticated, async (req, res) => {
    try {
      const sessionCode = req.params.code.toUpperCase();
      const participants = await storage.getSessionParticipants(sessionCode);
      res.json(participants);
    } catch (error: any) {
      console.error("Get participants error:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  // Chat message routes
  app.get("/api/sessions/code/:code/chat", isAuthenticated, async (req, res) => {
    try {
      const sessionCode = req.params.code.toUpperCase();
      const messages = await storage.getChatHistory(sessionCode);
      res.json(messages);
    } catch (error: any) {
      console.error("Get chat history error:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  app.post("/api/sessions/code/:code/chat", isAuthenticated, async (req: any, res) => {
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
    } catch (error: any) {
      console.error("Save chat message error:", error);
      res.status(500).json({ message: "Failed to save message" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time collaboration
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active sessions and their participants
  const activeSessions = new Map<string, Set<WebSocket>>();
  const userSessions = new Map<WebSocket, { userId: string, sessionCode?: string }>();
  
  wss.on('connection', (ws: WebSocket, req) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'join_session':
            const { sessionCode, userId } = message;
            userSessions.set(ws, { userId, sessionCode });
            
            if (!activeSessions.has(sessionCode)) {
              activeSessions.set(sessionCode, new Set());
            }
            activeSessions.get(sessionCode)!.add(ws);
            
            // Notify other participants
            broadcastToSession(sessionCode, {
              type: 'user_joined',
              userId,
              timestamp: new Date().toISOString()
            }, ws);
            break;
            
          case 'chat_message':
            const sessionInfo = userSessions.get(ws);
            if (sessionInfo?.sessionCode) {
              broadcastToSession(sessionInfo.sessionCode, {
                type: 'chat_message',
                message: message.content,
                userId: sessionInfo.userId,
                timestamp: new Date().toISOString()
              });
            }
            break;
            
          case 'workspace_update':
            const userSession = userSessions.get(ws);
            if (userSession?.sessionCode) {
              broadcastToSession(userSession.sessionCode, {
                type: 'workspace_update',
                data: message.data,
                userId: userSession.userId,
                timestamp: new Date().toISOString()
              }, ws);
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      const sessionInfo = userSessions.get(ws);
      if (sessionInfo?.sessionCode) {
        const sessionParticipants = activeSessions.get(sessionInfo.sessionCode);
        if (sessionParticipants) {
          sessionParticipants.delete(ws);
          
          // Notify other participants
          broadcastToSession(sessionInfo.sessionCode, {
            type: 'user_left',
            userId: sessionInfo.userId,
            timestamp: new Date().toISOString()
          });
          
          // Clean up empty sessions
          if (sessionParticipants.size === 0) {
            activeSessions.delete(sessionInfo.sessionCode);
          }
        }
      }
      userSessions.delete(ws);
    });
    
    // Send connection confirmation
    ws.send(JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() }));
  });
  
  function broadcastToSession(sessionCode: string, message: any, exclude?: WebSocket) {
    const participants = activeSessions.get(sessionCode);
    if (participants) {
      const messageStr = JSON.stringify(message);
      participants.forEach(ws => {
        if (ws !== exclude && ws.readyState === WebSocket.OPEN) {
          ws.send(messageStr);
        }
      });
    }
  }
  
  return httpServer;
}

// Helper function to extract key claims from text for fact-checking
function extractClaims(text: string): string[] {
  // Simple claim extraction - split by sentences and filter meaningful ones
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 3).map(s => s.trim());
}
