import { storage } from "../storage";
import type { 
  InsertOrganizationAnalytics, InsertOrganizationDailyReport,
  InsertEnhancedUsageMetric, OrganizationAnalytics, OrganizationDailyReport
} from "@shared/schema";

/**
 * Sprint 6 - Organization Insights Worker
 * Processes daily analytics and generates organization insights reports
 */
export class InsightsWorker {
  private isRunning: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private readonly POLL_INTERVAL_MS = 60000; // Poll every minute for analytics
  private readonly DAILY_REPORT_HOUR = 6; // Generate daily reports at 6 AM

  constructor() {
    console.log("📊 InsightsWorker initialized");
  }

  /**
   * Start the insights worker
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log("⚠️ InsightsWorker already running");
      return;
    }

    this.isRunning = true;
    console.log("🚀 Starting InsightsWorker...");

    // Start processing loop
    this.processingInterval = setInterval(() => {
      this.processInsightsGeneration().catch(error => {
        console.error("❌ Error in insights processing loop:", error);
      });
    }, this.POLL_INTERVAL_MS);

    console.log(`✅ InsightsWorker started (polling every ${this.POLL_INTERVAL_MS}ms)`);
  }

  /**
   * Stop the insights worker
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log("🛑 Stopping InsightsWorker...");
    this.isRunning = false;

    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    console.log("✅ InsightsWorker stopped");
  }

  /**
   * Process insights generation tasks
   */
  private async processInsightsGeneration(): Promise<void> {
    try {
      const now = new Date();
      
      // Check if we should generate daily reports (runs once per day at specified hour)
      if (now.getHours() === this.DAILY_REPORT_HOUR && now.getMinutes() === 0) {
        await this.generateDailyReports();
      }

      // Update real-time analytics every minute
      await this.updateRealTimeAnalytics();
      
    } catch (error) {
      console.error("❌ Error processing insights generation:", error);
    }
  }

  /**
   * Generate daily reports for all organizations
   */
  private async generateDailyReports(): Promise<void> {
    try {
      console.log("📈 Generating daily reports for all organizations...");
      
      // In a real implementation, you'd get all organizations
      // For now, we'll generate a sample report for demonstration
      const sampleOrganizationId = "sample-org-123";
      const reportDate = new Date();
      reportDate.setHours(0, 0, 0, 0); // Start of day

      await this.generateDailyReport(sampleOrganizationId, reportDate);
      
      console.log("✅ Daily reports generated successfully");
    } catch (error) {
      console.error("❌ Error generating daily reports:", error);
    }
  }

  /**
   * Generate daily report for a specific organization
   */
  async generateDailyReport(organizationId: string, date: Date): Promise<OrganizationDailyReport> {
    try {
      console.log(`📊 Generating daily report for organization: ${organizationId}`);

      // Check if report already exists
      const existingReport = await storage.getOrganizationDailyReport(organizationId, date, "daily_summary");
      if (existingReport) {
        console.log(`📋 Daily report already exists for ${organizationId} on ${date.toDateString()}`);
        return existingReport;
      }

      // Get analytics data for the date
      const analytics = await storage.getOrganizationAnalytics(organizationId, date);
      
      // Generate insights and recommendations
      const insights = this.generateInsights(analytics);
      const recommendations = this.generateRecommendations(analytics);
      const alerts = this.generateAlerts(analytics);
      
      // Create daily report
      const reportData: InsertOrganizationDailyReport = {
        organizationId,
        reportDate: date,
        reportType: "daily_summary",
        title: `Daily Summary - ${date.toDateString()}`,
        summary: this.generateExecutiveSummary(analytics),
        keyMetrics: {
          activeUsers: analytics?.activeUsers || 0,
          totalSessions: analytics?.totalSessions || 0,
          templatesUsed: analytics?.templatesUsed || 0,
          workflowsExecuted: analytics?.workflowsExecuted || 0,
          apiCalls: analytics?.apiCalls || 0,
          storageUsed: analytics?.storageUsed || 0,
          averageSessionDuration: analytics?.averageSessionDuration || 0,
          errorRate: parseFloat(analytics?.errorRate || "0")
        },
        insights,
        recommendations,
        alerts,
        charts: this.generateChartData(analytics),
        generatedBy: "system",
        recipients: [], // Will be populated based on organization settings
        metadata: {
          generatedAt: new Date().toISOString(),
          analyticsDataDate: date.toISOString(),
          version: "1.0"
        }
      };

      const report = await storage.createOrganizationDailyReport(reportData);
      console.log(`✅ Daily report generated: ${report.id}`);
      
      return report;
    } catch (error) {
      console.error(`❌ Error generating daily report for ${organizationId}:`, error);
      throw error;
    }
  }

  /**
   * Update real-time analytics for organizations
   */
  private async updateRealTimeAnalytics(): Promise<void> {
    try {
      // In a real implementation, you'd process all organizations
      // For now, we'll update analytics for a sample organization
      const sampleOrganizationId = "sample-org-123";
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if analytics entry exists for today
      let analytics = await storage.getOrganizationAnalytics(sampleOrganizationId, today);
      
      if (!analytics) {
        // Create new analytics entry
        const analyticsData: InsertOrganizationAnalytics = {
          organizationId: sampleOrganizationId,
          date: today,
          activeUsers: this.generateRandomMetric(10, 50),
          totalSessions: this.generateRandomMetric(20, 100),
          templatesUsed: this.generateRandomMetric(5, 25),
          workflowsExecuted: this.generateRandomMetric(0, 10),
          apiCalls: this.generateRandomMetric(100, 1000),
          storageUsed: this.generateRandomMetric(1000000, 10000000), // bytes
          averageSessionDuration: this.generateRandomMetric(300, 1800), // seconds
          topTemplates: [
            { id: "template-1", name: "Business Analysis", usage: 15 },
            { id: "template-2", name: "Technical Review", usage: 12 },
            { id: "template-3", name: "Strategic Planning", usage: 8 }
          ],
          topUsers: [
            { id: "user-1", name: "John Doe", sessions: 5 },
            { id: "user-2", name: "Jane Smith", sessions: 4 },
            { id: "user-3", name: "Bob Johnson", sessions: 3 }
          ],
          errorRate: "0.02", // 2% error rate
          performance: {
            avgResponseTime: this.generateRandomMetric(100, 500),
            p95ResponseTime: this.generateRandomMetric(200, 800),
            uptime: 99.9
          },
          features: {
            templateUsage: this.generateRandomMetric(60, 90),
            workflowUsage: this.generateRandomMetric(20, 40),
            collaborationUsage: this.generateRandomMetric(30, 60)
          },
          metadata: {
            lastUpdated: new Date().toISOString(),
            dataSource: "system_metrics"
          }
        };

        analytics = await storage.createOrganizationAnalytics(analyticsData);
        console.log(`📈 Created new analytics entry for ${sampleOrganizationId}`);
      } else {
        // Update existing analytics
        const updates = {
          activeUsers: analytics.activeUsers + this.generateRandomMetric(-2, 5),
          totalSessions: analytics.totalSessions + this.generateRandomMetric(0, 10),
          templatesUsed: analytics.templatesUsed + this.generateRandomMetric(0, 3),
          apiCalls: analytics.apiCalls + this.generateRandomMetric(10, 50),
          metadata: {
            ...analytics.metadata,
            lastUpdated: new Date().toISOString()
          }
        };

        await storage.updateOrganizationAnalytics(analytics.id, updates);
        console.log(`🔄 Updated analytics for ${sampleOrganizationId}`);
      }
      
      // Record enhanced usage metrics
      await this.recordUsageMetrics(sampleOrganizationId);
      
    } catch (error) {
      console.error("❌ Error updating real-time analytics:", error);
    }
  }

  /**
   * Record enhanced usage metrics
   */
  private async recordUsageMetrics(organizationId: string): Promise<void> {
    const metrics = [
      {
        organizationId,
        resourceType: "template" as const,
        action: "execute" as const,
        metricType: "usage" as const,
        value: this.generateRandomMetric(1, 5),
        unit: "count",
        tags: ["automated"],
        dimensions: { source: "worker", type: "template_execution" }
      },
      {
        organizationId,
        resourceType: "workflow" as const,
        action: "execute" as const,
        metricType: "usage" as const,
        value: this.generateRandomMetric(0, 2),
        unit: "count",
        tags: ["automated"],
        dimensions: { source: "worker", type: "workflow_execution" }
      },
      {
        organizationId,
        resourceType: "api" as const,
        action: "read" as const,
        metricType: "performance" as const,
        value: this.generateRandomMetric(100, 300),
        unit: "milliseconds",
        tags: ["performance"],
        dimensions: { source: "worker", endpoint: "insights" }
      }
    ];

    for (const metric of metrics) {
      try {
        await storage.recordEnhancedUsageMetric(metric as InsertEnhancedUsageMetric);
      } catch (error) {
        console.error("❌ Error recording usage metric:", error);
      }
    }
  }

  /**
   * Generate insights from analytics data
   */
  private generateInsights(analytics: OrganizationAnalytics | undefined): any[] {
    if (!analytics) return [];

    const insights = [];

    // Usage trends
    if (analytics.activeUsers > 0) {
      insights.push({
        type: "usage_trend",
        title: "User Engagement",
        description: `${analytics.activeUsers} active users with ${analytics.totalSessions} total sessions`,
        impact: "positive",
        confidence: 0.8
      });
    }

    // Template popularity
    if (analytics.templatesUsed > 10) {
      insights.push({
        type: "template_adoption",
        title: "High Template Usage",
        description: `Templates are being actively used with ${analytics.templatesUsed} executions`,
        impact: "positive",
        confidence: 0.9
      });
    }

    // Performance insights
    const errorRate = parseFloat(analytics.errorRate || "0");
    if (errorRate > 0.05) {
      insights.push({
        type: "performance_issue",
        title: "Elevated Error Rate",
        description: `Error rate is ${(errorRate * 100).toFixed(2)}%, which is above normal`,
        impact: "negative",
        confidence: 0.7
      });
    }

    return insights;
  }

  /**
   * Generate recommendations from analytics data
   */
  private generateRecommendations(analytics: OrganizationAnalytics | undefined): any[] {
    if (!analytics) return [];

    const recommendations = [];

    // Low workflow usage
    if (analytics.workflowsExecuted < 5) {
      recommendations.push({
        type: "feature_adoption",
        title: "Increase Workflow Usage",
        description: "Consider creating workflow templates to automate repetitive tasks",
        priority: "medium",
        category: "productivity"
      });
    }

    // Storage optimization
    if (analytics.storageUsed > 5000000) { // > 5MB
      recommendations.push({
        type: "optimization",
        title: "Storage Optimization",
        description: "Review and archive old analysis sessions to optimize storage usage",
        priority: "low",
        category: "maintenance"
      });
    }

    // User engagement
    if (analytics.averageSessionDuration < 300) { // < 5 minutes
      recommendations.push({
        type: "engagement",
        title: "Improve User Engagement",
        description: "Consider providing tutorials or templates to increase session duration",
        priority: "medium",
        category: "user_experience"
      });
    }

    return recommendations;
  }

  /**
   * Generate alerts from analytics data
   */
  private generateAlerts(analytics: OrganizationAnalytics | undefined): any[] {
    if (!analytics) return [];

    const alerts = [];

    // High error rate alert
    const errorRate = parseFloat(analytics.errorRate || "0");
    if (errorRate > 0.1) {
      alerts.push({
        type: "error_rate",
        severity: "high",
        title: "High Error Rate Detected",
        description: `Error rate is ${(errorRate * 100).toFixed(2)}%, immediate attention required`,
        actionRequired: true
      });
    }

    // Low activity alert
    if (analytics.activeUsers === 0) {
      alerts.push({
        type: "activity",
        severity: "medium",
        title: "No Active Users",
        description: "No user activity detected today",
        actionRequired: false
      });
    }

    return alerts;
  }

  /**
   * Generate executive summary
   */
  private generateExecutiveSummary(analytics: OrganizationAnalytics | undefined): string {
    if (!analytics) {
      return "No analytics data available for this date.";
    }

    return `Daily Summary: ${analytics.activeUsers} active users completed ${analytics.totalSessions} analysis sessions, utilizing ${analytics.templatesUsed} templates. System performance maintained ${((1 - parseFloat(analytics.errorRate || "0")) * 100).toFixed(1)}% success rate with average session duration of ${Math.round(analytics.averageSessionDuration / 60)} minutes.`;
  }

  /**
   * Generate chart data for visualization
   */
  private generateChartData(analytics: OrganizationAnalytics | undefined): any {
    if (!analytics) return {};

    return {
      userActivity: {
        type: "line",
        data: [
          { time: "00:00", users: Math.floor(analytics.activeUsers * 0.1) },
          { time: "06:00", users: Math.floor(analytics.activeUsers * 0.3) },
          { time: "12:00", users: Math.floor(analytics.activeUsers * 0.8) },
          { time: "18:00", users: Math.floor(analytics.activeUsers * 0.6) },
          { time: "23:59", users: Math.floor(analytics.activeUsers * 0.2) }
        ]
      },
      templateUsage: {
        type: "pie",
        data: analytics.topTemplates || []
      },
      performance: {
        type: "gauge",
        data: {
          successRate: (1 - parseFloat(analytics.errorRate || "0")) * 100,
          avgResponseTime: analytics.performance?.avgResponseTime || 200
        }
      }
    };
  }

  /**
   * Generate random metric for simulation
   */
  private generateRandomMetric(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get organization insights summary
   */
  async getOrganizationInsightsSummary(organizationId: string): Promise<any> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get today's analytics
      const analytics = await storage.getOrganizationAnalytics(organizationId, today);
      
      // Get recent daily report
      const reports = await storage.getOrganizationDailyReports(organizationId, 1);
      const latestReport = reports[0];

      // Get recent usage metrics
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      const usageMetrics = await storage.getEnhancedUsageMetrics(organizationId, undefined, startDate, endDate);

      return {
        summary: {
          organizationId,
          date: today.toISOString(),
          activeUsers: analytics?.activeUsers || 0,
          totalSessions: analytics?.totalSessions || 0,
          templatesUsed: analytics?.templatesUsed || 0,
          workflowsExecuted: analytics?.workflowsExecuted || 0,
          errorRate: parseFloat(analytics?.errorRate || "0"),
          performance: analytics?.performance || {}
        },
        latestReport: latestReport ? {
          id: latestReport.id,
          title: latestReport.title,
          summary: latestReport.summary,
          generatedAt: latestReport.generatedAt,
          insights: latestReport.insights,
          recommendations: latestReport.recommendations,
          alerts: latestReport.alerts
        } : null,
        usageMetrics: {
          totalMetrics: usageMetrics.length,
          recentActivity: usageMetrics.slice(-10),
          byResourceType: this.groupMetricsByResourceType(usageMetrics)
        },
        trends: {
          weeklyGrowth: this.calculateWeeklyGrowth(analytics),
          topTemplates: analytics?.topTemplates || [],
          topUsers: analytics?.topUsers || []
        }
      };
    } catch (error) {
      console.error(`❌ Error getting insights summary for ${organizationId}:`, error);
      throw error;
    }
  }

  /**
   * Group metrics by resource type
   */
  private groupMetricsByResourceType(metrics: any[]): any {
    const grouped = metrics.reduce((acc, metric) => {
      const type = metric.resourceType;
      if (!acc[type]) {
        acc[type] = { count: 0, totalValue: 0 };
      }
      acc[type].count++;
      acc[type].totalValue += parseFloat(metric.value || "0");
      return acc;
    }, {});

    return grouped;
  }

  /**
   * Calculate weekly growth metrics
   */
  private calculateWeeklyGrowth(analytics: OrganizationAnalytics | undefined): any {
    if (!analytics) return { users: 0, sessions: 0, templates: 0 };

    // Simplified growth calculation (in production, you'd compare with previous week)
    return {
      users: Math.floor(Math.random() * 20) - 10, // -10 to +10%
      sessions: Math.floor(Math.random() * 30) - 15, // -15 to +15%
      templates: Math.floor(Math.random() * 25) - 12 // -12 to +13%
    };
  }
}

// Export singleton instance
export const insightsWorker = new InsightsWorker();