// Helper function to create stream URL with parameters
export const createStreamUrl = (prompt: string, settings: any): string => {
  const rawParams = {
    prompt: prompt.trim(),
    mode: settings.mode || "simple",
    require_citations: settings.require_citations ? "1" : "0",
    enable_fact_check: settings.enable_fact_check ? "1" : "0",
    live_web: settings.live_web ? "1" : "0",
    temperature: "0.2",
    ...settings,
  };
  const params = new URLSearchParams();

  Object.entries(rawParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      params.set(key, value.join(","));
      return;
    }

    params.set(key, String(value));
  });
  
  return `/api/think/stream?${params.toString()}`;
};

// Re-export as default to ensure consistent module signature
export default createStreamUrl;
