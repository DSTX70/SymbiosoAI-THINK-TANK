import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, ChevronRight, ChevronLeft, SkipForward, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SelectTutorial, SelectTutorialStep, SelectTutorialProgress } from '@shared/schema';

interface TutorialOverlayProps {
  tutorial: SelectTutorial;
  progress?: SelectTutorialProgress;
  isVisible: boolean;
  onComplete: (tutorialId: string, stepNumber?: number) => void;
  onSkip: (tutorialId: string) => void;
  onClose: () => void;
  onStepComplete: (tutorialId: string, stepNumber: number, timeSpent?: number) => void;
  className?: string;
}

interface TutorialTooltipProps {
  step: SelectTutorialStep;
  tutorial: SelectTutorial;
  progress?: SelectTutorialProgress;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  totalSteps: number;
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  step,
  tutorial,
  progress,
  onNext,
  onPrev,
  onSkip,
  onClose,
  canGoBack,
  canGoNext,
  totalSteps
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (step.targetElement) {
      const element = document.querySelector(step.targetElement) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Highlight the target element
        element.style.position = 'relative';
        element.style.zIndex = '9998';
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2)';
        element.style.borderRadius = '8px';
        element.style.transition = 'all 0.3s ease';
        
        // Clean up highlight when component unmounts
        return () => {
          element.style.position = '';
          element.style.zIndex = '';
          element.style.boxShadow = '';
          element.style.borderRadius = '';
          element.style.transition = '';
        };
      }
    }
  }, [step.targetElement]);

  const getTooltipPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const position = step.position || 'bottom';
    const padding = 16;
    
    switch (position) {
      case 'top':
        return {
          top: targetRect.top - padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translate(-50%, 0%)'
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - padding,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + padding,
          transform: 'translate(0%, -50%)'
        };
      case 'center':
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  const completedSteps = progress?.completedSteps?.length || 0;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9997]" onClick={onClose} />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] w-80 max-w-sm"
        style={getTooltipPosition()}
        data-testid="tutorial-tooltip"
      >
        <Card className="p-4 shadow-lg border-2 border-primary/20 bg-background">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  Step {step.stepNumber} of {totalSteps}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {tutorial.category}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm text-foreground">
                {step.title}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-muted"
              data-testid="tutorial-close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-4">
            <Progress value={progressPercentage} className="h-1 mb-2" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.content}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                disabled={!canGoBack}
                className="h-8 px-2"
                data-testid="tutorial-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {step.skipAllowed !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  data-testid="tutorial-skip"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Button
              size="sm"
              onClick={onNext}
              disabled={!canGoNext}
              className="h-8 px-3"
              data-testid="tutorial-next"
            >
              {step.stepNumber === totalSteps ? 'Complete' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

const TutorialModal: React.FC<TutorialTooltipProps> = ({
  step,
  tutorial,
  progress,
  onNext,
  onPrev,
  onSkip,
  onClose,
  canGoBack,
  canGoNext,
  totalSteps
}) => {
  const completedSteps = progress?.completedSteps?.length || 0;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9997]" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <Card className="w-full max-w-lg p-6 shadow-xl border-2 border-primary/20 bg-background" data-testid="tutorial-modal">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  Step {step.stepNumber} of {totalSteps}
                </Badge>
                <Badge variant="outline">
                  {tutorial.category}
                </Badge>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {step.title}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-muted"
              data-testid="tutorial-close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-6">
            <Progress value={progressPercentage} className="h-2 mb-4" />
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {step.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onPrev}
                disabled={!canGoBack}
                data-testid="tutorial-prev"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {step.skipAllowed !== false && (
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="tutorial-skip"
                >
                  <SkipForward className="h-4 w-4 mr-2" />
                  Skip Tutorial
                </Button>
              )}
            </div>

            <Button
              onClick={onNext}
              disabled={!canGoNext}
              data-testid="tutorial-next"
            >
              {step.stepNumber === totalSteps ? 'Complete Tutorial' : 'Next Step'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  tutorial,
  progress,
  isVisible,
  onComplete,
  onSkip,
  onClose,
  onStepComplete,
  className
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  
  useEffect(() => {
    if (progress && progress.currentStep > 0) {
      setCurrentStepIndex(progress.currentStep - 1);
    }
    setStepStartTime(Date.now());
  }, [progress]);

  useEffect(() => {
    setStepStartTime(Date.now());
  }, [currentStepIndex]);

  if (!isVisible || !tutorial.steps.length) return null;

  const steps = Array.isArray(tutorial.steps) ? tutorial.steps : [];
  const currentStep = steps[currentStepIndex];
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < steps.length - 1;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    const timeSpent = Math.floor((Date.now() - stepStartTime) / 60000); // Convert to minutes
    
    onStepComplete(tutorial.id, currentStep.stepNumber, timeSpent);
    
    if (isLastStep) {
      onComplete(tutorial.id);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (canGoBack) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onSkip(tutorial.id);
  };

  const handleClose = () => {
    onClose();
  };

  const StepComponent = currentStep?.stepType === 'modal' ? TutorialModal : TutorialTooltip;

  return (
    <div className={cn("tutorial-overlay", className)}>
      <StepComponent
        step={currentStep}
        tutorial={tutorial}
        progress={progress}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleSkip}
        onClose={handleClose}
        canGoBack={canGoBack}
        canGoNext={true} // Allow next unless specifically disabled by step
        totalSteps={steps.length}
      />
    </div>
  );
};

export default TutorialOverlay;