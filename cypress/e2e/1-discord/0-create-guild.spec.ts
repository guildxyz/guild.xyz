before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

const MOCK_AUTH_DATA = {
  type: "OAUTH_SUCCESS",
  data: {
    platformName: "DISCORD",
    scope: "guilds identify guilds.members.read",
  },
}

describe("create-discord-guild", () => {
  before(() => {
    cy.visit("/create-guild", {
      onBeforeLoad(win) {
        cy.stub(win, "open").as("winOpen")
      },
    })
    cy.connectWallet()
  })

  it("can authenticate with Discord and create a guild", () => {
    cy.intercept(`${Cypress.env("guildApiUrl")}/guild/listGateables`, {
      statusCode: 200,
      fixture: "testUserDiscordGateables.json",
    }).as("fetchDiscordGateables")

    cy.intercept(`${Cypress.env("guildApiUrl")}/user/connect`, {
      statusCode: 200,
      fixture: "connectDiscord.json",
    }).as("connectDiscord")

    cy.getByDataTest("DISCORD-select-button").click()

    cy.get("@winOpen").should("be.called")

    // This triggers a connection flow (useConnectFromLocalStorage)
    localStorage.setItem("DISCORD_shouldConnect", JSON.stringify(MOCK_AUTH_DATA))

    cy.wait("@connectDiscord")

    // Intercepting this request, so we can set the `DISCORD-select-button-connected` data-test attribute properly
    cy.intercept(
      `${Cypress.env("guildApiUrl")}/user/${Cypress.env("userAddress")}`,
      (req) => {
        req.continue((res) => {
          res.body = {
            ...res.body,
            platformUsers: [
              {
                platformId: 1,
                platformName: "DISCORD",
                platformUserId: "12345",
              },
            ],
          }
        })
      }
    ).as("modifiedUserResponse")

    // Select server
    cy.getByDataTest("DISCORD-select-button-connected").click()
    cy.wait("@fetchDiscordGateables")

    cy.intercept(`${Cypress.env("guildApiUrl")}/platform/guild/DISCORD/*`).as(
      "useGuildByPlatformId"
    )
    cy.wait("@useGuildByPlatformId")

    cy.getByDataTest("select-dc-server-button").click()
    cy.get("video[src='/videos/dc-bot-role-config-guide.webm']").should("exist")

    cy.findByText("Next").click()

    // Select a template
    cy.findByText("Growth").click({ force: true })
    cy.get("div[aria-current='step']").last().should("contain.text", "Growth")
    cy.findByText("Start from scratch").click({ force: true })
    cy.get("div[aria-current='step']").last().should("contain.text", "Basic")

    cy.findByText("Next").click()

    // Check if the form is valid & edit the guild name
    cy.get("input[name='name']")
      .type(` ${Cypress.env("DEPLOYMENT_ID")}`)
      .should(
        "have.value",
        `${Cypress.env("guildName")} ${Cypress.env("DEPLOYMENT_ID")}`
      )

    // Create guild
    cy.getByDataTest("create-guild-button").should("be.enabled")
    cy.getByDataTest("create-guild-button").click()

    cy.intercept("POST", `${Cypress.env("guildApiUrl")}/guild`).as(
      "createGuildRequest"
    )
    cy.wait("@createGuildRequest").its("response.statusCode").should("eq", 201)
  })
})

export {}
