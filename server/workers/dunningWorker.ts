import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { storage } from '../storage';

// Create Redis connection for the dunning queue
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true
});

// Export the dunning queue for adding jobs
export const dunningQueue = new Queue('billing-dunning', { 
  connection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 20,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    }
  }
});

/**
 * Start the dunning worker for automated billing notifications
 */
export function startDunningWorker() {
  console.log('🚀 Starting dunning worker...');
  
  const worker = new Worker('billing-dunning', async (job) => {
    const { orgId, invoiceId, daysPastDue } = job.data || {};
    
    console.log(`[dunning] Processing org: ${orgId}, invoice: ${invoiceId}, days past due: ${daysPastDue}`);
    
    try {
      // Create dunning event record
      await storage.createDunningEvent({
        invoiceId,
        orgId,
        event: `automated_dunning_${daysPastDue}d`,
        createdAt: new Date()
      });
      
      // Determine action based on days past due
      const gracePeriod = parseInt(process.env.DUNNING_GRACE_DAYS || '7');
      let action: string;
      
      if (daysPastDue <= gracePeriod) {
        action = 'remind';
        console.log(`[dunning] → Sending reminder for ${orgId}`);
      } else if (daysPastDue <= gracePeriod + 14) {
        action = 'warn';
        console.log(`[dunning] → Sending warning for ${orgId}`);
      } else {
        action = 'suspend';
        console.log(`[dunning] → Suspending features for ${orgId}`);
      }
      
      // In production, this would:
      // - Send email notifications
      // - Update subscription status
      // - Trigger feature suspensions
      // - Log to audit trail
      
      console.log(`[dunning] ✅ Completed ${action} action for org ${orgId}`);
      
      return { success: true, action, orgId, invoiceId, daysPastDue };
    } catch (error) {
      console.error(`[dunning] ❌ Failed processing for org ${orgId}:`, error);
      throw error;
    }
  }, { 
    connection,
    concurrency: 5,
    removeOnComplete: 50,
    removeOnFail: 20
  });
  
  // Set up worker event handlers
  worker.on('completed', (job, result) => {
    console.log(`[dunning] ✅ Job ${job.id} completed for org ${result?.orgId}`);
  });
  
  worker.on('failed', (job, err) => {
    console.error(`[dunning] ❌ Job ${job?.id} failed:`, err.message);
  });
  
  worker.on('error', (err) => {
    console.error('[dunning] Worker error:', err);
  });
  
  console.log('✅ Dunning worker started successfully');
  return worker;
}

/**
 * Add a dunning job to the queue
 */
export async function scheduleDunningJob(orgId: string, invoiceId: string, daysPastDue: number, delay?: number) {
  try {
    const job = await dunningQueue.add('process-dunning', {
      orgId,
      invoiceId,
      daysPastDue
    }, {
      delay: delay || 0,
      jobId: `dunning-${orgId}-${invoiceId}-${daysPastDue}`, // Prevent duplicates
      removeOnComplete: true
    });
    
    console.log(`[dunning] 📅 Scheduled dunning job ${job.id} for org ${orgId}`);
    return job;
  } catch (error) {
    console.error('[dunning] Failed to schedule job:', error);
    throw error;
  }
}

/**
 * Get dunning queue stats for monitoring
 */
export async function getDunningQueueStats() {
  try {
    const waiting = await dunningQueue.getWaiting();
    const active = await dunningQueue.getActive();
    const completed = await dunningQueue.getCompleted();
    const failed = await dunningQueue.getFailed();
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + active.length + completed.length + failed.length
    };
  } catch (error) {
    console.error('[dunning] Failed to get queue stats:', error);
    return { waiting: 0, active: 0, completed: 0, failed: 0, total: 0 };
  }
}