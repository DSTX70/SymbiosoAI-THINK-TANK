export type ToolAction = (inputs: any) => Promise<any>;

export interface ToolAdapter {
  name: string;
  version: string;
  description: string;
  actions: Record<string, ToolAction>;
}

export interface ToolExecution {
  tool: string;
  version: string;
  action: string;
  inputsHash: string;
  outputsHash: string;
  status: 'ok' | 'error';
  durationMs: number;
  error?: string;
}

export interface KernelReceipt {
  receiptId: string;
  timestamp: string;
  capability: string;
  tools: ToolExecution[];
  inputsHash: string;
  outputsHash: string;
  sessionId?: string;
  userId?: string;
  workspaceId?: string;
  mode?: 'simple' | 'guided' | 'expert';
  durationMs: number;
  status: 'ok' | 'error' | 'partial';
  trustTier: 'L0' | 'L1' | 'L2' | 'L3';
  evidenceArtifacts?: string[];
  packId?: string;
}

export interface CapabilityDefinition {
  name: string;
  description: string;
  tools: string[];
  execute: (inputs: Record<string, any>, context: ExecutionContext) => Promise<CapabilityResult>;
}

export interface ExecutionContext {
  userId?: string;
  workspaceId?: string;
  sessionId?: string;
  trustTier: 'L0' | 'L1' | 'L2' | 'L3';
}

export interface CapabilityResult {
  status: 'ok' | 'error' | 'partial';
  outputs: Record<string, any>;
  toolExecutions: ToolExecution[];
  evidenceArtifacts?: string[];
}

export interface RunRequest {
  capability: string;
  inputs: Record<string, any>;
  trustTier?: 'L0' | 'L1' | 'L2' | 'L3';
  userId?: string;
  workspaceId?: string;
  sessionId?: string;
}

export interface RunResponse {
  receiptId: string;
  status: 'ok' | 'error' | 'partial';
  outputs: Record<string, any>;
  evidenceArtifacts?: string[];
  durationMs: number;
}
