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
      cy.findByText("Connect to a wallet").click()
      cy.findByText("MetaMask").click()
      cy.task("acceptMetamaskAccess")
    })

    it("does not render alert", async () => {
      cy.get("h1").contains("Create Guild")
    })

    describe("creating guild", () => {
      it("fill name field", () => {
        cy.get("input[name='name']").type("Cypress Gang").blur()
        cy.wait(500)
        cy.get(".chakra-form__error-message", { timeout: 3000 }).should("not.exist")
      })

      /* it("upload image", () => {
        cy.get("button.chakra-button[aria-label='Guild logo']").click()
        cy.findByText("Choose image").attachFile("cypress.jpg", {
          subjectType: "drag-n-drop",
        })
        cy.wait(200)
        cy.get("button > div > span > img").should("exist")
      }) */

      it("fill description", () => {
        const description =
          "This Guild was created by Cypress during automated tests. Should be automatically removed when test process is completed."
        cy.get("textarea[name='description']").type(description)
      })

      it("select Discord channel", () => {
        cy.get("h2").findByText("Discord").click()

        cy.get("input[name='discord_invite']")
          .invoke("val", "https://discord.gg/vt2zuku9")
          .type(" {backspace}")

        cy.wait(500)

        cy.findByText("Got it").click()

        cy.wait(500)

        cy.get(".chakra-form__error-message", { timeout: 3000 }).should("not.exist")
      })

      it("add whitelist", () => {
        cy.findByText("Add Whitelist").first().click()

        cy.get("textarea:not([name='description'])").type(
          "0x304Def656Babc745c53782639D3CaB00aCe8C843"
        )

        cy.findByText("OK").click()

        cy.findByText("WHITELIST").should("exist")
      })

      it("submit form", () => {
        cy.findByText("Summon").click()

        cy.get(".chakra-form__error-message", { timeout: 3000 }).should("not.exist")

        cy.confirmMetamaskSignatureRequest()
      })

      it("/cypress-gang exists", () => {
        cy.get("h1").should("contain.text", "Cypress Gang")
      })
    })
  })
})
