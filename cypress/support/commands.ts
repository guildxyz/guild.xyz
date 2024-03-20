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

  cy.wait("@setPubKey", { requestTimeout: 30_000, responseTimeout: 30_000 })
    .its("response.statusCode")
    .should("eq", 200)
})

Cypress.Commands.add("clearIndexedDB", () => {
  indexedDB.deleteDatabase("guild.xyz")
})

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    getByDataTest(selector: string): Chainable<JQuery<HTMLElement>>
    connectWallet(): Chainable<JQuery<HTMLElement>>
    clearIndexedDB(): Chainable<JQuery<HTMLElement>>
  }
}
