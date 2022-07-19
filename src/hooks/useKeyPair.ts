import { useWeb3React } from "@web3-react/core"
import { createStore, del, get, set } from "idb-keyval"
import useSWR, { mutate } from "swr"
import { User } from "types"
import { bufferToHex } from "utils/bufferUtils"
import fetcher, { useFetcherWithSign } from "utils/fetcher"
import useSubmit from "./useSubmit"
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
  chainId,
  provider,
  fetcherWithSign,
}) => {
  if (!account) {
    throw new Error("Connect a wallet first")
  }

  const generatedKeys = await generateKeyPair()

  const generatedPubKey = await window.crypto.subtle.exportKey(
    "raw",
    generatedKeys.publicKey
  )

  const generatedPubKeyHex = bufferToHex(generatedPubKey)
  const body = { pubKey: generatedPubKeyHex }

  const { userId } = await fetcherWithSign("/user/pubKey", {
    body,
    method: "POST",
    signOptions: {
      address: account,
      chainId,
      forcePrompt: true,
      provider,
      msg: "Please sign this message, so we can generate, and assign you a signing key pair. This is needed so you don't have to sign every Guild interaction.",
    },
  })

  await setKeyPairToIdb(userId, {
    keyPair: generatedKeys,
    pubKey: generatedPubKeyHex,
  })

  await mutate(`/user/${account}`)
  await mutateKeyPair()

  return generatedKeys
}

const checkKeyPair = (
  _: string,
  address: string,
  pubKey: string,
  userId: number
): Promise<[boolean, number]> =>
  fetcher("/user/checkPubKey", {
    method: "POST",
    body: { address, pubKey },
  }).then((result) => [result, userId])

const useKeyPair = () => {
  const { account, chainId, provider } = useWeb3React()
  /**
   * Calling useUser causes an infinite call stack, this will be reslved once the
   * keypair is fully integrated
   */
  const { data: user, error: userError } = useSWR<User>(
    account ? `/user/${account}` : null
  )

  /*
  const prevUser = usePrevious(user)

  useEffect(() => {
    console.log({ user, prevUser })
    if (
      typeof user?.id === "number" &&
      typeof prevUser?.id === "number" &&
      user?.id !== prevUser?.id &&
      prevUser?.addresses?.every?.((address) => user?.addresses?.includes(address))
    ) {
      console.log("Hello")
      get<StoredKeyPair>(prevUser.id, getStore()).then(
        (prevKeys) =>
          prevKeys &&
          set(user.id, prevKeys, getStore()).then(() =>
            del(prevUser.id, getStore()).then(() => mutateKeyPair())
          )
      )
    }
  }, [user, prevUser]) */

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

  const fetcherWithSign = useFetcherWithSign(keyPair)

  const toast = useToast()

  useSWR(
    keyPair && user?.id ? ["isKeyPairValid", account, pubKey, user?.id] : null,
    checkKeyPair,
    {
      onSuccess: ([isValid, userId]) => {
        if (!isValid) {
          toast({
            status: "error",
            title: "Invalid signing key",
            description:
              "Browser's signing key is invalid, please generate a new one",
          })

          deleteKeyPairFromIdb(userId).then(() => {
            mutateKeyPair({ pubKey: undefined, keyPair: undefined })
          })
        }
      },
    }
  )

  // useEffect(() => {
  //   if (user?.id) {
  //     mutateKeyPair()
  //   }
  // }, [user?.id])

  const setSubmitResponse = useSubmit(() =>
    setKeyPair({ account, mutateKeyPair, chainId, provider, fetcherWithSign })
  )
  // const removeSubmitResponse = useSubmit(() =>
  //   removeKeyPair({ userId: user?.id, mutateKeyPair })
  // )

  const ready = !(keyPair === undefined && keyPairError === undefined) || !!userError

  return {
    ready,
    pubKey,
    keyPair,
    set: setSubmitResponse,
    // remove: removeSubmitResponse,
  }
}

export { getKeyPairFromIdb, setKeyPairToIdb, deleteKeyPairFromIdb }
export default useKeyPair
