import { defineConfig, devices } from "@playwright/test"

const baseURL = "http://localhost:3003"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // GitHub-hosted Ubuntu already has Google Chrome. Playwright's
        // Chrome-for-Testing zip on cdn.playwright.dev 403s from some
        // Azure regions ("not available in your location").
        ...(process.env.CI ? { channel: "chrome" as const } : {}),
      },
    },
  ],
  webServer: {
    command: "bun run start -- --port 3003",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
