import { useEffect } from "react";
import { Link } from "wouter";
import { Award, Shield, FileCheck, Download, ArrowLeft, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const certifications = [
  {
    name: "SOC 2 Type II",
    status: "Certified",
    year: "2024",
    description: "System and Organization Controls for security, availability, processing integrity, confidentiality, and privacy",
    validUntil: "December 2025",
    auditor: "Ernst & Young LLP",
    scope: "Platform security controls and data protection measures",
    reportAvailable: true
  },
  {
    name: "ISO 27001:2013",
    status: "Certified", 
    year: "2024",
    description: "International standard for information security management systems",
    validUntil: "March 2025",
    auditor: "Bureau Veritas",
    scope: "Information security management across all business operations",
    reportAvailable: true
  },
  {
    name: "GDPR Compliance",
    status: "Verified",
    year: "2024",
    description: "General Data Protection Regulation compliance certification",
    validUntil: "Ongoing",
    auditor: "Internal & Third-party assessment",
    scope: "Data protection and privacy controls for EU data subjects",
    reportAvailable: false
  },
  {
    name: "CCPA Compliance",
    status: "Verified",
    year: "2024", 
    description: "California Consumer Privacy Act compliance verification",
    validUntil: "Ongoing",
    auditor: "Internal & Third-party assessment",
    scope: "Privacy rights and data protection for California residents",
    reportAvailable: false
  }
];

const assessments = [
  {
    type: "Penetration Testing",
    frequency: "Annually",
    lastCompleted: "August 2024",
    nextScheduled: "August 2025",
    provider: "Rapid7",
    scope: "External and internal network security testing"
  },
  {
    type: "Vulnerability Assessment",
    frequency: "Continuous",
    lastCompleted: "Ongoing",
    nextScheduled: "Continuous",
    provider: "Qualys + Internal",
    scope: "Infrastructure and application vulnerability scanning"
  },
  {
    type: "Security Code Review",
    frequency: "Per Release",
    lastCompleted: "September 2024",
    nextScheduled: "Next Release",
    provider: "Internal + Veracode",
    scope: "Static and dynamic application security testing"
  }
];

export default function TrustCenterCompliance() {
  useEffect(() => {
    document.title = "Compliance Certifications - Trust Center | SymbiosoAi ThinkTank";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Industry certifications including SOC 2 Type II, ISO 27001, and security audit reports for SymbiosoAi ThinkTank enterprise platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Industry certifications including SOC 2 Type II, ISO 27001, and security audit reports for SymbiosoAi ThinkTank enterprise platform.';
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
            <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="heading-compliance-certifications">
              Compliance Certifications
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-compliance-subtitle">
              Our comprehensive compliance program ensures adherence to international standards and regulatory requirements for enterprise security and data protection.
            </p>
          </div>

          <Separator />

          {/* Certifications Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-current-certifications">
              Current Certifications & Standards
            </h2>
            
            <div className="grid gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl" data-testid={`cert-title-${cert.name.toLowerCase().replace(/\s+/g, "-")}`}>
                              {cert.name}
                            </CardTitle>
                            <Badge variant={cert.status === "Certified" ? "default" : "secondary"}>
                              {cert.status} {cert.year}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Valid until: {cert.validUntil}
                          </p>
                        </div>
                      </div>
                      {cert.reportAvailable && (
                        <Button variant="outline" size="sm" data-testid={`button-download-${cert.name.toLowerCase().replace(/\s+/g, "-")}`}>
                          <Download className="w-4 h-4 mr-2" />
                          Report
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {cert.description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Auditing Firm:</span>
                        <p className="text-muted-foreground">{cert.auditor}</p>
                      </div>
                      <div>
                        <span className="font-medium">Scope:</span>
                        <p className="text-muted-foreground">{cert.scope}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Security Assessments */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-security-assessments">
              Security Assessments & Testing
            </h2>
            
            <p className="text-muted-foreground">
              Regular third-party security assessments ensure continuous compliance and identify potential vulnerabilities.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="w-5 h-5" />
                      {assessment.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Frequency:</span>
                        <span className="text-muted-foreground">{assessment.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Last Completed:</span>
                        <span className="text-muted-foreground">{assessment.lastCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Next Scheduled:</span>
                        <span className="text-muted-foreground">{assessment.nextScheduled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Provider:</span>
                        <span className="text-muted-foreground">{assessment.provider}</span>
                      </div>
                    </div>
                    <Separator />
                    <p className="text-xs text-muted-foreground">
                      <strong>Scope:</strong> {assessment.scope}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Compliance Framework */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-compliance-framework">
              Compliance Framework
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Governance Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Dedicated Chief Security Officer (CSO)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Data Protection Officer (DPO)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Security Committee oversight
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Regular board-level security reviews
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Quarterly compliance assessments
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Annual risk assessments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Continuous risk monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Threat intelligence integration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Incident response procedures
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Business continuity planning
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Audit Reports */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-audit-reports">
              Audit Reports & Documentation
            </h2>
            
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Available Documentation
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Enterprise customers can request detailed audit reports, security questionnaire responses, 
                      and compliance documentation to support vendor risk assessments and procurement processes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <FileCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">SOC 2 Report</h3>
                  <p className="text-xs text-muted-foreground">Type II audit report</p>
                  <Button variant="outline" size="sm" className="mt-2" data-testid="button-request-soc2">
                    Request
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">ISO 27001</h3>
                  <p className="text-xs text-muted-foreground">Certificate & scope</p>
                  <Button variant="outline" size="sm" className="mt-2" data-testid="button-request-iso27001">
                    Request
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Pen Test Report</h3>
                  <p className="text-xs text-muted-foreground">Security assessment</p>
                  <Button variant="outline" size="sm" className="mt-2" data-testid="button-request-pentest">
                    Request
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <FileCheck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Security Questionnaire</h3>
                  <p className="text-xs text-muted-foreground">Vendor assessment</p>
                  <Button variant="outline" size="sm" className="mt-2" data-testid="button-request-questionnaire">
                    Request
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Industry Standards */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-industry-standards">
              Industry Standards & Best Practices
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Frameworks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• NIST Cybersecurity Framework</li>
                    <li>• CIS Critical Security Controls</li>
                    <li>• OWASP Application Security</li>
                    <li>• ISO 27002 Security Controls</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Privacy Regulations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• GDPR (European Union)</li>
                    <li>• CCPA (California)</li>
                    <li>• PIPEDA (Canada)</li>
                    <li>• Privacy Act (Australia)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Industry Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• SOC 2 Type II</li>
                    <li>• ISO 27001:2013</li>
                    <li>• PCI DSS (planned)</li>
                    <li>• FedRAMP (roadmap)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Continuous Improvement */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-continuous-improvement">
              Continuous Improvement Program
            </h2>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Our compliance program evolves continuously to address emerging threats, regulatory changes, 
                and industry best practices.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>2024 Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        SOC 2 Type II certification renewed
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        ISO 27001 certification achieved
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        GDPR compliance verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Zero critical security findings
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>2025 Roadmap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• PCI DSS certification (Q2 2025)</li>
                      <li>• FedRAMP assessment initiation</li>
                      <li>• AI governance framework implementation</li>
                      <li>• Enhanced privacy engineering controls</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-contact-compliance">
              Compliance & Audit Requests
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Compliance Team</h3>
                    <p className="text-sm text-muted-foreground mb-1">Email: compliance@symbiosoai.com</p>
                    <p className="text-sm text-muted-foreground">For audit reports and compliance questions</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Enterprise Documentation</h3>
                    <p className="text-sm text-muted-foreground mb-1">Custom compliance packages available</p>
                    <Link href="/trust-center/contact">
                      <Button variant="outline" size="sm" data-testid="button-contact-compliance">
                        Request Documents
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}