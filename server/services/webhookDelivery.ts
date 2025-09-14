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
  timestamp?: number;
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

  // Only create connection if REDIS_URL is actually set
  if (!process.env.REDIS_URL) {
    console.log('⚠️ [webhookDelivery] REDIS_URL not set, Redis queue not initialized');
    redisState = RedisState.UNAVAILABLE;
    return;
  }

  try {
    connection = new IORedis(process.env.REDIS_URL, {
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
    console.log('✅ [webhookDelivery] Redis queue initialized');
  } catch (error) {
    console.error('❌ [webhookDelivery] Failed to initialize Redis queue:', error);
    connection = null;
    redisState = RedisState.UNAVAILABLE;
  }
}

/**
 * Generate a versioned HMAC signature for webhook payload
 * Signature format: sha256=<hex_signature>
 * Signed data: <timestamp>.<json_body>
 * 
 * For webhook receivers to verify signatures:
 * 1. Extract timestamp from X-Webhook-Timestamp header
 * 2. Verify timestamp is within acceptable tolerance (e.g., ±5 minutes)
 * 3. Reconstruct signed payload: `${timestamp}.${body}`
 * 4. Compute HMAC-SHA256 and compare with signature
 */
function signPayload(body: string, timestamp: string, secret: string): string {
  const payload = `${timestamp}.${body}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `sha256=${signature}`;
}

/**
 * Validate webhook timestamp for replay protection
 * Returns true if timestamp is within acceptable tolerance
 */
export function validateWebhookTimestamp(timestamp: string, toleranceMinutes: number = 5): boolean {
  try {
    const requestTime = parseInt(timestamp, 10) * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const tolerance = toleranceMinutes * 60 * 1000; // Convert to milliseconds
    
    return Math.abs(currentTime - requestTime) <= tolerance;
  } catch {
    return false;
  }
}

/**
 * Verify webhook signature using the same algorithm as signPayload
 * Example usage for webhook receivers:
 * 
 * const signature = req.headers['x-webhook-signature'];
 * const timestamp = req.headers['x-webhook-timestamp'];
 * const body = JSON.stringify(req.body);
 * 
 * if (!validateWebhookTimestamp(timestamp)) {
 *   throw new Error('Request timestamp too old');
 * }
 * 
 * if (!verifyWebhookSignature(body, timestamp, signature, secret)) {
 *   throw new Error('Invalid signature');
 * }
 */
export function verifyWebhookSignature(
  body: string, 
  timestamp: string, 
  receivedSignature: string, 
  secret: string
): boolean {
  try {
    const expectedSignature = signPayload(body, timestamp, secret);
    
    // Use crypto.timingSafeEqual to prevent timing attacks
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(receivedSignature, 'utf8');
    
    return expectedBuffer.length === receivedBuffer.length &&
           crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch {
    return false;
  }
}

// Synchronous webhook delivery for development mode (no Redis)
async function deliverWebhookSync(data: WebhookJob): Promise<void> {
  // Validate that secret is provided
  if (!data.secret || data.secret.trim() === '') {
    throw new Error('Webhook secret is required but not provided');
  }
  
  const timestamp = data.timestamp || Date.now();
  const timestampStr = Math.floor(timestamp / 1000).toString();
  
  const body = JSON.stringify({
    id: data.eventId,
    type: data.eventType,
    data: data.payload,
    timestamp
  });
  
  const signature = signPayload(body, timestampStr, data.secret);
  
  try {
    const response = await fetch(data.endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Timestamp': timestampStr,
        'X-Webhook-Id': data.eventId,
        'User-Agent': 'SymbiosoAI-Webhook/1.0'
      },
      body
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Webhook delivery failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    console.log(`✅ [webhookDelivery] Successfully delivered webhook ${data.eventId} to ${data.endpointUrl} (${redisState === RedisState.AVAILABLE ? 'queue' : 'sync'} mode)`);
  } catch (error: any) {
    console.error(`❌ [webhookDelivery] Failed to deliver webhook ${data.eventId}:`, error.message);
    // Re-throw the error so BullMQ can detect the failure and trigger retries
    throw error;
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
        attempts: Number(process.env.WEBHOOK_MAX_RETRIES || 6),
        backoff: {
          type: 'exponential',
          settings: {
            delay: 2000, // Start with 2s delay
          },
        },
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