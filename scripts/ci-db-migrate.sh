#!/bin/bash

# CI/CD compatible database migration script

set -e

echo "🗄️ Running database migration..."

if command -v psql >/dev/null 2>&1 && [ -f "db/migrations/001_init.sql" ]; then
  echo "📝 Using psql with SQL migration file..."
  psql $DATABASE_URL -f db/migrations/001_init.sql
else
  echo "📝 Falling back to Drizzle push..."
  npm run db:push
fi

echo "✅ Database migration completed"