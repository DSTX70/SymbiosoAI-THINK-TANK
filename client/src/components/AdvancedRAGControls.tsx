import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Database, 
  Search, 
  Filter,
  Settings,
  Target,
  Zap,
  BookOpen,
  Globe,
  Code,
  FileText,
  Brain,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RAGConfig {
  // Retrieval Settings
  topK: number;
  similarityThreshold: number;
  maxTokens: number;
  chunkSize: number;
  chunkOverlap: number;
  
  // Search Configuration  
  hybridSearch: boolean;
  semanticWeight: number;
  lexicalWeight: number;
  rerankEnabled: boolean;
  
  // Data Sources
  webSearch: boolean;
  codeRepositories: boolean;
  documentLibraries: boolean;
  knowledgeBase: boolean;
  realTimeData: boolean;
  
  // Advanced Features
  multiModalRetrieval: boolean;
  temporalFiltering: boolean;
  domainSpecificEmbeddings: boolean;
  queryExpansion: boolean;
  contextualRerank: boolean;
  
  // Quality Controls
  relevanceFiltering: boolean;
  duplicateRemoval: boolean;
  sourceValidation: boolean;
  contentFiltering: string[];
  
  // Performance
  cachingEnabled: boolean;
  parallelRetrieval: boolean;
  responseStreaming: boolean;
  
  // Custom Settings
  customEmbeddingModel: string;
  customPromptTemplate: string;
  excludedSources: string[];
  prioritizedDomains: string[];
}

interface AdvancedRAGControlsProps {
  config?: Partial<RAGConfig>;
  onChange?: (config: RAGConfig) => void;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const defaultConfig: RAGConfig = {
  // Retrieval Settings
  topK: 5,
  similarityThreshold: 0.7,
  maxTokens: 1000,
  chunkSize: 512,
  chunkOverlap: 50,
  
  // Search Configuration
  hybridSearch: true,
  semanticWeight: 0.7,
  lexicalWeight: 0.3,
  rerankEnabled: true,
  
  // Data Sources
  webSearch: true,
  codeRepositories: false,
  documentLibraries: true,
  knowledgeBase: true,
  realTimeData: false,
  
  // Advanced Features
  multiModalRetrieval: false,
  temporalFiltering: false,
  domainSpecificEmbeddings: true,
  queryExpansion: true,
  contextualRerank: true,
  
  // Quality Controls
  relevanceFiltering: true,
  duplicateRemoval: true,
  sourceValidation: true,
  contentFiltering: [],
  
  // Performance
  cachingEnabled: true,
  parallelRetrieval: true,
  responseStreaming: false,
  
  // Custom Settings
  customEmbeddingModel: "text-embedding-3-large",
  customPromptTemplate: "",
  excludedSources: [],
  prioritizedDomains: []
};

const embeddingModels = [
  { value: "text-embedding-3-large", label: "OpenAI Text Embedding 3 Large", dimensions: 3072, performance: "High" },
  { value: "text-embedding-3-small", label: "OpenAI Text Embedding 3 Small", dimensions: 1536, performance: "Fast" },
  { value: "text-embedding-ada-002", label: "OpenAI Ada 002 (Legacy)", dimensions: 1536, performance: "Standard" },
  { value: "sentence-transformers", label: "Sentence Transformers", dimensions: 768, performance: "Open Source" },
  { value: "cohere-embed", label: "Cohere Embed", dimensions: 4096, performance: "Multilingual" }
];

const dataSourceConfig = [
  { key: "webSearch", label: "Web Search", icon: Globe, description: "Real-time web search results" },
  { key: "codeRepositories", label: "Code Repositories", icon: Code, description: "GitHub, GitLab, and other code sources" },
  { key: "documentLibraries", label: "Document Libraries", icon: FileText, description: "PDFs, Word docs, presentations" },
  { key: "knowledgeBase", label: "Knowledge Base", icon: BookOpen, description: "Curated knowledge articles" },
  { key: "realTimeData", label: "Real-time Data", icon: Zap, description: "Live data feeds and APIs" }
];

export function AdvancedRAGControls({
  config: initialConfig = {},
  onChange,
  isEnabled = false,
  onToggle
}: AdvancedRAGControlsProps) {
  const [config, setConfig] = useState<RAGConfig>({
    ...defaultConfig,
    ...initialConfig
  });

  const updateConfig = (updates: Partial<RAGConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onChange?.(newConfig);
  };

  const getPerformanceEstimate = () => {
    let score = 50; // Base score
    
    // Retrieval impact
    if (config.topK > 10) score -= 10;
    if (config.hybridSearch) score += 15;
    if (config.rerankEnabled) score -= 5;
    
    // Advanced features impact
    if (config.multiModalRetrieval) score -= 15;
    if (config.queryExpansion) score -= 5;
    if (config.contextualRerank) score -= 5;
    
    // Performance optimizations
    if (config.cachingEnabled) score += 20;
    if (config.parallelRetrieval) score += 10;
    if (config.responseStreaming) score += 5;
    
    return Math.min(Math.max(score, 0), 100);
  };

  const getQualityScore = () => {
    let score = 50;
    
    if (config.similarityThreshold > 0.8) score += 15;
    if (config.rerankEnabled) score += 20;
    if (config.sourceValidation) score += 10;
    if (config.relevanceFiltering) score += 10;
    if (config.duplicateRemoval) score += 5;
    if (config.domainSpecificEmbeddings) score += 15;
    
    return Math.min(score, 100);
  };

  const performanceScore = getPerformanceEstimate();
  const qualityScore = getQualityScore();

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="text-primary" size={20} />
            Advanced RAG Controls
            {isEnabled && <Badge variant="default" className="animate-pulse">Active</Badge>}
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            data-testid="rag-controls-toggle"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="retrieval" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-1">
            <TabsTrigger value="retrieval">Retrieval</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="retrieval" className="space-y-6">
            {/* Core Retrieval Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Top K Results</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.topK} documents
                  </Badge>
                </div>
                <Slider
                  value={[config.topK]}
                  onValueChange={([value]) => updateConfig({ topK: value })}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="top-k-slider"
                />
                <div className="text-xs text-muted-foreground">
                  Number of most relevant documents to retrieve
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Similarity Threshold</Label>
                  <Badge variant="outline" className="text-xs">
                    {(config.similarityThreshold * 100).toFixed(0)}%
                  </Badge>
                </div>
                <Slider
                  value={[config.similarityThreshold]}
                  onValueChange={([value]) => updateConfig({ similarityThreshold: value })}
                  max={1}
                  min={0.3}
                  step={0.05}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Minimum similarity score to include results
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Max Tokens</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.maxTokens}
                  </Badge>
                </div>
                <Slider
                  value={[config.maxTokens]}
                  onValueChange={([value]) => updateConfig({ maxTokens: value })}
                  max={4000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Maximum tokens to retrieve from each document
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Chunk Size</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.chunkSize} tokens
                  </Badge>
                </div>
                <Slider
                  value={[config.chunkSize]}
                  onValueChange={([value]) => updateConfig({ chunkSize: value })}
                  max={2048}
                  min={128}
                  step={64}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Size of text chunks for processing
                </div>
              </div>
            </div>

            {/* Search Configuration */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Configuration
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Hybrid Search</Label>
                  <div className="text-xs text-muted-foreground">Combine semantic and lexical search</div>
                </div>
                <Switch
                  checked={config.hybridSearch}
                  onCheckedChange={(checked) => updateConfig({ hybridSearch: checked })}
                  data-testid="hybrid-search-switch"
                />
              </div>

              {config.hybridSearch && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">Semantic Weight</Label>
                      <span className="text-xs">{(config.semanticWeight * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[config.semanticWeight]}
                      onValueChange={([value]) => updateConfig({ 
                        semanticWeight: value, 
                        lexicalWeight: 1 - value 
                      })}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">Lexical Weight</Label>
                      <span className="text-xs">{(config.lexicalWeight * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[config.lexicalWeight]}
                      onValueChange={([value]) => updateConfig({ 
                        lexicalWeight: value, 
                        semanticWeight: 1 - value 
                      })}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Re-ranking</Label>
                  <div className="text-xs text-muted-foreground">Re-rank results for better relevance</div>
                </div>
                <Switch
                  checked={config.rerankEnabled}
                  onCheckedChange={(checked) => updateConfig({ rerankEnabled: checked })}
                />
              </div>
            </div>

            {/* Embedding Model Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Embedding Model</Label>
              <Select
                value={config.customEmbeddingModel}
                onValueChange={(value) => updateConfig({ customEmbeddingModel: value })}
              >
                <SelectTrigger data-testid="embedding-model-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {embeddingModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div>
                        <div className="font-medium">{model.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {model.dimensions}D • {model.performance}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data Sources
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataSourceConfig.map((source) => {
                  const Icon = source.icon;
                  const isEnabled = config[source.key as keyof RAGConfig] as boolean;
                  
                  return (
                    <div key={source.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <div>
                          <Label className="text-sm font-medium">{source.label}</Label>
                          <div className="text-xs text-muted-foreground">{source.description}</div>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => updateConfig({ [source.key]: checked })}
                        data-testid={`${source.key}-switch`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Source Filtering */}
            <div className="space-y-4">
              <h3 className="font-semibold">Source Management</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Prioritized Domains</Label>
                  <Textarea
                    placeholder="Enter trusted domains (one per line)&#10;Example:&#10;*.edu&#10;*.gov&#10;wikipedia.org&#10;nature.com"
                    value={config.prioritizedDomains.join('\n')}
                    onChange={(e) => updateConfig({ 
                      prioritizedDomains: e.target.value.split('\n').filter(d => d.trim()) 
                    })}
                    rows={4}
                    data-testid="prioritized-domains-textarea"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Results from these domains will be prioritized
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Excluded Sources</Label>
                  <Textarea
                    placeholder="Enter sources to exclude (one per line)&#10;Example:&#10;social-media-site.com&#10;low-quality-blog.com"
                    value={config.excludedSources.join('\n')}
                    onChange={(e) => updateConfig({ 
                      excludedSources: e.target.value.split('\n').filter(d => d.trim()) 
                    })}
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    These sources will be excluded from search results
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Advanced Features
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Multi-Modal Retrieval</Label>
                    <div className="text-xs text-muted-foreground">Include images, tables, charts</div>
                  </div>
                  <Switch
                    checked={config.multiModalRetrieval}
                    onCheckedChange={(checked) => updateConfig({ multiModalRetrieval: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Temporal Filtering</Label>
                    <div className="text-xs text-muted-foreground">Filter by recency/relevance</div>
                  </div>
                  <Switch
                    checked={config.temporalFiltering}
                    onCheckedChange={(checked) => updateConfig({ temporalFiltering: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Domain-Specific Embeddings</Label>
                    <div className="text-xs text-muted-foreground">Use specialized embeddings</div>
                  </div>
                  <Switch
                    checked={config.domainSpecificEmbeddings}
                    onCheckedChange={(checked) => updateConfig({ domainSpecificEmbeddings: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Query Expansion</Label>
                    <div className="text-xs text-muted-foreground">Expand queries with synonyms</div>
                  </div>
                  <Switch
                    checked={config.queryExpansion}
                    onCheckedChange={(checked) => updateConfig({ queryExpansion: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Contextual Re-rank</Label>
                    <div className="text-xs text-muted-foreground">Re-rank based on context</div>
                  </div>
                  <Switch
                    checked={config.contextualRerank}
                    onCheckedChange={(checked) => updateConfig({ contextualRerank: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Quality Controls */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Quality Controls
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Relevance Filtering</Label>
                    <div className="text-xs text-muted-foreground">Filter low-relevance results</div>
                  </div>
                  <Switch
                    checked={config.relevanceFiltering}
                    onCheckedChange={(checked) => updateConfig({ relevanceFiltering: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Duplicate Removal</Label>
                    <div className="text-xs text-muted-foreground">Remove similar results</div>
                  </div>
                  <Switch
                    checked={config.duplicateRemoval}
                    onCheckedChange={(checked) => updateConfig({ duplicateRemoval: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Source Validation</Label>
                    <div className="text-xs text-muted-foreground">Validate source credibility</div>
                  </div>
                  <Switch
                    checked={config.sourceValidation}
                    onCheckedChange={(checked) => updateConfig({ sourceValidation: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Custom Prompt Template */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Custom Prompt Template</Label>
              <Textarea
                placeholder="Enter custom prompt template for RAG processing...&#10;&#10;Variables available:&#10;{query} - User query&#10;{context} - Retrieved context&#10;{sources} - Source information"
                value={config.customPromptTemplate}
                onChange={(e) => updateConfig({ customPromptTemplate: e.target.value })}
                rows={6}
                data-testid="custom-prompt-textarea"
              />
              <div className="text-xs text-muted-foreground">
                Leave empty to use default template
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Optimizations */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Performance Optimizations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Caching</Label>
                    <div className="text-xs text-muted-foreground">Cache frequent queries</div>
                  </div>
                  <Switch
                    checked={config.cachingEnabled}
                    onCheckedChange={(checked) => updateConfig({ cachingEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Parallel Retrieval</Label>
                    <div className="text-xs text-muted-foreground">Retrieve from multiple sources simultaneously</div>
                  </div>
                  <Switch
                    checked={config.parallelRetrieval}
                    onCheckedChange={(checked) => updateConfig({ parallelRetrieval: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Response Streaming</Label>
                    <div className="text-xs text-muted-foreground">Stream results as they arrive</div>
                  </div>
                  <Switch
                    checked={config.responseStreaming}
                    onCheckedChange={(checked) => updateConfig({ responseStreaming: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Performance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {performanceScore}%
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Expected Response Speed
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-600 rounded-full h-2 transition-all duration-500" 
                        style={{ width: `${performanceScore}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Quality Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {qualityScore}%
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Expected Result Quality
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-600 rounded-full h-2 transition-all duration-500" 
                        style={{ width: `${qualityScore}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuration Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuration Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Data Sources Enabled:</span>
                  <Badge variant="outline">
                    {[config.webSearch, config.codeRepositories, config.documentLibraries, 
                      config.knowledgeBase, config.realTimeData].filter(Boolean).length} / 5
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Advanced Features:</span>
                  <Badge variant="outline">
                    {[config.multiModalRetrieval, config.temporalFiltering, config.domainSpecificEmbeddings,
                      config.queryExpansion, config.contextualRerank].filter(Boolean).length} / 5
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Quality Controls:</span>
                  <Badge variant="outline">
                    {[config.relevanceFiltering, config.duplicateRemoval, config.sourceValidation].filter(Boolean).length} / 3
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Performance Optimizations:</span>
                  <Badge variant="outline">
                    {[config.cachingEnabled, config.parallelRetrieval, config.responseStreaming].filter(Boolean).length} / 3
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}