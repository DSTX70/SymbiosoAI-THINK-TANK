import type { 
  WorkspaceEvent, 
  InsertWorkspaceEvent, 
  WorkspaceEventType,
  DebateProgressEventData,
  UserActivityEventData,
  DocumentChangeEventData,
  AnalysisUpdateEventData,
  SystemEventData
} from "@shared/schema";
import { storage } from "../storage";
import { connectionManager } from "./ConnectionManager";
import { randomUUID } from "crypto";

/**
 * WorkspaceSyncService - Manages workspace events and real-time synchronization
 * Handles event creation, broadcasting, and persistence
 */
export class WorkspaceSyncService {
  
  /**
   * Create and broadcast a workspace event
   */
  async createAndBroadcastEvent(
    workspaceId: string,
    eventType: WorkspaceEventType,
    eventData: any,
    userId?: string,
    sessionId?: string,
    broadcastTo?: string[]
  ): Promise<WorkspaceEvent> {
    try {
      // Create event data without sequence number - let storage handle atomic generation
      const eventInsert: InsertWorkspaceEvent = {
        workspaceId,
        eventType,
        eventData,
        userId,
        sessionId,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'workspace_sync_service'
        },
        isSystem: !userId,
        broadcastTo: broadcastTo || [],
        // sequenceNumber will be generated atomically by storage
      };

      // Store event in database with atomic sequence generation
      const event = await storage.createWorkspaceEventAtomic(eventInsert);

      // Broadcast to connected clients
      await this.broadcastEvent(event, broadcastTo);

      console.log(`📢 Created and broadcast workspace event: ${eventType} in workspace ${workspaceId}`);
      return event;
    } catch (error) {
      console.error(`Failed to create and broadcast workspace event:`, error);
      throw error;
    }
  }

  /**
   * Broadcast an existing event to workspace members
   */
  async broadcastEvent(event: WorkspaceEvent, broadcastTo?: string[]): Promise<number> {
    const { workspaceId, eventType, eventData, userId } = event;

    // Prepare broadcast data
    const broadcastData = {
      id: event.id,
      eventType,
      eventData,
      userId,
      sessionId: event.sessionId,
      timestamp: event.createdAt,
      sequenceNumber: event.sequenceNumber,
      metadata: event.metadata
    };

    let successCount = 0;

    if (broadcastTo && broadcastTo.length > 0) {
      // Broadcast to specific users
      successCount = connectionManager.broadcastToUsers(
        workspaceId,
        broadcastTo,
        `workspace_${eventType}`,
        broadcastData
      );
    } else {
      // Broadcast to all workspace members (exclude the user who triggered the event to avoid echo)
      successCount = connectionManager.broadcastToWorkspace(
        workspaceId,
        `workspace_${eventType}`,
        broadcastData,
        userId || undefined
      );
    }

    return successCount;
  }

  /**
   * Broadcast debate progress event
   */
  async broadcastDebateProgress(
    workspaceId: string,
    sessionId: string,
    progress: number,
    currentRound: number,
    totalRounds: number,
    activeAgent?: string,
    consensus?: string,
    userId?: string
  ): Promise<WorkspaceEvent> {
    const eventData: DebateProgressEventData = {
      sessionId,
      progress,
      currentRound,
      totalRounds,
      activeAgent,
      consensus
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'debate_progress',
      eventData,
      userId,
      sessionId
    );
  }

  /**
   * Broadcast debate completion event
   */
  async broadcastDebateCompleted(
    workspaceId: string,
    sessionId: string,
    results: any,
    userId?: string
  ): Promise<WorkspaceEvent> {
    const eventData = {
      sessionId,
      results,
      completedAt: new Date().toISOString()
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'debate_completed',
      eventData,
      userId,
      sessionId
    );
  }

  /**
   * Broadcast user activity event
   */
  async broadcastUserActivity(
    workspaceId: string,
    userId: string,
    action: 'joined' | 'left' | 'active' | 'idle',
    metadata?: any
  ): Promise<WorkspaceEvent> {
    const eventData: UserActivityEventData = {
      action,
      timestamp: new Date().toISOString(),
      metadata
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'user_activity',
      eventData,
      userId
    );
  }

  /**
   * Broadcast document change event
   */
  async broadcastDocumentChange(
    workspaceId: string,
    documentId: string,
    changeType: 'create' | 'update' | 'delete',
    changes: any,
    version: number,
    userId?: string
  ): Promise<WorkspaceEvent> {
    const eventData: DocumentChangeEventData = {
      documentId,
      changeType,
      changes,
      version
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'document_change',
      eventData,
      userId
    );
  }

  /**
   * Broadcast analysis update event
   */
  async broadcastAnalysisUpdate(
    workspaceId: string,
    sessionId: string,
    analysisType: string,
    results: any,
    progress?: number,
    userId?: string
  ): Promise<WorkspaceEvent> {
    const eventData: AnalysisUpdateEventData = {
      sessionId,
      analysisType,
      results,
      progress
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'analysis_update',
      eventData,
      userId,
      sessionId
    );
  }

  /**
   * Broadcast template progress event
   */
  async broadcastTemplateProgress(
    workspaceId: string,
    sessionId: string,
    templateId: string,
    progress: number,
    currentStep?: string,
    userId?: string
  ): Promise<WorkspaceEvent> {
    const eventData = {
      sessionId,
      templateId,
      progress,
      currentStep,
      timestamp: new Date().toISOString()
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'template_progress',
      eventData,
      userId,
      sessionId
    );
  }

  /**
   * Broadcast system event
   */
  async broadcastSystemEvent(
    workspaceId: string,
    action: string,
    description: string,
    severity: 'info' | 'warning' | 'error',
    metadata?: any
  ): Promise<WorkspaceEvent> {
    const eventData: SystemEventData = {
      action,
      description,
      severity,
      metadata
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'system_event',
      eventData
    );
  }

  /**
   * Broadcast workspace updated event
   */
  async broadcastWorkspaceUpdated(
    workspaceId: string,
    changes: any,
    userId?: string
  ): Promise<WorkspaceEvent> {
    const eventData = {
      changes,
      updatedAt: new Date().toISOString()
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'workspace_updated',
      eventData,
      userId
    );
  }

  /**
   * Broadcast member added event
   */
  async broadcastMemberAdded(
    workspaceId: string,
    newMemberId: string,
    newMemberRole: string,
    addedByUserId: string
  ): Promise<WorkspaceEvent> {
    const eventData = {
      newMemberId,
      newMemberRole,
      addedByUserId,
      timestamp: new Date().toISOString()
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'member_added',
      eventData,
      addedByUserId
    );
  }

  /**
   * Broadcast member removed event
   */
  async broadcastMemberRemoved(
    workspaceId: string,
    removedMemberId: string,
    removedByUserId: string
  ): Promise<WorkspaceEvent> {
    const eventData = {
      removedMemberId,
      removedByUserId,
      timestamp: new Date().toISOString()
    };

    return this.createAndBroadcastEvent(
      workspaceId,
      'member_removed',
      eventData,
      removedByUserId
    );
  }

  /**
   * Get workspace event history
   */
  async getWorkspaceEventHistory(
    workspaceId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<WorkspaceEvent[]> {
    return storage.getWorkspaceEvents(workspaceId, limit, offset);
  }

  /**
   * Get workspace events since a specific sequence number
   */
  async getWorkspaceEventsSince(
    workspaceId: string,
    sequenceNumber: number
  ): Promise<WorkspaceEvent[]> {
    return storage.getWorkspaceEventsSince(workspaceId, sequenceNumber);
  }

  /**
   * Clean up old workspace events
   */
  async cleanupOldEvents(workspaceId: string, olderThanDays: number = 30): Promise<number> {
    return storage.cleanupWorkspaceEvents(workspaceId, olderThanDays);
  }

  /**
   * Get active users in workspace
   */
  async getActiveUsers(workspaceId: string) {
    try {
      const activeUsers = await storage.getWorkspaceActiveUsers(workspaceId);
      const connectionStats = connectionManager.getWorkspaceStats(workspaceId);
      
      return {
        activeUsers,
        totalConnections: connectionStats.totalConnections,
        uniqueUsers: connectionStats.uniqueUsers,
        connectionsByUser: connectionStats.connectionsByUser
      };
    } catch (error) {
      console.error(`Failed to get active users for workspace ${workspaceId}:`, error);
      return {
        activeUsers: [],
        totalConnections: 0,
        uniqueUsers: 0,
        connectionsByUser: []
      };
    }
  }

  /**
   * Check if user is active in workspace
   */
  async isUserActive(workspaceId: string, userId: string): Promise<boolean> {
    try {
      return await storage.isUserActiveInWorkspace(workspaceId, userId);
    } catch (error) {
      console.error(`Failed to check if user ${userId} is active in workspace ${workspaceId}:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const workspaceSyncService = new WorkspaceSyncService();