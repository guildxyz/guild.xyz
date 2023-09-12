import { useWeb3React } from "@web3-react/core"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { useWeb3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { randomBytes } from "crypto"
import { createStore, del, get, set } from "idb-keyval"
import { createContext, PropsWithChildren, useContext, useEffect } from "react"
import useSWR, { KeyedMutator, mutate, unstable_serialize } from "swr"
import useSWRImmutable from "swr/immutable"
import { AddressConnectionProvider, User } from "types"
import { bufferToHex, strToBuffer } from "utils/bufferUtils"
import fetcher from "utils/fetcher"
import {
  SignedValdation,
  useSubmitWithSignWithParamKeyPair,
} from "../../hooks/useSubmit/useSubmit"
import useToast from "../../hooks/useToast"

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

type SetKeypairPayload = Omit<StoredKeyPair, "keyPair"> &
  Partial<AddressLinkParams> & {
    verificationParams?: {
      reCaptcha: string
    }
  }

const getStore = () => createStore("guild.xyz", "signingKeyPairs")

const getKeyPairFromIdb = (userId: number) => get<StoredKeyPair>(userId, getStore())
const deleteKeyPairFromIdb = (userId: number) =>
  userId ? del(userId, getStore()) : null
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

const getKeyPair = async ([_, id]) => {
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
  id,
}: {
  account: string
  mutateKeyPair: KeyedMutator<StoredKeyPair>
  generatedKeyPair: StoredKeyPair
  signedValidation: SignedValdation
  id: number
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

  const newUser: User = await fetcher(`/v2/users/${id ?? account}/public-key`, {
    method: "POST",
    ...signedValidation,
  })

  let storedKeyPair: StoredKeyPair

  const prevKeyPair = await getKeyPairFromIdb(
    (newUser as any)?.userId ?? newUser.id
  ).catch(() => null)

  if (!shouldSendLink && (!addressConnectionProvider || !prevKeyPair)) {
    storedKeyPair = generatedKeyPair

    /**
     * This rejects, when IndexedDB is not available, like in Firefox private window.
     * Ignoring this error is fine, since we are falling back to just storing it in
     * memory.
     */
    await setKeyPairToIdb(
      (newUser as any)?.userId ?? newUser.id,
      storedKeyPair
    ).catch(() => {})
  }

  mutate([`/v2/users/${newUser.id}/profile`, { method: "GET", body: {} }], newUser, {
    revalidate: false,
  })
  mutate(
    `/v2/users/${account}/profile`,
    {
      id: newUser?.id,
      publicKey: newUser?.publicKey,
      captchaVerifiedSince: newUser?.captchaVerifiedSince,
    },
    {
      revalidate: false,
    }
  )

  if (shouldSendLink) {
    mutate(
      [`/v2/users/${signedUserId}/profile`, { method: "GET", body: {} }],
      newUser,
      {
        revalidate: false,
      }
    )
  }

  await mutateKeyPair()

  return [storedKeyPair, shouldSendLink]
}

const checkKeyPair = ([_, savedPubKey, pubKey]): boolean => savedPubKey === pubKey

const KeyPairContext = createContext<{
  ready: boolean
  pubKey: string | undefined
  keyPair: CryptoKeyPair | undefined
  isValid: boolean
  set: {
    isSigning: boolean
    signLoadingText: string
    response: [StoredKeyPair, boolean]
    isLoading: boolean
    error: any
    reset: () => void

    onSubmit: (
      shouldLinkToUser: boolean,
      provider?: AddressConnectionProvider,
      reCaptchaToken?: string
    ) => Promise<void>
  }
}>(undefined)

const KeyPairProvider = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const { captureEvent } = usePostHogContext()

  const { account } = useWeb3React()

  const {
    isDelegateConnection,
    setIsDelegateConnection,
    addressLinkParams,
    setAddressLinkParams,
  } = useWeb3ConnectionManager()

  const {
    id,
    publicKey,
    error: publicUserError,
    captchaVerifiedSince,
    ...user
  } = useUserPublic()

  useEffect(() => {
    if (!!id && !captchaVerifiedSince) {
      deleteKeyPairFromIdb(id).then(() => mutateKeyPair())
    }
  }, [id, captchaVerifiedSince])

  const {
    data: { keyPair, pubKey },
    mutate: mutateKeyPair,
    error: keyPairError,
  } = useSWR(!!id || !!publicUserError ? ["keyPair", id] : null, getKeyPair, {
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    fallbackData: { pubKey: undefined, keyPair: undefined },
  })

  const { data: generatedKeyPair } = useSWRImmutable(
    ["generatedKeyPair", id],
    generateKeyPair
  )

  const toast = useToast()

  const { data: isValid } = useSWRImmutable(
    (id || publicUserError) && pubKey
      ? ["isKeyPairValid", publicKey ?? (user as any)?.signingKey, pubKey]
      : null,
    checkKeyPair,
    {
      onSuccess: (isKeyPairValid) => {
        if (!isKeyPairValid) {
          captureEvent("Invalid keypair", {
            userId: id,
            pubKey: keyPair.publicKey,
          })

          toast({
            status: "warning",
            title: "Session expired",
            description:
              "You've connected your account from a new device, so you have to sign a new message to stay logged in",
            duration: 5000,
          })

          deleteKeyPairFromIdb(id).then(() => {
            mutateKeyPair({ pubKey: undefined, keyPair: undefined }).then(() => {
              mutate(unstable_serialize(["shouldLinkToUser", id]))
            })
          })
        } else if (!!addressLinkParams?.userId && addressLinkParams?.userId !== id) {
          deleteKeyPairFromIdb(id).then(() => {
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
        id,
      }),
    {
      keyPair,
      forcePrompt: true,
      message:
        "Please sign this message, so we can generate, and assign you a signing key pair. This is needed so you don't have to sign every Guild interaction.",
      onError: (error) => {
        console.error("setKeyPair error", error)
        if (
          error?.code !== RPC_INTERNAL_ERROR_CODE &&
          error?.code !== "ACTION_REJECTED"
        ) {
          const trace = error?.stack || new Error().stack
          captureEvent(`Failed to set keypair`, { error, trace })
        }

        try {
          setAddressLinkParams({ userId: null, address: null })
          mutate(unstable_serialize(["shouldLinkToUser", id]))
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
        mutate(unstable_serialize(["delegateCashVaults", id])).then(() => {
          window.localStorage.removeItem(`isDelegateDismissed_${id}`)
        })

        setIsDelegateConnection(false)
        if (shouldDeleteUserId) {
          try {
            setAddressLinkParams({ userId: null, address: null })
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

  const ready =
    !(keyPair === undefined && keyPairError === undefined) || !!publicUserError

  const {
    id: mainUserId,
    publicKey: mainUserPublicKey,
    ...mainUser
  } = useUserPublic(addressLinkParams?.address)

  const { data: mainUserKeyPair, error } = useSWRImmutable(
    mainUserId ? ["mainUserKeyPair", mainUserId] : null,
    ([_, mainUserIdToGet]) => getKeyPairFromIdb(mainUserIdToGet)
  )

  const isMainUserKeyInvalid =
    !!error ||
    (!!mainUserId &&
      !!addressLinkParams?.userId &&
      mainUserId !== id &&
      mainUserKeyPair &&
      (mainUserPublicKey ?? (mainUser as any)?.signingKey) !==
        mainUserKeyPair.pubKey)

  useEffect(() => {
    if (isMainUserKeyInvalid) {
      setAddressLinkParams({ userId: null, address: null })
      deleteKeyPairFromIdb(mainUserId).then(() =>
        mutate(unstable_serialize(["shouldLinkToUser", id]))
      )
    }
  }, [isMainUserKeyInvalid])

  return (
    <KeyPairContext.Provider
      value={{
        ready,
        pubKey,
        keyPair,
        isValid,
        set: {
          ...setSubmitResponse,
          onSubmit: async (
            shouldLinkToUser: boolean,
            provider?: AddressConnectionProvider,
            reCaptchaToken?: string
          ) => {
            const body: SetKeypairPayload = { pubKey: undefined }

            if (reCaptchaToken) {
              body.verificationParams = {
                reCaptcha: reCaptchaToken,
              }
            }

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
              const userId = addressLinkParams?.userId

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
              const prevKeyPair = await getKeyPairFromIdb(id)
              body.addressConnectionProvider = "DELEGATE"
              body.pubKey = prevKeyPair?.pubKey ?? body.pubKey
            }

            return setSubmitResponse.onSubmit(body)
          },
        },
      }}
    >
      {children}
    </KeyPairContext.Provider>
  )
}

const useKeyPair = () => useContext(KeyPairContext)

export { KeyPairProvider, deleteKeyPairFromIdb, getKeyPairFromIdb, useKeyPair }
