before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("pre-test cleanup", () => {
  before(() => {
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

            cy.get(".chakra-button[aria-label='Edit Guild']").click()
            cy.get(".chakra-slide h2").should("contain.text", "Edit guild")

            cy.get(".chakra-button[aria-label='Delete guild']").click()
            cy.findByText("Delete").click()
            cy.wait(2000)
            cy.confirmMetamaskSignatureRequest()
          } else {
            cy.visit("/explorer")
          }
        })
      } else {
        cy.visit("/explorer")
      }
    })

    cy.get("h1").should("contain.text", "Guildhall")
  })
})

export {}
