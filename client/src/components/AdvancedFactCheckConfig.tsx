import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Target,
  Database,
  Globe,
  BookOpen,
  Settings
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FactCheckConfig {
  verificationDepth: "standard" | "comprehensive" | "expert_review";
  minimumSources: number;
  confidenceThreshold: number;
  sourcePriority: string[];
  enableRealTimeValidation: boolean;
  crossReferenceChecking: boolean;
  biasDetection: boolean;
  temporalValidation: boolean;
  domainSpecificValidation: boolean;
  customValidationRules: string;
  excludedSources: string[];
  trustedDomains: string[];
}

interface AdvancedFactCheckConfigProps {
  config?: Partial<FactCheckConfig>;
  onChange?: (config: FactCheckConfig) => void;
  onPresetLoad?: (preset: string) => void;
}

const defaultConfig: FactCheckConfig = {
  verificationDepth: "comprehensive",
  minimumSources: 3,
  confidenceThreshold: 75,
  sourcePriority: ["academic", "government", "news_tier1", "expert_analysis"],
  enableRealTimeValidation: true,
  crossReferenceChecking: true,
  biasDetection: true,
  temporalValidation: false,
  domainSpecificValidation: true,
  customValidationRules: "",
  excludedSources: [],
  trustedDomains: []
};

const verificationDepthOptions = {
  standard: {
    label: "Standard",
    description: "Basic fact-checking with common sources",
    sources: 2,
    time: "2-3 minutes",
    accuracy: "Good"
  },
  comprehensive: {
    label: "Comprehensive", 
    description: "Thorough verification across multiple source types",
    sources: 4,
    time: "5-8 minutes",
    accuracy: "High"
  },
  expert_review: {
    label: "Expert Review",
    description: "Deep analysis with domain expert validation",
    sources: 6,
    time: "10-15 minutes", 
    accuracy: "Maximum"
  }
};

const sourceTypeOptions = [
  { id: "academic", label: "Academic Papers", icon: BookOpen },
  { id: "government", label: "Government Sources", icon: Shield },
  { id: "news_tier1", label: "Tier 1 News", icon: Globe },
  { id: "expert_analysis", label: "Expert Analysis", icon: Target },
  { id: "databases", label: "Reference Databases", icon: Database },
  { id: "primary_sources", label: "Primary Sources", icon: CheckCircle2 }
];

const presetConfigurations = {
  research: {
    name: "Research & Academia",
    description: "Optimized for academic and research contexts",
    config: {
      verificationDepth: "expert_review" as const,
      minimumSources: 5,
      confidenceThreshold: 85,
      sourcePriority: ["academic", "government", "databases", "expert_analysis"],
      biasDetection: true,
      temporalValidation: true
    }
  },
  business: {
    name: "Business Analysis",
    description: "Balanced approach for business decision-making",
    config: {
      verificationDepth: "comprehensive" as const,
      minimumSources: 3,
      confidenceThreshold: 75,
      sourcePriority: ["expert_analysis", "news_tier1", "government", "databases"],
      enableRealTimeValidation: true
    }
  },
  rapid: {
    name: "Rapid Assessment",
    description: "Quick fact-checking for time-sensitive analysis",
    config: {
      verificationDepth: "standard" as const,
      minimumSources: 2,
      confidenceThreshold: 65,
      sourcePriority: ["news_tier1", "government", "academic"],
      enableRealTimeValidation: true
    }
  }
};

export function AdvancedFactCheckConfig({ 
  config: initialConfig = {},
  onChange,
  onPresetLoad
}: AdvancedFactCheckConfigProps) {
  const [config, setConfig] = useState<FactCheckConfig>({
    ...defaultConfig,
    ...initialConfig
  });

  const updateConfig = (updates: Partial<FactCheckConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onChange?.(newConfig);
  };

  const loadPreset = (presetKey: string) => {
    const preset = presetConfigurations[presetKey as keyof typeof presetConfigurations];
    if (preset) {
      const newConfig = { ...config, ...preset.config };
      setConfig(newConfig);
      onChange?.(newConfig);
      onPresetLoad?.(preset.name);
    }
  };

  const currentDepthConfig = verificationDepthOptions[config.verificationDepth];

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Shield className="text-primary" size={20} />
          Advanced Fact-Check Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="verification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="verification" className="space-y-6">
            {/* Verification Depth */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Verification Depth</Label>
              <Select
                value={config.verificationDepth}
                onValueChange={(value) => updateConfig({ verificationDepth: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(verificationDepthOptions).map(([key, option]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Depth Details */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg text-sm">
                <div className="text-center">
                  <div className="font-semibold">{currentDepthConfig.sources}+</div>
                  <div className="text-muted-foreground">Min Sources</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{currentDepthConfig.time}</div>
                  <div className="text-muted-foreground">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{currentDepthConfig.accuracy}</div>
                  <div className="text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Minimum Sources */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Minimum Sources Required</Label>
                <Badge variant="outline">{config.minimumSources} sources</Badge>
              </div>
              <Slider
                value={[config.minimumSources]}
                onValueChange={([value]) => updateConfig({ minimumSources: value })}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">
                Higher numbers increase reliability but may slow verification
              </div>
            </div>

            {/* Confidence Threshold */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Confidence Threshold</Label>
                <Badge variant="outline">{config.confidenceThreshold}%</Badge>
              </div>
              <Slider
                value={[config.confidenceThreshold]}
                onValueChange={([value]) => updateConfig({ confidenceThreshold: value })}
                max={95}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">
                Claims below this threshold will be flagged as unverified
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Advanced Validation Features</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.enableRealTimeValidation}
                    onCheckedChange={(checked) => updateConfig({ enableRealTimeValidation: checked })}
                  />
                  <div>
                    <Label className="text-sm font-medium">Real-time Validation</Label>
                    <div className="text-xs text-muted-foreground">Validate claims during analysis</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.crossReferenceChecking}
                    onCheckedChange={(checked) => updateConfig({ crossReferenceChecking: checked })}
                  />
                  <div>
                    <Label className="text-sm font-medium">Cross-Reference Checking</Label>
                    <div className="text-xs text-muted-foreground">Verify claims across sources</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.biasDetection}
                    onCheckedChange={(checked) => updateConfig({ biasDetection: checked })}
                  />
                  <div>
                    <Label className="text-sm font-medium">Bias Detection</Label>
                    <div className="text-xs text-muted-foreground">Identify potential source bias</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.temporalValidation}
                    onCheckedChange={(checked) => updateConfig({ temporalValidation: checked })}
                  />
                  <div>
                    <Label className="text-sm font-medium">Temporal Validation</Label>
                    <div className="text-xs text-muted-foreground">Check claim recency</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    checked={config.domainSpecificValidation}
                    onCheckedChange={(checked) => updateConfig({ domainSpecificValidation: checked })}
                  />
                  <div>
                    <Label className="text-sm font-medium">Domain-Specific Validation</Label>
                    <div className="text-xs text-muted-foreground">Use specialized validators</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            {/* Source Priority */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Source Priority Ranking</Label>
              <div className="text-sm text-muted-foreground mb-3">
                Drag to reorder source types by priority (highest to lowest)
              </div>
              <div className="space-y-2">
                {sourceTypeOptions.map((source, index) => {
                  const IconComponent = source.icon;
                  const isPriority = config.sourcePriority.includes(source.id);
                  return (
                    <div
                      key={source.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        isPriority ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                      }`}
                      onClick={() => {
                        const newPriority = isPriority
                          ? config.sourcePriority.filter(id => id !== source.id)
                          : [...config.sourcePriority, source.id];
                        updateConfig({ sourcePriority: newPriority });
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent size={18} className={isPriority ? 'text-primary' : 'text-muted-foreground'} />
                        <div>
                          <div className="font-medium">{source.label}</div>
                          {isPriority && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Priority #{config.sourcePriority.indexOf(source.id) + 1}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        isPriority ? 'bg-primary border-primary' : 'border-muted-foreground'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trusted Domains */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Trusted Domains</Label>
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter trusted domain patterns (one per line)&#10;Example:&#10;*.edu&#10;*.gov&#10;nature.com&#10;science.org"
                  value={config.trustedDomains.join('\n')}
                  onChange={(e) => updateConfig({ 
                    trustedDomains: e.target.value.split('\n').filter(d => d.trim()) 
                  })}
                  rows={4}
                />
                <div className="text-sm text-muted-foreground">
                  Sources from these domains will have higher credibility scores
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Configuration Presets</Label>
              <div className="grid gap-4">
                {Object.entries(presetConfigurations).map(([key, preset]) => (
                  <Card key={key} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => loadPreset(key)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{preset.name}</h3>
                        <p className="text-sm text-muted-foreground">{preset.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {preset.config.verificationDepth}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {preset.config.minimumSources} sources
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {preset.config.confidenceThreshold}% threshold
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Load
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}