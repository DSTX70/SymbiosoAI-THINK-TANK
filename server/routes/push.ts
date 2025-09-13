import { Router } from 'express';
import webpush from 'web-push';

const router = Router();

// Push notification subscription endpoint
router.post('/push/subscribe', (req, res) => {
  // For now, just return success - can be expanded with actual subscription logic
  return res.status(201).json({ ok: true });
});

export default router;