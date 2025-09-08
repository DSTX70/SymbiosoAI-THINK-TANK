import type { Express, Request, Response } from "express";
import { z } from "zod";
import { automationService } from "../services/automationService";
import { 
  insertTimeLogSchema, 
  insertInvoiceSchema, 
  insertNotificationSchema,
  insertNotificationRuleSchema,
  insertWorkflowTemplateSchema 
} from "@shared/schema";

export function registerAutomationRoutes(app: Express) {

  // ============================================
  // TIME TRACKING & INVOICING ROUTES
  // ============================================

  // Start time tracking
  app.post("/api/automation/time-logs/start", async (req: Request, res: Response) => {
    try {
      const data = insertTimeLogSchema.omit({ endTime: true, duration: true }).parse(req.body);
      const timeLogId = await automationService.startTimeLog(data);
      res.json({ timeLogId });
    } catch (error) {
      console.error("Start time log error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to start time log" });
    }
  });

  // Stop time tracking
  app.post("/api/automation/time-logs/:id/stop", async (req: Request, res: Response) => {
    try {
      await automationService.stopTimeLog(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Stop time log error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to stop time log" });
    }
  });

  // Get billable time logs
  app.get("/api/automation/time-logs/billable", async (req: Request, res: Response) => {
    try {
      const { organizationId, startDate, endDate } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ error: "Organization ID required" });
      }

      const timeLogs = await automationService.getBillableTimeLogs(
        organizationId as string,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.json({ timeLogs });
    } catch (error) {
      console.error("Get billable time logs error:", error);
      res.status(500).json({ error: "Failed to fetch time logs" });
    }
  });

  // Generate invoice
  app.post("/api/automation/invoices/generate", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        organizationId: z.string(),
        clientEmail: z.string().email(),
        timeLogIds: z.array(z.string()),
        dueDate: z.string(),
        taxRate: z.number().optional()
      });

      const { organizationId, clientEmail, timeLogIds, dueDate, taxRate } = schema.parse(req.body);
      
      const invoiceId = await automationService.generateInvoice(
        organizationId,
        clientEmail,
        timeLogIds,
        new Date(dueDate),
        taxRate
      );
      
      res.json({ invoiceId });
    } catch (error) {
      console.error("Generate invoice error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to generate invoice" });
    }
  });

  // Get invoices
  app.get("/api/automation/invoices", async (req: Request, res: Response) => {
    try {
      const { organizationId, status } = req.query;
      
      if (!organizationId) {
        return res.status(400).json({ error: "Organization ID required" });
      }

      const invoices = await automationService.getInvoices(
        organizationId as string,
        status as string
      );
      
      res.json({ invoices });
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  // ============================================
  // SMART NOTIFICATIONS ROUTES
  // ============================================

  // Create notification
  app.post("/api/automation/notifications", async (req: Request, res: Response) => {
    try {
      const data = insertNotificationSchema.parse(req.body);
      const notificationId = await automationService.createNotification(data);
      res.json({ notificationId });
    } catch (error) {
      console.error("Create notification error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create notification" });
    }
  });

  // Get user notifications
  app.get("/api/automation/notifications", async (req: Request, res: Response) => {
    try {
      const { userId, unreadOnly } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const notifications = await automationService.getUserNotifications(
        userId as string,
        unreadOnly === 'true'
      );
      
      res.json({ notifications });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  app.post("/api/automation/notifications/:id/read", async (req: Request, res: Response) => {
    try {
      await automationService.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(400).json({ error: "Failed to mark notification as read" });
    }
  });

  // Create notification rule
  app.post("/api/automation/notification-rules", async (req: Request, res: Response) => {
    try {
      const data = insertNotificationRuleSchema.parse(req.body);
      const ruleId = await automationService.createNotificationRule(data);
      res.json({ ruleId });
    } catch (error) {
      console.error("Create notification rule error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create notification rule" });
    }
  });

  // ============================================
  // WORKFLOW TEMPLATES ROUTES
  // ============================================

  // Create workflow template
  app.post("/api/automation/workflow-templates", async (req: Request, res: Response) => {
    try {
      const data = insertWorkflowTemplateSchema.parse(req.body);
      const templateId = await automationService.createWorkflowTemplate(data);
      res.json({ templateId });
    } catch (error) {
      console.error("Create workflow template error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create workflow template" });
    }
  });

  // Get workflow templates
  app.get("/api/automation/workflow-templates", async (req: Request, res: Response) => {
    try {
      const { category, isPublic } = req.query;
      
      const templates = await automationService.getWorkflowTemplates(
        category as string,
        isPublic === 'true'
      );
      
      res.json({ templates });
    } catch (error) {
      console.error("Get workflow templates error:", error);
      res.status(500).json({ error: "Failed to fetch workflow templates" });
    }
  });

  // Execute workflow
  app.post("/api/automation/workflows/execute", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        templateId: z.string(),
        organizationId: z.string(),
        userId: z.string(),
        input: z.any()
      });

      const { templateId, organizationId, userId, input } = schema.parse(req.body);
      
      const instanceId = await automationService.executeWorkflow(
        templateId,
        organizationId,
        userId,
        input
      );
      
      res.json({ instanceId });
    } catch (error) {
      console.error("Execute workflow error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to execute workflow" });
    }
  });

  // Get workflow instances
  app.get("/api/automation/workflow-instances", async (req: Request, res: Response) => {
    try {
      const { userId, status } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const instances = await automationService.getWorkflowInstances(
        userId as string,
        status as string
      );
      
      res.json({ instances });
    } catch (error) {
      console.error("Get workflow instances error:", error);
      res.status(500).json({ error: "Failed to fetch workflow instances" });
    }
  });

  // ============================================
  // BUILT-IN AUTOMATION TRIGGERS
  // ============================================

  // Check automation rules (internal endpoint)
  app.post("/api/automation/check-rules", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        trigger: z.string(),
        context: z.any()
      });

      const { trigger, context } = schema.parse(req.body);
      await automationService.checkNotificationRules(trigger, context);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Check automation rules error:", error);
      res.status(500).json({ error: "Failed to check automation rules" });
    }
  });
}