import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Users, BookOpen, Play, CheckCircle, Clock, 
  ChevronDown, ChevronRight, Target, Lightbulb, ArrowRight 
} from "lucide-react";

interface Playbook {
  id: string;
  title: string;
  description: string;
  type: string;
  role: string;
  category: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: PlaybookStep[];
  author: string;
  usageCount: number;
  active: boolean;
  createdAt: string;
}

interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  estimatedTime?: string;
  resources?: string[];
  completed?: boolean;
}

export default function PlaybooksGuide() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  // Fetch playbooks catalog
  const { data: catalogData, isLoading: catalogLoading } = useQuery({
    queryKey: ['/api/playbooks/catalog'],
    enabled: true
  });

  // Fetch onboarding playbooks
  const { data: onboardingData, isLoading: onboardingLoading } = useQuery({
    queryKey: ['/api/playbooks/onboarding'],
    enabled: true
  });

  const allPlaybooks = catalogData?.data || [];
  const onboardingPlaybooks = onboardingData?.data || [];
  const roles = catalogData?.meta?.roles || [];
  const types = catalogData?.meta?.types || [];
  const categories = catalogData?.meta?.categories || [];

  const filteredPlaybooks = allPlaybooks.filter((playbook: Playbook) => 
    (!selectedRole || playbook.role === selectedRole) &&
    (!selectedType || playbook.type === selectedType)
  );

  const handlePlaybookSelect = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setCompletedSteps(new Set());
    setExpandedSteps(new Set());
  };

  const toggleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const toggleStepExpanded = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getProgress = () => {
    if (!selectedPlaybook) return 0;
    return (completedSteps.size / selectedPlaybook.steps.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return <Users className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'developer': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (catalogLoading || onboardingLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="playbooks-guide">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Success Playbooks & Guidance</h2>
        <p className="text-muted-foreground">
          Interactive guides and best practices to help you succeed with the platform
        </p>
      </div>

      {/* Quick Start - Onboarding Playbooks */}
      {onboardingPlaybooks.length > 0 && (
        <Card data-testid="onboarding-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              Quick Start - Onboarding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onboardingPlaybooks.slice(0, 3).map((playbook: Playbook) => (
                <Card 
                  key={playbook.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePlaybookSelect(playbook)}
                  data-testid={`onboarding-card-${playbook.id}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getRoleIcon(playbook.role)}
                      {playbook.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {playbook.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline">{playbook.estimatedTime}</Badge>
                      <span className={getDifficultyColor(playbook.difficulty)}>
                        {playbook.difficulty}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedRole === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRole("")}
          data-testid="button-role-all"
        >
          All Roles
        </Button>
        {roles.map((role: string) => (
          <Button
            key={role}
            variant={selectedRole === role ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRole(role)}
            data-testid={`button-role-${role.toLowerCase()}`}
            className="flex items-center gap-2"
          >
            {getRoleIcon(role)}
            {role}
          </Button>
        ))}
        
        <div className="h-4 w-px bg-border mx-2" />
        
        <Button
          variant={selectedType === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("")}
          data-testid="button-type-all"
        >
          All Types
        </Button>
        {types.map((type: string) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
            data-testid={`button-type-${type.toLowerCase()}`}
          >
            {type}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList>
          <TabsTrigger value="catalog" data-testid="tab-catalog">Playbooks Catalog</TabsTrigger>
          <TabsTrigger value="guide" data-testid="tab-guide">Interactive Guide</TabsTrigger>
          <TabsTrigger value="progress" data-testid="tab-progress">Progress Tracking</TabsTrigger>
        </TabsList>

        {/* Playbooks Catalog */}
        <TabsContent value="catalog" className="space-y-4">
          {filteredPlaybooks.length === 0 ? (
            <Alert>
              <AlertDescription>
                No playbooks found for the selected filters.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaybooks.map((playbook: Playbook) => (
                <Card 
                  key={playbook.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePlaybookSelect(playbook)}
                  data-testid={`playbook-card-${playbook.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{playbook.title}</CardTitle>
                      <Badge variant={playbook.active ? "default" : "secondary"}>
                        {playbook.active ? "Active" : "Archived"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {playbook.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          {getRoleIcon(playbook.role)}
                          {playbook.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {playbook.estimatedTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {playbook.category}
                        </Badge>
                        <span className={`text-xs ${getDifficultyColor(playbook.difficulty)}`}>
                          {playbook.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{playbook.steps.length} steps</span>
                        <span>{playbook.usageCount} completed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Interactive Guide */}
        <TabsContent value="guide" className="space-y-4">
          {selectedPlaybook ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Playbook Info */}
              <div className="lg:col-span-1">
                <Card data-testid="playbook-info">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getRoleIcon(selectedPlaybook.role)}
                      {selectedPlaybook.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {selectedPlaybook.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(getProgress())}%</span>
                      </div>
                      <Progress value={getProgress()} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {completedSteps.size} of {selectedPlaybook.steps.length} steps completed
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <Badge variant="outline">{selectedPlaybook.role}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{selectedPlaybook.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span className={getDifficultyColor(selectedPlaybook.difficulty)}>
                          {selectedPlaybook.difficulty}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Steps */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {selectedPlaybook.steps.map((step: PlaybookStep, index: number) => (
                          <Collapsible 
                            key={step.id}
                            open={expandedSteps.has(step.id)}
                            onOpenChange={() => toggleStepExpanded(step.id)}
                          >
                            <div className="border rounded-lg p-4">
                              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                                <div className="flex items-center gap-3">
                                  <Button
                                    size="sm"
                                    variant={completedSteps.has(step.id) ? "default" : "outline"}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStepComplete(step.id);
                                    }}
                                    data-testid={`button-step-${step.id}`}
                                  >
                                    {completedSteps.has(step.id) ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <span className="text-sm">{index + 1}</span>
                                    )}
                                  </Button>
                                  <div>
                                    <h4 className="font-medium">{step.title}</h4>
                                    {step.estimatedTime && (
                                      <p className="text-xs text-muted-foreground">
                                        ~{step.estimatedTime}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {expandedSteps.has(step.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent className="mt-3">
                                <p className="text-sm text-muted-foreground mb-3">
                                  {step.description}
                                </p>
                                
                                {step.action && (
                                  <div className="p-3 bg-muted rounded-md mb-3">
                                    <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                                      <Target className="h-3 w-3" />
                                      Action Required
                                    </h5>
                                    <p className="text-sm">{step.action}</p>
                                  </div>
                                )}
                                
                                {step.resources && step.resources.length > 0 && (
                                  <div>
                                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                                      <Lightbulb className="h-3 w-3" />
                                      Resources
                                    </h5>
                                    <ul className="text-sm space-y-1">
                                      {step.resources.map((resource: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <ArrowRight className="h-3 w-3" />
                                          {resource}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                Select a playbook from the Catalog tab to begin the interactive guide.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Progress Tracking */}
        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card data-testid="stat-total-playbooks">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Playbooks</p>
                    <p className="text-2xl font-bold">{allPlaybooks.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-completed">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">
                      {selectedPlaybook ? Math.round(getProgress()) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-categories">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-usage">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Usage</p>
                    <p className="text-2xl font-bold">
                      {allPlaybooks.reduce((sum: number, p: Playbook) => sum + p.usageCount, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {selectedPlaybook && (
            <Card>
              <CardHeader>
                <CardTitle>Current Progress: {selectedPlaybook.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Progress</span>
                    <span className="font-semibold">{Math.round(getProgress())}%</span>
                  </div>
                  <Progress value={getProgress()} className="h-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">Completed Steps</h4>
                      <div className="space-y-1">
                        {selectedPlaybook.steps
                          .filter((_, idx) => completedSteps.has(selectedPlaybook.steps[idx].id))
                          .map((step) => (
                            <div key={step.id} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {step.title}
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-gray-600">Remaining Steps</h4>
                      <div className="space-y-1">
                        {selectedPlaybook.steps
                          .filter((_, idx) => !completedSteps.has(selectedPlaybook.steps[idx].id))
                          .map((step) => (
                            <div key={step.id} className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-gray-400" />
                              {step.title}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}