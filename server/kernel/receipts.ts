import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import type { KernelReceipt, ToolExecution } from './types';

const RECEIPTS_DIR = path.join(process.cwd(), 'data', 'receipts');
const RECEIPTS_FILE = path.join(RECEIPTS_DIR, 'receipts.jsonl');

function ensureReceiptsDir(): void {
  if (!fs.existsSync(RECEIPTS_DIR)) {
    fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
  }
}

export function hashData(data: any, salt?: string): string {
  const content = JSON.stringify(data) + (salt || '');
  return 'sha256:' + crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

export function generateReceiptId(): string {
  return 'rcpt-' + crypto.randomUUID().slice(0, 8) + '-' + Date.now().toString(36);
}

export function createReceipt(params: {
  capability: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  toolExecutions: ToolExecution[];
  durationMs: number;
  status: 'ok' | 'error' | 'partial';
  trustTier: 'L0' | 'L1' | 'L2' | 'L3';
  userId?: string;
  workspaceId?: string;
  sessionId?: string;
  mode?: 'simple' | 'guided' | 'expert';
  evidenceArtifacts?: string[];
  packId?: string;
}): KernelReceipt {
  const salt = crypto.randomBytes(8).toString('hex');
  
  return {
    receiptId: generateReceiptId(),
    timestamp: new Date().toISOString(),
    capability: params.capability,
    tools: params.toolExecutions,
    inputsHash: hashData(params.inputs, salt),
    outputsHash: hashData(params.outputs, salt),
    sessionId: params.sessionId,
    userId: params.userId,
    workspaceId: params.workspaceId,
    mode: params.mode,
    durationMs: params.durationMs,
    status: params.status,
    trustTier: params.trustTier,
    evidenceArtifacts: params.evidenceArtifacts,
    packId: params.packId
  };
}

export function appendReceipt(receipt: KernelReceipt): void {
  ensureReceiptsDir();
  const line = JSON.stringify(receipt) + '\n';
  fs.appendFileSync(RECEIPTS_FILE, line, 'utf-8');
  console.log(`[Receipts] Logged receipt: ${receipt.receiptId}`);
}

export function getReceipts(options?: {
  limit?: number;
  capability?: string;
  userId?: string;
}): KernelReceipt[] {
  ensureReceiptsDir();
  
  if (!fs.existsSync(RECEIPTS_FILE)) {
    return [];
  }

  const content = fs.readFileSync(RECEIPTS_FILE, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.length > 0);
  
  let receipts: KernelReceipt[] = lines.map(line => JSON.parse(line));
  
  if (options?.capability) {
    receipts = receipts.filter(r => r.capability === options.capability);
  }
  
  if (options?.userId) {
    receipts = receipts.filter(r => r.userId === options.userId);
  }
  
  receipts = receipts.reverse();
  
  if (options?.limit) {
    receipts = receipts.slice(0, options.limit);
  }
  
  return receipts;
}

export function getReceiptCount(): number {
  ensureReceiptsDir();
  
  if (!fs.existsSync(RECEIPTS_FILE)) {
    return 0;
  }

  const content = fs.readFileSync(RECEIPTS_FILE, 'utf-8');
  return content.trim().split('\n').filter(line => line.length > 0).length;
}
