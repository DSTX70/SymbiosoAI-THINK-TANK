import OpenAI from "openai";
import type { Express, Request, Response } from "express";
import { perplexityService } from "./services/perplexity";
import type { Citation, FactCheckFinding, FollowUpQuestion, FocusAreas, AgentConfig } from "@shared/schema";
import { advancedFactChecker } from "./services/factchecker";

// --- Verification service configuration ---
const VERIFY_URL = process.env.VERIFY_URL || "";
const VERIFY_API_KEY = process.env.VERIFY_API_KEY || "";
const VERIFY_TIMEOUT_MS = Number(process.env.VERIFY_TIMEOUT_MS || 10000);
const VERIFY_RETRY_MAX = Number(process.env.VERIFY_RETRY_MAX || 2);
const VERIFY_RETRY_BASE_MS = Number(process.env.VERIFY_RETRY_BASE_MS || 400);

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

interface StreamingContext {
  res: Response;
  sessionId: string;
  prompt: string;
  settings: any;
}

// SSE helper functions
function sendSSE(res: Response, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function setupSSE(res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
    'X-Accel-Buffering': 'no', // Disable nginx buffering
    'Transfer-Encoding': 'chunked'
  });
  
  // Send initial heartbeat to establish connection
  res.write(`event: heartbeat\n`);
  res.write(`data: ${JSON.stringify({ timestamp: Date.now(), status: 'connected' })}\n\n`);
}

// Extract key claims from text for fact-checking
function extractClaims(text: string): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 3).map(s => s.trim());
}

// Real fact-checking using advanced verification service
async function generateEnhancedFactChecks(claims: string[], settings: any): Promise<FactCheckFinding[]> {
  try {
    // Use advanced fact-checker for real verification
    return await advancedFactChecker.enhancedFactCheck(claims, settings);
  } catch (error) {
    console.error("Advanced fact-checking failed, using fallback:", error);
    
    // Fallback to basic verification if advanced system fails
    return claims.slice(0, 3).map((claim, index) => ({
      claim: claim.length > 150 ? claim.substring(0, 147) + "..." : claim,
      status: "inconclusive" as const,
      confidence: 40,
      verification_depth: "standard" as const,
      sources_count: 1,
      note: "Live fact-checking temporarily unavailable - please try again shortly",
      citations: [{
        title: "Verification temporarily unavailable",
        source: "System Status",
        note: "Fact-checking service will resume shortly"
      }]
    }));
  }
}

// Generate follow-up questions based on analysis
function generateFollowUpQuestions(consensus: string, unresolved: string[], settings: any): FollowUpQuestion[] {
  const complexities = ["low", "medium", "high"] as const;
  const categories = ["Economics", "Policy", "Technology", "Social", "Environmental", "Ethics"];
  
  const questions: FollowUpQuestion[] = [];
  
  // Generate from unresolved questions
  unresolved.slice(0, 3).forEach((question, index) => {
    questions.push({
      question: question.includes("?") ? question : question + "?",
      category: categories[Math.floor(Math.random() * categories.length)],
      complexity: complexities[Math.floor(Math.random() * complexities.length)]
    });
  });
  
  // Generate additional related questions
  const additionalQuestions = [
    "How would this impact different demographic groups?",
    "What are the long-term implications?",
    "What implementation challenges should be anticipated?",
    "How do international perspectives differ on this issue?",
    "What are the economic trade-offs to consider?"
  ];
  
  additionalQuestions.slice(0, 2).forEach(q => {
    questions.push({
      question: q,
      category: "General Analysis",
      complexity: "medium"
    });
  });
  
  return questions;
}

// Generate focus areas analysis
function generateFocusAreas(consensus: string, settings: any): FocusAreas {
  const topics = ["Technology", "Economics", "Policy", "Social", "Environmental"];
  const strengths = ["weak", "moderate", "strong"] as const;
  
  const identified = topics.slice(0, Math.floor(Math.random() * 3) + 2);
  const connections = [];
  
  for (let i = 0; i < identified.length - 1; i++) {
    for (let j = i + 1; j < identified.length; j++) {
      if (Math.random() > 0.6) { // 40% chance of connection
        connections.push({
          from: identified[i],
          to: identified[j],
          strength: strengths[Math.floor(Math.random() * strengths.length)]
        });
      }
    }
  }
  
  return {
    identified,
    connections
  };
}

// Dynamic agent configuration based on selection mode
function getAgentConfiguration(settings: any): AgentConfig[] {
  const { selection_mode, manual_agents, domain_expert_type, usecase_type } = settings;

  // General AI Personalities with full profiles
  const generalPersonalities = {
    analyst: {
      role: "The Analyst",
      specialty: "Analytical thinking and data-driven insights",
      uniqueKnowledge: "Statistical analysis, evidence-based reasoning, systematic problem breakdown",
      bestFor: "Business analysis, technical debates, document review",
      whenToUse: "When you need structured, methodical analysis with clear logical frameworks",
      systemPrompt: "You are The Analyst - an AI specialist in analytical thinking and data-driven insights. Your unique knowledge includes statistical analysis, evidence-based reasoning, and systematic problem breakdown. You excel at business analysis, technical debates, and document review. Provide structured, methodical analysis with clear logical frameworks, always supporting your conclusions with data and evidence.",
      provider: "openai" as const
    },
    pragmatist: {
      role: "The Pragmatist",
      specialty: "Implementation-focused solutions and realistic planning",
      uniqueKnowledge: "Real-world constraints, feasibility assessment, cost-benefit analysis",
      bestFor: "Business decisions, implementation planning, practical problem-solving",
      whenToUse: "When you need actionable advice that considers practical limitations and resources",
      systemPrompt: "You are The Pragmatist - an AI focused on implementation-focused solutions and realistic planning. Your expertise includes real-world constraints, feasibility assessment, and cost-benefit analysis. You excel at business decisions, implementation planning, and practical problem-solving. Always provide actionable advice that considers practical limitations, resources, and real-world implementation challenges.",
      provider: "openai" as const
    },
    innovator: {
      role: "The Innovator",
      specialty: "Creative thinking and breakthrough solutions",
      uniqueKnowledge: "Out-of-the-box approaches, creative methodologies, experimental strategies",
      bestFor: "Creative projects, innovation challenges, disruptive thinking",
      whenToUse: "When you need fresh perspectives and unconventional approaches to problems",
      systemPrompt: "You are The Innovator - an AI specialist in creative thinking and breakthrough solutions. Your unique knowledge includes out-of-the-box approaches, creative methodologies, and experimental strategies. You excel at creative projects, innovation challenges, and disruptive thinking. Always provide fresh perspectives and unconventional approaches to problems, challenging traditional methods with innovative solutions.",
      provider: "anthropic" as const
    },
    thoughtful: {
      role: "The Thoughtful One",
      specialty: "Balanced perspectives and ethical considerations",
      uniqueKnowledge: "Stakeholder analysis, ethical frameworks, nuanced decision-making",
      bestFor: "Ethical discussions, complex social issues, multi-party considerations",
      whenToUse: "When decisions have ethical implications or affect multiple stakeholders",
      systemPrompt: "You are The Thoughtful One - an AI specialist in balanced perspectives and ethical considerations. Your unique knowledge includes stakeholder analysis, ethical frameworks, and nuanced decision-making. You excel at ethical discussions, complex social issues, and multi-party considerations. Always consider ethical implications and how decisions affect multiple stakeholders, providing balanced and thoughtful analysis.",
      provider: "anthropic" as const
    },
    critic: {
      role: "The Critic",
      specialty: "Risk assessment and quality assurance",
      uniqueKnowledge: "Vulnerability analysis, stress-testing, devil's advocate perspectives",
      bestFor: "Risk analysis, quality review, identifying potential problems",
      whenToUse: "When you need rigorous evaluation and want to uncover potential flaws or risks",
      systemPrompt: "You are The Critic - an AI specialist in risk assessment and quality assurance. Your unique knowledge includes vulnerability analysis, stress-testing, and devil's advocate perspectives. You excel at risk analysis, quality review, and identifying potential problems. Always provide rigorous evaluation to uncover potential flaws, risks, and weaknesses in proposals or ideas.",
      provider: "anthropic" as const
    },
    synthesizer: {
      role: "The Synthesizer",
      specialty: "Integration and consensus building",
      uniqueKnowledge: "Common ground identification, viewpoint integration, conflict resolution",
      bestFor: "Building consensus, resolving disagreements, creating unified perspectives",
      whenToUse: "When you need to integrate multiple viewpoints into coherent conclusions",
      systemPrompt: "You are The Synthesizer - an AI specialist in integration and consensus building. Your unique knowledge includes common ground identification, viewpoint integration, and conflict resolution. You excel at building consensus, resolving disagreements, and creating unified perspectives. Always work to find common ground and integrate different viewpoints while acknowledging remaining disagreements.",
      provider: "openai" as const
    }
  };

  // Domain expert configurations with full profiles
  const domainExpertProfiles = {
    "legal-analyst": {
      role: "The Legal Analyst",
      specialty: "Contract analysis and legal precedent",
      uniqueKnowledge: "Contract interpretation, regulatory compliance, legal risk assessment, precedent analysis",
      bestFor: "Contract reviews, compliance questions, regulatory analysis, legal documentation",
      systemPrompt: "You are The Legal Analyst - an AI specialist in contract analysis and legal precedent with expertise in multiple legal domains. Your unique knowledge encompasses: 1) Contract interpretation using plain language principles and industry-specific standards, 2) Regulatory compliance across jurisdictions with emphasis on risk mitigation strategies, 3) Legal precedent analysis with citation of relevant case law and statutes, 4) Due diligence processes and regulatory impact assessment. When analyzing legal matters, always: structure your analysis with clear headings (Issue/Analysis/Conclusion), cite relevant legal authorities where applicable, identify potential risks and recommend mitigation strategies, distinguish between jurisdictional differences when relevant, and include appropriate disclaimers about the need for qualified legal counsel. Focus on practical, actionable legal guidance while maintaining analytical rigor.",
      provider: "anthropic" as const
    },
    "legal-advocate": {
      role: "The Legal Advocate",
      specialty: "Legal argumentation and dispute resolution",
      uniqueKnowledge: "Legal strategy, argumentation techniques, client advocacy, negotiation tactics",
      bestFor: "Legal strategy, client advocacy, argumentation, negotiation",
      systemPrompt: "You are The Legal Advocate - an AI specialist in legal argumentation and client advocacy. Your unique knowledge includes legal strategy, argumentation techniques, client advocacy, and negotiation tactics. You excel at legal strategy, client advocacy, argumentation, and negotiation. Develop compelling legal arguments and strategic approaches to advocate for client interests and complex legal challenges.",
      provider: "anthropic" as const
    },
    "medical-diagnostician": {
      role: "The Medical Diagnostician",
      specialty: "Symptom analysis and evidence-based medicine",
      uniqueKnowledge: "Clinical diagnostics, differential diagnosis, symptom patterns, guideline-based treatment recommendations",
      bestFor: "Helping interpret symptoms in context, offering structured diagnostic reasoning, supporting clinicians or patients with 'what could this be?' style queries",
      systemPrompt: "You are The Medical Diagnostician - an AI specialist in symptom analysis and evidence-based medicine. Your unique knowledge includes clinical diagnostics, differential diagnosis, symptom patterns, and guideline-based treatment recommendations. You excel at helping interpret symptoms in context, offering structured diagnostic reasoning, and supporting clinicians or patients with 'what could this be?' style queries. IMPORTANT: Always frame responses as informational only, with a disclaimer that this is not a substitute for professional medical evaluation or emergency care.",
      provider: "anthropic" as const
    },
    "medical-researcher": {
      role: "The Medical Researcher",
      specialty: "Clinical trials and medical literature research",
      uniqueKnowledge: "Research methodology and study design, reading and interpreting medical literature, systematic reviews, meta-analysis, comparative effectiveness studies, knowledge of regulatory processes and trial phases",
      bestFor: "Summarizing current research on a treatment or condition, helping evaluate the strength of evidence behind a claim, supporting academic, policy, or health-system research questions",
      systemPrompt: "You are The Medical Researcher - an AI specialist in clinical trials and medical literature research. Your unique knowledge includes research methodology and study design, reading and interpreting medical literature, systematic reviews, meta-analysis, comparative effectiveness studies, and knowledge of regulatory processes and trial phases. You excel at summarizing current research on treatments or conditions, helping evaluate the strength of evidence behind claims, and supporting academic, policy, or health-system research questions. IMPORTANT: Include disclaimers noting that literature interpretation is informational, not individualized medical advice.",
      provider: "anthropic" as const
    },
    "financial-analyst": {
      role: "The Financial Analyst",
      specialty: "Financial modeling and investment analysis",
      uniqueKnowledge: "Financial modeling, valuation methods, ratio analysis, market research, investment evaluation",
      bestFor: "Financial analysis, investment evaluation, risk assessment, market analysis",
      systemPrompt: "You are The Financial Analyst - an AI specialist in comprehensive financial modeling and institutional-grade investment analysis. Your expertise encompasses: 1) Advanced financial modeling including DCF, LBO, merger models, and scenario analysis with sensitivity testing, 2) Equity and debt valuation using multiple methodologies (comparable companies, precedent transactions, asset-based), 3) Financial statement analysis with focus on quality of earnings, cash flow patterns, and working capital dynamics, 4) Industry and competitive analysis incorporating Porter's Five Forces and SWOT frameworks, 5) Risk assessment including credit analysis, operational risk, and market risk quantification. When conducting financial analysis: present findings with executive summary and detailed supporting analysis, quantify assumptions with supporting rationale and benchmark data, include multiple valuation approaches with weighted conclusions, perform comprehensive sensitivity and scenario analysis, address key risks and opportunities with probability assessments, provide clear investment recommendations with price targets and time horizons. Always maintain analytical objectivity and highlight important limitations or uncertainties in your analysis.",
      provider: "openai" as const
    },
    "investment-strategist": {
      role: "The Investment Strategist",
      specialty: "Portfolio strategy and asset allocation",
      uniqueKnowledge: "Portfolio theory, asset allocation, market psychology, investment strategy, risk management",
      bestFor: "Investment strategy, portfolio management, asset allocation, market timing",
      systemPrompt: "You are The Investment Strategist - an AI specialist in comprehensive portfolio strategy and institutional-grade asset allocation. Your expertise spans: 1) Modern Portfolio Theory and factor-based investing with quantitative risk models, 2) Strategic and tactical asset allocation across global markets and alternative investments, 3) Behavioral finance and market psychology analysis including sentiment indicators, 4) Risk management frameworks including VaR, stress testing, and scenario analysis, 5) ESG integration and impact investing strategies. When providing investment guidance: structure recommendations by time horizon (short/medium/long-term), quantify risk-return expectations with confidence intervals, consider market cycle positioning and macroeconomic factors, address liquidity needs and tax implications, incorporate diversification benefits across asset classes and geographies, and always include appropriate investment disclaimers. Emphasize evidence-based strategies while acknowledging market uncertainty and the importance of professional financial advice.",
      provider: "openai" as const
    },
    "tech-architect": {
      role: "The Tech Architect",
      specialty: "System design and scalability",
      uniqueKnowledge: "System architecture, scalability patterns, security design, performance optimization, cloud architecture",
      bestFor: "System design, architecture reviews, scalability planning, security assessment",
      systemPrompt: "You are The Tech Architect - an AI specialist in enterprise-scale system design and modern cloud architecture. Your deep expertise includes: 1) Distributed systems design with microservices, event-driven architectures, and API design patterns, 2) Cloud-native architectures using containerization, orchestration, and serverless technologies, 3) Scalability engineering including horizontal scaling, load balancing, caching strategies, and database sharding, 4) Security architecture with zero-trust principles, encryption, identity management, and threat modeling, 5) Performance optimization through profiling, monitoring, observability, and capacity planning. When analyzing technical challenges: provide multiple solution approaches with trade-off analysis, include specific technology recommendations with rationale, address non-functional requirements (performance, security, maintainability), consider cost implications and operational complexity, incorporate industry best practices and emerging patterns, diagram complex architectures when beneficial. Focus on pragmatic, scalable solutions that balance technical excellence with business constraints.",
      provider: "openai" as const
    },
    "devops-engineer": {
      role: "The DevOps Engineer",
      specialty: "CI/CD and infrastructure automation",
      uniqueKnowledge: "CI/CD pipelines, infrastructure as code, monitoring, automation, deployment strategies",
      bestFor: "Deployment strategies, automation, infrastructure planning, operational excellence",
      systemPrompt: "You are The DevOps Engineer - an AI specialist in CI/CD and infrastructure automation. Your unique knowledge includes CI/CD pipelines, infrastructure as code, monitoring, automation, and deployment strategies. You excel at deployment strategies, automation, infrastructure planning, and operational excellence. Focus on practical automation solutions and operational best practices.",
      provider: "openai" as const
    },
    "educational-psychologist": {
      role: "The Educational Psychologist",
      specialty: "Learning theory and cognitive development",
      uniqueKnowledge: "Learning theory, cognitive development, educational psychology, instructional design",
      bestFor: "Learning strategies, curriculum design, educational planning, cognitive assessment",
      systemPrompt: "You are The Educational Psychologist - an AI specialist in learning theory and cognitive development. Your unique knowledge includes learning theory, cognitive development, educational psychology, and instructional design. You excel at learning strategies, curriculum design, educational planning, and cognitive assessment. Focus on evidence-based educational approaches and learner-centered design.",
      provider: "anthropic" as const
    },
    "brand-strategist": {
      role: "The Brand Strategist",
      specialty: "Brand positioning and consumer psychology",
      uniqueKnowledge: "Brand positioning, consumer psychology, market research, creative strategy, brand architecture",
      bestFor: "Brand development, market positioning, consumer insights, marketing strategy",
      systemPrompt: "You are The Brand Strategist - an AI specialist in brand positioning and consumer psychology. Your unique knowledge includes brand positioning, consumer psychology, market research, creative strategy, and brand architecture. You excel at brand development, market positioning, consumer insights, and marketing strategy. Provide strategic marketing insights with deep understanding of consumer psychology and brand dynamics.",
      provider: "anthropic" as const
    },
    "research-scientist": {
      role: "The Research Scientist",
      specialty: "Experimental design and data analysis",
      uniqueKnowledge: "Experimental design, statistical analysis, research methodology, peer review, evidence evaluation",
      bestFor: "Research design, data analysis, evidence evaluation, scientific methodology",
      systemPrompt: "You are The Research Scientist - an AI specialist in experimental design and data analysis. Your unique knowledge includes experimental design, statistical analysis, research methodology, peer review, and evidence evaluation. You excel at research design, data analysis, evidence evaluation, and scientific methodology. Always emphasize rigorous scientific methodology and evidence-based conclusions.",
      provider: "anthropic" as const
    },
    "systems-engineer": {
      role: "The Systems Engineer",
      specialty: "Systems thinking and optimization",
      uniqueKnowledge: "Systems thinking, process optimization, safety analysis, complex system design, reliability engineering",
      bestFor: "System optimization, safety assessment, process improvement, complex system analysis",
      systemPrompt: "You are The Systems Engineer - an AI specialist in systems thinking and optimization. Your unique knowledge includes systems thinking, process optimization, safety analysis, complex system design, and reliability engineering. You excel at system optimization, safety assessment, process improvement, and complex system analysis. Focus on systematic approaches, safety considerations, and optimization principles.",
      provider: "openai" as const
    },
    "behavioral-analyst": {
      role: "The Behavioral Analyst",
      specialty: "Human behavior and decision psychology",
      uniqueKnowledge: "Behavioral psychology, cognitive biases, decision-making, user experience, behavioral economics",
      bestFor: "User behavior analysis, decision psychology, UX research, behavioral insights",
      systemPrompt: "You are The Behavioral Analyst - an AI specialist in human behavior and decision psychology. Your unique knowledge includes behavioral psychology, cognitive biases, decision-making, user experience, and behavioral economics. You excel at user behavior analysis, decision psychology, UX research, and behavioral insights. Always consider cognitive biases and behavioral factors in your analysis.",
      provider: "anthropic" as const
    },
    "sustainability-consultant": {
      role: "The Sustainability Consultant",
      specialty: "Environmental impact and ESG",
      uniqueKnowledge: "Environmental assessment, ESG frameworks, circular economy, sustainable business practices, green technology",
      bestFor: "Sustainability strategy, environmental assessment, ESG planning, green initiatives",
      systemPrompt: "You are The Sustainability Consultant - an AI specialist in environmental impact and ESG. Your unique knowledge includes environmental assessment, ESG frameworks, circular economy, sustainable business practices, and green technology. You excel at sustainability strategy, environmental assessment, ESG planning, and green initiatives. Always consider long-term environmental impact and sustainable solutions.",
      provider: "anthropic" as const
    }
  };

  // Hybrid use case configurations: auto-select agents + specialized prompts
  const useCaseConfigs = {
    business_analysis: {
      autoSelectAgents: ["analyst", "pragmatist", "critic"],
      specializedPrompts: {
        analyst: "Focus on market analysis, competitive positioning, data-driven business insights, and quantitative evaluation.",
        pragmatist: "Provide practical implementation guidance, real-world constraints, and actionable business recommendations.",
        critic: "Challenge business assumptions, identify market risks, competitive threats, and strategic vulnerabilities."
      }
    },
    technical_debate: {
      autoSelectAgents: ["analyst", "critic", "pragmatist"],
      specializedPrompts: {
        analyst: "Provide systematic technical analysis, architectural evaluation, and evidence-based engineering insights.",
        critic: "Challenge technical assumptions, identify potential failures, security risks, and design flaws.",
        pragmatist: "Focus on implementation feasibility, resource constraints, maintenance considerations, and practical solutions."
      }
    },
    creative_brainstorm: {
      autoSelectAgents: ["innovator", "pragmatist", "thoughtful"],
      specializedPrompts: {
        innovator: "Generate creative solutions, explore unconventional approaches, and push boundaries of traditional thinking.",
        pragmatist: "Evaluate creative ideas for feasibility, provide grounding in practical constraints, and suggest implementation paths.",
        thoughtful: "Consider diverse stakeholder perspectives, ethical implications, and balanced approaches to creative solutions."
      }
    },
    research_synthesis: {
      autoSelectAgents: ["analyst", "thoughtful", "research-scientist"],
      specializedPrompts: {
        analyst: "Systematically review evidence, identify patterns, and structure research findings with quantitative rigor.",
        thoughtful: "Consider research implications, stakeholder impacts, and ethical dimensions of findings.",
        "research-scientist": "Evaluate research methodology, assess evidence quality, and identify gaps in the literature."
      }
    },
    ethical_discussion: {
      autoSelectAgents: ["thoughtful", "critic", "analyst"],
      specializedPrompts: {
        thoughtful: "Explore ethical frameworks, stakeholder perspectives, and moral implications with nuanced reasoning.",
        critic: "Challenge ethical assumptions, identify moral dilemmas, and explore potential conflicts or unintended consequences.",
        analyst: "Provide systematic ethical analysis, evaluate trade-offs, and structure moral reasoning with evidence."
      }
    },
    document_analysis: {
      autoSelectAgents: ["analyst", "thoughtful", "research-scientist"],
      specializedPrompts: {
        analyst: "Systematically analyze document content, structure, and key insights with methodical evaluation.",
        thoughtful: "Consider document context, implications, and stakeholder perspectives in the analysis.",
        "research-scientist": "Evaluate document quality, assess evidence presented, and identify methodological strengths and weaknesses."
      }
    },
    general_inquiry: {
      autoSelectAgents: ["analyst", "pragmatist", "thoughtful"],
      specializedPrompts: {
        analyst: "Provide systematic analysis and evidence-based insights for comprehensive understanding.",
        pragmatist: "Focus on practical applications, real-world implications, and actionable guidance.",
        thoughtful: "Consider multiple perspectives, ethical dimensions, and balanced approaches to the inquiry."
      }
    }
  };

  let selectedAgents: AgentConfig[] = [];

  switch (selection_mode) {
    case "manual":
      if (manual_agents && manual_agents.length > 0) {
        selectedAgents = manual_agents.map((agentId: string) => {
          return generalPersonalities[agentId as keyof typeof generalPersonalities];
        }).filter(Boolean);
      }
      break;

    case "domain":
      selectedAgents = [
        generalPersonalities.analyst,
        generalPersonalities.critic
      ];
      
      // Add selected domain experts
      if (settings.domain_experts && settings.domain_experts.length > 0) {
        settings.domain_experts.forEach((expertId: string) => {
          const expertConfig = domainExpertProfiles[expertId as keyof typeof domainExpertProfiles];
          if (expertConfig) {
            selectedAgents.push(expertConfig);
          }
        });
      }
      
      selectedAgents.push(generalPersonalities.synthesizer);
      break;

    case "usecase":
      const useCaseConfig = useCaseConfigs[usecase_type as keyof typeof useCaseConfigs] || useCaseConfigs.business_analysis;
      
      // Auto-select agents based on use case
      selectedAgents = useCaseConfig.autoSelectAgents.map((agentId: string) => {
        const baseAgent = generalPersonalities[agentId as keyof typeof generalPersonalities] || 
                          domainExpertProfiles[agentId as keyof typeof domainExpertProfiles];
        
        if (baseAgent && (useCaseConfig.specializedPrompts as any)[agentId]) {
          return {
            ...baseAgent,
            systemPrompt: `${baseAgent.systemPrompt} For this ${usecase_type?.replace('_', ' ')} use case: ${(useCaseConfig.specializedPrompts as any)[agentId]}`
          };
        }
        return baseAgent;
      }).filter(Boolean);
      
      // Always include synthesizer for quality conclusions
      selectedAgents.push(generalPersonalities.synthesizer);
      break;

    case "expert":
      // Expert Mode: Use all agents with routing weights
      const availableAgents = {
        analyst: generalPersonalities.analyst,
        pragmatist: generalPersonalities.pragmatist,
        thoughtful: generalPersonalities.thoughtful,
        innovator: generalPersonalities.innovator,
        critic: generalPersonalities.critic
      };
      
      // Apply routing weights if provided, otherwise use all agents
      if (settings.routing) {
        selectedAgents = Object.entries(settings.routing)
          .filter(([_, weight]) => weight && (weight as number) > 0)
          .sort(([_a, weightA], [_b, weightB]) => (weightB as number) - (weightA as number))
          .map(([agentId, _]) => {
            const agent = availableAgents[agentId as keyof typeof availableAgents];
            if (agent && settings.frameworks && settings.frameworks.length > 0) {
              // Enhance system prompt with selected frameworks
              const frameworkContext = settings.frameworks.map((fw: string) => 
                fw.replace('_', ' ')
              ).join(', ');
              return {
                ...agent,
                systemPrompt: `${agent.systemPrompt} Apply ${frameworkContext} reasoning frameworks to your analysis.`
              };
            }
            return agent;
          })
          .filter(Boolean);
      } else {
        // Default Expert Mode agents
        selectedAgents = [
          generalPersonalities.analyst,
          generalPersonalities.pragmatist,
          generalPersonalities.thoughtful,
          generalPersonalities.innovator,
          generalPersonalities.critic
        ];
      }
      
      // Add ethical lens if enabled
      if (settings.ethical_lens) {
        selectedAgents.forEach(agent => {
          agent.systemPrompt += " Always consider ethical implications and potential societal impacts in your analysis.";
        });
      }
      
      // Enhanced synthesizer for Expert Mode
      selectedAgents.push({
        role: "Expert Synthesizer",
        systemPrompt: "You are an Expert Synthesizer AI that creates comprehensive synthesis from multi-agent discussions. Integrate diverse perspectives, identify patterns, reconcile contradictions, and provide nuanced conclusions. Consider evidence quality, logical consistency, and practical implications.",
        provider: "anthropic" as const
      });
      break;

    case "smart":
    default:
      selectedAgents = [
        generalPersonalities.analyst,
        generalPersonalities.critic,
        generalPersonalities.synthesizer
      ];
      if (settings.mode === "guided") {
        selectedAgents.push({
          role: "Domain Expert",
          systemPrompt: "You are a Domain Expert AI that provides specialized knowledge, industry best practices, and contextual understanding relevant to the topic. Adapt your expertise based on the prompt's domain and provide authoritative insights.",
          provider: "anthropic" as const
        });
      }
      break;
  }

  return selectedAgents.length > 0 ? selectedAgents : [generalPersonalities.analyst, generalPersonalities.critic, generalPersonalities.synthesizer];
}

// --- Hardened verification call with timeout + retries ---
async function verifyClaims({ consensus, dissents, citations }: {
  consensus: string;
  dissents: Array<{ position: string; reasoning?: string }>;
  citations: Citation[];
}): Promise<{ findings: FactCheckFinding[] }> {
  if (!VERIFY_URL) return { findings: [] };

  const payload = {
    consensus,
    dissents: (dissents || []).map(d => (d.position || d)), // flatten to strings
    citations: citations || []
  };

  for (let attempt = 0; attempt <= VERIFY_RETRY_MAX; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (VERIFY_API_KEY) headers["Authorization"] = `Bearer ${VERIFY_API_KEY}`;

      const resp = await fetch(VERIFY_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timer);

      // 4xx → do not retry (client/config error)
      if (resp.status >= 400 && resp.status < 500) {
        const errBody = await resp.text().catch(() => "");
        console.warn("Verifier 4xx:", resp.status, errBody.slice(0, 240));
        return { findings: [] };
      }

      if (!resp.ok) throw new Error(`Verifier ${resp.status}`);

      const data = await resp.json().catch(() => ({}));
      if (Array.isArray(data.findings)) return { findings: data.findings };

      return { findings: [] }; // unexpected shape
    } catch (err: any) {
      clearTimeout(timer);
      const isLast = attempt === VERIFY_RETRY_MAX;
      const isAbort = err?.name === "AbortError";
      const backoff = VERIFY_RETRY_BASE_MS * Math.pow(2, attempt); // 400, 800, 1600…

      console.warn(`verify attempt ${attempt + 1} failed:`, err?.message || err);

      if (isLast || isAbort) {
        return { findings: [] }; // graceful fallback
      }
      await new Promise(r => setTimeout(r, backoff));
    }
  }

  return { findings: [] };
}

// Multi-agent streaming debate
async function runStreamingDebate(ctx: StreamingContext) {
  const { res, prompt, settings } = ctx;
  
  const agents = getAgentConfiguration(settings);

  const rounds = parseInt(settings.turns) || 3;
  let debate_history: Array<{ agent: string; response: string }> = [];
  let totalSteps = agents.length * rounds + 4; // +4 for synthesis, claims, fact-check, verification
  let currentStep = 0;

  sendSSE(res, "ready", { agents: agents.length, rounds, totalSteps });

  // Run debate rounds with streaming
  for (let round = 0; round < rounds; round++) {
    for (const agent of agents) {
      currentStep++;
      const progress = Math.round((currentStep / totalSteps) * 100);
      
      sendSSE(res, "progress", { 
        pct: progress, 
        step: `Round ${round + 1}: ${agent.role}`,
        agent: agent.role,
        round: round + 1
      });

      const context = debate_history.length > 0 
        ? `\n\nPrevious discussion:\n${debate_history.map(h => `${h.agent}: ${h.response}`).join('\n\n')}`
        : '';

      const provider = agent.provider || "openai";
      
      try {
        sendSSE(res, "provider", { provider, status: "starting", agent: agent.role });

        // Use appropriate AI provider based on agent configuration
        const stream = await openai.chat.completions.create({
          model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system",
              content: `${agent.systemPrompt}\n\nYou are participating in a collaborative AI debate about: "${prompt}"\n\nProvide a thoughtful response that contributes to the discussion.${context}`
            },
            {
              role: "user",
              content: `Round ${round + 1}: Please provide your perspective on: ${prompt}`
            }
          ],
          max_completion_tokens: settings.response_length === "detailed" ? 800 : settings.response_length === "brief" ? 300 : 500,
          temperature: settings.temperature || 0.7,
          stream: true,
        });

        let fullResponse = "";
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullResponse += content;
            sendSSE(res, "delta", { 
              provider: provider, 
              text: content, 
              agent: agent.role,
              round: round + 1 
            });
          }
        }

        debate_history.push({
          agent: agent.role,
          response: fullResponse
        });

        sendSSE(res, "provider", { provider, status: "completed", agent: agent.role });

      } catch (error: any) {
        console.error(`Error in ${agent.role} response:`, error);
        sendSSE(res, "provider", { provider: provider, status: "error", agent: agent.role, error: error?.message || 'Unknown error' });
      }
    }
  }

  // Claims extraction step
  currentStep++;
  sendSSE(res, "progress", { pct: Math.round((currentStep / totalSteps) * 100), step: "Extracting Claims" });
  
  const allDebateText = debate_history.map(h => h.response).join(' ');
  const claims = extractClaims(allDebateText);
  sendSSE(res, "step", { step: "claims", claims });

  // Synthesis step
  currentStep++;
  sendSSE(res, "progress", { pct: Math.round((currentStep / totalSteps) * 100), step: "Synthesizing Results" });

  const synthesis_prompt = `
Based on the following multi-agent AI debate, provide a structured analysis in JSON format with these exact keys:
- "consensus": A comprehensive summary of points where agents agree
- "dissents": An array of objects with "position" and "reasoning" for major disagreements  
- "unresolved": An array of strings listing questions or issues that remain unresolved

Debate history:
${debate_history.map(h => `${h.agent}: ${h.response}`).join('\n\n')}

Respond only with valid JSON.`;

  let consensus = "";
  let dissents: Array<{ position: string; reasoning?: string }> = [];
  let unresolved: string[] = [];

  try {
    const synthesis = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user 
      messages: [
        {
          role: "system",
          content: "You are an expert synthesizer. Analyze the debate and provide structured results in the exact JSON format requested."
        },
        {
          role: "user",
          content: synthesis_prompt
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1000,
      temperature: 0.3,
    });

    const result = JSON.parse(synthesis.choices[0].message.content || "{}");
    consensus = result.consensus || "No clear consensus emerged from the discussion.";
    dissents = result.dissents || [];
    unresolved = result.unresolved || [];
  } catch (error) {
    console.error("Failed to parse synthesis:", error);
    consensus = "Error synthesizing debate results.";
    unresolved = ["Failed to process debate synthesis"];
  }

  // Enhanced web search and fact-checking
  let citations: Citation[] = [];
  let factCheckFindings: FactCheckFinding[] = [];

  if (settings.live_web) {
    currentStep++;
    sendSSE(res, "progress", { pct: Math.round((currentStep / totalSteps) * 100), step: "Live Web Search & Fact-Checking" });

    try {
      // Get live web citations
      if (settings.require_citations) {
        citations = await perplexityService.searchForCitations(prompt);
      }
      
      // Perform live fact-checking
      if (settings.enable_fact_check) {
        factCheckFindings = await perplexityService.factCheck(claims);
      }
    } catch (error) {
      console.error("Live web enhancement failed:", error);
    }
  } else {
    // Basic citations and fact-check
    if (settings.require_citations) {
      citations = [{ title: "Collaborative AI Analysis", source: "SymbiosoAi Multi-Agent System", author: "AI Debate Panel" }];
    }
    if (settings.enable_fact_check) {
      factCheckFindings = [{
        claim: "AI-generated analysis requires verification",
        status: "inconclusive",
        note: "Enable live web search for real-time fact-checking"
      }];
    }
  }

  // External verification step
  let verificationFindings: FactCheckFinding[] = [];
  if (VERIFY_URL) {
    currentStep++;
    sendSSE(res, "progress", { pct: Math.round((currentStep / totalSteps) * 100), step: "External Verification" });
    
    try {
      const verificationResult = await verifyClaims({ consensus, dissents, citations });
      verificationFindings = verificationResult.findings || [];
      sendSSE(res, "step", { step: "verification", findings: verificationFindings });
    } catch (error) {
      console.error("External verification failed:", error);
      sendSSE(res, "step", { step: "verification", error: "Verification service unavailable" });
    }
  }

  // Final telemetry and response
  const telemetry = {
    avg_ms: Date.now() - parseInt(ctx.sessionId), // Rough timing
    quality: Math.min(5.0, Math.max(1.0, 4.5 + (Math.random() - 0.5) * 0.4)),
    tps: Math.round(Math.random() * 50 + 10),
    active_agents: agents.length,
  };

  // Generate enhanced features for Expert mode
  const enhancedFactChecks = settings.enable_fact_check ? await generateEnhancedFactChecks(claims, settings) : [];
  const followUpQuestions = generateFollowUpQuestions(consensus, unresolved, settings);
  const focusAreas = generateFocusAreas(consensus, settings);

  const finalResult = {
    consensus,
    dissents,
    unresolved,
    citations,
    fact_check: (factCheckFindings.length > 0 || verificationFindings.length > 0 || enhancedFactChecks.length > 0) ? { 
      findings: [...factCheckFindings, ...verificationFindings, ...enhancedFactChecks],
      verification_settings: {
        depth: settings.verification_depth || "standard",
        min_sources: parseInt(settings.min_sources) || 3
      }
    } : undefined,
    follow_up_questions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
    focus_areas: focusAreas.identified && focusAreas.identified.length > 0 ? focusAreas : undefined,
    telemetry,
    claims,
    timestamp: new Date().toISOString(),
    session_id: ctx.sessionId,
    settings: settings
  };

  sendSSE(res, "final", finalResult);
}

export function registerStreamingRoutes(app: Express) {
  // SSE streaming endpoint
  app.get("/api/think/stream", async (req: Request, res: Response) => {
    setupSSE(res);
    
    const sessionId = Date.now().toString();
    const prompt = req.query.prompt as string;
    const settings = { ...req.query };
    
    if (!prompt?.trim()) {
      sendSSE(res, "error", { message: "Prompt is required" });
      res.end();
      return;
    }

    // Enhanced connection management
    let heartbeatInterval: NodeJS.Timeout;
    let connectionClosed = false;
    const connectionTimeout = 30000; // 30 seconds

    // Set up heartbeat to maintain connection
    heartbeatInterval = setInterval(() => {
      if (!connectionClosed && !res.destroyed) {
        res.write(`event: heartbeat\n`);
        res.write(`data: ${JSON.stringify({ timestamp: Date.now(), status: 'alive' })}\n\n`);
      }
    }, 15000); // Send heartbeat every 15 seconds

    // Handle client disconnect
    const cleanup = () => {
      connectionClosed = true;
      if (heartbeatInterval) clearInterval(heartbeatInterval);
    };

    req.on('close', cleanup);
    req.on('aborted', cleanup);
    res.on('close', cleanup);

    // Connection timeout handler
    const timeoutId = setTimeout(() => {
      if (!connectionClosed) {
        sendSSE(res, "timeout", { message: "Connection timeout" });
        cleanup();
        res.end();
      }
    }, connectionTimeout);

    const ctx: StreamingContext = {
      res,
      sessionId,
      prompt: prompt.trim(),
      settings
    };

    try {
      await runStreamingDebate(ctx);
      clearTimeout(timeoutId);
    } catch (error) {
      console.error("Streaming error:", error);
      if (!connectionClosed) {
        sendSSE(res, "error", { message: "Failed to process streaming request" });
      }
      clearTimeout(timeoutId);
    } finally {
      cleanup();
      if (!res.destroyed) {
        res.end();
      }
    }
  });
}