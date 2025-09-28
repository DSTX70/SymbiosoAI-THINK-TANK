import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { OnboardingFlow, OnboardingProgress } from "@shared/schema";

// Predefined onboarding flows
const ONBOARDING_FLOWS: OnboardingFlow[] = [
  {
    id: "welcome_beginner",
    name: "Welcome Tour",
    description: "Get started with SymbiosoAi ThinkTank",
    target_role: "beginner",
    trigger_conditions: ["first_visit", "no_sessions"],
    steps: [
      {
        id: "welcome",
        title: "Welcome to SymbiosoAi ThinkTank!",
        description: "Let's take a quick tour to get you started with AI-powered collaborative debates.",
        target: "[data-testid='header-logo']",
        position: "bottom",
        type: "tooltip"
      },
      {
        id: "modes",
        title: "Choose Your Mode",
        description: "Start with Simple mode for quick analysis, or try Guided mode for more options.",
        target: "[data-testid='nav-simple']",
        position: "bottom", 
        type: "highlight"
      },
      {
        id: "prompt",
        title: "Ask Your Question",
        description: "Type any question or challenge you'd like our AI agents to analyze together.",
        target: "[data-testid='input-prompt']",
        position: "top",
        type: "tooltip"
      },
      {
        id: "start_analysis",
        title: "Start Your First Analysis",
        description: "Click here to begin the AI debate and see multiple perspectives on your topic.",
        target: "[data-testid='button-start-analysis']",
        position: "top",
        type: "tooltip",
        action: "[data-testid='button-start-analysis']"
      }
    ],
    completion_criteria: ["clicked_start_analysis", "viewed_results"]
  },
  {
    id: "guided_features",
    name: "Guided Mode Features",
    description: "Explore advanced configuration options",
    target_role: "intermediate",
    trigger_conditions: ["visited_guided", "has_sessions"],
    steps: [
      {
        id: "agent_selection",
        title: "Agent Selection",
        description: "Choose which AI personalities participate in your debate for different perspectives.",
        target: "[data-testid='agent-selection']",
        position: "right",
        type: "tooltip"
      },
      {
        id: "debate_settings",
        title: "Debate Configuration",
        description: "Adjust the number of rounds and debate style to match your needs.",
        target: "[data-testid='debate-settings']",
        position: "left",
        type: "tooltip"
      },
      {
        id: "brainstorm_feature",
        title: "Brainstorming Mode",
        description: "After debate completion, transform results into collaborative solution generation.",
        target: "[data-testid='button-start-brainstorming']",
        position: "top",
        type: "highlight"
      }
    ],
    completion_criteria: ["configured_agents", "started_brainstorm"]
  },
  {
    id: "expert_advanced",
    name: "Expert Mode Mastery",
    description: "Master advanced AI capabilities and enterprise features",
    target_role: "expert",
    trigger_conditions: ["visited_expert", "power_user"],
    steps: [
      {
        id: "ai_capabilities",
        title: "AI Capabilities",
        description: "Configure deep analysis, custom thinking patterns, and specialized experts.",
        target: "[data-testid='tab-ai-capabilities']",
        position: "bottom",
        type: "tooltip"
      },
      {
        id: "templates",
        title: "Template Library",
        description: "Use pre-built templates or create your own for consistent analysis workflows.",
        target: "[data-testid='tab-templates']",
        position: "bottom",
        type: "tooltip"
      },
      {
        id: "workspace",
        title: "Workspace Collaboration",
        description: "Set up team workspaces for real-time collaboration and session sharing.",
        target: "[data-testid='tab-workspace']",
        position: "bottom",
        type: "tooltip"
      }
    ],
    completion_criteria: ["used_template", "created_workspace"]
  },
  {
    id: "three_phase_workflow",
    name: "Complete Workflow",
    description: "Master the Debate → Brainstorm → Report workflow",
    target_role: "all",
    trigger_conditions: ["completed_debate", "new_to_workflow"],
    steps: [
      {
        id: "debate_complete",
        title: "Debate Complete!",
        description: "Great! Now let's turn these insights into actionable solutions.",
        target: "[data-testid='button-start-brainstorming']",
        position: "top",
        type: "highlight"
      },
      {
        id: "brainstorm_phase",
        title: "Brainstorming Phase",
        description: "Generate creative solutions based on the debate insights.",
        target: "[data-testid='brainstorm-section']",
        position: "right",
        type: "tooltip"
      },
      {
        id: "report_generation",
        title: "Professional Reports",
        description: "Create executive summaries or detailed reports with citations.",
        target: "[data-testid='button-generate-report']",
        position: "top",
        type: "tooltip"
      }
    ],
    completion_criteria: ["completed_brainstorm", "generated_report"]
  }
];

export function useOnboarding() {
  const [isActive, setIsActive] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<OnboardingFlow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const queryClient = useQueryClient();

  // Get user's onboarding progress
  const { data: progress } = useQuery<OnboardingProgress>({
    queryKey: ["/api/user/onboarding-progress"],
    retry: false
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (newProgress: Partial<OnboardingProgress>) => {
      const response = await fetch("/api/user/onboarding-progress", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProgress),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update onboarding progress");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/onboarding-progress"] });
    }
  });

  // Get applicable flows based on user state
  const getApplicableFlows = useCallback((userProgress: OnboardingProgress, context: Record<string, boolean> = {}) => {
    return ONBOARDING_FLOWS.filter(flow => {
      // Check if flow was already skipped
      if (userProgress.skipped_flows?.includes(flow.id)) return false;
      
      // Check if flow steps are already completed
      const allStepsCompleted = flow.steps.every(step => 
        userProgress.completed_steps?.includes(step.id) || false
      );
      if (allStepsCompleted) return false;

      // Check role compatibility
      if (flow.target_role !== "all" && flow.target_role !== userProgress.experience_level) {
        return false;
      }

      // Check trigger conditions
      return flow.trigger_conditions.some(condition => {
        switch (condition) {
          case "first_visit":
            return (userProgress.completed_steps?.length || 0) === 0;
          case "no_sessions":
            return (userProgress.feature_usage?.sessions || 0) === 0;
          case "has_sessions":
            return (userProgress.feature_usage?.sessions || 0) > 0;
          case "visited_guided":
            return context.visited_guided === true;
          case "visited_expert":
            return context.visited_expert === true;
          case "power_user":
            return (userProgress.feature_usage?.expert_mode || 0) > 2;
          case "completed_debate":
            return context.completed_debate === true;
          case "new_to_workflow":
            return (userProgress.feature_usage?.brainstorm || 0) === 0;
          default:
            return false;
        }
      });
    });
  }, []);

  // Start onboarding flow
  const startFlow = useCallback((flowId: string) => {
    const flow = ONBOARDING_FLOWS.find(f => f.id === flowId);
    if (!flow || !progress) return;

    setCurrentFlow(flow);
    setCurrentStepIndex(0);
    setIsActive(true);

    // Update current flow in progress
    updateProgressMutation.mutate({
      current_flow: flowId,
      last_interaction: new Date().toISOString()
    });
  }, [progress, updateProgressMutation]);

  // Trigger onboarding based on context
  const triggerOnboarding = useCallback((context: Record<string, boolean> = {}) => {
    if (!progress || isActive) return;

    const applicableFlows = getApplicableFlows(progress, context);
    if (applicableFlows.length > 0) {
      startFlow(applicableFlows[0].id);
    }
  }, [progress, isActive, getApplicableFlows, startFlow]);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (!currentFlow || !progress) return;

    const currentStep = currentFlow.steps[currentStepIndex];
    
    // Mark current step as completed
    updateProgressMutation.mutate({
      completed_steps: [...progress.completed_steps, currentStep.id],
      last_interaction: new Date().toISOString()
    });

    if (currentStepIndex < currentFlow.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeFlow();
    }
  }, [currentFlow, currentStepIndex, progress, updateProgressMutation]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipFlow = useCallback(() => {
    if (!currentFlow || !progress) return;

    updateProgressMutation.mutate({
      skipped_flows: [...progress.skipped_flows, currentFlow.id],
      current_flow: null,
      last_interaction: new Date().toISOString()
    });

    setIsActive(false);
    setCurrentFlow(null);
    setCurrentStepIndex(0);
  }, [currentFlow, progress, updateProgressMutation]);

  const completeFlow = useCallback(() => {
    if (!currentFlow || !progress) return;

    // Mark all remaining steps as completed
    const allStepIds = currentFlow.steps.map(step => step.id);
    const newCompletedSteps = Array.from(new Set([...progress.completed_steps, ...allStepIds]));

    updateProgressMutation.mutate({
      completed_steps: newCompletedSteps,
      current_flow: null,
      last_interaction: new Date().toISOString()
    });

    setIsActive(false);
    setCurrentFlow(null);
    setCurrentStepIndex(0);
  }, [currentFlow, progress, updateProgressMutation]);

  const dismissOnboarding = useCallback(() => {
    setIsActive(false);
    setCurrentFlow(null);
    setCurrentStepIndex(0);
    
    if (progress) {
      updateProgressMutation.mutate({
        current_flow: null,
        last_interaction: new Date().toISOString()
      });
    }
  }, [progress, updateProgressMutation]);

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string) => {
    if (!progress) return;

    updateProgressMutation.mutate({
      feature_usage: {
        ...progress.feature_usage,
        [feature]: (progress.feature_usage[feature] || 0) + 1
      },
      last_interaction: new Date().toISOString()
    });
  }, [progress, updateProgressMutation]);

  return {
    isActive,
    currentFlow,
    currentStepIndex,
    progress: progress || {
      completed_steps: [],
      current_flow: null,
      experience_level: "beginner" as const,
      skipped_flows: [],
      last_interaction: null,
      feature_usage: {}
    },
    startFlow,
    triggerOnboarding,
    nextStep,
    previousStep,
    skipFlow,
    completeFlow,
    dismissOnboarding,
    trackFeatureUsage,
    availableFlows: ONBOARDING_FLOWS
  };
}