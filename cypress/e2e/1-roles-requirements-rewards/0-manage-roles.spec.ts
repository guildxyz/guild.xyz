const CONTEXT = {
  createdRoleId: undefined,
  guild: undefined,
  createdRequirement: undefined,
}

describe("roles", () => {
  beforeEach(() => {
    cy.clearIndexedDB()
    cy.visit(`/${Cypress.env("TEST_GUILD_URL_NAME")}`)
    cy.connectWallet()

    cy.intercept(
      "GET",
      `${Cypress.env("guildApiUrl")}/guilds/guild-page/${Cypress.env(
        "TEST_GUILD_URL_NAME"
      )}`
    ).as("fetchGuild")
    cy.waitForAccessCheck()
  })

  it("can fetch guild id", () => {
    cy.wait("@fetchGuild")
      .then((intercept) => {
        CONTEXT.guild = intercept.response.body
        return intercept
      })
      .its("response.statusCode")
      .should("eq", 200)
  })

  it("can create a role without rewards", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("guildApiUrl")}/guilds/${CONTEXT.guild.id}/roles`
    ).as("createRoleApiCall")

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

      cy.contains("Set some requirements, or make the role free").should("exist")

      cy.get("#free-entry-checkbox").parent().click()
      cy.contains("Connect your Ethereum wallet").should("exist")

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
      "PUT",
      `${Cypress.env("guildApiUrl")}/guilds/${CONTEXT.guild.id}/roles/${
        CONTEXT.createdRoleId
      }`
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
      "POST",
      `${Cypress.env("guildApiUrl")}/guilds/${CONTEXT.guild.id}/roles/${
        CONTEXT.createdRoleId
      }/requirements`
    ).as("editRoleApiCall")

    cy.get(`#role-${CONTEXT.createdRoleId}`).should("exist")
    cy.get(`#role-${CONTEXT.createdRoleId} button[aria-label='Edit role']`).click()

    cy.get("div[role='dialog'].chakra-slide").should("exist")

    cy.get("#free-entry-checkbox").parent().click()

    cy.getByDataTest("add-requirement-button").click()
    cy.getByDataTest("add-requirement-modal").within(() => {
      cy.contains("Allowlist").click()
      cy.get("textarea").type(Cypress.env("userAddress"))
      cy.contains("Add requirement").click()
    })

    cy.getByDataTest("add-requirement-button").click()
    cy.getByDataTest("add-requirement-modal").within(() => {
      cy.contains("Captcha").click()
      cy.contains("Add requirement").click()
    })

    cy.getByDataTest("save-role-button").click()
    cy.wait("@editRoleApiCall")
      .then((intercept) => {
        CONTEXT.createdRequirement = intercept.response.body
        return intercept
      })
      .its("response.statusCode")
      .should("eq", 201)
  })

  it("can edit requirements list", () => {
    if (!CONTEXT.createdRoleId)
      throw new Error("Can't run test, because couldn't create a role.")

    cy.get(`#role-${CONTEXT.createdRoleId}`).should("exist")
    cy.get(`#role-${CONTEXT.createdRoleId} button[aria-label='Edit role']`).click()

    cy.get("div[role='dialog'].chakra-slide").within(() => {
      cy.get("button[aria-label='Remove requirement']").first().click()
    })

    cy.intercept(
      "DELETE",
      `${Cypress.env("guildApiUrl")}/guilds/*/roles/*/requirements/*`
    ).as("deleteRequirement")

    cy.getByDataTest("delete-requirement-button").click()
    cy.wait("@deleteRequirement")
    cy.contains("Requirement deleted!")
  })

  it("can delete a role", () => {
    if (!CONTEXT.createdRoleId)
      throw new Error("Can't run test, because couldn't create a role.")

    cy.get(`#role-${CONTEXT.createdRoleId}`).should("exist")
    cy.get(`#role-${CONTEXT.createdRoleId} button[aria-label='Edit role']`).click()

    cy.get(
      "div[role='dialog'].chakra-slide button[aria-label='Delete role']"
    ).click()

    cy.intercept("DELETE", `${Cypress.env("guildApiUrl")}/guilds/*/roles/*`).as(
      "deleteRole"
    )

    cy.getByDataTest("delete-role-confirmation-button").click()
    cy.wait("@deleteRole")
    cy.contains("Role deleted!")
  })
})

export {}
