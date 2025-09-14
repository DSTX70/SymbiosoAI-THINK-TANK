import { useEffect } from "react";
import { Link } from "wouter";
import { Lock, Eye, UserCheck, Shield, Database, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TrustCenterPrivacy() {
  useEffect(() => {
    document.title = "Privacy Policy - Trust Center | SymbiosoAi ThinkTank";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Comprehensive privacy policy covering data collection, GDPR compliance, user rights, and data protection measures for SymbiosoAi ThinkTank platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Comprehensive privacy policy covering data collection, GDPR compliance, user rights, and data protection measures for SymbiosoAi ThinkTank platform.';
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
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="heading-privacy-policy">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-privacy-subtitle">
              How we collect, use, and protect your personal information in compliance with GDPR, CCPA, and other privacy regulations.
            </p>
            <p className="text-sm text-muted-foreground">
              Effective Date: January 1, 2024 | Last Updated: September 14, 2025
            </p>
          </div>

          <Separator />

          {/* Information We Collect */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-information-collected">
              Information We Collect
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Account information (name, email, organization)</li>
                    <li>• Authentication data (secure login credentials)</li>
                    <li>• Profile preferences and settings</li>
                    <li>• Communication preferences</li>
                    <li>• Billing information (processed by secure third parties)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Usage Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Analysis queries and AI interaction data</li>
                    <li>• Platform usage patterns and feature utilization</li>
                    <li>• Performance and error logs (anonymized)</li>
                    <li>• Session information and timestamps</li>
                    <li>• Device and browser information</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* How We Use Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-how-we-use">
              How We Use Your Information
            </h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Delivery & Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Provide and maintain the SymbiosoAi ThinkTank platform</li>
                    <li>• Process AI analysis requests and deliver results</li>
                    <li>• Improve AI model performance and accuracy</li>
                    <li>• Optimize platform performance and user experience</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Respond to customer inquiries and provide support</li>
                    <li>• Send service updates and security notifications</li>
                    <li>• Communicate about new features and platform improvements</li>
                    <li>• Process billing and account management requests</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legal & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Comply with legal obligations and regulatory requirements</li>
                    <li>• Detect and prevent security threats and fraud</li>
                    <li>• Enforce terms of service and usage policies</li>
                    <li>• Protect the rights and safety of our users</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Data Sharing */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-data-sharing">
              Information Sharing & Disclosure
            </h2>
            
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      We Never Sell Your Data
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      SymbiosoAi does not sell, rent, or trade your personal information to third parties for marketing purposes. 
                      Your data is used solely to provide and improve our services.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Limited Sharing Scenarios:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <strong>Service Providers:</strong> Trusted third-party providers who assist with hosting, payment processing, 
                    and customer support (under strict data protection agreements)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <strong>Legal Requirements:</strong> When required by law, court order, or to protect the rights 
                    and safety of our users and platform
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets 
                    (with notice and data protection continuity)
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Your Rights */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-your-rights">
              Your Privacy Rights
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>GDPR Rights (EU Users)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Right to access your personal data</li>
                    <li>• Right to rectify inaccurate information</li>
                    <li>• Right to erase your data ("right to be forgotten")</li>
                    <li>• Right to restrict processing</li>
                    <li>• Right to data portability</li>
                    <li>• Right to object to processing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CCPA Rights (California Users)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Right to know what data is collected</li>
                    <li>• Right to delete personal information</li>
                    <li>• Right to opt-out of data selling (we don't sell data)</li>
                    <li>• Right to non-discrimination</li>
                    <li>• Right to correct inaccurate data</li>
                    <li>• Right to limit use of sensitive data</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Exercising Your Rights
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  To exercise any of these rights, contact our Data Protection Officer at privacy@symbiosoai.com or 
                  use the contact information provided in our Trust Center. We respond to all requests within 30 days.
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
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We retain your personal information only for as long as necessary to provide our services 
                and comply with legal obligations.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Account Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Retained while your account is active and for 12 months after account deletion
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usage Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Anonymized logs kept for 24 months for security and service improvement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Billing Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Retained for 7 years as required by accounting and tax regulations
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-contact-privacy">
              Contact Us About Privacy
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                    <p className="text-sm text-muted-foreground mb-1">Email: privacy@symbiosoai.com</p>
                    <p className="text-sm text-muted-foreground">Response Time: Within 48 hours</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Privacy Team</h3>
                    <p className="text-sm text-muted-foreground mb-1">For general privacy questions</p>
                    <Link href="/trust-center/contact">
                      <Button variant="outline" size="sm" data-testid="button-contact-privacy">
                        Contact Privacy Team
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Policy Updates */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-policy-updates">
              Policy Updates
            </h2>
            <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  We may update this Privacy Policy from time to time. Material changes will be communicated 
                  to you via email or through a prominent notice on our platform at least 30 days before 
                  the changes take effect.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}