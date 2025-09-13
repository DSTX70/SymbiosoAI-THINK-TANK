import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, Play, Clock, CheckCircle, SkipForward, Settings, 
  Filter, Search, Star, TrendingUp, User, HelpCircle 
} from 'lucide-react';
import { useTutorial } from './TutorialProvider';
import { cn } from '@/lib/utils';
import { Tutorial, TutorialProgress } from './TutorialOverlay';

interface TutorialCardProps {
  tutorial: Tutorial;
  progress?: TutorialProgress;
  onStart: (tutorial: Tutorial) => void;
  onResume: (tutorial: Tutorial) => void;
  className?: string;
}

const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  progress,
  onStart,
  onResume,
  className
}) => {
  const getStatusInfo = () => {
    if (!progress) {
      return { status: 'not_started', color: 'bg-gray-500', label: 'New' };
    }
    
    switch (progress.status) {
      case 'completed':
        return { status: 'completed', color: 'bg-green-500', label: 'Completed' };
      case 'in_progress':
        return { status: 'in_progress', color: 'bg-blue-500', label: 'In Progress' };
      case 'skipped':
        return { status: 'skipped', color: 'bg-yellow-500', label: 'Skipped' };
      default:
        return { status: 'not_started', color: 'bg-gray-500', label: 'New' };
    }
  };

  const statusInfo = getStatusInfo();
  const completedSteps = progress?.completedSteps?.length || 0;
  const totalSteps = tutorial.steps?.length || 0;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const handleAction = () => {
    if (progress && progress.status === 'in_progress') {
      onResume(tutorial);
    } else {
      onStart(tutorial);
    }
  };

  const getButtonText = () => {
    if (progress?.status === 'completed') return 'Restart';
    if (progress?.status === 'in_progress') return 'Resume';
    return 'Start Tutorial';
  };

  return (
    <Card className={cn("tutorial-card hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {tutorial.category}
              </Badge>
              <Badge variant="secondary" className={cn("text-xs text-white", statusInfo.color)}>
                {statusInfo.label}
              </Badge>
              {tutorial.targetUserLevel !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  {tutorial.targetUserLevel}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {tutorial.name}
            </CardTitle>
            {tutorial.description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {tutorial.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Progress bar for in-progress tutorials */}
          {progress && progress.status === 'in_progress' && totalSteps > 0 && (
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{completedSteps} of {totalSteps} steps</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          {/* Tutorial metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {tutorial.estimatedDuration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{tutorial.estimatedDuration} min</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{totalSteps} steps</span>
            </div>

            {progress?.timeSpentMinutes && progress.timeSpentMinutes > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>{progress.timeSpentMinutes} min spent</span>
              </div>
            )}
          </div>

          {/* Action button */}
          <Button 
            onClick={handleAction}
            className="w-full"
            variant={progress?.status === 'completed' ? 'outline' : 'default'}
            data-testid={`tutorial-start-${tutorial.id}`}
          >
            <Play className="h-4 w-4 mr-2" />
            {getButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface TutorialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TutorialSettingsDialog: React.FC<TutorialSettingsDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { settings, updateSettings, resetSettings, isLoadingSettings } = useTutorial();
  const [localSettings, setLocalSettings] = useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    if (localSettings) {
      await updateSettings(localSettings);
      onOpenChange(false);
    }
  };

  const handleReset = async () => {
    await resetSettings();
    onOpenChange(false);
  };

  if (!localSettings) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="tutorial-settings-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Tutorial Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start">Auto-start tutorials</Label>
              <Switch
                id="auto-start"
                checked={localSettings.autoStartTutorials}
                onCheckedChange={(checked) => 
                  setLocalSettings(prev => prev ? { ...prev, autoStartTutorials: checked } : null)
                }
                data-testid="auto-start-switch"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-tooltips">Show contextual tooltips</Label>
              <Switch
                id="show-tooltips"
                checked={localSettings.showTooltips}
                onCheckedChange={(checked) => 
                  setLocalSettings(prev => prev ? { ...prev, showTooltips: checked } : null)
                }
                data-testid="show-tooltips-switch"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tutorial-speed">Tutorial speed</Label>
            <Select
              value={localSettings.tutorialSpeed}
              onValueChange={(value: 'slow' | 'normal' | 'fast') => 
                setLocalSettings(prev => prev ? { ...prev, tutorialSpeed: value } : null)
              }
            >
              <SelectTrigger data-testid="tutorial-speed-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-level">Experience level</Label>
            <Select
              value={localSettings.experienceLevel}
              onValueChange={(value: 'beginner' | 'intermediate' | 'expert') => 
                setLocalSettings(prev => prev ? { ...prev, experienceLevel: value } : null)
              }
            >
              <SelectTrigger data-testid="experience-level-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred-position">Tooltip position</Label>
            <Select
              value={localSettings.preferredPosition}
              onValueChange={(value: 'top' | 'bottom' | 'left' | 'right' | 'center') => 
                setLocalSettings(prev => prev ? { ...prev, preferredPosition: value } : null)
              }
            >
              <SelectTrigger data-testid="preferred-position-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="center">Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleReset} data-testid="reset-settings">
            Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoadingSettings} data-testid="save-settings">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface TutorialLauncherProps {
  className?: string;
}

export const TutorialLauncher: React.FC<TutorialLauncherProps> = ({ className }) => {
  const {
    activeTutorials,
    recommendations,
    tutorialProgress,
    showTutorial,
    startTutorial,
    isLoadingTutorials,
    getTutorialProgress
  } = useTutorial();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleStartTutorial = (tutorial: Tutorial) => {
    showTutorial(tutorial);
  };

  const handleResumeTutorial = (tutorial: Tutorial) => {
    showTutorial(tutorial);
  };

  // Filter tutorials based on search and filters
  const filteredTutorials = activeTutorials.filter(tutorial => {
    const matchesSearch = tutorial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || tutorial.category === categoryFilter;
    
    const progress = getTutorialProgress(tutorial.id);
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'not_started' && !progress) ||
                         (statusFilter === 'in_progress' && progress?.status === 'in_progress') ||
                         (statusFilter === 'completed' && progress?.status === 'completed');
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = [...new Set(activeTutorials.map(t => t.category))];

  if (isLoadingTutorials) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tutorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("tutorial-launcher", className)} data-testid="tutorial-launcher">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Interactive Tutorials</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            data-testid="tutorial-settings-button"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Learn how to use complex features with step-by-step interactive guides.
        </p>
      </div>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommended" data-testid="recommended-tab">
            <Star className="h-4 w-4 mr-2" />
            Recommended
          </TabsTrigger>
          <TabsTrigger value="all" data-testid="all-tutorials-tab">
            <BookOpen className="h-4 w-4 mr-2" />
            All Tutorials
          </TabsTrigger>
          <TabsTrigger value="progress" data-testid="progress-tab">
            <TrendingUp className="h-4 w-4 mr-2" />
            My Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="mt-6">
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Suggested for you</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map(tutorial => (
                    <TutorialCard
                      key={tutorial.id}
                      tutorial={tutorial}
                      progress={getTutorialProgress(tutorial.id)}
                      onStart={handleStartTutorial}
                      onResume={handleResumeTutorial}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
                <p className="text-muted-foreground">
                  No new tutorial recommendations at the moment.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    data-testid="tutorial-search"
                  />
                </div>
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40" data-testid="category-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_started">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tutorial Grid */}
            {filteredTutorials.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTutorials.map(tutorial => (
                  <TutorialCard
                    key={tutorial.id}
                    tutorial={tutorial}
                    progress={getTutorialProgress(tutorial.id)}
                    onStart={handleStartTutorial}
                    onResume={handleResumeTutorial}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No tutorials found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find tutorials.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="space-y-6">
            {tutorialProgress.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tutorialProgress
                  .filter(p => p.status !== 'not_started')
                  .map(progress => {
                    const tutorial = activeTutorials.find(t => t.id === progress.tutorialId);
                    return tutorial ? (
                      <TutorialCard
                        key={tutorial.id}
                        tutorial={tutorial}
                        progress={progress}
                        onStart={handleStartTutorial}
                        onResume={handleResumeTutorial}
                      />
                    ) : null;
                  })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No progress yet</h3>
                <p className="text-muted-foreground">
                  Start a tutorial to see your progress here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <TutorialSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default TutorialLauncher;