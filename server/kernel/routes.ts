import { Router, Request, Response } from 'express';
import { registry } from './registry';
import { run, listCapabilities } from './executor';
import { getReceipts, getReceiptCount } from './receipts';
import type { RunRequest } from './types';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.json({
    product: 'SymbiosoAi ThinkTank',
    kernel: 'agent-kernel',
    version: '0.1.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

router.get('/tools', (_req: Request, res: Response) => {
  const tools = registry.list();
  res.json({
    tools,
    count: tools.length,
  });
});

router.get('/capabilities', (_req: Request, res: Response) => {
  const capabilities = listCapabilities();
  res.json({
    capabilities,
    count: capabilities.length,
  });
});

router.post('/run', async (req: Request, res: Response) => {
  try {
    const { capability, inputs, trustTier, userId, workspaceId, sessionId } = req.body as RunRequest;
    
    if (!capability) {
      return res.status(400).json({ error: 'Capability is required' });
    }
    
    if (!inputs) {
      return res.status(400).json({ error: 'Inputs are required' });
    }
    
    const result = await run({
      capability,
      inputs,
      trustTier: trustTier || 'L1',
      userId,
      workspaceId,
      sessionId,
    });
    
    res.json(result);
  } catch (error: any) {
    console.error('[Kernel] Run error:', error);
    res.status(500).json({
      error: error.message,
      status: 'error',
    });
  }
});

router.get('/receipts', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const capability = req.query.capability as string | undefined;
    const userId = req.query.userId as string | undefined;
    
    const receipts = getReceipts({ limit, capability, userId });
    const total = getReceiptCount();
    
    res.json({
      receipts,
      returned: receipts.length,
      total,
    });
  } catch (error: any) {
    console.error('[Kernel] Receipts error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/receipts/:receiptId', (req: Request, res: Response) => {
  try {
    const { receiptId } = req.params;
    const receipts = getReceipts({});
    const receipt = receipts.find(r => r.receiptId === receiptId);
    
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    res.json(receipt);
  } catch (error: any) {
    console.error('[Kernel] Receipt lookup error:', error);
    res.status(500).json({ error: error.message });
  }
});

export const kernelRouter = router;
