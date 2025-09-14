import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

const router = Router();

// Schema for proration preview request
const prorationPreviewSchema = z.object({
  orgId: z.string().optional(),
  currentPlan: z.string(),
  newPlan: z.string(),
  seats: z.number().optional(),
  daysRemaining: z.number().optional()
});

// Schema for dunning simulation request
const dunningSimulateSchema = z.object({
  orgId: z.string(),
  invoiceId: z.string().uuid(),
  daysPastDue: z.number()
});

/**
 * POST /billing/proration/preview
 * Calculate proration delta for plan upgrades/downgrades
 */
router.post('/proration/preview', async (req, res) => {
  try {
    const body = prorationPreviewSchema.parse(req.body);
    
    // Simple proration calculation (in production, this would integrate with Stripe)
    const planPrices = {
      'free': 0,
      'starter': 2900, // $29.00 in cents
      'pro': 7900, // $79.00 in cents
      'professional': 7900, // $79.00 in cents
      'enterprise': 19900 // $199.00 in cents
    };
    
    const currentPrice = planPrices[body.currentPlan as keyof typeof planPrices] || 0;
    const targetPrice = planPrices[body.newPlan as keyof typeof planPrices] || 0;
    const seats = body.seats || 1;
    const daysRemainingInCycle = body.daysRemaining || 15; // Use provided days or default to 15
    
    // Calculate prorated difference (simplified - in reality would factor in billing cycle)
    const prorationDelta = (targetPrice - currentPrice) * seats;
    const actualProration = Math.round((prorationDelta * daysRemainingInCycle) / 30);
    
    res.json({
      success: true,
      prorationDelta: actualProration,
      currency: 'usd',
      description: `${body.currentPlan} → ${body.newPlan}`,
      effectiveDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error('Proration preview error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? 'Invalid request data' : 'Proration calculation failed'
    });
  }
});

/**
 * POST /billing/dunning/simulate
 * Simulate dunning flow for overdue invoices
 */
router.post('/dunning/simulate', async (req, res) => {
  try {
    const body = dunningSimulateSchema.parse(req.body);
    
    // Create dunning event record
    await storage.createDunningEvent({
      invoiceId: body.invoiceId,
      orgId: body.orgId,
      event: `dunning_simulation_${body.daysPastDue}d`,
      createdAt: new Date()
    });
    
    // Determine next action based on days past due
    let nextAction: string;
    let gracePeriod = parseInt(process.env.DUNNING_GRACE_DAYS || '7');
    
    if (body.daysPastDue <= gracePeriod) {
      nextAction = 'remind';
    } else if (body.daysPastDue <= gracePeriod + 14) {
      nextAction = 'warn';
    } else {
      nextAction = 'suspend';
    }
    
    res.json({
      success: true,
      nextAction,
      daysPastDue: body.daysPastDue,
      gracePeriodRemaining: Math.max(0, gracePeriod - body.daysPastDue),
      suspensionDate: body.daysPastDue > gracePeriod + 14 ? new Date().toISOString() : null,
      notificationScheduled: true
    });
  } catch (error) {
    console.error('Dunning simulation error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof z.ZodError ? 'Invalid request data' : 'Dunning simulation failed'
    });
  }
});

/**
 * GET /billing/portal
 * Get self-serve billing portal URL
 */
router.get('/portal', async (req, res) => {
  try {
    // In production, this would generate a Stripe billing portal session
    const orgId = (req as any).orgId || 'demo-org';
    const billingPortalUrl = process.env.BILLING_PUBLIC_URL || 'http://localhost:3000';
    
    // Mock billing portal URL (would be Stripe portal URL in production)
    const portalUrl = `${billingPortalUrl}/billing/portal?org=${orgId}&session=${Date.now()}`;
    
    res.json({
      success: true,
      url: portalUrl,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour expiry
    });
  } catch (error) {
    console.error('Billing portal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate billing portal URL'
    });
  }
});

export default router;