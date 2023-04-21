before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("roles", () => {
  before(() => {
    // Using a pre-made test guild here, since it isn't guaranteed that the 0-create-guild spec will run successfully
    cy.visit("/guild-e2e-cypress")
    cy.connectWallet()
  })

  it("can create a role without rewards", () => {
    cy.intercept("POST", `${Cypress.env("guildApiUrl")}/role`).as(
      "createRoleApiCall"
    )

    cy.getByDataTest("add-role-button").click()

    cy.get("div[role='dialog'].chakra-slide").within(() => {
      cy.get("input[name='name']").focus().blur()
      cy.get(
        "input[name='name'] ~ .chakra-collapse .chakra-form__error-message"
      ).should("exist")
      cy.get("input[name='name']").type("Cypress Test Role")
      cy.get(
        "input[name='name'] ~ .chakra-collapse .chakra-form__error-message"
      ).should("not.exist")

      cy.getByDataTest("save-role-button").click()

      cy.findByText("Set some requirements, or make the role free").should(
        "be.visible"
      )

      cy.get("#free-entry-checkbox").parent().click()
      cy.findByText("Connect your Ethereum wallet").should("exist")

      cy.getByDataTest("save-role-button").click()

      cy.wait("@createRoleApiCall")
    })
  })

  it("can edit general role data", () => {})

  it("can add/delete/edit a requirement", () => {})
})

export {}
