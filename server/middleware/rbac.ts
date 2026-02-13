import type { Request, Response, NextFunction } from "express";
import type { User, WorkspaceMember, SystemUserRole, WorkspaceRole } from "@shared/schema";
import { storage } from "../storage";

// Extend User interface to ensure required fields for RBAC
interface RequestUser extends User {
  id: string;
  role: string;
}

// Define user roles hierarchy (higher number = more permissions)
// IMPORTANT: These must match the roles used in shared/schema.ts and getSystemPermissions()
export const USER_ROLES = {
  user: 1,           // Basic user (default role in schema)
  premium_user: 2,   // Premium individual user
  viewer: 1,         // Workspace role
  member: 2,         // Workspace role
  admin: 3,          // System or workspace admin
  owner: 4,          // Workspace owner
  system_admin: 5    // System-wide admin
} as const;

// Define system-wide permissions
export const SYSTEM_PERMISSIONS = {
  CREATE_WORKSPACE: "create_workspace",
  MANAGE_USERS: "manage_users",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  MANAGE_BILLING: "manage_billing",
  ADMIN_DASHBOARD: "admin_dashboard"
} as const;

// Define workspace-level permissions
export const WORKSPACE_PERMISSIONS = {
  READ_WORKSPACE: "read_workspace",
  UPDATE_WORKSPACE: "update_workspace",
  DELETE_WORKSPACE: "delete_workspace",
  MANAGE_MEMBERS: "manage_members",
  INVITE_MEMBERS: "invite_members",
  CREATE_SESSIONS: "create_sessions",
  DELETE_SESSIONS: "delete_sessions",
  MANAGE_TEMPLATES: "manage_templates",
  EXPORT_DATA: "export_data",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_INTEGRATIONS: "manage_integrations"
} as const;

export type SystemPermission = typeof SYSTEM_PERMISSIONS[keyof typeof SYSTEM_PERMISSIONS];
export type WorkspacePermission = typeof WORKSPACE_PERMISSIONS[keyof typeof WORKSPACE_PERMISSIONS];

// Extend Request interface to include user and workspace context
declare global {
  namespace Express {
    interface Request {
      user?: User;
      workspace?: any;
      workspaceMembership?: WorkspaceMember;
    }
  }
}

/**
 * Check if user has required system-level role
 */
export function hasSystemRole(userRole: string, requiredRole: SystemUserRole): boolean {
  const userRoleLevel = USER_ROLES[userRole as SystemUserRole] || 0;
  const requiredRoleLevel = USER_ROLES[requiredRole];
  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Check if user has required workspace-level role
 */
export function hasWorkspaceRole(membershipRole: string, requiredRole: WorkspaceRole): boolean {
  const memberRoleLevel = USER_ROLES[membershipRole as WorkspaceRole] || 0;
  const requiredRoleLevel = USER_ROLES[requiredRole];
  return memberRoleLevel >= requiredRoleLevel;
}

/**
 * Get user's system permissions based on their role
 * SECURITY CRITICAL: This determines what system-level actions users can perform
 */
export function getSystemPermissions(userRole: string): SystemPermission[] {
  const permissions: SystemPermission[] = [];
  
  switch (userRole) {
    case "system_admin":
      // System admins have all permissions
      permissions.push(
        SYSTEM_PERMISSIONS.CREATE_WORKSPACE,
        SYSTEM_PERMISSIONS.MANAGE_USERS,
        SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS,
        SYSTEM_PERMISSIONS.MANAGE_BILLING,
        SYSTEM_PERMISSIONS.ADMIN_DASHBOARD
      );
      break;
    case "admin":
      // Regular admins have most permissions but not user management
      permissions.push(
        SYSTEM_PERMISSIONS.CREATE_WORKSPACE,
        SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS,
        SYSTEM_PERMISSIONS.MANAGE_BILLING,
        SYSTEM_PERMISSIONS.ADMIN_DASHBOARD
      );
      break;
    case "premium_user":
      // Premium users can create workspaces
      permissions.push(SYSTEM_PERMISSIONS.CREATE_WORKSPACE);
      break;
    case "user":
    default:
      // Basic users have no special system permissions
      break;
  }
  
  return permissions;
}

/**
 * Get user's workspace permissions based on their membership role
 */
export function getWorkspacePermissions(membershipRole: string): WorkspacePermission[] {
  const permissions: WorkspacePermission[] = [];
  
  switch (membershipRole) {
    case "owner":
      permissions.push(
        WORKSPACE_PERMISSIONS.READ_WORKSPACE,
        WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE,
        WORKSPACE_PERMISSIONS.DELETE_WORKSPACE,
        WORKSPACE_PERMISSIONS.MANAGE_MEMBERS,
        WORKSPACE_PERMISSIONS.INVITE_MEMBERS,
        WORKSPACE_PERMISSIONS.CREATE_SESSIONS,
        WORKSPACE_PERMISSIONS.DELETE_SESSIONS,
        WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES,
        WORKSPACE_PERMISSIONS.EXPORT_DATA,
        WORKSPACE_PERMISSIONS.VIEW_ANALYTICS
      );
      break;
    case "admin":
      permissions.push(
        WORKSPACE_PERMISSIONS.READ_WORKSPACE,
        WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE,
        WORKSPACE_PERMISSIONS.MANAGE_MEMBERS,
        WORKSPACE_PERMISSIONS.INVITE_MEMBERS,
        WORKSPACE_PERMISSIONS.CREATE_SESSIONS,
        WORKSPACE_PERMISSIONS.DELETE_SESSIONS,
        WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES,
        WORKSPACE_PERMISSIONS.EXPORT_DATA,
        WORKSPACE_PERMISSIONS.VIEW_ANALYTICS
      );
      break;
    case "member":
      permissions.push(
        WORKSPACE_PERMISSIONS.READ_WORKSPACE,
        WORKSPACE_PERMISSIONS.CREATE_SESSIONS,
        WORKSPACE_PERMISSIONS.EXPORT_DATA
      );
      break;
    case "viewer":
      permissions.push(WORKSPACE_PERMISSIONS.READ_WORKSPACE);
      break;
    default:
      // No permissions for unknown roles
      break;
  }
  
  return permissions;
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (process.env.BYPASS_AUTH === "true") {
      const devUserId = process.env.BYPASS_AUTH_USER_ID || "dev-user";
      let user = await storage.getUser(devUserId);
      if (!user) {
        user = await storage.upsertUser({
          id: devUserId,
          email: "dev@symbiosoai.local",
          firstName: "Dev",
          lastName: "User",
          profileImageUrl: null,
        });
      }

      if (user.role !== "system_admin") {
        await storage.setUserRole(devUserId, "system_admin");
        const updated = await storage.getUser(devUserId);
        if (updated) {
          user = updated;
        }
      }

      req.user = {
        ...user,
        isDemo: true,
        subscription: { plan: "demo" },
      } as any;
      return next();
    }

    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "AUTH_REQUIRED" 
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: "Authentication setup failed",
      code: "AUTH_SETUP_FAILED",
    });
  }
}

/**
 * Middleware to require specific system role
 */
export function requireSystemRole(requiredRole: SystemUserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "AUTH_REQUIRED" 
      });
    }

    if (!hasSystemRole((req.user as RequestUser).role, requiredRole)) {
      return res.status(403).json({ 
        error: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        required: requiredRole,
        current: (req.user as RequestUser).role
      });
    }

    next();
  };
}

/**
 * Middleware to require specific system permission
 */
export function requireSystemPermission(permission: SystemPermission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "AUTH_REQUIRED" 
      });
    }

    const userPermissions = getSystemPermissions((req.user as RequestUser).role);
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ 
        error: "Insufficient permissions",
        code: "INSUFFICIENT_PERMISSIONS",
        required: permission,
        userRole: (req.user as RequestUser).role
      });
    }

    next();
  };
}

/**
 * Middleware to load workspace context and check access
 */
export function requireWorkspaceAccess(requiredRole?: WorkspaceRole) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: "Authentication required",
          code: "AUTH_REQUIRED" 
        });
      }

      // Get workspace ID from params, body, or query
      const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
      
      if (!workspaceId) {
        return res.status(400).json({ 
          error: "Workspace ID required",
          code: "WORKSPACE_ID_REQUIRED" 
        });
      }

      // Load workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({ 
          error: "Workspace not found",
          code: "WORKSPACE_NOT_FOUND" 
        });
      }

      // Load user's membership in this workspace
      const membership = await storage.getWorkspaceMembership(workspaceId, (req.user as RequestUser).id);
      if (!membership) {
        return res.status(403).json({ 
          error: "Access denied to workspace",
          code: "WORKSPACE_ACCESS_DENIED" 
        });
      }

      // Check role requirement if specified
      if (requiredRole && !hasWorkspaceRole(membership.role, requiredRole)) {
        return res.status(403).json({ 
          error: "Insufficient workspace permissions",
          code: "INSUFFICIENT_WORKSPACE_PERMISSIONS",
          required: requiredRole,
          current: membership.role
        });
      }

      // Add workspace context to request
      req.workspace = workspace;
      req.workspaceMembership = membership;

      next();
    } catch (error) {
      console.error('Workspace access check failed:', error);
      res.status(500).json({ 
        error: "Internal server error",
        code: "INTERNAL_ERROR" 
      });
    }
  };
}

/**
 * Middleware to require specific workspace permission
 */
export function requireWorkspacePermission(permission: WorkspacePermission) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: "Authentication required",
          code: "AUTH_REQUIRED" 
        });
      }

      if (!req.workspaceMembership) {
        // Try to load workspace membership if not already loaded
        const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
        if (!workspaceId) {
          return res.status(400).json({ 
            error: "Workspace context required",
            code: "WORKSPACE_CONTEXT_REQUIRED" 
          });
        }

        const membership = await storage.getWorkspaceMembership(workspaceId, (req.user as RequestUser).id);
        if (!membership) {
          return res.status(403).json({ 
            error: "Access denied to workspace",
            code: "WORKSPACE_ACCESS_DENIED" 
          });
        }
        req.workspaceMembership = membership;
      }

      const userPermissions = getWorkspacePermissions(req.workspaceMembership.role);
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({ 
          error: "Insufficient workspace permissions",
          code: "INSUFFICIENT_WORKSPACE_PERMISSIONS",
          required: permission,
          userRole: req.workspaceMembership.role
        });
      }

      next();
    } catch (error) {
      console.error('Workspace permission check failed:', error);
      res.status(500).json({ 
        error: "Internal server error",
        code: "INTERNAL_ERROR" 
      });
    }
  };
}

/**
 * Middleware to check if user can access specific resource (like own data)
 */
export function requireResourceAccess(resourceUserIdField = 'userId') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: "Authentication required",
        code: "AUTH_REQUIRED" 
      });
    }

    // System admins can access any resource
    if (hasSystemRole((req.user as RequestUser).role, 'admin')) {
      return next();
    }

    // Check if user is accessing their own resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    if (resourceUserId && resourceUserId !== (req.user as RequestUser).id) {
      return res.status(403).json({ 
        error: "Access denied to resource",
        code: "RESOURCE_ACCESS_DENIED" 
      });
    }

    next();
  };
}
