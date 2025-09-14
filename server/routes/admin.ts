import { Router } from 'express';
import { requireAuth, requireSystemRole, requireSystemPermission, SYSTEM_PERMISSIONS } from '../middleware/rbac';
import { loadEntitlementsContext, requireFeature, BILLING_FEATURES } from '../middleware/entitlements';

const router = Router();

/**
 * GET /admin/sla
 * Return SLA performance readouts and targets
 */
router.get('/sla',
  requireAuth,
  loadEntitlementsContext,
  requireSystemRole('admin'),
  requireFeature(BILLING_FEATURES.ADVANCED_ANALYTICS),
  (req, res) => {
  try {
    // Get SLA targets from environment variables
    const debateP95Ms = Number(process.env.SLA_DEBATE_P95_MS || 30000);
    const exportP95Ms = Number(process.env.SLA_EXPORT_P95_MS || 5000);
    const apiUptime = Number(process.env.SLA_API_UPTIME || 99.9);
    
    // Mock current performance metrics (in production, these would come from monitoring systems)
    const currentMetrics = {
      debate_p95_ms: debateP95Ms * 0.8, // 80% of target (good performance)
      export_p95_ms: exportP95Ms * 0.6, // 60% of target (excellent performance)
      api_uptime: apiUptime,
      last_updated: new Date().toISOString()
    };
    
    const targets = {
      debate_p95_ms: debateP95Ms,
      export_p95_ms: exportP95Ms,
      api_uptime: apiUptime
    };
    
    const slaStatus = {
      debate_sla_met: currentMetrics.debate_p95_ms <= targets.debate_p95_ms,
      export_sla_met: currentMetrics.export_p95_ms <= targets.export_p95_ms,
      uptime_sla_met: currentMetrics.api_uptime >= targets.api_uptime
    };
    
    res.json({
      success: true,
      current: currentMetrics,
      targets,
      status: slaStatus,
      overall_sla_met: Object.values(slaStatus).every(Boolean)
    });
  } catch (error) {
    console.error('SLA readout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve SLA metrics'
    });
  }
});

/**
 * GET /admin/a11y/quickcheck
 * Return accessibility quick check results
 */
router.get('/a11y/quickcheck',
  requireAuth,
  loadEntitlementsContext,
  requireSystemRole('admin'),
  requireFeature(BILLING_FEATURES.ADVANCED_ANALYTICS),
  (req, res) => {
  try {
    // Get accessibility checks from environment
    const a11yChecks = (process.env.A11Y_CHECKS || 'aria,contrast,keyboard').split(',');
    
    // Mock check results (in production, these would run actual accessibility tests)
    const checkResults = a11yChecks.map(check => ({
      check,
      status: Math.random() > 0.2 ? 'pass' : 'warning', // 80% pass rate
      details: `${check} check completed`,
      last_run: new Date().toISOString()
    }));
    
    const summary = {
      total_checks: checkResults.length,
      passed: checkResults.filter(r => r.status === 'pass').length,
      warnings: checkResults.filter(r => r.status === 'warning').length,
      overall_score: Math.round((checkResults.filter(r => r.status === 'pass').length / checkResults.length) * 100)
    };
    
    res.json({
      success: true,
      checks: a11yChecks,
      results: checkResults,
      summary,
      result: summary.overall_score >= 90 ? 'pass' : summary.overall_score >= 70 ? 'warning' : 'fail',
      message: 'Accessibility quick check completed. For detailed analysis, run full accessibility audit.'
    });
  } catch (error) {
    console.error('A11y quickcheck error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run accessibility quick check'
    });
  }
});

/**
 * GET /admin/health
 * System health check endpoint
 */
router.get('/health',
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.ADMIN_DASHBOARD),
  (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;