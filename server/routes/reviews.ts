import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import { requireAuth } from "../middleware/rbac";
import { loadEntitlementsContext, requireFeature } from "../middleware/entitlements";
import express from "express";

export function registerReviewRoutes(app: Express) {
  // Feature flag middleware for all review routes
  const requireReviewsFeature = requireFeature('reviews_enabled');

  // Get all reviews for the current user
  app.get('/api/reviews', 
    requireAuth, 
    loadEntitlementsContext,
    requireReviewsFeature,
    async (req: any, res) => {
      try {
        // Stub implementation - return mock review data
        const mockReviews = [
          {
            id: 'review-1',
            title: 'Analysis Session Export Review',
            description: 'Review export request for sensitive analysis data containing financial projections',
            status: 'pending',
            priority: 'high',
            reviewType: 'export',
            resourceType: 'analysis_session',
            resourceId: 'session-123',
            initiatorId: req.user.claims.sub,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            metadata: {
              exportFormat: 'pdf',
              containsPii: true,
              classification: 'confidential'
            }
          },
          {
            id: 'review-2',
            title: 'Content Publication Review',
            description: 'Review content before publishing to marketplace',
            status: 'in_progress',
            priority: 'medium',
            reviewType: 'content',
            resourceType: 'template',
            resourceId: 'template-456',
            initiatorId: 'user-456',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            metadata: {
              category: 'business',
              targetAudience: 'enterprise'
            }
          },
          {
            id: 'review-3',
            title: 'Security Policy Review',
            description: 'Annual review of data retention and security policies',
            status: 'approved',
            priority: 'low',
            reviewType: 'policy',
            resourceType: 'policy',
            resourceId: 'policy-789',
            initiatorId: 'admin-123',
            completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
            completedBy: 'approver-789',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
            metadata: {
              policyType: 'retention',
              impact: 'organization-wide'
            }
          }
        ];

        res.json(mockReviews);
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
        
        // Stub implementation - return mock review data
        const mockReview = {
          id: id,
          title: 'Analysis Session Export Review',
          description: 'Review export request for sensitive analysis data containing financial projections and competitive intelligence',
          status: 'pending',
          priority: 'high',
          reviewType: 'export',
          resourceType: 'analysis_session',
          resourceId: 'session-123',
          initiatorId: req.user.claims.sub,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          metadata: {
            exportFormat: 'pdf',
            containsPii: true,
            classification: 'confidential',
            requestedBy: req.user.claims.email,
            estimatedPageCount: 45
          }
        };

        res.json(mockReview);
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
        
        // Mock review steps
        const mockSteps = [
          {
            id: 'step-1',
            stepNumber: 1,
            title: 'Initial Security Scan',
            description: 'Automated scan for sensitive data patterns',
            status: 'completed',
            isRequired: true,
            canSkip: false,
            completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            completedBy: 'system'
          },
          {
            id: 'step-2',
            stepNumber: 2,
            title: 'Manager Approval',
            description: 'Department manager review and approval',
            status: 'pending',
            isRequired: true,
            canSkip: false
          },
          {
            id: 'step-3',
            stepNumber: 3,
            title: 'Legal Review',
            description: 'Legal team review for compliance',
            status: 'pending',
            isRequired: true,
            canSkip: false
          }
        ];

        res.json(mockSteps);
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
        
        // Mock review comments
        const mockComments = [
          {
            id: 'comment-1',
            authorId: 'security-team',
            content: 'Initial scan detected 3 PII patterns and 2 financial data references. Please review the export scope.',
            commentType: 'suggestion',
            isInternal: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'comment-2',
            authorId: req.user.claims.sub,
            content: 'The financial data is necessary for the quarterly board presentation. Can we redact specific customer names instead?',
            commentType: 'comment',
            isInternal: false,
            createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
          }
        ];

        res.json(mockComments);
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
        
        console.log(`✅ Review ${id} approved by ${req.user.claims.sub}`, { comment });
        
        // In real implementation, would update database
        res.json({
          success: true,
          message: 'Review approved successfully',
          reviewId: id,
          approvedBy: req.user.claims.sub,
          approvedAt: new Date().toISOString(),
          comment
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
        
        if (!comment) {
          return res.status(400).json({ message: 'Rejection comment is required' });
        }
        
        console.log(`❌ Review ${id} rejected by ${req.user.claims.sub}`, { comment, reason });
        
        // In real implementation, would update database
        res.json({
          success: true,
          message: 'Review rejected',
          reviewId: id,
          rejectedBy: req.user.claims.sub,
          rejectedAt: new Date().toISOString(),
          comment,
          reason
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
        
        if (!content) {
          return res.status(400).json({ message: 'Comment content is required' });
        }
        
        console.log(`💬 Comment added to review ${id} by ${req.user.claims.sub}`);
        
        const newComment = {
          id: `comment-${Date.now()}`,
          authorId: req.user.claims.sub,
          content,
          commentType,
          isInternal: false,
          createdAt: new Date().toISOString()
        };
        
        res.json({
          success: true,
          message: 'Comment added successfully',
          comment: newComment
        });
      } catch (error: any) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
      }
    }
  );
}