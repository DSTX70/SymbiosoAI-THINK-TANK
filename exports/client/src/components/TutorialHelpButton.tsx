import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, BookOpen } from 'lucide-react';
import { useTutorial } from './TutorialProvider';
import { cn } from '@/lib/utils';

interface TutorialHelpButtonProps {
  tutorialId?: string;
  feature?: string;
  variant?: 'icon' | 'button' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  'data-testid'?: string;
}

export const TutorialHelpButton: React.FC<TutorialHelpButtonProps> = ({
  tutorialId,
  feature,
  variant = 'icon',
  size = 'default',
  className,
  'data-testid': testId
}) => {
  const { 
    activeTutorials, 
    recommendations, 
    startTutorial, 
    settings,
    shouldShowTutorial 
  } = useTutorial();

  const getAriaLabel = () => {
    if (tutorialId) {
      const tutorial = activeTutorials.find(t => t.id === tutorialId);
      return tutorial ? `Open help for ${tutorial.name}` : "Open tutorial";
    }
    
    if (feature) {
      return `Open help for ${feature.replace('-', ' ')}`;
    }
    
    return "Open help tutorial";
  };

  const handleClick = async () => {
    let targetTutorial = null;

    // If specific tutorial ID provided, use it
    if (tutorialId) {
      targetTutorial = activeTutorials.find(t => t.id === tutorialId);
    } 
    // If feature specified, find relevant tutorial
    else if (feature) {
      targetTutorial = activeTutorials.find(t => 
        t.targetFeature === feature && shouldShowTutorial(t.id)
      );
      
      // Fallback to recommendations for the feature
      if (!targetTutorial) {
        targetTutorial = recommendations.find(t => 
          t.targetFeature === feature && shouldShowTutorial(t.id)
        );
      }
    }
    // Fallback to first available recommendation
    else {
      targetTutorial = recommendations.find(t => shouldShowTutorial(t.id));
    }

    if (targetTutorial) {
      await startTutorial(targetTutorial.id);
    }
  };

  // Don't render if no tutorials available or tooltips disabled
  if (!settings?.showTooltips || activeTutorials.length === 0) {
    return null;
  }

  // Check if there's a relevant tutorial available
  const hasRelevantTutorial = tutorialId 
    ? activeTutorials.some(t => t.id === tutorialId && shouldShowTutorial(t.id))
    : feature
    ? activeTutorials.some(t => t.targetFeature === feature && shouldShowTutorial(t.id)) ||
      recommendations.some(t => t.targetFeature === feature && shouldShowTutorial(t.id))
    : recommendations.length > 0;

  if (!hasRelevantTutorial) {
    return null;
  }

  const renderButton = () => {
    switch (variant) {
      case 'button':
        return (
          <Button
            variant="outline"
            size={size}
            onClick={handleClick}
            className={cn("gap-2", className)}
            data-testid={testId || "tutorial-help-button"}
            aria-label={getAriaLabel()}
          >
            <BookOpen className="h-4 w-4" />
            Get Help
          </Button>
        );

      case 'minimal':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            className={cn("h-6 w-6 p-0 text-muted-foreground hover:text-primary", className)}
            data-testid={testId || "tutorial-help-minimal"}
            aria-label={getAriaLabel()}
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        );

      case 'icon':
      default:
        return (
          <Button
            variant="ghost"
            size={size === 'sm' ? 'sm' : 'default'}
            onClick={handleClick}
            className={cn(
              "rounded-full",
              size === 'sm' ? "h-8 w-8 p-0" : "h-9 w-9 p-0",
              "text-muted-foreground hover:text-primary hover:bg-muted",
              className
            )}
            data-testid={testId || "tutorial-help-icon"}
            aria-label={getAriaLabel()}
          >
            <HelpCircle className={size === 'sm' ? "h-4 w-4" : "h-5 w-5"} />
          </Button>
        );
    }
  };

  const getTooltipContent = () => {
    if (tutorialId) {
      const tutorial = activeTutorials.find(t => t.id === tutorialId);
      return tutorial ? `Start "${tutorial.name}" tutorial` : "Start tutorial";
    }
    
    if (feature) {
      const tutorial = activeTutorials.find(t => t.targetFeature === feature);
      return tutorial ? `Learn about ${tutorial.name}` : `Get help with ${feature}`;
    }
    
    return "Get help with this feature";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {renderButton()}
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TutorialHelpButton;