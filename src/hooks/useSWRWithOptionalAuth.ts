import { useWeb3React } from "@web3-react/core"
import useSWR, { mutate, SWRResponse, unstable_serialize } from "swr"
import useSWRImmutable from "swr/immutable"
import { useFetcherWithSign } from "utils/fetcher"
import useKeyPair from "./useKeyPair"

type SWRSettings = Parameters<typeof useSWR>[2]

const useSWRWithOptionalAuth = <Data = any, Error = any>(
  url: string | null,
  options: SWRSettings = {},
  isMutable = false,
  onlyAuthRequest = true
): SWRResponse<Data, Error> => {
  const useSWRHook = isMutable ? useSWR : useSWRImmutable

  const { account } = useWeb3React()
  const { keyPair, isValid, ready } = useKeyPair()

  const shouldSendAuth = !!keyPair && ready && isValid && !!account

  const fetcherWithSign = useFetcherWithSign()
  const authenticatedResponse = useSWRHook<Data, Error, any>(
    url && shouldSendAuth ? [url, { method: "GET", body: {} }] : null,
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
    mutate: authenticatedResponse.mutate ?? publicResponse.mutate,
    error: authenticatedResponse.error ?? publicResponse.error,
  }
}

/**
 * We could do a mutate(url) here as well, but I removed it as it seemed unnecessary,
 * since the user is already authenticated, when we call this.
 */
const mutateOptionalAuthSWRKey = (url: string) =>
  mutate(unstable_serialize([url, { method: "GET", body: {} }]))

export { mutateOptionalAuthSWRKey }
export default useSWRWithOptionalAuth
