#!/usr/bin/env node

/**
 * Percy Setup Script for Visual Regression Testing
 * 
 * This script helps set up Percy for visual regression testing
 * in the qb-webui project.
 */

const fs = require('fs');
const path = require('path');

console.log('Setting up Percy for visual regression testing...\n');

// Check if package.json exists
const packagePath = path.join(__dirname, '..', 'package.json');
if (!fs.existsSync(packagePath)) {
  console.error('Error: package.json not found!');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add Percy dependencies if not already present
const percyDeps = [
  '@percy/cli',
  '@percy/playwright'
];

let updatedPackage = false;

// Check and add dependencies
percyDeps.forEach(dep => {
  if (!packageJson.devDependencies || !packageJson.devDependencies[dep]) {
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    packageJson.devDependencies[dep] = '^1.0.0';
    console.log(`Added ${dep} to devDependencies`);
    updatedPackage = true;
  } else {
    console.log(`${dep} already installed`);
  }
});

// Add Percy test scripts if not present
const scriptsToAdd = {
  'test:visual': 'percy exec -- playwright test',
  'test:visual:ci': 'percy exec -- playwright test --reporter=html',
  'percy:setup': 'percy setup'
};

Object.keys(scriptsToAdd).forEach(scriptName => {
  if (!packageJson.scripts || !packageJson.scripts[scriptName]) {
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    packageJson.scripts[scriptName] = scriptsToAdd[scriptName];
    console.log(`Added ${scriptName} script`);
    updatedPackage = true;
  } else {
    console.log(`${scriptName} script already exists`);
  }
});

// Save updated package.json if we made changes
if (updatedPackage) {
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('\n✅ package.json updated successfully!');
  console.log('\nNext steps:');
  console.log('1. Run "npm install" to install new dependencies');
  console.log('2. Run "npm run percy:setup" to configure Percy');
  console.log('3. Add your Percy token to CI/CD environment variables');
} else {
  console.log('\n✅ All Percy dependencies are already installed');
  console.log('\nNext steps:');
  console.log('1. Run "npm run percy:setup" to configure Percy');
  console.log('2. Add your Percy token to CI/CD environment variables');
}

console.log('\nFor more information, visit: https://percy.io/docs');