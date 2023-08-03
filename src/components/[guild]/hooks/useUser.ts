import { useWeb3React } from "@web3-react/core"
import useIsV2 from "hooks/useIsV2"
import useKeyPair from "hooks/useKeyPair"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"
import { User } from "types"
import { useFetcherWithSign } from "utils/fetcher"

const useUser = (
  userIdOrAddress?: number | string
): User & { isLoading: boolean; mutate: KeyedMutator<User>; error: any } => {
  const { account } = useWeb3React()
  const { id } = useUserPublic()
  const { keyPair, ready, isValid } = useKeyPair()
  const fetcherWithSign = useFetcherWithSign()
  const isV2 = useIsV2()

  const idToUse = userIdOrAddress ?? id

  const { data, mutate, isLoading, error } = useSWRImmutable<User>(
    ((isV2 && idToUse) || account) && ready && keyPair && isValid
      ? [
          isV2 ? `/v2/users/${idToUse}/profile` : `/user/${account}`,
          { method: "GET", body: {} },
        ]
      : null,
    fetcherWithSign,
    isV2 ? { shouldRetryOnError: false } : undefined
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
  const isV2 = useIsV2()

  const { data, mutate, isLoading, error } = useSWRImmutable<User>(
    idToUse
      ? isV2
        ? `/v2/users/${idToUse}/profile`
        : `/user/${userIdOrAddress ?? account}`
      : null
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
