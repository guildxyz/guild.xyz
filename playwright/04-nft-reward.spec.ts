import path from "path"
import { Locator, expect } from "@playwright/test"
import { GUILD_CHECKOUT_TEST_GUILD_URL_NAME, TEST_USER } from "./constants"
import { test } from "./fixtures"

test("fill nft form and deploy a contract", async ({
  pageWithKeyPair: { page },
}) => {
  await page.goto(GUILD_CHECKOUT_TEST_GUILD_URL_NAME)

  await page.waitForResponse(`**/v2/users/${TEST_USER.id}/profile`, {
    timeout: 30_000,
  })

  // Open the "Guild solutions" modal
  const addSolutionButton = await page
    .getByTestId("layout-action")
    .getByTestId("add-solutions-button")
  await addSolutionButton.click()
  const addSolutionsModal = await page.getByRole("dialog", {
    name: "Guild Solutions",
  })
  await expect(addSolutionsModal).toBeVisible()

  // Open the "Add NFT reward" modal
  const addContractCallRewardCard = await page.getByTestId("contract-call-solution")
  await addContractCallRewardCard.click()

  const addNFTModal = await page.getByRole("dialog", {
    name: "Add NFT reward",
  })
  await expect(addNFTModal).toBeVisible()

  // Test every basic input field inside the NFT form
  const nameInput = await addNFTModal.locator("input[name='name']")
  await nameInput.fill("E2E test NFT")

  const metadataDescriptionTextarea = await addNFTModal.getByLabel(
    "Metadata description"
  )
  await metadataDescriptionTextarea.fill("E2E test NFT metadata description")

  const payoutAddressInput = await addNFTModal.getByLabel("Payout address")
  await expect(payoutAddressInput).toHaveValue(new RegExp(TEST_USER.address, "i"))
  await payoutAddressInput.fill("")
  await expect(payoutAddressInput).toHaveAttribute("aria-invalid", "true")
  await payoutAddressInput.fill(TEST_USER.address)

  // TODO: Seems like the chain select doesn't work inside Playwright, make sure to write tests for that once we migrate to the Radix UI select

  // Test the metadata attribute fieldArray
  const addAttributeButton = await addNFTModal.getByText("Add attribute")
  addAttributeButton.click()
  const attributeNameInput = await addNFTModal.locator(
    "input[name='attributes.0.name']"
  )
  await expect(attributeNameInput).toBeVisible()
  const attributeValueInput = await addNFTModal.locator(
    "input[name='attributes.0.value']"
  )
  await expect(attributeValueInput).toBeVisible()
  const removeAttributeButton = await addNFTModal.getByLabel("Remove attribute")
  await removeAttributeButton.click()
  await expect(attributeNameInput).toBeHidden()

  // Test the "Limit supply" panel
  const limitSupplyPanel = await addNFTModal.getByText("Limit supply")
  await limitSupplyPanel.click()

  const supplyTypeSegmentedControl = await addNFTModal.getByTestId(
    "supply-type-segmented-control"
  )
  await expect(supplyTypeSegmentedControl).toBeVisible()
  await testSegmentedControlWithNumberInput(
    addNFTModal,
    supplyTypeSegmentedControl,
    "maxSupply"
  )

  const mintLimitTypeSegmentedControl = await addNFTModal.getByTestId(
    "mint-limit-type-segmented-control"
  )
  await expect(mintLimitTypeSegmentedControl).toBeVisible()
  await testSegmentedControlWithNumberInput(
    addNFTModal,
    mintLimitTypeSegmentedControl,
    "mintableAmountPerUser"
  )

  await limitSupplyPanel.click()
  await expect(supplyTypeSegmentedControl).toBeHidden()
  await expect(mintLimitTypeSegmentedControl).toBeHidden()

  await limitSupplyPanel.click()
  await testSegmentedControlWithNumberInputReset(
    addNFTModal,
    supplyTypeSegmentedControl,
    "maxSupply"
  )
  await testSegmentedControlWithNumberInputReset(
    addNFTModal,
    mintLimitTypeSegmentedControl,
    "mintableAmountPerUser"
  )
  await limitSupplyPanel.click()

  // Test the "Limit claiming time" panel
  const limitClaimingTimePanel = await addNFTModal.getByText("Limit claiming time")
  await limitClaimingTimePanel.click()

  const startTimeInput = await addNFTModal.locator("input[name='startTime']")
  await expect(startTimeInput).toBeVisible()
  const endTimeInput = await addNFTModal.locator("input[name='endTime']")
  await expect(endTimeInput).toBeVisible()

  /**
   * Media input - Playwright doesn't work with react-dropzone, so we just set the file input's value manually here
   *
   * GitHub issue: https://github.com/microsoft/playwright/issues/8850
   */
  const imagePicker = await addNFTModal.getByTestId("nft-image-picker")
  const fileInput = await imagePicker.locator("input[type='file']")
  await fileInput.setInputFiles(path.join(__dirname, "files/nft-image.png"))
  const uploadedImage = await imagePicker.locator("img[alt='NFT image']")
  await expect(uploadedImage).toBeVisible({
    timeout: 30_000,
  })
  await expect(uploadedImage).toHaveAttribute("src", /^https:\/\/*/)

  // Finally, submit the transaction
  const createNFTButton = await addNFTModal.getByTestId("create-nft-button")
  await createNFTButton.click()

  const successToast = await page.getByText("Successfully deployed NFT contract", {
    exact: true,
  })
  await expect(successToast).toBeVisible({ timeout: 30_000 })
})

test("user is not eligible - can't mint nft", async ({
  pageWithKeyPair: { page },
}) => {
  await page.goto(GUILD_CHECKOUT_TEST_GUILD_URL_NAME)

  await page.waitForResponse("**/v2/users/*/memberships?guildId=*", {
    timeout: 30_000,
  })

  const roleCard = await page.locator(`#role-${UNHAPPY_PATH_ROLE_ID}`)
  const nftRewardCardButton = await roleCard.locator("a", {
    hasText: NFT_REWARD_CARD_BUTTON_TEXT,
  })
  const collectNFTPageURL = await nftRewardCardButton.getAttribute("href")
  await nftRewardCardButton.click()
  await page.waitForURL(collectNFTPageURL ?? "")

  const title = await page.locator("h2")
  await expect(title).toHaveText(NFT_1_NAME)

  const collectNFTButton = await page.getByTestId("collect-nft-button")
  await expect(collectNFTButton).toBeEnabled({
    timeout: 30_000,
  })
  const whaleButton = await page.locator("button", {
    hasText: "whale",
  })
  await whaleButton.click()
  await expect(collectNFTButton).toBeDisabled()
  await expect(collectNFTButton).toHaveText("Insufficient balance")
  const shrimpButton = await page.locator("button", {
    hasText: "Shrimp",
  })
  await shrimpButton.click()
  await expect(collectNFTButton).toBeEnabled()
  await expect(collectNFTButton).toHaveText(COLLECT_BUTTON_TEXT_REGEX)

  await collectNFTButton.click()
  await page.waitForResponse("**/v2/guilds/*/roles/*/role-platforms/*/claim")

  const errorToast = await page.getByText(NOT_ELIGIBLE_TOAST_TEXT)
  await expect(errorToast).toBeVisible({
    timeout: 30_000,
  })
})

test("user is eligible - can mint nft", async ({ pageWithKeyPair: { page } }) => {
  await page.goto(GUILD_CHECKOUT_TEST_GUILD_URL_NAME)

  await page.waitForResponse("**/v2/users/*/memberships?guildId=*", {
    timeout: 30_000,
  })

  const roleCard = await page.locator(`#role-${HAPPY_PATH_ROLE_ID}`)
  const nftRewardCardButton = await roleCard.locator("a", {
    hasText: NFT_REWARD_CARD_BUTTON_TEXT,
  })
  const collectNFTPageURL = await nftRewardCardButton.getAttribute("href")
  await nftRewardCardButton.click()
  await page.waitForURL(collectNFTPageURL ?? "")

  const title = await page.locator("h2")
  await expect(title).toHaveText(NFT_2_NAME)

  const collectNFTButton = await page.getByTestId("collect-nft-button")
  await expect(collectNFTButton).toBeEnabled({
    timeout: 30_000,
  })

  await collectNFTButton.click()
  await page.waitForResponse("**/v2/guilds/*/roles/*/role-platforms/*/claim")

  const successToast = await page.locator("li[role='status']", {
    hasText: SUCCESS_TOAST_TEXT,
  })
  await expect(successToast).toBeVisible({
    timeout: 30_000,
  })

  const successModal = await page.getByRole("dialog", {
    name: "Success",
  })
  await expect(successModal).toBeVisible({
    timeout: 30_000,
  })
  const modalCloseButton = await successModal.getByText("Close")
  await modalCloseButton.click()
})

// Utils, constants

const testSegmentedControlWithNumberInput = async (
  addNFTModal: Locator,
  segmentedControlLocator: Locator,
  numberInputName: string
) => {
  const unlimitedSegment = await segmentedControlLocator.locator(
    UNLIMITED_SEGMENT_LOCATOR
  )
  const numberInput = await addNFTModal.locator(
    getNumberInputLocator(numberInputName)
  )
  const limitedSegment = await segmentedControlLocator.locator(
    "> label:last-child > div:last-child"
  )

  await testSegmentedControlWithNumberInputReset(
    addNFTModal,
    segmentedControlLocator,
    numberInputName
  )

  await limitedSegment.click()
  await expect(limitedSegment).toHaveAttribute("data-checked")
  await expect(numberInput).toHaveValue("1")
  await unlimitedSegment.click()
  await expect(numberInput).toHaveValue("0")
  await numberInput.fill("2")
  await expect(limitedSegment).toHaveAttribute("data-checked")
  await numberInput.fill("0")
  await expect(unlimitedSegment).toHaveAttribute("data-checked")
}

const testSegmentedControlWithNumberInputReset = async (
  addNFTModal: Locator,
  segmentedControlLocator: Locator,
  numberInputName: string
) => {
  const unlimitedSegment = await segmentedControlLocator.locator(
    UNLIMITED_SEGMENT_LOCATOR
  )
  await expect(unlimitedSegment).toHaveAttribute("data-checked")
  const numberInput = await addNFTModal.locator(
    getNumberInputLocator(numberInputName)
  )
  await expect(numberInput).toHaveValue("0")
}

const UNLIMITED_SEGMENT_LOCATOR = "> label:first-child > div:last-child"
const getNumberInputLocator = (numberInputName: string) =>
  `input[name='${numberInputName}']`

const NFT_REWARD_CARD_BUTTON_TEXT = new RegExp("(Collect NFT|View NFT details)")
const NFT_1_NAME = "Cypress Gang #1"
const UNHAPPY_PATH_ROLE_ID = 91062
const NOT_ELIGIBLE_TOAST_TEXT = "You're not eligible for claiming this reward"
const NFT_2_NAME = "Cypress Gang #2"
const HAPPY_PATH_ROLE_ID = 91063
const COLLECT_BUTTON_TEXT_REGEX = new RegExp("(Check access & collect|Collect now)")
const SUCCESS_TOAST_TEXT = "Successfully collected NFT!"
