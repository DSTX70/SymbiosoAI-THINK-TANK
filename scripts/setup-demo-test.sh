#!/bin/bash

# Demo test environment setup script
# Sets up and runs the complete demo testing pipeline

set -e

DATABASE_URL=${DATABASE_URL:-$DATABASE_URL}
BASE_URL=${BASE_URL:-http://localhost:3000}

echo "🌱 Setting up demo test environment..."

# Set environment variables for demo mode
export NODE_ENV=development  
export ENABLE_DEMO_LOGIN=true
export DATABASE_URL="$DATABASE_URL"

echo "📊 Environment:"
echo "   NODE_ENV: $NODE_ENV"
echo "   ENABLE_DEMO_LOGIN: $ENABLE_DEMO_LOGIN"
echo "   BASE_URL: $BASE_URL"

# Run database migrations
echo "🔄 Running database migrations..."
npm run db:push

# Seed sample data (including demo user)
echo "🌱 Seeding sample data..."
npx tsx server/seeds/run-seed.ts

echo "✅ Demo test environment setup completed"
echo "🚀 You can now:"
echo "   - Start server: npm run dev"
echo "   - Run tests: ./scripts/postman-test.sh $BASE_URL"
echo "   - Visit demo walkthrough: $BASE_URL/demo-test"