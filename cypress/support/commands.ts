Cypress.Commands.add("getByDataTest", (selector: string) =>
  cy.get(`[data-test='${selector}']`)
)

Cypress.Commands.add("connectWallet", () => {
  cy.intercept("POST", `${Cypress.env("guildApiUrl")}/user/pubKey`).as(
    "pubKeyResponse"
  )

  cy.findByText("Connect to a wallet").click()
  cy.findByText("MetaMask").click()
  // Sometimes the MetaMask popup doesn't open/close in time in CI, so waiting a bit here
  cy.wait(2000)
  cy.acceptMetamaskAccess()
  cy.wait(2000)
  cy.findByText("Verify account").click()
  cy.confirmMetamaskSignatureRequest()

  cy.wait("@pubKeyResponse").its("response.statusCode").should("eq", 200)
})

export {}
