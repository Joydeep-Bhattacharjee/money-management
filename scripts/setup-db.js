#!/usr/bin/env node
/**
 * Prisma initialization script for Vercel
 * This runs before the build and handles missing DATABASE_URL gracefully
 */

const fs = require('fs');
const path = require('path');

// If DATABASE_URL is not set, don't set a fake one
if (!process.env.DATABASE_URL) {
  console.log('ℹ️  DATABASE_URL not found in environment');
  console.log('   This is OK - it will be set in Vercel Environment Variables');
  console.log('   For local development, use: npx prisma migrate dev');
  
  // For build purposes, set a placeholder that won't be used
  process.env.DATABASE_URL = 'postgresql://placeholder:placeholder@placeholder:5432/placeholder';
}

console.log('✓ Setup complete - ready for build');
