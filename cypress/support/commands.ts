/* eslint-disable import/no-extraneous-dependencies */
import "@testing-library/cypress"
import "cypress-file-upload"

Cypress.Commands.add("getByDataTest", (selector: string) =>
  cy.get(`[data-test='${selector}']`)
)

Cypress.Commands.add("connectWallet", () => {
  cy.wait(2000)
  cy.findByText("Connect to a wallet").click()
  cy.findByText("MetaMask").click()
  cy.task("acceptMetamaskAccess")
  cy.wait(1000)
  cy.findByText("Verify account").click()
  cy.confirmMetamaskSignatureRequest()
})
