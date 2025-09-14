import { Router } from 'express';
import { z } from 'zod';
import { getOrganizationFeatures, checkOrganizationFeature } from '../middleware/entitlementGuard';
import { requireAuth, requireSystemPermission, SYSTEM_PERMISSIONS } from '../middleware/rbac';
import { loadEntitlementsContext } from '../middleware/entitlements';

const router = Router();

// Schema for entitlement check request
const entitlementCheckSchema = z.object({
  orgId: z.string().optional(),
  feature: z.string().optional(),
  features: z.array(z.string()).optional()
});

/**
 * GET /entitlements/check
 * Check entitlements for organization and specific features
 */
router.get('/check',
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS),
  async (req, res) => {
  try {
    const query = req.query as any;
    const orgId = query.orgId || (req as any).orgId || (req as any).user?.organizationId || 'demo-org';
    
    // If checking a specific feature
    if (query.feature) {
      const hasFeature = checkOrganizationFeature(orgId, query.feature);
      return res.json({
        success: true,
        orgId,
        feature: query.feature,
        hasFeature,
        message: hasFeature ? 'Feature available' : 'Feature not available'
      });
    }
    
    // If checking multiple features
    if (query.features) {
      const features = Array.isArray(query.features) ? query.features : [query.features];
      const featureResults = features.reduce((acc, feature) => {
        acc[feature] = checkOrganizationFeature(orgId, feature);
        return acc;
      }, {} as Record<string, boolean>);
      
      return res.json({
        success: true,
        orgId,
        features: featureResults
      });
    }
    
    // Return all available features for the organization
    const availableFeatures = getOrganizationFeatures(orgId);
    res.json({
      success: true,
      orgId,
      availableFeatures,
      totalFeatures: availableFeatures.length
    });
  } catch (error) {
    console.error('Entitlements check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check entitlements'
    });
  }
});

/**
 * POST /entitlements/check
 * Batch check entitlements (alternative to GET with request body)
 */
router.post('/check',
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.VIEW_AUDIT_LOGS),
  async (req, res) => {
  try {
    const body = entitlementCheckSchema.parse(req.body);
    const orgId = body.orgId || (req as any).orgId || (req as any).user?.organizationId || 'demo-org';
    
    // Check multiple features if provided
    if (body.features && body.features.length > 0) {
      const featureResults = body.features.reduce((acc, feature) => {
        acc[feature] = checkOrganizationFeature(orgId, feature);
        return acc;
      }, {} as Record<string, boolean>);
      
      return res.json({
        success: true,
        orgId,
        features: featureResults
      });
    }
    
    // Check single feature if provided
    if (body.feature) {
      const hasFeature = checkOrganizationFeature(orgId, body.feature);
      return res.json({
        success: true,
        orgId,
        feature: body.feature,
        hasFeature
      });
    }
    
    // Return all available features
    const availableFeatures = getOrganizationFeatures(orgId);
    res.json({
      success: true,
      orgId,
      availableFeatures
    });
  } catch (error) {
    console.error('Entitlements check error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? 'Invalid request data' : 'Failed to check entitlements'
    });
  }
});

export default router;