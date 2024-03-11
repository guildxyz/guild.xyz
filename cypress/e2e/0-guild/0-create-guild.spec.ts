before(() => {
  cy.clearIndexedDB()
})

const getContinueBtn = () => cy.get('[type="button"]').contains("Continue")
const getRoles = () => cy.get('[data-test^="role-"]')

const fillCustomizeGuildForm = ({ shouldContinue = true } = {}) => {
  cy.contains("add rewards later").click()
  getContinueBtn().click()

  cy.get("input[name='name']")
    .should("be.visible")
    .type(`${Cypress.env("platformlessGuildName")} ${Cypress.env("RUN_ID")}`)
  cy.get("input[name='contacts.0.contact']")
    .should("be.visible")
    .type("username@example.com")

  if (shouldContinue) getContinueBtn().should("be.enabled").click()
}

describe("create guild page - without wallet", () => {
  beforeEach(() => {
    cy.visit("/create-guild")
  })

  it("shows connect wallet modal", () => {
    cy.getByDataTest("platforms-grid").within(() => {
      cy.get("div[role='group']").first().click()
    })
    cy.getByDataTest("wallet-selector-modal")
      .should("exist")
      .within(() => {
        cy.get("button[aria-label='Close']").click()
      })

    getContinueBtn().should("be.disabled")
  })

  it("can customize guild without platform", () => {
    cy.contains("add rewards later").click()
    getContinueBtn().should("not.be.disabled")
    getContinueBtn().click()

    // Name is required
    getContinueBtn().should("be.disabled")
    cy.get("input[name='name']")
    cy.get("input[name='name']").focus().blur()
    cy.get("input[name='name']")
      .next(".chakra-collapse")
      .should("exist")
      .contains("This field is required")
    cy.get("input[name='name']").type(
      `${Cypress.env("platformlessGuildName")} ${Cypress.env("RUN_ID")}`
    )

    cy.get("input[name='urlName']").invoke("val").should("not.be.empty")

    // Email is required
    getContinueBtn().should("be.disabled")
    const emailInput = () => cy.get("input[name='contacts.0.contact']")
    emailInput().focus().blur()
    emailInput()
      .parent()
      .next(".chakra-collapse")
      .should("exist")
      .contains("This field is required")

    emailInput().type("username@example.com")
    getContinueBtn().should("not.be.disabled")
  })

  it("cannot add empty additional contacts", () => {
    fillCustomizeGuildForm({ shouldContinue: false })

    cy.get("button.chakra-button")
      .contains("Add contact")
      .should("be.visible")
      .click()
    const extraContact = () => cy.get("input[name='contacts.1.contact']")
    extraContact().should("be.visible").blur()
    extraContact()
      .parent()
      .next(".chakra-collapse")
      .should("exist")
      .contains("This field is required")
    getContinueBtn().should("be.disabled")

    extraContact().type("username@example.com")
    getContinueBtn().should("not.be.disabled")

    cy.getByDataTest("remove-contact-btn").should("be.visible").click()
    extraContact().should("not.exist")

    getContinueBtn().should("not.be.disabled")
  })

  it("requires wallet to access templates", () => {
    fillCustomizeGuildForm()

    cy.getByDataTest("wallet-selector-modal")
      .should("be.visible")
      .within(() => {
        cy.get("button[aria-label='Close']").click()
      })

    cy.getByDataTest("wallet-selector-modal").should("be.visible")
  })
})

describe("create guild page - with wallet", () => {
  beforeEach(() => {
    cy.clearIndexedDB()
    cy.visit("/create-guild")
    cy.connectWallet()
    fillCustomizeGuildForm()
  })

  it("can select role templates", () => {
    // Selecting the first role template
    getContinueBtn().should("be.disabled")
    cy.get('[data-test^="role-checkbox-"]').should("not.exist")
    getRoles()
      .first()
      .click()
      .invoke("attr", "data-test")
      .then((dataTestAttr) => {
        const checkboxSelector = `data-test=checked-${dataTestAttr}`
        cy.get(`[${checkboxSelector}]`).should("exist")
      })

    getContinueBtn().should("not.be.disabled")

    // Deselecting the first role template
    getRoles()
      .first()
      .click()
      .invoke("attr", "data-test")
      .then((dataTestAttr) => {
        const checkboxSelector = `data-test=checked-${dataTestAttr}`
        cy.get(`[${checkboxSelector}]`).should("not.exist")
      })

    getContinueBtn().should("be.disabled")
  })

  it("can add rewards only to selected role templates", () => {
    // Selecting the first role template, check if visible on reward step
    getRoles()
      .first()
      .click()
      .invoke("attr", "data-test")
      .then((roleName) => {
        getContinueBtn().click()
        cy.get(`[data-test=${roleName}]`).should("be.visible")
        getRoles().filter(":visible").should("have.length", 1)
      })

    // Selecting the second role template in addition, check if both are visible on reward step
    cy.contains("Go back and choose more templates").click()

    getRoles()
      .eq(1)
      .click()
      .invoke("attr", "data-test")
      .then((roleName) => {
        getContinueBtn().click()
        cy.get(`[data-test=${roleName}]`).should("be.visible")
        getRoles().filter(":visible").should("have.length", 2)
      })

    // Deselecting the first template, check that it disappears from the reward step
    cy.contains("Go back and choose more templates").click()

    getRoles()
      .first()
      .click()
      .invoke("attr", "data-test")
      .then((roleName) => {
        getContinueBtn().click()
        cy.get(`[data-test=${roleName}]`).should("not.be.visible")
        getRoles().filter(":visible").should("have.length", 1)
      })
  })

  it("can create guild", () => {
    getRoles().first().click()

    getContinueBtn().click()

    cy.getByDataTest("create-guild-button").should("not.be.disabled")

    cy.intercept("POST", `${Cypress.env("guildApiUrl")}/guilds`).as(
      "createGuildRequest"
    )

    cy.getByDataTest("create-guild-button").click()

    cy.wait("@createGuildRequest").its("response.statusCode").should("eq", 201)

    // User is redirected to the guild page
    cy.url().should("include", "/platformless-cypress-gang-localhost")
    getContinueBtn().click()

    cy.contains("Guild 100% complete").should("be.visible")
    cy.get("button").contains("Close").click()

    cy.getByDataTest("create-guild-stepper").should("not.exist")
  })
})
