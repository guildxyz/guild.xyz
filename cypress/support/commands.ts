Cypress.Commands.add("getByDataTest", (selector: string) =>
  cy.get(`[data-test='${selector}']`)
)

Cypress.Commands.add("connectWallet", () => {
  cy.intercept("POST", `${Cypress.env("guildApiUrl")}/users/*/public-key`).as(
    "setPubKey"
  )

  cy.getByDataTest("connect-wallet-button").click()
  cy.contains("Mock").click()

  cy.getByDataTest("verify-address-button").should("be.visible")
  cy.getByDataTest("verify-address-button").click()

  cy.wait("@setPubKey").its("response.statusCode").should("eq", 200)
})

Cypress.Commands.add("clearIndexedDB", () => {
  indexedDB.deleteDatabase("guild.xyz")
})

Cypress.Commands.add("waitForAccessCheck", () => {
  cy.intercept(
    "GET",
    `${Cypress.env("guildApiUrl").replace("v2", "v1")}/guild/access/**`
  ).as("accessCheckRequest")
  cy.wait("@accessCheckRequest", { timeout: 30_000 })
})

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    getByDataTest(selector: string): Chainable<JQuery<HTMLElement>>
    connectWallet(): Chainable<JQuery<HTMLElement>>
    clearIndexedDB(): Chainable<JQuery<HTMLElement>>
    waitForAccessCheck(): Chainable<JQuery<HTMLElement>>
  }
}
