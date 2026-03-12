import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApiErrorDetail {
  status: number;
  message: string;
  url: string;
}

export function ApiErrorToaster() {
  const { toast } = useToast();

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ApiErrorDetail>).detail;
      if (!detail) return;
      if (detail.status === 429) {
        toast({
          title: "Rate limit reached",
          description: "Please wait a moment and try again.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: `Request failed (${detail.status})`,
        description: detail.message,
        variant: "destructive",
      });
    };

    window.addEventListener("api-error", handler as EventListener);
    return () => window.removeEventListener("api-error", handler as EventListener);
  }, [toast]);

  return null;
}
