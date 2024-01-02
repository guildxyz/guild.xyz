const setGameModeToAssignLogos = () => {
  Cypress.on("window:before:load", (win) => {
    Object.defineProperty(win.Math, "random", {
      value: function () {
        return 0.9
      },
      writable: false,
    })
  })
}

describe.skip("assign logos game mode", () => {
  beforeEach(() => {
    cy.intercept(`${Cypress.env("guildApiUrl")}/guilds?*`, {
      statusCode: 200,
      fixture: "testGuilds.json",
    }).as("guildsLoaded")

    cy.visit("/guess-the-guild")
    setGameModeToAssignLogos()
    cy.contains("Let's Go!").click()
  })

  it("not possible to press submit when not all logos are assigned", () => {
    cy.getByDataTest("submit").should("be.disabled")
  })

  it("score indicator shows up", () => {
    cy.get("#score-indicator").should("be.visible")
  })
})
