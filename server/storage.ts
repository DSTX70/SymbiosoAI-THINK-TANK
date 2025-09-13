import { 
  type User, type InsertUser, type UpsertUser, type AnalysisSession, type InsertAnalysisSession,
  type Workspace, type InsertWorkspace, type WorkspaceMember, type InsertWorkspaceMember,
  type WorkspaceInvite, type InsertWorkspaceInvite, type UserPreferences,
  type GeneratedReport, type InsertGeneratedReport,
  type Template, type InsertTemplate,
  type SessionCode, type InsertSessionCode, type SessionParticipant, type InsertSessionParticipant,
  type ChatMessage, type InsertChatMessage,
  type PushSubscription, type InsertPushSubscription,
  // Tutorial system types
  type Tutorial, type InsertTutorial, type TutorialStep, type InsertTutorialStep,
  type TutorialProgress, type InsertTutorialProgress, type TutorialSettings, type InsertTutorialSettings,
  // Enterprise types
  type Organization, type InsertOrganization, type OrganizationMember, type InsertOrganizationMember,
  type Team, type InsertTeam, type TeamMember, type InsertTeamMember,
  type AuditLog, type InsertAuditLog, type SecurityEvent, type InsertSecurityEvent,
  type UsageMetric, type InsertUsageMetric, type RateLimitRule, type InsertRateLimitRule,
  type PerformanceMetric, type InsertPerformanceMetric, type ErrorLog, type InsertErrorLog,
  type HealthCheck, type InsertHealthCheck,
  // Sprint 1 types
  type DebateRun, type InsertDebateRun, type ExportLog, type InsertExportLog,
  users, analysisSessions, workspaces, workspaceMembers, workspaceInvites, generatedReports,
  templates, sessionCodes, sessionParticipants, chatMessages, pushSubscriptions,
  tutorials, tutorialSteps, tutorialProgress, tutorialSettings,
  organizations, organizationMembers, teams, teamMembers, auditLogs, securityEvents,
  usageMetrics, rateLimitRules, performanceMetrics, errorLogs, healthChecks,
  debateRuns, exportLogs
} from "@shared/schema";
import { randomUUID } from "crypto";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, sql, and, not } from 'drizzle-orm';
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
  updateOnboardingProgress(id: string, progress: any): Promise<User | undefined>;
  
  // Analysis session management
  createAnalysisSession(session: InsertAnalysisSession & { results?: any; telemetry?: any; debateHistory?: any }): Promise<AnalysisSession>;
  getAnalysisSession(id: string): Promise<AnalysisSession | undefined>;
  updateAnalysisSession(id: string, updates: Partial<AnalysisSession>): Promise<AnalysisSession | undefined>;
  getUserAnalysisSessions(userId?: string): Promise<AnalysisSession[]>;
  
  // Session transfer methods for cross-mode debate continuation
  getTransferableSessions(userId?: string, excludeMode?: string): Promise<AnalysisSession[]>;
  getSessionForTransfer(sessionId: string): Promise<AnalysisSession | undefined>;
  
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

  // Generated report operations for report management
  createGeneratedReport(report: InsertGeneratedReport): Promise<GeneratedReport>;
  getGeneratedReport(id: string): Promise<GeneratedReport | undefined>;
  getUserGeneratedReports(userId: string): Promise<GeneratedReport[]>;
  deleteGeneratedReport(id: string): Promise<boolean>;
  getSessionReports(sessionId: string): Promise<GeneratedReport[]>;

  // Template operations for AI thinking templates
  createTemplate(template: InsertTemplate): Promise<Template>;
  getTemplate(id: string): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getPublicTemplates(): Promise<Template[]>;
  getUserTemplates(userId: string): Promise<Template[]>;
  updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  incrementTemplateUsage(id: string): Promise<Template | undefined>;

  // Push notification subscription operations for web push support
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  getPushSubscription(id: string): Promise<PushSubscription | undefined>;
  getUserPushSubscriptions(userId: string): Promise<PushSubscription[]>;
  deletePushSubscription(id: string): Promise<boolean>;
  deletePushSubscriptionByEndpoint(endpoint: string, userId: string): Promise<boolean>;
  updatePushSubscription(id: string, updates: Partial<PushSubscription>): Promise<PushSubscription | undefined>;

  // ============================================
  // TUTORIAL SYSTEM - Interactive User Guidance
  // ============================================
  
  // Tutorial management operations
  createTutorial(tutorial: InsertTutorial): Promise<Tutorial>;
  getTutorial(id: string): Promise<Tutorial | undefined>;
  getAllTutorials(): Promise<Tutorial[]>;
  getTutorialsByCategory(category: string): Promise<Tutorial[]>;
  getActiveTutorials(): Promise<Tutorial[]>;
  updateTutorial(id: string, updates: Partial<Tutorial>): Promise<Tutorial | undefined>;
  deleteTutorial(id: string): Promise<boolean>;
  
  // Tutorial step management operations
  createTutorialStep(step: InsertTutorialStep): Promise<TutorialStep>;
  getTutorialStep(id: string): Promise<TutorialStep | undefined>;
  getTutorialSteps(tutorialId: string): Promise<TutorialStep[]>;
  updateTutorialStep(id: string, updates: Partial<TutorialStep>): Promise<TutorialStep | undefined>;
  deleteTutorialStep(id: string): Promise<boolean>;
  deleteTutorialSteps(tutorialId: string): Promise<boolean>;
  
  // Tutorial progress tracking operations
  createTutorialProgress(progress: InsertTutorialProgress): Promise<TutorialProgress>;
  getTutorialProgress(id: string): Promise<TutorialProgress | undefined>;
  getUserTutorialProgress(userId: string, tutorialId: string): Promise<TutorialProgress | undefined>;
  getUserAllTutorialProgress(userId: string): Promise<TutorialProgress[]>;
  updateTutorialProgress(id: string, updates: Partial<TutorialProgress>): Promise<TutorialProgress | undefined>;
  deleteTutorialProgress(id: string): Promise<boolean>;
  markTutorialStepCompleted(userId: string, tutorialId: string, stepNumber: number): Promise<TutorialProgress | undefined>;
  markTutorialCompleted(userId: string, tutorialId: string): Promise<TutorialProgress | undefined>;
  
  // Tutorial settings management operations
  createTutorialSettings(settings: InsertTutorialSettings): Promise<TutorialSettings>;
  getTutorialSettings(userId: string): Promise<TutorialSettings | undefined>;
  updateTutorialSettings(userId: string, updates: Partial<TutorialSettings>): Promise<TutorialSettings | undefined>;
  resetTutorialSettings(userId: string): Promise<TutorialSettings | undefined>;

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

  // ============================================
  // SPRINT 1 - Async Processing & Export Tracking
  // ============================================
  
  // Debate run tracking
  createDebateRun(run: InsertDebateRun): Promise<DebateRun>;
  getDebateRun(id: string): Promise<DebateRun | undefined>;
  updateDebateRunStatus(id: string, status: string, completedAt?: Date): Promise<DebateRun | undefined>;
  
  // Export logging
  createExportLog(log: InsertExportLog): Promise<ExportLog>;
  getExportLogs(userId?: string, workspaceId?: string): Promise<ExportLog[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analysisSessions: Map<string, AnalysisSession>;
  private workspaces: Map<string, Workspace>;
  private workspaceMembers: Map<string, WorkspaceMember>;
  private workspaceInvites: Map<string, WorkspaceInvite>;
  private generatedReports: Map<string, GeneratedReport>;
  private sessionCodes: Map<string, SessionCode>;
  private sessionParticipants: Map<string, SessionParticipant>;
  private chatMessages: Map<string, ChatMessage>;
  private pushSubscriptions: Map<string, PushSubscription>;

  constructor() {
    this.users = new Map();
    this.analysisSessions = new Map();
    this.workspaces = new Map();
    this.workspaceMembers = new Map();
    this.workspaceInvites = new Map();
    this.generatedReports = new Map();
    this.sessionCodes = new Map();
    this.sessionParticipants = new Map();
    this.chatMessages = new Map();
    this.pushSubscriptions = new Map();
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
        onboardingProgress: {
          completed_steps: [],
          current_flow: null,
          experience_level: "beginner",
          skipped_flows: [],
          last_interaction: null,
          feature_usage: {}
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

  async updateOnboardingProgress(id: string, progress: any): Promise<User | undefined> {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    
    const updated = { 
      ...existing, 
      onboardingProgress: existing.onboardingProgress ? { ...existing.onboardingProgress, ...progress } : progress,
      updatedAt: new Date() 
    };
    this.users.set(id, updated);
    return updated;
  }

  async createAnalysisSession(sessionData: InsertAnalysisSession & { results?: any; telemetry?: any; debateHistory?: any }): Promise<AnalysisSession> {
    const id = randomUUID();
    const session: AnalysisSession = {
      id,
      prompt: sessionData.prompt,
      mode: sessionData.mode,
      settings: sessionData.settings || null,
      results: sessionData.results || null,
      telemetry: sessionData.telemetry || null,
      debateHistory: sessionData.debateHistory || null,
      brainstormResults: null,
      lastBrainstormedAt: null,
      lastReportGeneratedAt: null,
      lastReportType: null,
      title: sessionData.title || null,
      sourceSessionId: sessionData.sourceSessionId || null,
      transferCount: sessionData.transferCount || 0,
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

  async getTransferableSessions(userId?: string, excludeMode?: string): Promise<AnalysisSession[]> {
    const allSessions = Array.from(this.analysisSessions.values());
    let filtered = userId ? allSessions.filter(s => s.userId === userId) : allSessions;
    
    // Only return sessions that have results (completed debates)
    filtered = filtered.filter(s => s.results && typeof s.results === 'object' && (s.results as any).consensus);
    
    // Exclude sessions from the specified mode (e.g., don't show Expert sessions when in Expert mode)
    if (excludeMode) {
      filtered = filtered.filter(s => s.mode !== excludeMode);
    }
    
    return filtered
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, 20); // Limit to recent 20 sessions
  }

  async getSessionForTransfer(sessionId: string): Promise<AnalysisSession | undefined> {
    return this.analysisSessions.get(sessionId);
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

  // Generated report operations
  async createGeneratedReport(report: InsertGeneratedReport): Promise<GeneratedReport> {
    const id = randomUUID();
    const generatedReport: GeneratedReport = {
      ...report,
      id,
      format: report.format || "markdown",
      metadata: report.metadata || {},
      generatedAt: new Date()
    };
    this.generatedReports.set(id, generatedReport);
    return generatedReport;
  }

  async getGeneratedReport(id: string): Promise<GeneratedReport | undefined> {
    return this.generatedReports.get(id);
  }

  async getUserGeneratedReports(userId: string): Promise<GeneratedReport[]> {
    return Array.from(this.generatedReports.values())
      .filter(report => report.userId === userId)
      .sort((a, b) => (b.generatedAt?.getTime() || 0) - (a.generatedAt?.getTime() || 0));
  }

  async deleteGeneratedReport(id: string): Promise<boolean> {
    return this.generatedReports.delete(id);
  }

  async getSessionReports(sessionId: string): Promise<GeneratedReport[]> {
    return Array.from(this.generatedReports.values())
      .filter(report => report.sessionId === sessionId)
      .sort((a, b) => (b.generatedAt?.getTime() || 0) - (a.generatedAt?.getTime() || 0));
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
    const now = new Date();
    
    // First check by ID if provided
    let existing = upsertData.id ? await this.getUser(upsertData.id) : null;
    
    // If not found by ID but email is provided, check by email
    if (!existing && upsertData.email) {
      existing = await this.getUserByEmail(upsertData.email);
    }
    
    if (existing) {
      // Update existing user
      const updated = await this.updateUser(existing.id, {
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
      const created = await this.createUser(newUser);
      // Set the OAuth ID if provided
      if (upsertData.id && created.id !== upsertData.id) {
        return await this.updateUser(created.id, { id: upsertData.id }) || created;
      }
      return created;
    }
  }

  async updateUserPreferences(id: string, preferences: UserPreferences): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    
    return await this.updateUser(id, { 
      preferences: existing.preferences ? { ...existing.preferences, ...preferences } : preferences
    });
  }

  async updateOnboardingProgress(id: string, progress: any): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    
    return await this.updateUser(id, { 
      onboardingProgress: existing.onboardingProgress ? { ...existing.onboardingProgress, ...progress } : progress
    });
  }

  async updateUserSubscription(id: string, subscription: any): Promise<User | undefined> {
    const existing = await this.getUser(id);
    if (!existing) return undefined;
    
    return await this.updateUser(id, { 
      subscription: existing.subscription ? { ...existing.subscription, ...subscription } : subscription
    });
  }

  async createAnalysisSession(sessionData: InsertAnalysisSession & { results?: any; telemetry?: any; debateHistory?: any }): Promise<AnalysisSession> {
    const [session] = await db.insert(analysisSessions).values({
      prompt: sessionData.prompt,
      mode: sessionData.mode,
      settings: sessionData.settings || null,
      results: sessionData.results || null,
      telemetry: sessionData.telemetry || null,
      debateHistory: sessionData.debateHistory || null,
      title: sessionData.title || null,
      sourceSessionId: sessionData.sourceSessionId || null,
      transferCount: sessionData.transferCount || 0,
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

  // Session transfer methods for cross-mode debate continuation
  async getTransferableSessions(userId?: string, excludeMode?: string): Promise<AnalysisSession[]> {
    let query = db.select().from(analysisSessions);
    
    const conditions = [];
    if (userId) {
      conditions.push(eq(analysisSessions.userId, userId));
    }
    if (excludeMode) {
      conditions.push(not(eq(analysisSessions.mode, excludeMode)));
    }
    
    if (conditions.length > 0) {
      const result = await query.where(and(...conditions)).orderBy(analysisSessions.createdAt);
      return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    
    const result = await query.orderBy(analysisSessions.createdAt);
    return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getSessionForTransfer(sessionId: string): Promise<AnalysisSession | undefined> {
    const [session] = await db.select().from(analysisSessions).where(eq(analysisSessions.id, sessionId));
    return session || undefined;
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

  // Generated report operations for report management
  async createGeneratedReport(report: InsertGeneratedReport): Promise<GeneratedReport> {
    const [generatedReport] = await db.insert(generatedReports).values(report).returning();
    return generatedReport;
  }

  async getGeneratedReport(id: string): Promise<GeneratedReport | undefined> {
    const [report] = await db.select().from(generatedReports).where(eq(generatedReports.id, id));
    return report || undefined;
  }

  async getUserGeneratedReports(userId: string): Promise<GeneratedReport[]> {
    return await db.select().from(generatedReports)
      .where(eq(generatedReports.userId, userId))
      .orderBy(sql`${generatedReports.generatedAt} DESC`);
  }

  async deleteGeneratedReport(id: string): Promise<boolean> {
    const result = await db.delete(generatedReports).where(eq(generatedReports.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSessionReports(sessionId: string): Promise<GeneratedReport[]> {
    return await db.select().from(generatedReports)
      .where(eq(generatedReports.sessionId, sessionId))
      .orderBy(sql`${generatedReports.generatedAt} DESC`);
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
      if (!latest[check.serviceName] || (check.timestamp && latest[check.serviceName]?.timestamp && check.timestamp > latest[check.serviceName].timestamp!)) {
        latest[check.serviceName] = check;
      }
    }
    
    return latest;
  }

  // ============================================
  // SPRINT 1 - Async Processing & Export Tracking Implementation
  // ============================================
  
  async createDebateRun(run: InsertDebateRun): Promise<DebateRun> {
    const [debateRun] = await db.insert(debateRuns).values(run).returning();
    return debateRun;
  }

  async getDebateRun(id: string): Promise<DebateRun | undefined> {
    const [debateRun] = await db.select().from(debateRuns).where(eq(debateRuns.id, id));
    return debateRun || undefined;
  }

  async updateDebateRunStatus(id: string, status: string, completedAt?: Date): Promise<DebateRun | undefined> {
    const updateData: any = { status };
    if (completedAt) {
      updateData.completedAt = completedAt;
    }
    
    const [debateRun] = await db.update(debateRuns)
      .set(updateData)
      .where(eq(debateRuns.id, id))
      .returning();
    return debateRun || undefined;
  }

  async createExportLog(log: InsertExportLog): Promise<ExportLog> {
    const [exportLog] = await db.insert(exportLogs).values(log).returning();
    return exportLog;
  }

  async getExportLogs(userId?: string, workspaceId?: string): Promise<ExportLog[]> {
    let query = db.select().from(exportLogs);
    
    const conditions = [];
    if (userId) {
      conditions.push(eq(exportLogs.userId, userId));
    }
    if (workspaceId) {
      conditions.push(eq(exportLogs.workspaceId, workspaceId));
    }
    
    if (conditions.length > 0) {
      query = query.where(sql`${conditions.join(' AND ')}`);
    }
    
    return await query.orderBy(exportLogs.createdAt);
  }

  // ============================================
  // PUSH NOTIFICATION SUBSCRIPTIONS
  // ============================================
  
  async createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription> {
    const [pushSubscription] = await db.insert(pushSubscriptions).values(subscription).returning();
    return pushSubscription;
  }

  async getPushSubscription(id: string): Promise<PushSubscription | undefined> {
    const [pushSubscription] = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.id, id));
    return pushSubscription || undefined;
  }

  async getUserPushSubscriptions(userId: string): Promise<PushSubscription[]> {
    return await db.select().from(pushSubscriptions)
      .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.isActive, true)))
      .orderBy(pushSubscriptions.createdAt);
  }

  async deletePushSubscription(id: string): Promise<boolean> {
    const result = await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async deletePushSubscriptionByEndpoint(endpoint: string, userId: string): Promise<boolean> {
    const result = await db.delete(pushSubscriptions)
      .where(and(eq(pushSubscriptions.endpoint, endpoint), eq(pushSubscriptions.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  async updatePushSubscription(id: string, updates: Partial<PushSubscription>): Promise<PushSubscription | undefined> {
    const [pushSubscription] = await db.update(pushSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(pushSubscriptions.id, id))
      .returning();
    return pushSubscription || undefined;
  }

  // ============================================
  // TUTORIAL SYSTEM IMPLEMENTATIONS
  // ============================================
  
  // Tutorial management operations
  async createTutorial(tutorial: InsertTutorial): Promise<Tutorial> {
    const [newTutorial] = await db.insert(tutorials).values(tutorial).returning();
    return newTutorial;
  }

  async getTutorial(id: string): Promise<Tutorial | undefined> {
    const [tutorial] = await db.select().from(tutorials).where(eq(tutorials.id, id));
    return tutorial || undefined;
  }

  async getAllTutorials(): Promise<Tutorial[]> {
    return await db.select().from(tutorials).orderBy(tutorials.priority, tutorials.name);
  }

  async getTutorialsByCategory(category: string): Promise<Tutorial[]> {
    return await db.select().from(tutorials)
      .where(eq(tutorials.category, category))
      .orderBy(tutorials.priority, tutorials.name);
  }

  async getActiveTutorials(): Promise<Tutorial[]> {
    return await db.select().from(tutorials)
      .where(eq(tutorials.isActive, true))
      .orderBy(tutorials.priority, tutorials.name);
  }

  async updateTutorial(id: string, updates: Partial<Tutorial>): Promise<Tutorial | undefined> {
    const [tutorial] = await db.update(tutorials)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tutorials.id, id))
      .returning();
    return tutorial || undefined;
  }

  async deleteTutorial(id: string): Promise<boolean> {
    // Delete all related tutorial steps first
    await db.delete(tutorialSteps).where(eq(tutorialSteps.tutorialId, id));
    
    // Delete all related progress records
    await db.delete(tutorialProgress).where(eq(tutorialProgress.tutorialId, id));
    
    // Finally delete the tutorial
    const result = await db.delete(tutorials).where(eq(tutorials.id, id));
    return result.rowCount !== undefined && result.rowCount > 0;
  }
  
  // Tutorial step management operations
  async createTutorialStep(step: InsertTutorialStep): Promise<TutorialStep> {
    const [newStep] = await db.insert(tutorialSteps).values(step).returning();
    return newStep;
  }

  async getTutorialStep(id: string): Promise<TutorialStep | undefined> {
    const [step] = await db.select().from(tutorialSteps).where(eq(tutorialSteps.id, id));
    return step || undefined;
  }

  async getTutorialSteps(tutorialId: string): Promise<TutorialStep[]> {
    return await db.select().from(tutorialSteps)
      .where(eq(tutorialSteps.tutorialId, tutorialId))
      .orderBy(tutorialSteps.stepNumber);
  }

  async updateTutorialStep(id: string, updates: Partial<TutorialStep>): Promise<TutorialStep | undefined> {
    const [step] = await db.update(tutorialSteps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tutorialSteps.id, id))
      .returning();
    return step || undefined;
  }

  async deleteTutorialStep(id: string): Promise<boolean> {
    const result = await db.delete(tutorialSteps).where(eq(tutorialSteps.id, id));
    return result.rowCount !== undefined && result.rowCount > 0;
  }

  async deleteTutorialSteps(tutorialId: string): Promise<boolean> {
    const result = await db.delete(tutorialSteps).where(eq(tutorialSteps.tutorialId, tutorialId));
    return result.rowCount !== undefined && result.rowCount > 0;
  }
  
  // Tutorial progress tracking operations
  async createTutorialProgress(progress: InsertTutorialProgress): Promise<TutorialProgress> {
    const [newProgress] = await db.insert(tutorialProgress).values({
      ...progress,
      startedAt: new Date(),
      lastInteractionAt: new Date()
    }).returning();
    return newProgress;
  }

  async getTutorialProgress(id: string): Promise<TutorialProgress | undefined> {
    const [progress] = await db.select().from(tutorialProgress).where(eq(tutorialProgress.id, id));
    return progress || undefined;
  }

  async getUserTutorialProgress(userId: string, tutorialId: string): Promise<TutorialProgress | undefined> {
    const [progress] = await db.select().from(tutorialProgress)
      .where(and(
        eq(tutorialProgress.userId, userId),
        eq(tutorialProgress.tutorialId, tutorialId)
      ));
    return progress || undefined;
  }

  async getUserAllTutorialProgress(userId: string): Promise<TutorialProgress[]> {
    return await db.select().from(tutorialProgress)
      .where(eq(tutorialProgress.userId, userId))
      .orderBy(tutorialProgress.lastInteractionAt);
  }

  async updateTutorialProgress(id: string, updates: Partial<TutorialProgress>): Promise<TutorialProgress | undefined> {
    const [progress] = await db.update(tutorialProgress)
      .set({ ...updates, lastInteractionAt: new Date() })
      .where(eq(tutorialProgress.id, id))
      .returning();
    return progress || undefined;
  }

  async deleteTutorialProgress(id: string): Promise<boolean> {
    const result = await db.delete(tutorialProgress).where(eq(tutorialProgress.id, id));
    return result.rowCount !== undefined && result.rowCount > 0;
  }

  async markTutorialStepCompleted(userId: string, tutorialId: string, stepNumber: number): Promise<TutorialProgress | undefined> {
    // Get or create tutorial progress
    let progress = await this.getUserTutorialProgress(userId, tutorialId);
    
    if (!progress) {
      progress = await this.createTutorialProgress({
        userId,
        tutorialId,
        status: 'in_progress',
        currentStep: stepNumber,
        completedSteps: [stepNumber],
        skippedSteps: []
      });
    } else {
      // Update progress
      const completedSteps = Array.isArray(progress.completedSteps) 
        ? [...progress.completedSteps] 
        : [];
      
      if (!completedSteps.includes(stepNumber)) {
        completedSteps.push(stepNumber);
      }

      progress = await this.updateTutorialProgress(progress.id, {
        status: 'in_progress',
        currentStep: stepNumber + 1, // Move to next step
        completedSteps: completedSteps
      });
    }
    
    return progress;
  }

  async markTutorialCompleted(userId: string, tutorialId: string): Promise<TutorialProgress | undefined> {
    let progress = await this.getUserTutorialProgress(userId, tutorialId);
    
    if (!progress) {
      // Create completed progress if none exists
      progress = await this.createTutorialProgress({
        userId,
        tutorialId,
        status: 'completed',
        completedAt: new Date()
      });
    } else {
      // Mark as completed
      progress = await this.updateTutorialProgress(progress.id, {
        status: 'completed',
        completedAt: new Date()
      });
    }

    // Update user settings with completion count
    const settings = await this.getTutorialSettings(userId);
    if (settings) {
      await this.updateTutorialSettings(userId, {
        completedTutorialCount: (settings.completedTutorialCount || 0) + 1
      });
    }
    
    return progress;
  }
  
  // Tutorial settings management operations
  async createTutorialSettings(settings: InsertTutorialSettings): Promise<TutorialSettings> {
    const [newSettings] = await db.insert(tutorialSettings).values(settings).returning();
    return newSettings;
  }

  async getTutorialSettings(userId: string): Promise<TutorialSettings | undefined> {
    const [settings] = await db.select().from(tutorialSettings).where(eq(tutorialSettings.userId, userId));
    return settings || undefined;
  }

  async updateTutorialSettings(userId: string, updates: Partial<TutorialSettings>): Promise<TutorialSettings | undefined> {
    // Try to update existing settings first
    const [settings] = await db.update(tutorialSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tutorialSettings.userId, userId))
      .returning();
    
    // If no settings exist, create them
    if (!settings) {
      return await this.createTutorialSettings({
        userId,
        ...updates as InsertTutorialSettings
      });
    }
    
    return settings;
  }

  async resetTutorialSettings(userId: string): Promise<TutorialSettings | undefined> {
    // Reset to default settings
    return await this.updateTutorialSettings(userId, {
      autoStartTutorials: true,
      showTooltips: true,
      tutorialSpeed: 'normal',
      preferredPosition: 'bottom',
      disabledCategories: [],
      notificationPreferences: {
        completion_rewards: true,
        progress_reminders: true,
        new_tutorials: true
      },
      experienceLevel: 'beginner'
    });
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
