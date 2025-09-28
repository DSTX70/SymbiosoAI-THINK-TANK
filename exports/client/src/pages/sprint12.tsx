import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Settings, ShoppingCart, DollarSign, 
  MessageSquare, Users, Search, FileText, Target, Zap 
} from "lucide-react";
import DocsViewer from "@/components/DocsViewer";
import AdminConsole from "@/components/AdminConsole";
import MarketplaceCatalog from "@/components/MarketplaceCatalog";
import PricingPackages from "@/components/PricingPackages";
import ChangelogViewer from "@/components/ChangelogViewer";
import PlaybooksGuide from "@/components/PlaybooksGuide";

export default function Sprint12Page() {
  return (
    <div className="container mx-auto p-6" data-testid="sprint12-page">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sprint 12: GA Launch
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Comprehensive documentation system, polished admin console, marketplace catalog, pricing packages, and changelog management for General Availability launch.
        </p>
        
        {/* GA Launch Status Overview */}
        <Card className="mb-6" data-testid="card-ga-overview">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              GA Launch Readiness Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="flex items-center space-x-2" data-testid="status-docs">
                <BookOpen className="h-4 w-4 text-green-500" />
                <span className="text-sm">Docs System</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Live</Badge>
              </div>
              <div className="flex items-center space-x-2" data-testid="status-admin">
                <Settings className="h-4 w-4 text-green-500" />
                <span className="text-sm">Admin Console</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Ready</Badge>
              </div>
              <div className="flex items-center space-x-2" data-testid="status-marketplace">
                <ShoppingCart className="h-4 w-4 text-green-500" />
                <span className="text-sm">Marketplace</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center space-x-2" data-testid="status-pricing">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm">Pricing API</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Complete</Badge>
              </div>
              <div className="flex items-center space-x-2" data-testid="status-changelog">
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm">Changelog</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center space-x-2" data-testid="status-playbooks">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm">Playbooks</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sprint 12 Features Tabs */}
      <Tabs defaultValue="docs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="docs" data-testid="tab-docs">
            <BookOpen className="h-4 w-4 mr-2" />
            Docs
          </TabsTrigger>
          <TabsTrigger value="admin" data-testid="tab-admin">
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </TabsTrigger>
          <TabsTrigger value="marketplace" data-testid="tab-marketplace">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="pricing" data-testid="tab-pricing">
            <DollarSign className="h-4 w-4 mr-2" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="changelog" data-testid="tab-changelog">
            <MessageSquare className="h-4 w-4 mr-2" />
            Changelog
          </TabsTrigger>
          <TabsTrigger value="playbooks" data-testid="tab-playbooks">
            <Users className="h-4 w-4 mr-2" />
            Playbooks
          </TabsTrigger>
        </TabsList>

        {/* Documentation System */}
        <TabsContent value="docs" className="space-y-4">
          <Card data-testid="card-docs-system">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Documentation & Tutorials System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocsViewer />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Console */}
        <TabsContent value="admin" className="space-y-4">
          <Card data-testid="card-admin-console">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Console & Settings Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminConsole />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace Catalog */}
        <TabsContent value="marketplace" className="space-y-4">
          <Card data-testid="card-marketplace-catalog">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Marketplace Catalog & Publishing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketplaceCatalog />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Packages */}
        <TabsContent value="pricing" className="space-y-4">
          <Card data-testid="card-pricing-packages">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Packages & Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PricingPackages />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Changelog System */}
        <TabsContent value="changelog" className="space-y-4">
          <Card data-testid="card-changelog-system">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Changelog & Release Communications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChangelogViewer />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Success Playbooks */}
        <TabsContent value="playbooks" className="space-y-4">
          <Card data-testid="card-playbooks-guide">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Success Playbooks & Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PlaybooksGuide />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* GA Launch Features Summary */}
      <div className="mt-12">
        <Card data-testid="card-ga-features">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Sprint 12 GA Launch Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg" data-testid="feature-docs">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Documentation System
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Searchable article index</li>
                  <li>• Tutorial content management</li>
                  <li>• Category organization</li>
                  <li>• View tracking & analytics</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg" data-testid="feature-admin">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Admin Console
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Settings CRUD operations</li>
                  <li>• Configuration management</li>
                  <li>• System environment controls</li>
                  <li>• Admin dashboard interface</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg" data-testid="feature-marketplace">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Marketplace
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Catalog browsing & search</li>
                  <li>• Item publishing workflow</li>
                  <li>• Category filtering</li>
                  <li>• Publisher management</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg" data-testid="feature-pricing">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing System
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete pricing API</li>
                  <li>• Plan comparisons</li>
                  <li>• Feature matrices</li>
                  <li>• Configuration options</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg" data-testid="feature-changelog">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Release Communications
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Changelog management</li>
                  <li>• Version tracking</li>
                  <li>• Release notes publishing</li>
                  <li>• Update notifications</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg" data-testid="feature-playbooks">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Success Guidance
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• User onboarding flows</li>
                  <li>• Role-based playbooks</li>
                  <li>• Progress tracking</li>
                  <li>• Best practices delivery</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}