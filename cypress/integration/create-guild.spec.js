/// <reference types="cypress" />

import { isElement } from "lodash"

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

    it("can create guild", () => {
      cy.get("input[name='name']").type("Cypress Gang").blur()

      cy.wait(500)
      cy.get(".chakra-form__error-message").should("not.exist")

      cy.get("button.chakra-button[aria-label='Guild logo']").click()
      cy.get("section.chakra-modal__content label.chakra-button").attachFile(
        "cypress.jpg",
        { subjectType: "drag-n-drop" }
      )

      cy.get("textarea[name='description']").type(
        "This Guild was created by Cypress during automated tests. Should be automatically removed when test process is completed."
      )

      cy.get(
        "fieldset.chakra-button:nth-child(1) > div:nth-child(1) > label:nth-child(1)"
      ).click()

      cy.get("input[name='discord_invite']").type("https://discord.gg/SkTqvMJ8Qk")

      cy.wait(500)

      cy.get("section.chakra-modal__content button").click()

      cy.wait(500)

      cy.get(
        ".chakra-tabs__tab-panel > div > div > div:nth-child(3) > button:nth-child(1)> div"
      )
        .first()
        .click()

      cy.get("textarea:not([name='description'])").type(
        "0x6BA12A5D11AC060c2680aF25E2ce5637B2205deD"
      )

      cy.get(".chakra-modal__footer>button:last-of-type").click()

      cy.get(
        ".chakra-container > div:last-of-type > div:last-of-type .chakra-button"
      ).click()

      cy.get(".chakra-form__error-message").should("be.empty")

      cy.confirmMetamaskSignatureRequest()

      cy.url().should("contain", "/cypress-gang")

      cy.get("h1").should("contain.text", "Cypress Gang")
    })
  })
})
