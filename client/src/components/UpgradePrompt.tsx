import React, { useState } from "react";
import { useEntitlements, type BillingFeature, BILLING_FEATURES } from "@/hooks/useEntitlements";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  Zap, 
  Star, 
  Users, 
  FileText, 
  BarChart3, 
  Shield, 
  Settings,
  ArrowRight,
  X,
  CheckCircle,
  Lock
} from "lucide-react";

interface UpgradePromptProps {
  feature?: BillingFeature;
  reason?: string;
  currentPlan?: string;
  workspaceId?: string;
  variant?: 'compact' | 'card' | 'modal';
  showFeatureList?: boolean;
  onDismiss?: () => void;
  className?: string;
  'data-testid'?: string;
}

/**
 * UpgradePrompt component for showing upgrade prompts when users
 * try to access features that require a higher subscription plan.
 * 
 * This component provides clear messaging about why an upgrade is needed
 * and what features would be unlocked with the upgrade.
 * 
 * @example
 * // Basic upgrade prompt
 * <UpgradePrompt 
 *   feature="advanced_ai" 
 *   currentPlan="free"
 *   workspaceId={workspaceId}
 * />
 * 
 * @example
 * // Card variant with feature list
 * <UpgradePrompt 
 *   variant="card"
 *   showFeatureList
 *   currentPlan="free"
 *   workspaceId={workspaceId}
 * />
 * 
 * @example
 * // Modal variant with dismiss
 * <UpgradePrompt 
 *   variant="modal"
 *   onDismiss={() => setShowModal(false)}
 *   currentPlan="pro"
 *   workspaceId={workspaceId}
 * />
 */
export function UpgradePrompt({
  feature,
  reason,
  currentPlan = 'free',
  workspaceId,
  variant = 'compact',
  showFeatureList = false,
  onDismiss,
  className,
  'data-testid': testId
}: UpgradePromptProps) {
  const { user } = useAuth();
  const { can } = useEntitlements(workspaceId);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if dismissed (for non-modal variants)
  if (isDismissed && variant !== 'modal') {
    return null;
  }

  // Determine the upgrade target based on current plan and required feature
  const getUpgradeTarget = (): 'pro' | 'enterprise' => {
    if (feature && [
      BILLING_FEATURES.CUSTOM_BRANDING,
      BILLING_FEATURES.SSO_INTEGRATION,
      BILLING_FEATURES.PREMIUM_SUPPORT,
      BILLING_FEATURES.PRIORITY_QUEUE,
      BILLING_FEATURES.DEDICATED_SUPPORT,
      BILLING_FEATURES.CUSTOM_WORKFLOWS
    ].includes(feature)) {
      return 'enterprise';
    }
    return currentPlan === 'free' ? 'pro' : 'enterprise';
  };

  const upgradeTarget = getUpgradeTarget();
  const canManageBilling = can.manageBilling();

  // Get feature icon
  const getFeatureIcon = (featureName?: BillingFeature) => {
    switch (featureName) {
      case BILLING_FEATURES.ADVANCED_AI:
        return <Zap className="w-4 h-4" />;
      case BILLING_FEATURES.EXPORT_PDF:
        return <FileText className="w-4 h-4" />;
      case BILLING_FEATURES.CUSTOM_TEMPLATES:
        return <Settings className="w-4 h-4" />;
      case BILLING_FEATURES.TEAM_COLLABORATION:
        return <Users className="w-4 h-4" />;
      case BILLING_FEATURES.ADVANCED_ANALYTICS:
        return <BarChart3 className="w-4 h-4" />;
      case BILLING_FEATURES.PREMIUM_SUPPORT:
      case BILLING_FEATURES.DEDICATED_SUPPORT:
        return <Shield className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  // Get feature-specific messaging
  const getFeatureMessage = (): { title: string; description: string } => {
    if (reason) {
      return {
        title: "Premium Feature",
        description: reason
      };
    }

    switch (feature) {
      case BILLING_FEATURES.ADVANCED_AI:
        return {
          title: "Advanced AI Features",
          description: "Access enhanced AI models, custom prompts, and advanced reasoning capabilities"
        };
      case BILLING_FEATURES.EXPORT_PDF:
        return {
          title: "PDF Export",
          description: "Export your analysis results and reports as professional PDF documents"
        };
      case BILLING_FEATURES.CUSTOM_TEMPLATES:
        return {
          title: "Custom Templates",
          description: "Create and customize analysis templates for your specific use cases"
        };
      case BILLING_FEATURES.TEAM_COLLABORATION:
        return {
          title: "Team Collaboration",
          description: "Collaborate in real-time with your team members on analysis sessions"
        };
      case BILLING_FEATURES.ADVANCED_ANALYTICS:
        return {
          title: "Advanced Analytics",
          description: "Deep insights, usage analytics, and performance metrics for your workspace"
        };
      case BILLING_FEATURES.UNLIMITED_SESSIONS:
        return {
          title: "Unlimited Sessions",
          description: "Run unlimited analysis sessions without monthly limits"
        };
      default:
        return {
          title: `${upgradeTarget.charAt(0).toUpperCase() + upgradeTarget.slice(1)} Feature`,
          description: `This feature requires a ${upgradeTarget} subscription plan`
        };
    }
  };

  const featureMessage = getFeatureMessage();

  // Plan feature lists
  const planFeatures = {
    pro: [
      "Advanced AI capabilities",
      "PDF export functionality", 
      "Custom templates",
      "Unlimited sessions",
      "Team collaboration",
      "Advanced analytics",
      "Priority support"
    ],
    enterprise: [
      "All Pro features",
      "Custom branding",
      "SSO integration",
      "Dedicated support",
      "Priority processing queue",
      "Custom workflows",
      "Advanced security controls",
      "API access"
    ]
  };

  const handleUpgrade = () => {
    const upgradeUrl = workspaceId 
      ? `/billing?workspaceId=${workspaceId}&plan=${upgradeTarget}`
      : `/billing?plan=${upgradeTarget}`;
    
    window.location.href = upgradeUrl;
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  // Compact variant (for inline prompts)
  if (variant === 'compact') {
    return (
      <Alert className={`border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 ${className || ''}`} data-testid={testId}>
        <div className="flex items-center gap-2">
          {getFeatureIcon(feature)}
          <Crown className="h-4 w-4 text-orange-600" />
        </div>
        <AlertDescription className="flex items-center justify-between">
          <div>
            <div className="font-medium text-orange-800">
              {featureMessage.title}
            </div>
            <div className="text-sm text-orange-600 mt-1">
              Upgrade to {upgradeTarget} to unlock this feature
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700"
                data-testid="dismiss-button"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {canManageBilling ? (
              <Button
                onClick={handleUpgrade}
                size="sm"
                className="bg-orange-600 text-white hover:bg-orange-700"
                data-testid="upgrade-button"
              >
                <Zap className="w-3 h-3 mr-1" />
                Upgrade
              </Button>
            ) : (
              <Badge variant="secondary">
                Contact workspace owner
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Card variant (for dedicated upgrade sections)
  if (variant === 'card') {
    return (
      <Card className={`border-orange-200 ${className || ''}`} data-testid={testId}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-orange-600">
                {getFeatureIcon(feature)}
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-orange-800">
                  {featureMessage.title}
                </CardTitle>
                <CardDescription className="text-orange-600">
                  {featureMessage.description}
                </CardDescription>
              </div>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700"
                data-testid="dismiss-button"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showFeatureList && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                What you'll get with {upgradeTarget}:
              </h4>
              <div className="grid gap-2">
                {planFeatures[upgradeTarget].map((featureItem, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{featureItem}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {canManageBilling 
                ? "Ready to upgrade?" 
                : "Ask your workspace owner to upgrade"
              }
            </div>
            {canManageBilling ? (
              <Button
                onClick={handleUpgrade}
                className="bg-orange-600 text-white hover:bg-orange-700"
                data-testid="upgrade-button"
              >
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to {upgradeTarget}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Badge variant="secondary" className="py-2 px-3">
                <Users className="w-3 h-3 mr-1" />
                Contact workspace owner
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Modal variant (for overlay prompts)
  if (variant === 'modal') {
    return (
      <div 
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className || ''}`}
        data-testid={testId}
      >
        <Card className="w-full max-w-md border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-600">
                {getFeatureIcon(feature)}
                <Crown className="h-5 w-5" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                data-testid="close-modal-button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-xl text-orange-800">
              {featureMessage.title}
            </CardTitle>
            <CardDescription className="text-orange-600">
              {featureMessage.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Unlock with {upgradeTarget}:
              </h4>
              <div className="grid gap-2 mb-4">
                {planFeatures[upgradeTarget].slice(0, 4).map((featureItem, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{featureItem}</span>
                  </div>
                ))}
              </div>
              {planFeatures[upgradeTarget].length > 4 && (
                <div className="text-sm text-gray-500">
                  + {planFeatures[upgradeTarget].length - 4} more features
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="flex-1"
                data-testid="not-now-button"
              >
                Not now
              </Button>
              {canManageBilling ? (
                <Button
                  onClick={handleUpgrade}
                  className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
                  data-testid="upgrade-button"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade now
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="flex-1"
                  disabled
                  data-testid="contact-owner-button"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Ask owner to upgrade
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

// Export utility components for specific use cases

/**
 * FeatureLockedBanner - A banner for pages that are entirely locked behind a feature
 */
export function FeatureLockedBanner({
  feature,
  title,
  description,
  workspaceId,
  className
}: {
  feature: BillingFeature;
  title: string;
  description: string;
  workspaceId?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className || ''}`}>
      <UpgradePrompt
        feature={feature}
        reason={description}
        workspaceId={workspaceId}
        variant="card"
        showFeatureList
        data-testid="feature-locked-banner"
      />
    </div>
  );
}

/**
 * PlanGate - A simple component that shows upgrade prompt or children based on plan
 */
export function PlanGate({
  requiredPlan,
  currentPlan,
  workspaceId,
  children,
  className
}: {
  requiredPlan: 'pro' | 'enterprise';
  currentPlan?: string;
  workspaceId?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const needsUpgrade = (
    (requiredPlan === 'pro' && currentPlan === 'free') ||
    (requiredPlan === 'enterprise' && (currentPlan === 'free' || currentPlan === 'pro'))
  );

  if (needsUpgrade) {
    return (
      <div className={className}>
        <UpgradePrompt
          currentPlan={currentPlan}
          workspaceId={workspaceId}
          variant="card"
          showFeatureList
          reason={`This feature requires a ${requiredPlan} plan`}
          data-testid="plan-gate-upgrade"
        />
      </div>
    );
  }

  return <>{children}</>;
}