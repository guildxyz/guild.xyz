import { useWeb3React } from "@web3-react/core"
import useKeyPair from "hooks/useKeyPair"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const usePublicKey = (userId?: number) => {
  const { id } = useUserPublic()

  const idToUse = userId ?? id

  const { data, mutate, error, isLoading, isValidating } = useSWRImmutable<string>(
    idToUse ? `/v2/users/${idToUse}/public-key` : null,
    { shouldRetryOnError: false }
  )
  return {
    publicKey: data,
    mutate,
    error,
    isLoading,
    isValidating,
  }
}

const useUser = (
  userIdOrAddress?: number | string
): User & { isLoading: boolean; mutate: KeyedMutator<User>; error: any } => {
  const { id } = useUserPublic()
  const { keyPair, ready, isValid } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()

  const idToUse = userIdOrAddress ?? id

  const { data, mutate, isLoading, error } = useSWRImmutable<User>(
    idToUse && ready && keyPair && isValid
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
  const { account } = useWeb3React()

  const idToUse = userIdOrAddress ?? account

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

export { usePublicKey, useUserPublic }
export default useUser
