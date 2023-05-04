import { useWeb3React } from "@web3-react/core"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { randomBytes } from "crypto"
import { createStore, del, get, set } from "idb-keyval"
import { useEffect } from "react"
import useSWR, { KeyedMutator, mutate, unstable_serialize } from "swr"
import useSWRImmutable from "swr/immutable"
import { AddressConnectionProvider, User } from "types"
import { bufferToHex, strToBuffer } from "utils/bufferUtils"
import fetcher from "utils/fetcher"
import useLocalStorage from "./useLocalStorage"
import { mutateOptionalAuthSWRKey } from "./useSWRWithOptionalAuth"
import {
  SignedValdation,
  useSubmitWithSignWithParamKeyPair,
} from "./useSubmit/useSubmit"
import useToast from "./useToast"

type StoredKeyPair = {
  keyPair: CryptoKeyPair
  pubKey: string
}

/**
 * This is a generic RPC internal error code, but we are only using it for testing
 * personal_sign errors, which should mean that the user rejected the request
 */
const RPC_INTERNAL_ERROR_CODE = -32603

type AddressLinkParams =
  | ({
      userId: number
      signature: string
      nonce: string
    } & { addressConnectionProvider: never })
  | ({
      addressConnectionProvider: AddressConnectionProvider
    } & {
      userId: never
      signature: never
      nonce: never
    })

type SetKeypairPayload = Omit<StoredKeyPair, "keyPair"> & Partial<AddressLinkParams>

const getStore = () => createStore("guild.xyz", "signingKeyPairs")

const getKeyPairFromIdb = (userId: number) => get<StoredKeyPair>(userId, getStore())
const deleteKeyPairFromIdb = (userId: number) => del(userId, getStore())
const setKeyPairToIdb = (userId: number, keys: StoredKeyPair) =>
  set(userId, keys, getStore())

const generateKeyPair = async () => {
  const keyPair: StoredKeyPair = {
    pubKey: undefined,
    keyPair: undefined,
  }
  try {
    const generatedKeys = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      false,
      ["sign", "verify"]
    )

    const generatedPubKey = await window.crypto.subtle.exportKey(
      "raw",
      generatedKeys.publicKey
    )

    const generatedPubKeyHex = bufferToHex(generatedPubKey)
    keyPair.pubKey = generatedPubKeyHex
    keyPair.keyPair = generatedKeys
    return keyPair
  } catch {
    throw new Error("Pubkey export error")
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
  generatedKeyPair,
  signedValidation,
}: {
  account: string
  mutateKeyPair: KeyedMutator<StoredKeyPair>
  generatedKeyPair: StoredKeyPair
  signedValidation: SignedValdation
}): Promise<[StoredKeyPair, boolean]> => {
  const {
    userId: signedUserId,
    signature,
    nonce,
    addressConnectionProvider,
  } = JSON.parse(signedValidation.signedPayload)

  const shouldSendLink =
    typeof signedUserId === "number" &&
    typeof signature === "string" &&
    typeof nonce === "string"

  const { userId } = await fetcher("/user/pubKey", {
    method: "POST",
    ...signedValidation,
  })

  let storedKeyPair: StoredKeyPair

  const prevKeyPair = await getKeyPairFromIdb(userId).catch(() => null)

  if (!shouldSendLink && (!addressConnectionProvider || !prevKeyPair)) {
    storedKeyPair = generatedKeyPair

    /**
     * This rejects, when IndexedDB is not available, like in Firefox private window.
     * Ignoring this error is fine, since we are falling back to just storing it in
     * memory.
     */
    await setKeyPairToIdb(userId, storedKeyPair).catch(() => {})
  }

  await mutate(`/user/${account}`)
  if (shouldSendLink) {
    await mutateOptionalAuthSWRKey(`/user/${account}`)
  }
  await mutateKeyPair()

  return [storedKeyPair, shouldSendLink]
}

const checkKeyPair = (_: string, savedPubKey: string, pubKey: string): boolean =>
  savedPubKey === pubKey

const usePublicUserData = (address?: string) => {
  const { account } = useWeb3React()
  return useSWRImmutable<User>(
    address || account ? `/user/${address ?? account}` : null
  )
}

const useKeyPair = () => {
  const { captureEvent } = usePostHogContext()

  const { account } = useWeb3React()

  const { isDelegateConnection, setIsDelegateConnection } =
    useWeb3ConnectionManager()

  const { data: user, error: userError } = usePublicUserData()

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

  const { data: generatedKeyPair } = useSWRImmutable(
    "generatedKeyPair",
    generateKeyPair,
    {
      revalidateOnMount: true,
      fallbackData: { pubKey: undefined, keyPair: undefined },
    }
  )

  const toast = useToast()

  const { data: isValid } = useSWRImmutable(
    user?.signingKey && pubKey ? ["isKeyPairValid", user?.signingKey, pubKey] : null,
    checkKeyPair,
    {
      onSuccess: (isKeyPairValid) => {
        if (!isKeyPairValid) {
          captureEvent("Invalid keypair", {
            userId: user?.id,
            pubKey: keyPair.publicKey,
          })

          toast({
            status: "warning",
            title: "Session expired",
            description:
              "You've connected your account from a new device, so you have to sign a new message to stay logged in",
            duration: 5000,
          })

          deleteKeyPairFromIdb(user?.id).then(() => {
            mutateKeyPair({ pubKey: undefined, keyPair: undefined }).then(() => {
              mutate(unstable_serialize(["shouldLinkToUser", user?.id]))
            })
          })
        } else if (
          !!window.localStorage.getItem("userId") &&
          JSON.parse(window.localStorage.getItem("userId")).id !== user?.id
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
    (signedValidation: SignedValdation) =>
      setKeyPair({
        account,
        mutateKeyPair,
        generatedKeyPair,
        signedValidation,
      }),
    {
      keyPair,
      forcePrompt: true,
      message:
        "Please sign this message, so we can generate, and assign you a signing key pair. This is needed so you don't have to sign every Guild interaction.",
      onError: (error) => {
        console.error("setKeyPair error", error)
        if (error?.code !== RPC_INTERNAL_ERROR_CODE) {
          captureEvent(`Failed to set keypair`, { error })
        }

        try {
          window.localStorage.removeItem("userId")
          mutate(unstable_serialize(["shouldLinkToUser", user?.id]))
        } catch (err) {
          captureEvent(
            `Failed to remove userId from localStorage after unsuccessful account link`,
            {
              error: err?.message || err?.toString?.() || err,
            }
          )
        }
      },
      onSuccess: ([newKeyPair, shouldDeleteUserId]) => {
        setTimeout(() => {
          mutateOptionalAuthSWRKey(`/user/${account}`).then(() =>
            setTimeout(() => {
              mutate(unstable_serialize(["delegateCashVaults", user?.id])).then(
                () => {
                  window.localStorage.removeItem(`isDelegateDismissed_${user?.id}`)
                }
              )
            }, 500)
          )
        }, 500)

        setIsDelegateConnection(false)
        if (shouldDeleteUserId) {
          try {
            window.localStorage.removeItem("userId")
          } catch (error) {
            captureEvent(
              `Failed to remove userId from localStorage after account link`,
              {
                error: error?.message || error?.toString?.() || error,
              }
            )
          }
        } else {
          mutateKeyPair(newKeyPair)
        }
      },
    }
  )

  const ready = !(keyPair === undefined && keyPairError === undefined) || !!userError

  const [localStorageUser, setLocalStorageUser] = useLocalStorage(
    "userId",
    undefined
  )

  const mainUser = usePublicUserData(localStorageUser?.address)

  const { data: mainUserKeyPair, error } = useSWRImmutable(
    mainUser?.data?.id ? ["mainUserKeyPair", mainUser?.data?.id] : null,
    (_, id) => getKeyPairFromIdb(id)
  )

  const isMainUserKeyInvalid =
    !!error ||
    (!!mainUser?.data?.id &&
      !!localStorageUser?.id &&
      mainUser.data.id !== user?.id &&
      mainUserKeyPair &&
      mainUser.data.signingKey !== mainUserKeyPair.pubKey)

  useEffect(() => {
    if (isMainUserKeyInvalid) {
      setLocalStorageUser(undefined)
      deleteKeyPairFromIdb(mainUser?.data?.id).then(() =>
        mutate(unstable_serialize(["shouldLinkToUser", user?.id]))
      )
    }
  }, [isMainUserKeyInvalid])

  return {
    ready,
    pubKey,
    keyPair,
    isValid,
    set: {
      ...setSubmitResponse,
      onSubmit: async (
        shouldLinkToUser: boolean,
        provider?: AddressConnectionProvider
      ) => {
        const body: SetKeypairPayload = { pubKey: undefined }

        try {
          body.pubKey = generatedKeyPair.pubKey
        } catch (err) {
          if (error?.code !== 4001) {
            captureEvent(`Keypair generation error`, {
              error: err?.message || err?.toString?.() || err,
            })
          }
          throw err
        }

        if (shouldLinkToUser) {
          const userId = JSON.parse(window.localStorage.getItem("userId"))?.id

          const { keyPair: mainKeyPair } = await getKeyPairFromIdb(userId)

          const nonce = randomBytes(32).toString("base64")

          const mainUserSig = await window.crypto.subtle
            .sign(
              { name: "ECDSA", hash: "SHA-512" },
              mainKeyPair?.privateKey,
              strToBuffer(
                `Address: ${account.toLowerCase()}\nNonce: ${nonce}\nUserID: ${userId}`
              )
            )
            .then((signatureBuffer) => bufferToHex(signatureBuffer))

          if (
            typeof mainUserSig === "string" &&
            mainUserSig.length > 0 &&
            typeof userId === "number"
          ) {
            body.signature = mainUserSig
            body.userId = userId
            body.nonce = nonce
          }
        }

        if (isDelegateConnection || provider === "DELEGATE") {
          const prevKeyPair = await getKeyPairFromIdb(user?.id)
          body.addressConnectionProvider = "DELEGATE"
          body.pubKey = prevKeyPair?.pubKey ?? body.pubKey
        }

        return setSubmitResponse.onSubmit(body)
      },
    },
  }
}

export { getKeyPairFromIdb, setKeyPairToIdb, deleteKeyPairFromIdb }
export default useKeyPair
