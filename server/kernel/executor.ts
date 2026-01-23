import { registry } from './registry';
import { createReceipt, appendReceipt, hashData } from './receipts';
import type { 
  CapabilityDefinition, 
  ExecutionContext, 
  CapabilityResult,
  ToolExecution,
  RunRequest,
  RunResponse 
} from './types';

const capabilities: Map<string, CapabilityDefinition> = new Map();

export function registerCapability(capability: CapabilityDefinition): void {
  console.log(`[Executor] Registering capability: ${capability.name}`);
  capabilities.set(capability.name, capability);
}

export function listCapabilities(): Array<{ name: string; description: string; tools: string[] }> {
  return Array.from(capabilities.values()).map(cap => ({
    name: cap.name,
    description: cap.description,
    tools: cap.tools
  }));
}

export async function executeCapability(
  capabilityName: string,
  inputs: Record<string, any>,
  context: ExecutionContext
): Promise<CapabilityResult> {
  const capability = capabilities.get(capabilityName);
  if (!capability) {
    throw new Error(`Capability not found: ${capabilityName}`);
  }

  console.log(`[Executor] Executing capability: ${capabilityName}`);
  return await capability.execute(inputs, context);
}

export async function executeTool(
  toolName: string,
  action: string,
  inputs: Record<string, any>
): Promise<ToolExecution & { outputs: Record<string, any> }> {
  const startTime = Date.now();
  const salt = Date.now().toString();

  try {
    const { outputs, durationMs } = await registry.execute(toolName, action, inputs);
    
    return {
      tool: toolName,
      version: registry.get(toolName)?.version || '0.0.0',
      action,
      inputsHash: hashData(inputs, salt),
      outputsHash: hashData(outputs, salt),
      status: 'ok',
      durationMs,
      outputs
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    return {
      tool: toolName,
      version: registry.get(toolName)?.version || '0.0.0',
      action,
      inputsHash: hashData(inputs, salt),
      outputsHash: hashData({}, salt),
      status: 'error',
      durationMs,
      error: error.message,
      outputs: { error: error.message }
    };
  }
}

export async function run(request: RunRequest): Promise<RunResponse> {
  const startTime = Date.now();
  const context: ExecutionContext = {
    userId: request.userId,
    workspaceId: request.workspaceId,
    sessionId: request.sessionId,
    trustTier: request.trustTier || 'L1'
  };

  try {
    const result = await executeCapability(request.capability, request.inputs, context);
    const durationMs = Date.now() - startTime;

    const receipt = createReceipt({
      capability: request.capability,
      inputs: request.inputs,
      outputs: result.outputs,
      toolExecutions: result.toolExecutions,
      durationMs,
      status: result.status,
      trustTier: context.trustTier,
      userId: context.userId,
      workspaceId: context.workspaceId,
      sessionId: context.sessionId,
      mode: request.inputs.mode,
      evidenceArtifacts: result.evidenceArtifacts
    });

    appendReceipt(receipt);

    return {
      receiptId: receipt.receiptId,
      status: result.status,
      outputs: result.outputs,
      evidenceArtifacts: result.evidenceArtifacts,
      durationMs
    };
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    
    const receipt = createReceipt({
      capability: request.capability,
      inputs: request.inputs,
      outputs: { error: error.message },
      toolExecutions: [],
      durationMs,
      status: 'error',
      trustTier: context.trustTier,
      userId: context.userId,
      workspaceId: context.workspaceId,
      sessionId: context.sessionId
    });

    appendReceipt(receipt);

    return {
      receiptId: receipt.receiptId,
      status: 'error',
      outputs: { error: error.message },
      durationMs
    };
  }
}
