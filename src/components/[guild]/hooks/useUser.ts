import { useKeyPair } from "components/_app/KeyPairProvider"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import { useAccount } from "wagmi"

const useUser = (
  userIdOrAddress?: number | string
): User & { isLoading: boolean; mutate: KeyedMutator<User>; error: any } => {
  const { address } = useAccount()
  const { id } = useUserPublic()
  const { keyPair, ready, isValid } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const idToUse = userIdOrAddress ?? id

  const { data, mutate, isLoading, error } = useSWRImmutable<User>(
    (idToUse || address) && ready && keyPair && isValid
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
  const { address } = useAccount()

  const idToUse = userIdOrAddress ?? address

  const { data, mutate, isLoading, error } = useSWRImmutable<User>(
    idToUse ? `/v2/users/${idToUse}/profile` : null
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
