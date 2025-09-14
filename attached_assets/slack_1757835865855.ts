import { Router } from 'express';
const r = Router();

/** POST /api/integrations/slack/post { text, channel } */
r.post('/integrations/slack/post', async (req, res) => {
  const { text, channel } = req.body || {};
  // In pilots, either log or post via webhook/bot token wired elsewhere
  console.log('[slack.post]', channel || process.env.SLACK_DEFAULT_CHANNEL, text);
  res.json({ ok: true });
});

export default r;
