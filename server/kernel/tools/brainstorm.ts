import { runBrainstormingSession } from '../../ai-service';
import { storage } from '../../storage';
import type { ToolAdapter } from '../types';

export const brainstormTool: ToolAdapter = {
  name: 'brainstorm.generate',
  version: '1.0.0',
  description: 'Generate collaborative solutions from debate results',
  
  actions: {
    run: async (inputs: {
      sessionId: string;
      settings?: Record<string, any>;
    }) => {
      const { sessionId, settings = {} } = inputs;
      
      const session = await storage.getSessionForTransfer(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }
      
      const debateResults = session.results as any;
      if (!debateResults) {
        throw new Error('No debate results found in session');
      }
      
      const brainstormResults = await runBrainstormingSession(
        session.prompt,
        debateResults,
        settings
      );
      
      await storage.updateAnalysisSession(sessionId, {
        brainstormResults: brainstormResults,
        lastBrainstormedAt: new Date()
      });
      
      return {
        sessionId,
        solutions: brainstormResults.solutions,
        actionPlans: brainstormResults.action_plan,
        answeredQuestions: brainstormResults.answered_questions,
        finalConsensus: brainstormResults.final_consensus,
        metadata: (brainstormResults as any).metadata,
      };
    }
  }
};
