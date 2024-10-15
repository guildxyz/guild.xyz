import { expect } from "@playwright/test"
import { GUILD_JOIN_TEST_GUILD_URL_NAME, TEST_USER } from "./constants"
import { test } from "./fixtures"

test("join guild", async ({ pageWithKeyPair: { page } }) => {
  await page.goto(GUILD_JOIN_TEST_GUILD_URL_NAME)

  await page.waitForResponse(`**/v2/users/${TEST_USER.id}/profile`, {
    timeout: 30_000,
  })

  const joinButton = await page
    .getByTestId("layout-action")
    .getByTestId("join-button")
  await joinButton.click()

  const checkAccessToJoinButton = await page.getByTestId(
    "check-access-to-join-button"
  )
  await checkAccessToJoinButton.click()

  await page.waitForResponse(
    async (response) => {
      if (response.url().includes("/v2/actions/join")) {
        const responseBody = await response.json()
        return Array.isArray(responseBody) && responseBody.at(-1).done
      }
      return false
    },
    {
      timeout: 60_000,
    }
  )

  const successToast = await page.getByText("Successfully joined guild", {
    exact: true,
  })
  await expect(successToast).toBeVisible({
    timeout: 30_000,
  })
})

test("leave guild", async ({ pageWithKeyPair: { page } }) => {
  await page.goto(GUILD_JOIN_TEST_GUILD_URL_NAME)

  await page.waitForResponse(`**/v2/users/${TEST_USER.id}/profile`, {
    timeout: 30_000,
  })

  const leaveButton = await page.getByTestId("leave-button")
  await leaveButton.click()
  const leaveAlertButton = await page.getByTestId("leave-alert-button")
  await leaveAlertButton.click()

  await page.waitForResponse(`**/v1/user/leaveGuild`, {
    timeout: 30_000,
  })
})
