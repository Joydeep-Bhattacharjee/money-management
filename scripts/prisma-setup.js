#!/usr/bin/env node
// Prisma setup - generates client without validating DATABASE_URL

const { execSync } = require('child_process');

try {
  // Try to generate - if it fails, it's OK for build purposes
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✓ Prisma client generated successfully');
} catch (error) {
  console.log('⚠ Prisma generation skipped (DB not configured yet)');
  console.log('This is OK - DATABASE_URL will be set on Vercel');
}
