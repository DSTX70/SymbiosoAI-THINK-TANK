import type { Express, Request, Response } from "express";
import { connectionManager } from "../services/ConnectionManager";
import { workspaceSyncService } from "../services/WorkspaceSyncService";
import { storage } from "../storage";
import { requireAuth } from "../middleware/rbac";
import express from "express";

/**
 * Setup SSE headers for workspace synchronization
 */
function setupWorkspaceSSE(res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable nginx buffering
    'Transfer-Encoding': 'chunked'
  });
  
  // Send initial heartbeat to establish connection
  res.write(`event: heartbeat\n`);
  res.write(`data: ${JSON.stringify({ timestamp: Date.now(), status: 'connected' })}\n\n`);
}

/**
 * Register workspace synchronization routes
 */
export function registerWorkspaceSyncRoutes(app: Express) {
  console.log('🔗 Registering workspace sync routes...');

  // SSE endpoint for workspace events
  app.get('/api/workspace/:workspaceId/events', requireAuth, async (req: any, res: Response) => {
    const { workspaceId } = req.params;
    const userId = req.user?.id || req.user?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      // Verify user has access to workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }

      // Check if user is workspace member or owner
      const membership = await storage.getUserWorkspaceMembership(workspaceId, userId);
      if (!membership && workspace.ownerId !== userId) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      // Setup SSE headers
      setupWorkspaceSSE(res);

      // Get client information
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection.remoteAddress;

      // Add connection to manager
      const connectionId = await connectionManager.addConnection(
        workspaceId,
        userId,
        res,
        userAgent,
        ipAddress
      );

      // Broadcast user joined event
      await workspaceSyncService.broadcastUserActivity(
        workspaceId,
        userId,
        'joined',
        { connectionId, userAgent }
      );

      // Send recent events to catch up the client
      try {
        const lastEventId = req.headers['last-event-id'];
        let events: any[] = [];
        
        if (lastEventId) {
          // Client reconnection - send events since last received
          const lastSequenceNumber = parseInt(lastEventId);
          if (!isNaN(lastSequenceNumber)) {
            events = await workspaceSyncService.getWorkspaceEventsSince(workspaceId, lastSequenceNumber);
          }
        } else {
          // New connection - send recent events
          events = await workspaceSyncService.getWorkspaceEventHistory(workspaceId, 10);
          events.reverse(); // Send oldest first
        }
        
        for (const event of events) {
          res.write(`id: ${event.sequenceNumber}\n`);
          res.write(`event: workspace_${event.eventType}\n`);
          res.write(`data: ${JSON.stringify({
            id: event.id,
            eventType: event.eventType,
            eventData: event.eventData,
            userId: event.userId,
            sessionId: event.sessionId,
            timestamp: event.createdAt,
            sequenceNumber: event.sequenceNumber,
            metadata: event.metadata
          })}\n\n`);
        }
      } catch (error) {
        console.error('Failed to send recent events:', error);
      }

      // Handle client disconnect - with guard to prevent duplicate execution
      let cleanupCalled = false;
      const cleanup = async () => {
        if (cleanupCalled) return;
        cleanupCalled = true;
        
        try {
          await connectionManager.removeConnection(connectionId);
          await workspaceSyncService.broadcastUserActivity(
            workspaceId,
            userId,
            'left',
            { connectionId }
          );
        } catch (error) {
          console.error('Error during SSE cleanup:', error);
        }
      };

      // Setup disconnect handlers
      req.on('close', cleanup);
      req.on('end', cleanup);
      res.on('close', cleanup);
      res.on('finish', cleanup);

      // Send periodic heartbeats to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          if (!res.writableEnded && !res.destroyed) {
            res.write(`event: heartbeat\n`);
            res.write(`data: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
            connectionManager.updateConnectionPing(connectionId);
          } else {
            clearInterval(heartbeatInterval);
          }
        } catch (error) {
          clearInterval(heartbeatInterval);
          cleanup();
        }
      }, 25000); // 25 seconds - frequent enough for proxy timeouts

      // Cleanup on connection close
      res.on('close', () => {
        clearInterval(heartbeatInterval);
      });

    } catch (error) {
      console.error('Error setting up workspace SSE:', error);
      res.status(500).json({ error: 'Failed to establish SSE connection' });
    }
  });

  // Manual event broadcasting endpoint
  app.post('/api/workspace/:workspaceId/broadcast', 
    requireAuth, 
    express.json(), 
    async (req: any, res: Response) => {
      const { workspaceId } = req.params;
      const { eventType, eventData, broadcastTo } = req.body;
      const userId = req.user?.id || req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      try {
        // Verify user has access to workspace
        const workspace = await storage.getWorkspace(workspaceId);
        if (!workspace) {
          return res.status(404).json({ error: 'Workspace not found' });
        }

        // Check if user is workspace member or owner
        const membership = await storage.getUserWorkspaceMembership(workspaceId, userId);
        if (!membership && workspace.ownerId !== userId) {
          return res.status(403).json({ error: 'Access denied to workspace' });
        }

        // Create and broadcast event
        const event = await workspaceSyncService.createAndBroadcastEvent(
          workspaceId,
          eventType,
          eventData,
          userId,
          undefined,
          broadcastTo
        );

        res.json({ 
          success: true, 
          eventId: event.id,
          sequenceNumber: event.sequenceNumber
        });
      } catch (error) {
        console.error('Error broadcasting workspace event:', error);
        res.status(500).json({ error: 'Failed to broadcast event' });
      }
    }
  );

  // Get active connections for workspace
  app.get('/api/workspace/:workspaceId/connections', requireAuth, async (req: any, res: Response) => {
    const { workspaceId } = req.params;
    const userId = req.user?.id || req.user?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      // Verify user has access to workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }

      // Check if user is workspace member or owner
      const membership = await storage.getUserWorkspaceMembership(workspaceId, userId);
      if (!membership && workspace.ownerId !== userId) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      // Get active users and connection stats
      const activeData = await workspaceSyncService.getActiveUsers(workspaceId);
      const connectionStats = connectionManager.getWorkspaceStats(workspaceId);

      res.json({
        workspace: {
          id: workspaceId,
          name: workspace.name
        },
        activeUsers: activeData.activeUsers,
        connectionStats: {
          totalConnections: connectionStats.totalConnections,
          uniqueUsers: connectionStats.uniqueUsers,
          connectionsByUser: connectionStats.connectionsByUser
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching workspace connections:', error);
      res.status(500).json({ error: 'Failed to fetch connection status' });
    }
  });

  // Get workspace event history
  app.get('/api/workspace/:workspaceId/events/history', requireAuth, async (req: any, res: Response) => {
    const { workspaceId } = req.params;
    const { limit = 50, offset = 0, since } = req.query;
    const userId = req.user?.id || req.user?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      // Verify user has access to workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({ error: 'Workspace not found' });
      }

      // Check if user is workspace member or owner
      const membership = await storage.getUserWorkspaceMembership(workspaceId, userId);
      if (!membership && workspace.ownerId !== userId) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      let events;
      if (since) {
        // Get events since specific sequence number
        events = await workspaceSyncService.getWorkspaceEventsSince(workspaceId, parseInt(since));
      } else {
        // Get paginated event history
        events = await workspaceSyncService.getWorkspaceEventHistory(
          workspaceId, 
          parseInt(limit), 
          parseInt(offset)
        );
      }

      res.json({
        events,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: events.length
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching workspace event history:', error);
      res.status(500).json({ error: 'Failed to fetch event history' });
    }
  });

  // Health check endpoint
  app.get('/api/workspace/sync/health', (req: Request, res: Response) => {
    const stats = {
      totalConnections: Array.from(connectionManager['connections'].keys()).length,
      totalWorkspaces: Array.from(connectionManager['workspaceConnections'].keys()).length,
      timestamp: new Date().toISOString()
    };

    res.json({
      status: 'healthy',
      service: 'workspace-sync',
      stats,
      version: '1.0.0'
    });
  });

  console.log('✅ Workspace sync routes registered successfully');
}