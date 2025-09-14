import { storage } from "../storage";
import { randomUUID } from "crypto";

/**
 * Seed sample data for Sprint 4 testing
 * This creates sample users, organizations, workspaces, purchases, and entitlements
 * to demonstrate the complete billing and marketplace functionality
 */
export async function seedSampleData() {
  console.log("🌱 Seeding Sprint 4 sample data...");

  try {
    // Sample users with different subscription levels
    const sampleUsers = [
      {
        id: "user-demo",
        email: "demo@example.com", 
        firstName: "Demo",
        lastName: "User",
        role: "user" as const,
        preferences: {
          theme: "light",
          language: "en",
          notifications: true,
          default_model: "gpt-4",
          default_temperature: 0.7,
          auto_save: true
        },
        subscription: {
          plan: "free",
          usage_count: 5,
          monthly_limit: 10,
          reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      {
        id: "user-pro",
        email: "sarah.johnson@techstartup.com",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "premium_user",
        preferences: {
          theme: "dark",
          language: "en",
          notifications: true,
          default_model: "gpt-4",
          default_temperature: 0.8,
          auto_save: true
        },
        subscription: {
          plan: "pro",
          usage_count: 145,
          monthly_limit: 1000,
          reset_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }
      },
      {
        id: "user-enterprise-admin",
        email: "michael.chen@globalcorp.com",
        firstName: "Michael",
        lastName: "Chen",
        role: "admin",
        preferences: {
          theme: "light",
          language: "en",
          notifications: true,
          default_model: "gpt-4",
          default_temperature: 0.7,
          auto_save: true
        },
        subscription: {
          plan: "enterprise",
          usage_count: 2340,
          monthly_limit: -1, // unlimited
          reset_date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)
        }
      },
      {
        id: "user-custom-enterprise",
        email: "alex.rivera@megacorp.com",
        firstName: "Alex",
        lastName: "Rivera", 
        role: "admin",
        preferences: {
          theme: "dark",
          language: "en",
          notifications: true,
          default_model: "gpt-4",
          default_temperature: 0.6,
          auto_save: true
        },
        subscription: {
          plan: "custom",
          usage_count: 5670,
          monthly_limit: -1, // unlimited
          reset_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
        }
      }
    ];

    // Sample organizations with different subscription tiers
    const sampleOrganizations = [
      {
        id: "org-tech-startup",
        name: "TechStartup Inc",
        domain: "techstartup.com",
        subscriptionPlan: "pro",
        billingEmail: "billing@techstartup.com",
        settings: {
          allowSelfSignup: true,
          defaultUserRole: "member",
          ssoEnabled: false,
          customBranding: false
        },
        metadata: {
          industry: "technology",
          size: "small",
          employeeCount: 25,
          founded: "2022",
          primaryUseCase: "product_development"
        }
      },
      {
        id: "org-global-corp",
        name: "Global Corporation",
        domain: "globalcorp.com",
        subscriptionPlan: "enterprise",
        billingEmail: "enterprise-billing@globalcorp.com",
        settings: {
          allowSelfSignup: false,
          defaultUserRole: "viewer",
          ssoEnabled: true,
          customBranding: true,
          auditLogging: true,
          dataResidency: "US"
        },
        metadata: {
          industry: "manufacturing",
          size: "large",
          employeeCount: 15000,
          founded: "1985",
          primaryUseCase: "strategic_planning"
        }
      },
      {
        id: "org-mega-corp",
        name: "Mega Corp Enterprises",
        domain: "megacorp.com",
        subscriptionPlan: "custom",
        billingEmail: "custom-billing@megacorp.com",
        settings: {
          allowSelfSignup: false,
          defaultUserRole: "member",
          ssoEnabled: true,
          customBranding: true,
          auditLogging: true,
          dataResidency: "EU",
          customIntegrations: true,
          dedicatedSupport: true
        },
        metadata: {
          industry: "financial_services",
          size: "enterprise",
          employeeCount: 50000,
          founded: "1960",
          primaryUseCase: "compliance_analysis"
        }
      }
    ];

    // Sample workspaces with different subscription levels
    const sampleWorkspaces = [
      {
        id: "workspace-demo",
        name: "Demo Workspace",
        description: "Sample workspace for demo user",
        sessionCode: "DEMO2024",
        isPrivate: false,
        ownerId: "user-demo",
        settings: {
          collaboration: true,
          publicSessions: false,
          defaultTemplates: ["basic-analysis"]
        }
      },
      {
        id: "workspace-tech-strategy",
        name: "Product Strategy Hub",
        description: "Strategic planning workspace for product development team",
        sessionCode: "TECH5678",
        isPrivate: true,
        ownerId: "user-pro",
        settings: {
          collaboration: true,
          publicSessions: false,
          defaultTemplates: ["business-strategy", "market-research"],
          customBranding: false
        }
      },
      {
        id: "workspace-enterprise-main",
        name: "Enterprise Analytics Center",
        description: "Primary workspace for enterprise-wide analysis and strategic planning",
        sessionCode: "CORP1234",
        isPrivate: true,
        ownerId: "user-enterprise-admin",
        settings: {
          collaboration: true,
          publicSessions: false,
          defaultTemplates: ["executive-strategy", "market-entry", "risk-assessment"],
          customBranding: true,
          auditLogging: true,
          ssoRequired: true
        }
      },
      {
        id: "workspace-mega-compliance",
        name: "Compliance & Risk Management",
        description: "Dedicated workspace for regulatory compliance and risk analysis",
        sessionCode: "MEGA9999",
        isPrivate: true,
        ownerId: "user-custom-enterprise",
        settings: {
          collaboration: true,
          publicSessions: false,
          defaultTemplates: ["legal-risk", "compliance-framework", "enterprise-architecture"],
          customBranding: true,
          auditLogging: true,
          ssoRequired: true,
          dataRetention: "7_years",
          encryptionLevel: "enterprise"
        }
      }
    ];

    // Sample subscriptions for workspaces
    const sampleSubscriptions = [
      {
        id: "sub-demo",
        workspaceId: "workspace-demo",
        plan: "free",
        seats: 1,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        stripeSubscriptionId: null,
        metadata: {
          trialUsed: false,
          downgradedFrom: null,
          startDate: "2024-09-01"
        }
      },
      {
        id: "sub-tech-pro",
        workspaceId: "workspace-tech-strategy",
        plan: "pro",
        seats: 5,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        stripeSubscriptionId: "sub_1PROTechStartup123",
        metadata: {
          trialUsed: true,
          upgradedFrom: "free",
          startDate: "2024-07-15",
          billingCycle: "monthly"
        }
      },
      {
        id: "sub-enterprise-main",
        workspaceId: "workspace-enterprise-main",
        plan: "enterprise",
        seats: 50,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        stripeSubscriptionId: "sub_1ENTGlobalCorp456",
        metadata: {
          trialUsed: false,
          upgradedFrom: "pro",
          startDate: "2024-01-01",
          billingCycle: "yearly",
          contractEnd: "2025-01-01"
        }
      },
      {
        id: "sub-mega-custom",
        workspaceId: "workspace-mega-compliance",
        plan: "custom",
        seats: 200,
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        stripeSubscriptionId: "sub_1CUSTMegaCorp789",
        metadata: {
          trialUsed: false,
          customContract: true,
          startDate: "2023-09-01",
          billingCycle: "yearly",
          contractEnd: "2025-09-01",
          dedicatedSupport: true,
          customSLA: "99.9%"
        }
      }
    ];

    // Sample template purchases to demonstrate marketplace functionality
    const sampleTemplatePurchases = [
      {
        id: "purchase-1",
        workspaceId: "workspace-tech-strategy",
        userId: "user-pro",
        templateProductId: "product-executive-strategy",
        priceCents: 2999,
        currency: "USD",
        licenseKey: "EXEC-STRAT-" + randomUUID().substring(0, 8).toUpperCase(),
        purchasedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        metadata: {
          paymentMethod: "stripe",
          transactionId: "txn_1ExecutiveStrategy123",
          downloadCount: 3,
          lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      },
      {
        id: "purchase-2",
        workspaceId: "workspace-tech-strategy",
        userId: "user-pro",
        templateProductId: "product-market-entry",
        priceCents: 1999,
        currency: "USD",
        licenseKey: "MARKET-ENT-" + randomUUID().substring(0, 8).toUpperCase(),
        purchasedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        metadata: {
          paymentMethod: "stripe",
          transactionId: "txn_1MarketEntry456",
          downloadCount: 1,
          lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      {
        id: "purchase-3",
        workspaceId: "workspace-enterprise-main",
        userId: "user-enterprise-admin",
        templateProductId: "product-professional-suite",
        priceCents: 9999,
        currency: "USD",
        licenseKey: "PRO-SUITE-" + randomUUID().substring(0, 8).toUpperCase(),
        purchasedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        metadata: {
          paymentMethod: "stripe",
          transactionId: "txn_1ProfessionalSuite789",
          downloadCount: 15,
          lastUsed: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          isBundle: true,
          bundleTemplates: 10
        }
      },
      {
        id: "purchase-4",
        workspaceId: "workspace-mega-compliance",
        userId: "user-custom-enterprise",
        templateProductId: "product-legal-risk",
        priceCents: 4999,
        currency: "USD",
        licenseKey: "LEGAL-RISK-" + randomUUID().substring(0, 8).toUpperCase(),
        purchasedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        metadata: {
          paymentMethod: "enterprise_billing",
          transactionId: "txn_1LegalRisk999",
          downloadCount: 8,
          lastUsed: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          complianceApproved: true
        }
      }
    ];

    // Sample entitlements based on subscriptions and purchases
    const sampleEntitlements = [
      // Free tier user - no premium entitlements
      
      // Pro tier entitlements
      {
        id: "ent-pro-1",
        workspaceId: "workspace-tech-strategy",
        feature: "advanced_ai",
        subscriptionId: "sub-tech-pro",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // expires with subscription
      },
      {
        id: "ent-pro-2", 
        workspaceId: "workspace-tech-strategy",
        feature: "export_pdf",
        subscriptionId: "sub-tech-pro",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ent-pro-3",
        workspaceId: "workspace-tech-strategy",
        feature: "custom_templates",
        subscriptionId: "sub-tech-pro",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      
      // Enterprise tier entitlements
      {
        id: "ent-ent-1",
        workspaceId: "workspace-enterprise-main",
        feature: "advanced_ai",
        subscriptionId: "sub-enterprise-main",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ent-ent-2",
        workspaceId: "workspace-enterprise-main",
        feature: "sso_integration",
        subscriptionId: "sub-enterprise-main",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ent-ent-3",
        workspaceId: "workspace-enterprise-main",
        feature: "custom_branding",
        subscriptionId: "sub-enterprise-main",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ent-ent-4",
        workspaceId: "workspace-enterprise-main",
        feature: "dedicated_support",
        subscriptionId: "sub-enterprise-main",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      },
      
      // Custom enterprise entitlements (all features)
      {
        id: "ent-custom-1",
        workspaceId: "workspace-mega-compliance",
        feature: "custom_workflows",
        subscriptionId: "sub-mega-custom",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: "ent-custom-2",
        workspaceId: "workspace-mega-compliance",
        feature: "priority_queue",
        subscriptionId: "sub-mega-custom",
        templatePurchaseId: null,
        grantedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },

      // Template-based entitlements from purchases
      {
        id: "ent-template-1",
        workspaceId: "workspace-tech-strategy",
        feature: "template_executive_strategy",
        subscriptionId: null,
        templatePurchaseId: "purchase-1",
        grantedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        expiresAt: null, // permanent license
      },
      {
        id: "ent-template-2",
        workspaceId: "workspace-enterprise-main",
        feature: "template_professional_suite",
        subscriptionId: null,
        templatePurchaseId: "purchase-3",
        grantedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expiresAt: null, // permanent license
      }
    ];

    // Sample analysis sessions with different plan types
    const sampleAnalysisSessions = [
      {
        id: "session-demo-1",
        prompt: "Analyze the competitive landscape for cloud storage solutions",
        mode: "simple",
        userId: "user-demo",
        workspaceId: "workspace-demo",
        title: "Cloud Storage Competition Analysis",
        settings: {
          temperature: 0.7,
          model: "gpt-4",
          require_citations: false
        },
        results: {
          summary: "Basic analysis completed with free tier limitations",
          conclusion: "Demo analysis showing core functionality"
        }
      },
      {
        id: "session-pro-1",
        prompt: "Develop a comprehensive go-to-market strategy for our new SaaS product targeting enterprise customers",
        mode: "expert",
        userId: "user-pro",
        workspaceId: "workspace-tech-strategy",
        title: "Enterprise SaaS GTM Strategy",
        settings: {
          temperature: 0.8,
          model: "gpt-4",
          require_citations: true,
          enable_fact_check: true,
          debate_rounds: 6
        },
        results: {
          summary: "Comprehensive strategy developed using premium templates and advanced AI",
          conclusion: "Pro-tier analysis with advanced features enabled"
        }
      }
    ];

    console.log(`👥 Creating sample data:`);
    console.log(`   - ${sampleUsers.length} users across different subscription tiers`);
    console.log(`   - ${sampleOrganizations.length} organizations with varying plans`);
    console.log(`   - ${sampleWorkspaces.length} workspaces with different configurations`);
    console.log(`   - ${sampleSubscriptions.length} active subscriptions`);
    console.log(`   - ${sampleTemplatePurchases.length} template purchases`);
    console.log(`   - ${sampleEntitlements.length} feature entitlements`);
    console.log(`   - ${sampleAnalysisSessions.length} sample analysis sessions`);

    // Note: This is sample data for development and testing
    // In a real implementation, this would use the storage interface to create records
    console.log("✅ Sample data structure created successfully");
    
    return {
      users: sampleUsers,
      organizations: sampleOrganizations,
      workspaces: sampleWorkspaces,
      subscriptions: sampleSubscriptions,
      templatePurchases: sampleTemplatePurchases,
      entitlements: sampleEntitlements,
      analysisSessions: sampleAnalysisSessions
    };

  } catch (error) {
    console.error("❌ Error creating sample data:", error);
    throw error;
  }
}

// Export sample data for use by other parts of the system
export const SAMPLE_DATA = {
  DEMO_USER: {
    id: "user-demo",
    email: "demo@symbiosoai.com",
    plan: "free",
    workspace: "workspace-demo"
  },
  PRO_USER: {
    id: "user-pro", 
    email: "sarah.johnson@techstartup.com",
    plan: "pro",
    workspace: "workspace-tech-strategy"
  },
  ENTERPRISE_USER: {
    id: "user-enterprise-admin",
    email: "michael.chen@globalcorp.com", 
    plan: "enterprise",
    workspace: "workspace-enterprise-main"
  },
  CUSTOM_USER: {
    id: "user-custom-enterprise",
    email: "alex.rivera@megacorp.com",
    plan: "custom",
    workspace: "workspace-mega-compliance"
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSampleData().catch(console.error);
}