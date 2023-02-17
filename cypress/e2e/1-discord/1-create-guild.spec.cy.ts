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
    // cy.intercept("https://api.guild.xyz/v1/guild/listGateables", {
    //   statusCode: 200,
    //   fixture: "testUserDiscordGateables.json",
    // }).as("fetchDiscordGateables")

    // TODO: use the data-test attr. here
    cy.findByText("Select server").click()
    cy.get("@winOpen").should("be.called")

    // .then(() => {
    //   cy.window().then((wnd) => {
    //     // wnd.location.href = "http://localhost:3000/oauth"
    //     wnd.postMessage({
    //       type: "DC_AUTH_SUCCESS",
    //       data: "Bearer 12345",
    //     })
    //   })
    // })

    // cy.wait("@fetchDiscordGateables")
  })

  // it("can authenticate with Discord", () => {

  // })

  // it("can select a Discord server", () => {})

  // it("can select a template", () => {})

  // it("can fill basic info form", () => {})

  // it("can create a guild", () => {})
})

export {}
