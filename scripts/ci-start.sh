#!/bin/bash

# CI/CD compatible server start script

set -e

echo "🚀 Starting server..."

if [ -f "dist/server.js" ]; then
  echo "📝 Using compiled server (node dist/server.js)..."
  node dist/server.js
elif [ -f "dist/index.js" ]; then
  echo "📝 Using compiled index (npm start)..."
  npm start
else
  echo "📝 Using development server..."
  npm run dev
fi