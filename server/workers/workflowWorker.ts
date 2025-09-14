import { storage } from "../storage";
import type { 
  WorkflowEvent, WorkflowDefinition, WorkflowExecution,
  InsertWorkflowExecution, InsertWorkflowEvent
} from "@shared/schema";
import { randomUUID } from "crypto";

/**
 * Sprint 6 - Workflow Automation Worker
 * Processes workflow events from Redis queue and executes workflow actions
 */
export class WorkflowWorker {
  private isRunning: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private readonly POLL_INTERVAL_MS = 5000; // Poll every 5 seconds
  private readonly MAX_RETRIES = 3;

  constructor() {
    console.log("🤖 WorkflowWorker initialized");
  }

  /**
   * Start the workflow worker
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log("⚠️ WorkflowWorker already running");
      return;
    }

    this.isRunning = true;
    console.log("🚀 Starting WorkflowWorker...");

    // Start processing loop
    this.processingInterval = setInterval(() => {
      this.processWorkflowEvents().catch(error => {
        console.error("❌ Error in workflow processing loop:", error);
      });
    }, this.POLL_INTERVAL_MS);

    console.log(`✅ WorkflowWorker started (polling every ${this.POLL_INTERVAL_MS}ms)`);
  }

  /**
   * Stop the workflow worker
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log("🛑 Stopping WorkflowWorker...");
    this.isRunning = false;

    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    console.log("✅ WorkflowWorker stopped");
  }

  /**
   * Process pending workflow events
   */
  private async processWorkflowEvents(): Promise<void> {
    try {
      // Get pending workflow events
      const pendingEvents = await storage.getPendingWorkflowEvents(10);
      
      if (pendingEvents.length === 0) {
        return; // No events to process
      }

      console.log(`📋 Processing ${pendingEvents.length} workflow events`);

      // Process each event
      for (const event of pendingEvents) {
        await this.processWorkflowEvent(event);
      }
    } catch (error) {
      console.error("❌ Error processing workflow events:", error);
    }
  }

  /**
   * Process a single workflow event
   */
  private async processWorkflowEvent(event: WorkflowEvent): Promise<void> {
    try {
      console.log(`⚡ Processing workflow event: ${event.id} (${event.eventType})`);

      // Mark event as processing
      await storage.updateWorkflowEvent(event.id, {
        status: "processing",
        processedAt: new Date()
      });

      switch (event.eventType) {
        case "trigger_workflow":
          await this.handleTriggerWorkflow(event);
          break;
        case "action_completed":
          await this.handleActionCompleted(event);
          break;
        case "webhook_received":
          await this.handleWebhookReceived(event);
          break;
        case "schedule_triggered":
          await this.handleScheduleTriggered(event);
          break;
        case "manual_trigger":
          await this.handleManualTrigger(event);
          break;
        default:
          console.warn(`⚠️ Unknown event type: ${event.eventType}`);
          await storage.updateWorkflowEvent(event.id, {
            status: "failed",
            errorMessage: `Unknown event type: ${event.eventType}`
          });
          return;
      }

      // Mark event as completed
      await storage.updateWorkflowEvent(event.id, {
        status: "completed"
      });

      console.log(`✅ Workflow event processed: ${event.id}`);
    } catch (error) {
      console.error(`❌ Error processing workflow event ${event.id}:`, error);
      
      // Handle retry logic
      const retryCount = event.retryCount || 0;
      if (retryCount < this.MAX_RETRIES) {
        await storage.updateWorkflowEvent(event.id, {
          status: "pending",
          retryCount: retryCount + 1,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });
        console.log(`🔄 Retrying workflow event ${event.id} (attempt ${retryCount + 1})`);
      } else {
        await storage.updateWorkflowEvent(event.id, {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Max retries exceeded"
        });
        console.log(`💀 Workflow event ${event.id} failed after ${this.MAX_RETRIES} retries`);
      }
    }
  }

  /**
   * Handle trigger_workflow event
   */
  private async handleTriggerWorkflow(event: WorkflowEvent): Promise<void> {
    const { workflowDefinitionId, triggerData, triggeredBy } = event.eventData;

    if (!workflowDefinitionId) {
      throw new Error("Missing workflowDefinitionId in trigger_workflow event");
    }

    // Get workflow definition
    const workflow = await storage.getWorkflowDefinition(workflowDefinitionId);
    if (!workflow) {
      throw new Error(`Workflow definition not found: ${workflowDefinitionId}`);
    }

    if (!workflow.isActive) {
      throw new Error(`Workflow is not active: ${workflowDefinitionId}`);
    }

    // Create workflow execution
    const execution: InsertWorkflowExecution = {
      workflowDefinitionId: workflow.id,
      organizationId: workflow.organizationId,
      triggeredBy: triggeredBy || "system",
      triggerData: triggerData || {},
      status: "running",
      totalSteps: Array.isArray(workflow.actions) ? workflow.actions.length : 0,
      metadata: {
        eventId: event.id,
        startedAt: new Date().toISOString()
      }
    };

    const workflowExecution = await storage.createWorkflowExecution(execution);
    console.log(`🚀 Started workflow execution: ${workflowExecution.id}`);

    // Execute workflow actions
    await this.executeWorkflowActions(workflow, workflowExecution);
  }

  /**
   * Execute workflow actions sequentially
   */
  private async executeWorkflowActions(
    workflow: WorkflowDefinition, 
    execution: WorkflowExecution
  ): Promise<void> {
    const actions = Array.isArray(workflow.actions) ? workflow.actions : [];
    const results: any[] = [];

    try {
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        console.log(`⚙️ Executing action ${i + 1}/${actions.length}: ${action.type}`);

        // Update current step
        await storage.updateWorkflowExecution(execution.id, {
          currentStep: i + 1
        });

        // Execute the action
        const actionResult = await this.executeAction(action, execution, workflow);
        results.push(actionResult);

        console.log(`✅ Action ${i + 1} completed:`, actionResult);
      }

      // Mark execution as completed
      await storage.updateWorkflowExecution(execution.id, {
        status: "completed",
        completedAt: new Date(),
        results: results,
        duration: Date.now() - new Date(execution.startedAt).getTime()
      });

      console.log(`🎉 Workflow execution completed: ${execution.id}`);
    } catch (error) {
      console.error(`❌ Workflow execution failed: ${execution.id}`, error);
      
      await storage.updateWorkflowExecution(execution.id, {
        status: "failed",
        completedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        results: results,
        duration: Date.now() - new Date(execution.startedAt).getTime()
      });
    }
  }

  /**
   * Execute a single workflow action
   */
  private async executeAction(action: any, execution: WorkflowExecution, workflow: WorkflowDefinition): Promise<any> {
    const { type, config = {} } = action;

    switch (type) {
      case "send_notification":
        return await this.executeSendNotification(action, execution, workflow);
      case "webhook":
        return await this.executeWebhook(action, execution, workflow);
      case "delay":
        return await this.executeDelay(action, execution, workflow);
      case "generate_report":
        return await this.executeGenerateReport(action, execution, workflow);
      case "email":
        return await this.executeEmail(action, execution, workflow);
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }

  /**
   * Execute send_notification action
   */
  private async executeSendNotification(action: any, execution: WorkflowExecution, workflow: WorkflowDefinition): Promise<any> {
    const { config = {} } = action;
    
    // This is a simplified implementation - in production you'd integrate with a real notification system
    console.log(`📧 Sending notification: ${config.title || "Workflow Notification"}`);
    
    return {
      type: "send_notification",
      status: "completed",
      message: config.message || "Notification sent",
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute webhook action
   */
  private async executeWebhook(action: any, execution: WorkflowExecution, workflow: WorkflowDefinition): Promise<any> {
    const { config = {} } = action;
    const { url, method = "POST", headers = {}, body } = config;

    if (!url) {
      throw new Error("Webhook URL is required");
    }

    try {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: body ? JSON.stringify(body) : JSON.stringify({
          workflowId: workflow.id,
          executionId: execution.id,
          organizationId: execution.organizationId,
          timestamp: new Date().toISOString()
        })
      });

      const responseData = await response.text();
      
      return {
        type: "webhook",
        status: response.ok ? "completed" : "failed",
        statusCode: response.status,
        response: responseData,
        url: url,
        method: method,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Webhook failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Execute delay action
   */
  private async executeDelay(action: any, execution: WorkflowExecution, workflow: WorkflowDefinition): Promise<any> {
    const { config = {} } = action;
    const delayMs = config.delayMs || config.delay || 1000;

    console.log(`⏰ Delaying for ${delayMs}ms`);
    await new Promise(resolve => setTimeout(resolve, delayMs));

    return {
      type: "delay",
      status: "completed",
      delayMs: delayMs,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute generate_report action
   */
  private async executeGenerateReport(action: any, execution: WorkflowExecution, workflow: WorkflowDefinition): Promise<any> {
    const { config = {} } = action;
    
    // This is a simplified implementation - in production you'd generate actual reports
    console.log(`📊 Generating report: ${config.reportType || "workflow_report"}`);
    
    return {
      type: "generate_report",
      status: "completed",
      reportType: config.reportType || "workflow_report",
      reportId: randomUUID(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute email action
   */
  private async executeEmail(action: any, execution: WorkflowExecution, workflow: WorkflowDefinition): Promise<any> {
    const { config = {} } = action;
    
    // This is a simplified implementation - in production you'd integrate with an email service
    console.log(`📧 Sending email to: ${config.to || "workflow@example.com"}`);
    
    return {
      type: "email",
      status: "completed",
      to: config.to || "workflow@example.com",
      subject: config.subject || "Workflow Notification",
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Handle action_completed event
   */
  private async handleActionCompleted(event: WorkflowEvent): Promise<void> {
    console.log("✅ Action completed event processed");
    // This could trigger the next action in a workflow or perform cleanup
  }

  /**
   * Handle webhook_received event
   */
  private async handleWebhookReceived(event: WorkflowEvent): Promise<void> {
    console.log("🔗 Webhook received event processed");
    // This could trigger workflows based on external webhook events
  }

  /**
   * Handle schedule_triggered event
   */
  private async handleScheduleTriggered(event: WorkflowEvent): Promise<void> {
    console.log("⏰ Schedule triggered event processed");
    // This handles scheduled workflow triggers
  }

  /**
   * Handle manual_trigger event
   */
  private async handleManualTrigger(event: WorkflowEvent): Promise<void> {
    console.log("👤 Manual trigger event processed");
    // This handles manually triggered workflows
  }

  /**
   * Trigger a workflow manually
   */
  async triggerWorkflow(
    workflowDefinitionId: string, 
    organizationId: string,
    triggerData: any = {},
    triggeredBy: string = "system"
  ): Promise<WorkflowEvent> {
    const event: InsertWorkflowEvent = {
      organizationId,
      eventType: "trigger_workflow",
      eventData: {
        workflowDefinitionId,
        triggerData,
        triggeredBy
      },
      source: "manual",
      priority: 1,
      metadata: {
        triggeredAt: new Date().toISOString()
      }
    };

    const workflowEvent = await storage.createWorkflowEvent(event);
    console.log(`🎯 Workflow trigger queued: ${workflowEvent.id}`);
    
    return workflowEvent;
  }
}

// Export singleton instance
export const workflowWorker = new WorkflowWorker();