import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.DEPLOYMENT_URL || "http://localhost:3000"

export default defineConfig({
  testDir: "./playwright",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "html",
  outputDir: "playwright/results/",

  use: {
    baseURL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "auth-setup",
      testMatch: /auth\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        userAgent: `${devices["Desktop Chrome"].userAgent} GUILD_E2E`,
      },
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: `${devices["Desktop Chrome"].userAgent} GUILD_E2E`,
      },
      dependencies: ["auth-setup"],
    },
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //   },
    //   dependencies: ["auth-setup"],
    // },
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    //   dependencies: ["auth-setup"],
    // },
    // {
    //   name: "Mobile Chrome",
    //   use: {
    //     ...devices["Pixel 5"],
    //   },
    //   dependencies: ["auth-setup"],
    // },
    // {
    //   name: "Mobile Safari",
    //   use: {
    //     ...devices["iPhone 12"],
    //   },
    //   dependencies: ["auth-setup"],
    // },
  ],

  webServer: {
    command: "npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
