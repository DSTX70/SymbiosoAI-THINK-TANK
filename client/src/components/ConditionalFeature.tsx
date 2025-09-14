import React, { ReactNode } from "react";
import { useEntitlements, type BillingFeature, type SystemPermission, type WorkspacePermission, BILLING_FEATURES, SYSTEM_PERMISSIONS, WORKSPACE_PERMISSIONS } from "@/hooks/useEntitlements";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Crown, Zap } from "lucide-react";

interface ConditionalFeatureProps {
  children: ReactNode;
  feature?: BillingFeature;
  systemPermission?: SystemPermission;
  workspacePermission?: WorkspacePermission;
  workspaceId?: string;
  role?: 'admin' | 'owner' | 'premium_user';
  plan?: 'pro' | 'enterprise';
  requireAuth?: boolean;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

/**
 * ConditionalFeature component for feature gating based on user permissions,
 * subscription plans, and entitlements.
 * 
 * This component renders its children only if the user has the required
 * permissions or features. It can show upgrade prompts, loading states,
 * and error states as needed.
 * 
 * @example
 * // Feature-based gating
 * <ConditionalFeature feature="advanced_ai" workspaceId={workspaceId}>
 *   <AdvancedAISettings />
 * </ConditionalFeature>
 * 
 * @example
 * // Permission-based gating  
 * <ConditionalFeature workspacePermission="manage_members" workspaceId={workspaceId}>
 *   <MemberManagement />
 * </ConditionalFeature>
 * 
 * @example
 * // Plan-based gating with upgrade prompt
 * <ConditionalFeature plan="pro" showUpgradePrompt>
 *   <PremiumFeature />
 * </ConditionalFeature>
 * 
 * @example
 * // Role-based gating
 * <ConditionalFeature role="admin">
 *   <AdminPanel />
 * </ConditionalFeature>
 */
export function ConditionalFeature({
  children,
  feature,
  systemPermission,
  workspacePermission,
  workspaceId,
  role,
  plan,
  requireAuth = true,
  fallback = null,
  showUpgradePrompt = false,
  loadingFallback,
  errorFallback,
  className,
  'data-testid': testId
}: ConditionalFeatureProps) {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { permissions, isLoading: entitlementsLoading, can, plan: currentPlan } = useEntitlements(workspaceId);

  // Show loading state while checking permissions
  const isLoading = authLoading || entitlementsLoading;
  
  if (isLoading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }
    return (
      <div className={className} data-testid={testId ? `${testId}-loading` : undefined}>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    if (errorFallback) {
      return <>{errorFallback}</>;
    }
    return (
      <div className={className} data-testid={testId ? `${testId}-auth-required` : undefined}>
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Please log in to access this feature.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Permission checking functions
  const checkAccess = (): { allowed: boolean; reason?: string; requiresUpgrade?: boolean } => {
    // Check role requirement
    if (role && user?.role !== role) {
      if (role === 'admin' && user?.role !== 'admin' && user?.role !== 'system_admin') {
        return { allowed: false, reason: "Admin access required" };
      }
      if (role === 'owner' && permissions.workspace.membershipRole !== 'owner') {
        return { allowed: false, reason: "Workspace owner access required" };
      }
      if (role === 'premium_user' && user?.role === 'user') {
        return { allowed: false, reason: "Premium account required", requiresUpgrade: true };
      }
    }

    // Check plan requirement
    if (plan) {
      if (plan === 'pro' && currentPlan === 'free') {
        return { allowed: false, reason: "Pro plan required", requiresUpgrade: true };
      }
      if (plan === 'enterprise' && (currentPlan === 'free' || currentPlan === 'pro')) {
        return { allowed: false, reason: "Enterprise plan required", requiresUpgrade: true };
      }
    }

    // Check system permission
    if (systemPermission && !can.createWorkspace()) { // Using available can functions
      const hasPermission = permissions.system.hasSystemPermission?.(systemPermission);
      if (!hasPermission) {
        return { allowed: false, reason: "Insufficient system permissions" };
      }
    }

    // Check workspace permission  
    if (workspacePermission && !workspaceId) {
      return { allowed: false, reason: "Workspace context required" };
    }
    
    if (workspacePermission && workspaceId) {
      const hasPermission = permissions.workspace.hasWorkspacePermission?.(workspacePermission);
      if (!hasPermission) {
        return { allowed: false, reason: "Insufficient workspace permissions" };
      }
    }

    // Check billing feature
    if (feature && workspaceId) {
      const hasFeature = permissions.workspace.hasFeature?.(feature);
      if (!hasFeature) {
        return { allowed: false, reason: getFeatureRequirementMessage(feature), requiresUpgrade: true };
      }
    }

    return { allowed: true };
  };

  const accessCheck = checkAccess();

  // If access is denied, show appropriate fallback
  if (!accessCheck.allowed) {
    if (showUpgradePrompt && accessCheck.requiresUpgrade) {
      return (
        <div className={className} data-testid={testId ? `${testId}-upgrade-required` : undefined}>
          <UpgradePrompt 
            feature={feature}
            reason={accessCheck.reason}
            currentPlan={currentPlan}
            workspaceId={workspaceId}
          />
        </div>
      );
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={className} data-testid={testId ? `${testId}-access-denied` : undefined}>
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            {accessCheck.reason || "Access denied"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Access granted - render children
  return (
    <div className={className} data-testid={testId}>
      {children}
    </div>
  );
}

// Helper function to get user-friendly feature requirement messages
function getFeatureRequirementMessage(feature: BillingFeature): string {
  switch (feature) {
    case BILLING_FEATURES.ADVANCED_AI:
      return "Advanced AI features require a Pro or Enterprise plan";
    case BILLING_FEATURES.EXPORT_PDF:
      return "PDF export requires a Pro or Enterprise plan";
    case BILLING_FEATURES.CUSTOM_TEMPLATES:
      return "Custom templates require a Pro or Enterprise plan";
    case BILLING_FEATURES.PREMIUM_SUPPORT:
      return "Premium support requires an Enterprise plan";
    case BILLING_FEATURES.UNLIMITED_SESSIONS:
      return "Unlimited sessions require a Pro or Enterprise plan";
    case BILLING_FEATURES.TEAM_COLLABORATION:
      return "Team collaboration requires a Pro or Enterprise plan";
    case BILLING_FEATURES.CUSTOM_BRANDING:
      return "Custom branding requires an Enterprise plan";
    case BILLING_FEATURES.SSO_INTEGRATION:
      return "SSO integration requires an Enterprise plan";
    case BILLING_FEATURES.ADVANCED_ANALYTICS:
      return "Advanced analytics require a Pro or Enterprise plan";
    case BILLING_FEATURES.PRIORITY_QUEUE:
      return "Priority processing requires an Enterprise plan";
    case BILLING_FEATURES.DEDICATED_SUPPORT:
      return "Dedicated support requires an Enterprise plan";
    case BILLING_FEATURES.CUSTOM_WORKFLOWS:
      return "Custom workflows require an Enterprise plan";
    default:
      return "This feature requires a premium plan";
  }
}

// Simplified UpgradePrompt component (will be in separate file)
interface UpgradePromptProps {
  feature?: BillingFeature;
  reason?: string;
  currentPlan: string;
  workspaceId?: string;
}

function UpgradePrompt({ feature, reason, currentPlan, workspaceId }: UpgradePromptProps) {
  const getUpgradeTarget = () => {
    if (feature && [
      BILLING_FEATURES.CUSTOM_BRANDING,
      BILLING_FEATURES.SSO_INTEGRATION,
      BILLING_FEATURES.PREMIUM_SUPPORT,
      BILLING_FEATURES.PRIORITY_QUEUE,
      BILLING_FEATURES.DEDICATED_SUPPORT,
      BILLING_FEATURES.CUSTOM_WORKFLOWS
    ].includes(feature)) {
      return "Enterprise";
    }
    return currentPlan === 'free' ? "Pro" : "Enterprise";
  };

  const upgradeTarget = getUpgradeTarget();

  return (
    <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <Crown className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <div className="font-medium text-orange-800">
            {reason || "Premium feature"}
          </div>
          <div className="text-sm text-orange-600 mt-1">
            Upgrade to {upgradeTarget} to unlock this feature
          </div>
        </div>
        <div className="ml-4">
          <a
            href={workspaceId ? `/billing?workspaceId=${workspaceId}` : '/billing'}
            className="inline-flex items-center px-3 py-1 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            data-testid="upgrade-button"
          >
            <Zap className="w-3 h-3 mr-1" />
            Upgrade
          </a>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Export additional utility components for specific use cases

/**
 * RequireFeature - A simple wrapper for feature-based conditional rendering
 */
export function RequireFeature({ 
  feature, 
  workspaceId, 
  children, 
  fallback 
}: {
  feature: BillingFeature;
  workspaceId: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ConditionalFeature 
      feature={feature} 
      workspaceId={workspaceId} 
      fallback={fallback}
      showUpgradePrompt={!fallback}
    >
      {children}
    </ConditionalFeature>
  );
}

/**
 * RequirePermission - A simple wrapper for permission-based conditional rendering
 */
export function RequirePermission({
  permission,
  workspaceId,
  children,
  fallback
}: {
  permission: WorkspacePermission;
  workspaceId?: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ConditionalFeature 
      workspacePermission={permission}
      workspaceId={workspaceId}
      fallback={fallback}
    >
      {children}
    </ConditionalFeature>
  );
}

/**
 * RequireRole - A simple wrapper for role-based conditional rendering
 */
export function RequireRole({
  role,
  children,
  fallback
}: {
  role: 'admin' | 'owner' | 'premium_user';
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ConditionalFeature 
      role={role}
      fallback={fallback}
    >
      {children}
    </ConditionalFeature>
  );
}

/**
 * RequirePlan - A simple wrapper for plan-based conditional rendering
 */
export function RequirePlan({
  plan,
  workspaceId,
  children,
  fallback
}: {
  plan: 'pro' | 'enterprise';
  workspaceId?: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ConditionalFeature 
      plan={plan}
      workspaceId={workspaceId}
      fallback={fallback}
      showUpgradePrompt={!fallback}
    >
      {children}
    </ConditionalFeature>
  );
}