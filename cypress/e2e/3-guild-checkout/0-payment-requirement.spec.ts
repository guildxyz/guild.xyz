const MUMBAI_USDC_ADDRESS = "0xe9dce89b076ba6107bb64ef30678efec11939234"

describe("payment requirement", () => {
  beforeEach(() => {
    cy.cleanIndexedDB()
    cy.visit(`/${Cypress.env("GUILD_CHECKOUT_TEST_GUILD_URL_NAME")}`)
    cy.connectWallet()
  })

  it.skip("should be able to create a payment requirement", () => {
    cy.getByDataTest("add-role-button").click()
    cy.getByDataTest("add-requirement-button").click()
    cy.get("button")
      .contains(/^Payment$/)
      .click()

    cy.get("label").contains("Chain").click().type("Mumbai")
    cy.getByDataTest("custom-select-option").contains("Polygon Mumbai").click()
    cy.getByDataTest("payment-form-switch-network-button").should("exist")

    cy.get("label").contains("Token").click().type(`${MUMBAI_USDC_ADDRESS}{esc}`)

    cy.get("label").contains("Price").click().type("1")

    cy.getByDataTest("payment-form-switch-network-button").click()
    cy.getByDataTest("payment-form-register-vault-button").click()

    cy.getByDataTest("add-requirement-modal").should("not.exist")
    cy.get(".chakra-modal__body")
      .contains(/^Pay(.)*on Polygon Mumbai/)
      .should("exist")
  })

  it("should not be able to buy a pass without allowance", () => {
    cy.get("#role-90904").within(() => {
      cy.getByDataTest("payment-requirement-buy-button").click()
    })

    cy.getByDataTest("token-info-fee-currency").should("contain", "1 USDT")
    cy.getByDataTest("token-info-balance").should("contain", "0 USDT")
    cy.getByDataTest("fees-table").get("span").should("contain", "1 USDT")

    cy.getByDataTest("tos-checkbox").should("not.be.visible")
    cy.getByDataTest("buy-button").should("be.disabled")

    cy.get(".chakra-modal__footer").get("button").contains("Switch network").click()

    cy.getByDataTest("tos-checkbox").should("be.visible")
    cy.getByDataTest("buy-allowance-button")
      .should("be.visible")
      .should("contain", "Allow Guild to use your USDT")
    cy.getByDataTest("buy-button")
      .should("be.disabled")
      .should("contain", "Insufficient balance")
  })

  it.skip("should be able to buy a pass", () => {
    cy.get("#role-90671").within(() => {
      cy.getByDataTest("payment-requirement-buy-button").click()
    })

    cy.getByDataTest("token-info-fee-currency").should("contain", "1 USDC")
    cy.getByDataTest("token-info-balance").should("contain", "10 USDC")
    cy.getByDataTest("fees-table").get("span").should("contain", "1 USDC")

    cy.getByDataTest("tos-checkbox").should("not.be.visible")
    cy.getByDataTest("buy-button").should("be.disabled")

    cy.get(".chakra-modal__footer").get("button").contains("Switch network").click()

    cy.getByDataTest("tos-checkbox").should("be.visible").click()
    cy.getByDataTest("buy-button").should("be.enabled")

    cy.getByDataTest("buy-button")
      .click()
      .get(".chakra-alert")
      .contains("Successful payment")
      .should("be.visible")
  })

  it.skip("should be able to withdraw from a vault", () => {
    // TODO
  })
})
