// Database seeding script compatible with ts-node
import { seedSampleData } from '../../server/seeds/sampleData.js';

async function main() {
  try {
    console.log('🌱 Starting database seeding (ts-node compatible)...');
    await seedSampleData();
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

main();