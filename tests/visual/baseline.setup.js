// Visual Regression Test Setup
// This file demonstrates the structure for setting up visual regression tests

/**
 * Critical Pages for Visual Regression Testing
 * These represent the main UI surfaces that should be tested
 */

const CRITICAL_PAGES = [
  {
    name: 'Login Page',
    path: '/login',
    description: 'Authentication interface'
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    description: 'Main overview page with stats'
  },
  {
    name: 'Torrents List',
    path: '/torrents/all',
    description: 'List of all torrents'
  },
  {
    name: 'Settings',
    path: '/settings',
    description: 'Application settings interface'
  },
  {
    name: 'Overview',
    path: '/overview',
    description: 'Detailed overview page'
  }
];

/**
 * Test Scenarios
 * Each scenario covers different aspects of visual testing
 */
const TEST_SCENARIOS = [
  {
    name: 'Default Theme',
    theme: 'light',
    description: 'Standard light theme rendering'
  },
  {
    name: 'Dark Theme',
    theme: 'dark',
    description: 'Dark theme rendering'
  },
  {
    name: 'Mobile View',
    viewport: 'mobile',
    description: 'Responsive mobile layout'
  },
  {
    name: 'Tablet View',
    viewport: 'tablet',
    description: 'Responsive tablet layout'
  },
  {
    name: 'Desktop View',
    viewport: 'desktop',
    description: 'Standard desktop layout'
  }
];

/**
 * Configuration for visual testing
 */
const VISUAL_TEST_CONFIG = {
  // Base URL of the application
  baseUrl: 'http://localhost:5173',
  
  // Timeout for page loads
  timeout: 30000,
  
  // Screenshot settings
  screenshotOptions: {
    fullPage: true,
    omitBackground: false,
    quality: 80
  },
  
  // Available browsers for testing
  browsers: ['chromium', 'firefox', 'webkit'],
  
  // Viewport sizes for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 }
  }
};

module.exports = {
  CRITICAL_PAGES,
  TEST_SCENARIOS,
  VISUAL_TEST_CONFIG
};