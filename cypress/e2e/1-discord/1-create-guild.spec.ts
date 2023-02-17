before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("create-discord-guild", () => {
  beforeEach(() => {
    cy.visit("/create-guild", {
      onBeforeLoad(win) {
        cy.stub(win, "open").as("winOpen")
      },
    })
    cy.connectWallet()
  })

  it("can open Discord auth window", () => {
    cy.intercept("https://api.guild.xyz/v1/guild/listGateables", {
      statusCode: 200,
      fixture: "testUserDiscordGateables.json",
    }).as("fetchDiscordGateables")

    // TODO: use the data-test attr. here
    cy.findByText("Select server").click()
    cy.get("@winOpen").should("be.called")

    // cy.window().then((wnd) => {
    //   wnd.postMessage({
    //     type: "OAUTH_SUCCESS",
    //     data: "Bearer 12345",
    //   })
    // })

    window.localStorage.setItem(
      `oauth_popup_data_${Cypress.env("discordClientId")}`,
      JSON.stringify({
        type: "OAUTH_SUCCESS",
        csrfToken: "", // ?...
        data: {},
      })
    )

    cy.wait("@fetchDiscordGateables")

    // TODO: select server, etc.

    cy.get("div[aria-current='step']").should("contain.text", "2")

    cy.findByText("Start from scratch").click({ force: true })
    cy.get("div[aria-current='step']").last().should("contain.text", "Basic")

    cy.findByText("Next").click()

    cy.get("input[name='name']").should("have.value")
    cy.getByDataTest("create-guild-button").should("be.enabled")

    cy.getByDataTest("create-guild-button").click()
    cy.wait(10_000)
  })

  // it("can authenticate with Discord", () => {

  // })

  // it("can select a Discord server", () => {})

  // it("can select a template", () => {})

  // it("can fill basic info form", () => {})

  // it("can create a guild", () => {})
})

export {}
