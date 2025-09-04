import { 
  type User, type InsertUser, type UpsertUser, type AnalysisSession, type InsertAnalysisSession,
  type Workspace, type InsertWorkspace, type WorkspaceMember, type InsertWorkspaceMember,
  type WorkspaceInvite, type InsertWorkspaceInvite, type UserPreferences,
  users, analysisSessions, workspaces, workspaceMembers, workspaceInvites
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
  
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analysisSessions: Map<string, AnalysisSession>;
  private workspaces: Map<string, Workspace>;
  private workspaceMembers: Map<string, WorkspaceMember>;
  private workspaceInvites: Map<string, WorkspaceInvite>;

  constructor() {
    this.users = new Map();
    this.analysisSessions = new Map();
    this.workspaces = new Map();
    this.workspaceMembers = new Map();
    this.workspaceInvites = new Map();
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
      preferences: { ...existing.preferences, ...preferences },
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
      subscription: { ...existing.subscription, ...subscription },
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

  // Authentication session methods
  async createUserSession(userId: string): Promise<UserSession> {
    const id = randomUUID();
    const token = randomUUID() + randomUUID(); // More secure token
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const userSession: UserSession = {
      id,
      userId,
      token,
      expiresAt,
      createdAt: new Date()
    };
    this.userSessions.set(token, userSession);
    return userSession;
  }

  async getUserSession(token: string): Promise<UserSession | undefined> {
    const session = this.userSessions.get(token);
    if (!session || session.expiresAt < new Date()) return undefined;
    return session;
  }

  async deleteUserSession(token: string): Promise<boolean> {
    return this.userSessions.delete(token);
  }

  async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    let cleaned = 0;
    const entries = Array.from(this.userSessions.entries());
    for (const [token, session] of entries) {
      if (session.expiresAt < now) {
        this.userSessions.delete(token);
        cleaned++;
      }
    }
    return cleaned;
  }
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
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

  async createSession(sessionData: InsertSession & { results?: any; telemetry?: any }): Promise<Session> {
    const [session] = await db.insert(sessions).values({
      prompt: sessionData.prompt,
      mode: sessionData.mode,
      settings: sessionData.settings || null,
      results: sessionData.results || null,
      telemetry: sessionData.telemetry || null
    }).returning();
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const [session] = await db.update(sessions)
      .set(updates)
      .where(eq(sessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserSessions(userId?: string): Promise<Session[]> {
    if (userId) {
      const result = await db.select().from(sessions).where(eq(sessions.userId, userId)).orderBy(sessions.createdAt);
      return result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }
    const result = await db.select().from(sessions).orderBy(sessions.createdAt);
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

  // Authentication session methods
  async createUserSession(userId: string): Promise<UserSession> {
    const token = randomUUID() + randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const [userSession] = await db.insert(userSessions).values({
      userId,
      token,
      expiresAt,
    }).returning();
    return userSession;
  }

  async getUserSession(token: string): Promise<UserSession | undefined> {
    const [session] = await db.select().from(userSessions)
      .where(sql`${userSessions.token} = ${token} AND ${userSessions.expiresAt} > NOW()`);
    return session || undefined;
  }

  async deleteUserSession(token: string): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.token, token));
    return (result.rowCount || 0) > 0;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await db.delete(userSessions).where(sql`${userSessions.expiresAt} < NOW()`);
    return result.rowCount || 0;
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
