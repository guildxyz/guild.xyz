import { useWeb3React } from "@web3-react/core"
import { createStore, del, get, set } from "idb-keyval"
import useSWR from "swr"
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

const getKeyPair = async (_: string, account: string) => {
  if (!account) {
    throw new Error("Connect a wallet first")
  }

  const keyPairAndPubKey = await get<StoredKeyPair>(account, getStore())

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
    "jwk",
    generatedKeys.publicKey
  )
  // console.log(generatedPubKey)
  // const generatedPubKeyString = bufferToHex(generatedPubKey)
  // console.log(generatedPubKeyString)

  const payload = { pubKey: JSON.stringify(generatedPubKey) }

  const validationData = await sign({
    address: account,
    chainId,
    forcePrompt: true,
    payload,
    provider,
  }).catch((error) => {
    console.log(error)
    throw error
  })

  const result = await fetcher("/user/pubKey", {
    body: { payload, ...validationData },
    method: "POST",
  }).catch((error) => {
    console.log(error)
    throw error
  })

  console.log("fetcher result", result)

  await set(
    account,
    { keyPair: generatedKeys, pubKey: JSON.stringify(generatedPubKey) },
    getStore()
  )

  await mutateKeyPair()

  return generatedKeys
}

const removeKeyPair = async ({ account, mutateKeyPair }) => {
  if (!account) {
    throw new Error("Connect a wallet first")
  }

  await del(account, getStore())
  await mutateKeyPair()

  // TODO: call backend DELETE /keypair endpoint
}

const useKeyPair = () => {
  const { account, chainId, provider } = useWeb3React()

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

  const setSubmitResponse = useSubmit(() =>
    setKeyPair({ account, mutateKeyPair, chainId, provider })
  )
  const removeSubmitResponse = useSubmit(() =>
    removeKeyPair({ account, mutateKeyPair })
  )

  return {
    ready: !(keyPair === undefined && keyPairError === undefined),
    pubKey,
    keyPair,
    set: setSubmitResponse,
    remove: removeSubmitResponse,
  }
}

export default useKeyPair
