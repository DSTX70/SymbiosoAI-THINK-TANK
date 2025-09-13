import { Router, Request, Response } from 'express';
import { enqueueDebate, debateQueueEvents } from '../queue/queue';
import { z } from 'zod';

const router = Router();

const EnqueueSchema = z.object({
  sessionId: z.string().min(1),
  mode: z.enum(['simple', 'guided', 'expert']),
  prompt: z.string().min(1)
});

// POST /api/debates -> { jobId }
router.post('/debates', async (req: Request, res: Response) => {
  const parsed = EnqueueSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const job = await enqueueDebate(parsed.data);
  return res.json({ jobId: job.id });
});

// GET /api/debates/:jobId/stream -> SSE progress stream
router.get('/debates/:jobId/stream', async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  if (!jobId) return res.status(400).end();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onProgress = (args: { jobId: string; data: number }) => {
    if (String(args.jobId) === String(jobId)) {
      res.write(`event: progress\ndata: ${JSON.stringify({ progress: args.data })}\n\n`);
    }
  };

  const onCompleted = (args: { jobId: string; returnvalue: unknown }) => {
    if (String(args.jobId) === String(jobId)) {
      res.write(`event: completed\ndata: ${JSON.stringify(args.returnvalue)}\n\n`);
      res.end();
      cleanup();
    }
  };

  const onFailed = (args: { jobId: string; failedReason: string }) => {
    if (String(args.jobId) === String(jobId)) {
      res.write(`event: failed\ndata: ${JSON.stringify({ error: args.failedReason })}\n\n`);
      res.end();
      cleanup();
    }
  };

  function cleanup() {
    debateQueueEvents.removeListener('progress', onProgress as any);
    debateQueueEvents.removeListener('completed', onCompleted as any);
    debateQueueEvents.removeListener('failed', onFailed as any);
  }

  debateQueueEvents.on('progress', onProgress as any);
  debateQueueEvents.on('completed', onCompleted as any);
  debateQueueEvents.on('failed', onFailed as any);

  req.on('close', cleanup);
});

export default router;
