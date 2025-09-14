#!/bin/bash

# CI/CD compatible Jest testing script

set -e

echo "🧪 Running Jest tests..."

# Remove conflicting config files
rm -f jest.config.js 2>/dev/null || true

if [ -f "node_modules/.bin/jest" ]; then
  echo "📝 Using local Jest with TypeScript config..."
  npx jest --config jest.config.ts --ci --runInBand --reporters=default --reporters=jest-junit
elif command -v jest >/dev/null 2>&1; then
  echo "📝 Using global Jest with TypeScript config..."
  jest --config jest.config.ts --ci --runInBand --reporters=default --reporters=jest-junit
else
  echo "📝 Installing Jest and running tests..."
  npm install --no-save jest@^29.7.0 ts-jest@^29.2.5 @types/jest@^29.5.12 jest-junit@^16.0.0 supertest@^6.3.4 @types/supertest@^6.0.2 ts-node@^10.9.2
  npx jest --config jest.config.ts --ci --runInBand --reporters=default --reporters=jest-junit
fi

echo "✅ Jest tests completed"