import { runReportGeneration } from '../../ai-service';
import { storage } from '../../storage';
import type { ToolAdapter } from '../types';

export const reportTool: ToolAdapter = {
  name: 'report.create',
  version: '1.0.0',
  description: 'Generate professional reports from analysis data',
  
  actions: {
    generate: async (inputs: {
      sessionId: string;
      reportType?: 'executive' | 'detailed' | 'full';
      format?: 'markdown' | 'html' | 'plain';
      options?: {
        includeCitations?: boolean;
        includeExpertSummary?: boolean;
        includeFactCheck?: boolean;
      };
    }) => {
      const { 
        sessionId, 
        reportType = 'detailed',
        format = 'markdown',
        options = {}
      } = inputs;
      
      const session = await storage.getSessionForTransfer(sessionId);
      if (!session) {
        throw new Error(`Session not found: ${sessionId}`);
      }
      
      const debateResults = session.results as any;
      const brainstormResults = session.brainstormResults as any;
      
      const sessionData = {
        prompt: session.prompt,
        mode: session.mode,
        settings: session.settings || {},
        debateResults: {
          consensus: debateResults?.consensus || '',
          dissents: debateResults?.dissents || [],
          unresolved: debateResults?.unresolved || [],
          citations: debateResults?.citations,
          fact_check: debateResults?.fact_check,
          debateHistory: debateResults?.debateHistory || session.debateHistory,
        },
        brainstormResults: brainstormResults,
      };
      
      const report = await runReportGeneration(sessionData);
      
      return {
        sessionId,
        reportType,
        format,
        report: report,
        title: report.title,
        generatedAt: new Date().toISOString(),
      };
    }
  }
};
