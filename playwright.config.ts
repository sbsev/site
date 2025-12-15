import type { PlaywrightTestConfig } from '@playwright/test'

export default {
  testDir: `./tests`,
  timeout: 2 * 60 * 1000, // 2 minutes per test
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: `html`,
  use: {
    baseURL: `http://localhost:3005`,
    trace: `on-first-retry`,
  },
  projects: [
    {
      name: `chromium`,
      use: { browserName: `chromium` },
    },
    {
      name: `firefox`,
      use: { browserName: `firefox` },
    },
    {
      name: `webkit`,
      use: { browserName: `webkit` },
    },
  ],
  webServer: {
    // In CI, use preview (serves built files) for stability
    // Locally, use dev for faster iteration
    command: process.env.CI
      ? `pnpm preview --port 3005`
      : `pnpm dev --port 3005`,
    port: 3005,
    reuseExistingServer: !process.env.CI,
    timeout: 2 * 60 * 1000, // 2 minutes to start server
  },
} satisfies PlaywrightTestConfig
