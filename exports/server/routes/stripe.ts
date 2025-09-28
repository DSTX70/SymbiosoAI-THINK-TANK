import { Router } from 'express';
import { z } from 'zod';
import express from 'express';
import { storage } from '../storage';
import { requireAuth, requireSystemPermission, requireWorkspaceAccess, SYSTEM_PERMISSIONS } from '../middleware/rbac';
import { loadEntitlementsContext } from '../middleware/entitlements';
import { StripeService, stripe } from '../services/stripeService';

const router = Router();

// Schema definitions
const createSubscriptionSchema = z.object({
  workspaceId: z.string(),
  plan: z.enum(['pro', 'enterprise']),
  paymentMethodId: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

const changeSubscriptionSchema = z.object({
  subscriptionId: z.string(),
  newPlan: z.enum(['pro', 'enterprise']),
});

const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string(),
  immediate: z.boolean().default(false),
});

/**
 * POST /api/stripe/create-subscription
 * Create a new Stripe subscription
 */
router.post('/create-subscription',
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  requireWorkspaceAccess('admin'), // Must be admin or owner of workspace
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Billing services temporarily unavailable'
        });
      }

      const body = createSubscriptionSchema.parse(req.body);
      const user = (req as any).user;

      // SECURITY: Explicit admin check for exact workspaceId from request body
      const isAdmin = await storage.isWorkspaceAdmin(user.id, body.workspaceId);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: workspace admin required',
          code: 'WORKSPACE_ADMIN_REQUIRED'
        });
      }

      // Check for existing active subscription for this workspace
      const existingSubscription = await storage.getActiveSubscriptionByWorkspaceId(body.workspaceId);
      if (existingSubscription) {
        return res.status(409).json({
          success: false,
          error: 'Workspace already has an active subscription',
          subscriptionId: existingSubscription.stripeSubscriptionId
        });
      }

      // Get or create Stripe customer
      let stripeCustomer;
      const existingCustomer = await storage.getStripeCustomerByUserId(user.id);
      
      if (existingCustomer?.stripeCustomerId) {
        stripeCustomer = await stripe!.customers.retrieve(existingCustomer.stripeCustomerId);
      } else {
        stripeCustomer = await StripeService.createCustomer(user);
        await storage.updateUserStripeCustomerId(user.id, stripeCustomer.id);
      }

      // Get price ID for the plan
      const priceId = StripeService.getPriceId(body.plan);
      if (!priceId) {
        return res.status(400).json({
          success: false,
          error: `Price not configured for plan: ${body.plan}`
        });
      }

      // Create subscription with idempotency key
      const idempotencyKey = body.idempotencyKey || `subscription-${body.workspaceId}-${Date.now()}`;
      const subscription = await StripeService.createSubscription({
        customerId: stripeCustomer.id,
        priceId,
        workspaceId: body.workspaceId,
        idempotencyKey,
        metadata: {
          userId: user.id,
          plan: body.plan,
        },
      });

      // Store subscription in database
      await storage.createSubscription({
        workspaceId: body.workspaceId,
        plan: body.plan,
        status: subscription.status as any,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeSubscriptionId: subscription.id,
        seats: 1,
      });

      // Grant entitlements based on plan
      await storage.grantPlanEntitlements(body.workspaceId, body.plan);

      res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        },
      });

    } catch (error: any) {
      console.error('Subscription creation error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create subscription'
      });
    }
  }
);

/**
 * POST /api/stripe/change-subscription
 * Change an existing subscription plan
 */
router.post('/change-subscription',
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Billing services temporarily unavailable'
        });
      }

      const body = changeSubscriptionSchema.parse(req.body);
      
      // Get subscription and verify workspace admin access
      const subscription = await storage.getSubscriptionByStripeId(body.subscriptionId);
      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Subscription not found'
        });
      }
      
      // SECURITY: Explicit admin check for subscription's workspace
      const user = (req as any).user;
      const isAdmin = await storage.isWorkspaceAdmin(user.id, subscription.workspaceId);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: workspace admin required',
          code: 'WORKSPACE_ADMIN_REQUIRED'
        });
      }
      
      const newPriceId = StripeService.getPriceId(body.newPlan);
      if (!newPriceId) {
        return res.status(400).json({
          success: false,
          error: `Price not configured for plan: ${body.newPlan}`
        });
      }

      // Update subscription in Stripe
      const updatedSubscription = await StripeService.updateSubscription(
        body.subscriptionId,
        newPriceId
      );

      // Update subscription in database
      await storage.updateSubscriptionByStripeId(body.subscriptionId, {
        plan: body.newPlan,
        status: updatedSubscription.status as any,
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        updatedAt: new Date(),
      });

      // Update entitlements - use existing subscription from security check
      if (subscription) {
        await storage.revokeAllEntitlements(subscription.workspaceId);
        await storage.grantPlanEntitlements(subscription.workspaceId, body.newPlan);
      }

      res.json({
        success: true,
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          currentPeriodEnd: updatedSubscription.current_period_end,
        },
      });

    } catch (error: any) {
      console.error('Subscription change error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to change subscription'
      });
    }
  }
);

/**
 * POST /api/stripe/cancel-subscription
 * Cancel a subscription
 */
router.post('/cancel-subscription',
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Billing services temporarily unavailable'
        });
      }

      const body = cancelSubscriptionSchema.parse(req.body);
      
      // Get subscription and verify workspace admin access
      const subscription = await storage.getSubscriptionByStripeId(body.subscriptionId);
      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Subscription not found'
        });
      }
      
      // SECURITY: Explicit admin check for subscription's workspace
      const user = (req as any).user;
      const isAdmin = await storage.isWorkspaceAdmin(user.id, subscription.workspaceId);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: workspace admin required',
          code: 'WORKSPACE_ADMIN_REQUIRED'
        });
      }

      // Cancel subscription in Stripe
      const canceledSubscription = await StripeService.cancelSubscription(
        body.subscriptionId,
        body.immediate
      );

      // Update subscription in database
      await storage.updateSubscriptionByStripeId(body.subscriptionId, {
        status: body.immediate ? 'canceled' : 'active', // Still active until period end
        cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
        updatedAt: new Date(),
      });

      if (body.immediate) {
        // Revoke entitlements immediately
        const subscription = await storage.getSubscriptionByStripeId(body.subscriptionId);
        if (subscription) {
          await storage.revokeAllEntitlements(subscription.workspaceId);
        }
      }

      res.json({
        success: true,
        subscription: {
          id: canceledSubscription.id,
          status: canceledSubscription.status,
          cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
          currentPeriodEnd: canceledSubscription.current_period_end,
        },
      });

    } catch (error: any) {
      console.error('Subscription cancellation error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to cancel subscription'
      });
    }
  }
);

/**
 * POST /api/stripe/create-checkout-session
 * Create a Stripe checkout session for subscription signup
 */
router.post('/create-checkout-session',
  requireAuth,
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Billing services temporarily unavailable'
        });
      }

      const { plan, workspaceId } = req.body;
      const user = (req as any).user;

      const priceId = StripeService.getPriceId(plan);
      if (!priceId) {
        return res.status(400).json({
          success: false,
          error: `Price not configured for plan: ${plan}`
        });
      }

      // Get or create customer
      let customerId;
      const existingCustomer = await storage.getStripeCustomerByUserId(user.id);
      
      if (existingCustomer?.stripeCustomerId) {
        customerId = existingCustomer.stripeCustomerId;
      } else {
        const customer = await StripeService.createCustomer(user);
        customerId = customer.id;
        await storage.updateUserStripeCustomerId(user.id, customer.id);
      }

      const baseUrl = process.env.APP_URL || 'http://localhost:5000';
      
      const session = await StripeService.createCheckoutSession({
        priceId,
        customerId,
        successUrl: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/billing/cancel`,
        metadata: {
          userId: user.id,
          workspaceId,
          plan,
        },
      });

      res.json({
        success: true,
        sessionId: session.id,
        url: session.url,
      });

    } catch (error: any) {
      console.error('Checkout session creation error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create checkout session'
      });
    }
  }
);

/**
 * POST /api/stripe/proration-preview
 * Calculate proration for subscription changes (real Stripe calculation)
 */
router.post('/proration-preview',
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Billing services temporarily unavailable'
        });
      }

      const { subscriptionId, newPlan } = req.body;

      const newPriceId = StripeService.getPriceId(newPlan);
      if (!newPriceId) {
        return res.status(400).json({
          success: false,
          error: `Price not configured for plan: ${newPlan}`
        });
      }

      const prorationData = await StripeService.calculateProrationAmount({
        subscriptionId,
        newPriceId,
      });

      res.json({
        success: true,
        prorationDelta: prorationData.immediateAmount,
        nextInvoiceAmount: prorationData.nextInvoiceAmount,
        currency: prorationData.currency,
        description: `Plan change to ${newPlan}`,
      });

    } catch (error: any) {
      console.error('Proration calculation error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to calculate proration'
      });
    }
  }
);

/**
 * GET /api/stripe/portal
 * Create a Stripe billing portal session
 */
router.get('/portal',
  requireAuth,
  loadEntitlementsContext,
  requireSystemPermission(SYSTEM_PERMISSIONS.MANAGE_BILLING),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Billing services temporarily unavailable'
        });
      }

      const user = (req as any).user;
      
      // Get customer ID
      const existingCustomer = await storage.getStripeCustomerByUserId(user.id);
      if (!existingCustomer?.stripeCustomerId) {
        return res.status(404).json({
          success: false,
          error: 'No billing account found'
        });
      }

      const baseUrl = process.env.APP_URL || 'http://localhost:5000';
      
      const portalSession = await StripeService.createBillingPortalSession(
        existingCustomer.stripeCustomerId,
        `${baseUrl}/billing`
      );

      res.json({
        success: true,
        url: portalSession.url,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      });

    } catch (error: any) {
      console.error('Billing portal error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create billing portal session'
      });
    }
  }
);

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhooks with proper signature verification
 */
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      if (!StripeService.isConfigured()) {
        console.warn('Stripe webhook received but Stripe not configured');
        return res.status(503).json({ error: 'Service unavailable' });
      }

      const signature = req.get('stripe-signature');
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET not configured');
        return res.status(500).json({ error: 'Webhook secret not configured' });
      }

      if (!signature) {
        console.error('Missing stripe-signature header');
        return res.status(400).json({ error: 'Missing signature header' });
      }

      // Verify webhook signature
      const event = StripeService.verifyWebhookSignature(req.body, signature, webhookSecret);

      console.log(`🔔 Stripe webhook received: ${event.type}`);

      // Process webhook events
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object as any);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdate(event.data.object as any);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as any);
          break;

        case 'invoice.payment_succeeded':
          await handlePaymentSucceeded(event.data.object as any);
          break;

        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object as any);
          break;

        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }

      res.json({ received: true, type: event.type });

    } catch (error: any) {
      console.error('Webhook processing error:', error);
      
      if (error.type === 'StripeSignatureVerificationError') {
        return res.status(400).json({ error: 'Invalid signature' });
      }
      
      // Return 200 to prevent Stripe retries for non-signature errors
      res.status(200).json({ 
        received: true, 
        error: 'Processing failed but webhook acknowledged' 
      });
    }
  }
);

// Webhook handler functions
async function handleCheckoutSessionCompleted(session: any) {
  const { customer, subscription, metadata } = session;
  
  if (metadata?.workspaceId && metadata?.plan && subscription) {
    try {
      // Update subscription status in database
      await storage.updateSubscriptionByStripeId(subscription, {
        status: 'active',
        updatedAt: new Date(),
      });

      // Grant entitlements
      await storage.grantPlanEntitlements(metadata.workspaceId, metadata.plan);
      
      console.log(`✅ Checkout completed for workspace ${metadata.workspaceId}`);
    } catch (error) {
      console.error('Error handling checkout completion:', error);
    }
  }
}

async function handleSubscriptionUpdate(subscription: any) {
  try {
    const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
    
    if (dbSubscription) {
      await storage.updateSubscription(dbSubscription.id, {
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date(),
      });

      console.log(`✅ Subscription ${subscription.id} updated`);
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    const dbSubscription = await storage.getSubscriptionByStripeId(subscription.id);
    
    if (dbSubscription) {
      await storage.updateSubscription(dbSubscription.id, {
        status: 'canceled',
        updatedAt: new Date(),
      });

      // Revoke entitlements
      await storage.revokeAllEntitlements(dbSubscription.workspaceId);

      console.log(`❌ Subscription ${subscription.id} canceled`);
    }
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    if (invoice.subscription) {
      const dbSubscription = await storage.getSubscriptionByStripeId(invoice.subscription);
      
      if (dbSubscription) {
        await storage.updateSubscription(dbSubscription.id, {
          status: 'active',
          updatedAt: new Date(),
        });

        console.log(`✅ Payment succeeded for subscription ${invoice.subscription}`);
      }
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    if (invoice.subscription) {
      const dbSubscription = await storage.getSubscriptionByStripeId(invoice.subscription);
      
      if (dbSubscription) {
        await storage.updateSubscription(dbSubscription.id, {
          status: 'past_due',
          updatedAt: new Date(),
        });

        // Create dunning event
        await storage.createDunningEvent({
          invoiceId: invoice.id,
          orgId: dbSubscription.workspaceId,
          event: 'payment_failed',
        });

        console.log(`⚠️ Payment failed for subscription ${invoice.subscription}`);
      }
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

export default router;