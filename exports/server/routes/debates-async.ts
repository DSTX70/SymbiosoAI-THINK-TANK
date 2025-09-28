import { Router, Request, Response } from 'express';
import { enqueueDebate, debateQueueEvents } from '../queue/queue';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { storage } from '../storage';

const router = Router();

const EnqueueSchema = z.object({
  sessionId: z.string().min(1),
  mode: z.enum(['simple', 'guided', 'expert']),
  prompt: z.string().min(1)
});

// POST /api/debates-async -> { jobId } - Enqueue debate for async processing
router.post('/debates-async', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = EnqueueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    console.log(`🚀 Enqueueing async debate: ${parsed.data.mode} mode for session ${parsed.data.sessionId}`);
    
    // Create debate run record
    try {
      await storage.createDebateRun({
        sessionId: parsed.data.sessionId,
        mode: parsed.data.mode,
        status: 'running'
      });
    } catch (error) {
      console.warn('Failed to create debate run record:', error);
    }

    const job = await enqueueDebate(parsed.data);
    
    // Handle sync fallback
    if (job.result) {
      console.log('✅ Completed synchronous debate processing');
      return res.json({ 
        jobId: job.id, 
        status: 'completed',
        result: job.result 
      });
    }

    return res.json({ jobId: job.id, status: 'queued' });
  } catch (error) {
    console.error('Failed to enqueue debate:', error);
    return res.status(500).json({ error: 'Failed to enqueue debate' });
  }
});

// GET /api/debates-async/:jobId/stream -> SSE progress stream
router.get('/debates-async/:jobId/stream', requireAuth, async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  if (!jobId) return res.status(400).end();

  // Handle sync jobs (immediate response)
  if (jobId.startsWith('sync-')) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    res.write(`event: progress\ndata: ${JSON.stringify({ progress: 100 })}\n\n`);
    res.write(`event: completed\ndata: ${JSON.stringify({ status: 'completed' })}\n\n`);
    res.end();
    return;
  }

  if (!debateQueueEvents) {
    return res.status(503).json({ error: 'Queue not available' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

  const onProgress = (args: { jobId: string; data: number }) => {
    if (String(args.jobId) === String(jobId)) {
      res.write(`event: progress\ndata: ${JSON.stringify({ progress: args.data })}\n\n`);
    }
  };

  const onCompleted = (args: { jobId: string; returnvalue: unknown }) => {
    if (String(args.jobId) === String(jobId)) {
      console.log(`✅ Debate job ${jobId} completed via SSE`);
      res.write(`event: completed\ndata: ${JSON.stringify(args.returnvalue)}\n\n`);
      res.end();
      cleanup();
    }
  };

  const onFailed = (args: { jobId: string; failedReason: string }) => {
    if (String(args.jobId) === String(jobId)) {
      console.error(`❌ Debate job ${jobId} failed via SSE:`, args.failedReason);
      res.write(`event: failed\ndata: ${JSON.stringify({ error: args.failedReason })}\n\n`);
      res.end();
      cleanup();
    }
  };

  function cleanup() {
    debateQueueEvents?.removeListener('progress', onProgress as any);
    debateQueueEvents?.removeListener('completed', onCompleted as any);
    debateQueueEvents?.removeListener('failed', onFailed as any);
  }

  debateQueueEvents.on('progress', onProgress as any);
  debateQueueEvents.on('completed', onCompleted as any);
  debateQueueEvents.on('failed', onFailed as any);

  req.on('close', cleanup);
  req.on('end', cleanup);

  // Send initial progress
  res.write(`event: progress\ndata: ${JSON.stringify({ progress: 0 })}\n\n`);
});

export default router;