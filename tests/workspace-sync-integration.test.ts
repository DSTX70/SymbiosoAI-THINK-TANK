/**
 * Workspace Sync Integration Tests
 * 
 * Tests multi-client broadcast scenarios to ensure production readiness:
 * - Event creation order under concurrency
 * - Broadcast to all members and targeted users
 * - Last-Event-ID replay on reconnection  
 * - Cleanup on disconnect without duplication
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import EventSource from 'eventsource';
import { app } from '../server/index';
import { storage } from '../server/storage';
import { connectionManager } from '../server/services/ConnectionManager';
import { workspaceSyncService } from '../server/services/WorkspaceSyncService';

// Mock EventSource for Node.js environment
global.EventSource = EventSource as any;

describe('Workspace Sync Integration Tests', () => {
  let testWorkspaceId: string;
  let testUsers: Array<{ id: string; token: string }>;
  let sseConnections: EventSource[] = [];
  
  beforeEach(async () => {
    // Create test workspace
    const workspace = await storage.createWorkspace({
      name: 'Test Workspace',
      ownerId: 'test-owner-123'
    });
    testWorkspaceId = workspace.id;
    
    // Create test users
    testUsers = [];
    for (let i = 1; i <= 5; i++) {
      const user = await storage.upsertUser({
        id: `test-user-${i}`,
        email: `user${i}@test.com`,
        firstName: `User`,
        lastName: `${i}`
      });
      testUsers.push({ id: user.id, token: `token-${i}` });
    }
    
    // Clear any existing connections
    sseConnections = [];
  });
  
  afterEach(async () => {
    // Close all SSE connections
    sseConnections.forEach(connection => {
      connection.close();
    });
    sseConnections = [];
    
    // Clean up test data
    await storage.deleteWorkspace(testWorkspaceId);
    for (const user of testUsers) {
      // Clean up test users if needed
    }
  });

  /**
   * Test 1: Multi-Client Event Broadcasting (3-5 concurrent users)
   */
  test('should broadcast events to all connected clients', async () => {
    const receivedEvents: Array<{ userId: string; eventType: string; data: any }> = [];
    const connectionPromises: Promise<void>[] = [];
    
    // Connect 3 users to the workspace
    for (let i = 0; i < 3; i++) {
      const user = testUsers[i];
      connectionPromises.push(new Promise((resolve) => {
        const sse = new EventSource(`http://localhost:3000/api/workspace/${testWorkspaceId}/events/stream?userId=${user.id}`);
        sseConnections.push(sse);
        
        sse.onopen = () => {
          console.log(`✅ User ${user.id} connected to workspace`);
          resolve();
        };
        
        sse.addEventListener('workspace_debate_progress', (event: any) => {
          const data = JSON.parse(event.data);
          receivedEvents.push({
            userId: user.id,
            eventType: 'workspace_debate_progress',
            data
          });
        });
        
        sse.onerror = (error) => {
          console.error(`❌ SSE error for user ${user.id}:`, error);
        };
      }));
    }
    
    // Wait for all connections to establish
    await Promise.all(connectionPromises);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Allow connection setup
    
    // Broadcast a debate progress event
    await workspaceSyncService.broadcastDebateProgress(
      testWorkspaceId,
      'test-session-123',
      50, // progress
      2,  // currentRound
      4,  // totalRounds
      'ai-agent-1',
      'Discussing consensus...'
    );
    
    // Wait for events to propagate
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify all 3 users received the event
    expect(receivedEvents).toHaveLength(3);
    
    const userIds = receivedEvents.map(e => e.userId);
    expect(userIds).toContain('test-user-1');
    expect(userIds).toContain('test-user-2'); 
    expect(userIds).toContain('test-user-3');
    
    // Verify event data integrity
    receivedEvents.forEach(event => {
      expect(event.eventType).toBe('workspace_debate_progress');
      expect(event.data.eventData.progress).toBe(50);
      expect(event.data.eventData.currentRound).toBe(2);
      expect(event.data.eventData.totalRounds).toBe(4);
    });
  }, 15000);

  /**
   * Test 2: Event Creation Order Under Concurrency
   */
  test('should maintain correct event sequence under concurrent load', async () => {
    const receivedEvents: Array<{ sequenceNumber: number; eventType: string; timestamp: string }> = [];
    
    // Connect one user to monitor events
    const monitorUser = testUsers[0];
    const connectionPromise = new Promise<void>((resolve) => {
      const sse = new EventSource(`http://localhost:3000/api/workspace/${testWorkspaceId}/events/stream?userId=${monitorUser.id}`);
      sseConnections.push(sse);
      
      sse.onopen = () => resolve();
      
      // Listen to all workspace events
      ['workspace_debate_progress', 'workspace_user_activity', 'workspace_system_event'].forEach(eventType => {
        sse.addEventListener(eventType, (event: any) => {
          const data = JSON.parse(event.data);
          receivedEvents.push({
            sequenceNumber: data.sequenceNumber,
            eventType,
            timestamp: data.timestamp
          });
        });
      });
    });
    
    await connectionPromise;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create multiple concurrent events
    const eventPromises = [
      workspaceSyncService.broadcastDebateProgress(testWorkspaceId, 'session-1', 10, 1, 4),
      workspaceSyncService.broadcastUserActivity(testWorkspaceId, 'test-user-1', 'active'),
      workspaceSyncService.broadcastDebateProgress(testWorkspaceId, 'session-1', 20, 1, 4),
      workspaceSyncService.broadcastSystemEvent(testWorkspaceId, 'workspace_updated', 'Settings changed', 'info'),
      workspaceSyncService.broadcastDebateProgress(testWorkspaceId, 'session-1', 30, 2, 4),
    ];
    
    await Promise.all(eventPromises);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify sequence numbers are in correct order
    expect(receivedEvents.length).toBeGreaterThanOrEqual(5);
    
    const sequenceNumbers = receivedEvents.map(e => e.sequenceNumber);
    const sortedSequences = [...sequenceNumbers].sort((a, b) => a - b);
    
    expect(sequenceNumbers).toEqual(sortedSequences);
    
    // Verify no duplicate sequence numbers
    const uniqueSequences = new Set(sequenceNumbers);
    expect(uniqueSequences.size).toBe(sequenceNumbers.length);
  }, 15000);

  /**
   * Test 3: Targeted User Broadcasting
   */
  test('should broadcast events to specific users only', async () => {
    const receivedEvents: Array<{ userId: string; eventType: string }> = [];
    const connectionPromises: Promise<void>[] = [];
    
    // Connect 4 users to the workspace
    for (let i = 0; i < 4; i++) {
      const user = testUsers[i];
      connectionPromises.push(new Promise((resolve) => {
        const sse = new EventSource(`http://localhost:3000/api/workspace/${testWorkspaceId}/events/stream?userId=${user.id}`);
        sseConnections.push(sse);
        
        sse.onopen = () => resolve();
        
        sse.addEventListener('workspace_system_event', (event: any) => {
          receivedEvents.push({
            userId: user.id,
            eventType: 'workspace_system_event'
          });
        });
      }));
    }
    
    await Promise.all(connectionPromises);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Broadcast to specific users only (user-1 and user-3)
    await workspaceSyncService.createAndBroadcastEvent(
      testWorkspaceId,
      'system_event',
      {
        action: 'notification',
        description: 'Private message for selected users',
        severity: 'info'
      },
      undefined, // no specific userId
      undefined, // no sessionId
      ['test-user-1', 'test-user-3'] // broadcastTo specific users
    );
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify only targeted users received the event
    expect(receivedEvents).toHaveLength(2);
    
    const receivingUserIds = receivedEvents.map(e => e.userId);
    expect(receivingUserIds).toContain('test-user-1');
    expect(receivingUserIds).toContain('test-user-3');
    expect(receivingUserIds).not.toContain('test-user-2');
    expect(receivingUserIds).not.toContain('test-user-4');
  }, 15000);

  /**
   * Test 4: Last-Event-ID Replay on Reconnection
   */
  test('should replay missed events on reconnection using Last-Event-ID', async () => {
    const allEvents: Array<{ sequenceNumber: number; eventType: string }> = [];
    const reconnectEvents: Array<{ sequenceNumber: number; eventType: string }> = [];
    
    // Initial connection
    const user = testUsers[0];
    let initialSSE = new EventSource(`http://localhost:3000/api/workspace/${testWorkspaceId}/events/stream?userId=${user.id}`);
    sseConnections.push(initialSSE);
    
    const initialConnectionPromise = new Promise<void>((resolve) => {
      initialSSE.onopen = () => resolve();
      
      initialSSE.addEventListener('workspace_debate_progress', (event: any) => {
        const data = JSON.parse(event.data);
        allEvents.push({
          sequenceNumber: data.sequenceNumber,
          eventType: 'workspace_debate_progress'
        });
      });
    });
    
    await initialConnectionPromise;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Send some events while connected
    await workspaceSyncService.broadcastDebateProgress(testWorkspaceId, 'session-1', 10, 1, 4);
    await workspaceSyncService.broadcastDebateProgress(testWorkspaceId, 'session-1', 20, 1, 4);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    const lastReceivedSequence = Math.max(...allEvents.map(e => e.sequenceNumber));
    
    // Disconnect
    initialSSE.close();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Send events while disconnected
    await workspaceSyncService.broadcastDebateProgress(testWorkspaceId, 'session-1', 30, 2, 4);
    await workspaceSyncService.broadcastDebateProgress(testWorkspaceId, 'session-1', 40, 2, 4);
    
    // Reconnect with Last-Event-ID to get missed events
    const reconnectSSE = new EventSource(
      `http://localhost:3000/api/workspace/${testWorkspaceId}/events/stream?userId=${user.id}&lastEventId=${lastReceivedSequence}`
    );
    sseConnections.push(reconnectSSE);
    
    const reconnectPromise = new Promise<void>((resolve) => {
      reconnectSSE.onopen = () => resolve();
      
      reconnectSSE.addEventListener('workspace_debate_progress', (event: any) => {
        const data = JSON.parse(event.data);
        reconnectEvents.push({
          sequenceNumber: data.sequenceNumber,
          eventType: 'workspace_debate_progress'
        });
      });
    });
    
    await reconnectPromise;
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify missed events were replayed
    expect(reconnectEvents.length).toBeGreaterThanOrEqual(2);
    
    const missedSequenceNumbers = reconnectEvents.map(e => e.sequenceNumber);
    missedSequenceNumbers.forEach(seq => {
      expect(seq).toBeGreaterThan(lastReceivedSequence);
    });
  }, 20000);

  /**
   * Test 5: Connection Cleanup Without Duplication
   */
  test('should clean up connections properly without event duplication', async () => {
    const receivedEvents: Array<{ userId: string; connectionInfo: string }> = [];
    
    // Connect user multiple times (simulate multiple tabs)
    const user = testUsers[0];
    const connections: EventSource[] = [];
    
    for (let i = 0; i < 3; i++) {
      const sse = new EventSource(`http://localhost:3000/api/workspace/${testWorkspaceId}/events/stream?userId=${user.id}&connectionInfo=tab-${i}`);
      connections.push(sse);
      sseConnections.push(sse);
      
      sse.addEventListener('workspace_system_event', (event: any) => {
        receivedEvents.push({
          userId: user.id,
          connectionInfo: `tab-${i}`
        });
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Send a broadcast event
    await workspaceSyncService.broadcastSystemEvent(
      testWorkspaceId,
      'test_broadcast',
      'Test message for cleanup verification',
      'info'
    );
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify user receives event on all connections (no deduplication at connection level)
    expect(receivedEvents).toHaveLength(3);
    
    // Close 2 connections
    connections[0].close();
    connections[1].close();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear received events
    receivedEvents.length = 0;
    
    // Send another event
    await workspaceSyncService.broadcastSystemEvent(
      testWorkspaceId,
      'test_after_cleanup',
      'Test message after connection cleanup',
      'info'
    );
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify only the remaining connection receives the event
    expect(receivedEvents).toHaveLength(1);
    expect(receivedEvents[0].connectionInfo).toBe('tab-2');
  }, 20000);

  /**
   * Test 6: Concurrent Connection Management
   */
  test('should handle concurrent connections and disconnections reliably', async () => {
    const connectionCounts: number[] = [];
    
    // Monitor workspace connection count
    const monitorInterval = setInterval(async () => {
      const count = await storage.getWorkspaceConnectionsCount(testWorkspaceId);
      connectionCounts.push(count);
    }, 500);
    
    // Rapidly connect and disconnect users
    const connectionPromises: Promise<void>[] = [];
    
    for (let i = 0; i < 10; i++) {
      connectionPromises.push(new Promise(async (resolve) => {
        const user = testUsers[i % testUsers.length];
        const sse = new EventSource(`http://localhost:3000/api/workspace/${testWorkspaceId}/events/stream?userId=${user.id}&iteration=${i}`);
        
        // Random connection duration
        const duration = Math.random() * 3000 + 1000; // 1-4 seconds
        
        setTimeout(() => {
          sse.close();
          resolve();
        }, duration);
      }));
    }
    
    await Promise.all(connectionPromises);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Allow cleanup
    
    clearInterval(monitorInterval);
    
    // Verify connection count eventually returns to 0
    const finalCount = await storage.getWorkspaceConnectionsCount(testWorkspaceId);
    expect(finalCount).toBe(0);
    
    // Verify no connection count inconsistencies (should not go negative)
    connectionCounts.forEach(count => {
      expect(count).toBeGreaterThanOrEqual(0);
    });
  }, 15000);
});