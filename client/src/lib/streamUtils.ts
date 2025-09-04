// Helper function to create stream URL with parameters
export function createStreamUrl(prompt: string, settings: any): string {
  const params = new URLSearchParams({
    prompt: prompt.trim(),
    mode: settings.mode || "simple",
    require_citations: settings.require_citations ? "1" : "0",
    enable_fact_check: settings.enable_fact_check ? "1" : "0",
    live_web: settings.live_web ? "1" : "0",
    temperature: "0.2",
    ...settings
  });
  
  return `/api/think/stream?${params.toString()}`;
}