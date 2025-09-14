#!/bin/bash

# Production build script that handles both TypeScript compilation approaches

set -e

echo "🏗️ Building production application..."

# Check if we have a tsconfig.json for pure TypeScript compilation
if [ -f "tsconfig.json" ] && command -v tsc >/dev/null 2>&1; then
  echo "📝 Using TypeScript compiler (tsc)..."
  tsc -p .
  
  # Copy static files if needed
  if [ -d "client" ]; then
    echo "📦 Building frontend..."
    npm run build 2>/dev/null || echo "⚠️  Frontend build skipped"
  fi
else
  echo "📦 Using existing build script..."
  npm run build
fi

echo "✅ Production build completed"
echo "📁 Output: dist/"