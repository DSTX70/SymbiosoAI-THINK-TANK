import { Router, Request, Response } from 'express';
import { sanitizeFilename } from '../utils/sanitizeFilename';
import { dlpMiddleware } from '../middleware/dlp';

const router = Router();

// Example DLP-protected export endpoint
router.post('/export', dlpMiddleware, async (req: Request, res: Response) => {
  const { filename = 'decision-dossier.txt', content = '' } = req.body || {};
  const safe = sanitizeFilename(filename);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${safe}"`);
  // TODO: stream real content (PDF/DOCX). This is a placeholder.
  res.send(content);
});

export default router;
