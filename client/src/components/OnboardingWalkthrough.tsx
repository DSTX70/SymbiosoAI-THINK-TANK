import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, CheckCircle, Lightbulb, Target, Eye, Play } from "lucide-react";
import type { OnboardingStep, OnboardingFlow, OnboardingProgress } from "@shared/schema";

interface OnboardingWalkthroughProps {
  isActive: boolean;
  currentFlow: OnboardingFlow | null;
  currentStepIndex: number;
  progress: OnboardingProgress;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  onDismiss: () => void;
}

interface TooltipPosition {
  top: number;
  left: number;
  arrow: "top" | "bottom" | "left" | "right";
}

export function OnboardingWalkthrough({
  isActive,
  currentFlow,
  currentStepIndex,
  progress,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  onDismiss,
}: OnboardingWalkthroughProps) {
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStep = currentFlow?.steps[currentStepIndex];
  const isLastStep = currentFlow ? currentStepIndex === currentFlow.steps.length - 1 : false;
  const isFirstStep = currentStepIndex === 0;

  useEffect(() => {
    if (!isActive || !currentStep) {
      setHighlightElement(null);
      setTooltipPosition(null);
      return;
    }

    const targetElement = document.querySelector(currentStep.target) as HTMLElement;
    if (!targetElement) {
      console.warn(`Onboarding target not found: ${currentStep.target}`);
      return;
    }

    setHighlightElement(targetElement);

    // Calculate tooltip position
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let position: TooltipPosition;
    
    switch (currentStep.position) {
      case "top":
        position = {
          top: rect.top + scrollTop - 20,
          left: rect.left + scrollLeft + rect.width / 2,
          arrow: "bottom"
        };
        break;
      case "bottom":
        position = {
          top: rect.bottom + scrollTop + 20,
          left: rect.left + scrollLeft + rect.width / 2,
          arrow: "top"
        };
        break;
      case "left":
        position = {
          top: rect.top + scrollTop + rect.height / 2,
          left: rect.left + scrollLeft - 20,
          arrow: "right"
        };
        break;
      case "right":
        position = {
          top: rect.top + scrollTop + rect.height / 2,
          left: rect.right + scrollLeft + 20,
          arrow: "left"
        };
        break;
    }

    setTooltipPosition(position);

    // Scroll target into view
    targetElement.scrollIntoView({ 
      behavior: "smooth", 
      block: "center" 
    });
  }, [isActive, currentStep, currentStepIndex]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case "tooltip": return <Lightbulb className="h-4 w-4" />;
      case "modal": return <Target className="h-4 w-4" />;
      case "highlight": return <Eye className="h-4 w-4" />;
      case "tour": return <Play className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const handleAction = () => {
    if (currentStep?.action) {
      // Trigger the action (e.g., click a button, open a modal)
      const actionElement = document.querySelector(currentStep.action) as HTMLElement;
      if (actionElement) {
        actionElement.click();
      }
    }
    onNext();
  };

  if (!isActive || !currentFlow || !currentStep) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40"
        style={{ backdropFilter: "blur(2px)" }}
        data-testid="onboarding-overlay"
      />

      {/* Highlight spotlight */}
      {highlightElement && (
        <div
          className="fixed border-4 border-primary rounded-lg z-50 pointer-events-none animate-pulse"
          style={{
            top: highlightElement.getBoundingClientRect().top + window.pageYOffset - 4,
            left: highlightElement.getBoundingClientRect().left + window.pageXOffset - 4,
            width: highlightElement.offsetWidth + 8,
            height: highlightElement.offsetHeight + 8,
          }}
          data-testid="onboarding-highlight"
        />
      )}

      {/* Tooltip */}
      {tooltipPosition && (
        <Card
          className={`fixed z-50 max-w-sm shadow-2xl transform ${
            tooltipPosition.arrow === "top" ? "-translate-y-full" :
            tooltipPosition.arrow === "bottom" ? "translate-y-0" :
            tooltipPosition.arrow === "left" ? "-translate-x-full -translate-y-1/2" :
            "translate-x-0 -translate-y-1/2"
          }`}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
          data-testid="onboarding-tooltip"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStepIcon(currentStep.type)}
                <CardTitle className="text-lg">{currentStep.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                data-testid="button-dismiss-onboarding"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Step {currentStepIndex + 1} of {currentFlow.steps.length}
              </Badge>
              <Badge variant="outline">{currentFlow.name}</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {currentStep.description}
            </p>

            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevious}
                    data-testid="button-onboarding-previous"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  data-testid="button-skip-onboarding"
                >
                  Skip Tour
                </Button>
              </div>

              <div className="flex gap-2">
                {currentStep.action && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAction}
                    data-testid="button-onboarding-action"
                  >
                    Try It
                  </Button>
                )}
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={isLastStep ? onComplete : onNext}
                  data-testid={isLastStep ? "button-complete-onboarding" : "button-onboarding-next"}
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex gap-1">
              {currentFlow.steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ${
                    index <= currentStepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>

          {/* Arrow pointer */}
          <div
            className={`absolute w-0 h-0 ${
              tooltipPosition.arrow === "top" ? 
                "bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-card" :
              tooltipPosition.arrow === "bottom" ? 
                "top-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-card" :
              tooltipPosition.arrow === "left" ? 
                "right-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-card" :
                "left-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-card"
            }`}
          />
        </Card>
      )}
    </>
  );
}