before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

const CONTEXT = {
  createdRoleId: undefined,
}

describe("roles", () => {
  before(() => {
    cy.visit("/explorer")
    cy.connectWallet()
  })

  beforeEach(() => {
    // Using a pre-made test guild here, since it isn't guaranteed that the 0-create-guild spec will run successfully
    cy.visit("/guild-e2e-cypress")
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
        .then((intercept) => {
          CONTEXT.createdRoleId = intercept.response?.body.id
          return intercept
        })
        .its("response.statusCode")
        .should("eq", 201)
    })
  })

  it("can edit general role data", () => {
    if (!CONTEXT.createdRoleId)
      throw new Error("Can't run test, because couldn't create a role.")

    cy.intercept(
      "PATCH",
      `${Cypress.env("guildApiUrl")}/role/${CONTEXT.createdRoleId}`
    ).as("editRoleApiCall")

    cy.get(`#role-${CONTEXT.createdRoleId}`).should("exist")
    cy.get(`#role-${CONTEXT.createdRoleId} button[aria-label='Edit role']`).click()

    cy.get("div[role='dialog'].chakra-slide").within(() => {
      cy.get("input[name='name']").type(" (edited)")
      cy.get("textarea[name='description']").type("wagmi")

      cy.getByDataTest("save-role-button").click()
      cy.wait("@editRoleApiCall").its("response.statusCode").should("eq", 200)
    })
  })

  it("can add requirements", () => {
    if (!CONTEXT.createdRoleId)
      throw new Error("Can't run test, because couldn't create a role.")

    cy.intercept(
      "PATCH",
      `${Cypress.env("guildApiUrl")}/role/${CONTEXT.createdRoleId}`
    ).as("editRoleApiCall")

    cy.get(`#role-${CONTEXT.createdRoleId}`).should("exist")
    cy.get(`#role-${CONTEXT.createdRoleId} button[aria-label='Edit role']`).click()

    cy.get("div[role='dialog'].chakra-slide").should("exist")

    cy.get("#free-entry-checkbox").parent().click()

    cy.getByDataTest("add-requirement-button").click()
    cy.getByDataTest("add-requirement-modal").within(() => {
      cy.findByText("Allowlist").click()
      cy.get("textarea").type(Cypress.env("userAddress"))
      cy.findByText("Add requirement").click()
    })

    cy.getByDataTest("add-requirement-button").click()
    cy.getByDataTest("add-requirement-modal").within(() => {
      cy.findByText("Captcha").click()
      cy.findByText("Add requirement").click()
    })

    cy.getByDataTest("save-role-button").click()
    cy.wait("@editRoleApiCall").its("response.statusCode").should("eq", 200)
  })

  it("can edit requirements list", () => {
    if (!CONTEXT.createdRoleId)
      throw new Error("Can't run test, because couldn't create a role.")

    cy.intercept(
      "PATCH",
      `${Cypress.env("guildApiUrl")}/role/${CONTEXT.createdRoleId}`
    ).as("editRoleApiCall")

    cy.get(`#role-${CONTEXT.createdRoleId}`).should("exist")
    cy.get(`#role-${CONTEXT.createdRoleId} button[aria-label='Edit role']`).click()

    cy.get("div[role='dialog'].chakra-slide").within(() => {
      cy.get("button[aria-label='Remove requirement']").first().click()

      cy.getByDataTest("save-role-button").click()
      cy.wait("@editRoleApiCall")
        .its("response.body.requirements.length")
        .should("eq", 1)
    })
  })
})

export {}
