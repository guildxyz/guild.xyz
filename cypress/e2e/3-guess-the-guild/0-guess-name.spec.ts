const setGameModeToGuessName = () => {
  Cypress.on("window:before:load", (win) => {
    Object.defineProperty(win.Math, "random", {
      value: function () {
        return 0.1
      },
      writable: false,
    })
  })
}

describe.skip("api fetching returns an error", () => {
  it("displays error toast message", () => {
    cy.intercept(`${Cypress.env("guildApiUrl")}/guilds?*`, {
      statusCode: 500,
    }).as("failedGuildLoad")

    cy.visit("/guess-the-guild")

    cy.wait("@failedGuildLoad")

    cy.get(".chakra-toast", { timeout: 5000 }).should("be.visible")
  })
})

describe.skip("in 'guess name' mode", () => {
  beforeEach(() => {
    cy.visit("/guess-the-guild")
    setGameModeToGuessName()
    cy.contains("Let's Go!").click()
  })

  it("is not possible to press submit, until an answer is selected", () => {
    cy.getByDataTest("submit").should("be.disabled")
  })

  it("is possible to press submit, after an answer is selected", () => {
    cy.getByDataTest("answer-button").first().click()
    cy.getByDataTest("submit").should("not.be.disabled")
  })

  it("score indicator shows up", () => {
    cy.get("#score-indicator").should("be.visible")
  })
})

describe.skip("game mode answer submit", () => {
  it("shows success message for good answer", () => {
    cy.intercept(`${Cypress.env("guildApiUrl")}/guilds?*`, {
      statusCode: 200,
      fixture: "testGuilds.json",
    }).as("guildsLoaded")

    cy.visit("/guess-the-guild")
    setGameModeToGuessName()

    cy.contains("Let's Go!").click()
    cy.getByDataTest("answer-button").first().click()
    cy.getByDataTest("submit").click()
    cy.get('[data-status="success"]').should("be.visible")
  })

  it("shows wrong answer message", () => {
    cy.intercept(`${Cypress.env("guildApiUrl")}/guilds?*`, {
      statusCode: 200,
      fixture: "testGuilds.json",
    }).as("guildsLoaded")

    cy.visit("/guess-the-guild")
    setGameModeToGuessName()

    cy.contains("Let's Go!").click()
    cy.getByDataTest("answer-button").last().click()
    cy.getByDataTest("submit").click()
    cy.get('[data-status="warning"]').should("be.visible")
  })

  it("increases score by 1 on good answer", () => {
    cy.intercept(`${Cypress.env("guildApiUrl")}/guilds?*`, {
      statusCode: 200,
      fixture: "testGuilds.json",
    }).as("guildsLoaded")

    cy.visit("/guess-the-guild")
    setGameModeToGuessName()

    cy.contains("Let's Go!").click()

    cy.get("span").contains("Score:").parent().contains("0").should("be.visible")

    cy.getByDataTest("answer-button").first().click()
    cy.getByDataTest("submit").click()

    cy.contains("1 points").should("be.visible")
  })

  it("does not change score on wrong answer", () => {
    cy.intercept(`${Cypress.env("guildApiUrl")}/guilds?*`, {
      statusCode: 200,
      fixture: "testGuilds.json",
    }).as("guildsLoaded")

    cy.visit("/guess-the-guild")
    setGameModeToGuessName()

    cy.contains("Let's Go!").click()

    cy.get("span").contains("Score:").parent().contains("0").should("be.visible")

    cy.getByDataTest("answer-button").last().click()
    cy.getByDataTest("submit").click()

    cy.get("span").contains("Score:").parent().contains("0").should("be.visible")
  })
})

describe("game screen order", () => {
  beforeEach(() => {
    cy.intercept(`${Cypress.env("guildApiUrl")}/guilds?*`, {
      statusCode: 200,
      fixture: "testGuilds.json",
    }).as("guildsLoaded")

    cy.visit("/guess-the-guild")
    setGameModeToGuessName()

    cy.contains("Let's Go!").click()
  })

  it.skip("game continues on good answer", () => {
    cy.getByDataTest("answer-button").first().click()
    cy.getByDataTest("submit").click()

    cy.getByDataTest("continue").should("be.visible")
    cy.getByDataTest("continue").click()
    cy.getByDataTest("submit").should("be.visible")
  })

  it.skip("game ends after wrong answer", () => {
    cy.getByDataTest("answer-button").last().click()
    cy.getByDataTest("submit").click()
    cy.getByDataTest("end-game").should("be.visible")
    cy.getByDataTest("end-game").click()
    cy.contains("Game Over").should("be.visible")
  })

  it("game restarts after end game screen", () => {
    cy.getByDataTest("answer-button").last().click()
    cy.getByDataTest("submit").click()
    cy.getByDataTest("end-game").click()
    cy.contains("Try Again!").click()
    cy.contains("GuildGesser").should("be.visible")
  })
})
