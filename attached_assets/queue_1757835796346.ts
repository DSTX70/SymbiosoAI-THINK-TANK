import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is not set");
}

const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {})
});

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

export const debateQueue = new Queue<DebateJobData>('debate', { connection });
export const debateQueueEvents = new QueueEvents('debate', { connection });

/** Start the debate worker (simple simulated steps; replace with real orchestration) */
export function startDebateWorker() {
  const worker = new Worker<DebateJobData, DebateJobResult>(
    'debate',
    async (job) => {
      const steps = ['plan', 'round_1', 'round_2', 'consensus'];
      for (let i = 0; i < steps.length; i++) {
        await job.updateProgress(Math.round(((i + 1) / steps.length) * 100));
        // TODO: call AI orchestration per step; persist partials
        await new Promise((r) => setTimeout(r, 250));
      }
      return {
        consensus: '...consensus text...',
        dissent: ['...dissent 1...', '...dissent 2...'],
        artifacts: []
      };
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    console.error('[debateWorker] failed', job?.id, err);
  });

  return worker;
}

/** Enqueue a debate job */
export async function enqueueDebate(data: DebateJobData, opts: JobsOptions = {}) {
  return debateQueue.add('debate-run', data, {
    removeOnComplete: true,
    attempts: 1,
    ...opts
  });
}
