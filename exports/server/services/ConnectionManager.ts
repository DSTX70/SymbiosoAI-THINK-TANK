import type { Response } from "express";
import type { WorkspaceConnection, InsertWorkspaceConnection } from "@shared/schema";
import { storage } from "../storage";
import { randomUUID } from "crypto";

interface SSEConnection {
  id: string;
  workspaceId: string;
  userId: string;
  response: Response;
  lastPing: Date;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * ConnectionManager - Manages SSE connections for workspace synchronization
 * Handles connection lifecycle, cleanup, and broadcasting
 */
export class ConnectionManager {
  private connections: Map<string, SSEConnection> = new Map();
  private workspaceConnections: Map<string, Set<string>> = new Map(); // workspaceId -> connectionIds
  private userConnections: Map<string, Set<string>> = new Map(); // userId -> connectionIds
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up stale connections every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleConnections();
    }, 30000);
    
    // Send heartbeats every 60 seconds to validate connections
    setInterval(() => {
      this.sendHeartbeats();
    }, 60000);
  }

  /**
   * Add a new SSE connection to the pool
   */
  async addConnection(
    workspaceId: string,
    userId: string,
    response: Response,
    userAgent?: string,
    ipAddress?: string
  ): Promise<string> {
    const connectionId = randomUUID();
    const now = new Date();

    // Create connection object
    const connection: SSEConnection = {
      id: connectionId,
      workspaceId,
      userId,
      response,
      lastPing: now,
      userAgent,
      ipAddress
    };

    // Store in memory
    this.connections.set(connectionId, connection);

    // Update workspace connections map
    if (!this.workspaceConnections.has(workspaceId)) {
      this.workspaceConnections.set(workspaceId, new Set());
    }
    this.workspaceConnections.get(workspaceId)!.add(connectionId);

    // Update user connections map
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(connectionId);

    // Store in database
    try {
      await storage.createWorkspaceConnection({
        workspaceId,
        userId,
        connectionId,
        userAgent,
        ipAddress,
        metadata: {}
      });
    } catch (error) {
      console.error(`Failed to store connection in database:`, error);
    }

    console.log(`🔗 SSE connection added: ${connectionId} for user ${userId} in workspace ${workspaceId}`);
    return connectionId;
  }

  /**
   * Remove a connection from the pool
   */
  async removeConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const { workspaceId, userId } = connection;

    // Remove from memory maps
    this.connections.delete(connectionId);
    
    const workspaceConns = this.workspaceConnections.get(workspaceId);
    if (workspaceConns) {
      workspaceConns.delete(connectionId);
      if (workspaceConns.size === 0) {
        this.workspaceConnections.delete(workspaceId);
      }
    }

    const userConns = this.userConnections.get(userId);
    if (userConns) {
      userConns.delete(connectionId);
      if (userConns.size === 0) {
        this.userConnections.delete(userId);
      }
    }

    // Close the response if still open
    try {
      if (!connection.response.writableEnded && !connection.response.destroyed) {
        connection.response.end();
      }
    } catch (error) {
      // Response already closed
    }

    // Update database
    try {
      await storage.deactivateConnection(connectionId);
    } catch (error) {
      console.error(`Failed to deactivate connection in database:`, error);
    }

    console.log(`🔗 SSE connection removed: ${connectionId} for user ${userId} in workspace ${workspaceId}`);
  }

  /**
   * Update connection ping timestamp
   */
  async updateConnectionPing(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.lastPing = new Date();
      
      // Update database
      try {
        await storage.updateConnectionPing(connectionId);
      } catch (error) {
        console.error(`Failed to update connection ping:`, error);
      }
    }
  }

  /**
   * Get all active connections for a workspace
   */
  getWorkspaceConnections(workspaceId: string): SSEConnection[] {
    const connectionIds = this.workspaceConnections.get(workspaceId) || new Set();
    return Array.from(connectionIds)
      .map(id => this.connections.get(id))
      .filter(conn => conn !== undefined) as SSEConnection[];
  }

  /**
   * Get all active connections for a user in a workspace
   */
  getUserConnections(workspaceId: string, userId: string): SSEConnection[] {
    return this.getWorkspaceConnections(workspaceId)
      .filter(conn => conn.userId === userId);
  }

  /**
   * Send SSE event to specific connection
   */
  sendToConnection(connectionId: string, eventType: string, data: any): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection) return false;

    // Validate connection before sending
    if (!this.isConnectionValid(connection)) {
      this.removeConnection(connectionId);
      return false;
    }

    try {
      const response = connection.response;
      // Include sequence number as SSE id for resumption
      if (data.sequenceNumber) {
        response.write(`id: ${data.sequenceNumber}\n`);
      }
      response.write(`event: ${eventType}\n`);
      response.write(`data: ${JSON.stringify(data)}\n\n`);
      
      // Update last ping on successful send
      connection.lastPing = new Date();
      return true;
    } catch (error) {
      console.error(`Failed to send SSE event to connection ${connectionId}:`, error);
      // Remove the connection if it's no longer valid
      this.removeConnection(connectionId);
      return false;
    }
  }

  /**
   * Broadcast event to all connections in a workspace
   */
  broadcastToWorkspace(workspaceId: string, eventType: string, data: any, excludeUserId?: string): number {
    const connections = this.getWorkspaceConnections(workspaceId);
    let successCount = 0;

    for (const connection of connections) {
      if (excludeUserId && connection.userId === excludeUserId) {
        continue;
      }

      if (this.sendToConnection(connection.id, eventType, data)) {
        successCount++;
      }
    }

    console.log(`📡 Broadcast to workspace ${workspaceId}: ${eventType} sent to ${successCount}/${connections.length} connections`);
    return successCount;
  }

  /**
   * Broadcast event to specific users in a workspace
   */
  broadcastToUsers(workspaceId: string, userIds: string[], eventType: string, data: any): number {
    const connections = this.getWorkspaceConnections(workspaceId);
    let successCount = 0;

    for (const connection of connections) {
      if (userIds.includes(connection.userId)) {
        if (this.sendToConnection(connection.id, eventType, data)) {
          successCount++;
        }
      }
    }

    console.log(`📡 Broadcast to users ${userIds.join(', ')} in workspace ${workspaceId}: ${eventType} sent to ${successCount} connections`);
    return successCount;
  }

  /**
   * Get workspace statistics
   */
  getWorkspaceStats(workspaceId: string): {
    totalConnections: number;
    uniqueUsers: number;
    connectionsByUser: { userId: string; connections: number }[];
  } {
    const connections = this.getWorkspaceConnections(workspaceId);
    const userConnectionCounts = new Map<string, number>();

    for (const connection of connections) {
      const count = userConnectionCounts.get(connection.userId) || 0;
      userConnectionCounts.set(connection.userId, count + 1);
    }

    return {
      totalConnections: connections.length,
      uniqueUsers: userConnectionCounts.size,
      connectionsByUser: Array.from(userConnectionCounts.entries()).map(([userId, connections]) => ({
        userId,
        connections
      }))
    };
  }

  /**
   * Send heartbeat to all active connections to validate they're still alive
   */
  private sendHeartbeats(): void {
    let successCount = 0;
    let failureCount = 0;
    
    for (const [connectionId, connection] of this.connections.entries()) {
      try {
        const response = connection.response;
        if (!response.writableEnded && !response.destroyed) {
          response.write(`event: heartbeat\n`);
          response.write(`data: ${JSON.stringify({ timestamp: Date.now(), status: 'alive' })}\n\n`);
          connection.lastPing = new Date();
          successCount++;
        } else {
          // Connection is dead, mark for cleanup
          this.removeConnection(connectionId);
          failureCount++;
        }
      } catch (error) {
        // Connection failed, mark for cleanup
        this.removeConnection(connectionId);
        failureCount++;
      }
    }
    
    if (successCount > 0 || failureCount > 0) {
      console.log(`💓 Heartbeat: ${successCount} alive, ${failureCount} removed`);
    }
  }

  /**
   * Validate connection before sending events
   */
  private isConnectionValid(connection: SSEConnection): boolean {
    try {
      const response = connection.response;
      return !response.writableEnded && !response.destroyed && response.writable;
    } catch {
      return false;
    }
  }

  /**
   * Clean up stale connections (older than 5 minutes without ping)
   */
  private async cleanupStaleConnections(): Promise<void> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const staleConnections: string[] = [];

    for (const [connectionId, connection] of Array.from(this.connections.entries())) {
      if (connection.lastPing < fiveMinutesAgo) {
        staleConnections.push(connectionId);
      }
    }

    for (const connectionId of staleConnections) {
      await this.removeConnection(connectionId);
    }

    if (staleConnections.length > 0) {
      console.log(`🧹 Cleaned up ${staleConnections.length} stale SSE connections`);
    }

    // Also clean up database stale connections
    try {
      const cleaned = await storage.cleanupStaleConnections(5); // 5 minutes
      if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} stale database connections`);
      }
    } catch (error) {
      console.error(`Failed to cleanup stale database connections:`, error);
    }
  }

  /**
   * Cleanup on shutdown
   */
  async shutdown(): Promise<void> {
    clearInterval(this.cleanupInterval);
    
    // Close all active connections
    const allConnections = Array.from(this.connections.keys());
    for (const connectionId of allConnections) {
      await this.removeConnection(connectionId);
    }

    console.log(`🔗 ConnectionManager shutdown complete`);
  }
}

// Export singleton instance
export const connectionManager = new ConnectionManager();