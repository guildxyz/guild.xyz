/// <reference types="cypress" />

before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("join-guild", () => {
  before(() => {
    cy.visit(`/${Cypress.env("guildUrlName")}`)
  })

  describe("without wallet", () => {
    it("renders page", () => {
      cy.get("h1").should("contain.text", Cypress.env("guildName"))
    })

    it("join button is disabled", () => {
      cy.findByText("Join").parent().should("be.disabled")
    })
  })

  describe("with wallet", () => {
    before(() => {
      cy.connectWallet()
    })

    it("join button is enabled", () => {
      cy.findByText("Join").parent().should("not.be.disabled")
    })

    it("can connect Discord", () => {
      cy.findByText("Join").click()
      cy.wait(200)

      cy.get("body").then(($body) => {
        if ($body.find(".chakra-modal__footer button").length === 2) {
          cy.findByText("Connect Discord", { timeout: 3000 }).then(($btn) => {
            if ($btn) {
              cy.findByText("Connect Discord").click()
              cy.window().then((wnd) =>
                wnd.postMessage({
                  type: "DC_AUTH_SUCCESS",
                  data: { id: "604927885530234908" },
                })
              )
            }
          })
        }
      })

      cy.findByText("Verify address").click()
      cy.wait(2000)
      cy.confirmMetamaskSignatureRequest()
      cy.findByText("You're in").should("exist")
    })
  })
})
