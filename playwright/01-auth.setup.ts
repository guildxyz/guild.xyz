import fs from "fs"
import path from "path"
import { expect, test as setup } from "@playwright/test"
import { StoredKeyPair } from "utils/keyPair"
import { TEST_USER } from "./constants"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page }) => {
  await page.addInitScript(() => {
    /**
     * Always calling the `generateKey` method with `extractable: true`, so we can save & re-use the generated keys in our E2E tests
     */
    const originalGenerateKey = window.crypto.subtle.generateKey

    window.crypto.subtle.generateKey = async function (
      algorithm,
      _extractable,
      keyUsages
    ) {
      return originalGenerateKey.call(this, algorithm, true, keyUsages)
    }
  })

  await page.goto("/explorer")
  await page.getByTestId("sign-in-button").click()

  const signInDialog = await page.getByRole("dialog", {
    name: "Connect to Guild",
  })
  await expect(signInDialog).toBeVisible()

  await page.getByTestId("mock-connector-button").click()
  await page.getByTestId("verify-address-button").click()

  const publicKeyResponse = await page
    .waitForResponse(`**/v2/users/${TEST_USER.id}/public-key`)
    .then((res) => res.json())

  const storedKeyPairToSave = await page.evaluate(
    async ({ userId }) => {
      const idb = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open("guild.xyz")

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      const keyPair = await new Promise<StoredKeyPair>((resolve, reject) => {
        const transaction = idb.transaction("signingKeyPairs", "readonly")
        const store = transaction.objectStore("signingKeyPairs")
        const request = store.get(userId)

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      const exportedPrivateKey = await window.crypto.subtle.exportKey(
        "jwk",
        keyPair.keyPair.privateKey
      )
      const exportedPublicKey = await window.crypto.subtle.exportKey(
        "jwk",
        keyPair.keyPair.publicKey
      )

      return {
        pubKey: keyPair.pubKey,
        keyPair: { privateKey: exportedPrivateKey, publicKey: exportedPublicKey },
      }
    },
    { userId: publicKeyResponse.id }
  )

  try {
    fs.mkdirSync(path.join(__dirname, "/.auth"))
    // biome-ignore lint/suspicious/noEmptyBlockStatements: we don't need to re-create the directory if it already exists
  } catch {}

  fs.writeFileSync(
    path.join(__dirname, "/.auth/keyPair.json"),
    JSON.stringify(storedKeyPairToSave),
    {
      flag: "w+",
    }
  )

  await page.context().storageState({ path: authFile })
})
