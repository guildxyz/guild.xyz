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
  videoUploadOnPasses: false,
  chromeWebSecurity: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  projectId: "kbncm6",
  env: {
    guildApiUrl: "https://api.guild.xyz/v1",
    userAddress: "0x304Def656Babc745c53782639D3CaB00aCe8C843",
    platformlessGuildName: "Platformless Cypress Gang",
    platformlessGuildUrlName: "platformless-cypress-gang",
    guildName: "Cypress Gang",
    guildUrlName: "cypress-gang",
    dcClientId: "868172385000509460",
    dcServerId: "1096417797292171365", // We'll delete the created roles in this Discord server
    tgId: "-1001653099938",
  },
  e2e: {
    setupNodeEvents,
    supportFile: "./cypress/support/e2e.ts",
    specPattern: "./cypress/e2e/**/*.spec.ts",
    excludeSpecPattern: "./cypress/e2e/0-platformless/1-manage-roles.spec.ts",
  },
})
