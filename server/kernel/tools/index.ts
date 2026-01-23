import { registry } from '../registry';
import { debateTool } from './debate';
import { brainstormTool } from './brainstorm';
import { reportTool } from './report';
import { factcheckTool } from './factcheck';

export function registerCoreTools(): void {
  console.log('[Kernel] Registering core tools...');
  
  registry.register(debateTool);
  registry.register(brainstormTool);
  registry.register(reportTool);
  registry.register(factcheckTool);
  
  console.log(`[Kernel] Registered ${registry.list().length} tools`);
}

export { debateTool, brainstormTool, reportTool, factcheckTool };
