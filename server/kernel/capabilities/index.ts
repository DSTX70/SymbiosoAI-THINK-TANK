import { registerDebateAnalysisCapability } from './debate-analysis';

export function registerCoreCapabilities(): void {
  console.log('[Kernel] Registering core capabilities...');
  
  registerDebateAnalysisCapability();
  
  console.log('[Kernel] Core capabilities registered');
}

export { registerDebateAnalysisCapability };
