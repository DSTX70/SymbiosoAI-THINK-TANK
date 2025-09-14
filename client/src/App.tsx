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
import ReviewsPage from "@/pages/reviews";
import RetentionPage from "@/pages/retention";
import Landing from "@/pages/landing";
import TrustCenter from "@/pages/trust-center";
import TrustCenterSecurity from "@/pages/trust-center-security";
import TrustCenterPrivacy from "@/pages/trust-center-privacy";
import TrustCenterTerms from "@/pages/trust-center-terms";
import TrustCenterDataProcessing from "@/pages/trust-center-data-processing";
import TrustCenterCompliance from "@/pages/trust-center-compliance";
import TrustCenterContact from "@/pages/trust-center-contact";
import Sprint10Page from "@/pages/sprint10";
import Sprint11Page from "@/pages/sprint11";
import BottomNavigation from "@/components/BottomNavigation";
import DesktopSidebar from "@/components/DesktopSidebar";
import OfflineBanner from "@/components/OfflineBanner";
import TutorialSystem from "@/components/TutorialSystem";
import { I18nProvider } from "@/components/I18nProvider";
import { EntitlementsProvider } from "@/components/EntitlementsProvider";
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
          <Route path="/reviews" component={ReviewsPage} />
          <Route path="/retention" component={RetentionPage} />
          <Route path="/trust-center" component={TrustCenter} />
          <Route path="/trust-center/security" component={TrustCenterSecurity} />
          <Route path="/trust-center/privacy" component={TrustCenterPrivacy} />
          <Route path="/trust-center/terms" component={TrustCenterTerms} />
          <Route path="/trust-center/data-processing" component={TrustCenterDataProcessing} />
          <Route path="/trust-center/compliance" component={TrustCenterCompliance} />
          <Route path="/trust-center/contact" component={TrustCenterContact} />
          <Route path="/sprint10" component={Sprint10Page} />
          <Route path="/sprint11" component={Sprint11Page} />
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
      <I18nProvider>
        <EntitlementsProvider>
          <TooltipProvider>
            <TutorialSystem>
              <Toaster />
              <Router />
            </TutorialSystem>
          </TooltipProvider>
        </EntitlementsProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
