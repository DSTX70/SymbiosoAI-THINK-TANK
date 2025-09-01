import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

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
    systemPrompt: "You are a domain expert AI that provides specialized knowledge, industry best practices, and contextual understanding relevant to the topic."
  }
];

export async function runMultiAgentDebate(
  prompt: string,
  settings: any
): Promise<{
  consensus: string;
  dissents: Array<{ position: string; reasoning?: string }>;
  unresolved: string[];
  citations?: string[];
}> {
  const agents = settings.mode === "guided" ? AI_AGENTS : AI_AGENTS.slice(0, 3);
  const rounds = settings.turns || 3;
  
  let debate_history: Array<{ agent: string; response: string }> = [];
  
  // Run debate rounds
  for (let round = 0; round < rounds; round++) {
    for (const agent of agents) {
      const context = debate_history.length > 0 
        ? `\n\nPrevious discussion:\n${debate_history.map(h => `${h.agent}: ${h.response}`).join('\n\n')}`
        : '';
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
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
        temperature: settings.temperature || 0.7
      });

      const content = response.choices[0].message.content || "";
      debate_history.push({
        agent: agent.role,
        response: content
      });
    }
  }

  // Synthesize final results
  const synthesis_prompt = `
Based on the following multi-agent AI debate, provide a structured analysis in JSON format with these exact keys:
- "consensus": A comprehensive summary of points where agents agree
- "dissents": An array of objects with "position" and "reasoning" for major disagreements
- "unresolved": An array of strings listing questions or issues that remain unresolved

Debate history:
${debate_history.map(h => `${h.agent}: ${h.response}`).join('\n\n')}

Respond only with valid JSON.`;

  const synthesis = await openai.chat.completions.create({
    model: "gpt-4o",
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
    temperature: 0.3
  });

  try {
    const result = JSON.parse(synthesis.choices[0].message.content || "{}");
    
    return {
      consensus: result.consensus || "No clear consensus emerged from the discussion.",
      dissents: result.dissents || [],
      unresolved: result.unresolved || [],
      citations: settings.require_citations ? ["AI-generated analysis", "Multi-agent debate synthesis"] : undefined
    };
  } catch (error) {
    console.error("Failed to parse synthesis:", error);
    return {
      consensus: "Error synthesizing debate results.",
      dissents: [],
      unresolved: ["Failed to process debate synthesis"],
    };
  }
}
