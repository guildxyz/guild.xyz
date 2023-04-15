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
  chromeWebSecurity: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  projectId: "kbncm6",
  experimentalSessionAndOrigin: true,
  env: {
    guildApiUrl: "https://api.guild.xyz/v1",
    guildName: "Cypress Gang",
    guildUrlName: "cypress-gang",
    dcClientId: "868172385000509460",
    tgId: "-1001653099938",
  },
  e2e: {
    setupNodeEvents,
    supportFile: "./cypress/support/e2e.ts",
    specPattern: "./cypress/e2e/**/*.spec.ts",
  },
})
