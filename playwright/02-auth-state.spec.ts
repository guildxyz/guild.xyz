import { expect } from "@playwright/test"
import { TEST_USER } from "./constants"
import { test } from "./fixtures"

test("set auth state from json", async ({ pageWithKeyPair: { page } }) => {
  await page.goto("/explorer")

  const accountCard = await page.getByTestId("account-card")
  await expect(accountCard).toBeVisible({
    timeout: 30_000,
  })
  accountCard.click()

  await page.waitForResponse(`**/v2/users/${TEST_USER.id}/profile`)
})
