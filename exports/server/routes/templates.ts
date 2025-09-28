import { Router } from 'express';
import { insertTemplateSchema, templateCategorySchema, type Template } from '@shared/schema';
import { z } from 'zod';
import crypto from 'crypto';
import { requireAuth, requireWorkspaceAccess, requireWorkspacePermission, WORKSPACE_PERMISSIONS } from '../middleware/rbac';
import { loadEntitlementsContext, requireFeature, BILLING_FEATURES } from '../middleware/entitlements';

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
      prompt: "Analyze the business strategy and competitive positioning of [Company/Industry]. Consider market dynamics, competitive advantages, potential risks, and strategic recommendations for growth.",
      agents: ["analyst", "pragmatist", "critic"],
      domainExperts: ["financial-analyst", "brand-strategist"],
      reasoningFramework: "strategic_thinking",
      debateRounds: 6,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: true,
      rating: 4.8,
      uses: 245,
      complexity: "high"
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
      prompt: "Review the technical architecture of [System/Application]. Evaluate scalability, security, maintainability, and performance. Identify potential improvements and architectural trade-offs.",
      agents: ["analyst", "critic", "thoughtful"],
      domainExperts: ["tech-architect", "devops-engineer"],
      reasoningFramework: "systems_thinking",
      debateRounds: 7,
      requireCitations: false,
      enableFactCheck: false,
      enableLiveWeb: false,
      rating: 4.6,
      uses: 189,
      complexity: "high"
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
      prompt: "Conduct comprehensive market research for [Product/Service/Market]. Analyze target demographics, market size, competitive landscape, pricing strategies, and consumer behavior patterns.",
      agents: ["analyst", "pragmatist", "innovator"],
      domainExperts: ["research-scientist"],
      reasoningFramework: "analytical_framework",
      debateRounds: 5,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: true,
      rating: 4.7,
      uses: 156,
      complexity: "medium"
    },
    isPublic: true,
    usageCount: 156,
    authorId: 'system',
    version: 1,
    metadata: { complexity: 'medium', estimatedTime: 25 },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  'ai-ethics': {
    id: 'ai-ethics',
    name: 'AI Ethics Discussion',
    description: 'Comprehensive framework for analyzing AI ethical implications',
    category: 'research',
    tags: ['ai', 'ethics', 'philosophy'],
    content: {
      prompt: "Examine the ethical implications of [AI Technology/Application]. Consider bias, fairness, privacy, transparency, accountability, and societal impact. Provide balanced perspectives on responsible AI development.",
      agents: ["thoughtful", "critic", "analyst"],
      domainExperts: ["behavioral-analyst"],
      reasoningFramework: "ethical_framework",
      debateRounds: 8,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: false,
      rating: 4.9,
      uses: 98,
      complexity: "high"
    },
    isPublic: true,
    usageCount: 98,
    authorId: 'system',
    version: 1,
    metadata: { complexity: 'high', estimatedTime: 40 },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  'product-launch': {
    id: 'product-launch',
    name: 'Product Launch Strategy',
    description: 'Strategic planning for new product introductions',
    category: 'business',
    tags: ['product', 'launch', 'strategy'],
    content: {
      prompt: "Develop a comprehensive product launch strategy for [Product]. Consider target market, pricing, distribution channels, marketing campaigns, competitive positioning, and success metrics.",
      agents: ["innovator", "pragmatist", "analyst"],
      domainExperts: ["brand-strategist"],
      reasoningFramework: "strategic_thinking",
      debateRounds: 5,
      requireCitations: false,
      enableFactCheck: true,
      enableLiveWeb: true,
      rating: 4.5,
      uses: 203,
      complexity: "medium"
    },
    isPublic: true,
    usageCount: 203,
    authorId: 'system',
    version: 1,
    metadata: { complexity: 'medium', estimatedTime: 25 },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  'security-audit': {
    id: 'security-audit',
    name: 'Security Assessment Framework',
    description: 'Comprehensive security analysis and risk evaluation',
    category: 'technology',
    tags: ['security', 'audit', 'risk'],
    content: {
      prompt: "Conduct a comprehensive security assessment of [System/Application/Infrastructure]. Identify vulnerabilities, assess risk levels, and recommend security improvements and best practices.",
      agents: ["critic", "analyst", "thoughtful"],
      domainExperts: ["tech-architect"],
      reasoningFramework: "risk_assessment",
      debateRounds: 6,
      requireCitations: false,
      enableFactCheck: false,
      enableLiveWeb: false,
      rating: 4.8,
      uses: 134,
      complexity: "high"
    },
    isPublic: true,
    usageCount: 134,
    authorId: 'system',
    version: 1,
    metadata: { complexity: 'high', estimatedTime: 35 },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
};

// Get all templates - returns direct array matching frontend expectations
router.get('/templates', 
  requireAuth,
  loadEntitlementsContext,
  (_req, res) => {
  const templates = Object.values(templateStore);
  res.json(templates);
});

// Get specific template
router.get('/templates/:id',
  requireAuth,
  loadEntitlementsContext,
  (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  res.json(template);
});

// Create new template
router.post('/templates',
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.CUSTOM_TEMPLATES),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES),
  (req, res) => {
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
router.patch('/templates/:id',
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.CUSTOM_TEMPLATES),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES),
  (req, res) => {
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
      version: (template.version || 1) + 1,
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
router.post('/templates/:id/use',
  requireAuth,
  loadEntitlementsContext,
  (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  template.usageCount = (template.usageCount || 0) + 1;
  template.updatedAt = new Date();
  
  res.json(template);
});

// Delete template
router.delete('/templates/:id',
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.CUSTOM_TEMPLATES),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE_TEMPLATES),
  (req, res) => {
  const template = templateStore[req.params.id];
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  delete templateStore[req.params.id];
  res.status(204).send();
});

export default router;