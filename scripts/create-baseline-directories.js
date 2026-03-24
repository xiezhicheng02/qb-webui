#!/usr/bin/env node

/**
 * Baseline Directory Creator
 * 
 * Creates the required directory structure for baseline screenshots
 */

const fs = require('fs');
const path = require('path');

// Define the directory structure
const DIR_STRUCTURE = [
  'test-snapshots/baseline/login',
  'test-snapshots/baseline/dashboard', 
  'test-snapshots/baseline/torrents',
  'test-snapshots/baseline/settings',
  'test-snapshots/baseline/overview',
  'test-snapshots/temporary'
];

// Define file patterns for each page
const FILE_PATTERNS = [
  '{page}-{theme}-{viewport}.png'
];

console.log('📁 Creating baseline directory structure...');
console.log('==========================================\n');

// Create each directory
let createdCount = 0;
let errorCount = 0;

DIR_STRUCTURE.forEach(dirPath => {
  try {
    // Create directory recursively
    fs.mkdirSync(path.join(__dirname, '..', dirPath), { recursive: true });
    console.log(`✅ Created: ${dirPath}`);
    createdCount++;
  } catch (err) {
    console.error(`❌ Error creating ${dirPath}: ${err.message}`);
    errorCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Created: ${createdCount} directories`);
console.log(`   Errors: ${errorCount} directories`);

if (errorCount === 0) {
  console.log('\n🎉 All directories created successfully!');
  console.log('\nNext steps:');
  console.log('1. Generate baseline screenshots using:');
  console.log('   node scripts/generate-baselines.js');
  console.log('2. Commit the baseline screenshots to version control');
} else {
  console.log('\n⚠️  Some directories had issues. Please check the errors above.');
}

console.log('\n📁 Directory structure created:');
console.log('test-snapshots/');
console.log('├── baseline/');
console.log('│   ├── login/');
console.log('│   ├── dashboard/');
console.log('│   ├── torrents/');
console.log('│   ├── settings/');
console.log('│   └── overview/');
console.log('└── temporary/');