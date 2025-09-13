import { Router } from 'express';
import crypto from 'crypto';
import { enqueueWebhookDelivery } from '../services/webhookDelivery';

const router = Router();

// Webhook test endpoint - allows testing webhook delivery
router.post('/webhooks/test', async (req, res) => {
  try {
    const eventId = req.body.idempotencyKey || crypto.randomUUID();
    
    await enqueueWebhookDelivery({
      eventId,
      eventType: req.body.event || 'test',
      payload: req.body.payload || {},
      endpointUrl: req.body.endpointUrl,
      secret: process.env.WEBHOOK_SECRET || 'change_me'
    });
    
    res.json({ enqueued: true, eventId });
  } catch (error: any) {
    console.error('Error enqueuing webhook:', error);
    res.status(500).json({ error: 'Failed to enqueue webhook', message: error.message });
  }
});

export default router;