import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import SimplePage from "@/pages/simple";
import GuidedPage from "@/pages/guided";
import ExpertPage from "@/pages/expert";
import SessionsPage from "@/pages/sessions";
import SessionDetailPage from "@/pages/session-detail";
import Landing from "@/pages/landing";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner briefly, then allow access to pages
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For now, allow access to all pages regardless of authentication status
  // This prevents 404 errors while authentication system is being configured
  return (
    <Switch>
      <Route path="/" component={isAuthenticated ? () => <Redirect to="/simple" /> : Landing} />
      <Route path="/simple" component={SimplePage} />
      <Route path="/guided" component={GuidedPage} />
      <Route path="/expert" component={ExpertPage} />
      <Route path="/sessions" component={SessionsPage} />
      <Route path="/sessions/:id" component={SessionDetailPage} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
