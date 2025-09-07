import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Brain, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Settings,
  Lightbulb,
  Target,
  Zap,
  BookOpen,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ThinkingPattern {
  id: string;
  name: string;
  description: string;
  category: "analytical" | "creative" | "strategic" | "philosophical" | "scientific" | "custom";
  framework: string;
  steps: string[];
  prompts: string[];
  considerations: string[];
  isBuiltIn: boolean;
  usageCount: number;
  effectivenessScore: number;
}

interface CustomThinkingPatternsProps {
  patterns?: ThinkingPattern[];
  selectedPatterns?: string[];
  onChange?: (patterns: string[]) => void;
  onPatternCreate?: (pattern: Omit<ThinkingPattern, "id" | "usageCount" | "effectivenessScore">) => void;
  onPatternUpdate?: (id: string, pattern: Partial<ThinkingPattern>) => void;
  onPatternDelete?: (id: string) => void;
}

const builtInPatterns: ThinkingPattern[] = [
  {
    id: "systems-thinking",
    name: "Systems Thinking",
    description: "Analyze complex systems by understanding interconnections, feedback loops, and emergent properties",
    category: "analytical",
    framework: "Systems Theory",
    steps: [
      "Identify system boundaries and components",
      "Map relationships and dependencies",
      "Analyze feedback loops and delays",
      "Look for emergent properties",
      "Consider system behavior over time"
    ],
    prompts: [
      "What are the key components of this system?",
      "How do these elements interact with each other?",
      "What feedback mechanisms are at play?",
      "What patterns emerge from these interactions?"
    ],
    considerations: [
      "Non-linear cause and effect",
      "Unintended consequences",
      "System resilience and adaptability",
      "Stakeholder perspectives"
    ],
    isBuiltIn: true,
    usageCount: 45,
    effectivenessScore: 92
  },
  {
    id: "first-principles",
    name: "First Principles",
    description: "Break down complex problems to fundamental truths and build understanding from the ground up",
    category: "analytical",
    framework: "Cartesian Method",
    steps: [
      "Break down the problem into basic elements",
      "Identify fundamental assumptions",
      "Question each assumption independently",
      "Reconstruct understanding from verified truths",
      "Build new solutions on solid foundation"
    ],
    prompts: [
      "What are the fundamental truths here?",
      "Which assumptions can we verify?",
      "What if we started from scratch?",
      "What's the simplest explanation?"
    ],
    considerations: [
      "Avoid reasoning by analogy",
      "Challenge conventional wisdom",
      "Focus on physical/logical constraints",
      "Build from verified principles"
    ],
    isBuiltIn: true,
    usageCount: 38,
    effectivenessScore: 89
  },
  {
    id: "devils-advocate",
    name: "Devil's Advocate",
    description: "Systematically challenge ideas by arguing from opposing perspectives to strengthen analysis",
    category: "strategic",
    framework: "Dialectical Thinking",
    steps: [
      "Present the strongest opposing argument",
      "Identify weaknesses in original position",
      "Consider alternative interpretations",
      "Stress-test assumptions",
      "Synthesize improved understanding"
    ],
    prompts: [
      "What's the strongest counter-argument?",
      "Where might this approach fail?",
      "Who would disagree and why?",
      "What are we not considering?"
    ],
    considerations: [
      "Intellectual honesty",
      "Avoid strawman arguments",
      "Consider multiple perspectives",
      "Balance criticism with construction"
    ],
    isBuiltIn: true,
    usageCount: 52,
    effectivenessScore: 87
  },
  {
    id: "design-thinking",
    name: "Design Thinking",
    description: "Human-centered approach focusing on empathy, ideation, and iterative problem-solving",
    category: "creative",
    framework: "Design Process",
    steps: [
      "Empathize with users and stakeholders",
      "Define the core problem",
      "Ideate multiple solutions",
      "Prototype and test concepts",
      "Iterate based on feedback"
    ],
    prompts: [
      "Who are we solving this for?",
      "What do users really need?",
      "How might we approach this differently?",
      "What would success look like?"
    ],
    considerations: [
      "User-centered perspective",
      "Iterative improvement",
      "Cross-functional collaboration",
      "Bias toward action"
    ],
    isBuiltIn: true,
    usageCount: 31,
    effectivenessScore: 84
  },
  {
    id: "scenario-planning",
    name: "Scenario Planning",
    description: "Explore multiple future possibilities to improve decision-making under uncertainty",
    category: "strategic",
    framework: "Future Studies",
    steps: [
      "Identify key uncertainties and drivers",
      "Develop multiple plausible scenarios",
      "Analyze implications of each scenario",
      "Identify robust strategies",
      "Create contingency plans"
    ],
    prompts: [
      "What could go wrong or right?",
      "What are the key uncertainties?",
      "How would we respond in each scenario?",
      "Which strategies work across scenarios?"
    ],
    considerations: [
      "Avoid prediction, embrace preparation",
      "Consider extreme but plausible scenarios",
      "Focus on driving forces",
      "Build adaptive capacity"
    ],
    isBuiltIn: true,
    usageCount: 29,
    effectivenessScore: 88
  },
  {
    id: "socratic-method",
    name: "Socratic Method",
    description: "Use systematic questioning to examine ideas, uncover assumptions, and stimulate critical thinking",
    category: "philosophical",
    framework: "Classical Philosophy",
    steps: [
      "Ask fundamental questions",
      "Examine definitions and concepts",
      "Question assumptions and beliefs",
      "Follow logical implications",
      "Seek deeper understanding"
    ],
    prompts: [
      "What do you mean by that?",
      "How do you know this to be true?",
      "What if the opposite were true?",
      "Can you give me an example?"
    ],
    considerations: [
      "Maintain intellectual humility",
      "Focus on understanding over winning",
      "Question everything systematically",
      "Learn through dialogue"
    ],
    isBuiltIn: true,
    usageCount: 33,
    effectivenessScore: 91
  }
];

export function CustomThinkingPatterns({
  patterns = builtInPatterns,
  selectedPatterns = [],
  onChange,
  onPatternCreate,
  onPatternUpdate,
  onPatternDelete
}: CustomThinkingPatternsProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPattern, setEditingPattern] = useState<ThinkingPattern | null>(null);
  const [newPattern, setNewPattern] = useState<Partial<ThinkingPattern>>({
    name: "",
    description: "",
    category: "custom",
    framework: "",
    steps: [""],
    prompts: [""],
    considerations: [""],
    isBuiltIn: false
  });

  const categories = [
    { value: "analytical", label: "Analytical", icon: Target, color: "bg-blue-100 text-blue-800" },
    { value: "creative", label: "Creative", icon: Lightbulb, color: "bg-purple-100 text-purple-800" },
    { value: "strategic", label: "Strategic", icon: Zap, color: "bg-green-100 text-green-800" },
    { value: "philosophical", label: "Philosophical", icon: BookOpen, color: "bg-orange-100 text-orange-800" },
    { value: "scientific", label: "Scientific", icon: Settings, color: "bg-cyan-100 text-cyan-800" },
    { value: "custom", label: "Custom", icon: Users, color: "bg-gray-100 text-gray-800" }
  ];

  const handlePatternToggle = (patternId: string) => {
    const newSelection = selectedPatterns.includes(patternId)
      ? selectedPatterns.filter(id => id !== patternId)
      : [...selectedPatterns, patternId];
    onChange?.(newSelection);
  };

  const handleCreatePattern = () => {
    if (newPattern.name && newPattern.description && newPattern.framework) {
      onPatternCreate?.({
        name: newPattern.name!,
        description: newPattern.description!,
        category: newPattern.category!,
        framework: newPattern.framework!,
        steps: newPattern.steps?.filter(s => s.trim()) || [],
        prompts: newPattern.prompts?.filter(p => p.trim()) || [],
        considerations: newPattern.considerations?.filter(c => c.trim()) || [],
        isBuiltIn: false
      });
      setNewPattern({
        name: "",
        description: "",
        category: "custom",
        framework: "",
        steps: [""],
        prompts: [""],
        considerations: [""],
        isBuiltIn: false
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleArrayFieldChange = (
    field: "steps" | "prompts" | "considerations", 
    index: number, 
    value: string,
    target: Partial<ThinkingPattern>
  ) => {
    const updatedArray = [...(target[field] || [])];
    updatedArray[index] = value;
    return { ...target, [field]: updatedArray };
  };

  const handleArrayFieldAdd = (
    field: "steps" | "prompts" | "considerations",
    target: Partial<ThinkingPattern>
  ) => {
    const updatedArray = [...(target[field] || []), ""];
    return { ...target, [field]: updatedArray };
  };

  const handleArrayFieldRemove = (
    field: "steps" | "prompts" | "considerations",
    index: number,
    target: Partial<ThinkingPattern>
  ) => {
    const updatedArray = (target[field] || []).filter((_, i) => i !== index);
    return { ...target, [field]: updatedArray };
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[categories.length - 1];
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="text-primary" size={20} />
            Custom Thinking Patterns
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {selectedPatterns.length} selected
            </Badge>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="create-pattern-button">
                  <Plus className="h-4 w-4 mr-1" />
                  Create Pattern
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Custom Thinking Pattern</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pattern-name">Pattern Name</Label>
                      <Input
                        id="pattern-name"
                        value={newPattern.name || ""}
                        onChange={(e) => setNewPattern(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Root Cause Analysis"
                        data-testid="pattern-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pattern-category">Category</Label>
                      <Select
                        value={newPattern.category}
                        onValueChange={(value) => setNewPattern(prev => ({ ...prev, category: value as any }))}
                      >
                        <SelectTrigger data-testid="pattern-category-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pattern-description">Description</Label>
                    <Textarea
                      id="pattern-description"
                      value={newPattern.description || ""}
                      onChange={(e) => setNewPattern(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this thinking pattern does and when to use it..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pattern-framework">Framework/Foundation</Label>
                    <Input
                      id="pattern-framework"
                      value={newPattern.framework || ""}
                      onChange={(e) => setNewPattern(prev => ({ ...prev, framework: e.target.value }))}
                      placeholder="e.g., McKinsey Method, Lean Startup, etc."
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Thinking Steps</Label>
                    {(newPattern.steps || [""]).map((step, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={step}
                          onChange={(e) => setNewPattern(prev => 
                            handleArrayFieldChange("steps", index, e.target.value, prev)
                          )}
                          placeholder={`Step ${index + 1}...`}
                        />
                        {(newPattern.steps?.length || 0) > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewPattern(prev => 
                              handleArrayFieldRemove("steps", index, prev)
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewPattern(prev => handleArrayFieldAdd("steps", prev))}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Step
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Guiding Questions/Prompts</Label>
                    {(newPattern.prompts || [""]).map((prompt, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={prompt}
                          onChange={(e) => setNewPattern(prev => 
                            handleArrayFieldChange("prompts", index, e.target.value, prev)
                          )}
                          placeholder={`Question ${index + 1}...`}
                        />
                        {(newPattern.prompts?.length || 0) > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewPattern(prev => 
                              handleArrayFieldRemove("prompts", index, prev)
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewPattern(prev => handleArrayFieldAdd("prompts", prev))}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Prompt
                    </Button>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleCreatePattern} disabled={!newPattern.name || !newPattern.description}>
                      Create Pattern
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Patterns</TabsTrigger>
            <TabsTrigger value="selected">Selected ({selectedPatterns.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const count = patterns.filter(p => p.category === category.value).length;
                return (
                  <Badge 
                    key={category.value} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {category.label} ({count})
                  </Badge>
                );
              })}
            </div>

            {/* Pattern Grid */}
            <div className="grid gap-4">
              {patterns.map((pattern) => {
                const categoryInfo = getCategoryInfo(pattern.category);
                const Icon = categoryInfo.icon;
                const isSelected = selectedPatterns.includes(pattern.id);

                return (
                  <Card 
                    key={pattern.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handlePatternToggle(pattern.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <h3 className="font-semibold">{pattern.name}</h3>
                          </div>
                          <Badge className={`text-xs ${categoryInfo.color} border-0`}>
                            {categoryInfo.label}
                          </Badge>
                          {pattern.isBuiltIn && (
                            <Badge variant="outline" className="text-xs">
                              Built-in
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => {}}
                            data-testid={`pattern-checkbox-${pattern.id}`}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {pattern.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Framework: {pattern.framework}</span>
                        <div className="flex items-center gap-3">
                          <span>Used {pattern.usageCount} times</span>
                          <div className="flex items-center gap-1">
                            <span>Effectiveness:</span>
                            <Badge variant="outline" className="text-xs">
                              {pattern.effectivenessScore}%
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 pt-3 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium mb-2">Key Steps</h4>
                              <ul className="space-y-1">
                                {pattern.steps.slice(0, 3).map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-primary font-mono text-xs mt-0.5">
                                      {idx + 1}.
                                    </span>
                                    <span className="text-muted-foreground">{step}</span>
                                  </li>
                                ))}
                                {pattern.steps.length > 3 && (
                                  <li className="text-muted-foreground text-xs">
                                    +{pattern.steps.length - 3} more steps...
                                  </li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Example Questions</h4>
                              <ul className="space-y-1">
                                {pattern.prompts.slice(0, 2).map((prompt, idx) => (
                                  <li key={idx} className="text-muted-foreground text-sm">
                                    • {prompt}
                                  </li>
                                ))}
                                {pattern.prompts.length > 2 && (
                                  <li className="text-muted-foreground text-xs">
                                    +{pattern.prompts.length - 2} more questions...
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="selected" className="space-y-6">
            {selectedPatterns.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No Patterns Selected</h3>
                <p className="text-muted-foreground">
                  Select thinking patterns from the Browse tab to enhance your analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Selected Thinking Patterns</h3>
                  <Badge variant="outline">
                    {selectedPatterns.length} pattern{selectedPatterns.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {patterns
                  .filter(pattern => selectedPatterns.includes(pattern.id))
                  .map((pattern) => {
                    const categoryInfo = getCategoryInfo(pattern.category);
                    const Icon = categoryInfo.icon;

                    return (
                      <Card key={pattern.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5" />
                              <h4 className="font-semibold">{pattern.name}</h4>
                              <Badge className={`text-xs ${categoryInfo.color} border-0`}>
                                {categoryInfo.label}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePatternToggle(pattern.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {pattern.description}
                          </p>

                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Framework:</span> {pattern.framework}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}