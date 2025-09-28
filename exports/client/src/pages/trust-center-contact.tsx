import { useEffect } from "react";
import { Link } from "wouter";
import { Mail, Phone, MapPin, Clock, ArrowLeft, Shield, Users, FileText, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const contactTeams = [
  {
    team: "Security Team",
    description: "Security incidents, vulnerability reports, and security questions",
    email: "security@symbiosoai.com",
    phone: "+1 (555) 123-SECURITY",
    responseTime: "4 hours",
    availability: "24/7",
    icon: Shield,
    color: "text-red-600 dark:text-red-400"
  },
  {
    team: "Privacy & Compliance",
    description: "Data protection, privacy rights, and compliance documentation",
    email: "privacy@symbiosoai.com", 
    phone: "+1 (555) 123-PRIVACY",
    responseTime: "24 hours",
    availability: "Business hours",
    icon: FileText,
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    team: "Legal Department",
    description: "Terms of service, contracts, and legal matters",
    email: "legal@symbiosoai.com",
    phone: "+1 (555) 123-LEGAL",
    responseTime: "48 hours",
    availability: "Business hours",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    team: "General Support",
    description: "Platform support, billing, and general inquiries",
    email: "support@symbiosoai.com",
    phone: "+1 (555) 123-SUPPORT",
    responseTime: "2 hours",
    availability: "24/7",
    icon: MessageCircle,
    color: "text-green-600 dark:text-green-400"
  }
];

const offices = [
  {
    location: "Headquarters",
    address: "123 Enterprise Way\nSan Francisco, CA 94105\nUnited States",
    timezone: "Pacific Time (PT)",
    type: "primary"
  },
  {
    location: "European Office",
    address: "45 Innovation Square\nDublin 2, D02 XY89\nIreland",
    timezone: "Central European Time (CET)",
    type: "regional"
  },
  {
    location: "Asia-Pacific Office", 
    address: "88 Tech Tower\nSingapore 048624\nSingapore",
    timezone: "Singapore Time (SGT)",
    type: "regional"
  }
];

export default function TrustCenterContact() {
  useEffect(() => {
    document.title = "Contact Information - Trust Center | SymbiosoAi ThinkTank";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact information for SymbiosoAi security, compliance, legal, and privacy teams with response times and office locations worldwide.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Contact information for SymbiosoAi security, compliance, legal, and privacy teams with response times and office locations worldwide.';
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
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="heading-contact-information">
              Contact Information
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-contact-subtitle">
              Get in touch with our specialized teams for security, compliance, legal, and support inquiries. 
              We're committed to responding promptly to all trust and safety concerns.
            </p>
          </div>

          <Separator />

          {/* Emergency Contact */}
          <div className="space-y-6">
            <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400 mt-1" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-red-900 dark:text-red-100">
                      Security Emergency Hotline
                    </h3>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      For critical security incidents, data breaches, or urgent security matters requiring immediate attention.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <Button variant="destructive" size="sm" data-testid="button-emergency-email">
                        <Mail className="w-4 h-4 mr-2" />
                        security-emergency@symbiosoai.com
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-800 hover:bg-red-100 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900" data-testid="button-emergency-phone">
                        <Phone className="w-4 h-4 mr-2" />
                        +1 (555) 911-URGENT
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Contact Teams */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-contact-teams">
              Specialized Contact Teams
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {contactTeams.map((team, index) => {
                const Icon = team.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${team.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg" data-testid={`team-title-${team.team.toLowerCase().replace(/\s+/g, "-")}`}>
                            {team.team}
                          </CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {team.responseTime}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {team.availability}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {team.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${team.email}`} className="text-primary hover:underline">
                            {team.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${team.phone}`} className="text-primary hover:underline">
                            {team.phone}
                          </a>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        data-testid={`button-contact-${team.team.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Contact {team.team}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Data Protection Officer */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-dpo">
              Data Protection Officer (DPO)
            </h2>
            
            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                          Sarah Chen, CIPP/E, CIPM
                        </h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          Chief Privacy Officer & Data Protection Officer
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      Our DPO is responsible for ensuring GDPR compliance, handling data subject rights requests, 
                      and serving as the primary contact for data protection authorities.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <a href="mailto:dpo@symbiosoai.com" className="text-purple-800 dark:text-purple-200 hover:underline">
                        dpo@symbiosoai.com
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-purple-800 dark:text-purple-200">+1 (555) 123-DPO</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-purple-800 dark:text-purple-200">Response within 48 hours</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-purple-200 text-purple-800 hover:bg-purple-100 dark:border-purple-800 dark:text-purple-200 dark:hover:bg-purple-900" data-testid="button-contact-dpo">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact DPO
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Office Locations */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-office-locations">
              Office Locations
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {offices.map((office, index) => (
                <Card key={index} className={office.type === "primary" ? "ring-2 ring-primary/20" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg" data-testid={`office-title-${office.location.toLowerCase().replace(/\s+/g, "-")}`}>
                        {office.location}
                      </CardTitle>
                      {office.type === "primary" && (
                        <Badge variant="default" className="text-xs">Primary</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        {office.address.split('\n').map((line, i) => (
                          <div key={i} className="text-muted-foreground">{line}</div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{office.timezone}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Response Times & SLAs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-response-times">
              Response Time Commitments
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">4hrs</div>
                  <div className="text-sm font-medium mb-1">Security Emergencies</div>
                  <div className="text-xs text-muted-foreground">Critical incidents & breaches</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">24hrs</div>
                  <div className="text-sm font-medium mb-1">Privacy Requests</div>
                  <div className="text-xs text-muted-foreground">Data subject rights & GDPR</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">48hrs</div>
                  <div className="text-sm font-medium mb-1">Legal Matters</div>
                  <div className="text-xs text-muted-foreground">Contracts & compliance</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">2hrs</div>
                  <div className="text-sm font-medium mb-1">General Support</div>
                  <div className="text-xs text-muted-foreground">Platform & billing issues</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Service Level Guarantees
                </h3>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  <li>• Enterprise customers receive priority support with guaranteed response times</li>
                  <li>• All security incidents receive immediate acknowledgment within 1 hour</li>
                  <li>• Data subject rights requests are processed within regulatory timeframes</li>
                  <li>• Escalation procedures ensure no request goes unaddressed</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Regulatory Contacts */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-regulatory-contacts">
              Regulatory Authority Contacts
            </h2>
            
            <p className="text-muted-foreground">
              For data protection authorities and regulatory bodies, we maintain dedicated contact channels 
              to ensure prompt communication and compliance.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>European Data Protection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <strong>Lead Supervisory Authority:</strong><br />
                    Data Protection Commission (Ireland)<br />
                    Our EU representative handles all GDPR-related communications.
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>eu-dpa@symbiosoai.com</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>US Regulatory Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <strong>State & Federal Compliance:</strong><br />
                    CCPA, SOX, and federal agency communications<br />
                    Dedicated contact for US regulatory matters.
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>us-regulatory@symbiosoai.com</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Mailing Address */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground" data-testid="heading-mailing-address">
              Official Mailing Address
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Legal & Compliance Correspondence</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>SymbiosoAi Corporation</div>
                      <div>Attn: Legal Department</div>
                      <div>123 Enterprise Way, Suite 500</div>
                      <div>San Francisco, CA 94105</div>
                      <div>United States</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For Regulatory Authorities</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>SymbiosoAi Corporation</div>
                      <div>Attn: Chief Privacy Officer</div>
                      <div>123 Enterprise Way, Suite 500</div>
                      <div>San Francisco, CA 94105</div>
                      <div>United States</div>
                    </div>
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