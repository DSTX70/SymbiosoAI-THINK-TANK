import { db } from "../db";
import { 
  timeLogs, 
  invoices, 
  notifications, 
  notificationRules, 
  workflowTemplates, 
  workflowInstances,
  type InsertTimeLog,
  type InsertInvoice, 
  type InsertNotification,
  type InsertNotificationRule,
  type InsertWorkflowTemplate,
  type InsertWorkflowInstance
} from "@shared/schema";
import { eq, and, gte, lte, isNull, desc, asc } from "drizzle-orm";

export class AutomationService {
  
  // ============================================
  // TIME TRACKING & INVOICING
  // ============================================
  
  /**
   * Start a time tracking session
   */
  async startTimeLog(data: Omit<InsertTimeLog, 'endTime' | 'duration'>): Promise<string> {
    const [timeLog] = await db.insert(timeLogs).values({
      ...data,
      startTime: new Date()
    }).returning();
    
    return timeLog.id;
  }

  /**
   * Stop a time tracking session and calculate duration
   */
  async stopTimeLog(timeLogId: string): Promise<void> {
    const [timeLog] = await db
      .select()
      .from(timeLogs)
      .where(eq(timeLogs.id, timeLogId));
    
    if (!timeLog || timeLog.endTime) {
      throw new Error('Time log not found or already stopped');
    }

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - timeLog.startTime.getTime()) / (1000 * 60));

    await db
      .update(timeLogs)
      .set({ 
        endTime, 
        duration,
        updatedAt: new Date()
      })
      .where(eq(timeLogs.id, timeLogId));
  }

  /**
   * Get billable time logs for invoice generation
   */
  async getBillableTimeLogs(organizationId: string, startDate?: Date, endDate?: Date) {
    const conditions = [
      eq(timeLogs.organizationId, organizationId),
      eq(timeLogs.isBillable, true),
      eq(timeLogs.isInvoiced, false),
      not(isNull(timeLogs.endTime)) // Only completed time logs
    ];

    if (startDate) {
      conditions.push(gte(timeLogs.startTime, startDate));
    }
    if (endDate) {
      conditions.push(lte(timeLogs.startTime, endDate));
    }

    return await db
      .select()
      .from(timeLogs)
      .where(and(...conditions))
      .orderBy(asc(timeLogs.startTime));
  }

  /**
   * Generate invoice from time logs
   */
  async generateInvoice(
    organizationId: string, 
    clientEmail: string,
    timeLogIds: string[],
    dueDate: Date,
    taxRate = 0.1
  ): Promise<string> {
    // Get time logs
    const timeLogData = await db
      .select()
      .from(timeLogs)
      .where(
        and(
          eq(timeLogs.organizationId, organizationId),
          // timeLogIds.map(id => eq(timeLogs.id, id))  // This needs proper IN clause
        )
      );

    // Calculate totals
    let subtotal = 0;
    const lineItems = timeLogData.map(log => {
      const amount = (log.duration || 0) * (Number(log.billableRate) || 0) / 60; // Convert minutes to hours
      subtotal += amount;
      
      return {
        description: log.description,
        hours: (log.duration || 0) / 60,
        rate: Number(log.billableRate) || 0,
        amount: amount,
        date: log.startTime.toISOString()
      };
    });

    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Generate invoice number
    const invoiceCount = await db
      .select()
      .from(invoices)
      .where(eq(invoices.organizationId, organizationId));
    
    const invoiceNumber = `INV-${Date.now()}-${invoiceCount.length + 1}`;

    // Create invoice
    const [invoice] = await db.insert(invoices).values({
      organizationId,
      invoiceNumber,
      clientEmail,
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      totalAmount: totalAmount.toString(),
      dueDate,
      lineItems,
      status: 'draft'
    }).returning();

    // Mark time logs as invoiced
    await db
      .update(timeLogs)
      .set({ 
        isInvoiced: true,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(timeLogs.organizationId, organizationId),
          // timeLogIds IN clause needed here
        )
      );

    return invoice.id;
  }

  /**
   * Get invoices for organization
   */
  async getInvoices(organizationId: string, status?: string) {
    const conditions = [eq(invoices.organizationId, organizationId)];
    
    if (status) {
      conditions.push(eq(invoices.status, status));
    }

    return await db
      .select()
      .from(invoices)
      .where(and(...conditions))
      .orderBy(desc(invoices.createdAt));
  }

  // ============================================
  // SMART NOTIFICATIONS  
  // ============================================

  /**
   * Create a notification
   */
  async createNotification(data: InsertNotification): Promise<string> {
    const [notification] = await db.insert(notifications).values(data).returning();
    
    // Process delivery methods
    await this.processNotificationDelivery(notification.id);
    
    return notification.id;
  }

  /**
   * Process notification delivery based on user preferences
   */
  private async processNotificationDelivery(notificationId: string): Promise<void> {
    // This would integrate with email/SMS services
    // For now, just mark as sent for in-app notifications
    await db
      .update(notifications)
      .set({ sentAt: new Date() })
      .where(eq(notifications.id, notificationId));
  }

  /**
   * Get notifications for user
   */
  async getUserNotifications(userId: string, unreadOnly = false) {
    const conditions = [eq(notifications.userId, userId)];
    
    if (unreadOnly) {
      conditions.push(eq(notifications.isRead, false));
    }

    return await db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt));
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ 
        isRead: true,
        readAt: new Date()
      })
      .where(eq(notifications.id, notificationId));
  }

  /**
   * Create notification rule
   */
  async createNotificationRule(data: InsertNotificationRule): Promise<string> {
    const [rule] = await db.insert(notificationRules).values(data).returning();
    return rule.id;
  }

  /**
   * Check and trigger notification rules
   */
  async checkNotificationRules(trigger: string, context: any): Promise<void> {
    const rules = await db
      .select()
      .from(notificationRules)
      .where(
        and(
          eq(notificationRules.trigger, trigger),
          eq(notificationRules.isActive, true)
        )
      );

    for (const rule of rules) {
      if (this.evaluateRuleConditions(rule.conditions, context)) {
        await this.executeRuleActions(rule.actions, context);
      }
    }
  }

  /**
   * Evaluate rule conditions against context
   */
  private evaluateRuleConditions(conditions: any, context: any): boolean {
    // Simple condition evaluation - can be enhanced with a rule engine
    if (!conditions || typeof conditions !== 'object') return true;
    
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Execute rule actions
   */
  private async executeRuleActions(actions: any, context: any): Promise<void> {
    if (!actions || !Array.isArray(actions)) return;

    for (const action of actions) {
      if (action.type === 'notification') {
        await this.createNotification({
          userId: action.userId || context.userId,
          organizationId: action.organizationId || context.organizationId,
          type: action.notificationType || 'system',
          priority: action.priority || 'medium',
          title: this.interpolateTemplate(action.title, context),
          message: this.interpolateTemplate(action.message, context),
          actionUrl: action.actionUrl,
          deliveryMethods: action.deliveryMethods || ['in_app']
        });
      }
    }
  }

  /**
   * Simple template interpolation
   */
  private interpolateTemplate(template: string, context: any): string {
    if (!template || typeof template !== 'string') return '';
    
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] || match;
    });
  }

  // ============================================
  // WORKFLOW TEMPLATES
  // ============================================

  /**
   * Create workflow template
   */
  async createWorkflowTemplate(data: InsertWorkflowTemplate): Promise<string> {
    const [template] = await db.insert(workflowTemplates).values(data).returning();
    return template.id;
  }

  /**
   * Get workflow templates
   */
  async getWorkflowTemplates(category?: string, isPublic?: boolean) {
    const conditions = [];
    if (category) conditions.push(eq(workflowTemplates.category, category));
    if (isPublic !== undefined) conditions.push(eq(workflowTemplates.isPublic, isPublic));

    const query = db.select().from(workflowTemplates);
    
    if (conditions.length > 0) {
      return await query
        .where(and(...conditions))
        .orderBy(desc(workflowTemplates.rating), desc(workflowTemplates.usageCount));
    }

    return await query.orderBy(desc(workflowTemplates.rating), desc(workflowTemplates.usageCount));
  }

  /**
   * Execute workflow template
   */
  async executeWorkflow(
    templateId: string,
    organizationId: string,
    userId: string,
    input: any
  ): Promise<string> {
    const [template] = await db
      .select()
      .from(workflowTemplates)
      .where(eq(workflowTemplates.id, templateId));

    if (!template) {
      throw new Error('Workflow template not found');
    }

    // Create workflow instance
    const [instance] = await db.insert(workflowInstances).values({
      templateId,
      organizationId,
      userId,
      input,
      status: 'running'
    }).returning();

    // Execute workflow steps (simplified)
    try {
      const output = await this.processWorkflowSteps(template.template, input);
      
      await db
        .update(workflowInstances)
        .set({
          status: 'completed',
          output,
          completedAt: new Date()
        })
        .where(eq(workflowInstances.id, instance.id));

      // Increment usage count
      await db
        .update(workflowTemplates)
        .set({
          usageCount: template.usageCount + 1
        })
        .where(eq(workflowTemplates.id, templateId));

    } catch (error) {
      await db
        .update(workflowInstances)
        .set({
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        })
        .where(eq(workflowInstances.id, instance.id));
    }

    return instance.id;
  }

  /**
   * Process workflow steps
   */
  private async processWorkflowSteps(template: any, input: any): Promise<any> {
    // Simplified workflow execution
    if (!template || !template.steps) {
      throw new Error('Invalid workflow template');
    }

    let output = { ...input };
    
    for (const step of template.steps) {
      switch (step.type) {
        case 'generate_invoice':
          if (step.config?.timeLogIds) {
            const invoiceId = await this.generateInvoice(
              input.organizationId,
              input.clientEmail,
              step.config.timeLogIds,
              new Date(input.dueDate || Date.now() + 30 * 24 * 60 * 60 * 1000)
            );
            output.invoiceId = invoiceId;
          }
          break;
        
        case 'send_notification':
          await this.createNotification({
            userId: input.userId,
            organizationId: input.organizationId,
            type: step.config?.type || 'workflow',
            priority: step.config?.priority || 'medium',
            title: this.interpolateTemplate(step.config?.title || 'Workflow Completed', output),
            message: this.interpolateTemplate(step.config?.message || 'Your workflow has finished processing.', output),
            deliveryMethods: step.config?.deliveryMethods || ['in_app']
          });
          break;
        
        default:
          console.warn(`Unknown workflow step type: ${step.type}`);
      }
    }

    return output;
  }

  /**
   * Get workflow instances for user
   */
  async getWorkflowInstances(userId: string, status?: string) {
    const conditions = [eq(workflowInstances.userId, userId)];
    
    if (status) {
      conditions.push(eq(workflowInstances.status, status));
    }

    return await db
      .select()
      .from(workflowInstances)
      .where(and(...conditions))
      .orderBy(desc(workflowInstances.startedAt));
  }
}

export const automationService = new AutomationService();