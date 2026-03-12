import Stripe from 'stripe';
import { storage } from '../storage';
import { withRetry } from '../utils/withRetry';

// Initialize Stripe with error handling
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY not configured - billing features will be disabled');
}

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
    typescript: true,
  });
}

export { stripe };

// Stripe service functions
export class StripeService {
  
  static isConfigured(): boolean {
    return stripe !== null;
  }

  /**
   * Create a Stripe customer for a user
   */
  static async createCustomer(user: { id: string; email: string; firstName?: string; lastName?: string }) {
    if (!stripe) throw new Error('Stripe not configured');
    
    const customer = await withRetry(() =>
      stripe!.customers.create({
        email: user.email,
        name: [user.firstName, user.lastName].filter(Boolean).join(' '),
        metadata: {
          userId: user.id,
        },
      })
    );

    return customer;
  }

  /**
   * Create a subscription for a workspace
   */
  static async createSubscription(params: {
    customerId: string;
    priceId: string;
    workspaceId: string;
    idempotencyKey?: string;
    metadata?: Record<string, string>;
  }) {
    if (!stripe) throw new Error('Stripe not configured');

    const createParams: any = {
      customer: params.customerId,
      items: [{ price: params.priceId }],
      metadata: {
        workspaceId: params.workspaceId,
        ...params.metadata,
      },
      expand: ['latest_invoice.payment_intent'],
    };
    
    // Add idempotency key if provided
    if (params.idempotencyKey) {
      createParams.idempotency_key = params.idempotencyKey;
    }
    
    const subscription = await withRetry(() => stripe!.subscriptions.create(createParams));

    return subscription;
  }

  /**
   * Update a subscription (for plan changes)
   */
  static async updateSubscription(subscriptionId: string, newPriceId: string) {
    if (!stripe) throw new Error('Stripe not configured');

    const subscription = await withRetry(() => stripe!.subscriptions.retrieve(subscriptionId));
    
    return await withRetry(() => stripe!.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    }));
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string, immediate = false) {
    if (!stripe) throw new Error('Stripe not configured');

    if (immediate) {
      return await withRetry(() => stripe!.subscriptions.cancel(subscriptionId));
    } else {
      return await withRetry(() => stripe!.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      }));
    }
  }

  /**
   * Create a billing portal session
   */
  static async createBillingPortalSession(customerId: string, returnUrl: string) {
    if (!stripe) throw new Error('Stripe not configured');

    return await withRetry(() =>
      stripe!.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })
    );
  }

  /**
   * Create a checkout session for one-time payments
   */
  static async createCheckoutSession(params: {
    priceId: string;
    customerId?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }) {
    if (!stripe) throw new Error('Stripe not configured');

    return await withRetry(() =>
      stripe!.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: params.priceId, quantity: 1 }],
        customer: params.customerId,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        metadata: params.metadata,
      })
    );
  }

  /**
   * Retrieve upcoming invoice preview for proration calculations
   */
  static async getUpcomingInvoice(params: {
    customerId: string;
    subscriptionId: string;
    subscriptionItems: Array<{ id: string; price: string }>;
  }) {
    if (!stripe) throw new Error('Stripe not configured');

    return await withRetry(() =>
      stripe!.invoices.retrieveUpcoming({
        customer: params.customerId,
        subscription: params.subscriptionId,
        subscription_items: params.subscriptionItems,
      })
    );
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string | Buffer, signature: string, secret: string): Stripe.Event {
    if (!stripe) throw new Error('Stripe not configured');

    return stripe.webhooks.constructEvent(payload, signature, secret);
  }

  /**
   * Get Stripe price IDs for plans
   */
  static getPriceId(plan: string): string | null {
    const priceIds: Record<string, string> = {
      pro: process.env.STRIPE_PRO_PRICE_ID || '',
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
    };

    return priceIds[plan] || null;
  }

  /**
   * Calculate proration amount for subscription changes
   */
  static async calculateProrationAmount(params: {
    subscriptionId: string;
    newPriceId: string;
  }) {
    if (!stripe) throw new Error('Stripe not configured');

    const subscription = await withRetry(() => stripe!.subscriptions.retrieve(params.subscriptionId));
    
    try {
      const upcomingInvoice = await withRetry(() =>
        stripe!.invoices.retrieveUpcoming({
          customer: subscription.customer as string,
          subscription: params.subscriptionId,
          subscription_items: [{
            id: subscription.items.data[0].id,
            price: params.newPriceId,
          }],
        })
      );

      // Calculate immediate charge amount
      const immediateAmount = upcomingInvoice.lines.data
        .filter(line => line.proration)
        .reduce((sum, line) => sum + line.amount, 0);

      return {
        immediateAmount,
        nextInvoiceAmount: upcomingInvoice.amount_due,
        currency: upcomingInvoice.currency,
      };
    } catch (error) {
      console.error('Error calculating proration:', error);
      throw error;
    }
  }
}
