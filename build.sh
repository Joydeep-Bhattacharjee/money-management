#!/bin/bash
# Vercel build script that handles missing DATABASE_URL gracefully

# Set a fallback DATABASE_URL if not provided
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL not set, using fallback..."
  export DATABASE_URL="postgresql://user:password@localhost/money-management"
fi

# Generate Prisma client without running migrations
npx prisma generate || true

# Build Next.js app
npm run build
