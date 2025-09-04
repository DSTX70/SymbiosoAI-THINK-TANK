import { 
  type User, type InsertUser, type UpsertUser, type AnalysisSession, type InsertAnalysisSession,
  type Workspace, type InsertWorkspace, type WorkspaceMember, type InsertWorkspaceMember,
  type WorkspaceInvite, type InsertWorkspaceInvite, type UserPreferences,
  type SessionCode, type InsertSessionCode, type SessionParticipant, type InsertSessionParticipant,
  type ChatMessage, type InsertChatMessage,
  // Enterprise types
  type Organization, type InsertOrganization, type OrganizationMember, type InsertOrganizationMember,
  type Team, type InsertTeam, type TeamMember, type InsertTeamMember,
  type AuditLog, type InsertAuditLog, type SecurityEvent, type InsertSecurityEvent,
  type UsageMetric, type InsertUsageMetric, type RateLimitRule, type InsertRateLimitRule,
  type PerformanceMetric, type InsertPerformanceMetric, type ErrorLog, type InsertErrorLog,
  type HealthCheck, type InsertHealthCheck,
  users, analysisSessions, workspaces, workspaceMembers, workspaceInvites,
  sessionCodes, sessionParticipants, chatMessages,
  organizations, organizationMembers, teams, teamMembers, auditLogs, securityEvents,
  usageMetrics, rateLimitRules, performanceMetrics, errorLogs, healthChecks
} from "@shared/schema";
import { randomUUID } from "crypto";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, sql } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  // User management (Replit OpenID Connect compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPreferences(id: string, preferences: UserPreferences): Promise<User | undefined>;
  updateUserSubscription(id: string, subscription: any): Promise<User | undefined>;
  
  // Analysis session management
  createAnalysisSession(session: InsertAnalysisSession & { results?: any; telemetry?: any }): Promise<AnalysisSession>;
  getAnalysisSession(id: string): Promise<AnalysisSession | undefined>;
  updateAnalysisSession(id: string, updates: Partial<AnalysisSession>): Promise<AnalysisSession | undefined>;
  getUserAnalysisSessions(userId?: string): Promise<AnalysisSession[]>;
  
  // Workspace management
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  getWorkspaceBySessionCode(sessionCode: string): Promise<Workspace | undefined>;
  updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | undefined>;
  deleteWorkspace(id: string): Promise<boolean>;
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  generateSessionCode(): string;
  
  // Workspace membership
  addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember>;
  removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean>;
  getWorkspaceMembers(workspaceId: string): Promise<(WorkspaceMember & { user: User })[]>;
  getUserWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined>;
  getWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined>;
  updateMemberRole(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | undefined>;
  
  // Workspace invitations  
  createWorkspaceInvite(invite: InsertWorkspaceInvite): Promise<WorkspaceInvite>;
  getWorkspaceInvite(inviteCode: string): Promise<WorkspaceInvite | undefined>;
  acceptWorkspaceInvite(inviteCode: string, userId: string): Promise<WorkspaceMember | undefined>;
  getWorkspaceInvites(workspaceId: string): Promise<WorkspaceInvite[]>;

  // Session code operations for collaboration
  createSessionCode(sessionCode: InsertSessionCode): Promise<SessionCode>;
  getSessionCode(code: string): Promise<SessionCode | undefined>;
  addUserToSession(sessionCode: string, userId: string): Promise<void>;
  getSessionParticipants(sessionCode: string): Promise<SessionParticipant[]>;
  removeUserFromSession(sessionCode: string, userId: string): Promise<void>;

  // Chat message operations for team communication
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionCode: string): Promise<ChatMessage[]>;
  deleteChatMessage(messageId: string): Promise<void>;

  // ============================================
  // ENTERPRISE FEATURES - Organization Management
  // ============================================
  
  // Organization operations
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  getOrganization(id: string): Promise<Organization | undefined>;
  getOrganizationBySlug(slug: string): Promise<Organization | undefined>;
  updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined>;
  deleteOrganization(id: string): Promise<boolean>;
  getUserOrganizations(userId: string): Promise<Organization[]>;

  // Organization membership operations
  addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember>;
  removeOrganizationMember(organizationId: string, userId: string): Promise<boolean>;
  getOrganizationMembers(organizationId: string): Promise<(OrganizationMember & { user: User })[]>;
  getOrganizationMembership(organizationId: string, userId: string): Promise<OrganizationMember | undefined>;
  updateOrganizationMemberRole(organizationId: string, userId: string, role: string, permissions?: any): Promise<OrganizationMember | undefined>;

  // Team operations
  createTeam(team: InsertTeam): Promise<Team>;
  getTeam(id: string): Promise<Team | undefined>;
  updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;
  getOrganizationTeams(organizationId: string): Promise<Team[]>;
  getUserTeams(userId: string): Promise<Team[]>;

  // Team membership operations
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: string, userId: string): Promise<boolean>;
  getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]>;
  getTeamMembership(teamId: string, userId: string): Promise<TeamMember | undefined>;
  updateTeamMemberRole(teamId: string, userId: string, role: string): Promise<TeamMember | undefined>;

  // ============================================
  // ENTERPRISE FEATURES - Security & Audit
  // ============================================

  // Audit logging
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(organizationId?: string, userId?: string, limit?: number): Promise<AuditLog[]>;
  getAuditLogsByAction(action: string, organizationId?: string): Promise<AuditLog[]>;

  // Security events
  createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent>;
  getSecurityEvents(organizationId?: string, severity?: string): Promise<SecurityEvent[]>;
  resolveSecurityEvent(id: string, resolvedBy: string): Promise<SecurityEvent | undefined>;

  // ============================================
  // ENTERPRISE FEATURES - Usage & Monitoring
  // ============================================

  // Usage tracking
  recordUsageMetric(metric: InsertUsageMetric): Promise<UsageMetric>;
  getUsageMetrics(organizationId?: string, userId?: string, period?: string): Promise<UsageMetric[]>;
  getUsageByType(metricType: string, organizationId?: string): Promise<UsageMetric[]>;

  // Rate limiting
  createRateLimitRule(rule: InsertRateLimitRule): Promise<RateLimitRule>;
  getRateLimitRules(organizationId?: string): Promise<RateLimitRule[]>;
  updateRateLimitRule(id: string, updates: Partial<RateLimitRule>): Promise<RateLimitRule | undefined>;
  deleteRateLimitRule(id: string): Promise<boolean>;

  // Performance monitoring
  recordPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  getPerformanceMetrics(organizationId?: string, metricName?: string): Promise<PerformanceMetric[]>;

  // Error tracking
  recordError(error: InsertErrorLog): Promise<ErrorLog>;
  getErrorLogs(organizationId?: string, severity?: string): Promise<ErrorLog[]>;
  resolveError(id: string, resolvedBy: string): Promise<ErrorLog | undefined>;

  // Health monitoring
  recordHealthCheck(check: InsertHealthCheck): Promise<HealthCheck>;
  getHealthChecks(serviceName?: string): Promise<HealthCheck[]>;
  getLatestHealthStatus(): Promise<{ [serviceName: string]: HealthCheck }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analysisSessions: Map<string, AnalysisSession>;
  private workspaces: Map<string, Workspace>;
  private workspaceMembers: Map<string, WorkspaceMember>;
  private workspaceInvites: Map<string, WorkspaceInvite>;
  private sessionCodes: Map<string, SessionCode>;
  private sessionParticipants: Map<string, SessionParticipant>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.analysisSessions = new Map();
    this.workspaces = new Map();
    this.workspaceMembers = new Map();
    this.workspaceInvites = new Map();
    this.sessionCodes = new Map();
    this.sessionParticipants = new Map();
    this.chatMessages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }


  async upsertUser(upsertData: UpsertUser): Promise<User> {
    const existing = this.users.get(upsertData.id!);
    const now = new Date();
    
    if (existing) {
      // Update existing user
      const updated: User = {
        ...existing,
        ...upsertData,
        updatedAt: now
      };
      this.users.set(upsertData.id!, updated);
      return updated;
    } else {
      // Create new user with defaults
      const user: User = {
        id: upsertData.id!,
        email: upsertData.email || null,
        firstName: upsertData.firstName || null,
        lastName: upsertData.lastName || null,
        profileImageUrl: upsertData.profileImageUrl || null,
        role: "user",
        preferences: {
          theme: "light",
          language: "en", 
          notifications: true,
          default_model: "gpt-5",
          default_temperature: 0.7,
          auto_save: true
        },
        subscription: {
          plan: "free",
          usage_count: 0,
          monthly_limit: 10,
          reset_date: null
        },
        createdAt: now,
        updatedAt: now
      };
      this.users.set(user.id, user);
      return user;
    }
  }
  
  async updateUserPreferences(id: string, preferences: UserPreferences): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      preferences: existing.preferences ? { ...existing.preferences, ...preferences } : preferences,
      updatedAt: new Date() 
    };
    this.users.set(id, updated);
    return updated;
  }

  async updateUserSubscription(id: string, subscription: any): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      subscription: existing.subscription ? { ...existing.subscription, ...subscription } : subscription,
      updatedAt: new Date() 
    };
    this.users.set(id, updated);
    return updated;
  }

  async createAnalysisSession(sessionData: InsertAnalysisSession & { results?: any; telemetry?: any }): Promise<AnalysisSession> {
    const id = randomUUID();
    const session: AnalysisSession = {
      id,
      prompt: sessionData.prompt,
      mode: sessionData.mode,
      settings: sessionData.settings || null,
      results: sessionData.results || null,
      telemetry: sessionData.telemetry || null,
      userId: sessionData.userId || null,
      workspaceId: sessionData.workspaceId || null,
      createdAt: new Date(),
    };
    this.analysisSessions.set(id, session);
    return session;
  }

  async getAnalysisSession(id: string): Promise<AnalysisSession | undefined> {
    return this.analysisSessions.get(id);
  }

  async updateAnalysisSession(id: string, updates: Partial<AnalysisSession>): Promise<AnalysisSession | undefined> {
    const existing = this.analysisSessions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.analysisSessions.set(id, updated);
    return updated;
  }

  async getUserAnalysisSessions(userId?: string): Promise<AnalysisSession[]> {
    const allSessions = Array.from(this.analysisSessions.values());
    const filtered = userId ? allSessions.filter(s => s.userId === userId) : allSessions;
    return filtered.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Workspace management methods
  generateSessionCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async createWorkspace(workspaceData: InsertWorkspace): Promise<Workspace> {
    const id = randomUUID();
    const sessionCode = this.generateSessionCode();
    const now = new Date();
    const workspace: Workspace = {
      ...workspaceData,
      id,
      sessionCode,
      description: workspaceData.description || null,
      isPrivate: workspaceData.isPrivate || null,
      settings: workspaceData.settings || null,
      createdAt: now,
      updatedAt: now
    };
    this.workspaces.set(id, workspace);
    return workspace;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    return this.workspaces.get(id);
  }

  async getWorkspaceBySessionCode(sessionCode: string): Promise<Workspace | undefined> {
    return Array.from(this.workspaces.values()).find(w => w.sessionCode === sessionCode);
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | undefined> {
    const existing = this.workspaces.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.workspaces.set(id, updated);
    return updated;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    return this.workspaces.delete(id);
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    // Get workspaces where user is owner or member
    const memberWorkspaceIds = Array.from(this.workspaceMembers.values())
      .filter(m => m.userId === userId)
      .map(m => m.workspaceId);
    
    return Array.from(this.workspaces.values())
      .filter(w => w.ownerId === userId || memberWorkspaceIds.includes(w.id))
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  // Workspace membership methods  
  async addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember> {
    const id = randomUUID();
    const workspaceMember: WorkspaceMember = {
      ...member,
      id,
      role: member.role || "member",
      joinedAt: new Date()
    };
    this.workspaceMembers.set(id, workspaceMember);
    return workspaceMember;
  }

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = Array.from(this.workspaceMembers.values())
      .find(m => m.workspaceId === workspaceId && m.userId === userId);
    if (!member) return false;
    return this.workspaceMembers.delete(member.id);
  }

  async getWorkspaceMembers(workspaceId: string): Promise<(WorkspaceMember & { user: User })[]> {
    const members = Array.from(this.workspaceMembers.values())
      .filter(m => m.workspaceId === workspaceId);
    
    return members.map(member => {
      const user = this.users.get(member.userId)!;
      return { ...member, user };
    });
  }

  async getUserWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined> {
    return Array.from(this.workspaceMembers.values())
      .find(m => m.workspaceId === workspaceId && m.userId === userId);
  }
  
  async getWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined> {
    return Array.from(this.workspaceMembers.values())
      .find(m => m.workspaceId === workspaceId && m.userId === userId);
  }

  async updateMemberRole(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | undefined> {
    const member = Array.from(this.workspaceMembers.values())
      .find(m => m.workspaceId === workspaceId && m.userId === userId);
    if (!member) return undefined;
    member.role = role;
    this.workspaceMembers.set(member.id, member);
    return member;
  }

  // Workspace invitation methods
  async createWorkspaceInvite(invite: InsertWorkspaceInvite): Promise<WorkspaceInvite> {
    const id = randomUUID();
    const inviteCode = randomUUID().substring(0, 16);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const workspaceInvite: WorkspaceInvite = {
      ...invite,
      id,
      email: invite.email || null,
      role: invite.role || "member",
      inviteCode,
      status: "pending",
      expiresAt,
      createdAt: new Date()
    };
    this.workspaceInvites.set(id, workspaceInvite);
    return workspaceInvite;
  }

  async getWorkspaceInvite(inviteCode: string): Promise<WorkspaceInvite | undefined> {
    return Array.from(this.workspaceInvites.values())
      .find(i => i.inviteCode === inviteCode && i.status === "pending");
  }

  async acceptWorkspaceInvite(inviteCode: string, userId: string): Promise<WorkspaceMember | undefined> {
    const invite = await this.getWorkspaceInvite(inviteCode);
    if (!invite || invite.expiresAt! < new Date()) return undefined;

    // Mark invite as accepted
    invite.status = "accepted";
    this.workspaceInvites.set(invite.id, invite);

    // Add user as workspace member
    return await this.addWorkspaceMember({
      workspaceId: invite.workspaceId,
      userId,
      role: invite.role
    });
  }

  async getWorkspaceInvites(workspaceId: string): Promise<WorkspaceInvite[]> {
    return Array.from(this.workspaceInvites.values())
      .filter(i => i.workspaceId === workspaceId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Session code operations for collaboration
  async createSessionCode(sessionCode: InsertSessionCode): Promise<SessionCode> {
    const id = randomUUID();
    const code: SessionCode = {
      ...sessionCode,
      id,
      isActive: sessionCode.isActive ?? true,
      createdAt: new Date()
    };
    this.sessionCodes.set(id, code);
    return code;
  }

  async getSessionCode(code: string): Promise<SessionCode | undefined> {
    return Array.from(this.sessionCodes.values()).find(sc => sc.code === code && sc.isActive);
  }

  async addUserToSession(sessionCode: string, userId: string): Promise<void> {
    const id = randomUUID();
    const participant: SessionParticipant = {
      id,
      sessionCode,
      userId,
      role: "participant",
      joinedAt: new Date()
    };
    this.sessionParticipants.set(id, participant);
  }

  async getSessionParticipants(sessionCode: string): Promise<SessionParticipant[]> {
    return Array.from(this.sessionParticipants.values())
      .filter(p => p.sessionCode === sessionCode);
  }

  async removeUserFromSession(sessionCode: string, userId: string): Promise<void> {
    const participant = Array.from(this.sessionParticipants.values())
      .find(p => p.sessionCode === sessionCode && p.userId === userId);
    if (participant) {
      this.sessionParticipants.delete(participant.id);
    }
  }

  // Chat message operations
  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = {
      ...message,
      id,
      messageType: message.messageType || "chat",
      timestamp: new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatHistory(sessionCode: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.sessionCode === sessionCode)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }

  async deleteChatMessage(messageId: string): Promise<void> {
    this.chatMessages.delete(messageId);
  }

  // Stub implementations for enterprise features (not used in memory storage)
  async createOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationBySlug(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteOrganization(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserOrganizations(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async addOrganizationMember(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async removeOrganizationMember(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationMembers(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationMembership(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateOrganizationMemberRole(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createTeam(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTeam(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTeam(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteTeam(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getOrganizationTeams(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUserTeams(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async addTeamMember(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async removeTeamMember(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTeamMembers(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getTeamMembership(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateTeamMemberRole(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createAuditLog(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAuditLogs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getAuditLogsByAction(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createSecurityEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getSecurityEvents(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async resolveSecurityEvent(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordUsageMetric(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUsageMetrics(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getUsageByType(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async createRateLimitRule(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getRateLimitRules(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async updateRateLimitRule(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async deleteRateLimitRule(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordPerformanceMetric(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getPerformanceMetrics(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordError(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getErrorLogs(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async resolveError(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async recordHealthCheck(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getHealthChecks(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
  async getLatestHealthStatus(): Promise<any> { throw new Error('Not implemented in MemStorage'); }
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async upsertUser(upsertData: UpsertUser): Promise<User> {
    const existing = await this.getUser(upsertData.id!);
    const now = new Date();
    
    if (existing) {
      // Update existing user
      const updated = await this.updateUser(upsertData.id!, {
        email: upsertData.email,
        firstName: upsertData.firstName,
        lastName: upsertData.lastName,
        profileImageUrl: upsertData.profileImageUrl,
        updatedAt: now
      });
      return updated!;
    } else {
      // Create new user with defaults
      const newUser: InsertUser = {
        email: upsertData.email || null,
        firstName: upsertData.firstName || null,
        lastName: upsertData.lastName || null,
        profileImageUrl: upsertData.profileImageUrl || null,
        role: "user",
        preferences: {
          theme: "light",
          language: "en", 
          notifications: true,
          default_model: "gpt-5",
          default_temperature: 0.7,
          auto_save: true
        },
        subscription: {
          plan: "free",
          usage_count: 0,
          monthly_limit: 10,
          reset_date: null
        }
      };
      return await this.createUser(newUser);
    }
  }

  async updateUserPreferences(id: string, preferences: UserPreferences): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    
    return await this.updateUser(id, { 
      preferences: existing.preferences ? { ...existing.preferences, ...preferences } : preferences
    });
  }

  async updateUserSubscription(id: string, subscription: any): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    
    return await this.updateUser(id, { 
      subscription: existing.subscription ? { ...existing.subscription, ...subscription } : subscription
    });
  }

  async createAnalysisSession(sessionData: InsertAnalysisSession & { results?: any; telemetry?: any }): Promise<AnalysisSession> {
    const [session] = await db.insert(analysisSessions).values({
      prompt: sessionData.prompt,
      mode: sessionData.mode,
      settings: sessionData.settings || null,
      results: sessionData.results || null,
      telemetry: sessionData.telemetry || null,
      userId: sessionData.userId || null,
      workspaceId: sessionData.workspaceId || null
    }).returning();
    return session;
  }

  async getAnalysisSession(id: string): Promise<AnalysisSession | undefined> {
    const [session] = await db.select().from(analysisSessions).where(eq(analysisSessions.id, id));
    return session || undefined;
  }

  async updateAnalysisSession(id: string, updates: Partial<AnalysisSession>): Promise<AnalysisSession | undefined> {
    const [session] = await db.update(analysisSessions)
      .set(updates)
      .where(eq(analysisSessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserAnalysisSessions(userId?: string): Promise<AnalysisSession[]> {
    if (userId) {
      const result = await db.select().from(analysisSessions).where(eq(analysisSessions.userId, userId)).orderBy(analysisSessions.createdAt);
      return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    const result = await db.select().from(analysisSessions).orderBy(analysisSessions.createdAt);
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Workspace management methods
  generateSessionCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async createWorkspace(workspaceData: InsertWorkspace): Promise<Workspace> {
    const sessionCode = this.generateSessionCode();
    const [workspace] = await db.insert(workspaces).values({
      ...workspaceData,
      sessionCode,
    }).returning();
    return workspace;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace || undefined;
  }

  async getWorkspaceBySessionCode(sessionCode: string): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.sessionCode, sessionCode));
    return workspace || undefined;
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | undefined> {
    const [workspace] = await db.update(workspaces)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workspaces.id, id))
      .returning();
    return workspace || undefined;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    const result = await db.delete(workspaces).where(eq(workspaces.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    // Get workspaces where user is owner or member
    const result = await db
      .select({ workspace: workspaces })
      .from(workspaces)
      .leftJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        sql`${workspaces.ownerId} = ${userId} OR ${workspaceMembers.userId} = ${userId}`
      )
      .groupBy(workspaces.id);
    
    return result.map(r => r.workspace).sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  // Workspace membership methods
  async addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember> {
    const [workspaceMember] = await db.insert(workspaceMembers).values(member).returning();
    return workspaceMember;
  }

  async removeWorkspaceMember(workspaceId: string, userId: string): Promise<boolean> {
    const result = await db.delete(workspaceMembers)
      .where(sql`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`);
    return (result.rowCount || 0) > 0;
  }

  async getWorkspaceMembers(workspaceId: string): Promise<(WorkspaceMember & { user: User })[]> {
    const result = await db
      .select()
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId));
    
    return result.map(row => ({
      ...row.workspace_members,
      user: row.users
    }));
  }

  async getUserWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined> {
    const [member] = await db.select().from(workspaceMembers)
      .where(sql`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`);
    return member || undefined;
  }

  async getWorkspaceMembership(workspaceId: string, userId: string): Promise<WorkspaceMember | undefined> {
    return this.getUserWorkspaceMembership(workspaceId, userId);
  }

  async updateMemberRole(workspaceId: string, userId: string, role: string): Promise<WorkspaceMember | undefined> {
    const [member] = await db.update(workspaceMembers)
      .set({ role })
      .where(sql`${workspaceMembers.workspaceId} = ${workspaceId} AND ${workspaceMembers.userId} = ${userId}`)
      .returning();
    return member || undefined;
  }

  // Workspace invitation methods
  async createWorkspaceInvite(invite: InsertWorkspaceInvite): Promise<WorkspaceInvite> {
    const inviteCode = randomUUID().substring(0, 16);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const [workspaceInvite] = await db.insert(workspaceInvites).values({
      ...invite,
      inviteCode,
      expiresAt,
    }).returning();
    return workspaceInvite;
  }

  async getWorkspaceInvite(inviteCode: string): Promise<WorkspaceInvite | undefined> {
    const [invite] = await db.select().from(workspaceInvites)
      .where(sql`${workspaceInvites.inviteCode} = ${inviteCode} AND ${workspaceInvites.status} = 'pending'`);
    return invite || undefined;
  }

  async acceptWorkspaceInvite(inviteCode: string, userId: string): Promise<WorkspaceMember | undefined> {
    const invite = await this.getWorkspaceInvite(inviteCode);
    if (!invite || invite.expiresAt! < new Date()) return undefined;

    // Mark invite as accepted
    await db.update(workspaceInvites)
      .set({ status: "accepted" })
      .where(eq(workspaceInvites.id, invite.id));

    // Add user as workspace member
    return await this.addWorkspaceMember({
      workspaceId: invite.workspaceId,
      userId,
      role: invite.role
    });
  }

  async getWorkspaceInvites(workspaceId: string): Promise<WorkspaceInvite[]> {
    const result = await db.select().from(workspaceInvites)
      .where(eq(workspaceInvites.workspaceId, workspaceId))
      .orderBy(workspaceInvites.createdAt);
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }


  // Session code operations for collaboration
  async createSessionCode(sessionCodeData: InsertSessionCode): Promise<SessionCode> {
    const [sessionCode] = await db.insert(sessionCodes).values(sessionCodeData).returning();
    return sessionCode;
  }

  async getSessionCode(code: string): Promise<SessionCode | undefined> {
    const [sessionCode] = await db.select().from(sessionCodes)
      .where(sql`${sessionCodes.code} = ${code} AND ${sessionCodes.isActive} = true AND ${sessionCodes.expiresAt} > NOW()`);
    return sessionCode || undefined;
  }

  async addUserToSession(sessionCode: string, userId: string): Promise<void> {
    await db.insert(sessionParticipants).values({
      sessionCode,
      userId,
      role: "participant"
    });
  }

  async getSessionParticipants(sessionCode: string): Promise<SessionParticipant[]> {
    return await db.select().from(sessionParticipants)
      .where(eq(sessionParticipants.sessionCode, sessionCode))
      .orderBy(sessionParticipants.joinedAt);
  }

  async removeUserFromSession(sessionCode: string, userId: string): Promise<void> {
    await db.delete(sessionParticipants)
      .where(sql`${sessionParticipants.sessionCode} = ${sessionCode} AND ${sessionParticipants.userId} = ${userId}`);
  }

  // Chat message operations for team communication
  async saveChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(messageData).returning();
    return message;
  }

  async getChatHistory(sessionCode: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages)
      .where(eq(chatMessages.sessionCode, sessionCode))
      .orderBy(chatMessages.timestamp);
  }

  async deleteChatMessage(messageId: string): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.id, messageId));
  }


  // Organization management methods (stubs for now)
  async createOrganization(organization: InsertOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(organization).returning();
    return org;
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || undefined;
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.slug, slug));
    return org || undefined;
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined> {
    const [org] = await db.update(organizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return org || undefined;
  }

  async deleteOrganization(id: string): Promise<boolean> {
    const result = await db.delete(organizations).where(eq(organizations.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const result = await db
      .select({ organization: organizations })
      .from(organizations)
      .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
      .where(eq(organizationMembers.userId, userId));
    
    return result.map(r => r.organization);
  }

  async addOrganizationMember(member: InsertOrganizationMember): Promise<OrganizationMember> {
    const [orgMember] = await db.insert(organizationMembers).values(member).returning();
    return orgMember;
  }

  async removeOrganizationMember(organizationId: string, userId: string): Promise<boolean> {
    const result = await db.delete(organizationMembers)
      .where(sql`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`);
    return (result.rowCount || 0) > 0;
  }

  async getOrganizationMembers(organizationId: string): Promise<(OrganizationMember & { user: User })[]> {
    const result = await db
      .select()
      .from(organizationMembers)
      .innerJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, organizationId));
    
    return result.map(row => ({
      ...row.organization_members,
      user: row.users
    }));
  }

  async getOrganizationMembership(organizationId: string, userId: string): Promise<OrganizationMember | undefined> {
    const [member] = await db.select().from(organizationMembers)
      .where(sql`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`);
    return member || undefined;
  }

  async updateOrganizationMemberRole(organizationId: string, userId: string, role: string, permissions?: any): Promise<OrganizationMember | undefined> {
    const [member] = await db.update(organizationMembers)
      .set({ role, permissions })
      .where(sql`${organizationMembers.organizationId} = ${organizationId} AND ${organizationMembers.userId} = ${userId}`)
      .returning();
    return member || undefined;
  }

  async getUserOrganizationMemberships(userId: string): Promise<any[]> {
    // Return empty array for now since organization features are not fully implemented
    // This prevents the auth route from failing
    return [];
  }

  // Stub implementations for other enterprise features
  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined> {
    const [team] = await db.update(teams)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return team || undefined;
  }

  async deleteTeam(id: string): Promise<boolean> {
    const result = await db.delete(teams).where(eq(teams.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getOrganizationTeams(organizationId: string): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.organizationId, organizationId));
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    const result = await db
      .select({ team: teams })
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(eq(teamMembers.userId, userId));
    
    return result.map(r => r.team);
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [teamMember] = await db.insert(teamMembers).values(member).returning();
    return teamMember;
  }

  async removeTeamMember(teamId: string, userId: string): Promise<boolean> {
    const result = await db.delete(teamMembers)
      .where(sql`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`);
    return (result.rowCount || 0) > 0;
  }

  async getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]> {
    const result = await db
      .select()
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));
    
    return result.map(row => ({
      ...row.team_members,
      user: row.users
    }));
  }

  async getTeamMembership(teamId: string, userId: string): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers)
      .where(sql`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`);
    return member || undefined;
  }

  async updateTeamMemberRole(teamId: string, userId: string, role: string): Promise<TeamMember | undefined> {
    const [member] = await db.update(teamMembers)
      .set({ role })
      .where(sql`${teamMembers.teamId} = ${teamId} AND ${teamMembers.userId} = ${userId}`)
      .returning();
    return member || undefined;
  }

  // Audit and Security stubs
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [auditLog] = await db.insert(auditLogs).values(log).returning();
    return auditLog;
  }

  async getAuditLogs(organizationId?: string, userId?: string, limit?: number): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(auditLogs.organizationId, organizationId));
    }
    if (userId) {
      conditions.push(eq(auditLogs.userId, userId));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query.orderBy(auditLogs.timestamp);
  }

  async getAuditLogsByAction(action: string, organizationId?: string): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    
    const conditions = [eq(auditLogs.action, action)];
    if (organizationId) {
      conditions.push(eq(auditLogs.organizationId, organizationId));
    }
    
    query = query.where(sql`${conditions.join(' AND ')}`);
    
    return await query.orderBy(auditLogs.timestamp);
  }

  async createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent> {
    const [securityEvent] = await db.insert(securityEvents).values(event).returning();
    return securityEvent;
  }

  async getSecurityEvents(organizationId?: string, severity?: string): Promise<SecurityEvent[]> {
    let query = db.select().from(securityEvents);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(securityEvents.organizationId, organizationId));
    }
    if (severity) {
      conditions.push(eq(securityEvents.severity, severity));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(securityEvents.timestamp);
  }

  async resolveSecurityEvent(id: string, resolvedBy: string): Promise<SecurityEvent | undefined> {
    const [event] = await db.update(securityEvents)
      .set({ resolved: true, resolvedBy, resolvedAt: new Date() })
      .where(eq(securityEvents.id, id))
      .returning();
    return event || undefined;
  }

  // Usage and Performance stubs
  async recordUsageMetric(metric: InsertUsageMetric): Promise<UsageMetric> {
    const [usageMetric] = await db.insert(usageMetrics).values(metric).returning();
    return usageMetric;
  }

  async getUsageMetrics(organizationId?: string, userId?: string, period?: string): Promise<UsageMetric[]> {
    let query = db.select().from(usageMetrics);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(usageMetrics.organizationId, organizationId));
    }
    if (userId) {
      conditions.push(eq(usageMetrics.userId, userId));
    }
    if (period) {
      conditions.push(eq(usageMetrics.period, period));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(usageMetrics.createdAt);
  }

  async getUsageByType(metricType: string, organizationId?: string): Promise<UsageMetric[]> {
    let query = db.select().from(usageMetrics);
    
    const conditions = [eq(usageMetrics.metricType, metricType)];
    if (organizationId) {
      conditions.push(eq(usageMetrics.organizationId, organizationId));
    }
    
    query = query.where(sql`${conditions.join(' AND ')}`);
    
    return await query.orderBy(usageMetrics.createdAt);
  }

  async createRateLimitRule(rule: InsertRateLimitRule): Promise<RateLimitRule> {
    const [rateLimitRule] = await db.insert(rateLimitRules).values(rule).returning();
    return rateLimitRule;
  }

  async getRateLimitRules(organizationId?: string): Promise<RateLimitRule[]> {
    let query = db.select().from(rateLimitRules);
    
    if (organizationId) {
      query = query.where(eq(rateLimitRules.organizationId, organizationId));
    }
    
    return await query;
  }

  async updateRateLimitRule(id: string, updates: Partial<RateLimitRule>): Promise<RateLimitRule | undefined> {
    const [rule] = await db.update(rateLimitRules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rateLimitRules.id, id))
      .returning();
    return rule || undefined;
  }

  async deleteRateLimitRule(id: string): Promise<boolean> {
    const result = await db.delete(rateLimitRules).where(eq(rateLimitRules.id, id));
    return (result.rowCount || 0) > 0;
  }

  async recordPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const [performanceMetric] = await db.insert(performanceMetrics).values(metric).returning();
    return performanceMetric;
  }

  async getPerformanceMetrics(organizationId?: string, metricName?: string): Promise<PerformanceMetric[]> {
    let query = db.select().from(performanceMetrics);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(performanceMetrics.organizationId, organizationId));
    }
    if (metricName) {
      conditions.push(eq(performanceMetrics.metricName, metricName));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(performanceMetrics.timestamp);
  }

  async recordError(error: InsertErrorLog): Promise<ErrorLog> {
    const [errorLog] = await db.insert(errorLogs).values(error).returning();
    return errorLog;
  }

  async getErrorLogs(organizationId?: string, severity?: string): Promise<ErrorLog[]> {
    let query = db.select().from(errorLogs);
    
    const conditions = [];
    if (organizationId) {
      conditions.push(eq(errorLogs.organizationId, organizationId));
    }
    if (severity) {
      conditions.push(eq(errorLogs.severity, severity));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(errorLogs.timestamp);
  }

  async resolveError(id: string, resolvedBy: string): Promise<ErrorLog | undefined> {
    const [error] = await db.update(errorLogs)
      .set({ resolved: true, resolvedBy, resolvedAt: new Date() })
      .where(eq(errorLogs.id, id))
      .returning();
    return error || undefined;
  }

  async recordHealthCheck(check: InsertHealthCheck): Promise<HealthCheck> {
    const [healthCheck] = await db.insert(healthChecks).values(check).returning();
    return healthCheck;
  }

  async getHealthChecks(serviceName?: string): Promise<HealthCheck[]> {
    let query = db.select().from(healthChecks);
    
    if (serviceName) {
      query = query.where(eq(healthChecks.serviceName, serviceName));
    }
    
    return await query.orderBy(healthChecks.timestamp);
  }

  async getLatestHealthStatus(): Promise<{ [serviceName: string]: HealthCheck }> {
    const checks = await db.select().from(healthChecks).orderBy(healthChecks.timestamp);
    const latest: { [serviceName: string]: HealthCheck } = {};
    
    for (const check of checks) {
      if (!latest[check.serviceName] || (check.timestamp && latest[check.serviceName].timestamp && check.timestamp > latest[check.serviceName].timestamp)) {
        latest[check.serviceName] = check;
      }
    }
    
    return latest;
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
