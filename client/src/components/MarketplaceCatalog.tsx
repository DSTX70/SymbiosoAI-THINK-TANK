import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Search, ShoppingCart, Plus, Star, Eye, User, 
  Calendar, Tag, DollarSign, Package, Zap, TrendingUp 
} from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  currency: string;
  publisher: string;
  publisherId: string;
  status: 'draft' | 'published' | 'featured';
  featured: boolean;
  views: number;
  downloads: number;
  rating: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function MarketplaceCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch marketplace catalog
  const { data: catalogData, isLoading: catalogLoading } = useQuery({
    queryKey: ['/api/marketplace/catalog'],
    enabled: true
  });

  // Fetch search results when query changes
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/marketplace/search', searchQuery],
    enabled: searchQuery.length > 2
  });

  const items = searchQuery.length > 2 ? searchData?.data : catalogData?.data;
  const categories = catalogData?.meta?.categories || [];
  const publishers = catalogData?.meta?.publishers || [];

  const filteredItems = items?.filter((item: MarketplaceItem) => 
    !selectedCategory || item.category === selectedCategory
  ) || [];

  // Sort items
  const sortedItems = [...filteredItems].sort((a: MarketplaceItem, b: MarketplaceItem) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'popular':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Publish item mutation
  const publishItemMutation = useMutation({
    mutationFn: async (data: Partial<MarketplaceItem>) => {
      return apiRequest('/api/marketplace/publish', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/catalog'] });
      setIsPublishDialogOpen(false);
      toast({
        title: "Item Published",
        description: "Your marketplace item has been published successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Publish Failed",
        description: error.message || "Failed to publish item.",
        variant: "destructive"
      });
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewItem = async (itemId: string) => {
    // This would normally open a detailed view modal
    // For now, we'll just show a toast
    toast({
      title: "Item View",
      description: `Opening detailed view for item ${itemId}`
    });
  };

  if (catalogLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="marketplace-catalog">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search marketplace items..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search-marketplace"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          
          {user && (
            <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-publish-item">
                  <Plus className="h-4 w-4 mr-2" />
                  Publish Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Publish Marketplace Item</DialogTitle>
                </DialogHeader>
                <PublishItemForm 
                  onSubmit={(data) => publishItemMutation.mutate(data)}
                  isLoading={publishItemMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("")}
          data-testid="button-category-all"
        >
          All Categories
        </Button>
        {categories.map((category: string) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            data-testid={`button-category-${category.toLowerCase()}`}
          >
            {category}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList>
          <TabsTrigger value="catalog" data-testid="tab-catalog">Catalog</TabsTrigger>
          <TabsTrigger value="featured" data-testid="tab-featured">Featured</TabsTrigger>
          <TabsTrigger value="stats" data-testid="tab-stats">Statistics</TabsTrigger>
        </TabsList>

        {/* Marketplace Catalog */}
        <TabsContent value="catalog" className="space-y-4">
          {searchLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : sortedItems.length === 0 ? (
            <Alert>
              <AlertDescription>
                {searchQuery ? `No items found for "${searchQuery}"` : "No items available in the marketplace"}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedItems.map((item: MarketplaceItem) => (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewItem(item.id)}
                  data-testid={`item-card-${item.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      <div className="flex gap-1">
                        {item.featured && (
                          <Badge variant="default" className="bg-yellow-500">
                            Featured
                          </Badge>
                        )}
                        <Badge variant="outline">{item.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-semibold">
                          {item.price === 0 ? 'Free' : `$${item.price}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {item.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.publisher}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </span>
                      <span>{item.downloads} downloads</span>
                    </div>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Featured Items */}
        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedItems
              .filter((item: MarketplaceItem) => item.featured)
              .map((item: MarketplaceItem) => (
                <Card key={item.id} className="border-yellow-200" data-testid={`featured-item-${item.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {item.price === 0 ? 'Free' : `$${item.price}`}
                      </span>
                      <Button size="sm" onClick={() => handleViewItem(item.id)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card data-testid="stat-total-items">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{sortedItems.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-featured">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Featured</p>
                    <p className="text-2xl font-bold">
                      {sortedItems.filter((item: MarketplaceItem) => item.featured).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-publishers">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Publishers</p>
                    <p className="text-2xl font-bold">{publishers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-total-views">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">
                      {sortedItems.reduce((sum: number, item: MarketplaceItem) => sum + item.views, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Publish item form component
function PublishItemForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: Partial<MarketplaceItem>) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    price: 0,
    currency: "USD"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Item title"
          required
          data-testid="input-publish-title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Item description"
          required
          data-testid="input-publish-description"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="e.g., templates, tools, plugins"
          required
          data-testid="input-publish-category"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="react, typescript, dashboard"
          data-testid="input-publish-tags"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          data-testid="input-publish-price"
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-submit-publish"
        >
          {isLoading ? "Publishing..." : "Publish Item"}
        </Button>
      </div>
    </form>
  );
}