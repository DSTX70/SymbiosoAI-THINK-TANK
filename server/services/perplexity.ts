import type { Citation, FactCheckFinding } from "@shared/schema";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const PERPLEXITY_MODEL = "llama-3.1-sonar-small-128k-online";

interface PerplexityMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface PerplexityResponse {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
  citations?: string[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class PerplexityService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || "";
    if (!this.apiKey) {
      console.warn("PERPLEXITY_API_KEY not found - live web search will be disabled");
    }
  }

  async searchWeb(query: string): Promise<{ answer: string; citations: Citation[] }> {
    if (!this.apiKey) {
      throw new Error("Perplexity API key not configured");
    }

    try {
      const messages: PerplexityMessage[] = [
        {
          role: "system",
          content: "You are a research assistant. Provide accurate, up-to-date information with citations. Focus on factual, well-sourced content."
        },
        {
          role: "user",
          content: query
        }
      ];

      const response = await fetch(PERPLEXITY_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: PERPLEXITY_MODEL,
          messages,
          max_tokens: 500,
          temperature: 0.2,
          top_p: 0.9,
          search_domain_filter: [],
          return_images: false,
          return_related_questions: false,
          search_recency_filter: "month",
          top_k: 0,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Perplexity API error details:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          query: query.substring(0, 100)
        });
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }

      const data: PerplexityResponse = await response.json();
      const answer = data.choices[0]?.message?.content || "";
      
      // Convert Perplexity citations to our format
      const citations: Citation[] = (data.citations || []).map((url, index) => ({
        title: `Web Source ${index + 1}`,
        url,
        source: new URL(url).hostname,
      }));

      return { answer, citations };
    } catch (error: any) {
      console.error("Perplexity search error:", error);
      throw new Error(`Web search failed: ${error?.message || 'Unknown error'}`);
    }
  }

  async searchForCitations(topic: string): Promise<Citation[]> {
    try {
      const query = `Find reliable sources and citations about: ${topic}`;
      const result = await this.searchWeb(query);
      return result.citations;
    } catch (error) {
      console.error("Citation search error:", error);
      // Return fallback citations when API fails
      return [
        {
          title: "AI-powered analysis",
          source: "Multi-agent collaborative intelligence system",
          author: "SymbiosoAi ThinkTank"
        }
      ];
    }
  }

  async factCheck(claims: string[]): Promise<FactCheckFinding[]> {
    if (!this.apiKey || claims.length === 0) {
      return [];
    }

    const findings: FactCheckFinding[] = [];

    for (const claim of claims.slice(0, 3)) { // Limit to 3 claims to avoid rate limits
      try {
        const query = `Fact-check this claim with current reliable sources: "${claim}"`;
        const result = await this.searchWeb(query);
        
        // Simple heuristic to determine fact-check status
        const content = result.answer.toLowerCase();
        let status: "supported" | "contradicted" | "inconclusive" = "inconclusive";
        
        if (content.includes("confirmed") || content.includes("accurate") || content.includes("true") || content.includes("correct")) {
          status = "supported";
        } else if (content.includes("false") || content.includes("incorrect") || content.includes("disputed") || content.includes("debunked")) {
          status = "contradicted";
        }

        findings.push({
          claim,
          status,
          note: result.answer.substring(0, 200) + (result.answer.length > 200 ? "..." : ""),
          citations: result.citations.slice(0, 2), // Limit citations per claim
        });
      } catch (error) {
        findings.push({
          claim,
          status: "inconclusive",
          note: "Live fact-checking temporarily unavailable - enable when web search is working",
        });
      }
    }

    return findings;
  }
}

export const perplexityService = new PerplexityService();