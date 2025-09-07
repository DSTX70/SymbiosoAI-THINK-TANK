import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Briefcase, 
  Building2,
  Search,
  Star,
  Filter,
  UserPlus,
  Award,
  Target,
  TrendingUp,
  Shield,
  Stethoscope,
  Calculator,
  Code,
  GraduationCap,
  Factory,
  Gavel,
  Leaf,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnterpriseSpecialist {
  id: string;
  name: string;
  title: string;
  industry: string;
  specialization: string[];
  expertise: string[];
  experience: string;
  certifications: string[];
  successRate: number;
  collaborations: number;
  isActive: boolean;
  pricing: "standard" | "premium" | "enterprise";
  availability: "high" | "medium" | "low";
  languages: string[];
  timezone: string;
}

interface EnterpriseSpecialistsProps {
  specialists?: EnterpriseSpecialist[];
  selectedSpecialists?: string[];
  onChange?: (specialists: string[]) => void;
  industryFilter?: string;
  onIndustryFilterChange?: (industry: string) => void;
}

const enterpriseSpecialists: EnterpriseSpecialist[] = [
  {
    id: "financial-strategist",
    name: "Dr. Sarah Chen",
    title: "Senior Financial Strategist",
    industry: "Financial Services",
    specialization: ["Investment Strategy", "Risk Management", "Portfolio Optimization", "Regulatory Compliance"],
    expertise: ["Derivatives Trading", "ESG Investing", "Market Analysis", "Financial Modeling"],
    experience: "15+ years in investment banking and portfolio management",
    certifications: ["CFA", "FRM", "CAIA"],
    successRate: 94,
    collaborations: 127,
    isActive: true,
    pricing: "premium",
    availability: "high",
    languages: ["English", "Mandarin"],
    timezone: "EST"
  },
  {
    id: "healthcare-analyst",
    name: "Dr. Marcus Rodriguez",
    title: "Healthcare Systems Analyst",
    industry: "Healthcare",
    specialization: ["Clinical Operations", "Healthcare Technology", "Regulatory Affairs", "Quality Management"],
    expertise: ["HIPAA Compliance", "Medical Device Regulation", "Clinical Trials", "Healthcare Analytics"],
    experience: "12+ years in hospital administration and healthcare consulting",
    certifications: ["CHCO", "CPHIMS", "PMP"],
    successRate: 92,
    collaborations: 89,
    isActive: true,
    pricing: "premium",
    availability: "medium",
    languages: ["English", "Spanish"],
    timezone: "CST"
  },
  {
    id: "tech-architect",
    name: "Alex Kumar",
    title: "Enterprise Technology Architect",
    industry: "Technology",
    specialization: ["Cloud Architecture", "Security", "Data Engineering", "DevOps"],
    expertise: ["AWS", "Kubernetes", "Microservices", "Machine Learning Infrastructure"],
    experience: "10+ years in enterprise software architecture",
    certifications: ["AWS Certified Solutions Architect", "CISSP", "TOGAF"],
    successRate: 96,
    collaborations: 156,
    isActive: true,
    pricing: "standard",
    availability: "high",
    languages: ["English", "Hindi"],
    timezone: "PST"
  },
  {
    id: "legal-counsel",
    name: "Jennifer Thompson",
    title: "Corporate Legal Counsel",
    industry: "Legal",
    specialization: ["Corporate Law", "Intellectual Property", "Contract Negotiation", "Compliance"],
    expertise: ["M&A Transactions", "Patent Law", "Employment Law", "Data Privacy"],
    experience: "18+ years in corporate law and legal consulting",
    certifications: ["JD", "LL.M in IP Law", "CIPP/US"],
    successRate: 91,
    collaborations: 73,
    isActive: true,
    pricing: "enterprise",
    availability: "low",
    languages: ["English", "French"],
    timezone: "EST"
  },
  {
    id: "manufacturing-expert",
    name: "Robert Kim",
    title: "Manufacturing Operations Expert",
    industry: "Manufacturing",
    specialization: ["Lean Manufacturing", "Supply Chain", "Quality Control", "Process Optimization"],
    expertise: ["Six Sigma", "Kaizen", "Industry 4.0", "Automation"],
    experience: "20+ years in automotive and aerospace manufacturing",
    certifications: ["Six Sigma Black Belt", "PMP", "CSCP"],
    successRate: 89,
    collaborations: 112,
    isActive: true,
    pricing: "standard",
    availability: "medium",
    languages: ["English", "Korean"],
    timezone: "EST"
  },
  {
    id: "sustainability-consultant",
    name: "Dr. Emma Larsson",
    title: "Sustainability Strategy Consultant",
    industry: "Environmental",
    specialization: ["ESG Strategy", "Carbon Management", "Sustainable Operations", "Environmental Compliance"],
    expertise: ["Life Cycle Assessment", "Renewable Energy", "Circular Economy", "Climate Risk"],
    experience: "14+ years in environmental consulting and sustainability",
    certifications: ["LEED AP", "GRI Certified", "ISO 14001 Lead Auditor"],
    successRate: 93,
    collaborations: 94,
    isActive: true,
    pricing: "premium",
    availability: "high",
    languages: ["English", "Swedish", "German"],
    timezone: "CET"
  },
  {
    id: "education-specialist",
    name: "Dr. Amara Okafor",
    title: "Educational Technology Specialist",
    industry: "Education",
    specialization: ["Curriculum Development", "Educational Technology", "Learning Analytics", "Assessment Design"],
    expertise: ["Online Learning", "AI in Education", "Accessibility", "Student Engagement"],
    experience: "11+ years in educational psychology and instructional design",
    certifications: ["Ph.D. Educational Psychology", "Google for Education Certified", "WCAG Accessibility"],
    successRate: 95,
    collaborations: 78,
    isActive: true,
    pricing: "standard",
    availability: "high",
    languages: ["English", "French", "Yoruba"],
    timezone: "GMT"
  },
  {
    id: "energy-analyst",
    name: "Michael Petersen",
    title: "Energy Market Analyst",
    industry: "Energy",
    specialization: ["Energy Trading", "Grid Optimization", "Renewable Integration", "Market Analysis"],
    expertise: ["Power Markets", "Energy Storage", "Grid Stability", "Regulatory Analysis"],
    experience: "13+ years in energy markets and utility operations",
    certifications: ["CEM", "FERC Certification", "PMP"],
    successRate: 90,
    collaborations: 85,
    isActive: false,
    pricing: "premium",
    availability: "low",
    languages: ["English", "Norwegian"],
    timezone: "CET"
  }
];

const industries = [
  { value: "all", label: "All Industries", icon: Building2 },
  { value: "financial", label: "Financial Services", icon: Calculator },
  { value: "healthcare", label: "Healthcare", icon: Stethoscope },
  { value: "technology", label: "Technology", icon: Code },
  { value: "legal", label: "Legal", icon: Gavel },
  { value: "manufacturing", label: "Manufacturing", icon: Factory },
  { value: "environmental", label: "Environmental", icon: Leaf },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "energy", label: "Energy", icon: Zap }
];

const pricingTiers = {
  standard: { label: "Standard", color: "bg-blue-100 text-blue-800", hourlyRate: "$150-250/hr" },
  premium: { label: "Premium", color: "bg-purple-100 text-purple-800", hourlyRate: "$300-500/hr" },
  enterprise: { label: "Enterprise", color: "bg-orange-100 text-orange-800", hourlyRate: "$600+/hr" }
};

export function EnterpriseSpecialists({
  specialists = enterpriseSpecialists,
  selectedSpecialists = [],
  onChange,
  industryFilter = "all",
  onIndustryFilterChange
}: EnterpriseSpecialistsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [pricingFilter, setPricingFilter] = useState<string>("all");
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const filteredSpecialists = useMemo(() => {
    return specialists.filter(specialist => {
      const matchesSearch = specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           specialist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           specialist.specialization.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesIndustry = industryFilter === "all" || 
                             specialist.industry.toLowerCase().includes(industryFilter);
      
      const matchesAvailability = availabilityFilter === "all" || 
                                 specialist.availability === availabilityFilter;
      
      const matchesPricing = pricingFilter === "all" || 
                            specialist.pricing === pricingFilter;
      
      const matchesActiveStatus = !showOnlyActive || specialist.isActive;
      
      return matchesSearch && matchesIndustry && matchesAvailability && 
             matchesPricing && matchesActiveStatus;
    });
  }, [specialists, searchTerm, industryFilter, availabilityFilter, pricingFilter, showOnlyActive]);

  const handleSpecialistToggle = (specialistId: string) => {
    const newSelection = selectedSpecialists.includes(specialistId)
      ? selectedSpecialists.filter(id => id !== specialistId)
      : [...selectedSpecialists, specialistId];
    onChange?.(newSelection);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high": return "text-green-600 bg-green-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getIndustryIcon = (industry: string) => {
    const industryConfig = industries.find(ind => 
      industry.toLowerCase().includes(ind.value) || ind.value === "all"
    );
    return industryConfig?.icon || Building2;
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="text-primary" size={20} />
            Enterprise Specialists
          </div>
          <Badge variant="outline" className="text-xs">
            {selectedSpecialists.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Specialists</TabsTrigger>
            <TabsTrigger value="selected">Selected ({selectedSpecialists.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="specialist-search" className="sr-only">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="specialist-search"
                      placeholder="Search specialists, skills, or industries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="specialist-search-input"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={industryFilter} onValueChange={onIndustryFilterChange}>
                    <SelectTrigger className="w-40" data-testid="industry-filter-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={pricingFilter} onValueChange={setPricingFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Pricing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-active"
                    checked={showOnlyActive}
                    onCheckedChange={(checked) => setShowOnlyActive(checked === true)}
                  />
                  <Label htmlFor="show-active" className="text-sm">Show only active specialists</Label>
                </div>
                <Badge variant="outline" className="text-xs">
                  {filteredSpecialists.length} specialist{filteredSpecialists.length !== 1 ? 's' : ''} found
                </Badge>
              </div>
            </div>

            {/* Specialists Grid */}
            <div className="grid gap-4">
              {filteredSpecialists.map((specialist) => {
                const isSelected = selectedSpecialists.includes(specialist.id);
                const IndustryIcon = getIndustryIcon(specialist.industry);
                const pricingInfo = pricingTiers[specialist.pricing];

                return (
                  <Card 
                    key={specialist.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                    } ${!specialist.isActive ? 'opacity-60' : ''}`}
                    onClick={() => handleSpecialistToggle(specialist.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <IndustryIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{specialist.name}</h3>
                              {!specialist.isActive && (
                                <Badge variant="secondary" className="text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{specialist.title}</p>
                            <p className="text-xs text-muted-foreground">{specialist.industry}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => {}}
                            data-testid={`specialist-checkbox-${specialist.id}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Specializations</h4>
                          <div className="flex flex-wrap gap-1">
                            {specialist.specialization.map((spec, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{specialist.successRate}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-blue-500" />
                            <span>{specialist.collaborations}</span>
                          </div>
                          <div>
                            <Badge className={`text-xs ${getAvailabilityColor(specialist.availability)} border-0`}>
                              {specialist.availability} availability
                            </Badge>
                          </div>
                          <div>
                            <Badge className={`text-xs ${pricingInfo.color} border-0`}>
                              {pricingInfo.label}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <p>{specialist.experience}</p>
                          <p className="mt-1">
                            <span className="font-medium">Certifications:</span> {specialist.certifications.join(", ")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredSpecialists.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No Specialists Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="selected" className="space-y-6">
            {selectedSpecialists.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No Specialists Selected</h3>
                <p className="text-muted-foreground">
                  Select specialists from the Browse tab to enhance your analysis team.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Selected Enterprise Specialists</h3>
                  <Badge variant="outline">
                    {selectedSpecialists.length} specialist{selectedSpecialists.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {specialists
                  .filter(specialist => selectedSpecialists.includes(specialist.id))
                  .map((specialist) => {
                    const IndustryIcon = getIndustryIcon(specialist.industry);
                    const pricingInfo = pricingTiers[specialist.pricing];

                    return (
                      <Card key={specialist.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <IndustryIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{specialist.name}</h4>
                                <p className="text-sm text-muted-foreground">{specialist.title}</p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    {specialist.successRate}%
                                  </span>
                                  <Badge className={`text-xs ${pricingInfo.color} border-0`}>
                                    {pricingInfo.label}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSpecialistToggle(specialist.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {Math.round(specialists.reduce((acc, s) => acc + s.successRate, 0) / specialists.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average Success Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {specialists.reduce((acc, s) => acc + s.collaborations, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Collaborations</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {specialists.filter(s => s.isActive).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Specialists</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Industry Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {industries.slice(1).map((industry) => {
                    const count = specialists.filter(s => 
                      s.industry.toLowerCase().includes(industry.value)
                    ).length;
                    const percentage = Math.round((count / specialists.length) * 100);
                    
                    return (
                      <div key={industry.value} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <industry.icon className="h-4 w-4" />
                          <span className="text-sm">{industry.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}