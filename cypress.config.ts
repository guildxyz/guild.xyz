// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "cypress"
import fs from "fs"

export default defineConfig({
  e2e: {
    video: true,
    baseUrl: "http://localhost:3000",
    userAgent: "cypress",
    specPattern: "./cypress/e2e/**/*.spec.ts",
    env: {
      guildApiUrl: "https://api.guild.xyz/v2",
      userAddress: "0x304Def656Babc745c53782639D3CaB00aCe8C843",
      platformlessGuildName: "Platformless Cypress Gang",
      platformlessGuildUrlName: "platformless-cypress-gang",
      guildName: "Cypress Gang",
      guildUrlName: "cypress-gang",
      dcClientId: "868172385000509460",
      dcServerId: "1096417797292171365", // We'll delete the created roles in this Discord server
      tgId: "-1001653099938",
      DEPLOYMENT_ID: "localhost",
    },
    setupNodeEvents(on, config) {
      on(
        "after:spec",
        (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
          if (results && results.video) {
            // Do we have failures for any retry attempts?
            const failures = results.tests.some((test) =>
              test.attempts.some((attempt) => attempt.state === "failed")
            )
            if (!failures) {
              // delete the video if the spec passed and no tests retried
              fs.unlinkSync(results.video)
            }
          }
        }
      )
    },
  },
})
