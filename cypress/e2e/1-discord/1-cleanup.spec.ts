before(() => {
  cy.disconnectMetamaskWalletFromAllDapps()
})

describe("post-test cleanup", () => {
  before(() => {
    cy.visit(
      Cypress.env("DEPLOYMENT_ID")
        ? `/${Cypress.env("guildUrlName")}-${Cypress.env("DEPLOYMENT_ID")}`
        : `/${Cypress.env("guildUrlName")}`,
      {
        failOnStatusCode: false,
      }
    )
  })

  after(async () => {
    const ROLES_TO_KEEP = ["@everyone", "Guild.xyz bot"]

    try {
      const discordRes = await fetch(
        `https://discord.com/api/v10/guilds/${Cypress.env("dcServerId")}/roles`,
        {
          headers: {
            Authorization: `Bot ${Cypress.env("DC_BOT_TOKEN")}`,
          },
        }
      )
      const discordResJSON: { id: string; name: string }[] = await discordRes.json()

      const discordRoleDeleteRequests: Promise<unknown>[] = []

      discordResJSON.forEach((role) => {
        if (!ROLES_TO_KEEP.includes(role.name))
          discordRoleDeleteRequests.push(
            fetch(
              `https://discord.com/api/v10/guilds/${Cypress.env(
                "dcServerId"
              )}/roles/${role.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bot ${Cypress.env("DC_BOT_TOKEN")}`,
                },
              }
            )
          )
      })

      await Promise.all(discordRoleDeleteRequests)
    } catch {
      // We can ignore this, it is not a problem if we can't delete the Discord roles every time
    }
  })

  it("cleans up test guild", () => {
    cy.get("body").then(($body) => {
      if ($body.find("h1").length > 0) {
        cy.get("h1").then(($h1) => {
          if (
            $h1.text().toString() !== "404" &&
            $h1.text().toString() !== "Client-side error"
          ) {
            cy.connectWallet()

            cy.get(".chakra-button[aria-label='Edit Guild']").click()
            cy.get(".chakra-slide h2").should("contain.text", "Edit guild")

            cy.get(".chakra-button[aria-label='Delete guild']").click()
            cy.findByText("Delete").click()

            cy.confirmMetamaskSignatureRequest()
          } else {
            cy.visit("/explorer")
          }
        })
      } else {
        cy.visit("/explorer")
      }
    })

    cy.get("h1").should("contain.text", "Guildhall")
  })
})

export {}
