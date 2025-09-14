import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, Crown, Star, Zap, AlertCircle, Lock, Users } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
// Feature gating imports
import { useEntitlements, BILLING_FEATURES } from "@/hooks/useEntitlements";
import { ConditionalFeature, RequireRole } from "@/components/ConditionalFeature";
import { UpgradePrompt, PlanGate } from "@/components/UpgradePrompt";

interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: {
    monthly_analyses?: number;
    users_per_workspace?: number;
    storage_gb?: number;
    api_calls_per_minute?: number;
  };
}

interface PlansResponse {
  plans: SubscriptionPlan[];
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  settings?: any;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

interface CheckoutRequest {
  workspaceId: string;
  planId: string;
  seats?: number;
}

interface CheckoutResponse {
  sessionId: string;
  status: string;
  checkoutUrl?: string;
  subscriptionId: string;
  message: string;
}

function PlanCard({ plan, onSelectPlan, isLoading, canManageBilling, currentPlan, billingInterval }: { 
  plan: SubscriptionPlan; 
  onSelectPlan: (planId: string) => void;
  isLoading: boolean;
  canManageBilling: boolean;
  currentPlan: string;
  billingInterval: 'monthly' | 'yearly';
}) {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const currentPrice = billingInterval === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  const isRecommended = plan.id === 'pro';

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('enterprise')) return <Crown className="w-5 h-5" />;
    if (name.includes('pro')) return <Star className="w-5 h-5" />;
    return <Zap className="w-5 h-5" />;
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('enterprise')) return 'from-purple-600 to-indigo-600';
    if (name.includes('pro')) return 'from-blue-600 to-cyan-600';
    return 'from-green-600 to-emerald-600';
  };

  return (
    <Card 
      className={`relative transition-all duration-300 hover:shadow-lg ${
        isRecommended ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''
      }`}
      data-testid={`plan-card-${plan.id}`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Recommended
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor(plan.name)} mx-auto flex items-center justify-center text-white mb-2`}>
          {getPlanIcon(plan.name)}
        </div>
        <CardTitle className="text-2xl" data-testid={`plan-name-${plan.id}`}>
          {plan.name}
        </CardTitle>
        <CardDescription data-testid={`plan-description-${plan.id}`}>
          {plan.id === 'free' ? 'Perfect for getting started' : 
           plan.id === 'pro' ? 'Best for small teams and professionals' :
           'Enterprise-grade features and support'}
        </CardDescription>
        <div className="pt-4">
          <span className="text-4xl font-bold" data-testid={`plan-price-${plan.id}`}>
            {formatPrice(currentPrice)}
          </span>
          <span className="text-muted-foreground">/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
          {billingInterval === 'yearly' && plan.priceYearly < plan.priceMonthly * 12 && (
            <div className="text-sm text-green-600 font-medium">
              Save {Math.round((1 - plan.priceYearly / (plan.priceMonthly * 12)) * 100)}%
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Features:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span data-testid={`plan-feature-${plan.id}-${index}`}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {plan.limits && Object.keys(plan.limits).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Limits:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {plan.limits.monthly_analyses !== undefined && (
                <li data-testid={`plan-limit-analyses-${plan.id}`}>
                  • {plan.limits.monthly_analyses === -1 ? 'Unlimited' : plan.limits.monthly_analyses} monthly analyses
                </li>
              )}
              {plan.limits.users_per_workspace !== undefined && (
                <li data-testid={`plan-limit-users-${plan.id}`}>
                  • {plan.limits.users_per_workspace === -1 ? 'Unlimited' : plan.limits.users_per_workspace} users per workspace
                </li>
              )}
              {plan.limits.storage_gb !== undefined && (
                <li data-testid={`plan-limit-storage-${plan.id}`}>
                  • {plan.limits.storage_gb} GB storage
                </li>
              )}
              {plan.limits.api_calls_per_minute !== undefined && (
                <li data-testid={`plan-limit-api-${plan.id}`}>
                  • {plan.limits.api_calls_per_minute} API calls per minute
                </li>
              )}
            </ul>
          </div>
        )}
        
        <Button 
          className={`w-full mt-6 ${
            isRecommended 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
              : ''
          }`}
          onClick={() => onSelectPlan(plan.id)}
          disabled={isLoading || !canManageBilling || currentPlan === plan.id}
          data-testid={`buy-button-${plan.id}`}
        >
          {!canManageBilling ? (
            <><Lock className="w-4 h-4 mr-2" />Restricted</>
          ) : isLoading ? (
            'Processing...'
          ) : currentPlan === plan.id ? (
            'Current Plan'
          ) : (
            'Upgrade Now'
          )}
        </Button>
        
        {!canManageBilling && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Only workspace owners and admins can manage billing
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function BillingPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  // Fetch user's workspaces
  const { data: workspaces = [], isLoading: workspacesLoading, error: workspacesError } = useQuery<Workspace[]>({
    queryKey: ['/api/workspaces'],
    enabled: isAuthenticated,
  });

  // Fetch subscription plans
  const { data: plansData, isLoading: plansLoading, error: plansError } = useQuery<PlansResponse>({
    queryKey: ['/api/billing/plans'],
  });

  // Get current subscription for selected workspace
  const { data: currentSubscription } = useQuery({
    queryKey: ['/api/billing/subscriptions', selectedWorkspaceId],
    enabled: !!selectedWorkspaceId,
  });

  // Get current workspace and user's role
  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspaceId);
  const isWorkspaceOwner = currentWorkspace?.ownerId === user?.id;
  const canManageBilling = isWorkspaceOwner; // For now, only owners. Can extend to include admins later
  const currentPlan = currentSubscription?.plan || 'free';

  // Auto-select workspace if user has only one
  React.useEffect(() => {
    if (workspaces.length === 1 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId]);

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async (request: CheckoutRequest): Promise<CheckoutResponse> => {
      return await apiRequest('/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    },
    onSuccess: (data) => {
      setIsCheckingOut(false);
      toast({
        title: "Checkout Successful!",
        description: data.message,
      });
      
      // Mock: Log checkout URL to console (would normally redirect)
      if (data.checkoutUrl && data.checkoutUrl !== "mock://checkout") {
        console.log("Would redirect to:", data.checkoutUrl);
      } else {
        console.log("Mock checkout completed:", data);
      }
      
      // Invalidate plans query to refresh any subscription status
      queryClient.invalidateQueries({ queryKey: ['/api/billing/plans'] });
    },
    onError: (error: any) => {
      setIsCheckingOut(false);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process checkout",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your plan",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWorkspaceId) {
      toast({
        title: "Workspace Required",
        description: "Please select a workspace to manage billing",
        variant: "destructive",
      });
      return;
    }

    if (!canManageBilling) {
      toast({
        title: "Authorization Required",
        description: "Only workspace owners and administrators can manage billing",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      await checkoutMutation.mutateAsync({
        workspaceId: selectedWorkspaceId,
        planId,
        seats: 1,
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Checkout error:", error);
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" data-testid="billing">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to view billing information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = "/api/login"}
              data-testid="signin-button"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="billing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="billing-title">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="billing-subtitle">
            Unlock powerful AI-driven analysis and collaboration features
          </p>
        </div>

        {/* Workspace Selection */}
        {workspaces.length > 1 && (
          <div className="max-w-md mx-auto mb-8">
            <Label htmlFor="workspace-select" className="text-sm font-medium mb-2 block">
              Select Workspace
            </Label>
            <Select value={selectedWorkspaceId} onValueChange={setSelectedWorkspaceId}>
              <SelectTrigger data-testid="workspace-select">
                <SelectValue placeholder="Choose a workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{workspace.name}</span>
                      {workspace.ownerId === user?.id && <Badge variant="secondary">Owner</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Billing Interval Toggle */}
        {selectedWorkspaceId && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className="text-sm font-medium">
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingInterval === 'yearly'}
              onCheckedChange={(checked) => setBillingInterval(checked ? 'yearly' : 'monthly')}
              data-testid="billing-interval-toggle"
            />
            <Label htmlFor="billing-toggle" className="text-sm font-medium">
              Yearly
              <Badge className="ml-2" variant="secondary">Save 20%</Badge>
            </Label>
          </div>
        )}

        {/* Workspace Authorization Warning */}
        {selectedWorkspaceId && !canManageBilling && (
          <Alert className="mb-8 max-w-2xl mx-auto" data-testid="authorization-warning">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Limited Access:</strong> Only workspace owners and administrators can manage billing for this workspace. 
              Contact your workspace owner to upgrade your plan.
            </AlertDescription>
          </Alert>
        )}

        {/* Error States */}
        {(plansError || workspacesError) && (
          <Alert className="mb-8" data-testid="plans-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {plansError ? 'Failed to load subscription plans.' : 'Failed to load workspaces.'} Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* No Workspaces State */}
        {workspaces.length === 0 && !workspacesLoading && (
          <Alert className="mb-8 max-w-2xl mx-auto" data-testid="no-workspaces">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to be a member of at least one workspace to manage billing. Please join a workspace or create one first.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {(plansLoading || workspacesLoading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="plans-loading">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="text-center">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
                  <Skeleton className="h-6 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto mb-4" />
                  <Skeleton className="h-8 w-20 mx-auto" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Plans Grid */}
        {plansData?.plans && selectedWorkspaceId && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="plans-grid">
            {plansData.plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelectPlan={handleSelectPlan}
                isLoading={isCheckingOut}
                canManageBilling={canManageBilling}
                currentPlan={currentPlan}
                billingInterval={billingInterval}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include our core AI analysis features with 24/7 support
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              30-day money-back guarantee
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Secure payments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}