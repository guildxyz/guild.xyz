import "../0-platformless/0-cleanup.spec"

const MOCK_AUTH_DATA = {
  type: "OAUTH_SUCCESS",
  data: {
    platformName: "DISCORD",
    scope: "guilds identify guilds.members.read",
  },
}

before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

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
    cy.getByDataTest("DISCORD-select-button").click()

    // TODO: Guild API URL to env?
    cy.intercept("https://api.guild.xyz/v1/guild/listGateables", {
      statusCode: 200,
      fixture: "testUserDiscordGateables.json",
    }).as("fetchDiscordGateables")

    cy.intercept("https://api.guild.xyz/v1/user/connect", {
      statusCode: 200,
      fixture: "connectDiscord.json",
    }).as("connectDiscord")

    cy.getByDataTest("DISCORD-select-button").click()
    cy.get("@winOpen").should("be.called")

    cy.window().then((popupWindow) => {
      popupWindow.localStorage.setItem(
        "DISCORD_shouldConnect",
        JSON.stringify(MOCK_AUTH_DATA)
      )
      popupWindow.close()
    })

    cy.wait("@connectDiscord")

    cy.visit("/create-guild")

    // Select server
    cy.getByDataTest("DISCORD-select-button-connected").click()
    cy.wait("@fetchDiscordGateables")

    cy.intercept("https://api.guild.xyz/v1/platform/guild/DISCORD/*").as(
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

    // Check if the form is valid
    cy.get("input[name='name']").should("have.value", Cypress.env("guildName"))

    // Create guild
    cy.getByDataTest("create-guild-button").should("be.enabled")
    cy.getByDataTest("create-guild-button").click()

    cy.wait(10_000)
  })

  it(`/${Cypress.env("guildUrlName")} exists`, () => {
    cy.visit(`/${Cypress.env("guildUrlName")}`)
    cy.get("h1").should("contain.text", Cypress.env("guildName"))
  })
})

export {}
