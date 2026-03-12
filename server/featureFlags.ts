export interface FeatureFlags {
  reviews_enabled: boolean;
  retention_admin_enabled: boolean;
  scim_provisioning_enabled: boolean;
  saml_auth_enabled: boolean;
  advanced_analytics_enabled: boolean;
  enterprise_features_enabled: boolean;
}

export interface Sprint6FeatureFlags {
  template_builder_enabled: boolean;
  template_publishing_enabled: boolean;
  workflow_automation_enabled: boolean;
  organization_insights_enabled: boolean;
  tenant_hardening_enabled: boolean;
  enhanced_analytics_enabled: boolean;
  workflow_webhooks_enabled: boolean;
  daily_reports_enabled: boolean;
}

const boolFromEnv = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

export function getFeatureFlags(): FeatureFlags {
  return {
    reviews_enabled: boolFromEnv(process.env.FEATURE_REVIEWS_ENABLED, true),
    retention_admin_enabled: boolFromEnv(process.env.FEATURE_RETENTION_ADMIN_ENABLED, true),
    scim_provisioning_enabled: boolFromEnv(process.env.FEATURE_SCIM_ENABLED, true),
    saml_auth_enabled: boolFromEnv(process.env.FEATURE_SAML_ENABLED, true),
    advanced_analytics_enabled: boolFromEnv(process.env.FEATURE_ADVANCED_ANALYTICS_ENABLED, false),
    enterprise_features_enabled: boolFromEnv(process.env.FEATURE_ENTERPRISE_ENABLED, true),
  };
}

export function getSprint6FeatureFlags(): Sprint6FeatureFlags {
  return {
    template_builder_enabled: boolFromEnv(process.env.TEMPLATE_BUILDER_ENABLED, true),
    template_publishing_enabled: boolFromEnv(process.env.TEMPLATE_PUBLISHING_ENABLED, true),
    workflow_automation_enabled: boolFromEnv(process.env.WORKFLOW_AUTOMATION_ENABLED, true),
    organization_insights_enabled: boolFromEnv(process.env.ORGANIZATION_INSIGHTS_ENABLED, true),
    tenant_hardening_enabled: boolFromEnv(
      process.env.TENANT_HARDENING_ENABLED,
      process.env.REQUIRE_ORG_HEADER === 'true'
    ),
    enhanced_analytics_enabled: boolFromEnv(process.env.ENHANCED_ANALYTICS_ENABLED, true),
    workflow_webhooks_enabled: boolFromEnv(process.env.WORKFLOW_WEBHOOKS_ENABLED, true),
    daily_reports_enabled: boolFromEnv(process.env.DAILY_REPORTS_ENABLED, true),
  };
}
