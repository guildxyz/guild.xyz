/// <reference types="cypress" />

before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("create-guild page", () => {
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

    describe("can create guild", () => {
      it("can fill name field", () => {
        cy.get("input[name='name']").type("Cypress Testing Gang").blur()
        cy.wait(500)
        cy.get(".chakra-form__error-message").should("not.exist")
      })

      it("can upload image", () => {
        cy.get("button.chakra-button[aria-label='Guild logo']").click()
        cy.findByText("Choose image").attachFile("cypress.jpg", {
          subjectType: "drag-n-drop",
        })
        cy.wait(200)
        cy.get("button > div > span > img").should("exist")
      })

      it("can fill description", () => {
        const description =
          "This Guild was created by Cypress during automated tests. Should be automatically removed when test process is completed."
        cy.get("textarea[name='description']").type(description)
        cy.get(".chakra-form__error-message").should("not.exist")
        cy.get("textarea[name='description']").should("have.value", description)
      })

      it("can select Discord channel", () => {
        cy.get("h2").findByText("Discord").click()

        cy.get("input[name='discord_invite']")
          .type("https://discord.gg/XtD6qYfDKH")
          .blur()

        cy.wait(500)

        cy.findByText("Got it").click()

        cy.wait(500)

        cy.get(".chakra-form__error-message").should("not.exist")
      })

      it("can add whitelist", () => {
        cy.findByText("Add Whitelist").first().click()

        cy.get("textarea:not([name='description'])").type(
          "0x6BA12A5D11AC060c2680aF25E2ce5637B2205deD"
        )

        cy.findByText("OK").click()

        cy.findByText("WHITELIST").should("exist")
      })

      it("can submit form", () => {
        cy.findByText("Summon").click()

        cy.get(".chakra-form__error-message").should("not.exist")

        cy.confirmMetamaskSignatureRequest()
      })

      it("redirects to /cypress-testing-gang", () => {
        cy.url().should("contain", "/cypress-testing-gang")

        cy.get("h1").should("contain.text", "Cypress Testing Gang")
      })
    })
  })
})
