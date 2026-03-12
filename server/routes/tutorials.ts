import { Router } from "express";
import { storage } from "../storage";
import { 
  insertTutorialSchema, insertTutorialStepSchema, insertTutorialProgressSchema, 
  insertTutorialSettingsSchema, tutorialCategorySchema, tutorialStatusSchema
} from "@shared/schema";
import { z } from "zod";

const router = Router();
const getUserId = (req: any) => req.user?.id || req.user?.claims?.sub;

// ============================================
// TUTORIAL MANAGEMENT ENDPOINTS
// ============================================

// GET /api/tutorials - Get all active tutorials
router.get("/", async (req, res) => {
  try {
    const tutorials = await storage.getActiveTutorials();
    res.json(tutorials);
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});

// GET /api/tutorials/all - Get all tutorials (including inactive) - Admin only
router.get("/all", async (req, res) => {
  try {
    // TODO: Add admin role check when user roles are implemented
    const tutorials = await storage.getAllTutorials();
    res.json(tutorials);
  } catch (error) {
    console.error("Error fetching all tutorials:", error);
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});

// GET /api/tutorials/category/:category - Get tutorials by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    
    // Validate category
    const validatedCategory = tutorialCategorySchema.parse(category);
    
    const tutorials = await storage.getTutorialsByCategory(validatedCategory);
    res.json(tutorials);
  } catch (error) {
    console.error("Error fetching tutorials by category:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid category", details: error.errors });
    }
    
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});

// GET /api/tutorials/:id - Get specific tutorial with its steps
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const tutorial = await storage.getTutorial(id);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }

    const steps = await storage.getTutorialSteps(id);
    
    res.json({
      ...tutorial,
      steps
    });
  } catch (error) {
    console.error("Error fetching tutorial:", error);
    res.status(500).json({ error: "Failed to fetch tutorial" });
  }
});

// POST /api/tutorials - Create new tutorial
router.post("/", async (req, res) => {
  try {
    const validatedData = insertTutorialSchema.parse(req.body);
    
    const tutorial = await storage.createTutorial(validatedData);
    res.status(201).json(tutorial);
  } catch (error) {
    console.error("Error creating tutorial:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid tutorial data", details: error.errors });
    }
    
    res.status(500).json({ error: "Failed to create tutorial" });
  }
});

// PUT /api/tutorials/:id - Update tutorial
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const tutorial = await storage.updateTutorial(id, updates);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }
    
    res.json(tutorial);
  } catch (error) {
    console.error("Error updating tutorial:", error);
    res.status(500).json({ error: "Failed to update tutorial" });
  }
});

// DELETE /api/tutorials/:id - Delete tutorial and all related data
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await storage.deleteTutorial(id);
    if (!success) {
      return res.status(404).json({ error: "Tutorial not found" });
    }
    
    res.json({ message: "Tutorial deleted successfully" });
  } catch (error) {
    console.error("Error deleting tutorial:", error);
    res.status(500).json({ error: "Failed to delete tutorial" });
  }
});

// ============================================
// TUTORIAL STEP MANAGEMENT ENDPOINTS
// ============================================

// GET /api/tutorials/:tutorialId/steps - Get all steps for a tutorial
router.get("/:tutorialId/steps", async (req, res) => {
  try {
    const { tutorialId } = req.params;
    
    const steps = await storage.getTutorialSteps(tutorialId);
    res.json(steps);
  } catch (error) {
    console.error("Error fetching tutorial steps:", error);
    res.status(500).json({ error: "Failed to fetch tutorial steps" });
  }
});

// POST /api/tutorials/:tutorialId/steps - Create new tutorial step
router.post("/:tutorialId/steps", async (req, res) => {
  try {
    const { tutorialId } = req.params;
    const stepData = { ...req.body, tutorialId };
    
    const validatedData = insertTutorialStepSchema.parse(stepData);
    
    const step = await storage.createTutorialStep(validatedData);
    res.status(201).json(step);
  } catch (error) {
    console.error("Error creating tutorial step:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid step data", details: error.errors });
    }
    
    res.status(500).json({ error: "Failed to create tutorial step" });
  }
});

// PUT /api/tutorials/:tutorialId/steps/:stepId - Update tutorial step
router.put("/:tutorialId/steps/:stepId", async (req, res) => {
  try {
    const { stepId } = req.params;
    const updates = req.body;
    
    const step = await storage.updateTutorialStep(stepId, updates);
    if (!step) {
      return res.status(404).json({ error: "Tutorial step not found" });
    }
    
    res.json(step);
  } catch (error) {
    console.error("Error updating tutorial step:", error);
    res.status(500).json({ error: "Failed to update tutorial step" });
  }
});

// DELETE /api/tutorials/:tutorialId/steps/:stepId - Delete tutorial step
router.delete("/:tutorialId/steps/:stepId", async (req, res) => {
  try {
    const { stepId } = req.params;
    
    const success = await storage.deleteTutorialStep(stepId);
    if (!success) {
      return res.status(404).json({ error: "Tutorial step not found" });
    }
    
    res.json({ message: "Tutorial step deleted successfully" });
  } catch (error) {
    console.error("Error deleting tutorial step:", error);
    res.status(500).json({ error: "Failed to delete tutorial step" });
  }
});

// ============================================
// USER TUTORIAL PROGRESS ENDPOINTS
// ============================================

// GET /api/tutorials/progress/my - Get all user's tutorial progress
router.get("/progress/my", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const progress = await storage.getUserAllTutorialProgress(userId);
    res.json(progress);
  } catch (error) {
    console.error("Error fetching user tutorial progress:", error);
    res.status(500).json({ error: "Failed to fetch tutorial progress" });
  }
});

// GET /api/tutorials/:tutorialId/progress - Get user's progress for specific tutorial
router.get("/:tutorialId/progress", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const { tutorialId } = req.params;
    
    const progress = await storage.getUserTutorialProgress(userId, tutorialId);
    if (!progress) {
      return res.status(404).json({ error: "Tutorial progress not found" });
    }
    
    res.json(progress);
  } catch (error) {
    console.error("Error fetching tutorial progress:", error);
    res.status(500).json({ error: "Failed to fetch tutorial progress" });
  }
});

// POST /api/tutorials/:tutorialId/start - Start a tutorial
router.post("/:tutorialId/start", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const { tutorialId } = req.params;
    
    // Check if tutorial exists
    const tutorial = await storage.getTutorial(tutorialId);
    if (!tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }
    
    // Check if user already has progress
    let progress = await storage.getUserTutorialProgress(userId, tutorialId);
    
    if (progress && progress.status === 'completed') {
      return res.status(400).json({ error: "Tutorial already completed" });
    }
    
    if (!progress) {
      // Create new progress
      progress = await storage.createTutorialProgress({
        userId,
        tutorialId,
        status: 'in_progress',
        currentStep: 1,
        completedSteps: [],
        skippedSteps: []
      });
    } else {
      // Resume existing progress
      progress = await storage.updateTutorialProgress(progress.id, {
        status: 'in_progress'
      });
    }
    
    res.json(progress);
  } catch (error) {
    console.error("Error starting tutorial:", error);
    res.status(500).json({ error: "Failed to start tutorial" });
  }
});

// POST /api/tutorials/:tutorialId/complete-step - Mark tutorial step as completed
router.post("/:tutorialId/complete-step", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const { tutorialId } = req.params;
    const { stepNumber, timeSpent } = req.body;
    
    if (!stepNumber) {
      return res.status(400).json({ error: "Step number is required" });
    }
    
    const progress = await storage.markTutorialStepCompleted(userId, tutorialId, stepNumber);
    
    // Update time spent if provided
    if (progress && timeSpent) {
      await storage.updateTutorialProgress(progress.id, {
        timeSpentMinutes: (progress.timeSpentMinutes || 0) + timeSpent
      });
    }
    
    res.json(progress);
  } catch (error) {
    console.error("Error completing tutorial step:", error);
    res.status(500).json({ error: "Failed to complete tutorial step" });
  }
});

// POST /api/tutorials/:tutorialId/complete - Mark tutorial as completed
router.post("/:tutorialId/complete", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const { tutorialId } = req.params;
    const { totalTimeSpent } = req.body;
    
    const progress = await storage.markTutorialCompleted(userId, tutorialId);
    
    // Update total time spent if provided
    if (progress && totalTimeSpent) {
      await storage.updateTutorialProgress(progress.id, {
        timeSpentMinutes: totalTimeSpent
      });
    }
    
    res.json(progress);
  } catch (error) {
    console.error("Error completing tutorial:", error);
    res.status(500).json({ error: "Failed to complete tutorial" });
  }
});

// POST /api/tutorials/:tutorialId/skip - Skip tutorial
router.post("/:tutorialId/skip", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const { tutorialId } = req.params;
    
    let progress = await storage.getUserTutorialProgress(userId, tutorialId);
    
    if (!progress) {
      progress = await storage.createTutorialProgress({
        userId,
        tutorialId,
        status: 'skipped',
        currentStep: 1,
        completedSteps: [],
        skippedSteps: []
      });
    } else {
      progress = await storage.updateTutorialProgress(progress.id, {
        status: 'skipped'
      });
    }
    
    res.json(progress);
  } catch (error) {
    console.error("Error skipping tutorial:", error);
    res.status(500).json({ error: "Failed to skip tutorial" });
  }
});

// ============================================
// TUTORIAL SETTINGS ENDPOINTS  
// ============================================

// GET /api/tutorials/settings/my - Get user's tutorial settings
router.get("/settings/my", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    let settings = await storage.getTutorialSettings(userId);
    
    // Create default settings if none exist
    if (!settings) {
      settings = await storage.createTutorialSettings({
        userId,
        autoStartTutorials: true,
        showTooltips: true,
        tutorialSpeed: 'normal',
        preferredPosition: 'bottom',
        disabledCategories: [],
        notificationPreferences: {
          completion_rewards: true,
          progress_reminders: true,
          new_tutorials: true
        },
        experienceLevel: 'beginner'
      });
    }
    
    res.json(settings);
  } catch (error) {
    console.error("Error fetching tutorial settings:", error);
    res.status(500).json({ error: "Failed to fetch tutorial settings" });
  }
});

// PUT /api/tutorials/settings/my - Update user's tutorial settings
router.put("/settings/my", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const updates = req.body;
    
    const settings = await storage.updateTutorialSettings(userId, updates);
    res.json(settings);
  } catch (error) {
    console.error("Error updating tutorial settings:", error);
    res.status(500).json({ error: "Failed to update tutorial settings" });
  }
});

// POST /api/tutorials/settings/reset - Reset user's tutorial settings to defaults
router.post("/settings/reset", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const settings = await storage.resetTutorialSettings(userId);
    res.json(settings);
  } catch (error) {
    console.error("Error resetting tutorial settings:", error);
    res.status(500).json({ error: "Failed to reset tutorial settings" });
  }
});

// ============================================
// TUTORIAL RECOMMENDATIONS ENDPOINT
// ============================================

// GET /api/tutorials/recommendations - Get recommended tutorials for user
router.get("/recommendations", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    // Get user's settings and progress
    const settings = await storage.getTutorialSettings(userId);
    const userProgress = await storage.getUserAllTutorialProgress(userId);
    const completedTutorialIds = userProgress
      .filter(p => p.status === 'completed')
      .map(p => p.tutorialId);
    
    // Get all active tutorials
    const allTutorials = await storage.getActiveTutorials();
    
    // Filter out completed tutorials and apply user preferences
    let recommendations = allTutorials.filter(tutorial => 
      !completedTutorialIds.includes(tutorial.id) &&
      (!settings?.disabledCategories || !settings.disabledCategories.includes(tutorial.category))
    );
    
    // Sort by priority and target user level match
    const userLevel = settings?.experienceLevel || 'beginner';
    recommendations.sort((a, b) => {
      // Prioritize tutorials matching user level
      const aLevelMatch = a.targetUserLevel === userLevel || a.targetUserLevel === 'all';
      const bLevelMatch = b.targetUserLevel === userLevel || b.targetUserLevel === 'all';
      
      if (aLevelMatch && !bLevelMatch) return -1;
      if (!aLevelMatch && bLevelMatch) return 1;
      
      // Then sort by priority
      return (b.priority || 0) - (a.priority || 0);
    });
    
    // Limit to top 5 recommendations
    recommendations = recommendations.slice(0, 5);
    
    res.json(recommendations);
  } catch (error) {
    console.error("Error getting tutorial recommendations:", error);
    res.status(200).json([]);
  }
});

export default router;