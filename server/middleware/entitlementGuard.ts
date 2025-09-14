import { Request, Response, NextFunction } from 'express';

// Feature entitlements mapping for organizations
// In production, this would be fetched from the database
const organizationFeatures: Record<string, Set<string>> = {
  'demo-org': new Set(['guided','expert','marketplace.risk-review','templates.advanced','automation.workflows']),
  'sample-org-123': new Set(['guided','expert','simple','marketplace.basic']),
  'enterprise-org': new Set(['guided','expert','marketplace.risk-review','templates.advanced','automation.workflows','admin.billing','admin.seats'])
};

/**
 * Middleware to require specific entitlement/feature access
 */
export function requireEntitlement(feature: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get organization ID from request (could be from auth token, headers, etc.)
      const orgId = (req as any).orgId || (req as any).user?.organizationId || 'demo-org';
      
      // Check if organization has the required feature
      const hasFeature = organizationFeatures[orgId]?.has(feature);
      
      if (!hasFeature) {
        return res.status(403).json({ 
          ok: false, 
          code: 'ENTITLEMENT_REQUIRED', 
          feature,
          message: `Feature '${feature}' is not available for your organization. Please upgrade your plan.`
        });
      }
      
      // Add feature info to request for downstream use
      (req as any).entitlement = { feature, orgId };
      next();
    } catch (error) {
      console.error('Entitlement check error:', error);
      res.status(500).json({
        ok: false,
        code: 'ENTITLEMENT_CHECK_FAILED',
        message: 'Failed to verify feature entitlement'
      });
    }
  };
}

/**
 * Get all features available to an organization
 */
export function getOrganizationFeatures(orgId: string): string[] {
  return Array.from(organizationFeatures[orgId] || new Set());
}

/**
 * Check if organization has specific feature (for API use)
 */
export function checkOrganizationFeature(orgId: string, feature: string): boolean {
  return organizationFeatures[orgId]?.has(feature) || false;
}