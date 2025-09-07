import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Download, 
  Edit, 
  Trash2,
  Eye,
  FileText,
  Image,
  File,
  Mail,
  Presentation,
  Code,
  Palette,
  Layout,
  Settings,
  Star,
  Clock,
  Users
} from "lucide-react";

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: "pdf" | "html" | "docx" | "pptx" | "json" | "csv" | "markdown";
  category: "report" | "presentation" | "dashboard" | "summary" | "custom";
  isDefault: boolean;
  isPremium: boolean;
  branding: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    watermark: boolean;
  };
  layout: {
    orientation: "portrait" | "landscape";
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    header: boolean;
    footer: boolean;
    pageNumbers: boolean;
  };
  content: {
    includeExecutiveSummary: boolean;
    includeMethodology: boolean;
    includeDetailedAnalysis: boolean;
    includeRecommendations: boolean;
    includeAppendices: boolean;
    includeCharts: boolean;
    includeTimeline: boolean;
    customSections: string[];
  };
  templateCode: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  rating: number;
  createdBy: string;
}

interface CustomExportTemplatesProps {
  templates?: ExportTemplate[];
  onTemplateCreate?: (template: Omit<ExportTemplate, "id" | "createdAt" | "updatedAt" | "usageCount" | "rating">) => void;
  onTemplateUpdate?: (id: string, template: Partial<ExportTemplate>) => void;
  onTemplateDelete?: (id: string) => void;
  onTemplateExport?: (templateId: string, data: any) => Promise<string>;
  onTemplatePreview?: (templateId: string) => void;
}

const exportFormats = [
  { value: "pdf", label: "PDF Document", icon: FileText, description: "Professional PDF reports" },
  { value: "html", label: "HTML Report", icon: Code, description: "Interactive web reports" },
  { value: "docx", label: "Word Document", icon: FileText, description: "Microsoft Word format" },
  { value: "pptx", label: "PowerPoint", icon: Presentation, description: "Presentation slides" },
  { value: "json", label: "JSON Data", icon: File, description: "Structured data export" },
  { value: "csv", label: "CSV Spreadsheet", icon: File, description: "Comma-separated values" },
  { value: "markdown", label: "Markdown", icon: File, description: "Markdown document" }
];

const templateCategories = [
  { value: "report", label: "Business Report", description: "Formal business analysis reports" },
  { value: "presentation", label: "Presentation", description: "Executive presentations and slides" },
  { value: "dashboard", label: "Dashboard", description: "Interactive data dashboards" },
  { value: "summary", label: "Executive Summary", description: "Brief overview documents" },
  { value: "custom", label: "Custom Format", description: "Custom branded templates" }
];

const colorPresets = [
  { name: "Corporate Blue", primary: "#2563eb", secondary: "#64748b", accent: "#0ea5e9" },
  { name: "Professional Gray", primary: "#374151", secondary: "#6b7280", accent: "#10b981" },
  { name: "Modern Purple", primary: "#7c3aed", secondary: "#a855f7", accent: "#ec4899" },
  { name: "Executive Green", primary: "#059669", secondary: "#065f46", accent: "#34d399" },
  { name: "Innovation Orange", primary: "#ea580c", secondary: "#fb923c", accent: "#fde047" }
];

const sampleTemplates: ExportTemplate[] = [
  {
    id: "executive-summary",
    name: "Executive Summary Report",
    description: "Professional executive summary with key findings and recommendations",
    format: "pdf",
    category: "summary",
    isDefault: true,
    isPremium: false,
    branding: {
      logo: "/assets/company-logo.png",
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        accent: "#0ea5e9"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      },
      watermark: false
    },
    layout: {
      orientation: "portrait",
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      header: true,
      footer: true,
      pageNumbers: true
    },
    content: {
      includeExecutiveSummary: true,
      includeMethodology: false,
      includeDetailedAnalysis: false,
      includeRecommendations: true,
      includeAppendices: false,
      includeCharts: true,
      includeTimeline: false,
      customSections: ["Key Insights", "Next Steps"]
    },
    templateCode: "<!-- Executive Summary Template -->",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    usageCount: 145,
    rating: 4.7,
    createdBy: "System"
  },
  {
    id: "detailed-analysis",
    name: "Comprehensive Analysis Report",
    description: "Detailed analysis report with full methodology and appendices",
    format: "pdf",
    category: "report",
    isDefault: false,
    isPremium: true,
    branding: {
      logo: "/assets/company-logo.png",
      colors: {
        primary: "#059669",
        secondary: "#065f46",
        accent: "#34d399"
      },
      fonts: {
        heading: "Roboto",
        body: "Open Sans"
      },
      watermark: true
    },
    layout: {
      orientation: "portrait",
      margins: { top: 25, right: 25, bottom: 25, left: 25 },
      header: true,
      footer: true,
      pageNumbers: true
    },
    content: {
      includeExecutiveSummary: true,
      includeMethodology: true,
      includeDetailedAnalysis: true,
      includeRecommendations: true,
      includeAppendices: true,
      includeCharts: true,
      includeTimeline: true,
      customSections: ["Risk Assessment", "Implementation Plan", "ROI Analysis"]
    },
    templateCode: "<!-- Comprehensive Analysis Template -->",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    usageCount: 67,
    rating: 4.9,
    createdBy: "Admin User"
  },
  {
    id: "presentation-deck",
    name: "Executive Presentation",
    description: "PowerPoint presentation template for executive briefings",
    format: "pptx",
    category: "presentation",
    isDefault: false,
    isPremium: true,
    branding: {
      logo: "/assets/company-logo.png",
      colors: {
        primary: "#7c3aed",
        secondary: "#a855f7",
        accent: "#ec4899"
      },
      fonts: {
        heading: "Montserrat",
        body: "Source Sans Pro"
      },
      watermark: false
    },
    layout: {
      orientation: "landscape",
      margins: { top: 15, right: 15, bottom: 15, left: 15 },
      header: false,
      footer: true,
      pageNumbers: false
    },
    content: {
      includeExecutiveSummary: true,
      includeMethodology: false,
      includeDetailedAnalysis: true,
      includeRecommendations: true,
      includeAppendices: false,
      includeCharts: true,
      includeTimeline: true,
      customSections: ["Key Takeaways", "Action Items"]
    },
    templateCode: "<!-- Executive Presentation Template -->",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    usageCount: 23,
    rating: 4.5,
    createdBy: "Design Team"
  }
];

export function CustomExportTemplates({
  templates = sampleTemplates,
  onTemplateCreate,
  onTemplateUpdate,
  onTemplateDelete,
  onTemplateExport,
  onTemplatePreview
}: CustomExportTemplatesProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExportTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ExportTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<ExportTemplate>>({
    name: "",
    description: "",
    format: "pdf",
    category: "report",
    isDefault: false,
    isPremium: false,
    branding: {
      logo: "",
      colors: colorPresets[0],
      fonts: {
        heading: "Inter",
        body: "Inter"
      },
      watermark: false
    },
    layout: {
      orientation: "portrait",
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      header: true,
      footer: true,
      pageNumbers: true
    },
    content: {
      includeExecutiveSummary: true,
      includeMethodology: false,
      includeDetailedAnalysis: true,
      includeRecommendations: true,
      includeAppendices: false,
      includeCharts: true,
      includeTimeline: false,
      customSections: []
    },
    templateCode: "",
    createdBy: "Current User"
  });

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.description) {
      onTemplateCreate?.({
        name: newTemplate.name!,
        description: newTemplate.description!,
        format: newTemplate.format!,
        category: newTemplate.category!,
        isDefault: false,
        isPremium: newTemplate.isPremium!,
        branding: newTemplate.branding!,
        layout: newTemplate.layout!,
        content: newTemplate.content!,
        templateCode: newTemplate.templateCode!,
        createdBy: newTemplate.createdBy!
      });
      setNewTemplate({
        name: "",
        description: "",
        format: "pdf",
        category: "report",
        isDefault: false,
        isPremium: false,
        branding: {
          logo: "",
          colors: colorPresets[0],
          fonts: {
            heading: "Inter",
            body: "Inter"
          },
          watermark: false
        },
        layout: {
          orientation: "portrait",
          margins: { top: 20, right: 20, bottom: 20, left: 20 },
          header: true,
          footer: true,
          pageNumbers: true
        },
        content: {
          includeExecutiveSummary: true,
          includeMethodology: false,
          includeDetailedAnalysis: true,
          includeRecommendations: true,
          includeAppendices: false,
          includeCharts: true,
          includeTimeline: false,
          customSections: []
        },
        templateCode: "",
        createdBy: "Current User"
      });
      setIsCreateDialogOpen(false);
    }
  };

  const getFormatInfo = (format: string) => {
    return exportFormats.find(f => f.value === format) || exportFormats[0];
  };

  const getCategoryInfo = (category: string) => {
    return templateCategories.find(c => c.value === category) || templateCategories[templateCategories.length - 1];
  };

  const renderStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layout className="text-primary" size={20} />
            Custom Export Templates
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {templates.length} template{templates.length !== 1 ? 's' : ''}
            </Badge>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="create-template-button">
                  <Plus className="h-4 w-4 mr-1" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Custom Export Template</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <Tabs defaultValue="basic" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="branding">Branding</TabsTrigger>
                      <TabsTrigger value="layout">Layout</TabsTrigger>
                      <TabsTrigger value="content">Content</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="template-name">Template Name</Label>
                          <Input
                            id="template-name"
                            value={newTemplate.name || ""}
                            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Executive Summary"
                            data-testid="template-name-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="template-format">Export Format</Label>
                          <Select
                            value={newTemplate.format}
                            onValueChange={(value) => setNewTemplate(prev => ({ ...prev, format: value as any }))}
                          >
                            <SelectTrigger data-testid="template-format-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {exportFormats.map((format) => (
                                <SelectItem key={format.value} value={format.value}>
                                  <div className="flex items-center gap-2">
                                    <format.icon className="h-4 w-4" />
                                    <div>
                                      <div>{format.label}</div>
                                      <div className="text-xs text-muted-foreground">{format.description}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="template-description">Description</Label>
                        <Textarea
                          id="template-description"
                          value={newTemplate.description || ""}
                          onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this template is used for..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="template-category">Category</Label>
                        <Select
                          value={newTemplate.category}
                          onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {templateCategories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                <div>
                                  <div>{category.label}</div>
                                  <div className="text-xs text-muted-foreground">{category.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="template-premium"
                          checked={newTemplate.isPremium || false}
                          onCheckedChange={(checked) => setNewTemplate(prev => ({ ...prev, isPremium: checked }))}
                        />
                        <Label htmlFor="template-premium">Premium Template</Label>
                      </div>
                    </TabsContent>

                    <TabsContent value="branding" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Color Scheme</Label>
                          <div className="grid grid-cols-1 gap-3">
                            {colorPresets.map((preset) => (
                              <div
                                key={preset.name}
                                className={`p-3 border rounded cursor-pointer ${
                                  newTemplate.branding?.colors.primary === preset.primary ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => setNewTemplate(prev => ({
                                  ...prev,
                                  branding: {
                                    ...prev.branding!,
                                    colors: preset
                                  }
                                }))}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{preset.name}</span>
                                  <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }} />
                                    <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }} />
                                    <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.accent }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="heading-font">Heading Font</Label>
                            <Select
                              value={newTemplate.branding?.fonts.heading}
                              onValueChange={(value) => setNewTemplate(prev => ({
                                ...prev,
                                branding: {
                                  ...prev.branding!,
                                  fonts: {
                                    ...prev.branding!.fonts,
                                    heading: value
                                  }
                                }
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                                <SelectItem value="Montserrat">Montserrat</SelectItem>
                                <SelectItem value="Open Sans">Open Sans</SelectItem>
                                <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="body-font">Body Font</Label>
                            <Select
                              value={newTemplate.branding?.fonts.body}
                              onValueChange={(value) => setNewTemplate(prev => ({
                                ...prev,
                                branding: {
                                  ...prev.branding!,
                                  fonts: {
                                    ...prev.branding!.fonts,
                                    body: value
                                  }
                                }
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Roboto">Roboto</SelectItem>
                                <SelectItem value="Open Sans">Open Sans</SelectItem>
                                <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                                <SelectItem value="Lato">Lato</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="watermark"
                            checked={newTemplate.branding?.watermark || false}
                            onCheckedChange={(checked) => setNewTemplate(prev => ({
                              ...prev,
                              branding: {
                                ...prev.branding!,
                                watermark: checked
                              }
                            }))}
                          />
                          <Label htmlFor="watermark">Include Watermark</Label>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="layout" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Orientation</Label>
                          <Select
                            value={newTemplate.layout?.orientation}
                            onValueChange={(value) => setNewTemplate(prev => ({
                              ...prev,
                              layout: {
                                ...prev.layout!,
                                orientation: value as any
                              }
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="portrait">Portrait</SelectItem>
                              <SelectItem value="landscape">Landscape</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Page Elements</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="header"
                              checked={newTemplate.layout?.header || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                layout: {
                                  ...prev.layout!,
                                  header: checked
                                }
                              }))}
                            />
                            <Label htmlFor="header">Header</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="footer"
                              checked={newTemplate.layout?.footer || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                layout: {
                                  ...prev.layout!,
                                  footer: checked
                                }
                              }))}
                            />
                            <Label htmlFor="footer">Footer</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="page-numbers"
                              checked={newTemplate.layout?.pageNumbers || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                layout: {
                                  ...prev.layout!,
                                  pageNumbers: checked
                                }
                              }))}
                            />
                            <Label htmlFor="page-numbers">Page Numbers</Label>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                      <div className="space-y-3">
                        <Label>Include Sections</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="executive-summary"
                              checked={newTemplate.content?.includeExecutiveSummary || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content!,
                                  includeExecutiveSummary: checked
                                }
                              }))}
                            />
                            <Label htmlFor="executive-summary">Executive Summary</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="methodology"
                              checked={newTemplate.content?.includeMethodology || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content!,
                                  includeMethodology: checked
                                }
                              }))}
                            />
                            <Label htmlFor="methodology">Methodology</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="detailed-analysis"
                              checked={newTemplate.content?.includeDetailedAnalysis || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content!,
                                  includeDetailedAnalysis: checked
                                }
                              }))}
                            />
                            <Label htmlFor="detailed-analysis">Detailed Analysis</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="recommendations"
                              checked={newTemplate.content?.includeRecommendations || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content!,
                                  includeRecommendations: checked
                                }
                              }))}
                            />
                            <Label htmlFor="recommendations">Recommendations</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="charts"
                              checked={newTemplate.content?.includeCharts || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content!,
                                  includeCharts: checked
                                }
                              }))}
                            />
                            <Label htmlFor="charts">Charts & Visuals</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="timeline"
                              checked={newTemplate.content?.includeTimeline || false}
                              onCheckedChange={(checked) => setNewTemplate(prev => ({
                                ...prev,
                                content: {
                                  ...prev.content!,
                                  includeTimeline: checked
                                }
                              }))}
                            />
                            <Label htmlFor="timeline">Visual Timeline</Label>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.description}>
                      Create Template
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid gap-4">
              {templates.map((template) => {
                const formatInfo = getFormatInfo(template.format);
                const categoryInfo = getCategoryInfo(template.category);
                const FormatIcon = formatInfo.icon;

                return (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <FormatIcon className="h-6 w-6" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold">{template.name}</h3>
                              {template.isDefault && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                              {template.isPremium && (
                                <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800">Premium</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Format:</span> {formatInfo.label} • 
                              <span className="font-medium"> Category:</span> {categoryInfo.label}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {renderStarRating(template.rating)}
                              <span className="ml-1">{template.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{template.usageCount} uses</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <div className="w-6 h-6 rounded" style={{ backgroundColor: template.branding.colors.primary }} />
                            <span className="text-xs text-muted-foreground">
                              {template.branding.fonts.heading} • {template.layout.orientation} • 
                              {template.layout.header && template.layout.footer ? ' Full layout' : ' Basic layout'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTemplatePreview?.(template.id)}
                          data-testid={`preview-template-${template.id}`}
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTemplateExport?.(template.id, {})}
                        >
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTemplateDelete?.(template.id)}
                          disabled={template.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Download className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {templates.reduce((acc, t) => acc + t.usageCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Exports</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {templates.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Templates</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {(templates.reduce((acc, t) => acc + t.rating, 0) / templates.length).toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Template Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .map((template) => (
                      <div key={template.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground">{template.format.toUpperCase()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ 
                                width: `${(template.usageCount / Math.max(...templates.map(t => t.usageCount))) * 100}%` 
                              }}
                            />
                          </div>
                          <div className="text-sm font-medium w-12 text-right">
                            {template.usageCount}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Default Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-generate previews</Label>
                    <div className="text-xs text-muted-foreground">Automatically create preview images for templates</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable template sharing</Label>
                    <div className="text-xs text-muted-foreground">Allow templates to be shared with team members</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Version control</Label>
                    <div className="text-xs text-muted-foreground">Keep track of template versions and changes</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}