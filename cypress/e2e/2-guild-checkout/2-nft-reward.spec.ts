describe("nft reward", () => {
  beforeEach(() => {
    cy.clearIndexedDB()
    cy.visit(Cypress.env("GUILD_CHECKOUT_TEST_GUILD_URL_NAME"))
    cy.connectWallet()
  })

  it("can deploy an nft contract", () => {
    // Scrolling to the top of the page to avoid a rare edge case where the add reward button isn't clickable
    cy.scrollTo("top")

    cy.getByDataTest("add-reward-button").click()
    cy.get("div[role='group']").contains("Create a gated NFT").click({ force: true })

    cy.get("header.chakra-modal__header").within(() => {
      cy.get("p").contains("Add NFT reward").should("exist")
    })

    cy.fixture("cypress-gang-nft.png", null).as("imageInput")
    // cy.fixture("cypress-gang-nft.png").as("imageInput")
    cy.get("input[type=file]").selectFile("@imageInput", { force: true })

    cy.get("input[name='name']").type("E2E Test NFT")
    cy.get("input[name='symbol']").type("E2E")
    cy.get("textarea[name='description']").type("This is the description...")

    cy.get("input[name='attributes.0.name']").should("not.exist")
    cy.get("input[name='attributes.0.value']").should("not.exist")

    cy.get("button").contains("Add attribute").click()

    cy.get("input[name='attributes.0.name']").should("exist")
    cy.get("input[name='attributes.0.value']").should("exist")

    cy.get("input[name='attributes.0.name']").type("something")
    cy.get("input[name='attributes.0.value']").type("anything")

    cy.get("label").contains("Chain").click().type("Mumbai{enter}")

    cy.get("label").contains("Price").click().type(".12345")

    cy.getByDataTest("create-nft-switch-network-button").should("exist")
    cy.getByDataTest("create-nft-button").should("be.disabled")
    cy.getByDataTest("create-nft-switch-network-button").click()
    cy.getByDataTest("create-nft-button").should("be.enabled")

    cy.getByDataTest("create-nft-button").click()

    cy.intercept("GET", "/api/pinata-key", {
      body: {
        jwt: "mockJWT",
        key: "mockKey",
      },
    })
    cy.intercept("POST", Cypress.env("PINATA_PIN_FILE_API_URL"), (req) => {
      req.reply({
        body: {
          IpfsHash: "QmcTynAiKGnwnF77xMEdNAPkjpmpWiWUwcnNdXKU84uJPt",
        },
      })
    })

    // You'll see both an error and a success toast in the tests, that's expected, since we don't actually call the contract & just return an empty object
    cy.get(".chakra-alert")
      .contains("Successfully deployed NFT contract", { timeout: 40_000 })
      .should("be.visible")
  })

  it("can't collect the nft if requirements aren't satisfied", () => {
    cy.get("p")
      .contains("Collect: Cypress Gang #1")
      .within(() => {
        cy.get("a").click()
      })

    cy.url().should("contain", "/collect/")

    cy.getByDataTest("collect-nft-button").should("be.disabled")
    cy.getByDataTest("switch-network-button").click()

    cy.getByDataTest("collect-nft-button").should("be.disabled")
  })

  it("can collect an nft if requirements are satisfied", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("guildApiUrl")}/guilds/*/roles/*/role-platforms/*/claim`
    ).as("claim")

    cy.get("p")
      .contains("Collect: Cypress Gang #2")
      .within(() => {
        cy.get("a").click()
      })

    cy.url().should("contain", "/collect/")

    cy.getByDataTest("collect-nft-button").should("be.disabled")
    cy.getByDataTest("switch-network-button").click()

    cy.getByDataTest("collect-nft-button").should("be.enabled")
    cy.getByDataTest("collect-nft-button").click()

    cy.wait("@claim", {
      responseTimeout: 40_000,
    })

    cy.get(".chakra-alert").contains("Successfully collected NFT!").should("exist")
  })
})
