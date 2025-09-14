#!/bin/bash

# CI/CD compatible Postman testing script

set -e

BASE_URL=${BASE_URL:-http://localhost:3000}

echo "🧪 Running Postman collection tests..."
echo "📍 Base URL: $BASE_URL"

# Create reports directory
mkdir -p reports

# Use npm script for consistent behavior
if [ -f "package.json" ] && grep -q "postman:test" package.json; then
  echo "📝 Using npm script for Newman tests..."
  BASE_URL=$BASE_URL npm run postman:test
else
  echo "📝 Running Newman directly..."
  if command -v newman >/dev/null 2>&1; then
    newman run ./postman/demo-collection.json \
      --env-var baseUrl=$BASE_URL \
      --reporters cli,json,junit,htmlextra \
      --reporter-json-export ./reports/postman.json \
      --reporter-junit-export ./reports/postman.junit.xml \
      --reporter-htmlextra-export ./reports/postman.html \
      --timeout-request 60000 --delay-request 100
  else
    npm install --no-save newman@^6.2.0 newman-reporter-htmlextra@^1.23.1
    npx newman run ./postman/demo-collection.json \
      --env-var baseUrl=$BASE_URL \
      --reporters cli,json,junit,htmlextra \
      --reporter-json-export ./reports/postman.json \
      --reporter-junit-export ./reports/postman.junit.xml \
      --reporter-htmlextra-export ./reports/postman.html \
      --timeout-request 60000 --delay-request 100
  fi
fi

echo "✅ Postman tests completed"
echo "📊 Reports available in ./reports/"
echo "   - CLI output above"
echo "   - JSON: ./reports/postman.json"
echo "   - JUnit: ./reports/postman.junit.xml"
echo "   - HTML: ./reports/postman.html"