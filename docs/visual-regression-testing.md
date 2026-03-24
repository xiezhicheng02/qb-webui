# Visual Regression Testing Setup

## Overview

This document outlines the setup for visual regression testing to prevent visual regressions during the Tailwind CSS migration.

## Setup Instructions

### Prerequisites

1. Node.js (v16+) installed
2. npm (v8+) installed
3. Access to Percy account (or alternative visual testing service)

### Installation Steps

1. **Install core dependencies**:
   ```bash
   npm install --save-dev @playwright/test playwright
   ```

2. **For Percy integration** (recommended):
   ```bash
   npm install --save-dev @percy/cli @percy/playwright
   ```

3. **Run the Percy setup script** (alternative approach):
   ```bash
   node scripts/setup-percy.js
   ```

### Configuration Files

#### Playwright Configuration (`playwright.config.js`)

```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/visual',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html'],
    ['json', { outputFile: 'test-results/report.json' }]
  ],
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...require('@playwright/test').devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...require('@playwright/test').devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...require('@playwright/test').devices['Desktop Safari'],
      },
    },
  ],
  outputDir: 'test-results/',
  snapshotDir: 'test-snapshots/',
});
```

#### Test Structure

The visual tests should be organized in the `tests/visual` directory and follow this structure:

1. **Baseline Setup** (`tests/visual/baseline.setup.js`) - Defines critical pages and test scenarios
2. **Individual Page Tests** - Specific tests for each critical page:
   - `dashboard.visual.test.js`
   - `login.visual.test.js`
   - `torrents.visual.test.js`
   - `settings.visual.test.js`
   - `overview.visual.test.js`

## Critical Pages for Baseline Screenshots

Based on the application structure, these are the critical pages that should have baseline screenshots:

1. Login Page (`/login`)
2. Dashboard (`/dashboard`) 
3. Torrents List (`/torrents/all`)
4. Settings (`/settings`)
5. Overview (`/overview`)

## Test Scenarios

Tests should cover various scenarios:

1. **Theme Variations**: Light and dark themes
2. **Viewport Sizes**: Mobile, tablet, and desktop views
3. **Page States**: Empty states, loading states, populated states
4. **Interactions**: Hover effects, modal displays, dropdowns

## Running Visual Regression Tests

To run visual tests locally:
```bash
npm run test:visual
```

To run with browser visible:
```bash
npm run test:visual:headed
```

To run in CI environment:
```bash
npm run test:visual:ci
```

## Percy Integration (Recommended)

For a robust solution, integrate with Percy:

1. **Sign up for a free Percy account** at percy.io
2. **Configure Percy in your tests**:
   ```javascript
   const { test, expect } = require('@playwright/test');
   const percy = require('@percy/playwright');
   
   test('visual regression test', async ({ page }) => {
     await page.goto('/');
     await percy.snapshot(page, 'Home Page');
   });
   ```

3. **Set your Percy token** as environment variable:
   ```bash
   export PERCY_TOKEN=your-token-here
   ```

4. **Run with Percy**:
   ```bash
   npm run test:visual
   ```

## Implementation Plan

### Phase 1: Basic Setup
- [x] Create configuration files
- [x] Document setup process
- [x] Create test structure templates

### Phase 2: Baseline Screenshots
- [x] Create baseline screenshots for critical pages
- [x] Document baseline management process
- [ ] Implement Percy integration (when dependencies install properly)

### Phase 3: CI Integration
- [ ] Configure CI pipeline for automated testing
- [ ] Set up visual diff reporting