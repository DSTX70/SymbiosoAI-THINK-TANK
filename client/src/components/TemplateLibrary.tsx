import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Users, 
  FileText, 
  Plus, 
  Upload, 
  Eye,
  Download,
  Briefcase,
  Code,
  GraduationCap,
  FlaskConical
} from "lucide-react";

interface ServerTemplate {
  id: string;
  name: string;
  description: string;
  category: "business" | "technology" | "education" | "research";
  tags: string[];
  content: {
    prompt: string;
    agents: string[];
    domainExperts: string[];
    reasoningFramework: string;
    debateRounds: number;
    requireCitations: boolean;
    enableFactCheck: boolean;
    enableLiveWeb: boolean;
    rating: number;
    uses: number;
    complexity: "low" | "medium" | "high";
  };
  isPublic: boolean;
  usageCount: number;
  authorId: string;
  version: number;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface Template {
  id: string;
  title: string;
  description: string;
  category: "business" | "technology" | "education" | "research";
  rating: number;
  uses: number;
  complexity: "low" | "medium" | "high";
  tags: string[];
  config: {
    prompt: string;
    agents: string[];
    domainExperts: string[];
    reasoningFramework: string;
    debateRounds: number;
    requireCitations: boolean;
    enableFactCheck: boolean;
    enableLiveWeb: boolean;
  };
}

interface TemplateLibraryProps {
  onUseTemplate?: (template: Template) => void;
  onPreviewTemplate?: (template: Template) => void;
  selectedTemplateId?: string | null;
  onClearTemplate?: () => void;
}

// Transform server template to client template format
function transformServerTemplate(serverTemplate: ServerTemplate): Template {
  return {
    id: serverTemplate.id,
    title: serverTemplate.name,
    description: serverTemplate.description,
    category: serverTemplate.category,
    rating: serverTemplate.content.rating,
    uses: serverTemplate.content.uses,
    complexity: serverTemplate.content.complexity,
    tags: serverTemplate.tags || [],
    config: {
      prompt: serverTemplate.content.prompt,
      agents: serverTemplate.content.agents,
      domainExperts: serverTemplate.content.domainExperts,
      reasoningFramework: serverTemplate.content.reasoningFramework,
      debateRounds: serverTemplate.content.debateRounds,
      requireCitations: serverTemplate.content.requireCitations,
      enableFactCheck: serverTemplate.content.enableFactCheck,
      enableLiveWeb: serverTemplate.content.enableLiveWeb
    }
  };
}

const categoryIcons = {
  business: Briefcase,
  technology: Code,
  education: GraduationCap,
  research: FlaskConical
};

const categoryColors = {
  business: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  technology: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  education: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  research: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
};

export function TemplateLibrary({ 
  onUseTemplate, 
  onPreviewTemplate, 
  selectedTemplateId, 
  onClearTemplate 
}: TemplateLibraryProps = {}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch templates from the API
  const { data: serverTemplates = [], isLoading, error } = useQuery<ServerTemplate[]>({
    queryKey: ['/api/templates'],
  });

  // Transform server templates to client format
  const templates = serverTemplates.map(transformServerTemplate);

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: Template) => {
    if (onUseTemplate) {
      onUseTemplate(template);
    } else {
      console.log("Using template:", template.title, template.config);
    }
  };

  const handlePreviewTemplate = (template: Template) => {
    if (onPreviewTemplate) {
      onPreviewTemplate(template);
    } else {
      console.log("Previewing template:", template.title, template.config);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Template Library</h3>
          <p className="text-sm text-muted-foreground">Pre-built debate frameworks and analysis templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus size={14} className="mr-1" />
            Create Template
          </Button>
          <Button variant="outline" size="sm">
            <Upload size={14} className="mr-1" />
            Import Template
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="template-search"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" data-testid="category-all">All</TabsTrigger>
          <TabsTrigger value="business" data-testid="category-business">Business</TabsTrigger>
          <TabsTrigger value="technology" data-testid="category-technology">Technology</TabsTrigger>
          <TabsTrigger value="education" data-testid="category-education">Education</TabsTrigger>
          <TabsTrigger value="research" data-testid="category-research">Research</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading templates...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">Error loading templates</h4>
                <p className="text-muted-foreground">Please try again later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => {
                const IconComponent = categoryIcons[template.category];
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent size={16} className="text-muted-foreground" />
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${categoryColors[template.category]}`}
                          >
                            {template.category.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          {template.rating}
                        </div>
                      </div>
                      <CardTitle className="text-base">{template.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          {template.uses} uses
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            template.complexity === 'high' ? 'border-red-200 text-red-700' :
                            template.complexity === 'medium' ? 'border-yellow-200 text-yellow-700' :
                            'border-green-200 text-green-700'
                          }`}
                        >
                          {template.complexity} complexity
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        {selectedTemplateId === template.id ? (
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="flex-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
                            onClick={() => onClearTemplate?.()}
                            data-testid={`clear-template-${template.id}`}
                          >
                            ✓ Template Active
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleUseTemplate(template)}
                            data-testid={`use-template-${template.id}`}
                          >
                            Use Template
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreviewTemplate(template)}
                          data-testid={`preview-template-${template.id}`}
                        >
                          <Eye size={14} className="mr-1" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            )}

            {!isLoading && !error && filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No templates found</h4>
                <p className="text-muted-foreground">Try adjusting your search or category filter</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}