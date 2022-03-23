/// <reference types="cypress" />

before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("post-test cleanup", () => {
  before(() => {
    cy.wait(11_000)
    cy.visit(`/${Cypress.env("guildUrlName")}`, { failOnStatusCode: false })
    cy.visit(`/${Cypress.env("guildUrlName")}`, { failOnStatusCode: false })
  })

  it("cleans up test guild", () => {
    cy.get("body").then(($body) => {
      if ($body.find("h1").length > 0) {
        cy.get("h1").then(($h1) => {
          if (
            $h1.text().toString() !== "404" &&
            $h1.text().toString() !== "Client-side error"
          ) {
            cy.connectWallet()

            cy.get(".chakra-button[aria-label='Edit & customize guild']").click()
            cy.get(".chakra-slide h2").should("contain.text", "Edit guild")

            cy.get(".chakra-slide .chakra-button").first().click()
            cy.findByText("Delete").click()
            cy.confirmMetamaskSignatureRequest()
          } else {
            cy.visit("/")
          }
        })
      } else {
        cy.visit("/")
      }
    })

    cy.get("h1").should("contain.text", "Guild")
  })
})
