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
      it("can connect Discord", () => {
        cy.get("h2").findByText("Discord").click()

        cy.intercept("https://discord.com/api/users/@me/guilds", {
          statusCode: 200,
          fixture: "testUserServers.json",
        }).as("fetchGuilds")

        cy.findByText("Connect Discord", { timeout: 3000 }).then(($btn) => {
          if ($btn) {
            cy.findByText("Connect Discord").click()
            cy.window().then((wnd) =>
              wnd.postMessage({
                type: "DC_AUTH_SUCCESS",
                data: "Bearer 12345",
              })
            )
          }
        })

        cy.wait("@fetchGuilds")
      })

      it("select Discord server", () => {
        cy.findByText("Select...").click()
        cy.findByText("Cypress Gang").click()
        cy.findByText("Got it").click()
        cy.wait(2000) // Wait for name and icon to be set
        cy.get(".chakra-form__error-message", { timeout: 3000 }).should("not.exist")
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
