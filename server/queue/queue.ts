import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.warn("REDIS_URL is not set, using memory fallback for development");
}

// Create Redis connection with fallback for development
const connection = redisUrl ? new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {})
}) : null;

export type DebateJobData = {
  sessionId: string;
  mode: 'simple' | 'guided' | 'expert';
  prompt: string;
};

export type DebateJobResult = {
  consensus: string;
  dissent: string[];
  artifacts: Array<{ type: string; content: unknown }>;
};

export const debateQueue = connection ? new Queue<DebateJobData>('debate', { connection }) : null;
export const debateQueueEvents = connection ? new QueueEvents('debate', { connection }) : null;

/**
 * startDebateWorker
 * Call this once at server boot to start processing jobs.
 */
export function startDebateWorker() {
  if (!connection || !debateQueue) {
    console.log("⚠️ Redis not configured, running debates synchronously");
    return null;
  }

  const worker = new Worker<DebateJobData, DebateJobResult>('debate', async (job) => {
    console.log(`🚀 Starting debate job ${job.id} for session ${job.data.sessionId}`);
    
    // Import AI service here to avoid circular dependencies
    const { runMultiAgentDebate } = await import('../ai-service');
    
    // Simulate multi-step run with real AI service integration
    const steps = ['plan', 'round_1', 'round_2', 'consensus'];
    
    try {
      for (let i = 0; i < steps.length; i++) {
        const progress = Math.round(((i + 1) / steps.length) * 100);
        await job.updateProgress(progress);
        
        // Add realistic delay for each step
        await new Promise((r) => setTimeout(r, 500));
      }

      // Call actual AI service to run the debate
      const result = await runMultiAgentDebate({
        question: job.data.prompt,
        mode: job.data.mode,
        rounds: job.data.mode === 'simple' ? 3 : job.data.mode === 'guided' ? 5 : 7,
        domain_expert: null,
        thinking_pattern: null,
        enable_fact_check: false
      });

      console.log(`✅ Completed debate job ${job.id}`);
      return {
        consensus: result.consensus || "Consensus generated through async processing",
        dissent: result.dissenting_viewpoints || [],
        artifacts: [{
          type: 'debate_result',
          content: result
        }]
      };
    } catch (error) {
      console.error(`❌ Failed debate job ${job.id}:`, error);
      throw error;
    }
  }, { connection });

  worker.on('failed', (job, err) => {
    console.error('[debateWorker] failed', job?.id, err);
  });

  worker.on('completed', (job) => {
    console.log(`[debateWorker] completed job ${job.id}`);
  });

  console.log("✅ Debate worker started");
  return worker;
}

/**
 * enqueueDebate
 */
export async function enqueueDebate(data: DebateJobData, opts: JobsOptions = {}) {
  if (!debateQueue) {
    // Fallback: run synchronously if no Redis
    const { runMultiAgentDebate } = await import('../ai-service');
    const result = await runMultiAgentDebate({
      question: data.prompt,
      mode: data.mode,
      rounds: data.mode === 'simple' ? 3 : data.mode === 'guided' ? 5 : 7,
      domain_expert: null,
      thinking_pattern: null,
      enable_fact_check: false
    });
    
    return {
      id: `sync-${Date.now()}`,
      data,
      result: {
        consensus: result.consensus || "Consensus generated synchronously",
        dissent: result.dissenting_viewpoints || [],
        artifacts: [{ type: 'debate_result', content: result }]
      }
    };
  }

  return debateQueue.add('debate-run', data, {
    removeOnComplete: true,
    attempts: 1,
    ...opts
  });
}