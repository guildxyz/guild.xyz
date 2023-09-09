Cypress.Commands.add("getByDataTest", (selector: string) =>
  cy.get(`[data-test='${selector}']`)
)

Cypress.Commands.add("connectWalletAndVerifyAccount", () => {
  let userId: number
  cy.intercept(
    "GET",
    `${Cypress.env("guildApiUrl")}/users/${Cypress.env("userAddress")}/profile`
  ).as("fetchUserId")

  cy.findByText("Connect to a wallet").click()
  cy.findByText("MetaMask").click()

  cy.acceptMetamaskAccess()
  cy.wait("@fetchUserId")
    .then((intercept) => {
      userId = intercept.response.body.id
      return intercept
    })
    .then(() => {
      cy.log(`userId = ${userId}`)
      console.log({ userId })

      cy.intercept(
        "POST",
        `${Cypress.env("guildApiUrl")}/users/${userId}/public-key`
      ).as("pubKeyResponse")
      cy.findByText("Verify account").click()
      cy.confirmMetamaskSignatureRequest()

      cy.wait("@pubKeyResponse").its("response.statusCode").should("eq", 200)
    })
})

Cypress.Commands.add("connectWallet", () => {
  cy.intercept(
    "GET",
    `${Cypress.env("guildApiUrl")}/users/${Cypress.env("userAddress")}/profile`
  ).as("fetchUserId")

  cy.findByText("Connect to a wallet").click()
  cy.findByText("MetaMask").click()
  cy.acceptMetamaskAccess()
  cy.wait("@fetchUserId").its("response.statusCode").should("eq", 200)
})

export {}
