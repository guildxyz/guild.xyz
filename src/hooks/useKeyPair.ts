import { datadogRum } from "@datadog/browser-rum"
import { useRumAction, useRumError } from "@datadog/rum-react-integration"
import { useWeb3React } from "@web3-react/core"
import { createStore, del, get, set } from "idb-keyval"
import useSWR, { KeyedMutator, mutate } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { bufferToHex } from "utils/bufferUtils"
import fetcher from "utils/fetcher"
import { Validation } from "./useSubmit"
import { useSubmitWithSignWithParamKeyPair } from "./useSubmit/useSubmit"
import useToast from "./useToast"

type StoredKeyPair = {
  keyPair: CryptoKeyPair
  pubKey: string
}

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

    try {
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
  } catch (error) {
    if (error?.code !== 4001) {
      datadogRum.addError(`Keypair generation error`, {
        error: error?.message || error?.toString?.() || error,
      })
    }
    throw error
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
  generatedKeyPair,
}: {
  account: string
  validation: Validation
  mutateKeyPair: KeyedMutator<StoredKeyPair>
  generatedKeyPair: StoredKeyPair
}) => {
  const { userId } = await fetcher("/user/pubKey", {
    body: {
      pubKey: generatedKeyPair.pubKey,
    },
    validation,
    method: "POST",
  })

  /**
   * This rejects, when IndexedDB is not available, like in Firefox private window.
   * Ignoring this error is fine, since we are falling back to just storing it in
   * memory.
   */
  await setKeyPairToIdb(userId, generatedKeyPair).catch(() => {})

  await mutate(`/user/${account}`)
  await mutateKeyPair()

  return generatedKeyPair
}

const checkKeyPair = (_: string, savedPubKey: string, pubKey: string): boolean =>
  savedPubKey === pubKey

const useKeyPair = () => {
  // Using the defauld Datadog implementation here, so the useDatadog, useUser, and useKeypair hooks don't call each other
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

  const { data: generatedKeyPair } = useSWRImmutable(
    "generatedKeyPair",
    generateKeyPair,
    {
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
        }
      },
    }
  )

  const setSubmitResponse = useSubmitWithSignWithParamKeyPair<
    StoredKeyPair,
    StoredKeyPair
  >(
    ({ validation }) =>
      setKeyPair({ account, mutateKeyPair, validation, generatedKeyPair }),
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
      onSuccess: () => mutateKeyPair(generatedKeyPair),
    }
  )

  const ready = !(keyPair === undefined && keyPairError === undefined) || !!userError

  return {
    ready,
    pubKey,
    keyPair,
    isValid,
    set: setSubmitResponse,
  }
}

const manageKeyPairAfterUserMerge = async (fetcherWithSign, prevUser, account) => {
  try {
    const [prevKeys, newUser] = await Promise.all([
      getKeyPairFromIdb(prevUser?.id),
      fetcherWithSign(`/user/details/${account}`, {
        method: "POST",
        body: {},
      }) as Promise<User>,
    ])

    if (prevUser?.id !== newUser?.id && !!prevKeys) {
      await Promise.all([
        setKeyPairToIdb(newUser?.id, prevKeys),
        mutate(["keyPair", newUser?.id], prevKeys),
        mutate(["isKeyPairValid", account, prevKeys.pubKey, newUser?.id], true),
        mutate([`/user/details/${account}`, { method: "POST", body: {} }]),
        deleteKeyPairFromIdb(prevUser?.id),
      ])
    }
  } catch {}
}

export {
  getKeyPairFromIdb,
  setKeyPairToIdb,
  deleteKeyPairFromIdb,
  manageKeyPairAfterUserMerge,
}
export default useKeyPair
