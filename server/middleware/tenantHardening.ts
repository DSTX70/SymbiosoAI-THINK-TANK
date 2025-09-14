import type { Request, Response, NextFunction } from "express";

/**
 * Sprint 6 - Tenant Hardening Middleware
 * Provides X-Organization-Id header validation and RLS preparation patterns
 */

// Extend Express Request type to include organization context
declare global {
  namespace Express {
    interface Request {
      organization?: {
        id: string;
        enforced: boolean;
      };
    }
  }
}

/**
 * Organization context interface
 */
export interface OrganizationContext {
  id: string;
  enforced: boolean;
}

/**
 * Middleware to validate and extract organization context from headers
 */
export function organizationHeaderValidation(req: Request, res: Response, next: NextFunction): void {
  const orgHeader = req.headers['x-organization-id'] as string;
  const requireOrgHeader = process.env.REQUIRE_ORG_HEADER === 'true';
  
  // Check if organization header is required
  if (requireOrgHeader) {
    if (!orgHeader) {
      console.warn('🚫 Missing required X-Organization-Id header');
      res.status(400).json({
        error: 'Missing organization context',
        message: 'X-Organization-Id header is required',
        code: 'MISSING_ORG_HEADER'
      });
      return;
    }
    
    // Validate organization ID format
    if (!isValidOrganizationId(orgHeader)) {
      console.warn(`🚫 Invalid organization ID format: ${orgHeader}`);
      res.status(400).json({
        error: 'Invalid organization context',
        message: 'X-Organization-Id header must be a valid organization identifier',
        code: 'INVALID_ORG_ID'
      });
      return;
    }
    
    console.log(`🏢 Organization context enforced: ${orgHeader}`);
    
    // Set organization context with enforcement
    req.organization = {
      id: orgHeader,
      enforced: true
    };
  } else {
    // Optional organization header mode
    if (orgHeader && isValidOrganizationId(orgHeader)) {
      console.log(`🏢 Organization context provided: ${orgHeader}`);
      req.organization = {
        id: orgHeader,
        enforced: false
      };
    } else if (orgHeader) {
      console.warn(`⚠️ Invalid organization header provided: ${orgHeader}`);
      res.status(400).json({
        error: 'Invalid organization context',
        message: 'X-Organization-Id header format is invalid',
        code: 'INVALID_ORG_ID'
      });
      return;
    }
  }
  
  next();
}

/**
 * Middleware specifically for endpoints that require organization context
 */
export function requireOrganizationContext(req: Request, res: Response, next: NextFunction): void {
  if (!req.organization?.id) {
    console.warn('🚫 Organization context required but not provided');
    res.status(400).json({
      error: 'Organization context required',
      message: 'This endpoint requires X-Organization-Id header',
      code: 'ORG_CONTEXT_REQUIRED'
    });
    return;
  }
  
  console.log(`✅ Organization context validated: ${req.organization.id}`);
  next();
}

/**
 * Get organization context from request
 */
export function getOrganizationContext(req: Request): OrganizationContext | null {
  return req.organization || null;
}

/**
 * Check if organization context is enforced
 */
export function isOrganizationEnforced(): boolean {
  return process.env.REQUIRE_ORG_HEADER === 'true';
}

/**
 * Validate organization ID format
 */
function isValidOrganizationId(orgId: string): boolean {
  if (!orgId || typeof orgId !== 'string') {
    return false;
  }
  
  // Allow alphanumeric, hyphens, and underscores, length 1-50 characters
  const orgIdPattern = /^[a-zA-Z0-9_-]{1,50}$/;
  return orgIdPattern.test(orgId);
}

/**
 * RLS Helper: Build organization-scoped WHERE clause
 * This prepares queries for Row Level Security patterns
 */
export function buildOrgScopedWhereClause(req: Request, baseConditions: any = {}): any {
  const orgContext = getOrganizationContext(req);
  
  if (orgContext?.id) {
    return {
      ...baseConditions,
      organizationId: orgContext.id
    };
  }
  
  // If no organization context and not enforced, return base conditions
  // In production RLS, PostgreSQL policies would handle this
  return baseConditions;
}

/**
 * RLS Helper: Validate organization access
 * Checks if the current organization context can access a resource
 */
export function validateOrganizationAccess(
  req: Request, 
  resourceOrganizationId: string | undefined
): boolean {
  const orgContext = getOrganizationContext(req);
  
  // If organization context is not enforced, allow access
  if (!isOrganizationEnforced()) {
    return true;
  }
  
  // If organization context is enforced, must match
  if (!orgContext?.id || !resourceOrganizationId) {
    return false;
  }
  
  return orgContext.id === resourceOrganizationId;
}

/**
 * RLS Helper: Get default organization ID for inserts
 */
export function getDefaultOrganizationId(req: Request): string {
  const orgContext = getOrganizationContext(req);
  
  if (orgContext?.id) {
    return orgContext.id;
  }
  
  // Fallback for development/non-enforced mode
  return 'default-organization';
}

/**
 * Middleware to log organization context for debugging
 */
export function logOrganizationContext(req: Request, res: Response, next: NextFunction): void {
  const orgContext = getOrganizationContext(req);
  const path = req.path;
  const method = req.method;
  
  if (orgContext) {
    console.log(`🏢 [${method} ${path}] Organization: ${orgContext.id} (enforced: ${orgContext.enforced})`);
  } else {
    console.log(`🏢 [${method} ${path}] No organization context`);
  }
  
  next();
}

/**
 * Express middleware factory for RLS-ready route protection
 */
export function createRLSMiddleware(options: {
  requireOrganization?: boolean;
  logContext?: boolean;
} = {}) {
  const { requireOrganization = false, logContext = false } = options;
  
  return [
    organizationHeaderValidation,
    ...(logContext ? [logOrganizationContext] : []),
    ...(requireOrganization ? [requireOrganizationContext] : [])
  ];
}

/**
 * Configuration helper for tenant hardening setup
 */
export function getTenantHardeningConfig() {
  return {
    requireOrgHeader: process.env.REQUIRE_ORG_HEADER === 'true',
    workflowWebhookSecret: process.env.WORKFLOW_WEBHOOK_SECRET,
    redisUrl: process.env.REDIS_URL,
    environment: process.env.NODE_ENV || 'development'
  };
}

console.log('🛡️ Tenant hardening middleware initialized:', {
  orgHeaderRequired: isOrganizationEnforced(),
  environment: process.env.NODE_ENV || 'development'
});