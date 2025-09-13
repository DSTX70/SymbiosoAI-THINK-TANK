import { Router } from 'express';
import { insertTemplateSchema, templateCategorySchema, type Template } from '@shared/schema';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

// In-memory template store for development (until storage is implemented)
const templateStore: Record<string, Template> = {
  // Seed with sample templates to match frontend expectations
  'business-strategy': {
    id: 'business-strategy',
    name: 'Business Strategy Analysis',
    description: 'Comprehensive analysis of business strategies and market positioning',
    category: 'business',
    tags: ['strategy', 'market-analysis', 'competition'],
    content: {
      sections: ['Problem Definition', 'Market Analysis', 'Strategic Options', 'Risk Assessment'],
      prompts: ['Analyze the competitive landscape', 'Define strategic priorities', 'Assess market opportunities']
    },
    isPublic: true,
    usageCount: 245,
    authorId: 'system',
    version: 1,
    metadata: { complexity: 'high', estimatedTime: 30 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  'technical-architecture': {
    id: 'technical-architecture',
    name: 'Technical Architecture Review',
    description: 'In-depth review of technical systems and engineering decisions',
    category: 'technology',
    tags: ['architecture', 'engineering', 'systems'],
    content: {
      sections: ['System Overview', 'Technology Stack', 'Scalability Analysis', 'Security Review'],
      prompts: ['Evaluate system architecture', 'Assess scalability concerns', 'Review security implications']
    },
    isPublic: true,
    usageCount: 189,
    authorId: 'system',
    version: 1,
    metadata: { complexity: 'high', estimatedTime: 45 },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  'market-research': {
    id: 'market-research',
    name: 'Market Research Framework',
    description: 'Systematic approach to market research and consumer insights',
    category: 'business',
    tags: ['research', 'market', 'insights'],
    content: {
      sections: ['Market Size Analysis', 'Customer Segmentation', 'Competitive Analysis', 'Trend Analysis'],
      prompts: ['Define target market', 'Analyze customer needs', 'Evaluate market opportunities']
    },
    isPublic: true,
    usageCount: 156,
    authorId: 'system',
    version: 1,
    metadata: { complexity: 'medium', estimatedTime: 25 },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
};

// Get all templates - returns direct array matching frontend expectations
router.get('/templates', (_req, res) => {
  const templates = Object.values(templateStore);
  res.json(templates);
});

// Get specific template
router.get('/templates/:id', (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

// Create new template
router.post('/templates', (req, res) => {
  try {
    // Validate request body using Zod schema
    const validatedData = insertTemplateSchema.parse(req.body);
    
    const id = crypto.randomUUID();
    const template: Template = {
      id,
      name: validatedData.name,
      description: validatedData.description || '',
      category: validatedData.category,
      tags: validatedData.tags || [],
      content: validatedData.content,
      isPublic: validatedData.isPublic ?? true,
      usageCount: 0,
      authorId: validatedData.authorId || 'unknown',
      version: 1,
      metadata: validatedData.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    templateStore[id] = template;
    res.status(201).json(template);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update template
router.patch('/templates/:id', (req, res) => {
  try {
    const template = templateStore[req.params.id];
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    // Validate partial update data
    const partialSchema = insertTemplateSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    
    // Update template with validated data
    const updatedTemplate: Template = {
      ...template,
      ...validatedData,
      version: template.version + 1,
      updatedAt: new Date()
    };
    
    templateStore[req.params.id] = updatedTemplate;
    res.json(updatedTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Use template (increment usage count)
router.post('/templates/:id/use', (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  template.usageCount += 1;
  template.updatedAt = new Date();
  
  res.json(template);
});

// Delete template
router.delete('/templates/:id', (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  delete templateStore[req.params.id];
  res.status(204).send();
});

export default router;