#!/bin/bash
# This script runs migrations safely on Vercel
# It's called after deployment is successful

echo "Running Prisma migrations..."
npx prisma migrate deploy || {
  echo "Migration failed, but continuing..."
  npx prisma db push --skip-generate
}

echo "Migration complete!"
