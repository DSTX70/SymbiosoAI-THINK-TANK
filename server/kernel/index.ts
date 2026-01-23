import { registerCoreTools } from './tools';
import { registerCoreCapabilities } from './capabilities';
import { kernelRouter } from './routes';
import { registry } from './registry';

let initialized = false;

export function initializeKernel(): void {
  if (initialized) {
    console.log('[Kernel] Already initialized, skipping...');
    return;
  }
  
  console.log('[Kernel] Initializing SymbiosoAi ThinkTank Agent Kernel v0.1.0');
  
  registerCoreTools();
  registerCoreCapabilities();
  
  initialized = true;
  
  console.log('[Kernel] Initialization complete');
  console.log(`[Kernel] Tools registered: ${registry.list().length}`);
}

export { kernelRouter } from './routes';
export { registry } from './registry';
export { run, listCapabilities, registerCapability } from './executor';
export { getReceipts, getReceiptCount, createReceipt, appendReceipt } from './receipts';
export * from './types';
