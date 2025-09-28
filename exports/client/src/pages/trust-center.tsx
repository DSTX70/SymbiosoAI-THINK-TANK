import { useEffect } from "react";
import { Link } from "wouter";
import { Shield, FileText, Lock, UserCheck, Award, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComplianceSection {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "active" | "in-progress" | "certified";
  badge?: string;
}

const complianceSections: ComplianceSection[] = [
  {
    title: "Security Overview",
    description: "Comprehensive security measures, encryption protocols, and infrastructure protection standards",
    href: "/trust-center/security",
    icon: Shield,
    status: "certified",
    badge: "SOC 2 Type II"
  },
  {
    title: "Privacy Policy",
    description: "Data collection practices, user rights, and privacy protection measures under GDPR and CCPA",
    href: "/trust-center/privacy",
    icon: Lock,
    status: "active"
  },
  {
    title: "Terms of Service",
    description: "Legal agreements, usage terms, and service level commitments for enterprise customers",
    href: "/trust-center/terms",
    icon: FileText,
    status: "active"
  },
  {
    title: "Data Processing",
    description: "Data handling procedures, retention policies, and cross-border transfer protocols",
    href: "/trust-center/data-processing",
    icon: UserCheck,
    status: "certified",
    badge: "GDPR Compliant"
  },
  {
    title: "Compliance Certifications",
    description: "Industry certifications, audit reports, and third-party security assessments",
    href: "/trust-center/compliance",
    icon: Award,
    status: "certified",
    badge: "ISO 27001"
  },
  {
    title: "Contact Information",
    description: "Dedicated compliance team, security contacts, and data protection officer information",
    href: "/trust-center/contact",
    icon: Mail,
    status: "active"
  }
];

const securityHighlights = [
  "End-to-end encryption for all data transmission",
  "Zero-trust security architecture",
  "24/7 security monitoring and incident response",
  "Regular third-party security audits",
  "Multi-factor authentication and SSO support",
  "Enterprise-grade access controls"
];

export default function TrustCenter() {
  useEffect(() => {
    document.title = "Trust & Security Center | SymbiosoAi ThinkTank";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive security measures, compliance certifications, and data protection policies for SymbiosoAi ThinkTank enterprise platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Comprehensive security measures, compliance certifications, and data protection policies for SymbiosoAi ThinkTank enterprise platform.';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-trust-center">
              Trust & Security Center
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto" data-testid="text-trust-subtitle">
              Your data security and privacy are our top priorities. Learn about our enterprise-grade security measures, 
              compliance certifications, and commitment to protecting your information.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                SOC 2 Type II Certified
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                ISO 27001 Compliant
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Lock className="w-4 h-4 mr-2" />
                GDPR Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Security Highlights */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-foreground" data-testid="heading-security-highlights">
              Enterprise Security at Scale
            </h2>
            <p className="text-lg text-muted-foreground">
              Built with security-first principles to meet the most demanding enterprise requirements
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {securityHighlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-3" data-testid={`security-highlight-${index}`}>
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-foreground">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Sections Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground" data-testid="heading-compliance-sections">
              Compliance & Documentation
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive documentation of our security practices, privacy policies, and compliance standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.href} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      {section.badge && (
                        <Badge 
                          variant={section.status === "certified" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {section.badge}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg" data-testid={`section-title-${section.title.toLowerCase().replace(/\s+/g, "-")}`}>
                        {section.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {section.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link href={section.href}>
                      <Button 
                        variant="outline" 
                        className="w-full group"
                        data-testid={`button-${section.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-0">
            <CardContent className="p-12 space-y-6">
              <h3 className="text-2xl font-bold text-foreground" data-testid="heading-questions">
                Questions About Security or Compliance?
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our security and compliance team is here to help. Contact us for detailed security questionnaires, 
                compliance documentation, or to discuss your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/trust-center/contact">
                  <Button size="lg" data-testid="button-contact-security">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Security Team
                  </Button>
                </Link>
                <Link href="/trust-center/compliance">
                  <Button variant="outline" size="lg" data-testid="button-view-certifications">
                    <Award className="w-4 h-4 mr-2" />
                    View Certifications
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}