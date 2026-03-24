# Baseline Screenshots Management

## Overview

Baseline screenshots are essential for visual regression testing. They represent the "known good" state of the UI that subsequent tests will compare against.

## Directory Structure

```
test-snapshots/
├── baseline/                # Baseline screenshots (committed to version control)
│   ├── login/
│   │   ├── light-desktop.png
│   │   ├── light-mobile.png
│   │   ├── dark-desktop.png
│   │   └── dark-mobile.png
│   ├── dashboard/
│   │   ├── light-desktop.png
│   │   ├── light-mobile.png
│   │   ├── dark-desktop.png
│   │   └── dark-mobile.png
│   ├── torrents/
│   │   ├── light-desktop.png
│   │   └── ... 
│   ├── settings/
│   │   ├── light-desktop.png
│   │   └── ...
│   └── overview/
│       ├── light-desktop.png
│       └── ...
└── temporary/              # Temporary screenshots (not committed)
    └── ...                 # For debugging/testing
```

## Generating Baseline Screenshots

### Prerequisites

1. Development server running:
   ```bash
   npm run dev
   ```

2. Playwright installed:
   ```bash
   npm install --save-dev @playwright/test playwright
   ```

3. Percy CLI installed (optional but recommended):
   ```bash
   npm install --save-dev @percy/cli
   ```

### Manual Generation Process

1. **Start the application** in development mode:
   ```bash
   npm run dev
   ```

2. **Run the baseline generator**:
   ```bash
   node scripts/generate-baselines.js
   ```

3. **Verify generated screenshots** in the `test-snapshots/baseline/` directory

### Automated Generation Script

The `scripts/generate-baselines.js` script automates the process of generating baseline screenshots for all critical pages and scenarios.

## Critical Pages and Scenarios

### Pages to Capture
1. **Login Page** (`/login`)
2. **Dashboard** (`/dashboard`) 
3. **Torrents List** (`/torrents/all`)
4. **Settings** (`/settings`)
5. **Overview** (`/overview`)

### Test Scenarios
1. **Default Theme** (light mode)
2. **Dark Theme** (dark mode)

### Viewport Sizes
1. **Mobile**: 375×667 pixels
2. **Tablet**: 768×1024 pixels  
3. **Desktop**: 1280×720 pixels

## Best Practices

### 1. Environment Consistency
- Always generate baselines in the same environment
- Use the same browser version and device characteristics
- Ensure consistent system fonts and rendering

### 2. Version Control
- Commit baseline screenshots to version control
- Update baselines only when intentional UI changes occur
- Maintain a clean git history for baseline changes

### 3. Naming Convention
- Follow the naming pattern: `{page}-{theme}-{viewport}.png`
- Example: `dashboard-light-desktop.png`

### 4. Regular Maintenance
- Review and update baselines periodically
- Remove outdated or unused baseline images
- Document significant UI changes that require baseline updates

## Updating Baselines

When intentional UI changes occur:

1. **Update the baseline**:
   ```bash
   # Run baseline generator to recreate screenshots
   node scripts/generate-baselines.js
   ```

2. **Commit new baselines**:
   ```bash
   git add test-snapshots/baseline/
   git commit -m "Update baseline screenshots for UI changes"
   ```

3. **Verify tests pass** with new baselines

## Troubleshooting

### Common Issues

1. **Screenshots don't match**:
   - Check browser compatibility
   - Verify environment consistency
   - Ensure all dependencies are up to date

2. **Missing dependencies**:
   - Run `npm install` to install Playwright
   - Make sure development server is running

3. **Permission errors**:
   - Ensure proper file permissions
   - Check that output directory is writable

## Integration with Testing Pipeline

Baseline screenshots are used in visual regression tests to compare against current UI state:

```javascript
// Example test using baseline comparison
test('Dashboard should not have visual regressions', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Compare with baseline screenshot
  const screenshot = await page.screenshot({ fullPage: true });
  expect(screenshot).toMatchImageSnapshot({
    customSnapshotIdentifier: 'dashboard-light-desktop'
  });
});
```

## Related Commands

- Generate baselines: `node scripts/generate-baselines.js`
- Run visual tests: `npm run test:visual`
- Run tests with Percy: `npm run test:visual:ci`