import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import { randomBytes } from "crypto"
import { createStore, del, get, set } from "idb-keyval"
import useSWR, { KeyedMutator, mutate } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { bufferToHex, strToBuffer } from "utils/bufferUtils"
import fetcher from "utils/fetcher"
import { Validation } from "./useSubmit"
import { useSubmitWithSignWithParamKeyPair } from "./useSubmit/useSubmit"
import useToast from "./useToast"

type StoredKeyPair = {
  keyPair: CryptoKeyPair
  pubKey: string
}

type AddressLinkParams = {
  userId: number
  signature: string
  nonce: string
}

type SetKeypairPayload = StoredKeyPair & Partial<AddressLinkParams>

const getStore = () => createStore("guild.xyz", "signingKeyPairs")

const getKeyPairFromIdb = (userId: number) => get<StoredKeyPair>(userId, getStore())
const deleteKeyPairFromIdb = (userId: number) => del(userId, getStore())
const setKeyPairToIdb = (userId: number, keys: StoredKeyPair) =>
  set(userId, keys, getStore())

const generateKeyPair = () => {
  try {
    return window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      false,
      ["sign", "verify"]
    )
  } catch (error) {
    console.error(error)
    throw new Error("Generating a key pair is unsupported in this browser.")
  }
}

const getKeyPair = async (_: string, id: number) => {
  const keyPairAndPubKey = await getKeyPairFromIdb(id)

  if (keyPairAndPubKey === undefined) {
    return {
      keyPair: null,
      pubKey: null,
    }
  }

  return keyPairAndPubKey
}

const setKeyPair = async ({
  account,
  mutateKeyPair,
  validation,
  payload,
}: {
  account: string
  validation: Validation
  mutateKeyPair: KeyedMutator<StoredKeyPair>
  payload: SetKeypairPayload
}): Promise<[StoredKeyPair, boolean]> => {
  const { keyPair, ...body } = payload

  const shouldSendLink =
    typeof body.userId === "number" && typeof body.signature === "string"

  if (!shouldSendLink) {
    delete body.signature
    delete body.userId
  }

  const { userId } = await fetcher("/user/pubKey", {
    body: {
      payload: body,
      ...validation,
    },
    method: "POST",
  })

  let storedKeyPair: StoredKeyPair

  if (!shouldSendLink) {
    storedKeyPair = { pubKey: body.pubKey, keyPair }

    /**
     * This rejects, when IndexedDB is not available, like in Firefox private window.
     * Ignoring this error is fine, since we are falling back to just storing it in
     * memory.
     */
    await setKeyPairToIdb(userId, storedKeyPair).catch(() => {})
  }

  await mutate(`/user/${account}`)
  await mutateKeyPair()

  return [storedKeyPair, shouldSendLink]
}

const checkKeyPair = (_: string, savedPubKey: string, pubKey: string): boolean =>
  savedPubKey === pubKey

const useKeyPair = () => {
  // Using the default Datadog implementation here, so the useDatadog, useUser, and useKeypair hooks don't call each other
  const addDatadogAction = useRumAction("trackingAppAction")
  const addDatadogError = useRumError()

  const { account } = useWeb3React()

  const { data: user, error: userError } = useSWRImmutable<User>(
    account ? `/user/${account}` : null
  )

  const defaultCustomAttributes = {
    userId: user?.id,
    userAddress: account?.toLowerCase(),
  }

  const {
    data: { keyPair, pubKey },
    mutate: mutateKeyPair,
    error: keyPairError,
  } = useSWR(!!user?.id ? ["keyPair", user?.id] : null, getKeyPair, {
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    fallbackData: { pubKey: undefined, keyPair: undefined },
  })

  const toast = useToast()

  const { data: isValid } = useSWRImmutable(
    user?.signingKey && pubKey ? ["isKeyPairValid", user?.signingKey, pubKey] : null,
    checkKeyPair,
    {
      onSuccess: (isKeyPairValid) => {
        if (!isKeyPairValid) {
          addDatadogAction("Invalid keypair", {
            ...defaultCustomAttributes,
            data: { userId: user?.id, pubKey: keyPair.publicKey },
          })

          toast({
            status: "warning",
            title: "Session expired",
            description:
              "You've connected your account from a new device, so you have to sign a new message to stay logged in",
            duration: 5000,
          })

          deleteKeyPairFromIdb(user?.id).then(() => {
            mutateKeyPair({ pubKey: undefined, keyPair: undefined })
          })
        } else if (
          !!window.localStorage.getItem("userId") &&
          +window.localStorage.getItem("userId") !== user?.id
        ) {
          deleteKeyPairFromIdb(user?.id).then(() => {
            mutateKeyPair({ pubKey: undefined, keyPair: undefined })
          })
        }
      },
    }
  )

  const setSubmitResponse = useSubmitWithSignWithParamKeyPair<
    SetKeypairPayload,
    [StoredKeyPair, boolean]
  >(
    ({ data, validation }) =>
      setKeyPair({ account, mutateKeyPair, validation, payload: data }),
    {
      keyPair,
      forcePrompt: true,
      message:
        "Please sign this message, so we can generate, and assign you a signing key pair. This is needed so you don't have to sign every Guild interaction.",
      onError: (error) => {
        console.error("setKeyPair error", error)
        if (error?.code !== 4001) {
          addDatadogError(
            `Failed to set keypair`,
            {
              ...defaultCustomAttributes,
              error: error?.message || error?.toString?.() || error,
            },
            "custom"
          )
        }
      },
      onSuccess: ([generatedKeyPair, shouldDeleteUserId]) => {
        if (shouldDeleteUserId) {
          try {
            window.localStorage.removeItem("userId")
          } catch (error) {
            addDatadogError(
              `Failed to remove userId from localStorage after account link`,
              {
                ...defaultCustomAttributes,
                error: error?.message || error?.toString?.() || error,
              },
              "custom"
            )
          }
          addDatadogAction("Successfully linked address")
        } else {
          mutateKeyPair(generatedKeyPair)
          addDatadogAction("Successfully generated keypair")
        }
      },
    }
  )

  const ready = !(keyPair === undefined && keyPairError === undefined) || !!userError

  return {
    ready,
    pubKey,
    keyPair,
    isValid,
    set: {
      ...setSubmitResponse,
      onSubmit: async (shouldLinkToUser: boolean) => {
        const body: SetKeypairPayload = {
          pubKey: undefined,
          keyPair: undefined,
        }

        try {
          const generatedKeys = await generateKeyPair()

          try {
            const generatedPubKey = await window.crypto.subtle.exportKey(
              "raw",
              generatedKeys.publicKey
            )

            const generatedPubKeyHex = bufferToHex(generatedPubKey)
            body.pubKey = generatedPubKeyHex
            body.keyPair = generatedKeys
          } catch {
            throw new Error("Pubkey export error")
          }
        } catch (error) {
          if (error?.code !== 4001) {
            addDatadogError(
              `Keypair generation error`,
              {
                ...defaultCustomAttributes,
                error: error?.message || error?.toString?.() || error,
              },
              "custom"
            )
          }
          throw error
        }

        if (shouldLinkToUser) {
          const userId = +window.localStorage.getItem("userId")

          const { keyPair: mainUserKeyPair } = await getKeyPairFromIdb(userId)

          const nonce = randomBytes(32).toString("base64")

          const mainUserSig = await window.crypto.subtle
            .sign(
              { name: "ECDSA", hash: "SHA-512" },
              mainUserKeyPair.privateKey,
              strToBuffer(
                `Address: ${account.toLowerCase()}\nNonce: ${nonce}\nUserID: ${userId}`
              )
            )
            .then((signatureBuffer) => bufferToHex(signatureBuffer))

          body.signature = mainUserSig
          body.userId = userId
          body.nonce = nonce
        }

        return setSubmitResponse.onSubmit(body)
      },
    },
  }
}

export { getKeyPairFromIdb, setKeyPairToIdb, deleteKeyPairFromIdb }
export default useKeyPair
