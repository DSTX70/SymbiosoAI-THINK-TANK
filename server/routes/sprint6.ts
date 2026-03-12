import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { getCurrentUser } from "../auth";
import { workflowWorker } from "../workers/workflowWorker";
import { insightsWorker } from "../workers/insightsWorker";
import { 
  organizationHeaderValidation,
  requireOrganizationContext,
  createRLSMiddleware,
  getOrganizationContext,
  buildOrgScopedWhereClause,
  getDefaultOrganizationId
} from "../middleware/tenantHardening";
import { getSprint6FeatureFlags } from "../featureFlags";
import {
  insertWorkflowDefinitionSchema, insertWorkflowExecutionSchema, insertWorkflowEventSchema,
  insertOrganizationAnalyticsSchema, insertOrganizationDailyReportSchema, insertEnhancedUsageMetricSchema,
  type WorkflowDefinition, type WorkflowExecution, type WorkflowEvent,
  type OrganizationAnalytics, type OrganizationDailyReport, type EnhancedUsageMetric,
  type TemplateStatus
} from "@shared/schema";

/**
 * Sprint 6 API Routes
 * Template Builder CRUD + Publish System
 * Workflow Automation v1
 * Organization Insights System
 */
export function registerSprint6Routes(app: Express): void {
  console.log("🚀 Registering Sprint 6 routes...");
  
  // Apply tenant hardening middleware to all Sprint 6 routes
  const rlsMiddleware = createRLSMiddleware({ 
    requireOrganization: false, // Individual routes can override this
    logContext: true 
  });
  
  // Apply organization header validation to all Sprint 6 routes
  app.use('/api/workflows*', organizationHeaderValidation);
  app.use('/api/org*', organizationHeaderValidation, requireOrganizationContext);
  app.use('/api/templates/*/publish*', organizationHeaderValidation);
  app.use('/api/templates/*/unpublish*', organizationHeaderValidation);
  app.use('/api/templates/status*', organizationHeaderValidation);
  
  // ============================================
  // SPRINT 6 - ENHANCED FEATURE FLAGS
  // ============================================
  
  // Update feature flags for Sprint 6
  app.get('/api/sprint6/feature-flags', async (req, res) => {
    try {
      const featureFlags = getSprint6FeatureFlags();
      console.log('🏁 Sprint 6 feature flags requested:', featureFlags);
      res.json(featureFlags);
    } catch (error: any) {
      console.error('❌ Sprint 6 feature flags error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch Sprint 6 feature flags',
        error: error.message 
      });
    }
  });
  
  // ============================================
  // SPRINT 6 - TEMPLATE BUILDER CRUD + PUBLISH SYSTEM
  // ============================================
  
  // Publish a template
  app.post('/api/templates/:id/publish', async (req, res) => {
    try {
      const { id } = req.params;
      const { comments } = req.body;
      const user = getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const publishedTemplate = await storage.publishTemplate(id, user.id, comments);
      if (!publishedTemplate) {
        return res.status(404).json({ error: 'Template not found' });
      }

      console.log(`📤 Template published: ${id} by ${user.id}`);
      res.json({ 
        template: publishedTemplate,
        message: 'Template published successfully'
      });
    } catch (error: any) {
      console.error('❌ Template publish error:', error);
      res.status(500).json({ 
        error: 'Failed to publish template',
        message: error.message 
      });
    }
  });

  // Unpublish a template
  app.post('/api/templates/:id/unpublish', async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const user = getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const unpublishedTemplate = await storage.unpublishTemplate(id, user.id, reason);
      if (!unpublishedTemplate) {
        return res.status(404).json({ error: 'Template not found' });
      }

      console.log(`📥 Template unpublished: ${id} by ${user.id}`);
      res.json({ 
        template: unpublishedTemplate,
        message: 'Template unpublished successfully'
      });
    } catch (error: any) {
      console.error('❌ Template unpublish error:', error);
      res.status(500).json({ 
        error: 'Failed to unpublish template',
        message: error.message 
      });
    }
  });

  // Get templates by status
  app.get('/api/templates/status/:status', async (req, res) => {
    try {
      const { status } = req.params;
      const { organizationId } = req.query;
      
      const templates = await storage.getTemplatesByStatus(
        status as TemplateStatus,
        organizationId as string
      );

      console.log(`📋 Retrieved ${templates.length} templates with status: ${status}`);
      res.json({ templates });
    } catch (error: any) {
      console.error('❌ Templates by status error:', error);
      res.status(500).json({ 
        error: 'Failed to get templates by status',
        message: error.message 
      });
    }
  });

  // Get template versions
  app.get('/api/templates/:id/versions', async (req, res) => {
    try {
      const { id } = req.params;
      
      const versions = await storage.getTemplateVersions(id);

      console.log(`📋 Retrieved ${versions.length} versions for template: ${id}`);
      res.json({ versions });
    } catch (error: any) {
      console.error('❌ Template versions error:', error);
      res.status(500).json({ 
        error: 'Failed to get template versions',
        message: error.message 
      });
    }
  });

  // Create template version
  app.post('/api/templates/:id/versions', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const newVersion = await storage.createTemplateVersion(id, updates, user.id);

      console.log(`📄 Created new version for template: ${id}`);
      res.json({ 
        template: newVersion,
        message: 'Template version created successfully'
      });
    } catch (error: any) {
      console.error('❌ Template version creation error:', error);
      res.status(500).json({ 
        error: 'Failed to create template version',
        message: error.message 
      });
    }
  });
  
  // ============================================
  // SPRINT 6 - WORKFLOW AUTOMATION V1
  // ============================================
  
  // Create workflow definition
  app.post('/api/workflows', async (req, res) => {
    try {
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Validate request body
      const workflowData = insertWorkflowDefinitionSchema.parse({
        ...req.body,
        createdBy: user.id
      });

      const workflow = await storage.createWorkflowDefinition(workflowData);

      console.log(`🔄 Workflow definition created: ${workflow.id}`);
      res.status(201).json({ 
        workflow,
        message: 'Workflow definition created successfully'
      });
    } catch (error: any) {
      console.error('❌ Workflow creation error:', error);
      res.status(400).json({ 
        error: 'Failed to create workflow definition',
        message: error.message 
      });
    }
  });

  // Get workflow definitions
  app.get('/api/workflows', async (req, res) => {
    try {
      const { organizationId } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ error: 'organizationId query parameter required' });
      }

      const workflows = await storage.getOrganizationWorkflowDefinitions(organizationId as string);

      console.log(`📋 Retrieved ${workflows.length} workflow definitions`);
      res.json({ workflows });
    } catch (error: any) {
      console.error('❌ Get workflows error:', error);
      res.status(500).json({ 
        error: 'Failed to get workflow definitions',
        message: error.message 
      });
    }
  });

  // Get workflow definition
  app.get('/api/workflows/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const workflow = await storage.getWorkflowDefinition(id);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow definition not found' });
      }

      console.log(`📋 Retrieved workflow definition: ${id}`);
      res.json({ workflow });
    } catch (error: any) {
      console.error('❌ Get workflow error:', error);
      res.status(500).json({ 
        error: 'Failed to get workflow definition',
        message: error.message 
      });
    }
  });

  // Update workflow definition
  app.put('/api/workflows/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const user = getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const workflow = await storage.updateWorkflowDefinition(id, {
        ...updates,
        updatedBy: user.id
      });
      
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow definition not found' });
      }

      console.log(`🔄 Workflow definition updated: ${id}`);
      res.json({ 
        workflow,
        message: 'Workflow definition updated successfully'
      });
    } catch (error: any) {
      console.error('❌ Workflow update error:', error);
      res.status(500).json({ 
        error: 'Failed to update workflow definition',
        message: error.message 
      });
    }
  });

  // Delete workflow definition
  app.delete('/api/workflows/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteWorkflowDefinition(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Workflow definition not found' });
      }

      console.log(`🗑️ Workflow definition deleted: ${id}`);
      res.json({ message: 'Workflow definition deleted successfully' });
    } catch (error: any) {
      console.error('❌ Workflow deletion error:', error);
      res.status(500).json({ 
        error: 'Failed to delete workflow definition',
        message: error.message 
      });
    }
  });

  // Trigger workflow manually
  app.post('/api/workflows/:id/trigger', async (req, res) => {
    try {
      const { id } = req.params;
      const { triggerData = {} } = req.body;
      const user = getCurrentUser(req);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get workflow to get organizationId
      const workflow = await storage.getWorkflowDefinition(id);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow definition not found' });
      }

      // Trigger workflow via worker
      const event = await workflowWorker.triggerWorkflow(
        id,
        workflow.organizationId,
        triggerData,
        user.id
      );

      console.log(`🎯 Workflow triggered: ${id} (event: ${event.id})`);
      res.json({ 
        eventId: event.id,
        workflowId: id,
        message: 'Workflow triggered successfully'
      });
    } catch (error: any) {
      console.error('❌ Workflow trigger error:', error);
      res.status(500).json({ 
        error: 'Failed to trigger workflow',
        message: error.message 
      });
    }
  });

  // Get workflow executions
  app.get('/api/workflows/executions', async (req, res) => {
    try {
      const { workflowDefinitionId, organizationId, limit } = req.query;
      
      const executions = await storage.getWorkflowExecutions(
        workflowDefinitionId as string,
        organizationId as string,
        limit ? parseInt(limit as string) : undefined
      );

      console.log(`📋 Retrieved ${executions.length} workflow executions`);
      res.json({ executions });
    } catch (error: any) {
      console.error('❌ Get workflow executions error:', error);
      res.status(500).json({ 
        error: 'Failed to get workflow executions',
        message: error.message 
      });
    }
  });

  // Get workflow execution
  app.get('/api/workflows/executions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const execution = await storage.getWorkflowExecution(id);
      if (!execution) {
        return res.status(404).json({ error: 'Workflow execution not found' });
      }

      console.log(`📋 Retrieved workflow execution: ${id}`);
      res.json({ execution });
    } catch (error: any) {
      console.error('❌ Get workflow execution error:', error);
      res.status(500).json({ 
        error: 'Failed to get workflow execution',
        message: error.message 
      });
    }
  });

  // Webhook endpoint for external triggers
  app.post('/api/workflows/webhook/:workflowId', async (req, res) => {
    try {
      const { workflowId } = req.params;
      const webhookData = req.body;
      
      // Verify webhook secret if configured
      const expectedSecret = process.env.WORKFLOW_WEBHOOK_SECRET;
      if (expectedSecret) {
        const providedSecret = req.headers['x-webhook-secret'];
        if (providedSecret !== expectedSecret) {
          return res.status(401).json({ error: 'Invalid webhook secret' });
        }
      }

      // Get workflow to get organizationId
      const workflow = await storage.getWorkflowDefinition(workflowId);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow definition not found' });
      }

      // Create webhook event
      const event = await storage.createWorkflowEvent({
        organizationId: workflow.organizationId,
        eventType: "webhook_received",
        eventData: {
          workflowDefinitionId: workflowId,
          webhookData,
          triggeredBy: "webhook"
        },
        source: "webhook",
        priority: 2
      });

      console.log(`🔗 Webhook event created: ${event.id} for workflow: ${workflowId}`);
      res.json({ 
        eventId: event.id,
        message: 'Webhook received and queued for processing'
      });
    } catch (error: any) {
      console.error('❌ Webhook processing error:', error);
      res.status(500).json({ 
        error: 'Failed to process webhook',
        message: error.message 
      });
    }
  });
  
  // ============================================
  // SPRINT 6 - ORGANIZATION INSIGHTS SYSTEM
  // ============================================
  
  // Get organization insights summary
  app.get('/api/org/insights/summary', async (req, res) => {
    try {
      const { organizationId } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ error: 'organizationId query parameter required' });
      }

      const summary = await insightsWorker.getOrganizationInsightsSummary(organizationId as string);

      console.log(`📊 Retrieved insights summary for organization: ${organizationId}`);
      res.json(summary);
    } catch (error: any) {
      console.error('❌ Organization insights summary error:', error);
      res.status(500).json({ 
        error: 'Failed to get organization insights summary',
        message: error.message 
      });
    }
  });

  // Get organization daily reports
  app.get('/api/org/insights/daily', async (req, res) => {
    try {
      const { organizationId, limit } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ error: 'organizationId query parameter required' });
      }

      const reports = await storage.getOrganizationDailyReports(
        organizationId as string,
        limit ? parseInt(limit as string) : 30
      );

      console.log(`📊 Retrieved ${reports.length} daily reports for organization: ${organizationId}`);
      res.json({ reports });
    } catch (error: any) {
      console.error('❌ Organization daily reports error:', error);
      res.status(500).json({ 
        error: 'Failed to get organization daily reports',
        message: error.message 
      });
    }
  });

  // Generate daily report for organization
  app.post('/api/org/insights/daily/generate', async (req, res) => {
    try {
      const { organizationId, date } = req.body;
      
      if (!organizationId) {
        return res.status(400).json({ error: 'organizationId is required' });
      }

      const reportDate = date ? new Date(date) : new Date();
      reportDate.setHours(0, 0, 0, 0); // Start of day

      const report = await insightsWorker.generateDailyReport(organizationId, reportDate);

      console.log(`📊 Generated daily report: ${report.id} for organization: ${organizationId}`);
      res.status(201).json({ 
        report,
        message: 'Daily report generated successfully'
      });
    } catch (error: any) {
      console.error('❌ Daily report generation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate daily report',
        message: error.message 
      });
    }
  });

  // Get organization analytics
  app.get('/api/org/analytics', async (req, res) => {
    try {
      const { organizationId, startDate, endDate } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ error: 'organizationId query parameter required' });
      }

      if (startDate && endDate) {
        // Get range of analytics
        const analytics = await storage.getOrganizationAnalyticsRange(
          organizationId as string,
          new Date(startDate as string),
          new Date(endDate as string)
        );
        res.json({ analytics });
      } else {
        // Get today's analytics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const analytics = await storage.getOrganizationAnalytics(organizationId as string, today);
        res.json({ analytics });
      }

      console.log(`📊 Retrieved analytics for organization: ${organizationId}`);
    } catch (error: any) {
      console.error('❌ Organization analytics error:', error);
      res.status(500).json({ 
        error: 'Failed to get organization analytics',
        message: error.message 
      });
    }
  });

  // Record usage metric
  app.post('/api/org/metrics', async (req, res) => {
    try {
      const metricData = insertEnhancedUsageMetricSchema.parse(req.body);
      
      const metric = await storage.recordEnhancedUsageMetric(metricData);

      console.log(`📈 Usage metric recorded: ${metric.id}`);
      res.status(201).json({ 
        metric,
        message: 'Usage metric recorded successfully'
      });
    } catch (error: any) {
      console.error('❌ Usage metric recording error:', error);
      res.status(400).json({ 
        error: 'Failed to record usage metric',
        message: error.message 
      });
    }
  });

  // Get enhanced usage metrics
  app.get('/api/org/metrics', async (req, res) => {
    try {
      const { organizationId, resourceType, startDate, endDate } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ error: 'organizationId query parameter required' });
      }

      const metrics = await storage.getEnhancedUsageMetrics(
        organizationId as string,
        resourceType as string,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      console.log(`📈 Retrieved ${metrics.length} usage metrics for organization: ${organizationId}`);
      res.json({ metrics });
    } catch (error: any) {
      console.error('❌ Get usage metrics error:', error);
      res.status(500).json({ 
        error: 'Failed to get usage metrics',
        message: error.message 
      });
    }
  });

  console.log("✅ Sprint 6 routes registered successfully");
}
