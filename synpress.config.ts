/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "cypress"
import setupNodeEvents from "./cypress/plugins"

export default defineConfig({
  userAgent: "synpress",
  retries: {
    openMode: 0,
    runMode: 0,
  },
  fixturesFolder: "./cypress/fixtures",
  screenshotsFolder: "./cypress/screenshots",
  videosFolder: "./cypress/videos",
  // supportFile: "./cypress/support",
  // pluginsFile: "./cypress/plugins",
  chromeWebSecurity: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  projectId: "kbncm6",
  env: {
    guildName: "Cypress Gang",
    guildUrlName: "cypress-gang",
    dcInvite: "https://discord.gg/P46EfccWcP",
    tgId: "-1001653099938",
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents,
    supportFile: "./cypress/support/e2e.ts",
    specPattern: "./cypress/e2e/**/*.cy.ts",
  },
})
