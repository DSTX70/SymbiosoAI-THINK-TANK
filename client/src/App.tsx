import { useEffect } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import SimplePage from "@/pages/simple";
import GuidedPage from "@/pages/guided";
import ExpertPage from "@/pages/expert";
import AutomationPage from "@/pages/AutomationPage";
import TemplatesPage from "@/pages/templates";
import TutorialsPage from "@/pages/tutorials";
import BillingPage from "@/pages/billing";
import MarketplacePage from "@/pages/marketplace";
import Landing from "@/pages/landing";
import BottomNavigation from "@/components/BottomNavigation";
import DesktopSidebar from "@/components/DesktopSidebar";
import OfflineBanner from "@/components/OfflineBanner";
import TutorialSystem from "@/components/TutorialSystem";
import { registerServiceWorker } from "@/lib/swRegister";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // During development, skip loading state and allow immediate access
  // Show loading spinner only briefly to prevent blocking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always allow access to all pages during development
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <div className="pb-16 md:pb-0"> {/* Add bottom padding for mobile navigation */}
        <OfflineBanner />
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/simple" component={SimplePage} />
          <Route path="/guided" component={GuidedPage} />
          <Route path="/expert" component={ExpertPage} />
          <Route path="/automation" component={AutomationPage} />
          <Route path="/templates" component={TemplatesPage} />
          <Route path="/tutorials" component={TutorialsPage} />
          <Route path="/billing" component={BillingPage} />
          <Route path="/marketplace" component={MarketplacePage} />
          <Route component={() => <div>Page not found</div>} />
        </Switch>
      </div>
      <BottomNavigation />
    </div>
  );
}

function App() {
  // Register service worker on app startup
  useEffect(() => {
    registerServiceWorker().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TutorialSystem>
          <Toaster />
          <Router />
        </TutorialSystem>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
