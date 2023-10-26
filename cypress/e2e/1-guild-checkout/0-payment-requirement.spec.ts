before(() => {
  cy.cleanIndexedDB()
})

const MUMBAI_USDC_ADDRESS = "0xe9dce89b076ba6107bb64ef30678efec11939234"

describe("payment requirement", () => {
  beforeEach(() => {
    cy.visit(`/${Cypress.env("TEST_GUILD_URL_NAME")}`)
    cy.connectWallet()
  })

  it("should be able to create a payment requirement", () => {
    cy.getByDataTest("add-role-button").click()
    cy.getByDataTest("add-requirement-button").click()
    cy.contains("Payment").click()

    cy.get("label").contains("Chain").click().type("Mumbai")
    cy.contains("Polygon Mumbai").click()
    cy.getByDataTest("payment-form-switch-network-button").should("exist")

    cy.get("label").contains("Token").click().type(`${MUMBAI_USDC_ADDRESS}{esc}`)

    cy.get("label").contains("Price").click().type("1")

    cy.getByDataTest("payment-form-switch-network-button").click()
    cy.getByDataTest("payment-form-register-vault-button").click()

    /**
     * The dev wallet won't have a balance, so if we get this error, we consider it
     * as a successful transaction (we would get a different error if the params
     * wouldn't be correct)
     */
    cy.contains(
      "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
    ).should("exist")
  })

  it.skip("should be able to buy a pass", () => {
    // TODO
  })

  it.skip("should be able to withdraw from a vault", () => {
    // TODO
  })
})
