#!/usr/bin/env node
/**
 * Prisma initialization script for Vercel
 * This runs before the build and handles missing DATABASE_URL gracefully
 */

const fs = require('fs');
const path = require('path');

// If DATABASE_URL is not set, create a temporary one for build purposes
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not found, setting fallback for build...');
  
  // Use a dummy URL that allows the build to proceed
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/money-management';
  
  // Write it to .env.production if it doesn't exist
  const envFile = path.join(process.cwd(), '.env.production');
  if (!fs.existsSync(envFile)) {
    fs.writeFileSync(envFile, `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/money-management"\n`);
    console.log('✓ Created .env.production with fallback DATABASE_URL');
  }
}

console.log('✓ DATABASE_URL ready for Prisma');
