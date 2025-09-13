import { useState } from "react";
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
}

const sampleTemplates: Template[] = [
  {
    id: "business-strategy",
    title: "Business Strategy Analysis",
    description: "Comprehensive analysis of business strategies and market positioning",
    category: "business",
    rating: 4.8,
    uses: 245,
    complexity: "high",
    tags: ["strategy", "market-analysis", "competition"],
    config: {
      prompt: "Analyze the business strategy and competitive positioning of [Company/Industry]. Consider market dynamics, competitive advantages, potential risks, and strategic recommendations for growth.",
      agents: ["analyst", "pragmatist", "critic"],
      domainExperts: ["financial-analyst", "brand-strategist"],
      reasoningFramework: "strategic_thinking",
      debateRounds: 6,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: true
    }
  },
  {
    id: "technical-architecture",
    title: "Technical Architecture Review",
    description: "In-depth review of technical systems and engineering decisions",
    category: "technology", 
    rating: 4.6,
    uses: 189,
    complexity: "high",
    tags: ["architecture", "engineering", "systems"],
    config: {
      prompt: "Review the technical architecture of [System/Application]. Evaluate scalability, security, maintainability, and performance. Identify potential improvements and architectural trade-offs.",
      agents: ["analyst", "critic", "thoughtful"],
      domainExperts: ["tech-architect", "devops-engineer"],
      reasoningFramework: "systems_thinking",
      debateRounds: 7,
      requireCitations: false,
      enableFactCheck: false,
      enableLiveWeb: false
    }
  },
  {
    id: "market-research",
    title: "Market Research Framework",
    description: "Systematic approach to market research and consumer insights",
    category: "business",
    rating: 4.7,
    uses: 156,
    complexity: "medium",
    tags: ["research", "market", "insights"],
    config: {
      prompt: "Conduct comprehensive market research for [Product/Service/Market]. Analyze target demographics, market size, competitive landscape, pricing strategies, and consumer behavior patterns.",
      agents: ["analyst", "pragmatist", "innovator"],
      domainExperts: ["research-scientist"],
      reasoningFramework: "analytical_framework",
      debateRounds: 5,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: true
    }
  },
  {
    id: "ai-ethics",
    title: "AI Ethics Discussion",
    description: "Comprehensive framework for analyzing AI ethical implications",
    category: "research",
    rating: 4.9,
    uses: 98,
    complexity: "high",
    tags: ["ai", "ethics", "philosophy"],
    config: {
      prompt: "Examine the ethical implications of [AI Technology/Application]. Consider bias, fairness, privacy, transparency, accountability, and societal impact. Provide balanced perspectives on responsible AI development.",
      agents: ["thoughtful", "critic", "analyst"],
      domainExperts: ["behavioral-analyst"],
      reasoningFramework: "ethical_framework",
      debateRounds: 8,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: false
    }
  },
  {
    id: "product-launch",
    title: "Product Launch Strategy",
    description: "Strategic planning for new product introductions",
    category: "business",
    rating: 4.5,
    uses: 203,
    complexity: "medium",
    tags: ["product", "launch", "strategy"],
    config: {
      prompt: "Develop a comprehensive product launch strategy for [Product]. Consider target market, pricing, distribution channels, marketing campaigns, competitive positioning, and success metrics.",
      agents: ["innovator", "pragmatist", "analyst"],
      domainExperts: ["brand-strategist"],
      reasoningFramework: "strategic_thinking",
      debateRounds: 5,
      requireCitations: false,
      enableFactCheck: true,
      enableLiveWeb: true
    }
  },
  {
    id: "security-audit",
    title: "Security Assessment Framework",
    description: "Comprehensive security analysis and risk evaluation",
    category: "technology",
    rating: 4.8,
    uses: 134,
    complexity: "high",
    tags: ["security", "audit", "risk"],
    config: {
      prompt: "Conduct a comprehensive security assessment of [System/Application/Infrastructure]. Identify vulnerabilities, assess risk levels, and recommend security improvements and best practices.",
      agents: ["critic", "analyst", "thoughtful"],
      domainExperts: ["tech-architect"],
      reasoningFramework: "risk_assessment",
      debateRounds: 6,
      requireCitations: false,
      enableFactCheck: false,
      enableLiveWeb: false
    }
  }
];

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

export function TemplateLibrary({ onUseTemplate, onPreviewTemplate }: TemplateLibraryProps = {}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = sampleTemplates.filter(template => {
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
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleUseTemplate(template)}
                          data-testid={`use-template-${template.id}`}
                        >
                          Use Template
                        </Button>
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

            {filteredTemplates.length === 0 && (
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