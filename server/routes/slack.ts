import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { requireFeature, loadEntitlementsContext } from '../middleware/entitlements';
import { requireWorkspacePermission } from '../middleware/rbac';
import { BILLING_FEATURES } from '../middleware/entitlements';
import { WORKSPACE_PERMISSIONS } from '../middleware/rbac';

const router = Router();

// Valid Slack webhook URL validator
function isValidSlackWebhook(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'hooks.slack.com' && 
           parsedUrl.pathname.startsWith('/services/');
  } catch {
    return false;
  }
}

// Slack notification payload schema
const SlackNotificationSchema = z.object({
  webhook_url: z.string().url('Invalid webhook URL').refine(
    isValidSlackWebhook, 
    'Webhook URL must be a valid Slack webhook (hooks.slack.com)'
  ),
  channel: z.string().optional(),
  sessionId: z.string().min(1, 'Session ID required'),
  debateResults: z.object({
    consensus: z.string(),
    dissents: z.array(z.object({
      position: z.string(),
      reasoning: z.string().optional()
    })).optional(),
    unresolved: z.array(z.string()).optional(),
    participants: z.array(z.string()).optional(),
    duration_ms: z.number().optional()
  }),
  notificationLevel: z.enum(['summary', 'detailed', 'full']).default('summary'),
  includeAttachments: z.boolean().default(false)
});

// Format debate results for Slack message
function formatDebateForSlack(debateResults: any, level: 'summary' | 'detailed' | 'full', sessionId: string) {
  const baseMessage = {
    username: 'SymbiosoAi ThinkTank',
    icon_emoji: ':brain:',
    attachments: []
  };

  // Summary level - just consensus
  if (level === 'summary') {
    baseMessage.text = `🧠 *Debate Completed* (Session: \`${sessionId.slice(0, 8)}\`)`;
    baseMessage.attachments = [{
      color: 'good',
      fields: [{
        title: 'Consensus Reached',
        value: debateResults.consensus.substring(0, 500) + (debateResults.consensus.length > 500 ? '...' : ''),
        short: false
      }]
    }];
    return baseMessage;
  }

  // Detailed level - consensus + dissents + unresolved
  if (level === 'detailed') {
    baseMessage.text = `🧠 *Detailed Debate Results* (Session: \`${sessionId.slice(0, 8)}\`)`;
    const attachment: any = {
      color: 'good',
      fields: [{
        title: '✅ Consensus',
        value: debateResults.consensus.substring(0, 300) + (debateResults.consensus.length > 300 ? '...' : ''),
        short: false
      }]
    };

    if (debateResults.dissents?.length > 0) {
      attachment.fields.push({
        title: '⚠️ Dissenting Views',
        value: debateResults.dissents.map((d: any, i: number) => 
          `${i + 1}. ${d.position}${d.reasoning ? ` - ${d.reasoning.substring(0, 100)}` : ''}`
        ).join('\n').substring(0, 500),
        short: false
      });
    }

    if (debateResults.unresolved?.length > 0) {
      attachment.fields.push({
        title: '🔍 Unresolved Issues',
        value: debateResults.unresolved.slice(0, 3).map((item: string) => `• ${item}`).join('\n'),
        short: false
      });
    }

    baseMessage.attachments = [attachment];
    return baseMessage;
  }

  // Full level - everything including metadata
  if (level === 'full') {
    baseMessage.text = `🧠 *Complete Debate Analysis* (Session: \`${sessionId}\`)`;
    const mainAttachment: any = {
      color: 'good',
      fields: [{
        title: '✅ Final Consensus',
        value: debateResults.consensus,
        short: false
      }],
      footer: `SymbiosoAi ThinkTank | ${new Date().toISOString()}`
    };

    if (debateResults.participants?.length) {
      mainAttachment.fields.push({
        title: '👥 Participants',
        value: debateResults.participants.join(', '),
        short: true
      });
    }

    if (debateResults.duration_ms) {
      mainAttachment.fields.push({
        title: '⏱️ Duration',
        value: `${Math.round(debateResults.duration_ms / 1000)}s`,
        short: true
      });
    }

    baseMessage.attachments = [mainAttachment];

    // Add separate attachments for dissents and unresolved
    if (debateResults.dissents?.length > 0) {
      baseMessage.attachments.push({
        color: 'warning',
        title: '⚠️ Dissenting Positions',
        text: debateResults.dissents.map((d: any, i: number) => 
          `*${i + 1}. ${d.position}*${d.reasoning ? `\n_${d.reasoning}_` : ''}`
        ).join('\n\n')
      });
    }

    if (debateResults.unresolved?.length > 0) {
      baseMessage.attachments.push({
        color: '#ff9500',
        title: '🔍 Unresolved Questions',
        text: debateResults.unresolved.map((item: string) => `• ${item}`).join('\n')
      });
    }

    return baseMessage;
  }

  return baseMessage;
}

// POST /api/slack/notify - Send debate results to Slack channel
router.post('/notify', 
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.INTEGRATIONS),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_INTEGRATIONS),
  async (req: Request, res: Response) => {
  try {
    const parsed = SlackNotificationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        details: parsed.error.flatten() 
      });
    }

    const { webhook_url, channel, sessionId, debateResults, notificationLevel, includeAttachments } = parsed.data;

    // Format the message for Slack
    const slackMessage = formatDebateForSlack(debateResults, notificationLevel, sessionId);
    
    // Add channel override if specified
    if (channel) {
      slackMessage.channel = channel;
    }

    // Send to Slack webhook
    const slackResponse = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    });

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      console.error('Slack notification failed:', errorText);
      return res.status(400).json({ 
        error: 'Failed to send Slack notification', 
        details: errorText.substring(0, 200) 
      });
    }

    // Log successful notification
    console.log(`📢 Slack notification sent for session ${sessionId} with ${notificationLevel} detail level`);
    
    res.json({ 
      success: true, 
      sessionId, 
      notificationLevel,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Slack notification error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/slack/test - Test Slack webhook connectivity
router.post('/test',
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.INTEGRATIONS),
  async (req: Request, res: Response) => {
  try {
    const { webhook_url, channel } = req.body;
    
    if (!webhook_url || typeof webhook_url !== 'string') {
      return res.status(400).json({ error: 'webhook_url is required' });
    }

    if (!isValidSlackWebhook(webhook_url)) {
      return res.status(400).json({ 
        error: 'Invalid webhook URL - must be a valid Slack webhook (hooks.slack.com)' 
      });
    }

    const testMessage = {
      username: 'SymbiosoAi ThinkTank',
      icon_emoji: ':robot_face:',
      text: '🧪 *Test Message from SymbiosoAi ThinkTank*',
      attachments: [{
        color: 'good',
        fields: [{
          title: 'Integration Status',
          value: '✅ Slack integration is working correctly!',
          short: false
        }, {
          title: 'Test Time',
          value: new Date().toISOString(),
          short: true
        }],
        footer: 'SymbiosoAi ThinkTank Integration Test'
      }]
    };

    if (channel) {
      testMessage.channel = channel;
    }

    const slackResponse = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage),
    });

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      return res.status(400).json({ 
        success: false,
        error: 'Slack webhook test failed', 
        details: errorText 
      });
    }

    res.json({ 
      success: true, 
      message: 'Test message sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Slack test error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;