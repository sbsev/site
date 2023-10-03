import type { PlaywrightTestConfig } from '@playwright/test'

export default {
  timeout: 100000,
  webServer: {
    command: `vite dev --port 3005`,
    port: 3005,
  },
} satisfies PlaywrightTestConfig
