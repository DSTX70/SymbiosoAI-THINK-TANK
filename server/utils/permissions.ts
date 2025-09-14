import type { User, WorkspaceMember, Subscription, Entitlement } from "@shared/schema";
import { storage } from "../storage";
import { 
  USER_ROLES, 
  getSystemPermissions, 
  getWorkspacePermissions,
  hasSystemRole,
  hasWorkspaceRole,
  type UserRole,
  type SystemPermission,
  type WorkspacePermission
} from "../middleware/rbac";
import { 
  BILLING_FEATURES, 
  PLAN_FEATURES, 
  PLAN_LIMITS,
  hasFeatureAccess,
  checkPlanLimit,
  getWorkspaceFeatures,
  type BillingFeature,
  type SubscriptionPlan
} from "../middleware/entitlements";

export interface PermissionContext {
  user: User;
  workspace?: any;
  workspaceMembership?: WorkspaceMember;
  subscription?: Subscription;
  entitlements?: Entitlement[];
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  code?: string;
  metadata?: any;
}

/**
 * Comprehensive permission checker class
 */
export class PermissionChecker {
  private context: PermissionContext;

  constructor(context: PermissionContext) {
    this.context = context;
  }

  /**
   * Check if user has system-level permission
   */
  canPerformSystemAction(permission: SystemPermission): PermissionResult {
    if (!this.context.user) {
      return {
        allowed: false,
        reason: "Authentication required",
        code: "AUTH_REQUIRED"
      };
    }

    const userPermissions = getSystemPermissions(this.context.user.role);
    const allowed = userPermissions.includes(permission);

    return {
      allowed,
      reason: allowed ? undefined : "Insufficient system permissions",
      code: allowed ? undefined : "INSUFFICIENT_SYSTEM_PERMISSIONS",
      metadata: {
        userRole: this.context.user.role,
        requiredPermission: permission
      }
    };
  }

  /**
   * Check if user has workspace-level permission
   */
  canPerformWorkspaceAction(permission: WorkspacePermission): PermissionResult {
    if (!this.context.user) {
      return {
        allowed: false,
        reason: "Authentication required",
        code: "AUTH_REQUIRED"
      };
    }

    if (!this.context.workspaceMembership) {
      return {
        allowed: false,
        reason: "Workspace membership required",
        code: "WORKSPACE_ACCESS_DENIED"
      };
    }

    const memberPermissions = getWorkspacePermissions(this.context.workspaceMembership.role);
    const allowed = memberPermissions.includes(permission);

    return {
      allowed,
      reason: allowed ? undefined : "Insufficient workspace permissions",
      code: allowed ? undefined : "INSUFFICIENT_WORKSPACE_PERMISSIONS",
      metadata: {
        membershipRole: this.context.workspaceMembership.role,
        requiredPermission: permission
      }
    };
  }

  /**
   * Check if user can access a specific billing feature
   */
  async canUseFeature(feature: BillingFeature): Promise<PermissionResult> {
    if (!this.context.user) {
      return {
        allowed: false,
        reason: "Authentication required",
        code: "AUTH_REQUIRED"
      };
    }

    if (!this.context.workspace) {
      return {
        allowed: false,
        reason: "Workspace context required",
        code: "WORKSPACE_CONTEXT_REQUIRED"
      };
    }

    try {
      const hasAccess = await hasFeatureAccess(this.context.workspace.id, feature);
      
      return {
        allowed: hasAccess,
        reason: hasAccess ? undefined : "Feature requires upgrade",
        code: hasAccess ? undefined : "FEATURE_REQUIRES_UPGRADE",
        metadata: {
          feature,
          workspaceId: this.context.workspace.id,
          plan: this.context.subscription?.plan || 'free'
        }
      };
    } catch (error) {
      return {
        allowed: false,
        reason: "Feature access check failed",
        code: "INTERNAL_ERROR"
      };
    }
  }

  /**
   * Check if user can create more of a specific resource
   */
  async canCreateResource(resource: keyof typeof PLAN_LIMITS.free, getCurrentUsage: () => Promise<number>): Promise<PermissionResult> {
    if (!this.context.user) {
      return {
        allowed: false,
        reason: "Authentication required",
        code: "AUTH_REQUIRED"
      };
    }

    if (!this.context.workspace) {
      return {
        allowed: false,
        reason: "Workspace context required",
        code: "WORKSPACE_CONTEXT_REQUIRED"
      };
    }

    try {
      const currentUsage = await getCurrentUsage();
      const limitCheck = await checkPlanLimit(this.context.workspace.id, resource, currentUsage);
      
      return {
        allowed: limitCheck.allowed,
        reason: limitCheck.allowed ? undefined : "Plan limit exceeded",
        code: limitCheck.allowed ? undefined : "PLAN_LIMIT_EXCEEDED",
        metadata: {
          resource,
          limit: limitCheck.limit,
          usage: limitCheck.usage,
          workspaceId: this.context.workspace.id
        }
      };
    } catch (error) {
      return {
        allowed: false,
        reason: "Resource limit check failed",
        code: "INTERNAL_ERROR"
      };
    }
  }

  /**
   * Check if user can access specific resource owned by another user
   */
  canAccessUserResource(resourceUserId: string): PermissionResult {
    if (!this.context.user) {
      return {
        allowed: false,
        reason: "Authentication required",
        code: "AUTH_REQUIRED"
      };
    }

    // Users can always access their own resources
    if (this.context.user.id === resourceUserId) {
      return { allowed: true };
    }

    // System admins can access any resource
    if (hasSystemRole(this.context.user.role, 'admin')) {
      return { 
        allowed: true,
        metadata: { accessType: 'admin_override' }
      };
    }

    // Workspace admins can access resources within their workspace
    if (this.context.workspaceMembership && hasWorkspaceRole(this.context.workspaceMembership.role, 'admin')) {
      return { 
        allowed: true,
        metadata: { accessType: 'workspace_admin' }
      };
    }

    return {
      allowed: false,
      reason: "Access denied to resource",
      code: "RESOURCE_ACCESS_DENIED",
      metadata: {
        resourceUserId,
        currentUserId: this.context.user.id
      }
    };
  }

  /**
   * Check if user can manage billing for workspace
   */
  canManageBilling(): PermissionResult {
    if (!this.context.user) {
      return {
        allowed: false,
        reason: "Authentication required",
        code: "AUTH_REQUIRED"
      };
    }

    if (!this.context.workspaceMembership) {
      return {
        allowed: false,
        reason: "Workspace membership required",
        code: "WORKSPACE_ACCESS_DENIED"
      };
    }

    // Only workspace owners can manage billing
    const allowed = this.context.workspaceMembership.role === 'owner';

    return {
      allowed,
      reason: allowed ? undefined : "Only workspace owners can manage billing",
      code: allowed ? undefined : "BILLING_OWNER_REQUIRED",
      metadata: {
        membershipRole: this.context.workspaceMembership.role
      }
    };
  }

  /**
   * Get complete permission summary for user
   */
  async getPermissionSummary(): Promise<{
    systemPermissions: SystemPermission[];
    workspacePermissions: WorkspacePermission[];
    availableFeatures: BillingFeature[];
    planLimits: any;
    canManageBilling: boolean;
  }> {
    const systemPermissions = this.context.user ? getSystemPermissions(this.context.user.role) : [];
    const workspacePermissions = this.context.workspaceMembership ? getWorkspacePermissions(this.context.workspaceMembership.role) : [];
    
    let availableFeatures: BillingFeature[] = [];
    let planLimits: any = {};
    
    if (this.context.workspace) {
      availableFeatures = await getWorkspaceFeatures(this.context.workspace.id);
      // Note: getWorkspaceLimits would need to be implemented
      // planLimits = await getWorkspaceLimits(this.context.workspace.id);
    }

    const billingPermission = this.canManageBilling();

    return {
      systemPermissions,
      workspacePermissions,
      availableFeatures,
      planLimits,
      canManageBilling: billingPermission.allowed
    };
  }
}

/**
 * Factory function to create PermissionChecker with loaded context
 */
export async function createPermissionChecker(
  user: User,
  workspaceId?: string
): Promise<PermissionChecker> {
  const context: PermissionContext = { user };

  if (workspaceId) {
    try {
      // Load workspace context
      const workspace = await storage.getWorkspace(workspaceId);
      if (workspace) {
        context.workspace = workspace;
      }

      // Load workspace membership
      const membership = await storage.getWorkspaceMembership(workspaceId, user.id);
      if (membership) {
        context.workspaceMembership = membership;
      }

      // Load subscription
      const subscription = await storage.getWorkspaceSubscription(workspaceId);
      if (subscription) {
        context.subscription = subscription;
      }

      // Load entitlements
      const entitlements = await storage.getWorkspaceEntitlements(workspaceId);
      context.entitlements = entitlements;

    } catch (error) {
      console.error('Failed to load workspace context for permission checker:', error);
    }
  }

  return new PermissionChecker(context);
}

/**
 * Utility functions for common permission checks
 */
export const PermissionUtils = {
  /**
   * Quick check if user can perform system action
   */
  async canUserPerformSystemAction(user: User, permission: SystemPermission): Promise<boolean> {
    const checker = new PermissionChecker({ user });
    const result = checker.canPerformSystemAction(permission);
    return result.allowed;
  },

  /**
   * Quick check if user can perform workspace action
   */
  async canUserPerformWorkspaceAction(
    user: User, 
    workspaceId: string, 
    permission: WorkspacePermission
  ): Promise<boolean> {
    try {
      const checker = await createPermissionChecker(user, workspaceId);
      const result = checker.canPerformWorkspaceAction(permission);
      return result.allowed;
    } catch (error) {
      console.error('Workspace permission check failed:', error);
      return false;
    }
  },

  /**
   * Quick check if user can use feature
   */
  async canUserUseFeature(user: User, workspaceId: string, feature: BillingFeature): Promise<boolean> {
    try {
      const checker = await createPermissionChecker(user, workspaceId);
      const result = await checker.canUseFeature(feature);
      return result.allowed;
    } catch (error) {
      console.error('Feature access check failed:', error);
      return false;
    }
  },

  /**
   * Quick check if user can access resource
   */
  async canUserAccessResource(user: User, resourceUserId: string, workspaceId?: string): Promise<boolean> {
    try {
      const checker = await createPermissionChecker(user, workspaceId);
      const result = checker.canAccessUserResource(resourceUserId);
      return result.allowed;
    } catch (error) {
      console.error('Resource access check failed:', error);
      return false;
    }
  },

  /**
   * Get user's effective permissions for workspace
   */
  async getUserWorkspacePermissions(user: User, workspaceId: string): Promise<{
    role: string;
    permissions: WorkspacePermission[];
    features: BillingFeature[];
  }> {
    try {
      const checker = await createPermissionChecker(user, workspaceId);
      const summary = await checker.getPermissionSummary();
      
      return {
        role: checker.context.workspaceMembership?.role || 'none',
        permissions: summary.workspacePermissions,
        features: summary.availableFeatures
      };
    } catch (error) {
      console.error('Failed to get user workspace permissions:', error);
      return {
        role: 'none',
        permissions: [],
        features: []
      };
    }
  }
};