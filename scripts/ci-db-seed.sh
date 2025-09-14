#!/bin/bash

# CI/CD compatible database seeding script

set -e

echo "🌱 Running database seeding..."

if [ -f "db/seed/seed.ts" ] && command -v ts-node >/dev/null 2>&1; then
  echo "📝 Using ts-node with TypeScript seed file..."
  ts-node --transpile-only db/seed/seed.ts
else
  echo "📝 Falling back to tsx seed runner..."
  npx tsx server/seeds/run-seed.ts
fi

echo "✅ Database seeding completed"