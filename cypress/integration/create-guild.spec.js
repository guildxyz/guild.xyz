/// <reference types="cypress" />

before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("create-guild page", () => {
  beforeEach(() => {
    cy.visit("/create-guild")
  })

  describe("without wallet", () => {
    it("renders alert", () => {
      cy.get("div.chakra-alert").contains(
        "Please connect your wallet in order to continue!"
      )
    })
  })

  describe("with wallet", () => {
    before(() => {
      cy.connectWallet()
    })

    it("renders form", async () => {
      cy.get("h1").contains("Create Guild")
    })

    it("can create guild", async () => {
      cy.get("input[name='name']").type("cypress gang")

      cy.get("button.chakra-button[aria-label='Guild logo']").click()
      cy.get("section.chakra-modal__content input[type='file']").selectFile(
        "cypress/cypress.jpg"
      )
    })
  })
})
