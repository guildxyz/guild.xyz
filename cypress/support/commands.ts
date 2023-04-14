/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/cypress"
import "cypress-file-upload"

Cypress.Commands.add("getByDataTest", (selector: string) =>
  cy.get(`[data-test='${selector}']`)
)

Cypress.Commands.add("connectWallet", () => {
  cy.findByText("Connect to a wallet").click()
  cy.findByText("MetaMask").click()
  cy.task("acceptMetamaskAccess")
  cy.findByText("Verify account").click()
  cy.confirmMetamaskSignatureRequest()
})
