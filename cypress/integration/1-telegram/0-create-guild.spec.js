/// <reference types="cypress" />

before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("create-guild", () => {
  before(() => {
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

    it("does not render alert", async () => {
      cy.get("h1").contains("Create Guild")
    })

    describe("creating guild", () => {
      it("select Telegram group", () => {
        // for some reaston .findByText("Telegram") won't work, using .last() instead
        cy.get("h2").last().click()

        cy.get("input[name='TELEGRAM.platformId']")
          .invoke("val", Cypress.env("tgId"))
          .type(" {backspace}")

        cy.wait(2000) // Wait for name and icon to be set

        cy.findByText("Guild bot added").should("exist")
      })

      it("check free entry", () => {
        cy.findByText("Free entry").click()
      })

      it("submit form", () => {
        cy.findByText("Summon").click()
        cy.wait(2000)
        cy.confirmMetamaskSignatureRequest()
      })

      it(`/${Cypress.env("guildUrlName")} exists`, () => {
        cy.wait(11_000)
        cy.visit(`/${Cypress.env("guildUrlName")}`, {
          retryOnStatusCodeFailure: true,
        })
        cy.visit(`/${Cypress.env("guildUrlName")}`, {
          retryOnStatusCodeFailure: true,
        })
        cy.get("h1").should("contain.text", Cypress.env("guildName"))
      })
    })
  })
})
