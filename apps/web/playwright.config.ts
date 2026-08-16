import { defineConfig, devices } from "@playwright/test"

const baseURL = "http://localhost:3003"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run start -- --port 3003",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
