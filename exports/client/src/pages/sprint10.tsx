import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OnboardingWizard from '@/components/OnboardingWizard';
import PricingUpsell from '@/components/PricingUpsell';
import TrustCenterLinks from '@/components/TrustCenterLinks';
import StatusBadge from '@/components/StatusBadge';
import NPSWidget from '@/components/NPSWidget';

export default function Sprint10Page() {
  return (
    <div className="container mx-auto p-6" data-testid="sprint10-page">
      <h1 className="text-3xl font-bold mb-8">Sprint 10: Public Beta Readiness</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Onboarding Wizard */}
        <Card data-testid="card-onboarding">
          <CardHeader>
            <CardTitle>Onboarding Wizard</CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingWizard />
          </CardContent>
        </Card>
        
        {/* Pricing & Trials */}
        <Card data-testid="card-pricing">
          <CardHeader>
            <CardTitle>Pricing & Trials</CardTitle>
          </CardHeader>
          <CardContent>
            <PricingUpsell />
          </CardContent>
        </Card>
        
        {/* Trust Center Links */}
        <Card data-testid="card-trust">
          <CardHeader>
            <CardTitle>Trust Center</CardTitle>
          </CardHeader>
          <CardContent>
            <TrustCenterLinks />
          </CardContent>
        </Card>
        
        {/* Status Badge */}
        <Card data-testid="card-status">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge />
          </CardContent>
        </Card>
        
        {/* NPS Widget */}
        <Card data-testid="card-nps">
          <CardHeader>
            <CardTitle>Net Promoter Score</CardTitle>
          </CardHeader>
          <CardContent>
            <NPSWidget />
          </CardContent>
        </Card>
        
        {/* Beta Features Status */}
        <Card data-testid="card-beta-status">
          <CardHeader>
            <CardTitle>Beta Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div data-testid="feature-onboarding">✅ Onboarding Wizard</div>
              <div data-testid="feature-trials">✅ Trial Management</div>
              <div data-testid="feature-trust">✅ Trust Center</div>
              <div data-testid="feature-telemetry">✅ Telemetry & NPS</div>
              <div data-testid="feature-status">✅ Status Badge</div>
            </div>
          </CardContent>
        </Card>
        
      </div>
      
      {/* Environment Status */}
      <Card className="mt-6" data-testid="card-environment">
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div data-testid="env-beta-mode">
              <strong>Beta Mode:</strong> {import.meta.env.VITE_BETA_MODE || 'Not set'}
            </div>
            <div data-testid="env-trial-days">
              <strong>Trial Days:</strong> {import.meta.env.VITE_TRIAL_DAYS || '14'}
            </div>
            <div data-testid="env-telemetry">
              <strong>Telemetry:</strong> {import.meta.env.VITE_TELEMETRY_ALLOW || 'true'}
            </div>
            <div data-testid="env-status-url">
              <strong>Status URL:</strong> {import.meta.env.VITE_STATUS_PAGE_URL || 'Not set'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}