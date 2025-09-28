import { useEffect } from "react";
import { Link } from "wouter";
import { Shield, Lock, Eye, Server, Key, Users, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const securityMeasures = [
  {
    title: "Data Encryption",
    description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption",
    icon: Lock,
    status: "implemented"
  },
  {
    title: "Infrastructure Security",
    description: "Cloud infrastructure hosted on AWS with VPC isolation and WAF protection",
    icon: Server,
    status: "implemented"
  },
  {
    title: "Access Controls",
    description: "Multi-factor authentication, SSO integration, and role-based access controls",
    icon: Key,
    status: "implemented"
  },
  {
    title: "Monitoring & Detection",
    description: "24/7 security monitoring with real-time threat detection and incident response",
    icon: Eye,
    status: "implemented"
  },
  {
    title: "Identity Management",
    description: "Enterprise identity management with OAuth 2.0 and SAML 2.0 support",
    icon: Users,
    status: "implemented"
  }
];

const certifications = [
  { name: "SOC 2 Type II", status: "Certified", year: "2024" },
  { name: "ISO 27001", status: "Certified", year: "2024" },
  { name: "GDPR Compliance", status: "Verified", year: "2024" },
  { name: "CCPA Compliance", status: "Verified", year: "2024" }
];

export default function TrustCenterSecurity() {
  useEffect(() => {
    document.title = "Security Overview - Trust Center | SymbiosoAi ThinkTank";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Enterprise-grade security measures including SOC 2 Type II, ISO 27001, encryption standards, and 24/7 monitoring for SymbiosoAi ThinkTank platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Enterprise-grade security measures including SOC 2 Type II, ISO 27001, encryption standards, and 24/7 monitoring for SymbiosoAi ThinkTank platform.';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link href="/trust-center">
            <Button variant="ghost" className="mb-4" data-testid="button-back-trust-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trust Center
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="heading-security-overview">
              Security Overview
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-security-subtitle">
              Comprehensive security measures designed to protect your data and ensure the highest level of platform security for enterprise customers.
            </p>
          </div>

          {/* Certifications Badge Bar */}
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert) => (
              <Badge key={cert.name} variant="outline" className="px-4 py-2" data-testid={`certification-${cert.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                {cert.name} {cert.year}
              </Badge>
            ))}
          </div>

          <Separator />

          {/* Security Architecture Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-architecture">
              Security Architecture
            </h2>
            <p className="text-muted-foreground">
              Our security architecture follows defense-in-depth principles with multiple layers of protection 
              including network security, application security, data protection, and operational security controls.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityMeasures.map((measure, index) => {
                const Icon = measure.icon;
                return (
                  <Card key={index} className="relative">
                    <CardHeader className="space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg" data-testid={`measure-title-${measure.title.toLowerCase().replace(/\s+/g, "-")}`}>
                          {measure.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {measure.status === "implemented" ? "✓ Implemented" : "In Progress"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        {measure.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Data Protection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-data-protection">
              Data Protection
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Encryption Standards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Data in Transit</span>
                      <Badge variant="outline">TLS 1.3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Data at Rest</span>
                      <Badge variant="outline">AES-256</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Key Management</span>
                      <Badge variant="outline">AWS KMS</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Infrastructure Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Cloud Provider</span>
                      <Badge variant="outline">AWS</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Network Isolation</span>
                      <Badge variant="outline">VPC</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Web Protection</span>
                      <Badge variant="outline">WAF</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Security Monitoring */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-monitoring">
              Security Monitoring & Incident Response
            </h2>
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                      24/7 Security Operations Center
                    </h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Our dedicated security team monitors all systems around the clock with automated threat detection, 
                      real-time alerting, and rapid incident response capabilities to ensure continuous protection.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Security Monitoring</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">&lt;15min</div>
                <div className="text-sm text-muted-foreground">Incident Response Time</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vulnerability Management */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-vulnerability">
              Vulnerability Management
            </h2>
            <p className="text-muted-foreground">
              Regular security assessments, penetration testing, and vulnerability scanning ensure our platform 
              remains secure against emerging threats.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Testing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Annual penetration testing by third parties
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Continuous vulnerability scanning
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Static and dynamic code analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Security code reviews for all changes
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patch Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Automated security patch deployment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Critical patches applied within 24 hours
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Regular dependency updates and scanning
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Rollback procedures for all updates
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <Card>
              <CardContent className="p-8 space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Security Questions or Concerns?
                </h3>
                <p className="text-muted-foreground">
                  Our security team is available to address your questions and provide additional documentation.
                </p>
                <Link href="/trust-center/contact">
                  <Button size="lg" data-testid="button-contact-security">
                    Contact Security Team
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}