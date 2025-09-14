#!/bin/bash

# Postman test runner script using Newman
# Usage: ./scripts/postman-test.sh [BASE_URL]

set -e

BASE_URL=${1:-http://localhost:3000}

echo "🧪 Running Postman collection tests..."
echo "📍 Base URL: $BASE_URL"

# Create reports directory
mkdir -p reports

# Run Newman with all reporters
npx newman run ./postman/demo-collection.json \
  --env-var baseUrl="$BASE_URL" \
  --reporters cli,json,junit,htmlextra \
  --reporter-json-export ./reports/postman.json \
  --reporter-junit-export ./reports/postman.junit.xml \
  --reporter-htmlextra-export ./reports/postman.html \
  --timeout-request 60000 \
  --delay-request 100

echo "✅ Postman tests completed"
echo "📊 Reports available in ./reports/"
echo "   - CLI output above"
echo "   - JSON: ./reports/postman.json"  
echo "   - JUnit: ./reports/postman.junit.xml"
echo "   - HTML: ./reports/postman.html"