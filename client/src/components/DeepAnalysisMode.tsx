import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Zap, 
  Target,
  Clock,
  Layers,
  Settings,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Search,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DeepAnalysisConfig {
  processingDepth: number;
  iterativeRefinement: boolean;
  evidenceRequirement: "standard" | "comprehensive" | "exhaustive";
  crossValidation: boolean;
  hypothesisGeneration: boolean;
  contradictionAnalysis: boolean;
  semanticLayering: boolean;
  conceptualMapping: boolean;
  recursiveReasoning: boolean;
  multiPerspectiveValidation: boolean;
  customInstructions: string;
  timeAllocation: number;
  qualityThreshold: number;
}

interface DeepAnalysisModeProps {
  config?: Partial<DeepAnalysisConfig>;
  onChange?: (config: DeepAnalysisConfig) => void;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const defaultConfig: DeepAnalysisConfig = {
  processingDepth: 75,
  iterativeRefinement: true,
  evidenceRequirement: "comprehensive",
  crossValidation: true,
  hypothesisGeneration: true,
  contradictionAnalysis: true,
  semanticLayering: false,
  conceptualMapping: true,
  recursiveReasoning: false,
  multiPerspectiveValidation: true,
  customInstructions: "",
  timeAllocation: 180, // 3 minutes
  qualityThreshold: 85
};

const processingModes = {
  standard: {
    name: "Standard Analysis",
    description: "Balanced depth with good performance",
    depth: 50,
    timeEstimate: "2-3 minutes",
    features: ["Basic reasoning", "Evidence collection", "Simple validation"]
  },
  comprehensive: {
    name: "Comprehensive Analysis", 
    description: "Thorough examination with multiple iterations",
    depth: 75,
    timeEstimate: "5-8 minutes",
    features: ["Multi-layer reasoning", "Cross-validation", "Hypothesis testing", "Contradiction analysis"]
  },
  exhaustive: {
    name: "Exhaustive Analysis",
    description: "Maximum depth with extensive validation",
    depth: 95,
    timeEstimate: "10-15 minutes",
    features: ["Recursive reasoning", "Semantic mapping", "Multiple perspective validation", "Comprehensive evidence review"]
  }
};

const evidenceRequirements = {
  standard: { sources: "2-3", validation: "Basic", quality: "Good" },
  comprehensive: { sources: "4-6", validation: "Cross-referenced", quality: "High" }, 
  exhaustive: { sources: "7+", validation: "Multi-source", quality: "Maximum" }
};

export function DeepAnalysisMode({ 
  config: initialConfig = {},
  onChange,
  isEnabled = false,
  onToggle
}: DeepAnalysisModeProps) {
  const [config, setConfig] = useState<DeepAnalysisConfig>({
    ...defaultConfig,
    ...initialConfig
  });

  const updateConfig = (updates: Partial<DeepAnalysisConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onChange?.(newConfig);
  };

  const getCurrentMode = () => {
    if (config.processingDepth >= 90) return "exhaustive";
    if (config.processingDepth >= 70) return "comprehensive";
    return "standard";
  };

  const currentMode = getCurrentMode();
  const modeInfo = processingModes[currentMode as keyof typeof processingModes];
  const evidenceInfo = evidenceRequirements[config.evidenceRequirement];

  const getEstimatedTime = () => {
    const baseTime = config.timeAllocation;
    const depthMultiplier = config.processingDepth / 100;
    const featureCount = [
      config.iterativeRefinement,
      config.crossValidation,
      config.hypothesisGeneration,
      config.contradictionAnalysis,
      config.semanticLayering,
      config.conceptualMapping,
      config.recursiveReasoning,
      config.multiPerspectiveValidation
    ].filter(Boolean).length;
    
    return Math.round(baseTime * depthMultiplier * (1 + featureCount * 0.2));
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="text-primary" size={20} />
            Deep Analysis Mode
            {isEnabled && <Badge variant="default" className="animate-pulse">Active</Badge>}
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            data-testid="deep-analysis-toggle"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="processing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="processing" className="space-y-6">
            {/* Processing Depth */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Processing Depth</Label>
                <Badge variant="outline" className="font-mono">
                  {config.processingDepth}%
                </Badge>
              </div>
              <Slider
                value={[config.processingDepth]}
                onValueChange={([value]) => updateConfig({ processingDepth: value })}
                max={100}
                min={25}
                step={5}
                className="w-full"
                data-testid="processing-depth-slider"
              />
              
              {/* Mode Indicator */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{modeInfo.name}</h3>
                  <span className="text-sm text-muted-foreground">{modeInfo.timeEstimate}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{modeInfo.description}</p>
                <div className="flex flex-wrap gap-2">
                  {modeInfo.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Evidence Requirements */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Evidence Requirements</Label>
              <Select
                value={config.evidenceRequirement}
                onValueChange={(value) => updateConfig({ evidenceRequirement: value as any })}
              >
                <SelectTrigger data-testid="evidence-requirement-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(evidenceRequirements).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center justify-between w-full">
                        <span className="capitalize">{key}</span>
                        <div className="text-xs text-muted-foreground ml-4">
                          {info.sources} sources • {info.quality} quality
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                <div className="text-center">
                  <div className="font-semibold">{evidenceInfo.sources}</div>
                  <div className="text-muted-foreground">Sources</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{evidenceInfo.validation}</div>
                  <div className="text-muted-foreground">Validation</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{evidenceInfo.quality}</div>
                  <div className="text-muted-foreground">Quality</div>
                </div>
              </div>
            </div>

            {/* Time & Quality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Time Allocation</Label>
                  <Badge variant="outline" className="text-xs">
                    {Math.floor(config.timeAllocation / 60)}m {config.timeAllocation % 60}s
                  </Badge>
                </div>
                <Slider
                  value={[config.timeAllocation]}
                  onValueChange={([value]) => updateConfig({ timeAllocation: value })}
                  max={900} // 15 minutes
                  min={60}  // 1 minute
                  step={30}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Quality Threshold</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.qualityThreshold}%
                  </Badge>
                </div>
                <Slider
                  value={[config.qualityThreshold]}
                  onValueChange={([value]) => updateConfig({ qualityThreshold: value })}
                  max={95}
                  min={60}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Estimated Processing Time */}
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">
                  Estimated Processing Time
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor(getEstimatedTime() / 60)}m {getEstimatedTime() % 60}s
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Based on current configuration and selected features
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Core Analysis Features
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Iterative Refinement</Label>
                      <div className="text-xs text-muted-foreground">Multiple analysis passes</div>
                    </div>
                    <Switch
                      checked={config.iterativeRefinement}
                      onCheckedChange={(checked) => updateConfig({ iterativeRefinement: checked })}
                      data-testid="iterative-refinement-switch"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Cross Validation</Label>
                      <div className="text-xs text-muted-foreground">Verify findings across agents</div>
                    </div>
                    <Switch
                      checked={config.crossValidation}
                      onCheckedChange={(checked) => updateConfig({ crossValidation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Hypothesis Generation</Label>
                      <div className="text-xs text-muted-foreground">Create testable hypotheses</div>
                    </div>
                    <Switch
                      checked={config.hypothesisGeneration}
                      onCheckedChange={(checked) => updateConfig({ hypothesisGeneration: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Contradiction Analysis</Label>
                      <div className="text-xs text-muted-foreground">Identify conflicting information</div>
                    </div>
                    <Switch
                      checked={config.contradictionAnalysis}
                      onCheckedChange={(checked) => updateConfig({ contradictionAnalysis: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Advanced Processing
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Semantic Layering</Label>
                      <div className="text-xs text-muted-foreground">Multi-level meaning analysis</div>
                    </div>
                    <Switch
                      checked={config.semanticLayering}
                      onCheckedChange={(checked) => updateConfig({ semanticLayering: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Conceptual Mapping</Label>
                      <div className="text-xs text-muted-foreground">Map relationships between concepts</div>
                    </div>
                    <Switch
                      checked={config.conceptualMapping}
                      onCheckedChange={(checked) => updateConfig({ conceptualMapping: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Recursive Reasoning</Label>
                      <div className="text-xs text-muted-foreground">Deep logical chains</div>
                    </div>
                    <Switch
                      checked={config.recursiveReasoning}
                      onCheckedChange={(checked) => updateConfig({ recursiveReasoning: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Multi-Perspective Validation</Label>
                      <div className="text-xs text-muted-foreground">Validate from multiple viewpoints</div>
                    </div>
                    <Switch
                      checked={config.multiPerspectiveValidation}
                      onCheckedChange={(checked) => updateConfig({ multiPerspectiveValidation: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {/* Custom Instructions */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Custom Analysis Instructions</Label>
              <Textarea
                placeholder="Add specific instructions for the deep analysis process...&#10;&#10;Example:&#10;- Focus on ethical implications&#10;- Consider long-term consequences&#10;- Analyze from stakeholder perspectives"
                value={config.customInstructions}
                onChange={(e) => updateConfig({ customInstructions: e.target.value })}
                rows={6}
                data-testid="custom-instructions-textarea"
              />
              <div className="text-sm text-muted-foreground">
                These instructions will guide the AI agents during deep analysis processing
              </div>
            </div>

            {/* Performance Impact */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Performance Impact Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {config.processingDepth}%
                  </div>
                  <div className="text-sm text-muted-foreground">Processing Intensity</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {config.qualityThreshold}%
                  </div>
                  <div className="text-sm text-muted-foreground">Expected Quality</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {Math.round(getEstimatedTime() / 60)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}