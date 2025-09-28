import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  CheckCircle, ShoppingCart, Star, Users, AlertCircle, Lock, 
  FileText, Tag, Calendar, Eye, Download 
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
// Feature gating imports
import { useEntitlements, useTemplateAccess, BILLING_FEATURES } from "@/hooks/useEntitlements";
import { ConditionalFeature, RequireFeature } from "@/components/ConditionalFeature";
import { UpgradePrompt } from "@/components/UpgradePrompt";

// User interface to fix type safety
interface User {
  id: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  tags: string[] | null;
  content: any;
  isPublic: boolean;
  usageCount: number;
  authorId: string | null;
  version: number;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface TemplateProduct {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  templateId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  template: Template;
}

interface TemplateProductResponse {
  templates: TemplateProduct[];
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

interface TemplatePurchase {
  id: string;
  workspaceId: string;
  userId: string;
  templateProductId: string;
  priceCents: number;
  currency: string;
  licenseKey: string;
  purchasedAt: string;
}

interface PurchaseRequest {
  workspaceId: string;
  templateProductId: string;
}

interface PurchaseResponse {
  purchase: TemplatePurchase;
  message: string;
}

function TemplateProductCard({ 
  product, 
  onPurchase, 
  isPurchasing, 
  canPurchase, 
  isAuthenticated,
  isPurchased 
}: { 
  product: TemplateProduct;
  onPurchase: (productId: string) => void;
  isPurchasing: boolean;
  canPurchase: boolean;
  isAuthenticated: boolean;
  isPurchased: boolean;
}) {
  
  const formatPrice = (priceCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(priceCents / 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'business': return <Star className="w-4 h-4" />;
      case 'technology': return <FileText className="w-4 h-4" />;
      case 'education': return <Users className="w-4 h-4" />;
      case 'research': return <Eye className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'business': return 'from-blue-600 to-cyan-600';
      case 'technology': return 'from-purple-600 to-indigo-600';
      case 'education': return 'from-green-600 to-emerald-600';
      case 'research': return 'from-orange-600 to-red-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  const isPremium = product.priceCents > 0;

  return (
    <Card 
      className="relative transition-all duration-300 hover:shadow-lg"
      data-testid={`template-card-${product.id}`}
    >
      {isPremium && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Premium
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getCategoryColor(product.template.category)} mx-auto flex items-center justify-center text-white mb-2`}>
          {getCategoryIcon(product.template.category)}
        </div>
        
        <CardTitle className="text-xl text-center" data-testid={`template-name-${product.id}`}>
          {product.name}
        </CardTitle>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {product.template.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            v{product.template.version}
          </Badge>
        </div>
        
        <CardDescription className="text-center" data-testid={`template-description-${product.id}`}>
          {product.description || product.template.description || 'Professional analysis template'}
        </CardDescription>
        
        <div className="text-center pt-2">
          <span className="text-3xl font-bold" data-testid={`template-price-${product.id}`}>
            {product.priceCents === 0 ? 'FREE' : formatPrice(product.priceCents, product.currency)}
          </span>
          {product.priceCents === 0 && (
            <div className="text-sm text-green-600 font-medium">
              No cost to use
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span data-testid={`template-usage-${product.id}`}>
              Used {product.template.usageCount} times
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Updated {new Date(product.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {product.template.tags && product.template.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Features:</h4>
            <div className="flex flex-wrap gap-1">
              {product.template.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs" data-testid={`template-tag-${product.id}-${index}`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {product.template.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.template.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">What's included:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span>Ready-to-use analysis framework</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span>Customizable AI agent configurations</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span>Professional report templates</span>
            </li>
            {isPremium && (
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span>Lifetime license key</span>
              </li>
            )}
          </ul>
        </div>
        
        <Button 
          className={`w-full mt-6 ${
            isPurchased 
              ? 'bg-green-600 hover:bg-green-700' 
              : isPremium 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
          }`}
          onClick={() => onPurchase(product.id)}
          disabled={isPurchasing || !canPurchase || isPurchased}
          data-testid={`purchase-button-${product.id}`}
        >
          {!isAuthenticated ? (
            <><Lock className="w-4 h-4 mr-2" />Sign in to Purchase</>
          ) : !canPurchase ? (
            <><Lock className="w-4 h-4 mr-2" />Restricted</>
          ) : isPurchasing ? (
            'Processing...'
          ) : isPurchased ? (
            <><CheckCircle className="w-4 h-4 mr-2" />Purchased</>
          ) : (
            <><ShoppingCart className="w-4 h-4 mr-2" />{product.priceCents === 0 ? 'Get Template' : 'Purchase Now'}</>
          )}
        </Button>
        
        {!isAuthenticated && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Sign in to purchase templates and get license keys
          </p>
        )}
        
        {!canPurchase && isAuthenticated && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Only workspace owners and admins can purchase templates
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function MarketplacePage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [purchasingProductId, setPurchasingProductId] = useState<string | null>(null);

  // Fetch user's workspaces
  const { data: workspaces = [], isLoading: workspacesLoading } = useQuery<Workspace[]>({
    queryKey: ['/api/workspaces'],
    enabled: isAuthenticated,
  });

  // Fetch marketplace templates
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery<TemplateProductResponse>({
    queryKey: ['/api/marketplace/templates'],
  });

  // Note: Purchase tracking removed since /api/template-purchases endpoint doesn't exist
  // const { data: purchases = [] } = useQuery<TemplatePurchase[]>({
  //   queryKey: ['/api/template-purchases'],
  //   enabled: isAuthenticated,
  // });

  // Get current workspace and user's role
  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspaceId);
  const isWorkspaceOwner = currentWorkspace?.ownerId === (user as User)?.id;
  const canPurchase = isWorkspaceOwner; // For now, only owners. Can extend to include admins later

  // Auto-select workspace if user has only one
  React.useEffect(() => {
    if (workspaces.length === 1 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId]);

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (request: PurchaseRequest): Promise<PurchaseResponse> => {
      const response = await apiRequest('POST', '/api/marketplace/purchase', request);
      return await response.json();
    },
    onSuccess: (data) => {
      setPurchasingProductId(null);
      toast({
        title: "Purchase Successful! 🎉",
        description: `Template purchased successfully. License key: ${data.purchase.licenseKey}`,
      });
      
      // Note: Purchase list invalidation removed since endpoint doesn't exist
      // queryClient.invalidateQueries({ queryKey: ['/api/template-purchases'] });
    },
    onError: (error: any) => {
      setPurchasingProductId(null);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to process purchase",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = async (templateProductId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase templates",
        variant: "destructive",
      });
      return;
    }

    if (!selectedWorkspaceId) {
      toast({
        title: "Workspace Required",
        description: "Please select a workspace to purchase templates",
        variant: "destructive",
      });
      return;
    }

    if (!canPurchase) {
      toast({
        title: "Authorization Required",
        description: "Only workspace owners and administrators can purchase templates",
        variant: "destructive",
      });
      return;
    }
    
    setPurchasingProductId(templateProductId);
    
    try {
      await purchaseMutation.mutateAsync({
        workspaceId: selectedWorkspaceId,
        templateProductId,
      });
    } catch (error) {
      // Error handling is done in onError callback
      console.error("Purchase error:", error);
    }
  };

  // Check if a template is already purchased (simplified - no API endpoint available)
  const isPurchased = (templateProductId: string) => {
    // Note: Cannot check purchases since /api/template-purchases endpoint doesn't exist
    // The server will handle duplicate purchase prevention with 409 status
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="marketplace">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="marketplace-title">
            Template Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="marketplace-subtitle">
            Discover professional analysis templates crafted by experts
          </p>
        </div>

        {/* Workspace Selection for Authenticated Users */}
        {isAuthenticated && workspaces.length > 1 && (
          <div className="max-w-md mx-auto mb-8">
            <Label htmlFor="workspace-select" className="text-sm font-medium mb-2 block">
              Select Workspace for Purchase
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
                      {workspace.ownerId === (user as User)?.id && <Badge variant="secondary">Owner</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Authorization Warning */}
        {isAuthenticated && selectedWorkspaceId && !canPurchase && (
          <Alert className="mb-8 max-w-2xl mx-auto" data-testid="authorization-warning">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Limited Access:</strong> Only workspace owners can purchase templates for this workspace. 
              Contact your workspace owner to purchase premium templates.
            </AlertDescription>
          </Alert>
        )}

        {/* Error States */}
        {productsError && (
          <Alert className="mb-8" data-testid="products-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load templates. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {(productsLoading || workspacesLoading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="templates-loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="text-center">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto mb-2" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-4" />
                  <Skeleton className="h-8 w-20 mx-auto" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Template Products Grid */}
        {productsData?.templates && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsData.templates.map((product) => (
              <TemplateProductCard
                key={product.id}
                product={product}
                onPurchase={handlePurchase}
                isPurchasing={purchasingProductId === product.id}
                canPurchase={canPurchase}
                isAuthenticated={isAuthenticated}
                isPurchased={isPurchased(product.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {productsData?.templates && productsData.templates.length === 0 && (
          <div className="text-center py-12" data-testid="empty-marketplace">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Templates Available</h3>
            <p className="text-muted-foreground">
              Check back soon for new professional analysis templates.
            </p>
          </div>
        )}

        {/* Authentication Prompt for Unauthenticated Users */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mt-12">
            <Card>
              <CardHeader className="text-center">
                <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <CardTitle>Sign In for Full Access</CardTitle>
                <CardDescription>
                  Sign in to purchase premium templates and manage your workspace licenses
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="w-full max-w-sm" 
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="signin-button"
                >
                  Sign In to Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Workspaces State */}
        {workspaces.length === 0 && isAuthenticated && !workspacesLoading && (
          <Alert className="mb-8 max-w-2xl mx-auto" data-testid="no-workspaces">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to be a member of at least one workspace to purchase templates. Please join a workspace or create one first.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}