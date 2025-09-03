import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SimplePage from "@/pages/simple";
import GuidedPage from "@/pages/guided";
import SessionsPage from "@/pages/sessions";
import SessionDetailPage from "@/pages/session-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/simple" />} />
      <Route path="/simple" component={SimplePage} />
      <Route path="/guided" component={GuidedPage} />
      <Route path="/sessions" component={SessionsPage} />
      <Route path="/sessions/:id" component={SessionDetailPage} />
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
