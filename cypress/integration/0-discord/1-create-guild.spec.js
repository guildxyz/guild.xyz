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
      it("fill name field", () => {
        cy.get("input[name='name']").type(Cypress.env("guildName")).blur()
        cy.wait(500)
        cy.get(".chakra-form__error-message", { timeout: 3000 }).should("not.exist")
      })

      it("upload image", () => {
        cy.get("button.chakra-button[aria-label='Guild logo']").click()
        cy.findByText("Choose image").attachFile("cypress.jpg", {
          subjectType: "drag-n-drop",
        })
        cy.wait(200)
        cy.get("button > div > span > img").should("exist")
      })

      it("fill description", () => {
        const description =
          "This Guild was created by Cypress during automated tests. Should be automatically removed when test process is completed."
        cy.get("textarea[name='description']").type(description)
      })

      it("select Discord channel", () => {
        cy.get("h2").findByText("Discord").click()

        cy.get("input[name='discord_invite']")
          .invoke("val", Cypress.env("dcInvite"))
          .type(" {backspace}")

        cy.wait(500)

        cy.findByText("Got it").click()

        cy.wait(500)

        cy.get(".chakra-form__error-message", { timeout: 3000 }).should("not.exist")
      })

      it("check free entry", () => {
        cy.findByText("Free entry").click()
      })

      it("submit form", () => {
        cy.findByText("Summon").click()
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
