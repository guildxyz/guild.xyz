import { JsonWebKey } from "crypto"
import fs from "fs"
import path from "path"
import { type Page, test as base } from "@playwright/test"
import { StoredKeyPair } from "utils/keyPair"
import { TEST_USER } from "./constants"

class PageWithKeyPair {
  page: Page

  constructor(page: Page) {
    this.page = page
  }
}

type Fixtures = {
  pageWithKeyPair: PageWithKeyPair
}

export const test = base.extend<Fixtures>({
  pageWithKeyPair: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    })
    const pageWithKeyPair = new PageWithKeyPair(await context.newPage())

    const keyPairPath = path.join(__dirname, "/.auth/keyPair.json")
    const importedKeyPairData: {
      pubKey: StoredKeyPair["pubKey"]
      keyPair: {
        publicKey: JsonWebKey
        privateKey: JsonWebKey
      }
    } = JSON.parse(fs.readFileSync(keyPairPath, "utf8"))

    await pageWithKeyPair.page.addInitScript(
      async ({ importedKeyPairData, userId }) => {
        const importedPublicKey = await crypto.subtle.importKey(
          "jwk",
          importedKeyPairData.keyPair.publicKey,
          {
            name: "ECDSA",
            namedCurve: "P-256",
          },
          false,
          ["verify"]
        )

        const importedPrivateKey = await crypto.subtle.importKey(
          "jwk",
          importedKeyPairData.keyPair.privateKey,
          {
            name: "ECDSA",
            namedCurve: "P-256",
          },
          false,
          ["sign"]
        )

        const idb = await new Promise<IDBDatabase>((resolve, reject) => {
          const request = indexedDB.open("guild.xyz")

          request.onupgradeneeded = () => {
            request.result.createObjectStore("signingKeyPairs")
          }

          request.onsuccess = () => resolve(request.result)
          request.onerror = () => reject(request.error)
        })

        await new Promise<void>((resolve, reject) => {
          const transaction = idb.transaction("signingKeyPairs", "readwrite")
          const store = transaction.objectStore("signingKeyPairs")

          const keyPairToSave = {
            pubKey: importedKeyPairData.pubKey,
            keyPair: {
              privateKey: importedPrivateKey,
              publicKey: importedPublicKey,
            },
          } satisfies StoredKeyPair

          const request = store.put(keyPairToSave, userId)

          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      },
      { importedKeyPairData, userId: TEST_USER.id }
    )

    await use(pageWithKeyPair)
    await context.close()
  },
})
