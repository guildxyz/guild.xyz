import { useWeb3React } from "@web3-react/core"
import { createStore, del, get, set } from "idb-keyval"
import { useEffect } from "react"
import useSWR, { mutate } from "swr"
import { User } from "types"
import { bufferToHex } from "utils/bufferUtils"
import fetcher from "utils/fetcher"
import useSubmit, { sign } from "./useSubmit"

type StoredKeyPair = {
  keyPair: CryptoKeyPair
  pubKey: string
}

const getStore = () => createStore("guild.xyz", "signingKeyPairs")

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
    throw new Error("Generating a key pair is unsupported in this browser.")
  }
}

const getKeyPair = async (_: string, id: string) => {
  const keyPairAndPubKey = await get<StoredKeyPair>(id, getStore())

  if (keyPairAndPubKey === undefined) {
    return {
      keyPair: null,
      pubKey: null,
    }
  }

  return keyPairAndPubKey
}

const setKeyPair = async ({ account, mutateKeyPair, chainId, provider }) => {
  if (!account) {
    throw new Error("Connect a wallet first")
  }

  const generatedKeys = await generateKeyPair()

  const generatedPubKey = await window.crypto.subtle.exportKey(
    "raw",
    generatedKeys.publicKey
  )

  const generatedPubKeyHex = bufferToHex(generatedPubKey)
  const payload = { pubKey: generatedPubKeyHex }

  const validationData = await sign({
    address: account,
    chainId,
    forcePrompt: true,
    payload,
    provider,
  })

  const { userId } = await fetcher("/user/pubKey", {
    body: { payload, ...validationData },
    method: "POST",
  })

  await set(
    userId,
    { keyPair: generatedKeys, pubKey: generatedPubKeyHex },
    getStore()
  )

  await mutate(`/user/${account}`)
  await mutateKeyPair()

  return generatedKeys
}

const removeKeyPair = async ({ userId, mutateKeyPair }) => {
  await del(userId, getStore())
  await mutateKeyPair()

  // TODO: call backend DELETE /keypair endpoint
}

const useKeyPair = () => {
  const { account, chainId, provider } = useWeb3React()
  /**
   * Calling useUser causes an infinite call stack, this will be reslved once the
   * keypair is fully integrated
   */
  const { data: user, error: userError } = useSWR<User>(`/user/${account}`, null, {
    fallbackData: null,
  })

  const {
    data: { keyPair, pubKey },
    mutate: mutateKeyPair,
    error: keyPairError,
  } = useSWR(!!user?.id ? ["keyPair", user?.id] : null, getKeyPair, {
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    fallbackData: { pubKey: undefined, keyPair: undefined },
  })

  useEffect(() => {
    if (user?.id) {
      mutateKeyPair()
    }
  }, [user?.id])

  const setSubmitResponse = useSubmit(() =>
    setKeyPair({ account, mutateKeyPair, chainId, provider })
  )
  const removeSubmitResponse = useSubmit(() =>
    removeKeyPair({ userId: user?.id, mutateKeyPair })
  )

  const ready = !(keyPair === undefined && keyPairError === undefined) || !!userError

  return {
    ready,
    pubKey,
    keyPair,
    set: setSubmitResponse,
    remove: removeSubmitResponse,
  }
}

export default useKeyPair
