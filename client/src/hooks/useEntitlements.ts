import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

// Define billing features (matching backend enum)
export const BILLING_FEATURES = {
  ADVANCED_AI: "advanced_ai",
  EXPORT_PDF: "export_pdf", 
  CUSTOM_TEMPLATES: "custom_templates",
  PREMIUM_SUPPORT: "premium_support",
  UNLIMITED_SESSIONS: "unlimited_sessions",
  TEAM_COLLABORATION: "team_collaboration",
  CUSTOM_BRANDING: "custom_branding",
  SSO_INTEGRATION: "sso_integration",
  ADVANCED_ANALYTICS: "advanced_analytics",
  PRIORITY_QUEUE: "priority_queue",
  DEDICATED_SUPPORT: "dedicated_support",
  CUSTOM_WORKFLOWS: "custom_workflows"
} as const;

export type BillingFeature = typeof BILLING_FEATURES[keyof typeof BILLING_FEATURES];

// Define user roles (matching backend EXACTLY - CRITICAL FOR SECURITY)
export const USER_ROLES = {
  user: 1,           // Basic user (default role in schema)
  premium_user: 2,   // Premium individual user
  viewer: 1,         // Workspace role
  member: 2,         // Workspace role
  admin: 3,          // System or workspace admin
  owner: 4,          // Workspace owner
  system_admin: 5    // System-wide admin
} as const;

export type UserRole = keyof typeof USER_ROLES;

// Define system permissions (matching backend)
export const SYSTEM_PERMISSIONS = {
  CREATE_WORKSPACE: "create_workspace",
  MANAGE_USERS: "manage_users",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  MANAGE_BILLING: "manage_billing",
  ADMIN_DASHBOARD: "admin_dashboard"
} as const;

// Define workspace permissions (matching backend)
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
  VIEW_ANALYTICS: "view_analytics"
} as const;

export type SystemPermission = typeof SYSTEM_PERMISSIONS[keyof typeof SYSTEM_PERMISSIONS];
export type WorkspacePermission = typeof WORKSPACE_PERMISSIONS[keyof typeof WORKSPACE_PERMISSIONS];

// Define plan limits and features (MUST MATCH BACKEND EXACTLY FOR SECURITY)
export const PLAN_FEATURES = {
  free: [
    // Free tier has very limited features
  ] as BillingFeature[],
  pro: [
    BILLING_FEATURES.ADVANCED_AI,
    BILLING_FEATURES.EXPORT_PDF,
    BILLING_FEATURES.CUSTOM_TEMPLATES,
    BILLING_FEATURES.UNLIMITED_SESSIONS,
    BILLING_FEATURES.TEAM_COLLABORATION,
    BILLING_FEATURES.ADVANCED_ANALYTICS
  ] as BillingFeature[],
  enterprise: [
    BILLING_FEATURES.ADVANCED_AI,
    BILLING_FEATURES.EXPORT_PDF,
    BILLING_FEATURES.CUSTOM_TEMPLATES,
    BILLING_FEATURES.PREMIUM_SUPPORT,
    BILLING_FEATURES.UNLIMITED_SESSIONS,
    BILLING_FEATURES.TEAM_COLLABORATION,
    BILLING_FEATURES.CUSTOM_BRANDING,
    BILLING_FEATURES.SSO_INTEGRATION,
    BILLING_FEATURES.ADVANCED_ANALYTICS,
    BILLING_FEATURES.PRIORITY_QUEUE,
    BILLING_FEATURES.DEDICATED_SUPPORT,
    BILLING_FEATURES.CUSTOM_WORKFLOWS
  ] as BillingFeature[],
  custom: [] as BillingFeature[] // Custom plans have entitlements defined individually
} as const;

export type SubscriptionPlan = keyof typeof PLAN_FEATURES;

// Entitlements response interface
interface WorkspaceEntitlementsResponse {
  workspaceId: string;
  subscription?: {
    id: string;
    plan: SubscriptionPlan;
    status: string;
    currentPeriodEnd: string;
    seats: number;
  };
  entitlements: Array<{
    id: string;
    feature: BillingFeature;
    grantedAt: string;
    expiresAt?: string;
  }>;
  membership?: {
    role: UserRole;
    joinedAt: string;
  };
  features: BillingFeature[];
  limits: {
    workspaces: number;
    members_per_workspace: number;
    sessions_per_month: number;
    storage_gb: number;
    templates: number;
    ai_calls_per_hour: number;
  };
  usage: {
    workspaces?: number;
    members_per_workspace?: number;
    sessions_per_month?: number;
    storage_gb?: number;
    templates?: number;
  };
}

interface UserPermissionsResponse {
  systemPermissions: SystemPermission[];
  role: string;
  canManageBilling: boolean;
}

// Hook for checking user system permissions
export function useUserPermissions() {
  const { isAuthenticated, user } = useAuth();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: async (): Promise<UserPermissionsResponse> => {
      const response = await fetch("/api/user/permissions");
      if (!response.ok) {
        throw new Error("Failed to fetch user permissions");
      }
      return response.json();
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasSystemPermission = (permission: SystemPermission): boolean => {
    return permissions?.systemPermissions.includes(permission) ?? false;
  };

  const hasSystemRole = (requiredRole: UserRole): boolean => {
    const userRole = user?.role as UserRole;
    if (!userRole) return false;
    
    const userRoleLevel = USER_ROLES[userRole] || 0;
    const requiredRoleLevel = USER_ROLES[requiredRole];
    return userRoleLevel >= requiredRoleLevel;
  };

  return {
    permissions,
    isLoading,
    hasSystemPermission,
    hasSystemRole,
    canManageBilling: permissions?.canManageBilling ?? false,
    isAdmin: hasSystemRole('admin'),
    role: user?.role as UserRole
  };
}

// Hook for checking workspace entitlements
export function useWorkspaceEntitlements(workspaceId?: string) {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const { data: entitlements, isLoading, error } = useQuery({
    queryKey: ["workspace-entitlements", workspaceId],
    queryFn: async (): Promise<WorkspaceEntitlementsResponse> => {
      if (!workspaceId) {
        throw new Error("Workspace ID is required");
      }
      
      const response = await fetch(`/api/workspaces/${workspaceId}/entitlements`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied to workspace");
        }
        if (response.status === 404) {
          throw new Error("Workspace not found");
        }
        throw new Error("Failed to fetch workspace entitlements");
      }
      return response.json();
    },
    enabled: isAuthenticated && !!user && !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on 403 or 404 errors
      if (error.message.includes("Access denied") || error.message.includes("not found")) {
        return false;
      }
      return failureCount < 3;
    }
  });

  const hasFeature = (feature: BillingFeature): boolean => {
    return entitlements?.features.includes(feature) ?? false;
  };

  const hasWorkspacePermission = (permission: WorkspacePermission): boolean => {
    if (!entitlements?.membership) return false;
    
    const role = entitlements.membership.role;
    const roleLevel = USER_ROLES[role] || 0;
    
    // Define permission requirements (simplified)
    const permissionRequirements: Record<WorkspacePermission, number> = {
      [WORKSPACE_PERMISSIONS.READ_WORKSPACE]: USER_ROLES.viewer,
      [WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE]: USER_ROLES.admin,
      [WORKSPACE_PERMISSIONS.DELETE_WORKSPACE]: USER_ROLES.owner,
      [WORKSPACE_PERMISSIONS.MANAGE_MEMBERS]: USER_ROLES.admin,
      [WORKSPACE_PERMISSIONS.INVITE_MEMBERS]: USER_ROLES.admin,
      [WORKSPACE_PERMISSIONS.CREATE_SESSIONS]: USER_ROLES.member,
      [WORKSPACE_PERMISSIONS.DELETE_SESSIONS]: USER_ROLES.admin,
      [WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES]: USER_ROLES.admin,
      [WORKSPACE_PERMISSIONS.EXPORT_DATA]: USER_ROLES.member,
      [WORKSPACE_PERMISSIONS.VIEW_ANALYTICS]: USER_ROLES.admin
    };

    const requiredLevel = permissionRequirements[permission] || USER_ROLES.owner;
    return roleLevel >= requiredLevel;
  };

  const checkPlanLimit = (resource: keyof WorkspaceEntitlementsResponse['limits']): {
    allowed: boolean;
    limit: number;
    usage: number;
    percentage: number;
  } => {
    if (!entitlements) {
      return { allowed: false, limit: 0, usage: 0, percentage: 100 };
    }

    const limit = entitlements.limits[resource];
    const usage = entitlements.usage[resource] || 0;
    
    // -1 means unlimited
    if (limit === -1) {
      return { allowed: true, limit: -1, usage, percentage: 0 };
    }

    const allowed = usage < limit;
    const percentage = limit > 0 ? (usage / limit) * 100 : 100;

    return { allowed, limit, usage, percentage };
  };

  const refreshEntitlements = () => {
    if (workspaceId) {
      queryClient.invalidateQueries({ queryKey: ["workspace-entitlements", workspaceId] });
    }
  };

  return {
    entitlements,
    isLoading,
    error,
    hasFeature,
    hasWorkspacePermission,
    checkPlanLimit,
    refreshEntitlements,
    plan: entitlements?.subscription?.plan || 'free',
    isActiveSubscription: entitlements?.subscription?.status === 'active',
    membershipRole: entitlements?.membership?.role,
    canManageBilling: entitlements?.membership?.role === 'owner'
  };
}

// Hook for template access checking
export function useTemplateAccess(templateId?: string, workspaceId?: string) {
  const { isAuthenticated, user } = useAuth();

  const { data: access, isLoading } = useQuery({
    queryKey: ["template-access", templateId, workspaceId],
    queryFn: async (): Promise<{
      hasAccess: boolean;
      isPurchased: boolean;
      isPublic: boolean;
      requiresPurchase: boolean;
      price?: number;
      currency?: string;
    }> => {
      if (!templateId || !workspaceId) {
        throw new Error("Template ID and Workspace ID are required");
      }
      
      const response = await fetch(`/api/templates/${templateId}/access?workspaceId=${workspaceId}`);
      if (!response.ok) {
        throw new Error("Failed to check template access");
      }
      return response.json();
    },
    enabled: isAuthenticated && !!user && !!templateId && !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    access,
    isLoading,
    hasAccess: access?.hasAccess ?? false,
    isPurchased: access?.isPurchased ?? false,
    isPublic: access?.isPublic ?? false,
    requiresPurchase: access?.requiresPurchase ?? false,
    price: access?.price,
    currency: access?.currency
  };
}

// Main entitlements hook that combines everything
export function useEntitlements(workspaceId?: string) {
  const userPermissions = useUserPermissions();
  const workspaceEntitlements = useWorkspaceEntitlements(workspaceId);

  // Memoized combined permissions
  const permissions = useMemo(() => ({
    // System-level permissions
    system: {
      ...userPermissions,
      isLoading: userPermissions.isLoading
    },
    // Workspace-level permissions  
    workspace: {
      ...workspaceEntitlements,
      isLoading: workspaceEntitlements.isLoading
    }
  }), [userPermissions, workspaceEntitlements]);

  const isLoading = userPermissions.isLoading || workspaceEntitlements.isLoading;

  // Quick access functions
  const can = {
    // System permissions
    createWorkspace: () => userPermissions.hasSystemPermission(SYSTEM_PERMISSIONS.CREATE_WORKSPACE),
    manageUsers: () => userPermissions.hasSystemPermission(SYSTEM_PERMISSIONS.MANAGE_USERS),
    viewAuditLogs: () => userPermissions.hasSystemPermission(SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS),
    manageBilling: () => userPermissions.canManageBilling,
    
    // Workspace permissions
    readWorkspace: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.READ_WORKSPACE),
    updateWorkspace: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.UPDATE_WORKSPACE),
    deleteWorkspace: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.DELETE_WORKSPACE),
    manageMembers: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_MEMBERS),
    inviteMembers: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.INVITE_MEMBERS),
    createSessions: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.CREATE_SESSIONS),
    deleteSessions: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.DELETE_SESSIONS),
    manageTemplates: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES),
    exportData: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.EXPORT_DATA),
    viewAnalytics: () => workspaceEntitlements.hasWorkspacePermission(WORKSPACE_PERMISSIONS.VIEW_ANALYTICS),
    
    // Feature access
    useAdvancedAI: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.ADVANCED_AI),
    exportPDF: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.EXPORT_PDF),
    useCustomTemplates: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.CUSTOM_TEMPLATES),
    accessPremiumSupport: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.PREMIUM_SUPPORT),
    unlimitedSessions: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.UNLIMITED_SESSIONS),
    teamCollaboration: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.TEAM_COLLABORATION),
    customBranding: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.CUSTOM_BRANDING),
    ssoIntegration: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.SSO_INTEGRATION),
    advancedAnalytics: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.ADVANCED_ANALYTICS),
    priorityQueue: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.PRIORITY_QUEUE),
    dedicatedSupport: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.DEDICATED_SUPPORT),
    customWorkflows: () => workspaceEntitlements.hasFeature(BILLING_FEATURES.CUSTOM_WORKFLOWS)
  };

  return {
    permissions,
    isLoading,
    can,
    plan: workspaceEntitlements.plan,
    isActiveSubscription: workspaceEntitlements.isActiveSubscription,
    membershipRole: workspaceEntitlements.membershipRole,
    checkPlanLimit: workspaceEntitlements.checkPlanLimit,
    refresh: () => {
      userPermissions.permissions && userPermissions.isLoading; // Trigger refetch
      workspaceEntitlements.refreshEntitlements();
    }
  };
}