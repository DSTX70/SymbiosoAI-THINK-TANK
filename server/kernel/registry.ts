import type { ToolAdapter } from './types';

class ToolRegistry {
  private tools: Map<string, ToolAdapter> = new Map();

  register(tool: ToolAdapter): void {
    const key = tool.name;
    if (this.tools.has(key)) {
      console.log(`[Registry] Updating tool: ${key} to v${tool.version}`);
    } else {
      console.log(`[Registry] Registering tool: ${key} v${tool.version}`);
    }
    this.tools.set(key, tool);
  }

  get(name: string): ToolAdapter | undefined {
    return this.tools.get(name);
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  list(): Array<{ name: string; version: string; description: string; actions: string[] }> {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      version: tool.version,
      description: tool.description,
      actions: Object.keys(tool.actions)
    }));
  }

  async execute(
    toolName: string, 
    action: string, 
    inputs: Record<string, any>
  ): Promise<{ outputs: Record<string, any>; durationMs: number }> {
    const tool = this.get(toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    const actionFn = tool.actions[action];
    if (!actionFn) {
      throw new Error(`Action not found: ${toolName}.${action}`);
    }

    const startTime = Date.now();
    const outputs = await actionFn(inputs);
    const durationMs = Date.now() - startTime;

    return { outputs, durationMs };
  }
}

export const registry = new ToolRegistry();
