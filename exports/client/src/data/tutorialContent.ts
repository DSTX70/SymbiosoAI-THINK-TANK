import type { InsertTutorial, InsertTutorialStep } from '@shared/schema';

// Tutorial step factory functions for common patterns
const createTooltipStep = (
  stepNumber: number,
  title: string,
  content: string,
  targetElement: string,
  position: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'bottom'
): Omit<InsertTutorialStep, 'tutorialId'> => ({
  stepNumber,
  title,
  content,
  targetElement,
  position,
  stepType: 'tooltip',
  skipAllowed: true,
  autoAdvance: false,
  delayMs: 0
});

const createModalStep = (
  stepNumber: number,
  title: string,
  content: string
): Omit<InsertTutorialStep, 'tutorialId'> => ({
  stepNumber,
  title,
  content,
  stepType: 'modal',
  position: 'center',
  skipAllowed: true,
  autoAdvance: false,
  delayMs: 0
});

const createInteractionStep = (
  stepNumber: number,
  title: string,
  content: string,
  targetElement: string,
  interactionType: 'click' | 'input' | 'scroll' = 'click',
  position: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'bottom'
): Omit<InsertTutorialStep, 'tutorialId'> => ({
  stepNumber,
  title,
  content,
  targetElement,
  position,
  stepType: 'interaction',
  interactionType,
  skipAllowed: false,
  autoAdvance: true,
  delayMs: 500
});

// Sample tutorial content for the SymbiosoAi ThinkTank platform
export const tutorialTemplates: Array<Omit<InsertTutorial, 'id'> & { steps: Array<Omit<InsertTutorialStep, 'tutorialId'>> }> = [
  {
    name: "Getting Started with Simple Mode",
    description: "Learn how to run your first AI debate analysis using Simple Mode for quick insights.",
    category: "onboarding",
    targetFeature: "simple-mode",
    targetUserLevel: "beginner",
    estimatedDuration: 5,
    priority: 1,
    isActive: true,
    steps: [
      createModalStep(
        1,
        "Welcome to SymbiosoAi ThinkTank!",
        "SymbiosoAi ThinkTank uses multiple AI agents to conduct structured debates on any topic you provide. This tutorial will guide you through your first analysis using Simple Mode.\n\nSimple Mode is perfect for quick insights and getting started with AI-powered collaborative intelligence."
      ),
      createTooltipStep(
        2,
        "Navigate to Simple Mode",
        "Click on 'Simple' to start your first AI debate. This mode provides streamlined analysis with minimal configuration required.",
        "[data-testid='simple-link']",
        "bottom"
      ),
      createInteractionStep(
        3,
        "Enter Your Topic",
        "Type your question or topic in the analysis prompt box. For example, try: 'Should remote work be permanent for tech companies?'",
        "[data-testid='input-prompt']",
        "input",
        "top"
      ),
      createInteractionStep(
        4,
        "Start the Analysis",
        "Click 'Start Analysis' to begin the AI debate. The system will automatically assign specialized agents to discuss your topic.",
        "[data-testid='button-submit']",
        "click",
        "top"
      ),
      createTooltipStep(
        5,
        "Watch the Debate Progress",
        "You'll see multiple AI agents (Analyst, Critic, Synthesizer) discussing your topic. Each agent brings a different perspective to create well-rounded insights.",
        "[data-testid='debate-progress']",
        "right"
      ),
      createTooltipStep(
        6,
        "Review Your Results",
        "Once complete, review the consensus, dissenting views, and unresolved questions. You can export the report or start a new analysis.",
        "[data-testid='debate-results']",
        "top"
      )
    ]
  },
  {
    name: "Advanced Configuration with Guided Mode",
    description: "Discover how to customize AI agent selection, debate rounds, and reasoning frameworks in Guided Mode.",
    category: "features",
    targetFeature: "guided-mode",
    targetUserLevel: "intermediate",
    estimatedDuration: 8,
    priority: 2,
    isActive: true,
    steps: [
      createModalStep(
        1,
        "Guided Mode Overview",
        "Guided Mode offers intermediate configuration options, allowing you to customize agent selection, debate parameters, and reasoning frameworks while maintaining ease of use."
      ),
      createTooltipStep(
        2,
        "Access Guided Mode",
        "Click on 'Guided' to access the enhanced configuration interface with more control over your analysis.",
        "[data-testid='guided-link']",
        "bottom"
      ),
      createTooltipStep(
        3,
        "Agent Selection & Configuration",
        "Choose from different AI agent personalities and domain experts. Each agent brings unique perspectives and expertise to your analysis.",
        "[data-testid='agent-selection']",
        "right"
      ),
      createInteractionStep(
        4,
        "Select AI Personalities",
        "Try selecting different agent combinations. For business topics, consider using the Analyst + Pragmatist + Critic combination.",
        "[data-testid='agent-personality-select']",
        "click",
        "bottom"
      ),
      createTooltipStep(
        5,
        "Configure Debate Rounds",
        "Adjust the number of debate rounds (1-10) to control the depth of analysis. More rounds provide deeper insights but take longer.",
        "[data-testid='debate-rounds-slider']",
        "top"
      ),
      createTooltipStep(
        6,
        "Choose Reasoning Framework",
        "Select from frameworks like 'Devil's Advocate' or 'Systems Thinking' to guide how agents approach your topic.",
        "[data-testid='reasoning-framework-select']",
        "bottom"
      ),
      createInteractionStep(
        7,
        "Start Your Enhanced Analysis",
        "Launch your customized debate with your selected configuration. Notice how different agent combinations produce different insights.",
        "[data-testid='button-submit']",
        "click",
        "top"
      )
    ]
  },
  {
    name: "Enterprise Features in Expert Mode",
    description: "Master advanced features like template management, workspace collaboration, and fact-checking in Expert Mode.",
    category: "advanced",
    targetFeature: "expert-mode",
    targetUserLevel: "expert",
    estimatedDuration: 12,
    priority: 3,
    isActive: true,
    steps: [
      createModalStep(
        1,
        "Expert Mode: Full Enterprise Power",
        "Expert Mode provides comprehensive enterprise features including template management, workspace collaboration, interactive fact-checking, and advanced AI configuration options."
      ),
      createTooltipStep(
        2,
        "Navigate to Expert Mode",
        "Access the complete feature set by clicking on 'Expert'. This opens the three-tab enterprise interface.",
        "[data-testid='expert-link']",
        "bottom"
      ),
      createTooltipStep(
        3,
        "Expert Analysis Tab",
        "The Expert Analysis tab provides advanced AI debate configuration with comprehensive agent selection and reasoning frameworks.",
        "[data-testid='expert-analysis-tab']",
        "bottom"
      ),
      createTooltipStep(
        4,
        "Domain Expert Selection",
        "Choose from 18+ specialized domain experts including Legal Analyst, Medical Researcher, Financial Analyst, and more.",
        "[data-testid='domain-experts-section']",
        "right"
      ),
      createInteractionStep(
        5,
        "Explore Template Library",
        "Click on the Template Library tab to access pre-built analysis templates with ratings and categories.",
        "[data-testid='template-library-tab']",
        "click",
        "bottom"
      ),
      createTooltipStep(
        6,
        "Browse Template Categories",
        "Templates are organized by categories: Business, Technology, Education, and Research. Each includes pre-configured agents and frameworks.",
        "[data-testid='template-categories']",
        "top"
      ),
      createTooltipStep(
        7,
        "Use a Template",
        "Select a template that matches your analysis needs. Templates automatically configure agents, frameworks, and parameters.",
        "[data-testid='template-use-button']",
        "bottom"
      ),
      createInteractionStep(
        8,
        "Access Workspace Features",
        "Click on the Workspace tab to explore team collaboration and workspace management features.",
        "[data-testid='workspace-tab']",
        "click",
        "bottom"
      ),
      createTooltipStep(
        9,
        "Workspace Management",
        "Create and manage multiple workspaces, set permissions, and collaborate with team members in real-time.",
        "[data-testid='workspace-management']",
        "right"
      ),
      createTooltipStep(
        10,
        "Interactive Fact-Checking",
        "Click on confidence percentages in debate results to access interactive fact-checking with source verification.",
        "[data-testid='fact-check-confidence']",
        "top"
      ),
      createTooltipStep(
        11,
        "Visual Journey Timeline",
        "Track your analysis progress with the enhanced visual journey timeline showing numbered steps and coverage analysis.",
        "[data-testid='journey-timeline']",
        "right"
      )
    ]
  },
  {
    name: "Authentication and User Profile",
    description: "Learn how to log in, manage your profile, and access personalized features.",
    category: "account",
    targetFeature: "authentication",
    targetUserLevel: "beginner",
    estimatedDuration: 4,
    priority: 1,
    isActive: true,
    steps: [
      createModalStep(
        1,
        "Account Access",
        "SymbiosoAi ThinkTank offers two ways to access the platform: Demo Login for quick access and OAuth Sign In for personalized features."
      ),
      createTooltipStep(
        2,
        "Demo Login Access",
        "For quick access, use the Demo Login with username 'demo' and password 'demo123' to explore all features immediately.",
        "[data-testid='demo-login-button']",
        "bottom"
      ),
      createTooltipStep(
        3,
        "OAuth Sign In",
        "For personalized experience with saved sessions and preferences, use OAuth Sign In with your Replit account.",
        "[data-testid='oauth-signin-button']",
        "bottom"
      ),
      createTooltipStep(
        4,
        "User Profile Menu",
        "Once logged in, access your profile, settings, and sign out options from the user menu in the header.",
        "[data-testid='user-menu']",
        "bottom"
      ),
      createTooltipStep(
        5,
        "Session History",
        "View and access your previous debate sessions from the Sessions link in the header navigation.",
        "[data-testid='sessions-link']",
        "bottom"
      )
    ]
  },
  {
    name: "Understanding AI Debate Results",
    description: "Learn how to interpret consensus findings, dissenting views, and unresolved questions from AI debates.",
    category: "analysis",
    targetFeature: "results-interpretation",
    targetUserLevel: "intermediate",
    estimatedDuration: 6,
    priority: 2,
    isActive: true,
    steps: [
      createModalStep(
        1,
        "Interpreting AI Debate Results",
        "AI debates produce structured outputs with consensus findings, dissenting viewpoints, and unresolved questions. Understanding these components helps you make informed decisions."
      ),
      createTooltipStep(
        2,
        "Consensus Section",
        "The consensus section shows areas where AI agents agree. These represent the strongest, most supported conclusions from the analysis.",
        "[data-testid='consensus-section']",
        "top"
      ),
      createTooltipStep(
        3,
        "Dissenting Views",
        "Dissenting views highlight alternative perspectives and counterarguments. These help you understand potential risks or alternative approaches.",
        "[data-testid='dissenting-views']",
        "top"
      ),
      createTooltipStep(
        4,
        "Unresolved Questions",
        "Questions that remain unresolved indicate areas needing further research or consideration before making final decisions.",
        "[data-testid='unresolved-questions']",
        "top"
      ),
      createTooltipStep(
        5,
        "Confidence Indicators",
        "Look for confidence percentages and reasoning quality indicators to gauge the strength of different conclusions.",
        "[data-testid='confidence-indicators']",
        "bottom"
      ),
      createTooltipStep(
        6,
        "Export and Share",
        "Export your results as reports or share session codes with colleagues for collaborative review and decision-making.",
        "[data-testid='export-buttons']",
        "bottom"
      )
    ]
  },
  {
    name: "Brainstorming and Ideation",
    description: "Discover how to use the brainstorming feature for creative problem-solving and idea generation.",
    category: "features",
    targetFeature: "brainstorming",
    targetUserLevel: "intermediate",
    estimatedDuration: 7,
    priority: 2,
    isActive: true,
    steps: [
      createModalStep(
        1,
        "AI-Powered Brainstorming",
        "The brainstorming feature uses AI agents to generate creative ideas, explore possibilities, and think outside the box on any topic or challenge you provide."
      ),
      createTooltipStep(
        2,
        "Access Brainstorming",
        "Find the brainstorming feature in your navigation or as an option after completing a debate analysis.",
        "[data-testid='brainstorm-button']",
        "bottom"
      ),
      createInteractionStep(
        3,
        "Enter Your Challenge",
        "Describe your brainstorming challenge or creative problem. Be specific about what kind of ideas or solutions you're seeking.",
        "[data-testid='brainstorm-input']",
        "input",
        "top"
      ),
      createTooltipStep(
        4,
        "Choose Brainstorming Style",
        "Select from different brainstorming approaches: Creative, Practical, Innovative, or Comprehensive for varied idea generation styles.",
        "[data-testid='brainstorm-style-select']",
        "bottom"
      ),
      createInteractionStep(
        5,
        "Generate Ideas",
        "Start the brainstorming session and watch as AI agents collaborate to generate diverse, creative solutions to your challenge.",
        "[data-testid='start-brainstorm-button']",
        "click",
        "top"
      ),
      createTooltipStep(
        6,
        "Review Generated Ideas",
        "Explore the generated ideas organized by categories, feasibility, and innovation level. Each idea includes rationale and implementation considerations.",
        "[data-testid='brainstorm-results']",
        "top"
      ),
      createTooltipStep(
        7,
        "Refine and Iterate",
        "Use the refinement tools to develop promising ideas further or generate additional variations based on your favorites.",
        "[data-testid='refine-ideas-section']",
        "bottom"
      )
    ]
  }
];

// Utility function to create tutorial data for database insertion
export const createTutorialWithSteps = (
  template: typeof tutorialTemplates[0]
): { tutorial: Omit<InsertTutorial, 'id'>; steps: Array<Omit<InsertTutorialStep, 'tutorialId'>> } => {
  const { steps, ...tutorialData } = template;
  return {
    tutorial: tutorialData,
    steps: steps
  };
};

// Helper function to get tutorials by category
export const getTutorialsByCategory = (category: string) => {
  return tutorialTemplates.filter(tutorial => tutorial.category === category);
};

// Helper function to get tutorials by target user level
export const getTutorialsByUserLevel = (userLevel: string) => {
  return tutorialTemplates.filter(tutorial => tutorial.targetUserLevel === userLevel);
};

// Helper function to get tutorials by target feature
export const getTutorialsByFeature = (feature: string) => {
  return tutorialTemplates.filter(tutorial => tutorial.targetFeature === feature);
};

// Default tutorial recommendations based on user context
export const getRecommendedTutorials = (userLevel: 'beginner' | 'intermediate' | 'expert' = 'beginner') => {
  const recommendations = {
    beginner: ['Getting Started with Simple Mode', 'Authentication and User Profile'],
    intermediate: ['Advanced Configuration with Guided Mode', 'Understanding AI Debate Results', 'Brainstorming and Ideation'],
    expert: ['Enterprise Features in Expert Mode']
  };
  
  return tutorialTemplates.filter(tutorial => 
    recommendations[userLevel].includes(tutorial.name)
  );
};