import React from 'react';
import { TutorialProvider, useTutorial } from './TutorialProvider';
import TutorialOverlay from './TutorialOverlay';
import { Portal } from '@radix-ui/react-portal';

interface TutorialSystemCoreProps {
  children: React.ReactNode;
}

const TutorialSystemCore: React.FC<TutorialSystemCoreProps> = ({ children }) => {
  const {
    currentTutorial,
    isTutorialVisible,
    getTutorialProgress,
    completeTutorial,
    completeStep,
    skipTutorial,
    hideTutorial
  } = useTutorial();

  const handleComplete = async (tutorialId: string) => {
    await completeTutorial(tutorialId);
  };

  const handleStepComplete = async (tutorialId: string, stepNumber: number, timeSpent?: number) => {
    await completeStep(tutorialId, stepNumber, timeSpent);
  };

  const handleSkip = async (tutorialId: string) => {
    await skipTutorial(tutorialId);
  };

  const handleClose = () => {
    hideTutorial();
  };

  return (
    <>
      {children}
      
      {/* Tutorial overlay portal - renders at document root for proper z-index */}
      {currentTutorial && (
        <Portal>
          <TutorialOverlay
            tutorial={currentTutorial}
            progress={getTutorialProgress(currentTutorial.id)}
            isVisible={isTutorialVisible}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onClose={handleClose}
            onStepComplete={handleStepComplete}
          />
        </Portal>
      )}
    </>
  );
};

interface TutorialSystemProps {
  children: React.ReactNode;
}

export const TutorialSystem: React.FC<TutorialSystemProps> = ({ children }) => {
  return (
    <TutorialProvider>
      <TutorialSystemCore>
        {children}
      </TutorialSystemCore>
    </TutorialProvider>
  );
};

export default TutorialSystem;