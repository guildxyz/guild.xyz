import { usePostHogContext } from "components/_app/PostHogProvider"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import {
  StoredKeyPair,
  deleteKeyPairFromIdb,
  getKeyPairFromIdb,
} from "hooks/useSetKeyPair"
import useToast from "hooks/useToast"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import fetcher, { useFetcherWithSign } from "utils/fetcher"

const useUser = (
  userIdOrAddress?: number | string
): User & { isLoading: boolean; mutate: KeyedMutator<User>; error: any } => {
  const { address } = useWeb3ConnectionManager()
  const { id } = useUserPublic()
  const { keyPair } = useUserPublic()
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

type PublicUser = {
  id: number
  publicKey?: string
  captchaVerifiedSince?: string
  keyPair?: StoredKeyPair
}

const useUserPublic = (
  userIdOrAddress?: number | string
): PublicUser & {
  isLoading: boolean
  mutate: KeyedMutator<PublicUser>
  error: any
  deleteKeys: () => Promise<void>
  setKeys: (keyPair: StoredKeyPair) => Promise<void>
} => {
  const { address, openWalletSelectorModal } = useWeb3ConnectionManager()
  const { captureEvent } = usePostHogContext()
  const toast = useToast()

  const idToUseRaw = userIdOrAddress ?? address
  const idToUse =
    typeof idToUseRaw === "string" ? idToUseRaw.toLowerCase() : idToUseRaw

  const { data, mutate, isLoading, error } = useSWRImmutable<PublicUser>(
    idToUse ? `/v2/users/${idToUse}/profile` : null,
    async (url: string) => {
      const user: PublicUser = await fetcher(url)

      const keys = await getKeyPairFromIdb(user.id)

      if (keys) {
        if (keys.pubKey === user.publicKey) {
          user.keyPair = keys
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
    deleteKeys: async () => {
      await mutate((prev) => ({ ...prev, keyPair: undefined }), {
        revalidate: false,
      })
    },
    setKeys: async (keyPair: StoredKeyPair) => {
      await mutate((prev) => ({ ...prev, keyPair }), { revalidate: false })
    },
    mutate,
    error,
  }
}

export { useUserPublic }
export default useUser
