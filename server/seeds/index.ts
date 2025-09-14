import { seedWorkflowTemplates } from "./workflowTemplates";
import { seedSubscriptionPlans } from "./subscriptionPlans";
import { seedTemplateProducts } from "./templateProducts";
import { seedSampleData } from "./sampleData";

/**
 * Master seed function for Sprint 4 data
 * Runs all seeding operations in the correct order
 */
export async function seedAllData() {
  console.log("🌱 Starting Sprint 4 data seeding...");
  
  try {
    // Seed in dependency order
    console.log("\n1️⃣ Seeding workflow templates...");
    await seedWorkflowTemplates();
    
    console.log("\n2️⃣ Seeding subscription plans...");
    await seedSubscriptionPlans();
    
    console.log("\n3️⃣ Seeding template products...");
    await seedTemplateProducts();
    
    console.log("\n4️⃣ Seeding sample data...");
    await seedSampleData();
    
    console.log("\n✅ All Sprint 4 data seeded successfully!");
    console.log("📊 Sample data includes:");
    console.log("   - 4 subscription plans (free, pro, enterprise, custom)");
    console.log("   - 9 premium template products for marketplace");
    console.log("   - 4 sample users with different subscription tiers");
    console.log("   - 3 sample organizations with varying plans");
    console.log("   - 4 workspaces with different configurations");
    console.log("   - 4 active subscriptions");
    console.log("   - 4 template purchases for testing");
    console.log("   - 12+ feature entitlements");
    console.log("   - Workflow templates for automation");
    
  } catch (error) {
    console.error("❌ Error during data seeding:", error);
    throw error;
  }
}

// Individual seeding functions for selective use
export {
  seedWorkflowTemplates,
  seedSubscriptionPlans, 
  seedTemplateProducts,
  seedSampleData
};

// Run all seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAllData().catch(console.error);
}