import { registerCapability, executeTool } from '../executor';
import type { CapabilityDefinition, ExecutionContext, CapabilityResult, ToolExecution } from '../types';

const debateAnalysisCapability: CapabilityDefinition = {
  name: 'debate_analysis',
  description: 'Run multi-agent AI debate with optional fact-checking',
  tools: ['debate.orchestrate', 'factcheck.verify'],
  
  async execute(inputs: Record<string, any>, context: ExecutionContext): Promise<CapabilityResult> {
    const toolExecutions: ToolExecution[] = [];
    let status: 'ok' | 'error' | 'partial' = 'ok';
    
    const debateResult = await executeTool('debate.orchestrate', 'run', {
      prompt: inputs.prompt,
      mode: inputs.mode || 'simple',
      settings: inputs.settings,
      transferFromSessionId: inputs.transferFromSessionId,
      documentContext: inputs.documentContext,
      userId: context.userId,
    });
    
    toolExecutions.push({
      tool: debateResult.tool,
      version: debateResult.version,
      action: debateResult.action,
      inputsHash: debateResult.inputsHash,
      outputsHash: debateResult.outputsHash,
      status: debateResult.status,
      durationMs: debateResult.durationMs,
    });
    
    if (debateResult.status === 'error') {
      return {
        status: 'error',
        outputs: debateResult.outputs,
        toolExecutions,
      };
    }
    
    const outputs: Record<string, any> = { ...debateResult.outputs };
    
    if (inputs.enableFactCheck && debateResult.outputs.consensus) {
      const claims = [debateResult.outputs.consensus];
      
      const factcheckResult = await executeTool('factcheck.verify', 'verify', {
        claims,
        settings: inputs.factCheckSettings || { enable_fact_check: true },
      });
      
      toolExecutions.push({
        tool: factcheckResult.tool,
        version: factcheckResult.version,
        action: factcheckResult.action,
        inputsHash: factcheckResult.inputsHash,
        outputsHash: factcheckResult.outputsHash,
        status: factcheckResult.status,
        durationMs: factcheckResult.durationMs,
      });
      
      if (factcheckResult.status === 'ok') {
        outputs.factCheck = factcheckResult.outputs;
      } else {
        status = 'partial';
      }
    }
    
    return {
      status,
      outputs,
      toolExecutions,
    };
  }
};

export function registerDebateAnalysisCapability(): void {
  registerCapability(debateAnalysisCapability);
}
