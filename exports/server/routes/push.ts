import { Router } from 'express';
import webpush from 'web-push';
import { storage } from '../storage';
import { insertPushSubscriptionSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// Configure VAPID keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@symbiosoai.com';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.warn('⚠️ VAPID keys not configured. Push notifications will not work. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.');
} else {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log('✅ Web push configured with VAPID keys');
}

// Validation schema for push subscription request
const subscriptionRequestSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
  userAgent: z.string().optional(),
});

// Subscribe to push notifications
router.post('/push/subscribe', async (req, res) => {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Push notifications not configured', 
        message: 'VAPID keys are missing' 
      });
    }

    // Check if user is authenticated
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate subscription data
    const subscriptionData = subscriptionRequestSchema.parse(req.body);

    // Check if subscription already exists for this endpoint
    const existingSubscriptions = await storage.getUserPushSubscriptions(req.user.id);
    const duplicateSubscription = existingSubscriptions.find(
      sub => sub.endpoint === subscriptionData.endpoint
    );

    if (duplicateSubscription) {
      return res.status(200).json({ 
        message: 'Subscription already exists',
        subscriptionId: duplicateSubscription.id
      });
    }

    // Create new subscription
    const newSubscription = await storage.createPushSubscription({
      userId: req.user.id,
      endpoint: subscriptionData.endpoint,
      p256dh: subscriptionData.keys.p256dh,
      auth: subscriptionData.keys.auth,
      userAgent: subscriptionData.userAgent || req.get('User-Agent') || null,
      isActive: true,
    });

    return res.status(201).json({ 
      message: 'Push subscription created successfully',
      subscriptionId: newSubscription.id
    });

  } catch (error) {
    console.error('Push subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid subscription data', 
        details: error.errors 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to create push subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Unsubscribe from push notifications
router.delete('/push/unsubscribe', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { endpoint, subscriptionId } = req.body;

    if (!endpoint && !subscriptionId) {
      return res.status(400).json({ 
        error: 'Either endpoint or subscriptionId is required' 
      });
    }

    let deleted = false;

    if (subscriptionId) {
      deleted = await storage.deletePushSubscription(subscriptionId);
    } else if (endpoint) {
      deleted = await storage.deletePushSubscriptionByEndpoint(endpoint, req.user.id);
    }

    if (deleted) {
      return res.status(200).json({ message: 'Push subscription removed successfully' });
    } else {
      return res.status(404).json({ error: 'Subscription not found' });
    }

  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return res.status(500).json({ 
      error: 'Failed to remove push subscription',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Send test push notification
router.post('/push/test', async (req, res) => {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Push notifications not configured', 
        message: 'VAPID keys are missing' 
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { message, title, icon, badge } = req.body;

    // Get user's push subscriptions
    const subscriptions = await storage.getUserPushSubscriptions(req.user.id);

    if (subscriptions.length === 0) {
      return res.status(404).json({ 
        error: 'No push subscriptions found', 
        message: 'User has no active push subscriptions' 
      });
    }

    // Prepare push notification payload
    const payload = JSON.stringify({
      title: title || 'Test Notification',
      body: message || 'This is a test push notification from SymbiosoAI ThinkTank',
      icon: icon || '/symbiosoai-logo.png',
      badge: badge || '/symbiosoai-logo.png',
      timestamp: Date.now(),
      data: {
        url: '/',
        type: 'test'
      }
    });

    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          }
        }, payload);
        return { subscriptionId: subscription.id, status: 'sent' };
      } catch (error) {
        console.error('Failed to send push notification:', error);
        
        // If subscription is invalid, mark it as inactive
        if (error.statusCode === 410 || error.statusCode === 404) {
          await storage.updatePushSubscription(subscription.id, { isActive: false });
        }
        
        return { 
          subscriptionId: subscription.id, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    return res.status(200).json({
      message: 'Test push notifications sent',
      results: {
        total: subscriptions.length,
        sent: successCount,
        failed: failureCount,
        details: results
      }
    });

  } catch (error) {
    console.error('Test push notification error:', error);
    return res.status(500).json({ 
      error: 'Failed to send test push notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// List user's push subscriptions (for development/admin)
router.get('/push/subscriptions', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const subscriptions = await storage.getUserPushSubscriptions(req.user.id);

    // Return sanitized subscription data (without sensitive keys)
    const sanitizedSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      endpoint: sub.endpoint,
      userAgent: sub.userAgent,
      isActive: sub.isActive,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt
    }));

    return res.status(200).json({
      subscriptions: sanitizedSubscriptions,
      total: sanitizedSubscriptions.length
    });

  } catch (error) {
    console.error('Get push subscriptions error:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve push subscriptions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get VAPID public key for client-side subscription
router.get('/push/vapid-public-key', (req, res) => {
  if (!VAPID_PUBLIC_KEY) {
    return res.status(500).json({ 
      error: 'VAPID not configured', 
      message: 'Push notifications are not available' 
    });
  }

  return res.status(200).json({ 
    publicKey: VAPID_PUBLIC_KEY 
  });
});

export default router;