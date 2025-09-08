import { automationService } from "../services/automationService";

/**
 * Seed built-in workflow templates for automation features
 */
export async function seedWorkflowTemplates() {
  console.log("🌱 Seeding workflow templates...");

  const templates = [
    // Invoice Generation Workflow
    {
      organizationId: null, // Public template
      name: "Automated Invoice Generation",
      description: "Automatically generate and send invoices from billable time logs with smart notifications",
      category: "invoicing",
      template: {
        name: "invoice_automation",
        description: "Complete invoice workflow with time tracking and notifications",
        steps: [
          {
            type: "generate_invoice",
            name: "Create Invoice",
            description: "Generate invoice from selected time logs",
            config: {
              taxRate: 0.1,
              paymentTerms: "Net 30",
              currency: "USD"
            }
          },
          {
            type: "send_notification",
            name: "Notify Client",
            description: "Send invoice notification to client",
            config: {
              type: "invoice",
              priority: "high",
              title: "New Invoice Generated - {{invoiceNumber}}",
              message: "Your invoice #{{invoiceNumber}} for ${{totalAmount}} has been generated and is due on {{dueDate}}.",
              deliveryMethods: ["email", "in_app"]
            }
          },
          {
            type: "send_notification", 
            name: "Internal Notification",
            description: "Notify team about invoice creation",
            config: {
              type: "workflow",
              priority: "medium",
              title: "Invoice {{invoiceNumber}} Created Successfully",
              message: "Invoice for {{clientEmail}} totaling ${{totalAmount}} has been generated and sent.",
              deliveryMethods: ["in_app"]
            }
          }
        ]
      },
      variables: [
        { name: "clientEmail", type: "email", required: true, description: "Client email address" },
        { name: "timeLogIds", type: "array", required: true, description: "Time log IDs to include" },
        { name: "dueDate", type: "date", required: true, description: "Invoice due date" },
        { name: "taxRate", type: "number", required: false, default: 0.1, description: "Tax rate (0.1 = 10%)" }
      ],
      isPublic: true,
      tags: ["invoicing", "automation", "billing", "notifications"],
      createdBy: "system"
    },

    // Smart Project Status Updates
    {
      organizationId: null,
      name: "Project Status Notification System",
      description: "Intelligent notification system for project milestones and status updates",
      category: "notifications",
      template: {
        name: "project_notifications",
        description: "Smart project status tracking and notifications",
        steps: [
          {
            type: "send_notification",
            name: "Milestone Alert",
            description: "Send milestone completion notification",
            config: {
              type: "project",
              priority: "high",
              title: "🎯 Project Milestone Reached: {{milestoneName}}",
              message: "Congratulations! The {{milestoneName}} milestone for {{projectName}} has been completed. Progress: {{completionPercentage}}%",
              deliveryMethods: ["in_app", "email"]
            }
          },
          {
            type: "send_notification",
            name: "Status Update",
            description: "Regular project status update",
            config: {
              type: "project",
              priority: "medium", 
              title: "📊 Weekly Project Update: {{projectName}}",
              message: "Project {{projectName}} status update: {{status}}. Hours logged this week: {{weeklyHours}}. Next milestone: {{nextMilestone}}",
              deliveryMethods: ["in_app"]
            }
          }
        ]
      },
      variables: [
        { name: "projectName", type: "string", required: true, description: "Project name" },
        { name: "milestoneName", type: "string", required: true, description: "Milestone name" },
        { name: "completionPercentage", type: "number", required: true, description: "Completion percentage" },
        { name: "status", type: "string", required: true, description: "Current project status" },
        { name: "weeklyHours", type: "number", required: false, description: "Hours logged this week" },
        { name: "nextMilestone", type: "string", required: false, description: "Next milestone name" }
      ],
      isPublic: true,
      tags: ["notifications", "project-management", "status-updates"],
      createdBy: "system"
    },

    // AI Analysis Completion Workflow
    {
      organizationId: null,
      name: "AI Analysis Completion Handler",
      description: "Automated workflow for handling completed AI analysis sessions with results distribution",
      category: "ai_analysis",
      template: {
        name: "ai_analysis_completion",
        description: "Process and distribute AI analysis results",
        steps: [
          {
            type: "send_notification",
            name: "Analysis Complete",
            description: "Notify requestor of completed analysis",
            config: {
              type: "ai_analysis",
              priority: "high",
              title: "✅ AI Analysis Complete: {{analysisTitle}}",
              message: "Your AI analysis '{{analysisTitle}}' has been completed. {{agentCount}} agents participated in {{roundCount}} rounds of debate. View results: {{resultsUrl}}",
              deliveryMethods: ["in_app", "email"]
            }
          },
          {
            type: "send_notification",
            name: "Team Notification",
            description: "Notify team members of shared analysis",
            config: {
              type: "ai_analysis",
              priority: "medium",
              title: "🤖 New Shared Analysis Available: {{analysisTitle}}",
              message: "{{requesterName}} has shared an AI analysis: {{analysisTitle}}. Key insights: {{keyInsights}}",
              deliveryMethods: ["in_app"]
            }
          }
        ]
      },
      variables: [
        { name: "analysisTitle", type: "string", required: true, description: "Analysis session title" },
        { name: "agentCount", type: "number", required: true, description: "Number of AI agents" },
        { name: "roundCount", type: "number", required: true, description: "Number of debate rounds" },
        { name: "resultsUrl", type: "string", required: true, description: "URL to view results" },
        { name: "requesterName", type: "string", required: true, description: "Name of person who requested analysis" },
        { name: "keyInsights", type: "string", required: false, description: "Brief summary of key insights" }
      ],
      isPublic: true,
      tags: ["ai-analysis", "collaboration", "notifications"],
      createdBy: "system"
    },

    // Monthly Billing Report
    {
      organizationId: null,
      name: "Monthly Billing Report Generator",
      description: "Comprehensive monthly billing and time tracking report with automated invoice generation",
      category: "reporting",
      template: {
        name: "monthly_billing_report",
        description: "Generate monthly billing reports and process outstanding invoices",
        steps: [
          {
            type: "generate_invoice",
            name: "Process Monthly Billing",
            description: "Generate invoices for all billable time in the month",
            config: {
              taxRate: 0.1,
              paymentTerms: "Net 30",
              currency: "USD",
              groupByClient: true
            }
          },
          {
            type: "send_notification",
            name: "Billing Summary",
            description: "Send monthly billing summary to finance team",
            config: {
              type: "billing",
              priority: "high",
              title: "📊 Monthly Billing Report - {{monthYear}}",
              message: "Monthly billing complete: {{totalInvoices}} invoices generated totaling ${{totalAmount}}. Outstanding: {{outstandingAmount}}. View detailed report: {{reportUrl}}",
              deliveryMethods: ["in_app", "email"]
            }
          }
        ]
      },
      variables: [
        { name: "monthYear", type: "string", required: true, description: "Month and year (e.g., 'January 2024')" },
        { name: "totalInvoices", type: "number", required: true, description: "Number of invoices generated" },
        { name: "totalAmount", type: "number", required: true, description: "Total invoice amount" },
        { name: "outstandingAmount", type: "number", required: true, description: "Outstanding amount" },
        { name: "reportUrl", type: "string", required: true, description: "URL to detailed report" }
      ],
      isPublic: true,
      tags: ["billing", "reporting", "monthly", "invoicing"],
      createdBy: "system"
    },

    // Client Onboarding Workflow
    {
      organizationId: null,
      name: "New Client Onboarding Automation",
      description: "Complete client onboarding workflow with welcome notifications and setup tasks",
      category: "client_management",
      template: {
        name: "client_onboarding",
        description: "Automated new client onboarding process",
        steps: [
          {
            type: "send_notification",
            name: "Welcome Client",
            description: "Send welcome notification to new client",
            config: {
              type: "client",
              priority: "high",
              title: "🎉 Welcome to {{organizationName}}!",
              message: "Welcome {{clientName}}! We're excited to work with you. Your account manager is {{accountManager}}. Next steps: {{nextSteps}}",
              deliveryMethods: ["email", "in_app"]
            }
          },
          {
            type: "send_notification",
            name: "Team Alert",
            description: "Notify internal team of new client",
            config: {
              type: "internal",
              priority: "medium",
              title: "👋 New Client Onboarded: {{clientName}}",
              message: "New client {{clientName}} ({{clientEmail}}) has been onboarded. Account manager: {{accountManager}}. Project start date: {{startDate}}",
              deliveryMethods: ["in_app"]
            }
          }
        ]
      },
      variables: [
        { name: "clientName", type: "string", required: true, description: "Client name" },
        { name: "clientEmail", type: "email", required: true, description: "Client email address" },
        { name: "organizationName", type: "string", required: true, description: "Your organization name" },
        { name: "accountManager", type: "string", required: true, description: "Assigned account manager" },
        { name: "nextSteps", type: "string", required: true, description: "Next steps for client" },
        { name: "startDate", type: "date", required: true, description: "Project start date" }
      ],
      isPublic: true,
      tags: ["onboarding", "client-management", "welcome"],
      createdBy: "system"
    }
  ];

  try {
    for (const template of templates) {
      const templateId = await automationService.createWorkflowTemplate(template);
      console.log(`✅ Created template: ${template.name} (ID: ${templateId})`);
    }
    
    console.log(`🎉 Successfully seeded ${templates.length} workflow templates`);
  } catch (error) {
    console.error("❌ Error seeding workflow templates:", error);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedWorkflowTemplates();
}