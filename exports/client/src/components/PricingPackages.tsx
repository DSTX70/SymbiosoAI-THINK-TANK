import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  DollarSign, CheckCircle, X, Star, Zap, 
  Settings, Users, Shield, Crown, TrendingUp, Calculator 
} from "lucide-react";

interface PricingPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: {
    analyses: string | number;
    templates: string | number;
    storage: string;
    support: string;
  };
  popular: boolean;
}

interface PlanDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  limitations: string[];
  recommended: string;
}

export default function PricingPackages() {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isConfigureDialogOpen, setIsConfigureDialogOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch pricing packages
  const { data: packagesData, isLoading: packagesLoading } = useQuery({
    queryKey: ['/api/pricing/packages'],
    enabled: true
  });

  // Fetch specific plan details when selected
  const { data: planDetails, isLoading: planLoading } = useQuery({
    queryKey: ['/api/pricing/plans', selectedPlan],
    enabled: selectedPlan !== ""
  });

  const packages = packagesData?.data || [];

  // Configure pricing mutation
  const configurePricingMutation = useMutation({
    mutationFn: async (data: { plan: string; seats: number; customFeatures: string[] }) => {
      return apiRequest('/api/pricing/configure', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      setIsConfigureDialogOpen(false);
      toast({
        title: "Pricing Configured",
        description: "Pricing configuration has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to configure pricing.",
        variant: "destructive"
      });
    }
  });

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('unlimited')) return <Zap className="h-4 w-4 text-green-500" />;
    if (feature.toLowerCase().includes('support')) return <Users className="h-4 w-4 text-blue-500" />;
    if (feature.toLowerCase().includes('security')) return <Shield className="h-4 w-4 text-purple-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (packagesLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="pricing-packages">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pricing Packages</h2>
          <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={comparisonMode ? "default" : "outline"}
            onClick={() => setComparisonMode(!comparisonMode)}
            data-testid="button-comparison-mode"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Compare Plans
          </Button>
          
          {user && (
            <Dialog open={isConfigureDialogOpen} onOpenChange={setIsConfigureDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-configure-pricing">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configure Pricing</DialogTitle>
                </DialogHeader>
                <ConfigurePricingForm 
                  onSubmit={(data) => configurePricingMutation.mutate(data)}
                  isLoading={configurePricingMutation.isPending}
                  packages={packages}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList>
          <TabsTrigger value="packages" data-testid="tab-packages">Packages</TabsTrigger>
          <TabsTrigger value="comparison" data-testid="tab-comparison">Comparison</TabsTrigger>
          <TabsTrigger value="details" data-testid="tab-details">Plan Details</TabsTrigger>
        </TabsList>

        {/* Pricing Packages */}
        <TabsContent value="packages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg: PricingPackage) => (
              <Card 
                key={pkg.id} 
                className={`relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}
                data-testid={`package-card-${pkg.id}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {pkg.price === 0 ? 'Free' : `$${pkg.price}`}
                    </span>
                    {pkg.price > 0 && (
                      <span className="text-muted-foreground">/{pkg.interval}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {pkg.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        {getFeatureIcon(feature)}
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <h4 className="font-semibold text-sm">Limits:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Analyses: {pkg.limits.analyses}</div>
                      <div>Templates: {pkg.limits.templates}</div>
                      <div>Storage: {pkg.limits.storage}</div>
                      <div>Support: {pkg.limits.support}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => handlePlanSelect(pkg.id)}
                    data-testid={`button-select-${pkg.id}`}
                  >
                    {selectedPlan === pkg.id ? "Selected" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Plan Comparison */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      {packages.map((pkg: PricingPackage) => (
                        <th key={pkg.id} className="text-center p-2">{pkg.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Price</td>
                      {packages.map((pkg: PricingPackage) => (
                        <td key={pkg.id} className="text-center p-2">
                          {pkg.price === 0 ? 'Free' : `$${pkg.price}/${pkg.interval}`}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Analyses</td>
                      {packages.map((pkg: PricingPackage) => (
                        <td key={pkg.id} className="text-center p-2">{pkg.limits.analyses}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Templates</td>
                      {packages.map((pkg: PricingPackage) => (
                        <td key={pkg.id} className="text-center p-2">{pkg.limits.templates}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Storage</td>
                      {packages.map((pkg: PricingPackage) => (
                        <td key={pkg.id} className="text-center p-2">{pkg.limits.storage}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Support</td>
                      {packages.map((pkg: PricingPackage) => (
                        <td key={pkg.id} className="text-center p-2">{pkg.limits.support}</td>
                      ))}
                    </tr>
                    {/* Feature comparison */}
                    {['API access', 'Custom exports', 'Team collaboration', 'Advanced security'].map(feature => (
                      <tr key={feature} className="border-b">
                        <td className="p-2 font-medium">{feature}</td>
                        {packages.map((pkg: PricingPackage) => (
                          <td key={pkg.id} className="text-center p-2">
                            {pkg.features.some(f => f.toLowerCase().includes(feature.toLowerCase())) ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-gray-300 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Details */}
        <TabsContent value="details" className="space-y-4">
          {!selectedPlan ? (
            <Alert>
              <AlertDescription>
                Select a plan from the Packages tab to view detailed information.
              </AlertDescription>
            </Alert>
          ) : planLoading ? (
            <Skeleton className="h-64" />
          ) : planDetails?.data ? (
            <Card data-testid="plan-details">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  {planDetails.data.name} Plan
                </CardTitle>
                <p className="text-muted-foreground">{planDetails.data.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Included Features
                    </h4>
                    <ul className="space-y-2">
                      {planDetails.data.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {planDetails.data.limitations?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <X className="h-4 w-4 text-gray-400" />
                        Limitations
                      </h4>
                      <ul className="space-y-2">
                        {planDetails.data.limitations.map((limitation: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <X className="h-3 w-3 text-gray-400" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Best for:</h4>
                      <p className="text-sm text-muted-foreground">{planDetails.data.recommended}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {planDetails.data.price === 0 ? 'Free' : `$${planDetails.data.price}`}
                      </div>
                      {planDetails.data.price > 0 && (
                        <div className="text-sm text-muted-foreground">per month</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertDescription>
                Unable to load plan details. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Pricing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="stat-total-packages">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Packages</p>
                <p className="text-2xl font-bold">{packages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-free-plan">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Free Plan</p>
                <p className="text-2xl font-bold">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-popular-plan">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Popular Plan</p>
                <p className="text-2xl font-bold">
                  {packages.find((pkg: PricingPackage) => pkg.popular)?.name || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-price-range">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Price Range</p>
                <p className="text-2xl font-bold">
                  $0-${Math.max(...packages.map((pkg: PricingPackage) => pkg.price))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Configure pricing form component
function ConfigurePricingForm({ 
  onSubmit, 
  isLoading, 
  packages 
}: { 
  onSubmit: (data: { plan: string; seats: number; customFeatures: string[] }) => void; 
  isLoading: boolean;
  packages: PricingPackage[];
}) {
  const [formData, setFormData] = useState({
    plan: "",
    seats: 1,
    customFeatures: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="plan">Select Plan</Label>
        <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
          <SelectTrigger data-testid="select-configure-plan">
            <SelectValue placeholder="Choose a plan" />
          </SelectTrigger>
          <SelectContent>
            {packages.map((pkg: PricingPackage) => (
              <SelectItem key={pkg.id} value={pkg.id}>
                {pkg.name} - {pkg.price === 0 ? 'Free' : `$${pkg.price}/${pkg.interval}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="seats">Number of Seats</Label>
        <Input
          id="seats"
          type="number"
          min="1"
          value={formData.seats}
          onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 1 })}
          data-testid="input-configure-seats"
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button
          type="submit"
          disabled={isLoading || !formData.plan}
          data-testid="button-submit-configure"
        >
          {isLoading ? "Configuring..." : "Configure Pricing"}
        </Button>
      </div>
    </form>
  );
}