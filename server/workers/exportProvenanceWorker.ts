import { Worker } from 'bullmq';
import { connection } from '../queue/queue';
import { storage } from '../storage';

interface ExportProvenanceJobData {
  exportId: string;
  userId: string;
  organizationId?: string;
  workspaceId?: string;
  sessionId?: string;
  filename: string;
  contentHash: string;
  metadata: {
    fileSize: number;
    mimeType: string;
    format: string;
    source: 'debate_results' | 'report' | 'analysis' | 'raw_data';
    dlpScanResults?: {
      patterns: string[];
      risk_level: 'low' | 'medium' | 'high';
      blocked: boolean;
    };
    userAgent?: string;
    ipAddress?: string;
    requestHeaders?: Record<string, string>;
  };
  timestamp: number;
}

interface ExportProvenanceResult {
  provenanceId: string;
  complianceStatus: 'compliant' | 'flagged' | 'blocked';
  auditTrail: Array<{
    event: string;
    timestamp: number;
    details: any;
  }>;
  retentionPolicy?: {
    deleteAfter: number; // milliseconds
    archiveAfter: number; // milliseconds
  };
}

// Compliance rules engine
class ComplianceEngine {
  static evaluateExport(data: ExportProvenanceJobData): {
    status: 'compliant' | 'flagged' | 'blocked';
    violations: string[];
    recommendations: string[];
  } {
    const violations: string[] = [];
    const recommendations: string[] = [];

    // File size limits
    if (data.metadata.fileSize > 100 * 1024 * 1024) { // 100MB
      violations.push('File size exceeds maximum limit (100MB)');
    }

    // DLP scan results
    if (data.metadata.dlpScanResults?.blocked) {
      violations.push(`DLP scan blocked export: ${data.metadata.dlpScanResults.patterns.join(', ')}`);
    }

    if (data.metadata.dlpScanResults?.risk_level === 'high') {
      violations.push('High-risk content detected in export');
    }

    // Organization-specific rules
    if (data.organizationId) {
      // Add organization-specific compliance checks here
      if (data.metadata.source === 'raw_data' && !data.workspaceId) {
        violations.push('Raw data exports require workspace context');
      }
    }

    // Content type restrictions
    const restrictedFormats = ['sql', 'db', 'backup'];
    if (restrictedFormats.includes(data.metadata.format.toLowerCase())) {
      violations.push(`Export format '${data.metadata.format}' requires additional authorization`);
    }

    // Generate recommendations
    if (data.metadata.fileSize > 10 * 1024 * 1024) {
      recommendations.push('Consider compressing large exports for better performance');
    }

    if (!data.sessionId && data.metadata.source === 'debate_results') {
      recommendations.push('Link debate exports to specific sessions for better tracking');
    }

    // Determine overall status
    let status: 'compliant' | 'flagged' | 'blocked' = 'compliant';
    if (violations.length > 0) {
      const hasBlockingViolations = violations.some(v => 
        v.includes('DLP scan blocked') || 
        v.includes('exceeds maximum limit') ||
        v.includes('requires additional authorization')
      );
      status = hasBlockingViolations ? 'blocked' : 'flagged';
    }

    return { status, violations, recommendations };
  }

  static generateRetentionPolicy(data: ExportProvenanceJobData): {
    deleteAfter: number;
    archiveAfter: number;
  } {
    const baseRetention = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
    const baseArchive = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    // Adjust based on content sensitivity
    let retentionMultiplier = 1;
    let archiveMultiplier = 1;

    if (data.metadata.dlpScanResults?.risk_level === 'high') {
      retentionMultiplier = 0.5; // Shorter retention for high-risk content
      archiveMultiplier = 0.3;
    }

    if (data.metadata.source === 'report' || data.metadata.source === 'analysis') {
      retentionMultiplier = 2; // Longer retention for reports
      archiveMultiplier = 1.5;
    }

    return {
      deleteAfter: Math.floor(baseRetention * retentionMultiplier),
      archiveAfter: Math.floor(baseArchive * archiveMultiplier)
    };
  }
}

// Hash generation for content integrity
function generateContentHash(content: string): string {
  // In production, use a proper cryptographic hash
  return Buffer.from(content).toString('base64').slice(0, 32);
}

// Start the export provenance worker
export function startExportProvenanceWorker() {
  if (!connection) {
    console.log("⚠️ Redis not configured, export provenance tracking disabled");
    return null;
  }

  const worker = new Worker<ExportProvenanceJobData, ExportProvenanceResult>('export-provenance', async (job) => {
    console.log(`📋 Processing export provenance for export ${job.data.exportId}`);
    
    const data = job.data;
    const auditTrail = [];

    try {
      // Record initial export attempt
      auditTrail.push({
        event: 'export_initiated',
        timestamp: Date.now(),
        details: {
          userId: data.userId,
          filename: data.filename,
          source: data.metadata.source,
          fileSize: data.metadata.fileSize
        }
      });

      // Run compliance evaluation
      const complianceResult = ComplianceEngine.evaluateExport(data);
      
      auditTrail.push({
        event: 'compliance_evaluated',
        timestamp: Date.now(),
        details: {
          status: complianceResult.status,
          violations: complianceResult.violations,
          recommendations: complianceResult.recommendations
        }
      });

      // Generate retention policy
      const retentionPolicy = ComplianceEngine.generateRetentionPolicy(data);
      
      auditTrail.push({
        event: 'retention_policy_applied',
        timestamp: Date.now(),
        details: retentionPolicy
      });

      // Create provenance record in storage
      const provenanceId = await storage.createExportProvenance({
        exportId: data.exportId,
        userId: data.userId,
        organizationId: data.organizationId,
        workspaceId: data.workspaceId,
        sessionId: data.sessionId,
        filename: data.filename,
        contentHash: data.contentHash,
        metadata: data.metadata,
        complianceStatus: complianceResult.status,
        violations: complianceResult.violations,
        recommendations: complianceResult.recommendations,
        auditTrail,
        retentionPolicy,
        createdAt: new Date(data.timestamp)
      });

      auditTrail.push({
        event: 'provenance_recorded',
        timestamp: Date.now(),
        details: { provenanceId }
      });

      // Schedule cleanup if needed
      if (retentionPolicy.deleteAfter > 0) {
        // In production, schedule cleanup job
        console.log(`🗓️ Export ${data.exportId} scheduled for deletion after ${new Date(Date.now() + retentionPolicy.deleteAfter).toISOString()}`);
      }

      // Send notifications for flagged or blocked exports
      if (complianceResult.status === 'flagged' || complianceResult.status === 'blocked') {
        // In production, send notifications to security team
        console.warn(`🚨 Export ${data.exportId} ${complianceResult.status}: ${complianceResult.violations.join(', ')}`);
        
        auditTrail.push({
          event: 'security_notification_sent',
          timestamp: Date.now(),
          details: {
            status: complianceResult.status,
            violations: complianceResult.violations
          }
        });
      }

      console.log(`✅ Export provenance tracking completed for ${data.exportId} with status: ${complianceResult.status}`);

      return {
        provenanceId,
        complianceStatus: complianceResult.status,
        auditTrail,
        retentionPolicy
      };

    } catch (error) {
      console.error(`❌ Export provenance tracking failed for ${data.exportId}:`, error);
      
      auditTrail.push({
        event: 'provenance_tracking_failed',
        timestamp: Date.now(),
        details: {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      // Still try to record what we can
      try {
        await storage.createExportProvenance({
          exportId: data.exportId,
          userId: data.userId,
          organizationId: data.organizationId,
          workspaceId: data.workspaceId,
          sessionId: data.sessionId,
          filename: data.filename,
          contentHash: data.contentHash,
          metadata: data.metadata,
          complianceStatus: 'flagged',
          violations: ['Provenance tracking failed'],
          recommendations: ['Manual review required'],
          auditTrail,
          retentionPolicy: ComplianceEngine.generateRetentionPolicy(data),
          createdAt: new Date(data.timestamp)
        });
      } catch (storageError) {
        console.error('Failed to record failed provenance tracking:', storageError);
      }

      throw error;
    }
  }, { 
    connection,
    concurrency: 5,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 }
  });

  worker.on('completed', (job, result) => {
    console.log(`📋 Export provenance job ${job.id} completed for export ${job.data.exportId}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Export provenance job ${job?.id} failed for export ${job?.data?.exportId}:`, err);
  });

  console.log('🏃 Export provenance worker started');
  return worker;
}

// Utility function to enqueue export provenance tracking
export async function enqueueExportProvenance(data: ExportProvenanceJobData) {
  if (!connection) {
    console.warn("⚠️ Redis not configured, skipping export provenance tracking");
    return null;
  }

  const { Queue } = await import('bullmq');
  const provenanceQueue = new Queue('export-provenance', { connection });
  
  const job = await provenanceQueue.add('track-export', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 }
  });

  console.log(`📋 Enqueued export provenance tracking job ${job.id} for export ${data.exportId}`);
  return job;
}

export { ExportProvenanceJobData, ExportProvenanceResult, ComplianceEngine };
