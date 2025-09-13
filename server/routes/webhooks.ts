import { Router } from 'express';
import crypto from 'crypto';
import { enqueueWebhookDelivery } from '../services/webhookDelivery';

const router = Router();

// Webhook test endpoint - allows testing webhook delivery
router.post('/webhooks/test', async (req, res) => {
  try {
    // Ensure webhook secret is configured for production safety
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (!webhookSecret || webhookSecret.trim() === '') {
      return res.status(500).json({ 
        error: 'Server configuration error', 
        message: 'WEBHOOK_SECRET environment variable is required but not set' 
      });
    }
    
    if (!req.body.endpointUrl) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'endpointUrl is required' 
      });
    }
    
    const eventId = req.body.idempotencyKey || crypto.randomUUID();
    
    await enqueueWebhookDelivery({
      eventId,
      eventType: req.body.event || 'test',
      payload: req.body.payload || {},
      endpointUrl: req.body.endpointUrl,
      secret: webhookSecret,
      timestamp: Date.now()
    });
    
    res.json({ enqueued: true, eventId });
  } catch (error: any) {
    console.error('Error enqueuing webhook:', error);
    res.status(500).json({ error: 'Failed to enqueue webhook', message: error.message });
  }
});

export default router;