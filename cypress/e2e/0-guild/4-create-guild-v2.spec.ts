describe.skip("create guild page (without wallet)", () => {
  beforeEach(() => {
    cy.visit("/create-guild")
  })

  it.skip("shows connect wallet modal", () => {
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

  it.skip("can customize guild without platform", () => {
    cy.contains("add rewards later").click()
    cy.get('[type="button"]').contains("Continue").should("be.not.be.disabled")
  })

  it.skip("requires guild name to access templates", () => {
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
    cy.contains("add rewards later").click()
    cy.get('[type="button"]').contains("Continue").should("be.not.be.disabled")
    cy.get('[type="button"]').contains("Continue").click()

    cy.get("input[name='name']").type(
      `${Cypress.env("platformlessGuildName")} ${Cypress.env("RUN_ID")}`
    )

    cy.get('[type="button"]').contains("Continue").click()
    cy.get(".chakra-step__number[data-status='active']").contains("3")

    cy.get(".chackra-stack div").within(() => {
      cy.get("div[role='group']").first().click()
    })
  })
})
