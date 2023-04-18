/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/cypress"
import "cypress-file-upload"

Cypress.Commands.add("getByDataTest", (selector: string) =>
  cy.get(`[data-test='${selector}']`)
)

Cypress.Commands.add("connectWallet", () => {
  cy.findByText("Connect to a wallet").click()
  cy.findByText("MetaMask").click()
  cy.acceptMetamaskAccess()
  // Sometimes the MetaMask popup doesn't close in time in CI, so waiting a bit here before verifying the account
  cy.wait(2000)
  cy.findByText("Verify account").click()
  cy.confirmMetamaskSignatureRequest()
})
