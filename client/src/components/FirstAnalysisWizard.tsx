import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveWizardConfig, type EvidenceStrength, type FirstAnalysisWizardConfig, type OutputFormat, type SelectionMode, type WizardMode } from "@/lib/firstAnalysisWizard";
import { apiRequest } from "@/lib/queryClient";

const AGENTS = [
  { id: "analyst", label: "Analyst" },
  { id: "critic", label: "Critic" },
  { id: "innovator", label: "Innovator" },
  { id: "pragmatist", label: "Pragmatist" },
  { id: "thoughtful", label: "Thoughtful" },
];

const DOMAIN_EXPERTS = [
  { id: "legal-analyst", label: "Legal Analyst" },
  { id: "medical-researcher", label: "Medical Researcher" },
  { id: "financial-analyst", label: "Financial Analyst" },
  { id: "tech-architect", label: "Tech Architect" },
  { id: "devops-engineer", label: "DevOps Engineer" },
  { id: "brand-strategist", label: "Brand Strategist" },
];

const USECASES = [
  { id: "business_analysis", label: "Business Analysis" },
  { id: "technical_debate", label: "Technical Debate" },
  { id: "creative_brainstorm", label: "Creative Brainstorm" },
  { id: "research_synthesis", label: "Research Synthesis" },
  { id: "ethical_discussion", label: "Ethical Discussion" },
  { id: "document_analysis", label: "Document Analysis" },
  { id: "general_inquiry", label: "General Inquiry" },
];

interface FirstAnalysisWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FirstAnalysisWizard({ open, onOpenChange }: FirstAnalysisWizardProps) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<WizardMode>("guided");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("moderate");
  const [evidenceStrength, setEvidenceStrength] = useState<EvidenceStrength>("medium");
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("smart");
  const [manualAgents, setManualAgents] = useState<string[]>(["analyst", "critic", "pragmatist"]);
  const [domainExpert, setDomainExpert] = useState<string>("legal-analyst");
  const [usecaseType, setUsecaseType] = useState<string>("business_analysis");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [exportFormat, setExportFormat] = useState<"pdf" | "word" | "markdown">("pdf");

  const canProceed = useMemo(() => {
    if (step < 3) return true;
    return prompt.trim().length > 0;
  }, [step, prompt]);

  const handleComplete = async () => {
    const config: FirstAnalysisWizardConfig = {
      mode,
      prompt: prompt.trim(),
      context: context.trim() || undefined,
      evidence_strength: evidenceStrength,
      output_format: outputFormat,
      selection_mode: selectionMode,
      manual_agents: selectionMode === "manual" ? manualAgents : undefined,
      domain_expert: selectionMode === "domain" ? domainExpert : undefined,
      usecase_type: selectionMode === "usecase" ? usecaseType : undefined,
      export_format: mode === "expert" ? exportFormat : undefined,
      created_at: new Date().toISOString(),
    };

    saveWizardConfig(config);

    try {
      await apiRequest("POST", "/telemetry/event", {
        type: "first_analysis_wizard_completed",
        props: {
          mode,
          output_format: outputFormat,
          evidence_strength: evidenceStrength,
          selection_mode: selectionMode,
        },
      });
    } catch {
      // Best-effort telemetry
    }

    onOpenChange(false);
    window.location.href = `/${mode}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>First Analysis Wizard</DialogTitle>
          <p className="text-sm text-muted-foreground">Configure your first analysis in under a minute.</p>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Pick a mode</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as WizardMode)} className="grid grid-cols-3 gap-3">
                {(["simple", "guided", "expert"] as WizardMode[]).map((value) => (
                  <Label key={value} className="flex items-center gap-2 rounded-md border p-3 cursor-pointer">
                    <RadioGroupItem value={value} />
                    <span className="capitalize">{value}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Output format</Label>
              <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as OutputFormat)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {mode === "expert" && (
              <div className="space-y-2">
                <Label>Export format</Label>
                <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="markdown">Markdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Agent selection</Label>
              <Select value={selectionMode} onValueChange={(v) => setSelectionMode(v as SelectionMode)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smart">Smart (Recommended)</SelectItem>
                  <SelectItem value="manual">Manual agents</SelectItem>
                  <SelectItem value="domain">Domain expert</SelectItem>
                  <SelectItem value="usecase">Use case</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectionMode === "manual" && (
              <div className="grid grid-cols-2 gap-3">
                {AGENTS.map((agent) => (
                  <Label key={agent.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={manualAgents.includes(agent.id)}
                      onCheckedChange={(checked) => {
                        setManualAgents((prev) =>
                          checked ? [...prev, agent.id] : prev.filter((id) => id !== agent.id)
                        );
                      }}
                    />
                    {agent.label}
                  </Label>
                ))}
              </div>
            )}

            {selectionMode === "domain" && (
              <div className="space-y-2">
                <Label>Domain expert</Label>
                <Select value={domainExpert} onValueChange={setDomainExpert}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAIN_EXPERTS.map((expert) => (
                      <SelectItem key={expert.id} value={expert.id}>
                        {expert.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectionMode === "usecase" && (
              <div className="space-y-2">
                <Label>Use case</Label>
                <Select value={usecaseType} onValueChange={setUsecaseType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USECASES.map((usecase) => (
                      <SelectItem key={usecase.id} value={usecase.id}>
                        {usecase.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Evidence strength</Label>
              <RadioGroup value={evidenceStrength} onValueChange={(v) => setEvidenceStrength(v as EvidenceStrength)} className="grid grid-cols-3 gap-3">
                {([
                  { id: "low", label: "Low" },
                  { id: "medium", label: "Medium" },
                  { id: "high", label: "High" },
                ] as const).map((item) => (
                  <Label key={item.id} className="flex items-center gap-2 rounded-md border p-3 cursor-pointer">
                    <RadioGroupItem value={item.id} />
                    {item.label}
                  </Label>
                ))}
              </RadioGroup>
              <p className="text-xs text-muted-foreground">Higher strength increases citations, verification, and minimum sources.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary question</Label>
              <Textarea
                placeholder="What should we analyze?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Additional context (optional)</Label>
              <Textarea
                placeholder="Add background, constraints, or documents summary"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </Button>
          <div className="flex items-center gap-2">
            {step < 3 ? (
              <Button onClick={() => setStep((s) => Math.min(3, s + 1))}>Next</Button>
            ) : (
              <Button onClick={handleComplete} disabled={!canProceed}>Start Analysis</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
