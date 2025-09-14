#!/usr/bin/env tsx
import { seedSampleData } from './sampleData.js';

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    await seedSampleData();
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

main();