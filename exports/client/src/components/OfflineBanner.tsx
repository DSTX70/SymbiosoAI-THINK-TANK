import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800" data-testid="offline-banner">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're currently offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  );
}