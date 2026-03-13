export type WizardMode = "simple" | "guided" | "expert";
export type EvidenceStrength = "low" | "medium" | "high";
export type OutputFormat = "brief" | "moderate" | "detailed";
export type SelectionMode = "smart" | "manual" | "domain" | "usecase";

export interface FirstAnalysisWizardConfig {
  mode: WizardMode;
  prompt: string;
  context?: string;
  evidence_strength: EvidenceStrength;
  output_format: OutputFormat;
  selection_mode?: SelectionMode;
  manual_agents?: string[];
  domain_expert?: string;
  usecase_type?: string;
  export_format?: "pdf" | "word" | "markdown";
  created_at: string;
}

const CONFIG_KEY = "first_analysis_wizard_config";
const SEEN_KEY = "first_analysis_wizard_seen";

export function saveWizardConfig(config: FirstAnalysisWizardConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  localStorage.setItem(SEEN_KEY, "true");
}

export function loadWizardConfig(): FirstAnalysisWizardConfig | null {
  const raw = localStorage.getItem(CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FirstAnalysisWizardConfig;
  } catch {
    return null;
  }
}

export function clearWizardConfig() {
  localStorage.removeItem(CONFIG_KEY);
}

export function hasSeenWizard(): boolean {
  return localStorage.getItem(SEEN_KEY) === "true";
}

export function consumeWizardConfigForMode(mode: WizardMode): FirstAnalysisWizardConfig | null {
  const config = loadWizardConfig();
  if (!config || config.mode !== mode) return null;
  clearWizardConfig();
  return config;
}

export function mapEvidenceStrength(strength: EvidenceStrength) {
  switch (strength) {
    case "high":
      return {
        require_citations: true,
        enable_fact_check: true,
        min_sources: 2,
        evidence_per_claim: 3,
        live_web: true,
      };
    case "medium":
      return {
        require_citations: true,
        enable_fact_check: false,
        min_sources: 1,
        evidence_per_claim: 2,
        live_web: false,
      };
    case "low":
    default:
      return {
        require_citations: false,
        enable_fact_check: false,
        min_sources: 0,
        evidence_per_claim: 1,
        live_web: false,
      };
  }
}
