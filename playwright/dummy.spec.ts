import { expect } from "@playwright/test"
import { TEST_USER } from "./constants"
import { test } from "./fixtures"

test("dummy", async ({ pageWithKeyPair: { page } }) => {
  await page.goto("/explorer")

  const accountCard = await page.getByTestId("account-card")
  expect(accountCard).toBeVisible()

  await page.waitForResponse(`**/v2/users/${TEST_USER.id}/profile`)
})
