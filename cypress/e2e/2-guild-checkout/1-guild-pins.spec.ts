describe("guild pins", () => {
  beforeEach(() => {
    cy.clearIndexedDB()
  })

  it("can't see the guild pin reward card (unauthenticated)", () => {
    cy.visit(Cypress.env("TEST_GUILD_URL_NAME"))
    cy.getByDataTest("guild-pin-reward-card").should("not.exist")
  })

  it("can see the guild pin reward card (authenticated)", () => {
    cy.visit(Cypress.env("TEST_GUILD_URL_NAME"))
    cy.connectWallet()

    cy.getByDataTest("guild-pin-reward-card").should("exist")
  })

  it("can see the pin setup modal", () => {
    cy.visit(Cypress.env("TEST_GUILD_URL_NAME"))
    cy.connectWallet()

    cy.getByDataTest("guild-pin-reward-card")
      .get("button")
      .contains("Setup Guild Pin")
      .click()

    cy.get(".chakra-modal__header").contains("Setup Guild Pin").should("be.visible")
  })

  it("can mint a guild pin", () => {
    cy.visit(Cypress.env("GUILD_CHECKOUT_TEST_GUILD_URL_NAME"))
    cy.connectWallet()

    cy.intercept("POST", `${Cypress.env("guildApiUrl")}/guilds/*/pin`).as("claim")

    cy.getByDataTest("guild-pin-reward-card")
      .get("button")
      .contains("Mint Guild Pin")
      .click()

    cy.get(".chakra-modal__footer").get("button").contains("Switch network").click()

    cy.get(".chakra-modal__footer")
      .getByDataTest("fees-table")
      .get("span")
      .should("contain", "0.001 MATIC")

    cy.get(".chakra-modal__footer").get("button").contains("Mint NFT").click()

    cy.wait("@claim")

    cy.get(".chakra-alert")
      .contains("GUILD_PIN_E2E_TEST_SUCCESS")
      .should("be.visible")
  })
})
