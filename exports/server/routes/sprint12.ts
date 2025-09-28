import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { 
  insertDocsSchema, insertAdminSettingsSchema, insertMarketplaceItemsSchema,
  insertChangelogEntriesSchema, insertPlaybooksSchema,
  type Docs, type AdminSettings, type MarketplaceItems, 
  type ChangelogEntries, type Playbooks
} from "@shared/schema";
import { z } from "zod";
import { requireAuth, requireSystemRole, requireSystemPermission } from "../middleware/rbac";
import { loadEntitlementsContext, requireFeature, requirePlanLimit } from "../middleware/entitlements";
import { AppError, createValidationError } from "../utils/errors";

const router = Router();

// ============================================
// DOCS/TUTORIALS SYSTEM
// ============================================

// GET /docs/index - Get all documentation articles
router.get("/docs/index", 
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { category, published } = req.query;
    
    let docs: Docs[];
    if (category) {
      docs = await storage.getDocsByCategory(category as string);
    } else if (published === "true") {
      docs = await storage.getPublishedDocs();
    } else {
      docs = await storage.getAllDocs();
    }

    res.json({
      success: true,
      data: docs,
      meta: {
        total: docs.length,
        categories: [...new Set(docs.map(d => d.category))]
      }
    });
  } catch (error) {
    console.error("Error fetching docs index:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch documentation index" 
    });
  }
});

// GET /docs/article/:id - Get specific documentation article
router.get("/docs/article/:id",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await storage.getDoc(id);
    
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Documentation article not found"
      });
    }

    // Increment view count
    await storage.incrementDocViewCount(id);
    
    res.json({
      success: true,
      data: doc
    });
  } catch (error) {
    console.error("Error fetching doc article:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch documentation article" 
    });
  }
});

// GET /docs/slug/:slug - Get documentation by slug
router.get("/docs/slug/:slug",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const doc = await storage.getDocBySlug(slug);
    
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Documentation article not found"
      });
    }

    // Increment view count
    await storage.incrementDocViewCount(doc.id);
    
    res.json({
      success: true,
      data: doc
    });
  } catch (error) {
    console.error("Error fetching doc by slug:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch documentation article" 
    });
  }
});

// GET /docs/search - Search documentation
router.get("/docs/search",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        error: "Search query is required"
      });
    }

    const docs = await storage.searchDocs(query);
    
    res.json({
      success: true,
      data: docs,
      meta: {
        query,
        total: docs.length
      }
    });
  } catch (error) {
    console.error("Error searching docs:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to search documentation" 
    });
  }
});

// POST /docs/create - Create new documentation (admin only)
router.post("/docs/create", 
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const validatedData = insertDocsSchema.parse(req.body);
      const doc = await storage.createDoc(validatedData);
      
      res.status(201).json({
        success: true,
        data: doc
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error creating doc:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create documentation" 
      });
    }
  }
);

// PUT /docs/:id - Update documentation (admin only)
router.put("/docs/:id",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const doc = await storage.updateDoc(id, updates);
      
      if (!doc) {
        return res.status(404).json({
          success: false,
          error: "Documentation article not found"
        });
      }
      
      res.json({
        success: true,
        data: doc
      });
    } catch (error) {
      console.error("Error updating doc:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to update documentation" 
      });
    }
  }
);

// ============================================
// ADMIN CONSOLE - SETTINGS CRUD
// ============================================

// GET /admin/settings - Get all admin settings
router.get("/admin/settings",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      
      let settings: AdminSettings[];
      if (category) {
        settings = await storage.getAdminSettingsByCategory(category as string);
      } else {
        settings = await storage.getAllAdminSettings();
      }

      res.json({
        success: true,
        data: settings,
        meta: {
          total: settings.length,
          categories: [...new Set(settings.map(s => s.category))]
        }
      });
    } catch (error) {
      console.error("Error fetching admin settings:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch admin settings" 
      });
    }
  }
);

// GET /admin/settings/:key - Get specific admin setting
router.get("/admin/settings/:key",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const setting = await storage.getAdminSetting(key);
      
      if (!setting) {
        return res.status(404).json({
          success: false,
          error: "Admin setting not found"
        });
      }
      
      res.json({
        success: true,
        data: setting
      });
    } catch (error) {
      console.error("Error fetching admin setting:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch admin setting" 
      });
    }
  }
);

// POST /admin/settings - Create new admin setting
router.post("/admin/settings",
  requireAuth,
  requireSystemRole(["system_admin"]),
  async (req: Request, res: Response) => {
    try {
      const validatedData = insertAdminSettingsSchema.parse({
        ...req.body,
        lastModifiedBy: req.user?.id
      });
      
      const setting = await storage.createAdminSetting(validatedData);
      
      res.status(201).json({
        success: true,
        data: setting
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error creating admin setting:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create admin setting" 
      });
    }
  }
);

// PUT /admin/settings/:key - Update admin setting
router.put("/admin/settings/:key",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      
      if (!value) {
        return res.status(400).json({
          success: false,
          error: "Setting value is required"
        });
      }
      
      const setting = await storage.updateAdminSetting(
        key, 
        value, 
        req.user?.id
      );
      
      if (!setting) {
        return res.status(404).json({
          success: false,
          error: "Admin setting not found"
        });
      }
      
      res.json({
        success: true,
        data: setting
      });
    } catch (error) {
      console.error("Error updating admin setting:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to update admin setting" 
      });
    }
  }
);

// DELETE /admin/settings/:key - Delete admin setting
router.delete("/admin/settings/:key",
  requireAuth,
  requireSystemRole(["system_admin"]),
  async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const deleted = await storage.deleteAdminSetting(key);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Admin setting not found"
        });
      }
      
      res.json({
        success: true,
        message: "Admin setting deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting admin setting:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to delete admin setting" 
      });
    }
  }
);

// ============================================
// MARKETPLACE CATALOG & PUBLISH
// ============================================

// GET /marketplace/catalog - Get marketplace catalog
router.get("/marketplace/catalog", async (req: Request, res: Response) => {
  try {
    const { category, featured, publisher } = req.query;
    
    let items: MarketplaceItems[];
    if (category) {
      items = await storage.getMarketplaceItemsByCategory(category as string);
    } else if (featured === "true") {
      items = await storage.getFeaturedMarketplaceItems();
    } else if (publisher) {
      items = await storage.getMarketplaceItemsByPublisher(publisher as string);
    } else {
      items = await storage.getPublishedMarketplaceItems();
    }

    res.json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        categories: [...new Set(items.map(i => i.category))],
        publishers: [...new Set(items.map(i => i.publisher))]
      }
    });
  } catch (error) {
    console.error("Error fetching marketplace catalog:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch marketplace catalog" 
    });
  }
});

// GET /marketplace/item/:id - Get specific marketplace item
router.get("/marketplace/item/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await storage.getMarketplaceItem(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Marketplace item not found"
      });
    }

    // Increment view count
    await storage.incrementMarketplaceItemViews(id);
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error("Error fetching marketplace item:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch marketplace item" 
    });
  }
});

// GET /marketplace/search - Search marketplace items
router.get("/marketplace/search",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        error: "Search query is required"
      });
    }

    const items = await storage.searchMarketplaceItems(query);
    
    res.json({
      success: true,
      data: items,
      meta: {
        query,
        total: items.length
      }
    });
  } catch (error) {
    console.error("Error searching marketplace:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to search marketplace" 
    });
  }
});

// POST /marketplace/publish - Publish new marketplace item
router.post("/marketplace/publish",
  requireAuth,
  requireFeature("marketplace_publish"),
  async (req: Request, res: Response) => {
    try {
      const validatedData = insertMarketplaceItemsSchema.parse({
        ...req.body,
        publisherId: req.user?.id,
        publisher: req.user?.email || "Unknown Publisher"
      });
      
      const item = await storage.createMarketplaceItem(validatedData);
      
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error publishing marketplace item:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to publish marketplace item" 
      });
    }
  }
);

// PUT /marketplace/item/:id - Update marketplace item
router.put("/marketplace/item/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Check ownership
      const existingItem = await storage.getMarketplaceItem(id);
      if (!existingItem) {
        return res.status(404).json({
          success: false,
          error: "Marketplace item not found"
        });
      }
      
      if (existingItem.publisherId !== req.user?.id && 
          !["system_admin", "admin"].includes(req.user?.role || "")) {
        return res.status(403).json({
          success: false,
          error: "You can only update your own marketplace items"
        });
      }
      
      const item = await storage.updateMarketplaceItem(id, updates);
      
      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error("Error updating marketplace item:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to update marketplace item" 
      });
    }
  }
);

// ============================================
// PRICING PACKAGES
// ============================================

// GET /pricing/packages - Get all pricing packages
router.get("/pricing/packages", async (req: Request, res: Response) => {
  try {
    // Static pricing packages for GA Launch
    const packages = [
      {
        id: "free",
        name: "Free",
        price: 0,
        currency: "USD",
        interval: "month",
        features: [
          "5 AI analyses per month",
          "Basic templates",
          "Community support",
          "Standard export formats"
        ],
        limits: {
          analyses: 5,
          templates: 10,
          storage: "1GB",
          support: "Community"
        },
        popular: false
      },
      {
        id: "pro",
        name: "Pro",
        price: 29,
        currency: "USD",
        interval: "month",
        features: [
          "Unlimited AI analyses",
          "Premium templates",
          "Advanced collaboration",
          "Priority support",
          "Custom exports",
          "API access"
        ],
        limits: {
          analyses: "Unlimited",
          templates: "Unlimited",
          storage: "50GB",
          support: "Priority"
        },
        popular: true
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 99,
        currency: "USD",
        interval: "month",
        features: [
          "Everything in Pro",
          "Team collaboration",
          "Advanced security",
          "Custom integrations",
          "Dedicated support",
          "On-premise deployment"
        ],
        limits: {
          analyses: "Unlimited",
          templates: "Unlimited",
          storage: "500GB",
          support: "Dedicated"
        },
        popular: false
      }
    ];

    res.json({
      success: true,
      data: packages,
      meta: {
        total: packages.length,
        currency: "USD"
      }
    });
  } catch (error) {
    console.error("Error fetching pricing packages:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch pricing packages" 
    });
  }
});

// GET /pricing/plans/:plan - Get specific pricing plan
router.get("/pricing/plans/:plan", async (req: Request, res: Response) => {
  try {
    const { plan } = req.params;
    
    // Return detailed plan information
    const planDetails = {
      free: {
        id: "free",
        name: "Free",
        description: "Perfect for getting started with AI-powered analysis",
        price: 0,
        features: ["5 AI analyses", "Basic templates", "Community support"],
        limitations: ["Limited analyses", "Basic features only"],
        recommended: "individuals and small projects"
      },
      pro: {
        id: "pro", 
        name: "Pro",
        description: "Ideal for professionals and growing teams",
        price: 29,
        features: ["Unlimited analyses", "Premium templates", "Priority support"],
        limitations: ["Single user focus"],
        recommended: "professionals and consultants"
      },
      enterprise: {
        id: "enterprise",
        name: "Enterprise", 
        description: "Complete solution for large organizations",
        price: 99,
        features: ["Team collaboration", "Advanced security", "Dedicated support"],
        limitations: [],
        recommended: "large teams and enterprises"
      }
    };

    const planInfo = planDetails[plan as keyof typeof planDetails];
    
    if (!planInfo) {
      return res.status(404).json({
        success: false,
        error: "Pricing plan not found"
      });
    }

    res.json({
      success: true,
      data: planInfo
    });
  } catch (error) {
    console.error("Error fetching pricing plan:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch pricing plan" 
    });
  }
});

// POST /pricing/configure - Configure pricing for organization
router.post("/pricing/configure",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const { plan, seats, customFeatures } = req.body;
      
      // Basic plan validation
      const validPlans = ["free", "pro", "enterprise"];
      if (!validPlans.includes(plan)) {
        return res.status(400).json({
          success: false,
          error: "Invalid pricing plan"
        });
      }

      // Calculate pricing based on plan and seats
      const basePrices = { free: 0, pro: 29, enterprise: 99 };
      const basePrice = basePrices[plan as keyof typeof basePrices];
      const totalPrice = basePrice * (seats || 1);

      const configuration = {
        plan,
        seats: seats || 1,
        basePrice,
        totalPrice,
        customFeatures: customFeatures || [],
        configuredAt: new Date().toISOString(),
        configuredBy: req.user?.id
      };

      res.json({
        success: true,
        data: configuration,
        message: "Pricing configured successfully"
      });
    } catch (error) {
      console.error("Error configuring pricing:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to configure pricing" 
      });
    }
  }
);

// ============================================
// CHANGELOG/COMMUNICATIONS
// ============================================

// GET /changelog/list - Get changelog entries
router.get("/changelog/list",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { type, pinned } = req.query;
    
    let entries: ChangelogEntries[];
    if (type) {
      entries = await storage.getChangelogEntriesByType(type as string);
    } else if (pinned === "true") {
      entries = await storage.getPinnedChangelogEntries();
    } else {
      entries = await storage.getPublishedChangelogEntries();
    }

    res.json({
      success: true,
      data: entries,
      meta: {
        total: entries.length,
        types: [...new Set(entries.map(e => e.type))]
      }
    });
  } catch (error) {
    console.error("Error fetching changelog:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch changelog" 
    });
  }
});

// GET /changelog/:version - Get specific changelog entry
router.get("/changelog/:version",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { version } = req.params;
    const entry = await storage.getChangelogEntryByVersion(version);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        error: "Changelog entry not found"
      });
    }
    
    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error("Error fetching changelog entry:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch changelog entry" 
    });
  }
});

// POST /changelog/add - Add new changelog entry
router.post("/changelog/add",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const validatedData = insertChangelogEntriesSchema.parse({
        ...req.body,
        author: req.user?.email || req.user?.id
      });
      
      const entry = await storage.createChangelogEntry(validatedData);
      
      res.status(201).json({
        success: true,
        data: entry
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error creating changelog entry:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create changelog entry" 
      });
    }
  }
);

// PUT /changelog/:id/publish - Publish changelog entry
router.put("/changelog/:id/publish",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const entry = await storage.publishChangelogEntry(id, req.user?.id || "unknown");
      
      if (!entry) {
        return res.status(404).json({
          success: false,
          error: "Changelog entry not found"
        });
      }
      
      res.json({
        success: true,
        data: entry,
        message: "Changelog entry published successfully"
      });
    } catch (error) {
      console.error("Error publishing changelog entry:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to publish changelog entry" 
      });
    }
  }
);

// ============================================
// SUCCESS PLAYBOOKS
// ============================================

// GET /playbooks/onboarding - Get onboarding playbooks
router.get("/playbooks/onboarding",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const playbooks = await storage.getPlaybooksByType("onboarding");
    
    res.json({
      success: true,
      data: playbooks,
      meta: {
        total: playbooks.length,
        type: "onboarding"
      }
    });
  } catch (error) {
    console.error("Error fetching onboarding playbooks:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch onboarding playbooks" 
    });
  }
});

// GET /playbooks/success/:role - Get success playbooks by role
router.get("/playbooks/success/:role",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const playbooks = await storage.getPlaybooksByRole(role);
    
    res.json({
      success: true,
      data: playbooks,
      meta: {
        total: playbooks.length,
        role
      }
    });
  } catch (error) {
    console.error("Error fetching success playbooks:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch success playbooks" 
    });
  }
});

// GET /playbooks/catalog - Get all playbooks catalog
router.get("/playbooks/catalog",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { type, role, category } = req.query;
    
    let playbooks: Playbooks[];
    if (type) {
      playbooks = await storage.getPlaybooksByType(type as string);
    } else if (role) {
      playbooks = await storage.getPlaybooksByRole(role as string);
    } else if (category) {
      playbooks = await storage.getPlaybooksByCategory(category as string);
    } else {
      playbooks = await storage.getActivePlaybooks();
    }

    res.json({
      success: true,
      data: playbooks,
      meta: {
        total: playbooks.length,
        types: [...new Set(playbooks.map(p => p.type))],
        roles: [...new Set(playbooks.map(p => p.role))],
        categories: [...new Set(playbooks.map(p => p.category))]
      }
    });
  } catch (error) {
    console.error("Error fetching playbooks catalog:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch playbooks catalog" 
    });
  }
});

// GET /playbooks/:id - Get specific playbook
router.get("/playbooks/:id",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const playbook = await storage.getPlaybook(id);
    
    if (!playbook) {
      return res.status(404).json({
        success: false,
        error: "Playbook not found"
      });
    }

    // Increment usage count
    await storage.incrementPlaybookUsage(id);
    
    res.json({
      success: true,
      data: playbook
    });
  } catch (error) {
    console.error("Error fetching playbook:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch playbook" 
    });
  }
});

// GET /tutorials/catalog - Get tutorials catalog (aliased from playbooks)
router.get("/tutorials/catalog",
  requireAuth,
  loadEntitlementsContext,
  async (req: Request, res: Response) => {
  try {
    const tutorials = await storage.getPlaybooksByType("onboarding");
    
    res.json({
      success: true,
      data: tutorials,
      meta: {
        total: tutorials.length,
        type: "tutorials"
      }
    });
  } catch (error) {
    console.error("Error fetching tutorials catalog:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch tutorials catalog" 
    });
  }
});

// POST /playbooks/create - Create new playbook
router.post("/playbooks/create",
  requireAuth,
  requireSystemRole(["system_admin", "admin"]),
  async (req: Request, res: Response) => {
    try {
      const validatedData = insertPlaybooksSchema.parse({
        ...req.body,
        author: req.user?.email || req.user?.id
      });
      
      const playbook = await storage.createPlaybook(validatedData);
      
      res.status(201).json({
        success: true,
        data: playbook
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createValidationError(error));
      }
      console.error("Error creating playbook:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to create playbook" 
      });
    }
  }
);

export default router;