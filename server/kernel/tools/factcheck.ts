import { advancedFactChecker } from '../../services/factchecker';
import type { ToolAdapter } from '../types';

export const factcheckTool: ToolAdapter = {
  name: 'factcheck.verify',
  version: '1.0.0',
  description: 'Verify claims using AI-powered fact checking',
  
  actions: {
    verify: async (inputs: {
      claims: string[];
      settings?: {
        enable_fact_check?: boolean;
        verification_depth?: 'standard' | 'comprehensive' | 'expert';
        min_sources?: number;
      };
    }) => {
      const { claims, settings = {} } = inputs;
      
      if (!claims || claims.length === 0) {
        return { findings: [], message: 'No claims provided' };
      }
      
      const validClaims = claims
        .filter((claim: string) => typeof claim === 'string' && claim.trim().length > 0)
        .slice(0, 10);
      
      if (validClaims.length === 0) {
        return { findings: [], message: 'No valid claims to verify' };
      }
      
      const factCheckSettings = {
        enable_fact_check: true,
        ...settings
      };
      
      const findings = await advancedFactChecker.enhancedFactCheck(
        validClaims,
        factCheckSettings
      );
      
      return {
        claimsChecked: validClaims.length,
        findings: findings,
        verifiedAt: new Date().toISOString(),
      };
    }
  }
};
