describe("create guild page (without wallet)", () => {
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

    cy.get('[type="button"]').contains("Continue").should("be.disabled")
  })

  it("can customize guild without platform", () => {
    cy.contains("add rewards later").click()
    cy.get('[type="button"]').contains("Continue").should("be.not.be.disabled")
  })

  it("requires guild name to access templates", () => {
    cy.contains("add rewards later").click()
    cy.get('[type="button"]').contains("Continue").click()

    cy.get('[type="button"]').contains("Continue").should("be.disabled")
    cy.get("input[name='name']").focus().blur()
    cy.get("input[name='name'] ~ .chakra-collapse")
      .should("exist")
      .contains("This field is required")

    cy.get("input[name='name']").type(
      `${Cypress.env("platformlessGuildName")} ${Cypress.env("RUN_ID")}`
    )

    cy.get("input[name='urlName']").invoke("val").should("not.be.empty")
    cy.get('[type="button"]').contains("Continue").should("not.be.disabled")
  })

  it("requires wallet to access templates", () => {
    cy.contains("add rewards later").click()
    cy.get('[type="button"]').contains("Continue").click()

    cy.get("input[name='name']").type(
      `${Cypress.env("platformlessGuildName")} ${Cypress.env("RUN_ID")}`
    )

    cy.get('[type="button"]').contains("Continue").click()

    cy.getByDataTest("wallet-selector-modal")
      .should("be.visible")
      .within(() => {
        cy.get("button[aria-label='Close']").click()
      })

    cy.getByDataTest("wallet-selector-modal").should("be.visible")
  })
})

describe("create guild page (with wallet)", () => {
  beforeEach(() => {
    cy.clearIndexedDB()
    cy.visit("/create-guild")
    cy.connectWallet()
  })

  it("can select role templates", () => {
    // Navigating to the "Choose template" step
    cy.contains("add rewards later").click()
    cy.get('[type="button"]').contains("Continue").should("not.be.disabled")
    cy.get('[type="button"]').contains("Continue").click()

    cy.get("input[name='name']").type(
      `${Cypress.env("platformlessGuildName")} ${Cypress.env("RUN_ID")}`
    )

    cy.get('[type="button"]').contains("Continue").click()

    // Selecting the first role template
    cy.get('[type="button"]').contains("Continue").should("be.disabled")
    cy.get('#role-checkbox[data-test^="selected-role-"]').should("not.exist")
    cy.get('[data-test^="role-"]')
      .first()
      .click()
      .invoke("attr", "data-test")
      .then((roleName) => {
        const checkboxSelector = `data-test=selected-${roleName}`
        cy.get(`#role-checkbox[${checkboxSelector}]`).should("exist")
      })

    cy.get('[type="button"]').contains("Continue").should("not.be.disabled")

    // Deselecting the first role template
    cy.get('[data-test^="role-"]')
      .first()
      .click()
      .invoke("attr", "data-test")
      .then((roleName) => {
        const checkboxSelector = `data-test=selected-${roleName}`
        cy.get(`#role-checkbox[${checkboxSelector}]`).should("not.exist")
      })

    cy.get('[type="button"]').contains("Continue").should("be.disabled")
  })

  it("can add rewards only to selected role templates", () => {
    // Navigating to the "Choose template" step
    cy.contains("add rewards later").click()
    cy.get('[type="button"]').contains("Continue").click()
    cy.get("input[name='name']").type(
      `${Cypress.env("platformlessGuildName")} ${Cypress.env("RUN_ID")}`
    )
    cy.get('[type="button"]').contains("Continue").click()

    // Selecting the first role template, check if visible on reward step
    cy.get('[data-test^="role-"]')
      .first()
      .click()
      .invoke("attr", "data-test")
      .then((roleName) => {
        cy.get('[type="button"]').contains("Continue").click()
        cy.get(`[data-test=${roleName}]`).should("be.visible")
        cy.get('[data-test^="role-"]').filter(":visible").should("have.length", 1)
      })

    // Selecting the second role template in addition, check if both are visible on reward step
    cy.contains("Go back and choose more templates").click()

    cy.get('[data-test^="role-"]')
      .eq(1)
      .click()
      .invoke("attr", "data-test")
      .then((roleName) => {
        cy.get('[type="button"]').contains("Continue").click()
        cy.get(`[data-test=${roleName}]`).should("be.visible")
        cy.get('[data-test^="role-"]').filter(":visible").should("have.length", 2)
      })

    // Deselecting the first template, check that it disappears from the reward step
    cy.contains("Go back and choose more templates").click()

    cy.get('[data-test^="role-"]')
      .first()
      .click()
      .invoke("attr", "data-test")
      .then((roleName) => {
        cy.get('[type="button"]').contains("Continue").click()
        cy.get(`[data-test=${roleName}]`).should("not.be.visible")
        cy.get('[data-test^="role-"]').filter(":visible").should("have.length", 1)
      })
  })
})
