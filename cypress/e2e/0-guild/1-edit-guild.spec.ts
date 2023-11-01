const CONTEXT = {
  guild: undefined,
}

const URL_NAME = `${Cypress.env("platformlessGuildUrlName")}-${Cypress.env(
  "RUN_ID"
)}`

describe("edit guild", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `${Cypress.env("guildApiUrl")}/guilds/guild-page/${URL_NAME}`
    ).as("fetchGuild")
    cy.visit(URL_NAME)
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

  it("should not be able to edit a guild as a guest", () => {
    cy.get("button[aria-label='Edit Guild']").should("not.exist")
  })

  it("should be able to edit general guild data as a guild admin", () => {
    cy.intercept(
      "PUT",
      `${Cypress.env("guildApiUrl")}/guilds/${CONTEXT.guild.id}`
    ).as("editGuildApiCall")

    cy.clearIndexedDB()
    cy.connectWallet()

    cy.get("button[aria-label='Edit Guild']").click()

    cy.get("div[role='dialog'].chakra-slide").within(() => {
      cy.get("input[name='name']").type(" (edited)")
      cy.get("textarea[name='description']").type("Edit guild test")

      cy.getByDataTest("save-guild-button").click()
      cy.wait("@editGuildApiCall").its("response.statusCode").should("eq", 200)
    })
  })
})
