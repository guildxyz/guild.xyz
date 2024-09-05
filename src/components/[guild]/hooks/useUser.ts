import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useUserPublic } from "@/hooks/useUserPublic"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import { useGetKeyForSWRWithOptionalAuth } from "hooks/useGetKeyForSWRWithOptionalAuth"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { StoredKeyPair } from "utils/keyPair"

const useUser = (
  userIdOrAddress?: number | string
): User & { isLoading: boolean; mutate: KeyedMutator<User>; error: any } => {
  const { identifyUser } = usePostHogContext()
  const { address } = useWeb3ConnectionManager()
  const { id, keyPair } = useUserPublic()

  const fetcherWithSign = useFetcherWithSign()
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const idToUse = userIdOrAddress ?? id

  const { data, mutate, isLoading, error } = useSWRImmutable<User>(
    (idToUse || address) && keyPair
      ? getKeyForSWRWithOptionalAuth(`/v2/users/${idToUse}/profile`)
      : null,
    fetcherWithSign,
    {
      shouldRetryOnError: false,
      onSuccess: (userData) => identifyUser(userData),
    }
  )

  return {
    isLoading,
    ...data,
    mutate,
    error,
  }
}

export type PublicUser = {
  id: number
  publicKey?: string
  captchaVerifiedSince?: string
  keyPair?: StoredKeyPair
}

export default useUser
