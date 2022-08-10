import useSWR, { SWRConfiguration } from "swr"
import { PlatformName } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useKeyPair from "./useKeyPair"

const useGateables = (platformName: PlatformName, swrConfig?: SWRConfiguration) => {
  const { keyPair } = useKeyPair()

  const fetcherWithSign = useFetcherWithSign()

  const shouldFetch = !!keyPair && platformName?.length > 0

  const { data, isValidating, mutate, error } = useSWR(
    shouldFetch
      ? ["/guild/listGateables", { method: "POST", body: { platformName } }]
      : null,
    (url: string, options) =>
      fetcherWithSign(url, options).then((body) => {
        if ("errorMsg" in body) {
          throw body
        }
        return body ?? []
      }),
    swrConfig
  )

  return {
    gateables: data,
    isLoading: !data && !error && isValidating,
    mutate,
    error,
  }
}

export default useGateables
