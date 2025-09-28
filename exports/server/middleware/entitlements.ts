import type { Request, Response, NextFunction } from "express";
import type { User, Subscription, Entitlement } from "@shared/schema";
import { storage } from "../storage";

// Define billing features enum (matches schema)
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
  CUSTOM_WORKFLOWS: "custom_workflows",
  INTEGRATIONS: "integrations"
} as const;

export type BillingFeature = typeof BILLING_FEATURES[keyof typeof BILLING_FEATURES];

// Define subscription plan capabilities
export const PLAN_FEATURES = {
  free: [
    // Free tier has very limited features
  ],
  demo: [
    // Demo plan only grants access to Expert mode (ADVANCED_AI)
    BILLING_FEATURES.ADVANCED_AI
  ],
  pro: [
    BILLING_FEATURES.ADVANCED_AI,
    BILLING_FEATURES.EXPORT_PDF,
    BILLING_FEATURES.CUSTOM_TEMPLATES,
    BILLING_FEATURES.UNLIMITED_SESSIONS,
    BILLING_FEATURES.TEAM_COLLABORATION,
    BILLING_FEATURES.ADVANCED_ANALYTICS
  ],
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
  ],
  custom: [] // Custom plans have entitlements defined individually
} as const;

// Define plan limits and quotas
export const PLAN_LIMITS = {
  free: {
    workspaces: 1,
    members_per_workspace: 3,
    sessions_per_month: 10,
    storage_gb: 1,
    templates: 5,
    ai_calls_per_hour: 100
  },
  demo: {
    // Demo plan has same limits as free but with ADVANCED_AI access
    workspaces: 1,
    members_per_workspace: 3,
    sessions_per_month: 50, // Slightly higher for demos
    storage_gb: 1,
    templates: 5,
    ai_calls_per_hour: 200 // Higher for demo purposes
  },
  pro: {
    workspaces: 5,
    members_per_workspace: 20,
    sessions_per_month: 1000,
    storage_gb: 50,
    templates: 100,
    ai_calls_per_hour: 1000
  },
  enterprise: {
    workspaces: -1, // unlimited
    members_per_workspace: -1, // unlimited
    sessions_per_month: -1, // unlimited
    storage_gb: 500,
    templates: -1, // unlimited
    ai_calls_per_hour: 10000
  },
  custom: {
    workspaces: -1, // determined by individual entitlements
    members_per_workspace: -1,
    sessions_per_month: -1,
    storage_gb: -1,
    templates: -1,
    ai_calls_per_hour: -1
  }
} as const;

export type SubscriptionPlan = keyof typeof PLAN_FEATURES;

// Extend Request interface for entitlements context
declare global {
  namespace Express {
    interface Request {
      subscription?: Subscription;
      entitlements?: Entitlement[];
    }
  }
}

/**
 * Load subscription and entitlements context for the workspace
 * SECURITY CRITICAL: This establishes billing context for all feature/limit checks
 */
export async function loadEntitlementsContext(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return next(); // Skip if not authenticated
    }

    // Ensure demo users have demo subscription context
    const isDemo = Boolean((req.user as any).isDemo);
    if (isDemo && !(req.user as any).subscription) {
      (req.user as any).subscription = { plan: 'demo' };
    }

    const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
    
    if (!workspaceId) {
      // For non-workspace operations, use user's default subscription context
      const userSubscription = req.user.subscription as any;
      const plan = userSubscription?.plan || (isDemo ? 'demo' : 'free');
      
      req.subscription = {
        id: 'user-subscription',
        workspaceId: null,
        plan: plan,
        status: 'active',
        currentPeriodEnd: new Date(),
        seats: 1
      } as any;
      
      return next();
    }

    // Load subscription for this workspace
    const subscription = await storage.getWorkspaceSubscription(workspaceId);
    if (subscription) {
      req.subscription = subscription;
    } else {
      // Fallback to workspace owner's subscription or free plan
      const workspace = await storage.getWorkspace(workspaceId);
      if (workspace) {
        const owner = await storage.getUser(workspace.ownerId);
        if (owner?.subscription) {
          const ownerSub = owner.subscription as any;
          req.subscription = {
            id: `fallback-${workspaceId}`,
            workspaceId: workspaceId,
            plan: ownerSub.plan || 'free',
            status: 'active',
            currentPeriodEnd: new Date(),
            seats: 1
          } as any;
        }
      }
    }

    // Load entitlements for this workspace
    const entitlements = await storage.getWorkspaceEntitlements(workspaceId);
    req.entitlements = entitlements || [];

    next();
  } catch (error) {
    console.error('Failed to load entitlements context:', error);
    // Set minimal context on error to prevent failures
    req.subscription = {
      id: 'error-fallback',
      workspaceId: null,
      plan: 'free',
      status: 'active',
      currentPeriodEnd: new Date(),
      seats: 1
    } as any;
    req.entitlements = [];
    next();
  }
}

/**
 * Check if workspace has access to a specific feature
 * SECURITY CRITICAL: This determines feature access across the application
 */
export async function hasFeatureAccess(workspaceId: string, feature: BillingFeature): Promise<boolean> {
  try {
    if (!workspaceId) {
      // For system-level checks without workspace context, deny access to premium features
      const freeFeatures = PLAN_FEATURES.free;
      return freeFeatures.includes(feature);
    }

    // Load subscription and entitlements
    const subscription = await storage.getWorkspaceSubscription(workspaceId);
    const entitlements = await storage.getWorkspaceEntitlements(workspaceId);

    // Check if feature is explicitly granted via entitlement
    const directEntitlement = entitlements?.find(e => 
      e.feature === feature && 
      (!e.expiresAt || new Date(e.expiresAt) > new Date())
    );

    if (directEntitlement) {
      return true;
    }

    // Check if feature is included in subscription plan
    if (subscription && subscription.status === 'active') {
      const planFeatures = PLAN_FEATURES[subscription.plan as SubscriptionPlan] || [];
      return planFeatures.includes(feature);
    }

    // Fallback to workspace owner's plan if no workspace subscription
    const workspace = await storage.getWorkspace(workspaceId);
    if (workspace) {
      const owner = await storage.getUser(workspace.ownerId);
      if (owner?.subscription) {
        const ownerSub = owner.subscription as any;
        const planFeatures = PLAN_FEATURES[ownerSub.plan as SubscriptionPlan] || PLAN_FEATURES.free;
        return planFeatures.includes(feature);
      }
    }

    // Default to free plan features if no subscription found
    const freeFeatures = PLAN_FEATURES.free;
    return freeFeatures.includes(feature);

  } catch (error) {
    console.error('Feature access check failed:', error);
    return false; // Deny access on error
  }
}

/**
 * Check if workspace is within plan limits for a specific resource
 * SECURITY CRITICAL: This enforces billing limits across the application
 */
export async function checkPlanLimit(
  workspaceId: string, 
  resource: keyof typeof PLAN_LIMITS.free,
  currentUsage: number
): Promise<{ allowed: boolean; limit: number; usage: number; plan: string }> {
  try {
    if (!workspaceId) {
      // For system-level checks without workspace context, use free plan limits
      const limit = PLAN_LIMITS.free[resource];
      const allowed = limit === -1 || currentUsage < limit;
      return { allowed, limit, usage: currentUsage, plan: 'free' };
    }

    let plan: SubscriptionPlan = 'free';
    let subscription = await storage.getWorkspaceSubscription(workspaceId);
    
    if (subscription && subscription.status === 'active') {
      plan = subscription.plan as SubscriptionPlan;
    } else {
      // Fallback to workspace owner's plan
      const workspace = await storage.getWorkspace(workspaceId);
      if (workspace) {
        const owner = await storage.getUser(workspace.ownerId);
        if (owner?.subscription) {
          const ownerSub = owner.subscription as any;
          plan = ownerSub.plan as SubscriptionPlan || 'free';
        }
      }
    }
    
    const limit = PLAN_LIMITS[plan][resource];
    
    // -1 means unlimited
    if (limit === -1) {
      return { allowed: true, limit: -1, usage: currentUsage, plan };
    }

    const allowed = currentUsage < limit;
    return { allowed, limit, usage: currentUsage, plan };

  } catch (error) {
    console.error('Plan limit check failed:', error);
    // Default to free plan limits on error
    const limit = PLAN_LIMITS.free[resource];
    const allowed = limit === -1 || currentUsage < limit;
    return { allowed, limit, usage: currentUsage, plan: 'free' };
  }
}

/**
 * Middleware to require specific feature access
 */
export function requireFeature(feature: BillingFeature) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: "Authentication required",
          code: "AUTH_REQUIRED" 
        });
      }

      const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
      
      // Determine user's plan: demo users get 'demo' plan, others use their subscription plan
      const isDemo = Boolean((req.user as any).isDemo);
      const userSubscription = req.user.subscription as any;
      const userPlan = userSubscription?.plan || (isDemo ? 'demo' : 'free');
      
      // Special handling for ADVANCED_AI feature - allow non-workspace usage for individual users
      if (!workspaceId && feature === BILLING_FEATURES.ADVANCED_AI) {
        // Check if user has ADVANCED_AI access through their individual subscription
        if (PLAN_FEATURES[userPlan]?.includes(feature)) {
          return next(); // User has individual access to ADVANCED_AI (including demo users)
        }
        
        // If user doesn't have individual access, they need workspace context
        return res.status(400).json({ 
          error: "Workspace context required for Expert mode analysis. Please create a workspace or upgrade your plan.",
          code: "WORKSPACE_CONTEXT_REQUIRED" 
        });
      }
      
      if (!workspaceId) {
        return res.status(400).json({ 
          error: "Workspace context required for feature access",
          code: "WORKSPACE_CONTEXT_REQUIRED" 
        });
      }

      const hasAccess = await hasFeatureAccess(workspaceId, feature);
      
      if (!hasAccess) {
        return res.status(402).json({ 
          error: "Feature requires upgrade",
          code: "FEATURE_REQUIRES_UPGRADE",
          feature: feature,
          workspaceId: workspaceId
        });
      }

      next();
    } catch (error) {
      console.error('Feature requirement check failed:', error);
      res.status(500).json({ 
        error: "Internal server error",
        code: "INTERNAL_ERROR" 
      });
    }
  };
}

/**
 * Middleware to check plan limits before allowing resource creation
 */
export function requirePlanLimit(resource: keyof typeof PLAN_LIMITS.free, getCurrentUsage: (workspaceId: string) => Promise<number>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: "Authentication required",
          code: "AUTH_REQUIRED" 
        });
      }

      const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
      
      if (!workspaceId) {
        return res.status(400).json({ 
          error: "Workspace context required for limit check",
          code: "WORKSPACE_CONTEXT_REQUIRED" 
        });
      }

      const currentUsage = await getCurrentUsage(workspaceId);
      const limitCheck = await checkPlanLimit(workspaceId, resource, currentUsage);
      
      if (!limitCheck.allowed) {
        return res.status(402).json({ 
          error: "Plan limit exceeded",
          code: "PLAN_LIMIT_EXCEEDED",
          resource: resource,
          limit: limitCheck.limit,
          usage: limitCheck.usage,
          workspaceId: workspaceId
        });
      }

      next();
    } catch (error) {
      console.error('Plan limit check failed:', error);
      res.status(500).json({ 
        error: "Internal server error",
        code: "INTERNAL_ERROR" 
      });
    }
  };
}

/**
 * Middleware to check if workspace has active subscription
 */
export function requireActiveSubscription(req: Request, res: Response, next: NextFunction) {
  const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
  
  if (!workspaceId) {
    return res.status(400).json({ 
      error: "Workspace context required",
      code: "WORKSPACE_CONTEXT_REQUIRED" 
    });
  }

  if (!req.subscription) {
    return res.status(402).json({ 
      error: "Active subscription required",
      code: "SUBSCRIPTION_REQUIRED",
      workspaceId: workspaceId
    });
  }

  if (req.subscription.status !== 'active') {
    return res.status(402).json({ 
      error: "Active subscription required",
      code: "SUBSCRIPTION_INACTIVE",
      status: req.subscription.status,
      workspaceId: workspaceId
    });
  }

  next();
}

/**
 * Get all features available to a workspace
 */
export async function getWorkspaceFeatures(workspaceId: string): Promise<BillingFeature[]> {
  try {
    const subscription = await storage.getWorkspaceSubscription(workspaceId);
    const entitlements = await storage.getWorkspaceEntitlements(workspaceId);

    const features = new Set<BillingFeature>();

    // Add plan-based features
    if (subscription && subscription.status === 'active') {
      const planFeatures = PLAN_FEATURES[subscription.plan as SubscriptionPlan] || [];
      planFeatures.forEach(feature => features.add(feature));
    } else {
      // Add free plan features
      PLAN_FEATURES.free.forEach(feature => features.add(feature));
    }

    // Add entitlement-based features (including template purchases)
    entitlements.forEach(entitlement => {
      if (!entitlement.expiresAt || new Date(entitlement.expiresAt) > new Date()) {
        features.add(entitlement.feature as BillingFeature);
      }
    });

    return Array.from(features);
  } catch (error) {
    console.error('Failed to get workspace features:', error);
    return [...PLAN_FEATURES.free]; // Return free features on error
  }
}

/**
 * Get workspace limits and current usage
 */
export async function getWorkspaceLimits(workspaceId: string): Promise<{
  plan: SubscriptionPlan;
  limits: typeof PLAN_LIMITS.free;
  usage: Partial<typeof PLAN_LIMITS.free>;
}> {
  try {
    const subscription = await storage.getWorkspaceSubscription(workspaceId);
    const plan = subscription?.plan as SubscriptionPlan || 'free';
    const limits = PLAN_LIMITS[plan];

    // Get current usage (you would implement these methods in storage)
    const [
      workspaceCount,
      memberCount,
      sessionCount,
      storageUsage,
      templateCount
    ] = await Promise.all([
      storage.getUserWorkspacesCount(workspaceId), // Implement this
      storage.getWorkspaceMemberCount(workspaceId), // Implement this
      storage.getWorkspaceSessionCount(workspaceId, 'monthly'), // Implement this
      storage.getWorkspaceStorageUsage(workspaceId), // Implement this
      storage.getWorkspaceTemplateCount(workspaceId) // Implement this
    ]);

    const usage = {
      workspaces: workspaceCount,
      members_per_workspace: memberCount,
      sessions_per_month: sessionCount,
      storage_gb: Math.round(storageUsage / 1024 / 1024 / 1024), // Convert to GB
      templates: templateCount
    };

    return { plan, limits, usage };
  } catch (error) {
    console.error('Failed to get workspace limits:', error);
    return {
      plan: 'free',
      limits: PLAN_LIMITS.free,
      usage: {}
    };
  }
}