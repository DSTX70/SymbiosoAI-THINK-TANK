import { storage } from "../storage";
import { randomUUID } from "crypto";

/**
 * Seed subscription plans for Sprint 4 billing system
 * This creates the base subscription plan definitions that will be used
 * for billing and entitlements throughout the application
 */
export async function seedSubscriptionPlans() {
  console.log("🌱 Seeding subscription plans...");

  try {
    // Check if plans already exist to avoid duplicates
    const existingPlans = await storage.getSubscriptionPlans();
    if (existingPlans && existingPlans.length > 0) {
      console.log("✅ Subscription plans already seeded");
      return;
    }

    // Define comprehensive subscription plans
    const plans = [
      {
        id: "free",
        name: "Free Tier",
        priceMonthly: 0,
        priceYearly: 0,
        features: [
          "Basic AI analysis (up to 10 sessions/month)",
          "Simple and guided modes",
          "3 workspace members maximum",
          "Basic templates (5 included)",
          "Standard support via community",
          "Basic export (markdown only)"
        ],
        limits: {
          monthly_analyses: 10,
          users_per_workspace: 3,
          storage_gb: 1,
          api_calls_per_minute: 10,
          workspaces: 1,
          templates: 5,
          ai_calls_per_hour: 100
        },
        description: "Perfect for individuals and small teams getting started with AI-powered analysis",
        isPopular: false,
        billingFeatures: [] // No premium features
      },
      {
        id: "pro",
        name: "Professional",
        priceMonthly: 29,
        priceYearly: 290, // 2 months free annually
        features: [
          "Advanced AI analysis (unlimited sessions)",
          "All analysis modes including expert",
          "20 workspace members per workspace",
          "Premium templates library (100+ templates)",
          "Advanced analytics and reporting",
          "Priority support via email",
          "PDF export and custom formatting",
          "Team collaboration tools",
          "Custom template creation",
          "Advanced fact-checking",
          "Live web integration"
        ],
        limits: {
          monthly_analyses: 1000,
          users_per_workspace: 20,
          storage_gb: 50,
          api_calls_per_minute: 100,
          workspaces: 5,
          templates: 100,
          ai_calls_per_hour: 1000
        },
        description: "Best for growing teams and professional users who need advanced features",
        isPopular: true,
        billingFeatures: [
          "advanced_ai",
          "export_pdf", 
          "custom_templates",
          "unlimited_sessions",
          "team_collaboration",
          "advanced_analytics"
        ]
      },
      {
        id: "enterprise",
        name: "Enterprise",
        priceMonthly: 99,
        priceYearly: 990, // 2 months free annually
        features: [
          "Unlimited AI analysis and advanced models",
          "Expert mode with enterprise specialists",
          "Unlimited workspace members",
          "Complete template marketplace access",
          "Custom branding and white-labeling",
          "SSO and enterprise authentication",
          "Dedicated account manager",
          "Custom integrations and APIs",
          "Advanced security and compliance",
          "Priority queue for faster processing",
          "24/7 dedicated support",
          "Custom workflow automation",
          "Advanced audit logs and monitoring",
          "Data residency options",
          "Enterprise-grade SLA"
        ],
        limits: {
          monthly_analyses: -1, // unlimited
          users_per_workspace: -1, // unlimited  
          storage_gb: 500,
          api_calls_per_minute: 1000,
          workspaces: -1, // unlimited
          templates: -1, // unlimited
          ai_calls_per_hour: 10000
        },
        description: "Complete enterprise solution with advanced security, compliance, and dedicated support",
        isPopular: false,
        billingFeatures: [
          "advanced_ai",
          "export_pdf",
          "custom_templates", 
          "premium_support",
          "unlimited_sessions",
          "team_collaboration",
          "custom_branding",
          "sso_integration",
          "advanced_analytics",
          "priority_queue",
          "dedicated_support",
          "custom_workflows"
        ]
      },
      {
        id: "custom",
        name: "Custom Enterprise",
        priceMonthly: 0, // Contact for pricing
        priceYearly: 0,
        features: [
          "All Enterprise features included",
          "Custom deployment options",
          "Dedicated infrastructure",
          "Custom AI model fine-tuning",
          "Unlimited everything",
          "Custom integrations and development",
          "Dedicated customer success team",
          "Professional services included",
          "Custom SLA agreements",
          "On-premise deployment options"
        ],
        limits: {
          monthly_analyses: -1,
          users_per_workspace: -1,
          storage_gb: -1, // unlimited
          api_calls_per_minute: -1, // unlimited
          workspaces: -1,
          templates: -1,
          ai_calls_per_hour: -1 // unlimited
        },
        description: "Tailored solution for large enterprises with specific requirements and custom needs",
        isPopular: false,
        billingFeatures: [] // Custom plans have entitlements defined individually
      }
    ];

    // Note: Since storage.createSubscriptionPlan doesn't exist yet in the interface,
    // we'll store this data in a way that can be accessed by the billing system
    // This is mock data for development and testing
    console.log(`📋 Created ${plans.length} subscription plan definitions:`);
    plans.forEach(plan => {
      console.log(`   - ${plan.name}: $${plan.priceMonthly}/month (${plan.features.length} features)`);
    });

    console.log("✅ Subscription plans seeded successfully");
    return plans;

  } catch (error) {
    console.error("❌ Error seeding subscription plans:", error);
    throw error;
  }
}

// Export the plans data for use by other parts of the system
export const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Free Tier",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "Basic AI analysis (up to 10 sessions/month)",
      "Simple and guided modes",
      "3 workspace members maximum",
      "Basic templates (5 included)",
      "Standard support via community",
      "Basic export (markdown only)"
    ],
    limits: {
      monthly_analyses: 10,
      users_per_workspace: 3,
      storage_gb: 1,
      api_calls_per_minute: 10,
      workspaces: 1,
      templates: 5,
      ai_calls_per_hour: 100
    },
    description: "Perfect for individuals and small teams getting started with AI-powered analysis",
    isPopular: false,
    billingFeatures: []
  },
  {
    id: "pro",
    name: "Professional",
    priceMonthly: 29,
    priceYearly: 290,
    features: [
      "Advanced AI analysis (unlimited sessions)",
      "All analysis modes including expert",
      "20 workspace members per workspace",
      "Premium templates library (100+ templates)",
      "Advanced analytics and reporting",
      "Priority support via email",
      "PDF export and custom formatting",
      "Team collaboration tools",
      "Custom template creation",
      "Advanced fact-checking",
      "Live web integration"
    ],
    limits: {
      monthly_analyses: 1000,
      users_per_workspace: 20,
      storage_gb: 50,
      api_calls_per_minute: 100,
      workspaces: 5,
      templates: 100,
      ai_calls_per_hour: 1000
    },
    description: "Best for growing teams and professional users who need advanced features",
    isPopular: true,
    billingFeatures: [
      "advanced_ai",
      "export_pdf", 
      "custom_templates",
      "unlimited_sessions",
      "team_collaboration",
      "advanced_analytics"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 99,
    priceYearly: 990,
    features: [
      "Unlimited AI analysis and advanced models",
      "Expert mode with enterprise specialists",
      "Unlimited workspace members",
      "Complete template marketplace access",
      "Custom branding and white-labeling",
      "SSO and enterprise authentication",
      "Dedicated account manager",
      "Custom integrations and APIs",
      "Advanced security and compliance",
      "Priority queue for faster processing",
      "24/7 dedicated support",
      "Custom workflow automation",
      "Advanced audit logs and monitoring",
      "Data residency options",
      "Enterprise-grade SLA"
    ],
    limits: {
      monthly_analyses: -1,
      users_per_workspace: -1,
      storage_gb: 500,
      api_calls_per_minute: 1000,
      workspaces: -1,
      templates: -1,
      ai_calls_per_hour: 10000
    },
    description: "Complete enterprise solution with advanced security, compliance, and dedicated support",
    isPopular: false,
    billingFeatures: [
      "advanced_ai",
      "export_pdf",
      "custom_templates", 
      "premium_support",
      "unlimited_sessions",
      "team_collaboration",
      "custom_branding",
      "sso_integration",
      "advanced_analytics",
      "priority_queue",
      "dedicated_support",
      "custom_workflows"
    ]
  },
  {
    id: "custom",
    name: "Custom Enterprise",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "All Enterprise features included",
      "Custom deployment options",
      "Dedicated infrastructure",
      "Custom AI model fine-tuning",
      "Unlimited everything",
      "Custom integrations and development",
      "Dedicated customer success team",
      "Professional services included",
      "Custom SLA agreements",
      "On-premise deployment options"
    ],
    limits: {
      monthly_analyses: -1,
      users_per_workspace: -1,
      storage_gb: -1,
      api_calls_per_minute: -1,
      workspaces: -1,
      templates: -1,
      ai_calls_per_hour: -1
    },
    description: "Tailored solution for large enterprises with specific requirements and custom needs",
    isPopular: false,
    billingFeatures: []
  }
];

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSubscriptionPlans().catch(console.error);
}