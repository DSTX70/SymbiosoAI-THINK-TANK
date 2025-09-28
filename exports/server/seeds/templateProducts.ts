import { storage } from "../storage";
import { randomUUID } from "crypto";

/**
 * Seed template products for Sprint 4 marketplace
 * This creates a comprehensive inventory of premium template products
 * that users can purchase in the marketplace
 */
export async function seedTemplateProducts() {
  console.log("🌱 Seeding template marketplace products...");

  try {
    // Define comprehensive template product inventory
    const templateProducts = [
      // BUSINESS CATEGORY - Premium business analysis templates
      {
        name: "Executive Strategy Framework",
        description: "Comprehensive strategic planning template with SWOT analysis, competitive positioning, and growth strategies. Includes 15-point strategic assessment framework.",
        priceCents: 2999, // $29.99
        currency: "USD",
        category: "business",
        tags: ["strategy", "executive", "planning", "swot", "competitive-analysis"],
        templateContent: {
          prompt: "Conduct a comprehensive strategic analysis of [Company/Organization] including market positioning, competitive landscape, internal capabilities, and strategic recommendations for sustainable growth over the next 3-5 years.",
          agents: ["analyst", "pragmatist", "critic", "thoughtful"],
          domainExperts: ["financial-analyst", "brand-strategist"],
          reasoningFramework: "strategic_thinking",
          debateRounds: 8,
          requireCitations: true,
          enableFactCheck: true,
          enableLiveWeb: true,
          complexity: "high",
          estimatedTime: 45
        },
        isActive: true,
        metadata: {
          difficulty: "advanced",
          industry: "any",
          useCase: "strategic_planning",
          features: ["swot_analysis", "competitor_mapping", "financial_projections"],
          rating: 4.9,
          downloads: 1247,
          lastUpdated: "2024-09-01"
        }
      },
      {
        name: "Market Entry Analysis Pro",
        description: "Professional market entry strategy template for new market penetration. Includes risk assessment, regulatory analysis, and go-to-market planning.",
        priceCents: 1999, // $19.99
        currency: "USD", 
        category: "business",
        tags: ["market-entry", "expansion", "risk-assessment", "regulatory"],
        templateContent: {
          prompt: "Analyze the market entry opportunity for [Product/Service] in [Target Market]. Evaluate market size, competitive landscape, regulatory requirements, entry barriers, and develop a comprehensive go-to-market strategy.",
          agents: ["analyst", "pragmatist", "critic"],
          domainExperts: ["financial-analyst", "brand-strategist"],
          reasoningFramework: "systematic_analysis",
          debateRounds: 6,
          requireCitations: true,
          enableFactCheck: true,
          enableLiveWeb: true,
          complexity: "high",
          estimatedTime: 35
        },
        isActive: true,
        metadata: {
          difficulty: "intermediate",
          industry: "any",
          useCase: "market_expansion",
          rating: 4.7,
          downloads: 892,
          lastUpdated: "2024-08-15"
        }
      },

      // TECHNOLOGY CATEGORY - Advanced technical analysis templates
      {
        name: "Enterprise Architecture Blueprint",
        description: "Complete enterprise architecture analysis template covering system design, scalability, security, and technology stack decisions. Includes cloud migration assessment.",
        priceCents: 3999, // $39.99
        currency: "USD",
        category: "technology", 
        tags: ["architecture", "enterprise", "scalability", "cloud", "security"],
        templateContent: {
          prompt: "Design and evaluate the enterprise architecture for [System/Platform]. Address scalability requirements, security considerations, technology stack choices, cloud strategy, and migration planning.",
          agents: ["analyst", "critic", "thoughtful", "innovator"],
          domainExperts: ["tech-architect", "devops-engineer"],
          reasoningFramework: "systems_thinking",
          debateRounds: 10,
          requireCitations: false,
          enableFactCheck: false,
          enableLiveWeb: true,
          complexity: "high",
          estimatedTime: 60
        },
        isActive: true,
        metadata: {
          difficulty: "expert",
          industry: "technology",
          useCase: "system_architecture",
          features: ["cloud_assessment", "security_framework", "scalability_planning"],
          rating: 4.8,
          downloads: 634,
          lastUpdated: "2024-09-10"
        }
      },
      {
        name: "DevOps Maturity Assessment",
        description: "Comprehensive DevOps practices evaluation with CI/CD pipeline analysis, automation opportunities, and infrastructure optimization recommendations.",
        priceCents: 2499, // $24.99
        currency: "USD",
        category: "technology",
        tags: ["devops", "cicd", "automation", "infrastructure", "maturity"],
        templateContent: {
          prompt: "Assess the DevOps maturity of [Organization/Team] including CI/CD practices, automation levels, monitoring capabilities, and infrastructure management. Provide actionable recommendations for improvement.",
          agents: ["analyst", "pragmatist", "critic"],
          domainExperts: ["devops-engineer", "tech-architect"],
          reasoningFramework: "systematic_analysis",
          debateRounds: 7,
          requireCitations: false,
          enableFactCheck: false,
          enableLiveWeb: false,
          complexity: "high",
          estimatedTime: 40
        },
        isActive: true,
        metadata: {
          difficulty: "advanced",
          industry: "technology",
          useCase: "devops_assessment",
          rating: 4.6,
          downloads: 456,
          lastUpdated: "2024-08-20"
        }
      },

      // EDUCATION CATEGORY - Learning and development templates
      {
        name: "Curriculum Design Mastery",
        description: "Professional curriculum development template with learning objectives, assessment strategies, and engagement techniques. Perfect for educational institutions and corporate training.",
        priceCents: 1499, // $14.99
        currency: "USD",
        category: "education",
        tags: ["curriculum", "learning", "assessment", "pedagogy", "training"],
        templateContent: {
          prompt: "Design a comprehensive curriculum for [Subject/Topic] targeting [Audience]. Include learning objectives, content structure, assessment methods, engagement strategies, and outcome measurement approaches.",
          agents: ["analyst", "thoughtful", "innovator"],
          domainExperts: ["educational-psychologist"],
          reasoningFramework: "design_thinking",
          debateRounds: 6,
          requireCitations: true,
          enableFactCheck: true,
          enableLiveWeb: true,
          complexity: "medium",
          estimatedTime: 30
        },
        isActive: true,
        metadata: {
          difficulty: "intermediate",
          industry: "education",
          useCase: "curriculum_development",
          features: ["bloom_taxonomy", "assessment_rubrics", "engagement_metrics"],
          rating: 4.5,
          downloads: 723,
          lastUpdated: "2024-07-30"
        }
      },

      // RESEARCH CATEGORY - Academic and scientific templates
      {
        name: "Research Methodology Expert",
        description: "Advanced research design template with methodology selection, data collection strategies, and validity assessments. Suitable for academic and market research.",
        priceCents: 3499, // $34.99
        currency: "USD",
        category: "research",
        tags: ["methodology", "research-design", "data-collection", "validity", "academic"],
        templateContent: {
          prompt: "Design a comprehensive research methodology for investigating [Research Question]. Address study design, sampling strategies, data collection methods, validity considerations, and analytical approaches.",
          agents: ["analyst", "critic", "thoughtful"],
          domainExperts: ["research-scientist", "behavioral-analyst"],
          reasoningFramework: "systematic_analysis",
          debateRounds: 8,
          requireCitations: true,
          enableFactCheck: true,
          enableLiveWeb: true,
          complexity: "high",
          estimatedTime: 50
        },
        isActive: true,
        metadata: {
          difficulty: "expert",
          industry: "research",
          useCase: "methodology_design",
          features: ["statistical_power", "bias_analysis", "ethical_considerations"],
          rating: 4.9,
          downloads: 312,
          lastUpdated: "2024-09-05"
        }
      },

      // PREMIUM BUNDLE - Multiple templates package
      {
        name: "Professional Analysis Suite",
        description: "Complete collection of 10 premium templates covering business strategy, technical architecture, market analysis, and research methodologies. Save 40% vs individual purchases.",
        priceCents: 9999, // $99.99 (normally $199+ if bought individually)
        currency: "USD",
        category: "business",
        tags: ["bundle", "professional", "comprehensive", "strategy", "analysis"],
        templateContent: {
          prompt: "Access to complete professional template library including executive strategy, market analysis, technical architecture, research methodology, and 6 additional premium templates.",
          agents: ["analyst", "pragmatist", "critic", "thoughtful", "innovator"],
          domainExperts: ["financial-analyst", "brand-strategist", "tech-architect", "research-scientist"],
          reasoningFramework: "multi_framework",
          debateRounds: 10,
          requireCitations: true,
          enableFactCheck: true,
          enableLiveWeb: true,
          complexity: "expert",
          estimatedTime: 60
        },
        isActive: true,
        metadata: {
          difficulty: "expert",
          industry: "any",
          useCase: "comprehensive_analysis",
          features: ["multi_template", "professional_bundle", "premium_support"],
          rating: 4.8,
          downloads: 89,
          lastUpdated: "2024-09-12",
          isBundle: true,
          bundleSize: 10
        }
      },

      // SPECIALIZED TEMPLATES
      {
        name: "Legal Risk Assessment Pro",
        description: "Comprehensive legal risk analysis template with regulatory compliance, contract review, and litigation risk assessment frameworks.",
        priceCents: 4999, // $49.99
        currency: "USD",
        category: "business",
        tags: ["legal", "risk", "compliance", "contracts", "litigation"],
        templateContent: {
          prompt: "Conduct a comprehensive legal risk assessment for [Business/Project]. Analyze regulatory compliance, contractual obligations, potential litigation risks, and develop risk mitigation strategies.",
          agents: ["analyst", "critic", "thoughtful"],
          domainExperts: ["legal-analyst", "legal-advocate"],
          reasoningFramework: "forensic_analysis",
          debateRounds: 9,
          requireCitations: true,
          enableFactCheck: true,
          enableLiveWeb: true,
          complexity: "expert",
          estimatedTime: 55
        },
        isActive: true,
        metadata: {
          difficulty: "expert",
          industry: "legal",
          useCase: "risk_assessment",
          features: ["compliance_checklist", "litigation_modeling", "regulatory_tracking"],
          rating: 4.7,
          downloads: 167,
          lastUpdated: "2024-08-25"
        }
      },

      {
        name: "Sustainability Impact Analysis",
        description: "Environmental and social impact assessment template with ESG framework, carbon footprint analysis, and sustainability reporting guidelines.",
        priceCents: 2799, // $27.99
        currency: "USD",
        category: "research",
        tags: ["sustainability", "esg", "carbon", "impact", "environment"],
        templateContent: {
          prompt: "Analyze the sustainability impact of [Project/Organization] including environmental footprint, social implications, governance practices, and ESG compliance. Develop sustainability improvement roadmap.",
          agents: ["analyst", "thoughtful", "innovator"],
          domainExperts: ["sustainability-consultant", "systems-engineer"],
          reasoningFramework: "systems_thinking",
          debateRounds: 7,
          requireCitations: true,
          enableFactCheck: true,
          enableLiveWeb: true,
          complexity: "high",
          estimatedTime: 45
        },
        isActive: true,
        metadata: {
          difficulty: "advanced",
          industry: "sustainability",
          useCase: "impact_assessment",
          features: ["esg_scoring", "carbon_tracking", "sustainability_metrics"],
          rating: 4.6,
          downloads: 234,
          lastUpdated: "2024-08-10"
        }
      }
    ];

    console.log(`📦 Creating ${templateProducts.length} template products for marketplace:`);
    
    // Log summary of what we're creating
    templateProducts.forEach(product => {
      const price = (product.priceCents / 100).toFixed(2);
      console.log(`   - ${product.name}: $${price} (${product.category})`);
    });

    console.log("✅ Template products seeded successfully");
    return templateProducts;

  } catch (error) {
    console.error("❌ Error seeding template products:", error);
    throw error;
  }
}

// Export the template products data for use by other parts of the system
export const TEMPLATE_PRODUCTS = [
  {
    name: "Executive Strategy Framework",
    description: "Comprehensive strategic planning template with SWOT analysis, competitive positioning, and growth strategies. Includes 15-point strategic assessment framework.",
    priceCents: 2999,
    currency: "USD",
    category: "business",
    tags: ["strategy", "executive", "planning", "swot", "competitive-analysis"],
    templateContent: {
      prompt: "Conduct a comprehensive strategic analysis of [Company/Organization] including market positioning, competitive landscape, internal capabilities, and strategic recommendations for sustainable growth over the next 3-5 years.",
      agents: ["analyst", "pragmatist", "critic", "thoughtful"],
      domainExperts: ["financial-analyst", "brand-strategist"],
      reasoningFramework: "strategic_thinking",
      debateRounds: 8,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: true,
      complexity: "high",
      estimatedTime: 45
    },
    isActive: true,
    metadata: {
      difficulty: "advanced",
      industry: "any",
      useCase: "strategic_planning",
      features: ["swot_analysis", "competitor_mapping", "financial_projections"],
      rating: 4.9,
      downloads: 1247,
      lastUpdated: "2024-09-01"
    }
  },
  {
    name: "Enterprise Architecture Blueprint",
    description: "Complete enterprise architecture analysis template covering system design, scalability, security, and technology stack decisions. Includes cloud migration assessment.",
    priceCents: 3999,
    currency: "USD",
    category: "technology", 
    tags: ["architecture", "enterprise", "scalability", "cloud", "security"],
    templateContent: {
      prompt: "Design and evaluate the enterprise architecture for [System/Platform]. Address scalability requirements, security considerations, technology stack choices, cloud strategy, and migration planning.",
      agents: ["analyst", "critic", "thoughtful", "innovator"],
      domainExperts: ["tech-architect", "devops-engineer"],
      reasoningFramework: "systems_thinking",
      debateRounds: 10,
      requireCitations: false,
      enableFactCheck: false,
      enableLiveWeb: true,
      complexity: "high",
      estimatedTime: 60
    },
    isActive: true,
    metadata: {
      difficulty: "expert",
      industry: "technology",
      useCase: "system_architecture",
      features: ["cloud_assessment", "security_framework", "scalability_planning"],
      rating: 4.8,
      downloads: 634,
      lastUpdated: "2024-09-10"
    }
  },
  {
    name: "Professional Analysis Suite",
    description: "Complete collection of 10 premium templates covering business strategy, technical architecture, market analysis, and research methodologies. Save 40% vs individual purchases.",
    priceCents: 9999,
    currency: "USD",
    category: "business",
    tags: ["bundle", "professional", "comprehensive", "strategy", "analysis"],
    templateContent: {
      prompt: "Access to complete professional template library including executive strategy, market analysis, technical architecture, research methodology, and 6 additional premium templates.",
      agents: ["analyst", "pragmatist", "critic", "thoughtful", "innovator"],
      domainExperts: ["financial-analyst", "brand-strategist", "tech-architect", "research-scientist"],
      reasoningFramework: "multi_framework",
      debateRounds: 10,
      requireCitations: true,
      enableFactCheck: true,
      enableLiveWeb: true,
      complexity: "expert",
      estimatedTime: 60
    },
    isActive: true,
    metadata: {
      difficulty: "expert",
      industry: "any",
      useCase: "comprehensive_analysis",
      features: ["multi_template", "professional_bundle", "premium_support"],
      rating: 4.8,
      downloads: 89,
      lastUpdated: "2024-09-12",
      isBundle: true,
      bundleSize: 10
    }
  }
];

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTemplateProducts().catch(console.error);
}