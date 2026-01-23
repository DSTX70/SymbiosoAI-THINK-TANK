import { runMultiAgentDebate } from '../../ai-service';
import { storage } from '../../storage';
import type { ToolAdapter } from '../types';

export const debateTool: ToolAdapter = {
  name: 'debate.orchestrate',
  version: '1.0.0',
  description: 'Run multi-agent AI debate with consensus synthesis',
  
  actions: {
    run: async (inputs: {
      prompt: string;
      mode?: 'simple' | 'guided' | 'expert';
      settings?: Record<string, any>;
      transferFromSessionId?: string;
      documentContext?: string;
      userId?: string;
    }) => {
      const { 
        prompt, 
        mode = 'simple', 
        settings = {}, 
        transferFromSessionId, 
        documentContext,
        userId 
      } = inputs;
      
      const enhancedSettings: Record<string, any> = {
        ...settings,
        mode,
      };

      if (documentContext) {
        enhancedSettings.attached_document = { content: documentContext };
      }
      
      let transferContext: Record<string, any> = {};
      if (transferFromSessionId) {
        const sourceSession = await storage.getSessionForTransfer(transferFromSessionId);
        if (sourceSession) {
          const results = sourceSession.results as any;
          transferContext = {
            previousConsensus: results?.consensus || '',
            previousDissents: results?.dissents || [],
            previousUnresolved: results?.unresolved || [],
            previousDebateHistory: sourceSession.debateHistory || [],
            originalPrompt: sourceSession.prompt,
            sourceMode: sourceSession.mode,
          };
          enhancedSettings.transferContext = transferContext;
        }
      }
      
      const result = await runMultiAgentDebate(prompt, enhancedSettings);
      
      const session = await storage.createAnalysisSession({
        prompt,
        mode,
        settings: enhancedSettings,
        results: result,
        userId: userId || null,
      });
      
      return {
        sessionId: session.id,
        consensus: result.consensus,
        dissents: result.dissents,
        unresolved: result.unresolved,
        debateHistory: result.debateHistory,
        metadata: (result as any).metadata,
      };
    }
  }
};
