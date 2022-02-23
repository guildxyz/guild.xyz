/// <reference types="cypress" />

before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("pre-test cleanup", () => {
  before(() => {
    cy.visit("/cypress-gang", { failOnStatusCode: false })
  })

  it("cleans up test guild", () => {
    cy.get("body").then(($body) => {
      if ($body.find("h1").length > 0) {
        cy.get("h1").then(($h1) => {
          if (
            $h1.text().toString() !== "404" &&
            $h1.text().toString() !== "Client-side error"
          ) {
            cy.findByText("Connect to a wallet").click()
            cy.findByText("MetaMask").click()
            cy.task("acceptMetamaskAccess")

            cy.wait(300)
            cy.get(
              ".chakra-container .chakra-stack .chakra-button.chakra-menu__menu-button"
            ).click()
            cy.findByText("Edit guild").parent().click()
            cy.get(".chakra-slide h2").should("contain.text", "Edit guild")

            cy.get(".chakra-slide .chakra-button").first().click()
            cy.findByText("Delete").click()
            cy.confirmMetamaskSignatureRequest()
            cy.url().should("not.match", /[0-9a-z\-]+$/i)
          } else {
            cy.visit("/")
          }
        })
      } else {
        cy.visit("/")
      }
    })

    cy.url().should("not.match", /[0-9a-z\-]+$/i)
  })
})
