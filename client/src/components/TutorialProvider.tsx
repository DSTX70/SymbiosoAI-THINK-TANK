import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Tutorial, TutorialProgress, TutorialSettings } from './TutorialOverlay';

interface TutorialContextType {
  // Tutorial data
  tutorials: Tutorial[];
  activeTutorials: Tutorial[];
  recommendations: Tutorial[];
  currentTutorial: Tutorial | null;
  tutorialProgress: TutorialProgress[];
  settings: TutorialSettings | null;
  
  // Loading states
  isLoadingTutorials: boolean;
  isLoadingProgress: boolean;
  isLoadingSettings: boolean;
  
  // Actions
  startTutorial: (tutorialId: string) => Promise<void>;
  completeTutorial: (tutorialId: string, totalTimeSpent?: number) => Promise<void>;
  completeStep: (tutorialId: string, stepNumber: number, timeSpent?: number) => Promise<void>;
  skipTutorial: (tutorialId: string) => Promise<void>;
  updateSettings: (updates: Partial<TutorialSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  
  // UI State
  showTutorial: (tutorial: Tutorial) => void;
  hideTutorial: () => void;
  isTutorialVisible: boolean;
  
  // Utility functions
  getTutorialProgress: (tutorialId: string) => TutorialProgress | undefined;
  shouldShowTutorial: (tutorialId: string) => boolean;
}

interface TutorialSettings {
  id?: string;
  userId: string;
  autoStartTutorials: boolean;
  showTooltips: boolean;
  tutorialSpeed: 'slow' | 'normal' | 'fast';
  preferredPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
  disabledCategories: string[];
  notificationPreferences: {
    completion_rewards: boolean;
    progress_reminders: boolean;
    new_tutorials: boolean;
  };
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  completedTutorialCount: number;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [isTutorialVisible, setIsTutorialVisible] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch active tutorials
  const { data: activeTutorials = [], isLoading: isLoadingTutorials } = useQuery({
    queryKey: ['/api/tutorials'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch all tutorials (for admin/management)
  const { data: allTutorials = [] } = useQuery({
    queryKey: ['/api/tutorials/all'],
    enabled: false, // Only fetch when explicitly needed
  });

  // Fetch tutorial recommendations
  const { data: recommendations = [] } = useQuery({
    queryKey: ['/api/tutorials/recommendations'],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch user's tutorial progress
  const { data: tutorialProgress = [], isLoading: isLoadingProgress } = useQuery({
    queryKey: ['/api/tutorials/progress/my'],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch user's tutorial settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['/api/tutorials/settings/my'],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Start tutorial mutation
  const startTutorialMutation = useMutation({
    mutationFn: async (tutorialId: string) => {
      return apiRequest(`/api/tutorials/${tutorialId}/start`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/progress/my'] });
    },
  });

  // Complete tutorial mutation
  const completeTutorialMutation = useMutation({
    mutationFn: async ({ tutorialId, totalTimeSpent }: { tutorialId: string; totalTimeSpent?: number }) => {
      return apiRequest(`/api/tutorials/${tutorialId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ totalTimeSpent }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/progress/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/settings/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/recommendations'] });
    },
  });

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async ({ tutorialId, stepNumber, timeSpent }: { tutorialId: string; stepNumber: number; timeSpent?: number }) => {
      return apiRequest(`/api/tutorials/${tutorialId}/complete-step`, {
        method: 'POST',
        body: JSON.stringify({ stepNumber, timeSpent }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/progress/my'] });
    },
  });

  // Skip tutorial mutation
  const skipTutorialMutation = useMutation({
    mutationFn: async (tutorialId: string) => {
      return apiRequest(`/api/tutorials/${tutorialId}/skip`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/progress/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/recommendations'] });
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<TutorialSettings>) => {
      return apiRequest('/api/tutorials/settings/my', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/settings/my'] });
    },
  });

  // Reset settings mutation
  const resetSettingsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/tutorials/settings/reset', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/settings/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tutorials/recommendations'] });
    },
  });

  // Auto-start tutorials based on settings and conditions
  useEffect(() => {
    if (settings?.autoStartTutorials && recommendations.length > 0 && !currentTutorial) {
      const shouldAutoStart = recommendations.find(tutorial => {
        return shouldShowTutorial(tutorial.id);
      });
      
      if (shouldAutoStart) {
        setCurrentTutorial(shouldAutoStart);
        setIsTutorialVisible(true);
        startTutorialMutation.mutate(shouldAutoStart.id);
      }
    }
  }, [settings, recommendations, currentTutorial]);

  const getTutorialProgress = (tutorialId: string): TutorialProgress | undefined => {
    return tutorialProgress.find(p => p.tutorialId === tutorialId);
  };

  const shouldShowTutorial = (tutorialId: string): boolean => {
    const progress = getTutorialProgress(tutorialId);
    
    // Don't show if already completed or skipped
    if (progress && (progress.status === 'completed' || progress.status === 'skipped')) {
      return false;
    }
    
    // Check if category is disabled
    const tutorial = activeTutorials.find(t => t.id === tutorialId);
    if (tutorial && settings?.disabledCategories?.includes(tutorial.category)) {
      return false;
    }
    
    return true;
  };

  const showTutorial = (tutorial: Tutorial) => {
    setCurrentTutorial(tutorial);
    setIsTutorialVisible(true);
    if (!getTutorialProgress(tutorial.id)) {
      startTutorialMutation.mutate(tutorial.id);
    }
  };

  const hideTutorial = () => {
    setIsTutorialVisible(false);
    setCurrentTutorial(null);
  };

  const startTutorial = async (tutorialId: string) => {
    const tutorial = activeTutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      showTutorial(tutorial);
      await startTutorialMutation.mutateAsync(tutorialId);
    }
  };

  const completeTutorial = async (tutorialId: string, totalTimeSpent?: number) => {
    await completeTutorialMutation.mutateAsync({ tutorialId, totalTimeSpent });
    hideTutorial();
  };

  const completeStep = async (tutorialId: string, stepNumber: number, timeSpent?: number) => {
    await completeStepMutation.mutateAsync({ tutorialId, stepNumber, timeSpent });
  };

  const skipTutorial = async (tutorialId: string) => {
    await skipTutorialMutation.mutateAsync(tutorialId);
    hideTutorial();
  };

  const updateSettings = async (updates: Partial<TutorialSettings>) => {
    await updateSettingsMutation.mutateAsync(updates);
  };

  const resetSettings = async () => {
    await resetSettingsMutation.mutateAsync();
  };

  const value: TutorialContextType = {
    // Tutorial data
    tutorials: allTutorials,
    activeTutorials,
    recommendations,
    currentTutorial,
    tutorialProgress,
    settings: settings || null,
    
    // Loading states
    isLoadingTutorials,
    isLoadingProgress,
    isLoadingSettings,
    
    // Actions
    startTutorial,
    completeTutorial,
    completeStep,
    skipTutorial,
    updateSettings,
    resetSettings,
    
    // UI State
    showTutorial,
    hideTutorial,
    isTutorialVisible,
    
    // Utility functions
    getTutorialProgress,
    shouldShowTutorial,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export default TutorialProvider;