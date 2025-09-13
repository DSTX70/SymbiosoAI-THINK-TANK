import { Router, Request, Response } from 'express';
import { sanitizeFilename } from '../utils/sanitizeFilename';
import { dlpMiddleware } from '../middleware/dlp';
import { requireAuth } from '../middleware/auth';
import { storage } from '../storage';

const router = Router();

// POST /api/export - DLP-protected export endpoint
router.post('/export', requireAuth, dlpMiddleware, async (req: Request, res: Response) => {
  try {
    const { filename = 'decision-dossier.txt', content = '' } = req.body || {};
    const safe = sanitizeFilename(filename);
    
    const userId = (req as any).user?.id || (req as any).session?.user?.id;
    const workspaceId = req.body.workspaceId;

    // Log the export
    try {
      await storage.createExportLog({
        userId,
        workspaceId,
        filename: safe,
        dlpHits: null // No hits if we get here
      });
      console.log(`📤 Export logged: ${safe} by user ${userId}`);
    } catch (error) {
      console.warn('Failed to log export:', error);
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${safe}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // TODO: In production, stream real content (PDF/DOCX). This is a placeholder.
    res.send(content);
  } catch (error) {
    console.error('Export failed:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET /api/export/logs - Get export logs for current user
router.get('/export/logs', requireAuth, async (req: Request, res: Response) => {
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