import type { PlaywrightTestConfig } from '@playwright/test'

export default {
  testDir: `./tests`,
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
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
    command: `pnpm dev --port 3005`,
    port: 3005,
    reuseExistingServer: !process.env.CI,
  },
} satisfies PlaywrightTestConfig
