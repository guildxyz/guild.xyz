import path from "node:path"
import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"
dotenv.config({ path: path.resolve(__dirname, ".env.local") })

const baseURL = process.env.DEPLOYMENT_URL || "http://localhost:3000"

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  testDir: "./playwright",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
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
  ],

  webServer: [
    {
      command: `anvil --fork-url=${process.env.ANVIL_FORK_URL} --fork-block-number=6373425 -m='${process.env.NEXT_PUBLIC_E2E_WALLET_MNEMONIC}' --fork-header='Authorization: ${process.env.ANVIL_FORK_KEY}'`,
      port: 8545,
    },
    {
      command: process.env.CI ? "" : "npm run start",
      url: baseURL,
      reuseExistingServer: true,
    },
  ],
})
