#!/usr/bin/env node
/**
 * Easy setup - uses SQLite for both local and production
 */

// SQLite works everywhere - no configuration needed!
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./prisma/dev.db';
  console.log('✓ Using SQLite database');
}

console.log('✓ Setup complete');
