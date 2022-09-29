import useUser from "components/[guild]/hooks/useUser"
import useSWR, { SWRConfiguration } from "swr"
import { PlatformName } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useKeyPair from "./useKeyPair"

const useGateables = <Gateables>(
  platformName: PlatformName,
  swrConfig?: SWRConfiguration
) => {
  const { keyPair } = useKeyPair()

  const { platformUsers } = useUser()
  const isConnected = !!platformUsers?.some(
    (platformUser) => platformUser.platformName === platformName
  )

  const fetcherWithSign = useFetcherWithSign()

  const shouldFetch = isConnected && !!keyPair && platformName?.length > 0

  const { data, isValidating, mutate, error } = useSWR<Gateables>(
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
