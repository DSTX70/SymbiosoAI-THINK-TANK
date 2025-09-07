import OpenAI from "openai";
// Define types here since @shared/types may not be available in server context
export interface Citation {
  title: string;
  url: string;
  excerpt: string;
  relevance_score: number;
}

export interface FactCheckFinding {
  claim: string;
  status: "supported" | "contradicted" | "unverified";
  note?: string;
  citations?: Citation[];
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIAgent {
  role: string;
  perspective: string;
  systemPrompt: string;
}

export const AI_AGENTS: AIAgent[] = [
  {
    role: "Analyst",
    perspective: "Data-driven analytical perspective",
    systemPrompt: "You are an analytical AI that focuses on data, evidence, and logical reasoning. Provide structured analysis with clear supporting evidence."
  },
  {
    role: "Critic",
    perspective: "Critical evaluation and alternative viewpoints", 
    systemPrompt: "You are a critical thinking AI that identifies potential flaws, biases, and alternative perspectives. Challenge assumptions and highlight counterarguments."
  },
  {
    role: "Synthesizer",
    perspective: "Integration and consensus building",
    systemPrompt: "You are a synthesis AI that finds common ground, integrates different viewpoints, and builds toward consensus while acknowledging remaining disagreements."
  },
  {
    role: "Domain Expert",
    perspective: "Specialized knowledge and best practices",
    systemPrompt: "You are a domain expert AI that provides specialized knowledge, industry best practices, and contextual understanding relevant to the topic. When participating in debates, always ground your expertise in the specific context being discussed, reference concrete examples, and directly engage with points raised by other participants to provide maximum value to the collaborative analysis."
  }
];

export async function runMultiAgentDebate(
  prompt: string,
  settings: any
): Promise<{
  consensus: string;
  dissents: Array<{ position: string; reasoning?: string }>;
  unresolved: string[];
  citations?: Citation[];
  fact_check?: { findings: FactCheckFinding[] };
}> {
  const agents = settings.mode === "guided" ? AI_AGENTS : AI_AGENTS.slice(0, 3);
  const rounds = settings.turns || 1;
  
  let debate_history: Array<{ agent: string; response: string }> = [];
  
  // Initialize with previous debate history if transferring from another session
  if (settings.previousDebateHistory && Array.isArray(settings.previousDebateHistory)) {
    debate_history = [...settings.previousDebateHistory];
    console.log(`🔄 Initializing with ${debate_history.length} previous debate entries from transfer`);
  }
  
  // Run debate rounds
  for (let round = 0; round < rounds; round++) {
    for (const agent of agents) {
      const context = debate_history.length > 0 
        ? `\n\nPrevious discussion:\n${debate_history.map(h => `${h.agent}: ${h.response}`).join('\n\n')}`
        : '';
      
      // Enhanced contextual instructions for Domain Expert
      let roleSpecificInstructions = "";
      if (agent.role === "Domain Expert" && debate_history.length > 0) {
        // Extract key themes and unresolved points from debate history
        const debatePoints = debate_history.map(h => h.response).join(' ');
        
        roleSpecificInstructions = `\n\nAs a Domain Expert responding to the ongoing debate, you should:
1. DIRECTLY address specific points, claims, or questions raised by other agents
2. Provide domain-specific expertise that validates, contradicts, or expands on previous arguments
3. Cite relevant examples, case studies, or technical details that others may have missed
4. Fill knowledge gaps identified in the discussion
5. Build upon the strongest points while correcting any misconceptions
6. Reference specific agent statements when agreeing or disagreeing (e.g., "Building on the Analyst's point about...")
7. Offer practical, actionable insights based on real-world domain experience`;
      } else if (round > 0) {
        // For later rounds, all agents should be more responsive to the ongoing discussion
        roleSpecificInstructions = `\n\nSince this is round ${round + 1}, focus on:
1. Building upon or challenging specific points made by other agents
2. Addressing any gaps or questions raised in previous discussions
3. Avoiding repetition of already-covered ground
4. Moving the discussion forward with new insights`;
      }
      
      console.log(`🤖 ${agent.role} generating response for: "${prompt}"`);
      const response = await openai.chat.completions.create({
        model: "gpt-4", // Using gpt-4 instead of gpt-5 which doesn't exist
        messages: [
          {
            role: "system",
            content: `${agent.systemPrompt}\n\nYou are participating in a collaborative AI debate about: "${prompt}"\n\nProvide a thoughtful response that contributes to the discussion.${context}${roleSpecificInstructions}`
          },
          {
            role: "user",
            content: `Round ${round + 1}: Please provide your perspective on: ${prompt}`
          }
        ],
        max_completion_tokens: settings.response_length === "detailed" ? 800 : settings.response_length === "brief" ? 300 : 500,
        // temperature: settings.temperature || 0.7 // Removed - model only supports default
      });

      const content = response.choices[0].message.content || "";
      console.log(`🤖 ${agent.role} response length:`, content.length);
      console.log(`🤖 ${agent.role} response preview:`, content.substring(0, 100) + "...");
      debate_history.push({
        agent: agent.role,
        response: content
      });
    }
  }

  // Synthesize final results
  const synthesis_prompt = `Based on the following multi-agent AI debate, respond ONLY with valid JSON in this EXACT format:

{
  "consensus": "A comprehensive string summary of points where agents agree",
  "dissents": [
    {"position": "Dissenting view", "reasoning": "Why this view differs"}
  ],
  "unresolved": ["Question 1", "Question 2"]
}

CRITICAL: 
- Return ONLY the JSON object, no other text
- "consensus" must be a STRING, not an object
- Do not include markdown formatting or code blocks
- Ensure proper JSON syntax with quotes and commas

Debate history:
${debate_history.map(h => `${h.agent}: ${h.response}`).join('\n\n')}`;

  console.log("🔮 Synthesizing results from debate history:", debate_history.length, "responses");
  const synthesis = await openai.chat.completions.create({
    model: "gpt-4", // Using gpt-4 instead of gpt-5 which doesn't exist
    messages: [
      {
        role: "system",
        content: "You are a synthesis AI. Respond only with valid JSON in the exact format requested."
      },
      {
        role: "user",
        content: synthesis_prompt
      }
    ],
    max_completion_tokens: 1000,
    // temperature: 0.3, // Removed - model only supports default
    // response_format: { type: "json_object" } // Removed - not supported by gpt-4
  });

  try {
    const rawResponse = synthesis.choices[0].message.content || "{}";
    console.log("🔮 Raw synthesis response:", rawResponse.substring(0, 200) + "...");
    
    // Clean response in case it has markdown formatting
    let cleanResponse = rawResponse.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\s*/g, '').replace(/```\s*$/g, '');
    }
    
    const result = JSON.parse(cleanResponse);
    console.log("🔮 Parsed synthesis result:", JSON.stringify(result, null, 2));
    
    // Ensure consensus is a string
    const consensus = typeof result.consensus === 'string' 
      ? result.consensus 
      : typeof result.consensus === 'object' 
      ? JSON.stringify(result.consensus) 
      : "No clear consensus reached.";
    
    return {
      consensus,
      dissents: Array.isArray(result.dissents) ? result.dissents : [],
      unresolved: Array.isArray(result.unresolved) ? result.unresolved : [],
      citations: await generateCitations(prompt, settings),
      fact_check: settings.enable_fact_check ? await generateFactCheck(consensus, settings) : undefined,
      debateHistory: debate_history
    };
  } catch (error) {
    console.error("Failed to parse synthesis:", error);
    console.error("Raw response was:", synthesis.choices[0].message.content);
    return {
      consensus: "Error synthesizing debate results.",
      dissents: [],
      unresolved: ["Failed to process debate synthesis"],
      debateHistory: debate_history
    };
  }
}

async function generateCitations(prompt: string, settings: any): Promise<Citation[]> {
  // Mock implementation for now - in production this would integrate with research APIs
  return [
    {
      title: "AI-Generated Analysis",
      url: "#",
      excerpt: `Analysis conducted on the topic: ${prompt}`,
      relevance_score: 0.9
    }
  ];
}

async function generateFactCheck(consensus: string, settings: any): Promise<{ findings: FactCheckFinding[] }> {
  // Mock implementation for now - in production this would integrate with fact-checking APIs  
  return {
    findings: [
      {
        claim: "Multi-agent debate conducted",
        status: "supported" as const,
        note: "Collaborative analysis completed successfully"
      }
    ]
  };
}