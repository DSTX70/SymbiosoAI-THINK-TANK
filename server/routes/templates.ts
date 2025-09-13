import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

// In-memory template store for development
const templateStore: Record<string, any> = {};

// Get all templates
router.get('/templates', (_req, res) => {
  res.json({ items: Object.values(templateStore) });
});

// Get specific template
router.get('/templates/:id', (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }
  res.json(template);
});

// Create new template
router.post('/templates', (req, res) => {
  const id = crypto.randomUUID();
  const template = {
    id,
    version: 1,
    title: req.body.title || 'Untitled',
    tags: req.body.tags || [],
    content: req.body.content || {},
    published: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  templateStore[id] = template;
  res.status(201).json(template);
});

// Publish template
router.post('/templates/:id/publish', (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }
  
  template.published = true;
  template.updatedAt = new Date().toISOString();
  res.json(template);
});

// Update template
router.patch('/templates/:id', (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }
  
  // Update allowed fields
  if (req.body.title !== undefined) template.title = req.body.title;
  if (req.body.tags !== undefined) template.tags = req.body.tags;
  if (req.body.content !== undefined) template.content = req.body.content;
  
  template.version += 1;
  template.updatedAt = new Date().toISOString();
  
  res.json(template);
});

// Delete template
router.delete('/templates/:id', (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'NOT_FOUND' });
  }
  
  delete templateStore[req.params.id];
  res.status(204).send();
});

export default router;