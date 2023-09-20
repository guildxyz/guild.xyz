const CONTEXT = {
  createdRoleId: undefined,
  guild: undefined,
  createdRequirement: undefined,
}

const URL_NAME = `${Cypress.env("platformlessGuildUrlName")}-${Cypress.env(
  "DEPLOYMENT_ID"
)}`

describe("roles", () => {
  beforeEach(() => {
    // Using a pre-made test guild here, since it isn't guaranteed that the 0-create-guild spec will run successfully
    cy.visit(URL_NAME)

    // Cypress clears localStorage between tests, so we won't connect eagerly inside the `useEagerConnect` hook, that's why we need to connect manually before each tests
    cy.disconnectMetamaskWalletFromAllDapps()
  })

  it("can fetch guild id", () => {
    cy.connectWalletAndVerifyAccount()

    // http://localhost:8989/v1/guild/platformless-cypress-gang
    cy.intercept(
      "GET",
      `${Cypress.env("guildApiUrl")}/guilds/guild-page/${URL_NAME}`
    ).as("fetchGuild")

    cy.wait("@fetchGuild")
      .then((intercept) => {
        CONTEXT.guild = intercept.response.body
        return intercept
      })
      .its("response.statusCode")
      .should("eq", 200)
  })

  it("can create a role without rewards", () => {
    cy.connectWallet()

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
    cy.connectWallet()

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
    cy.connectWallet()

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
    cy.wait("@editRoleApiCall")
      .then((intercept) => {
        CONTEXT.createdRequirement = intercept.response.body
        return intercept
      })
      .its("response.statusCode")
      .should("eq", 201)
  })

  it("can edit requirements list", () => {
    cy.connectWallet()

    if (!CONTEXT.createdRoleId)
      throw new Error("Can't run test, because couldn't create a role.")

    // cy.intercept(
    //   "DELETE",
    //   `${Cypress.env("guildApiUrl")}/guilds/${CONTEXT.guild.id}/roles/${
    //     CONTEXT.createdRoleId
    //   }/requirements/${CONTEXT.createdRequirement.id}`
    // ).as("deleteRequirementApiCall")

    cy.get(`#role-${CONTEXT.createdRoleId}`).should("exist")
    cy.get(`#role-${CONTEXT.createdRoleId} button[aria-label='Edit role']`).click()

    cy.get("div[role='dialog'].chakra-slide").within(() => {
      cy.get("button[aria-label='Remove requirement']").first().click()
    })

    cy.getByDataTest("delete-requirement-button").click()

    cy.findByText("Requirement deleted!")

    // cy.wait("@deleteRequirementApiCall").its("response.statusCode").should("eq", 200)
  })

  it("can delete a role", () => {
    cy.connectWallet()

    if (!CONTEXT.createdRoleId)
      throw new Error("Can't run test, because couldn't create a role.")

    // cy.intercept(
    //   "DELETE",
    //   `${Cypress.env("guildApiUrl")}/guilds/${CONTEXT.guild.id}/roles/${
    //     CONTEXT.createdRoleId
    //   }`
    // ).as("deleteRoleApiCall")

    cy.get(`#role-${CONTEXT.createdRoleId}`).should("exist")
    cy.get(`#role-${CONTEXT.createdRoleId} button[aria-label='Edit role']`).click()

    cy.get(
      "div[role='dialog'].chakra-slide button[aria-label='Delete role']"
    ).click()

    cy.getByDataTest("delete-role-confirmation-button").click()
    cy.confirmMetamaskSignatureRequest()

    // Couldn't get intercept to work here, so waiting the toast for now
    cy.findByText("Role deleted!")

    // cy.wait("@deleteRoleApiCall").its("response.statusCode").should("eq", 200)
  })
})

export {}
