import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Shield, 
  Database, 
  Download, 
  Search,
  Zap,
  Target,
  Users,
  UserCheck,
  Briefcase
} from "lucide-react";

interface ConfigurationSidebarProps {
  configuration: {
    frameworks: string[];
    thinking_patterns?: string[];
    enterprise_specialists?: string[];
    creativity_level?: number;
    routing: {
      analyst: number;
      pragmatist: number;
      thoughtful: number;
      innovator: number;
      critic: number;
    };
    rag: {
      enabled: boolean;
      top_k: number;
      max_tokens: number;
      web: boolean;
      code: boolean;
    };
    security: {
      pii_redaction: boolean;
      log_masking: boolean;
      region: string;
    };
    export_formats: string[];
    ethical_lens: boolean;
    evidence_per_claim: number;
    max_steps: number;
    manual_agents?: string[];
    domain_experts?: string[];
    selection_mode?: string;
    usecase_type?: string;
  };
  onConfigurationChange: (config: any) => void;
}

export function ConfigurationSidebar({ configuration, onConfigurationChange }: ConfigurationSidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['agents']));

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const updateConfig = (path: string, value: any) => {
    const pathParts = path.split('.');
    const newConfig = { ...configuration };
    let current = newConfig as any;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = value;
    onConfigurationChange(newConfig);
  };

  const updateRoutingWeight = (agent: string, weight: number) => {
    updateConfig(`routing.${agent}`, weight);
  };

  const SectionCard = ({ id, title, icon: Icon, children }: { 
    id: string; 
    title: string; 
    icon: any; 
    children: React.ReactNode; 
  }) => (
    <Card className="card-elevated mb-4">
      <Collapsible open={openSections.has(id)} onOpenChange={() => toggleSection(id)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-primary" />
                {title}
              </div>
              {openSections.has(id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* AI Agent Selection */}
      <SectionCard id="agents" title="AI Agent Selection" icon={Users}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selection Mode</Label>
            <Select
              value={configuration.selection_mode || "smart"}
              onValueChange={(value) => updateConfig('selection_mode', value)}
              data-testid="select-agent-mode"
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose selection mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smart">Smart Selection</SelectItem>
                <SelectItem value="manual">Manual Selection</SelectItem>
                <SelectItem value="domain">Domain Experts</SelectItem>
                <SelectItem value="usecase">Use Case Specific</SelectItem>
                <SelectItem value="advanced">Advanced Thinking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {configuration.selection_mode === "manual" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select AI Personalities</Label>
              <div className="space-y-3">
                {[
                  { id: "analyst", name: "The Analyst", desc: "Data-driven insights and systematic analysis" },
                  { id: "pragmatist", name: "The Pragmatist", desc: "Implementation-focused and realistic solutions" },
                  { id: "innovator", name: "The Innovator", desc: "Creative thinking and breakthrough approaches" },
                  { id: "thoughtful", name: "The Thoughtful One", desc: "Balanced perspectives and ethical considerations" },
                  { id: "critic", name: "The Critic", desc: "Challenge assumptions and identify weaknesses" }
                ].map((agent) => (
                  <div key={agent.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={agent.id}
                      checked={(configuration.manual_agents || []).includes(agent.id)}
                      onCheckedChange={(checked) => {
                        const currentAgents = configuration.manual_agents || [];
                        const newAgents = checked
                          ? [...currentAgents, agent.id]
                          : currentAgents.filter(id => id !== agent.id);
                        updateConfig('manual_agents', newAgents);
                      }}
                      data-testid={`checkbox-agent-${agent.id}`}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={agent.id}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {agent.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {agent.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {configuration.selection_mode === "domain" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Domain Experts</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: "legal-analyst", name: "Legal Analyst", desc: "Legal compliance and risk assessment" },
                  { id: "tech-architect", name: "Tech Architect", desc: "System design and technical strategy" },
                  { id: "financial-analyst", name: "Financial Analyst", desc: "Financial modeling and market analysis" },
                  { id: "medical-researcher", name: "Medical Researcher", desc: "Healthcare and medical research expertise" },
                  { id: "brand-strategist", name: "Brand Strategist", desc: "Marketing and brand positioning" },
                  { id: "research-scientist", name: "Research Scientist", desc: "Scientific research and methodology" }
                ].map((expert) => (
                  <div key={expert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={expert.id}
                      checked={(configuration.domain_experts || []).includes(expert.id)}
                      onCheckedChange={(checked) => {
                        const currentExperts = configuration.domain_experts || [];
                        const newExperts = checked
                          ? [...currentExperts, expert.id]
                          : currentExperts.filter(id => id !== expert.id);
                        updateConfig('domain_experts', newExperts);
                      }}
                      data-testid={`checkbox-expert-${expert.id}`}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={expert.id}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {expert.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {expert.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {configuration.selection_mode === "usecase" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Use Case Type</Label>
              <Select
                value={configuration.usecase_type || ""}
                onValueChange={(value) => updateConfig('usecase_type', value)}
                data-testid="select-usecase-type"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose use case" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business_analysis">Business Analysis</SelectItem>
                  <SelectItem value="technical_debate">Technical Debate</SelectItem>
                  <SelectItem value="creative_brainstorm">Creative Brainstorm</SelectItem>
                  <SelectItem value="research_synthesis">Research Synthesis</SelectItem>
                  <SelectItem value="ethical_discussion">Ethical Discussion</SelectItem>
                  <SelectItem value="document_analysis">Document Analysis</SelectItem>
                  <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {configuration.selection_mode === "advanced" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Advanced Thinking Capabilities</Label>
              <p className="text-xs text-muted-foreground">Access next-generation AI capabilities & enterprise</p>
            </div>
          )}

          {/* Creativity Level Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Creativity Level</Label>
            <div className="space-y-2">
              <Slider
                value={[configuration.creativity_level || 50]}
                onValueChange={(value) => updateConfig('creativity_level', value[0])}
                max={100}
                step={1}
                className="w-full"
                data-testid="slider-creativity-level"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
                <span>Very Creative</span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Reasoning Frameworks */}
      <SectionCard id="reasoning" title="Reasoning Frameworks" icon={Brain}>
        <div className="space-y-3">
          {[
            { id: 'systematic_analysis', name: 'Systematic Analysis', desc: 'Step-by-step breakdown of complex problems into manageable components' },
            { id: 'critical_thinking', name: 'Critical Thinking', desc: 'Question assumptions, evaluate evidence, analyze logical structure' },
            { id: 'design_thinking', name: 'Design Thinking', desc: 'Human-centered approach with ideation and iterative solutions' },
            { id: 'first_principles', name: 'First Principles', desc: 'Break down to fundamental truths and build solutions from basics' },
            { id: 'systems_thinking', name: 'Systems Thinking', desc: 'Holistic view of interconnections and system-level behavior' },
            { id: 'dialectical_reasoning', name: 'Dialectical Reasoning', desc: 'Thesis-antithesis-synthesis approach to complex issues' },
            { id: 'abductive_reasoning', name: 'Abductive Reasoning', desc: 'Inference to the best explanation and hypothesis formation' },
            { id: 'forensic_analysis', name: 'Forensic Analysis', desc: 'Evidence-based investigation and fact reconstruction' }
          ].map((framework) => (
            <div key={framework.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={framework.id}
                checked={configuration.frameworks.includes(framework.id)}
                onCheckedChange={(checked) => {
                  const newFrameworks = checked
                    ? [...configuration.frameworks, framework.id]
                    : configuration.frameworks.filter(f => f !== framework.id);
                  updateConfig('frameworks', newFrameworks);
                }}
                data-testid={`checkbox-framework-${framework.id}`}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={framework.id}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {framework.name}
                </label>
                <p className="text-xs text-muted-foreground">
                  {framework.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Thinking Patterns */}
      <SectionCard id="thinking_patterns" title="Thinking Patterns" icon={Target}>
        <div className="space-y-3">
          {[
            { id: 'multi_perspective', name: 'Multi-Perspective Analysis', desc: 'Examine issues from multiple viewpoints and stakeholder positions' },
            { id: 'scenario_planning', name: 'Scenario Planning', desc: 'Future scenario analysis and strategic planning' },
            { id: 'root_cause', name: 'Root Cause Analysis', desc: 'Deep causal analysis to identify fundamental issues' },
            { id: 'risk_modeling', name: 'Risk Modeling', desc: 'Comprehensive risk assessment and mitigation strategies' },
            { id: 'information_synthesis', name: 'Information Synthesis', desc: 'Combining disparate information into coherent insights' },
            { id: 'meta_analysis', name: 'Meta-Analysis', desc: 'Analysis of analyses, higher-order pattern recognition' }
          ].map((pattern) => (
            <div key={pattern.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={pattern.id}
                checked={(configuration.thinking_patterns || []).includes(pattern.id)}
                onCheckedChange={(checked) => {
                  const currentPatterns = configuration.thinking_patterns || [];
                  const newPatterns = checked
                    ? [...currentPatterns, pattern.id]
                    : currentPatterns.filter(p => p !== pattern.id);
                  updateConfig('thinking_patterns', newPatterns);
                }}
                data-testid={`checkbox-thinking-${pattern.id}`}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={pattern.id}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {pattern.name}
                </label>
                <p className="text-xs text-muted-foreground">
                  {pattern.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Enterprise AI Specialists */}
      <SectionCard id="enterprise_specialists" title="Enterprise AI Specialists" icon={UserCheck}>
        <div className="space-y-3">
          {[
            { id: 'constitutional_scholar', name: 'The Constitutional Scholar', desc: 'Constitutional law, judicial philosophy, dialectical reasoning' },
            { id: 'risk_strategist', name: 'The Quantitative Risk Strategist', desc: 'Mathematical modeling, risk analytics, derivatives pricing' },
            { id: 'ai_systems_architect', name: 'The AI Systems Architect', desc: 'AI/ML architecture, ethical AI, human-AI interaction' },
            { id: 'cybersecurity_strategist', name: 'The Cybersecurity Strategist', desc: 'Threat modeling, security architecture, zero-trust design' },
            { id: 'cognitive_neuroscientist', name: 'The Cognitive Neuroscientist', desc: 'Brain mechanisms, neuroplasticity, decision neuroscience' },
            { id: 'systems_policy_analyst', name: 'The Systems Policy Analyst', desc: 'Policy analysis, stakeholder management, regulatory impact' },
            { id: 'innovation_strategist', name: 'The Innovation Strategist', desc: 'Technology commercialization, business model design' }
          ].map((specialist) => (
            <div key={specialist.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={specialist.id}
                checked={(configuration.enterprise_specialists || []).includes(specialist.id)}
                onCheckedChange={(checked) => {
                  const currentSpecialists = configuration.enterprise_specialists || [];
                  const newSpecialists = checked
                    ? [...currentSpecialists, specialist.id]
                    : currentSpecialists.filter(s => s !== specialist.id);
                  updateConfig('enterprise_specialists', newSpecialists);
                }}
                data-testid={`checkbox-specialist-${specialist.id}`}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={specialist.id}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {specialist.name}
                </label>
                <p className="text-xs text-muted-foreground">
                  {specialist.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Agent Routing */}
      <SectionCard id="routing" title="Agent Routing Weights" icon={Zap}>
        <div className="space-y-4">
          {Object.entries(configuration.routing).map(([agent, weight]) => (
            <div key={agent} className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm capitalize">{agent}</Label>
                <span className="text-xs text-muted-foreground">{weight}%</span>
              </div>
              <Slider
                value={[weight]}
                onValueChange={(value) => updateRoutingWeight(agent, value[0])}
                max={100}
                step={5}
                className="w-full"
                data-testid={`slider-${agent}`}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* RAG Configuration */}
      <SectionCard id="rag" title="Knowledge Retrieval" icon={Database}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="rag-enabled"
              checked={configuration.rag.enabled}
              onCheckedChange={(checked) => updateConfig('rag.enabled', checked)}
              data-testid="switch-rag-enabled"
            />
            <Label htmlFor="rag-enabled" className="text-sm">Enable RAG</Label>
          </div>
          
          {configuration.rag.enabled && (
            <>
              <div className="space-y-2">
                <Label className="text-sm">Top-K Results</Label>
                <Slider
                  value={[configuration.rag.top_k]}
                  onValueChange={(value) => updateConfig('rag.top_k', value[0])}
                  min={1}
                  max={20}
                  step={1}
                  data-testid="slider-rag-topk"
                />
                <span className="text-xs text-muted-foreground">{configuration.rag.top_k} results</span>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Max Tokens</Label>
                <Slider
                  value={[configuration.rag.max_tokens]}
                  onValueChange={(value) => updateConfig('rag.max_tokens', value[0])}
                  min={100}
                  max={4000}
                  step={100}
                  data-testid="slider-rag-tokens"
                />
                <span className="text-xs text-muted-foreground">{configuration.rag.max_tokens} tokens</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rag-web"
                  checked={configuration.rag.web}
                  onCheckedChange={(checked) => updateConfig('rag.web', checked)}
                  data-testid="checkbox-rag-web"
                />
                <Label htmlFor="rag-web" className="text-sm">Web Search</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rag-code"
                  checked={configuration.rag.code}
                  onCheckedChange={(checked) => updateConfig('rag.code', checked)}
                  data-testid="checkbox-rag-code"
                />
                <Label htmlFor="rag-code" className="text-sm">Code Search</Label>
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {/* Security Settings */}
      <SectionCard id="security" title="Security & Privacy" icon={Shield}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="pii-redaction"
              checked={configuration.security.pii_redaction}
              onCheckedChange={(checked) => updateConfig('security.pii_redaction', checked)}
              data-testid="switch-pii-redaction"
            />
            <Label htmlFor="pii-redaction" className="text-sm">PII Redaction</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="log-masking"
              checked={configuration.security.log_masking}
              onCheckedChange={(checked) => updateConfig('security.log_masking', checked)}
              data-testid="switch-log-masking"
            />
            <Label htmlFor="log-masking" className="text-sm">Log Masking</Label>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Processing Region</Label>
            <Select
              value={configuration.security.region}
              onValueChange={(value) => updateConfig('security.region', value)}
              data-testid="select-region"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-east">US East</SelectItem>
                <SelectItem value="us-west">US West</SelectItem>
                <SelectItem value="eu-central">EU Central</SelectItem>
                <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Advanced Options */}
      <SectionCard id="advanced" title="Advanced Options" icon={Zap}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="ethical-lens"
              checked={configuration.ethical_lens}
              onCheckedChange={(checked) => updateConfig('ethical_lens', checked)}
              data-testid="switch-ethical-lens"
            />
            <Label htmlFor="ethical-lens" className="text-sm">Ethical Analysis</Label>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Evidence per Claim</Label>
            <Slider
              value={[configuration.evidence_per_claim]}
              onValueChange={(value) => updateConfig('evidence_per_claim', value[0])}
              min={1}
              max={5}
              step={1}
              data-testid="slider-evidence-per-claim"
            />
            <span className="text-xs text-muted-foreground">{configuration.evidence_per_claim} sources</span>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Max Processing Steps</Label>
            <Slider
              value={[configuration.max_steps]}
              onValueChange={(value) => updateConfig('max_steps', value[0])}
              min={1}
              max={10}
              step={1}
              data-testid="slider-max-steps"
            />
            <span className="text-xs text-muted-foreground">{configuration.max_steps} steps</span>
          </div>
        </div>
      </SectionCard>

      {/* Export Options */}
      <SectionCard id="export" title="Export Formats" icon={Download}>
        <div className="space-y-3">
          {['pdf', 'json', 'txt', 'story_map'].map((format) => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                id={`export-${format}`}
                checked={configuration.export_formats.includes(format)}
                onCheckedChange={(checked) => {
                  const newFormats = checked
                    ? [...configuration.export_formats, format]
                    : configuration.export_formats.filter(f => f !== format);
                  updateConfig('export_formats', newFormats);
                }}
                data-testid={`checkbox-export-${format}`}
              />
              <Label htmlFor={`export-${format}`} className="text-sm uppercase">
                {format === 'story_map' ? 'Story Map' : format}
              </Label>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}