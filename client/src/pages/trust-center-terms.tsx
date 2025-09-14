import { useEffect } from "react";
import { Link } from "wouter";
import { FileText, Scale, Users, Shield, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function TrustCenterTerms() {
  useEffect(() => {
    document.title = "Terms of Service - Trust Center | SymbiosoAi ThinkTank";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Legal terms and conditions governing use of SymbiosoAi ThinkTank platform, including service levels, user responsibilities, and enterprise agreements.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Legal terms and conditions governing use of SymbiosoAi ThinkTank platform, including service levels, user responsibilities, and enterprise agreements.';
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
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="heading-terms-of-service">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-terms-subtitle">
              Legal terms and conditions governing your use of the SymbiosoAi ThinkTank platform and services.
            </p>
            <p className="text-sm text-muted-foreground">
              Effective Date: January 1, 2024 | Last Updated: September 14, 2025
            </p>
          </div>

          <Separator />

          {/* Acceptance of Terms */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-acceptance">
              Acceptance of Terms
            </h2>
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <p className="text-blue-800 dark:text-blue-200">
                  By accessing or using the SymbiosoAi ThinkTank platform, you agree to be bound by these Terms of Service 
                  and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                  from using or accessing our services.
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Service Description */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-service-description">
              Service Description
            </h2>
            <p className="text-muted-foreground">
              SymbiosoAi ThinkTank is an enterprise-grade collaborative intelligence platform that provides:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    AI Collaboration Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Multi-agent AI debate and analysis</li>
                    <li>• Structured reasoning frameworks</li>
                    <li>• Consensus-driven insight generation</li>
                    <li>• Domain expert AI specialization</li>
                    <li>• Real-time collaborative workspaces</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Enterprise Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Template library and automation</li>
                    <li>• Advanced fact-checking integration</li>
                    <li>• Team collaboration and workspace management</li>
                    <li>• Enterprise security and compliance</li>
                    <li>• API access and integration capabilities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* User Accounts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-user-accounts">
              User Accounts & Registration
            </h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Registration</h3>
              <ul className="space-y-2 pl-6">
                <li>• You must provide accurate, current, and complete information during registration</li>
                <li>• You are responsible for safeguarding your account credentials</li>
                <li>• You must notify us immediately of any unauthorized use of your account</li>
                <li>• One person or entity per account unless otherwise authorized</li>
              </ul>

              <h3 className="text-lg font-semibold">Account Responsibilities</h3>
              <ul className="space-y-2 pl-6">
                <li>• Maintain the confidentiality of your login credentials</li>
                <li>• Accept responsibility for all activities under your account</li>
                <li>• Comply with all applicable laws and regulations</li>
                <li>• Respect the rights and privacy of other users</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Acceptable Use */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-acceptable-use">
              Acceptable Use Policy
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-300">✓ Permitted Uses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Business analysis and decision-making</li>
                    <li>• Research and educational purposes</li>
                    <li>• Strategic planning and consulting</li>
                    <li>• Academic and scholarly analysis</li>
                    <li>• Collaborative team problem-solving</li>
                    <li>• Content creation and ideation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-700 dark:text-red-300">✗ Prohibited Uses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Illegal, fraudulent, or malicious activities</li>
                    <li>• Harassment, abuse, or harmful content</li>
                    <li>• Intellectual property infringement</li>
                    <li>• Spam, phishing, or unsolicited communications</li>
                    <li>• Attempting to bypass security measures</li>
                    <li>• Reverse engineering or exploiting vulnerabilities</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Service Levels */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-service-levels">
              Service Level Agreements
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Uptime SLA</CardTitle>
                  <Badge variant="outline" className="w-fit">99.9%</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We guarantee 99.9% uptime for our platform services, excluding scheduled maintenance windows.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                  <Badge variant="outline" className="w-fit">&lt;2s average</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    API and platform response times average under 2 seconds for standard requests.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support SLA</CardTitle>
                  <Badge variant="outline" className="w-fit">24/7 Enterprise</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Enterprise customers receive 24/7 support with guaranteed response times.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Intellectual Property */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-intellectual-property">
              Intellectual Property Rights
            </h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Ownership</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    SymbiosoAi retains all rights, title, and interest in the platform, including:
                  </p>
                  <ul className="space-y-1 text-sm pl-4">
                    <li>• Software, algorithms, and AI models</li>
                    <li>• User interface and platform design</li>
                    <li>• Documentation and support materials</li>
                    <li>• Trademarks, logos, and branding</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Content Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">
                    You retain ownership of content you input into the platform:
                  </p>
                  <ul className="space-y-1 text-sm pl-4">
                    <li>• Analysis queries and prompts</li>
                    <li>• Business data and information</li>
                    <li>• Custom templates and configurations</li>
                    <li>• Generated insights and reports (based on your input)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Data and Privacy */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-data-privacy">
              Data Handling & Privacy
            </h2>
            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <p className="text-purple-800 dark:text-purple-200">
                  Your data privacy is governed by our comprehensive Privacy Policy. We implement enterprise-grade 
                  security measures and comply with GDPR, CCPA, and other applicable privacy regulations. 
                  <Link href="/trust-center/privacy" className="underline font-medium ml-1">
                    View Privacy Policy
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Limitation of Liability */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-liability">
              Limitation of Liability
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                While we strive to provide accurate and reliable AI-generated insights, users acknowledge that:
              </p>
              <ul className="space-y-2 pl-6">
                <li>• AI-generated content should be reviewed and validated before use in critical decisions</li>
                <li>• The platform is provided "as-is" without warranties of any kind</li>
                <li>• SymbiosoAi's liability is limited to the amount paid for the service in the preceding 12 months</li>
                <li>• We are not liable for indirect, incidental, or consequential damages</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Termination */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-termination">
              Account Termination
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User-Initiated Termination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Cancel your account at any time through account settings</li>
                    <li>• 30-day notice period for enterprise contracts</li>
                    <li>• Data export available for 90 days after termination</li>
                    <li>• Prorated refunds for unused service periods</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service-Initiated Termination</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Violation of terms or acceptable use policy</li>
                    <li>• Non-payment of fees after 30-day grace period</li>
                    <li>• Legal or regulatory requirements</li>
                    <li>• 30-day advance notice when possible</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Governing Law */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-governing-law">
              Governing Law & Disputes
            </h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5" />
                  <h3 className="font-semibold">Legal Framework</h3>
                </div>
                <ul className="space-y-2">
                  <li>• These terms are governed by Delaware state law and US federal law</li>
                  <li>• Disputes will be resolved through binding arbitration when possible</li>
                  <li>• Jurisdiction for legal proceedings: Delaware, United States</li>
                  <li>• Enterprise customers may negotiate alternative dispute resolution terms</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Contact Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-contact-legal">
              Legal Questions & Contract Inquiries
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Legal Department</h3>
                    <p className="text-sm text-muted-foreground mb-1">Email: legal@symbiosoai.com</p>
                    <p className="text-sm text-muted-foreground">For terms, contracts, and legal questions</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Enterprise Contracts</h3>
                    <p className="text-sm text-muted-foreground mb-1">Custom terms available</p>
                    <Link href="/trust-center/contact">
                      <Button variant="outline" size="sm" data-testid="button-contact-legal">
                        Contact Legal Team
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