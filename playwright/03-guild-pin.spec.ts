import { expect } from "@playwright/test"
import { GUILD_CHECKOUT_TEST_GUILD_URL_NAME } from "./constants"
import { test } from "./fixtures"

test("can mint guild pin", async ({ pageWithKeyPair: { page } }) => {
  await page.goto(GUILD_CHECKOUT_TEST_GUILD_URL_NAME)

  await page.waitForResponse("**/v2/users/*/memberships?guildId=*")

  const mintGuildPinButton = await page.getByTestId("mint-guild-pin-button")
  await mintGuildPinButton.click()

  const mintGuildPinDialog = await page.getByRole("dialog", {
    name: "Mint Guild Pin",
  })
  await expect(mintGuildPinDialog).toBeVisible()

  const feeText = await page.getByTestId("guild-pin-fee")
  await expect(feeText).toContainText("0.001 ETH")

  const bigMintGuildPinButton = await page.getByTestId("big-mint-guild-pin-button")
  await expect(bigMintGuildPinButton).toBeEnabled()
  await bigMintGuildPinButton.click()

  await page.waitForResponse("**/v2/guilds/*/pin")

  const successToast = await page.getByText("Successfully minted Guild Pin!", {
    exact: true,
  })
  await expect(successToast).toBeVisible({ timeout: 30_000 })
})
