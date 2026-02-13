import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware/rbac";
import { loadEntitlementsContext, requireFeature } from "../middleware/entitlements";
import express from "express";

export function registerReviewRoutes(app: Express) {
  // Feature flag middleware for all review routes
  const requireReviewsFeature = requireFeature('reviews_enabled');
  const getUserId = (req: any) => req.user?.id || req.user?.claims?.sub;

  // Get all reviews for the current user
  app.get('/api/reviews', 
    requireAuth, 
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req: any, res) => {
      try {
        const userId = getUserId(req);
        const organizationId = req.query.organizationId as string | undefined;
        const workspaceId = req.query.workspaceId as string | undefined;
        const mineOnly = String(req.query.mine || "true") === "true";

        let reviews;
        if (mineOnly && userId) {
          reviews = await storage.getReviewsByInitiator(userId);
        } else {
          reviews = await storage.getReviews(organizationId, workspaceId);
        }

        res.json(reviews);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
      }
    }
  );

  // Get specific review details
  app.get('/api/reviews/:id', 
    requireAuth, 
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const review = await storage.getReview(id);
        if (!review) {
          return res.status(404).json({ message: 'Review not found' });
        }

        res.json(review);
      } catch (error: any) {
        console.error('Error fetching review:', error);
        res.status(500).json({ message: 'Failed to fetch review details' });
      }
    }
  );

  // Get review steps
  app.get('/api/reviews/:id/steps', 
    requireAuth, 
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const steps = await storage.getReviewSteps(id);
        res.json(steps);
      } catch (error: any) {
        console.error('Error fetching review steps:', error);
        res.status(500).json({ message: 'Failed to fetch review steps' });
      }
    }
  );

  // Get review comments
  app.get('/api/reviews/:id/comments', 
    requireAuth, 
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const comments = await storage.getReviewComments(id);
        res.json(comments);
      } catch (error: any) {
        console.error('Error fetching review comments:', error);
        res.status(500).json({ message: 'Failed to fetch review comments' });
      }
    }
  );

  // Approve review
  app.post('/api/reviews/:id/approve', 
    requireAuth, 
    loadEntitlementsContext,
    requireReviewsFeature,
    express.json(),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const { comment } = req.body;
        const userId = getUserId(req);
        const review = await storage.approveReview(id, userId);
        if (!review) {
          return res.status(404).json({ message: 'Review not found' });
        }

        if (comment) {
          await storage.createReviewComment({
            reviewId: id,
            authorId: userId,
            content: comment,
            commentType: "approval_note",
            isInternal: false,
          });
        }

        res.json({
          success: true,
          message: 'Review approved successfully',
          review
        });
      } catch (error: any) {
        console.error('Error approving review:', error);
        res.status(500).json({ message: 'Failed to approve review' });
      }
    }
  );

  // Reject review
  app.post('/api/reviews/:id/reject', 
    requireAuth, 
    loadEntitlementsContext,
    requireReviewsFeature,
    express.json(),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const { comment, reason } = req.body;
        const userId = getUserId(req);
        
        if (!comment) {
          return res.status(400).json({ message: 'Rejection comment is required' });
        }

        const review = await storage.rejectReview(id, userId, reason);
        if (!review) {
          return res.status(404).json({ message: 'Review not found' });
        }

        await storage.createReviewComment({
          reviewId: id,
          authorId: userId,
          content: comment,
          commentType: "objection",
          isInternal: false,
        });

        res.json({
          success: true,
          message: 'Review rejected',
          review
        });
      } catch (error: any) {
        console.error('Error rejecting review:', error);
        res.status(500).json({ message: 'Failed to reject review' });
      }
    }
  );

  // Add comment to review
  app.post('/api/reviews/:id/comments', 
    requireAuth, 
    loadEntitlementsContext,
    requireReviewsFeature,
    express.json(),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const { content, commentType = 'comment' } = req.body;
        const userId = getUserId(req);
        
        if (!content) {
          return res.status(400).json({ message: 'Comment content is required' });
        }

        const newComment = await storage.createReviewComment({
          reviewId: id,
          authorId: userId,
          content,
          commentType,
          isInternal: false,
        });

        res.json({ success: true, message: 'Comment added successfully', comment: newComment });
      } catch (error: any) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
      }
    }
  );
}
