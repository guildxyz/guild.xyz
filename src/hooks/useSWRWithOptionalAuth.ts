import { useWeb3ConnectionManager } from "@/components/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import { useUserPublic } from "@/hooks/useUserPublic"
import { useFetcherWithSign } from "hooks/useFetcherWithSign"
import useSWR, { mutate, MutatorOptions, SWRResponse, unstable_serialize } from "swr"
import useSWRImmutable from "swr/immutable"
import { useGetKeyForSWRWithOptionalAuth } from "./useGetKeyForSWRWithOptionalAuth"

type SWRSettings = Parameters<typeof useSWR>[2]

const useSWRWithOptionalAuth = <Data = any, Error = any>(
  url: string | null,
  options: SWRSettings = {},
  isMutable = false,
  onlyAuthRequest = true
): SWRResponse<Data, Error> & { isSigned: boolean } => {
  const useSWRHook = isMutable ? useSWR : useSWRImmutable

  const { isWeb3Connected } = useWeb3ConnectionManager()
  const { keyPair } = useUserPublic()
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  const shouldSendAuth = !!keyPair && isWeb3Connected

  const fetcherWithSign = useFetcherWithSign()
  const authenticatedResponse = useSWRHook<Data, Error, any>(
    url && shouldSendAuth ? getKeyForSWRWithOptionalAuth(url) : null,
    fetcherWithSign,
    options as any
  )

  const publicResponse = useSWRImmutable<Data, Error, any>(
    url && !onlyAuthRequest && !authenticatedResponse.data ? url : null,
    options as any
  )

  return {
    data: authenticatedResponse.data ?? publicResponse.data,
    isLoading: authenticatedResponse.isLoading ?? publicResponse.isLoading,
    isValidating: authenticatedResponse.isValidating ?? publicResponse.isValidating,
    mutate: async (...args) => {
      const [mutatedAuthenticatedData, mutatedPublicData] = await Promise.all([
        authenticatedResponse.mutate(...args),
        publicResponse.mutate(...args),
      ])

      return mutatedAuthenticatedData ?? mutatedPublicData
    },
    error: authenticatedResponse.error ?? publicResponse.error,
    isSigned: !!authenticatedResponse.data,
  }
}

/**
 * We could do a mutate(url) here as well, but I removed it as it seemed unnecessary,
 * since the user is already authenticated, when we call this.
 */
const useMutateOptionalAuthSWRKey = () => {
  const getKeyForSWRWithOptionalAuth = useGetKeyForSWRWithOptionalAuth()

  return <Data>(
    url: string,
    mutator?: (prevData: Data) => Data,
    options?: MutatorOptions<Data>
  ) =>
    mutate<Data>(
      unstable_serialize(getKeyForSWRWithOptionalAuth(url)),
      mutator,
      options
    )
}

export { useMutateOptionalAuthSWRKey }
export default useSWRWithOptionalAuth
