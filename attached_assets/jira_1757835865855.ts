import { Router } from 'express';
const r = Router();

/** POST /api/integrations/jira/create { projectKey, summary, description } */
r.post('/integrations/jira/create', async (req, res) => {
  const { projectKey = 'SYM', summary = 'Decision created', description = '' } = req.body || {};
  const issueKey = projectKey + '-' + Math.floor(Math.random() * 10000);
  console.log('[jira.create]', issueKey, summary);
  res.status(201).json({ ok: true, issueKey });
});

export default r;
