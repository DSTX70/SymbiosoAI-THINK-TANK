import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, BookOpen, Eye, Calendar, User, 
  ArrowRight, Star, Filter, FileText 
} from "lucide-react";

interface Doc {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  slug: string;
  published: boolean;
  views: number;
  author: string;
  created_at: string;
  updated_at: string;
}

export default function DocsViewer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  // Fetch docs index
  const { data: docsData, isLoading: docsLoading } = useQuery({
    queryKey: ['/api/docs/index'],
    enabled: true
  });

  // Fetch search results when query changes
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/docs/search', searchQuery],
    enabled: searchQuery.length > 2
  });

  const docs = searchQuery.length > 2 ? searchData?.data : docsData?.data;
  const categories = docsData?.meta?.categories || [];

  const filteredDocs = docs?.filter((doc: Doc) => 
    !selectedCategory || doc.category === selectedCategory
  ) || [];

  const handleDocSelect = (doc: Doc) => {
    setSelectedDoc(doc);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (docsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="docs-viewer">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search-docs"
          />
        </div>
        <div className="flex gap-2">
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
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList>
          <TabsTrigger value="browse" data-testid="tab-browse">Browse</TabsTrigger>
          <TabsTrigger value="viewer" data-testid="tab-viewer">Document Viewer</TabsTrigger>
        </TabsList>

        {/* Browse Documentation */}
        <TabsContent value="browse" className="space-y-4">
          {searchLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : filteredDocs.length === 0 ? (
            <Alert>
              <AlertDescription>
                {searchQuery ? `No documentation found for "${searchQuery}"` : "No documentation available"}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc: Doc) => (
                <Card 
                  key={doc.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleDocSelect(doc)}
                  data-testid={`doc-card-${doc.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
                      <Badge variant={doc.published ? "default" : "secondary"}>
                        {doc.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {doc.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {doc.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {doc.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {doc.author}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {doc.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{doc.tags.length - 3} more
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

        {/* Document Viewer */}
        <TabsContent value="viewer" className="space-y-4">
          {selectedDoc ? (
            <Card data-testid="doc-viewer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedDoc.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {selectedDoc.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {selectedDoc.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedDoc.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {selectedDoc.views} views
                      </span>
                    </div>
                  </div>
                  <Badge variant={selectedDoc.published ? "default" : "secondary"}>
                    {selectedDoc.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {selectedDoc.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </ScrollArea>
                
                {selectedDoc.tags && selectedDoc.tags.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoc.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Select a document from the Browse tab to view its content here.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="stat-total-docs">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Docs</p>
                <p className="text-2xl font-bold">{filteredDocs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-categories">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-published">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">
                  {filteredDocs.filter((doc: Doc) => doc.published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-views">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {filteredDocs.reduce((sum: number, doc: Doc) => sum + doc.views, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}