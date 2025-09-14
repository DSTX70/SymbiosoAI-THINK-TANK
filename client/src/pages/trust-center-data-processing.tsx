import { useEffect } from "react";
import { Link } from "wouter";
import { Database, Shield, Globe, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const dataFlowSteps = [
  {
    step: "1",
    title: "Data Collection",
    description: "User input through secure HTTPS connections with end-to-end encryption",
    details: ["TLS 1.3 encryption", "Input validation", "Secure transmission"]
  },
  {
    step: "2", 
    title: "Processing",
    description: "AI analysis in secure, isolated processing environments",
    details: ["Containerized processing", "Memory isolation", "Secure compute"]
  },
  {
    step: "3",
    title: "Storage",
    description: "Encrypted storage with access controls and audit logging",
    details: ["AES-256 encryption", "Access logging", "Backup encryption"]
  },
  {
    step: "4",
    title: "Delivery",
    description: "Results delivered through secure channels with session management",
    details: ["Secure sessions", "Result encryption", "Audit trails"]
  }
];

export default function TrustCenterDataProcessing() {
  useEffect(() => {
    document.title = "Data Processing Agreement - Trust Center | SymbiosoAi ThinkTank";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'GDPR-compliant data processing agreement detailing how SymbiosoAi handles, processes, and protects personal data with enterprise security measures.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'GDPR-compliant data processing agreement detailing how SymbiosoAi handles, processes, and protects personal data with enterprise security measures.';
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
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mx-auto">
              <Database className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="heading-data-processing">
              Data Processing Agreement
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-data-processing-subtitle">
              How we handle, process, and protect your data in compliance with GDPR, CCPA, and international data protection regulations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge variant="outline" className="px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                GDPR Article 28 Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                CCPA Certified
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Data Processing Overview */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-processing-overview">
              Data Processing Overview
            </h2>
            
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <p className="text-blue-800 dark:text-blue-200">
                  SymbiosoAi acts as a data processor for enterprise customers who are data controllers. 
                  This agreement establishes the terms for processing personal data in accordance with 
                  applicable data protection laws.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Data Controller</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    You (the customer) determine the purposes and means of data processing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Data Processor</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    SymbiosoAi processes data on your behalf according to your instructions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Data Subjects</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Individuals whose personal data is processed through our platform
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Data Processing Activities */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-processing-activities">
              Processing Activities & Purposes
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Categories of Personal Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Identity Data:</strong> Names, usernames, email addresses</li>
                    <li>• <strong>Contact Data:</strong> Email addresses, phone numbers</li>
                    <li>• <strong>Technical Data:</strong> IP addresses, browser information</li>
                    <li>• <strong>Usage Data:</strong> Platform interaction patterns</li>
                    <li>• <strong>Profile Data:</strong> Preferences, settings, feedback</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processing Purposes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Service delivery and platform functionality</li>
                    <li>• User authentication and access control</li>
                    <li>• Customer support and communication</li>
                    <li>• Platform security and fraud prevention</li>
                    <li>• Service improvement and analytics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Data Flow */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-data-flow">
              Data Processing Flow
            </h2>
            
            <div className="space-y-6">
              {dataFlowSteps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">{step.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.details.map((detail, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {detail}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Data Location & Transfers */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-data-location">
              Data Location & International Transfers
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Primary Data Centers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>United States (Primary)</span>
                      <Badge variant="outline">AWS US-East</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>European Union</span>
                      <Badge variant="outline">AWS EU-West</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Asia-Pacific</span>
                      <Badge variant="outline">AWS AP-Southeast</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transfer Safeguards</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      EU Standard Contractual Clauses (SCCs)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Data Processing Addendum (DPA)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      AWS Data Protection Addendum
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Transfer Impact Assessments (TIA)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Data Residency Options
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Enterprise customers can specify data residency requirements. We support region-specific 
                  data processing to comply with local data protection laws and organizational policies.
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Data Retention */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-data-retention">
              Data Retention & Deletion
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Retention Periods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active account data</span>
                      <Badge variant="outline">Duration of service</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inactive account data</span>
                      <Badge variant="outline">12 months</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Backup data</span>
                      <Badge variant="outline">30 days</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Audit logs</span>
                      <Badge variant="outline">7 years</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deletion Procedures</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Secure deletion from primary systems
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Removal from backup systems within 30 days
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Cryptographic key destruction for encrypted data
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Deletion certificates available upon request
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Data Subject Rights */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-data-subject-rights">
              Data Subject Rights Support
            </h2>
            
            <p className="text-muted-foreground">
              We provide comprehensive support to help data controllers fulfill data subject rights requests:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Access</h3>
                  <p className="text-xs text-muted-foreground">Data export tools and reporting</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Rectification</h3>
                  <p className="text-xs text-muted-foreground">Data correction interfaces</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Erasure</h3>
                  <p className="text-xs text-muted-foreground">Secure deletion procedures</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Portability</h3>
                  <p className="text-xs text-muted-foreground">Structured data export formats</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Response Timeframes
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  We assist data controllers in responding to data subject rights requests within the legally 
                  required timeframes: 1 month for GDPR requests, 45 days for CCPA requests (extendable by 
                  additional 45 days for complex requests).
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Security Measures */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-security-measures">
              Security Measures
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5" />
                    Technical
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• End-to-end encryption</li>
                    <li>• Access controls & MFA</li>
                    <li>• Network security</li>
                    <li>• Vulnerability management</li>
                    <li>• Security monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="w-5 h-5" />
                    Organizational
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• Security training</li>
                    <li>• Access management</li>
                    <li>• Incident response</li>
                    <li>• Regular audits</li>
                    <li>• Vendor management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5" />
                    Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• SOC 2 Type II</li>
                    <li>• ISO 27001</li>
                    <li>• GDPR compliance</li>
                    <li>• Regular assessments</li>
                    <li>• Third-party audits</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Contact Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-contact-dpa">
              Data Processing Questions
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                    <p className="text-sm text-muted-foreground mb-1">Email: dpo@symbiosoai.com</p>
                    <p className="text-sm text-muted-foreground">For DPA questions and data subject rights</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Enterprise Data Processing</h3>
                    <p className="text-sm text-muted-foreground mb-1">Custom DPA agreements available</p>
                    <Link href="/trust-center/contact">
                      <Button variant="outline" size="sm" data-testid="button-contact-dpa">
                        Request DPA Documents
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