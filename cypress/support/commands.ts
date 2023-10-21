Cypress.Commands.add("getByDataTest", (selector: string) =>
  cy.get(`[data-test='${selector}']`)
)

Cypress.Commands.add("connectWallet", () => {
  cy.getByDataTest("connect-wallet-button").click()
  cy.contains("Mock").click()
  cy.getByDataTest("verify-address-button").click()
})

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    getByDataTest(selector: string): Chainable<JQuery<HTMLElement>>
    connectWallet(): Chainable<JQuery<HTMLElement>>
  }
}
