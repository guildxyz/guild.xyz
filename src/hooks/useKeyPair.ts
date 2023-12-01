import { useUserPublic } from "components/[guild]/hooks/useUser"
import { atom, useAtom } from "jotai"
import { useMemo } from "react"
import { StoredKeyPair } from "./useSetKeyPair"

export const keyPairsAtom = atom({} as Record<string, StoredKeyPair>)

const useKeyPair = () => {
  const [keys, setKeys] = useAtom(keyPairsAtom)
  const { id, publicKey, error } = useUserPublic()

  /*
   * undefined -> We haven't fetched the data yet (loading state)
   * null -> We fetched the data, and it shows that the user needs to verify (either no key exists, or it is invalid)
   * string / CryptoKeyPair instance -> A valid keypair, which is in sync with the backend state, therefore usable for authenticationg requests
   */
  const keysOfUser = useMemo(() => {
    if (error || (!!id && !publicKey)) return { pubKey: null, keyPair: null }
    if (!id) return { pubKey: undefined, keyPair: undefined }
    if (keys[id]?.pubKey && keys[id].pubKey === publicKey) return keys[id]
    return { pubKey: null, keyPair: null }
  }, [id, keys, publicKey, error])

  return {
    ...keysOfUser,
    deleteKeyOfUser: () => setKeys((prev) => ({ ...prev, [id]: undefined })),
  }
}

export default useKeyPair
