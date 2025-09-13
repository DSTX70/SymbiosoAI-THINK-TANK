import { Queue, Worker, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import crypto from 'crypto';

export type WebhookJob = {
  eventId: string;
  eventType: string;
  payload: any;
  endpointUrl: string;
  secret: string;
  attempt?: number;
};

// Connection state management
enum RedisState {
  UNKNOWN,
  AVAILABLE,
  UNAVAILABLE
}

let redisState = RedisState.UNKNOWN;
let connection: IORedis | null = null;
let webhookQueue: Queue<WebhookJob> | null = null;
let worker: Worker<WebhookJob> | null = null;

// Test Redis availability without any connection attempts if not configured
async function testRedisAvailability(): Promise<boolean> {
  if (redisState === RedisState.AVAILABLE) return true;
  if (redisState === RedisState.UNAVAILABLE) return false;

  // If REDIS_URL is not set, immediately mark as unavailable without connection attempts
  if (!process.env.REDIS_URL) {
    redisState = RedisState.UNAVAILABLE;
    console.log('ℹ️  [webhookDelivery] REDIS_URL not set, using synchronous delivery for development');
    return false;
  }

  // Only attempt connection if REDIS_URL is actually configured
  try {
    const testConnection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 0, // Prevent retries
      connectTimeout: 3000,
      lazyConnect: true,
    });

    await testConnection.ping();
    await testConnection.quit();
    
    redisState = RedisState.AVAILABLE;
    console.log('✅ [webhookDelivery] Redis available, will use queue-based delivery');
    return true;
  } catch (error) {
    redisState = RedisState.UNAVAILABLE;
    console.log('ℹ️  [webhookDelivery] Redis unavailable, using synchronous delivery for development');
    return false;
  }
}

// Create Redis connection and queue only when Redis is available
async function initializeRedisQueue(): Promise<void> {
  if (connection && webhookQueue) return;

  connection = new IORedis(process.env.REDIS_URL || {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    maxRetriesPerRequest: null,
    retryDelayOnFailover: 100,
    lazyConnect: true
  });

  connection.on('error', (err) => {
    console.warn('[webhookDelivery] Redis connection error:', err.message);
    redisState = RedisState.UNAVAILABLE;
  });

  connection.on('connect', () => {
    console.log('✅ [webhookDelivery] Redis connected');
    redisState = RedisState.AVAILABLE;
  });

  webhookQueue = new Queue<WebhookJob>('webhook-delivery', { connection });
}

function signPayload(body: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

// Synchronous webhook delivery for development mode (no Redis)
async function deliverWebhookSync(data: WebhookJob): Promise<void> {
  const body = JSON.stringify({
    id: data.eventId,
    type: data.eventType,
    data: data.payload,
    timestamp: Date.now()
  });
  
  const signature = signPayload(body, data.secret);
  
  try {
    const response = await fetch(data.endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Id': data.eventId,
        'User-Agent': 'SymbiosoAI-Webhook/1.0'
      },
      body
    });
    
    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.status} ${response.statusText}`);
    }
    
    console.log(`✅ [webhookDelivery] Successfully delivered webhook ${data.eventId} to ${data.endpointUrl} (sync mode)`);
  } catch (error: any) {
    console.error(`❌ [webhookDelivery] Failed to deliver webhook ${data.eventId}:`, error.message);
    // In development mode, we just log the error and continue
  }
}

export async function enqueueWebhookDelivery(
  data: WebhookJob,
  opts: JobsOptions = {}
): Promise<void> {
  const redisAvailable = await testRedisAvailability();
  
  if (redisAvailable) {
    // Use Redis queue for reliable delivery
    if (!webhookQueue) {
      await initializeRedisQueue();
    }
    
    if (webhookQueue) {
      await webhookQueue.add('deliver', data, {
        removeOnComplete: true,
        attempts: 1,
        ...opts
      });
      console.log(`📤 [webhookDelivery] Queued webhook ${data.eventId} for delivery`);
    } else {
      // Fallback to sync if queue creation failed
      await deliverWebhookSync(data);
    }
  } else {
    // Use synchronous delivery for development
    await deliverWebhookSync(data);
  }
}

export async function startWebhookWorker(): Promise<Worker<WebhookJob> | null> {
  const redisAvailable = await testRedisAvailability();
  
  if (!redisAvailable) {
    console.log('ℹ️  [webhookDelivery] Running in development mode with synchronous webhook delivery');
    return null;
  }
  
  if (worker) {
    console.log('ℹ️  [webhookDelivery] Worker already running');
    return worker;
  }

  try {
    if (!webhookQueue) {
      await initializeRedisQueue();
    }

    if (!connection || !webhookQueue) {
      throw new Error('Failed to initialize Redis connection and queue');
    }

    // Create the worker
    worker = new Worker<WebhookJob>(
      'webhook-delivery',
      async (job) => {
        const data = job.data;
        await deliverWebhookSync(data);
      },
      { connection }
    );

    // Handle failed deliveries with exponential backoff retry
    worker.on('failed', async (job, err) => {
      const attempt = (job?.data?.attempt || 0) + 1;
      const maxRetries = Number(process.env.WEBHOOK_MAX_RETRIES || 6);
      
      if (attempt <= maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        
        console.log(`🔄 [webhookDelivery] Retrying webhook ${job?.data?.eventId} (attempt ${attempt}/${maxRetries}) in ${delay}ms`);
        
        await enqueueWebhookDelivery(
          { ...job!.data, attempt },
          { delay }
        );
      } else {
        console.error(`❌ [webhookDelivery] Permanently failed webhook ${job?.data?.eventId}:`, err?.message);
      }
    });

    worker.on('completed', (job) => {
      console.log(`✅ [webhookDelivery] Completed webhook ${job.data.eventId}`);
    });

    console.log('✅ [webhookDelivery] Webhook worker started with Redis backend');
    return worker;
    
  } catch (error: any) {
    console.warn(`⚠️  [webhookDelivery] Failed to start Redis worker: ${error.message}`);
    console.log('ℹ️  [webhookDelivery] Falling back to synchronous delivery mode');
    redisState = RedisState.UNAVAILABLE;
    return null;
  }
}

// Graceful shutdown
export async function stopWebhookWorker(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
    console.log('🛑 [webhookDelivery] Worker stopped');
  }
  
  if (connection) {
    await connection.quit();
    connection = null;
    console.log('🛑 [webhookDelivery] Redis connection closed');
  }
  
  webhookQueue = null;
  redisState = RedisState.UNKNOWN;
}