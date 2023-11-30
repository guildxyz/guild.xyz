import { usePostHogContext } from "components/_app/PostHogProvider"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import useKeyPair, { keyPairsAtom } from "hooks/useKeyPair"
import { deleteKeyPairFromIdb, getKeyPairFromIdb } from "hooks/useSetKeyPair"
import useToast from "hooks/useToast"
import { useAtom } from "jotai"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"

const useUser = (
  userIdOrAddress?: number | string
): User & { isLoading: boolean; mutate: KeyedMutator<User>; error: any } => {
  const { address } = useWeb3ConnectionManager()
  const { id } = useUserPublic()
  const { keyPair } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const idToUse = userIdOrAddress ?? id

  const { data, mutate, isLoading, error } = useSWRImmutable<User>(
    (idToUse || address) && keyPair
      ? [`/v2/users/${idToUse}/profile`, { method: "GET", body: {} }]
      : null,
    fetcherWithSign,
    { shouldRetryOnError: false }
  )

  return {
    isLoading,
    ...data,
    mutate,
    error,
  }
}

const useUserPublic = (
  userIdOrAddress?: number | string
): User & { isLoading: boolean; mutate: KeyedMutator<User>; error: any } => {
  const { address, openWalletSelectorModal } = useWeb3ConnectionManager()
  const [, setKeys] = useAtom(keyPairsAtom)
  const { captureEvent } = usePostHogContext()
  const toast = useToast()

  const idToUse = userIdOrAddress ?? address

  const { data, mutate, isLoading, error } = useSWRImmutable<User>(
    idToUse ? `/v2/users/${idToUse}/profile` : null,
    async (url: string) => {
      const user = await fetcher(url)

      const keys = await getKeyPairFromIdb(user.id)

      if (keys) {
        if (keys.pubKey === user.publicKey) {
          setKeys((prev) => ({ ...prev, [user.id]: keys }))
        } else {
          await deleteKeyPairFromIdb(user.id)

          captureEvent("Invalid keypair", {
            userId: user.id,
            pubKey: keys.pubKey,
          })

          toast({
            status: "warning",
            title: "Session expired",
            description:
              "You've connected your account from a new device, so you have to sign a new message to stay logged in",
            duration: 5000,
          })

          openWalletSelectorModal()
        }
      }

      return user
    }
  )

  return {
    isLoading,
    ...data,
    mutate,
    error,
  }
}

export { useUserPublic }
export default useUser
