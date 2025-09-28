import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { sanitizeFilename } from '../utils/sanitizeFilename';
import { dlpMiddleware } from '../middleware/dlp';
import { requireAuth } from '../middleware/auth';
import { requireWorkspaceAccess, requireWorkspacePermission, WORKSPACE_PERMISSIONS } from '../middleware/rbac';
import { loadEntitlementsContext, requireFeature, BILLING_FEATURES } from '../middleware/entitlements';
import { storage } from '../storage';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const router = Router();

// Zod validation schema for export requests
const exportRequestSchema = z.object({
  filename: z.string().min(1).max(255).default('decision-dossier.txt'),
  format: z.enum(['docx', 'pdf', 'json', 'text']).default('text'),
  title: z.string().min(1).max(500).default('Analysis Report'),
  content: z.string(), // Required but can be empty string
  metadata: z.object({
    generatedAt: z.string().optional(),
    reportType: z.string().optional(),
    sessionId: z.string().optional(),
  }).optional().nullable(),
  workspaceId: z.string().uuid().optional().nullable(),
});

// Function to generate Word document from content
async function generateWordDocument(title: string, content: string, metadata?: any): Promise<Buffer> {
  const paragraphs: Paragraph[] = [];
  
  // Add title
  paragraphs.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    })
  );
  
  // Add metadata if available
  if (metadata) {
    paragraphs.push(new Paragraph({ text: "" })); // Empty line
    
    if (metadata.generatedAt) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Generated: ",
              bold: true,
            }),
            new TextRun({
              text: new Date(metadata.generatedAt).toLocaleString(),
            }),
          ],
        })
      );
    }
    
    if (metadata.reportType) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Report Type: ",
              bold: true,
            }),
            new TextRun({
              text: metadata.reportType,
            }),
          ],
        })
      );
    }
    
    if (metadata.sessionId) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Session ID: ",
              bold: true,
            }),
            new TextRun({
              text: metadata.sessionId,
            }),
          ],
        })
      );
    }
    
    paragraphs.push(new Paragraph({ text: "" })); // Empty line
    paragraphs.push(new Paragraph({ text: "─".repeat(50) })); // Separator
    paragraphs.push(new Paragraph({ text: "" })); // Empty line
  }
  
  // Process content - split by lines and handle basic formatting
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.trim() === '') {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }
    
    // Handle headers
    if (line.startsWith('# ')) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1,
        })
      );
    } else if (line.startsWith('## ')) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2,
        })
      );
    } else if (line.startsWith('### ')) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3,
        })
      );
    } else if (line.startsWith('#### ')) {
      paragraphs.push(
        new Paragraph({
          text: line.substring(5),
          heading: HeadingLevel.HEADING_4,
        })
      );
    } else {
      // Regular paragraph - handle basic formatting
      const textRuns: TextRun[] = [];
      const text = line;
      
      // Simple bold formatting
      if (text.includes('**')) {
        const parts = text.split('**');
        for (let i = 0; i < parts.length; i++) {
          if (i % 2 === 0) {
            // Normal text
            if (parts[i]) {
              textRuns.push(new TextRun({ text: parts[i] }));
            }
          } else {
            // Bold text
            if (parts[i]) {
              textRuns.push(new TextRun({ text: parts[i], bold: true }));
            }
          }
        }
      } else {
        textRuns.push(new TextRun({ text: text }));
      }
      
      paragraphs.push(
        new Paragraph({
          children: textRuns,
        })
      );
    }
  }
  
  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });
  
  // Generate buffer
  return await Packer.toBuffer(doc);
}

// POST /api/export - DLP-protected export endpoint
router.post('/export',
  requireAuth,
  loadEntitlementsContext,
  requireFeature(BILLING_FEATURES.EXPORT_PDF), // EXPORT_PDF covers all document formats including Word, PDF, JSON, etc.
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.EXPORT_DATA),
  dlpMiddleware,
  async (req: Request, res: Response) => {
  try {
    // Validate request body with Zod schema
    const parseResult = exportRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: "Invalid request data", 
        details: parseResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }

    const { filename, content, format, title, metadata, workspaceId } = parseResult.data;
    
    const userId = (req as any).user?.id || (req as any).session?.user?.id;
    
    // Validate workspaceId if provided
    if (workspaceId) {
      try {
        const workspace = await storage.getWorkspace(workspaceId);
        if (!workspace) {
          return res.status(404).json({ 
            error: "Workspace not found",
            code: "WORKSPACE_NOT_FOUND" 
          });
        }
        
        // Check if user has access to this workspace
        const membership = await storage.getWorkspaceMembership(workspaceId, userId);
        if (!membership) {
          return res.status(403).json({ 
            error: "Access denied to workspace",
            code: "WORKSPACE_ACCESS_DENIED" 
          });
        }
      } catch (error) {
        console.error('Workspace validation failed:', error);
        return res.status(500).json({ 
          error: "Failed to validate workspace access",
          code: "WORKSPACE_VALIDATION_ERROR" 
        });
      }
    }

    // Determine content type and generate appropriate file
    let outputContent: Buffer | string;
    let contentType: string;
    let fileExtension: string;
    
    if (format === 'docx' || filename.endsWith('.docx')) {
      // Generate Word document
      outputContent = await generateWordDocument(title, content, metadata);
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileExtension = '.docx';
    } else if (format === 'pdf' || filename.endsWith('.pdf')) {
      // For PDF, we'll return the content as-is for now (client can handle PDF generation)
      outputContent = content;
      contentType = 'application/pdf';
      fileExtension = '.pdf';
    } else if (format === 'json' || filename.endsWith('.json')) {
      // JSON format
      const jsonData = {
        title,
        content,
        metadata,
        exportedAt: new Date().toISOString()
      };
      outputContent = JSON.stringify(jsonData, null, 2);
      contentType = 'application/json';
      fileExtension = '.json';
    } else {
      // Default to text
      outputContent = content;
      contentType = 'text/plain';
      fileExtension = '.txt';
    }
    
    // Ensure filename has correct extension
    const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove any existing extension
    const finalFilename = baseName + fileExtension;
    const safe = sanitizeFilename(finalFilename);

    // Log the export with proper workspaceId handling
    try {
      await storage.createExportLog({
        userId,
        workspaceId: workspaceId || null, // Explicitly handle null/undefined workspaceId
        filename: safe,
        dlpHits: null // No hits if we get here
      });
      const workspaceInfo = workspaceId ? `workspace ${workspaceId}` : 'personal workspace';
      console.log(`📤 Export logged: ${safe} by user ${userId} (format: ${format}) in ${workspaceInfo}`);
    } catch (error) {
      console.warn('Failed to log export:', error);
      // Don't fail the export if logging fails - it's not critical
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safe}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Send the generated content
    if (Buffer.isBuffer(outputContent)) {
      res.send(outputContent);
    } else {
      res.send(outputContent);
    }
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET /api/export/logs - Get export logs for current user
router.get('/export/logs',
  requireAuth,
  loadEntitlementsContext,
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.EXPORT_DATA),
  async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).session?.user?.id;
    
    // TODO: Implement getExportLogs in storage when needed
    res.json({ logs: [] });
  } catch (error) {
    console.error('Failed to get export logs:', error);
    res.status(500).json({ error: 'Failed to get export logs' });
  }
});

export default router;