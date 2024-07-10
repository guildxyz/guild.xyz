import { walletSelectorModalAtom } from "@/components/Providers/atoms"
import { useToast } from "@/components/ui/hooks/useToast"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { PublicUserProfile } from "@guildxyz/types"
import { useSetAtom } from "jotai"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import {
  deleteKeyPairFromIdb,
  getKeyPairFromIdb,
  StoredKeyPair,
} from "utils/keyPair"

type PublicUser = PublicUserProfile & { keyPair?: StoredKeyPair }

// We don't open WaletSelectorModal on these routes
const IGNORED_ROUTES = [
  "/_error",
  "/tgauth",
  "/oauth",
  "/googleauth",
  "/oauth-result",
]

export function useUserPublic(userIdOrAddress?: number | string): PublicUser & {
  isLoading: boolean
  mutate: KeyedMutator<PublicUser>
  error: any
  deleteKeys: () => Promise<void>
  setKeys: (keyPair: StoredKeyPair) => Promise<void>
} {
  const { address } = useWeb3ConnectionManager()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const { toast } = useToast()

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

          // TODO: we can't really use PostHog here because it causes circular imports
          // captureEvent("Invalid keypair", {
          //   userId: user.id,
          //   pubKey: keys.pubKey,
          //   savedPubKey: user.publicKey,
          // })

          toast({
            variant: "warning",
            title: "Session expired",
            description:
              "You've connected your account from a new device, so you have to sign a new message to stay logged in",
            duration: 5000,
          })
        }
      }

      // If we didn't set the keyPair field, the user either doesn't have one locally, or has an invalid one

      // if (!user.keyPair && !ignoredRoutes.includes(router.route)) {
      //   setIsWalletSelectorModalOpen(true)
      // }

      /**
       * TODO: We use window.location.href because useRouter (from next/router) won't
       * work in the app directory. We should use useRouter from next/navigation once
       * we migrate everything to the app router.
       */
      if (!user.keyPair && !IGNORED_ROUTES.includes(window.location.pathname)) {
        setIsWalletSelectorModalOpen(true)
      }

      return user
    },
    {
      shouldRetryOnError: false,
      onError: () => {
        setIsWalletSelectorModalOpen(true)
      },
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
