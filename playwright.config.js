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