import { useWeb3React } from "@web3-react/core"
import { createStore, del, get, set } from "idb-keyval"
import useSWR from "swr"
import useSubmit from "./useSubmit"

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

const getKeyPair = async (_: string, account: string) => {
  if (!account) {
    throw new Error("Connect a wallet first")
  }

  const keyPair = await get<CryptoKeyPair>(
    account,
    createStore("guild.xyz", "signingKeyPairs")
  )

  if (keyPair === undefined) {
    return {
      keyPair: null,
      pubKeyString: null,
    }
  }

  const pubKey = await window.crypto.subtle.exportKey("raw", keyPair.publicKey)
  const pubKeyString = Buffer.from(pubKey).toString("hex")

  return { pubKey: pubKeyString, keyPair }
}

const useSigningKeys = () => {
  const { account } = useWeb3React()

  const {
    data: { keyPair, pubKey },
    mutate: mutateKeyPair,
    error: keyPairError,
  } = useSWR(!!account ? ["keyPair", account] : null, getKeyPair, {
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    fallbackData: { pubKey: undefined, keyPair: undefined },
  })

  const addKey = async () => {
    if (!account) {
      throw new Error("Connect a wallet first")
    }

    const generatedKeys = await generateKeyPair()

    // TODO: call backend POST /keypair endpoint

    await set(account, generatedKeys, createStore("guild.xyz", "signingKeyPairs"))

    await mutateKeyPair()

    return generatedKeys
  }

  const removeKey = async () => {
    if (!account) {
      throw new Error("Connect a wallet first")
    }

    await del(account, createStore("guild.xyz", "signingKeyPairs"))
    await mutateKeyPair()

    // TODO: call backend DELETE /keypair endpoint
  }

  const addKeyPair = useSubmit(addKey)
  const removeKeyPair = useSubmit(removeKey)

  return {
    ready: !(keyPair === undefined && keyPairError === undefined),
    pubKey,
    keyPair,
    addKeyPair,
    removeKeyPair,
  }
}

export default useSigningKeys
