import useUser from "components/[guild]/hooks/useUser"
import useSWR, { SWRConfiguration } from "swr"
import { PlatformName } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useKeyPair from "./useKeyPair"

type Gateables = {
  DISCORD: Array<{ img: string; name: string; owner: boolean; id: string }>
  GITHUB: Array<{
    avatarUrl: string
    description?: string
    platformGuildId: string
    repositoryName: string
    url: string
  }>
} & Record<PlatformName, unknown>

const useGateables = <K extends keyof Gateables>(
  platformName: K,
  swrConfig?: SWRConfiguration
) => {
  const { keyPair } = useKeyPair()

  const { platformUsers } = useUser()
  const isConnected = !!platformUsers?.some(
    (platformUser) => platformUser.platformName === platformName
  )

  const fetcherWithSign = useFetcherWithSign()

  const shouldFetch = isConnected && !!keyPair && platformName?.length > 0

  const { data, isValidating, mutate, error } = useSWR<Gateables[K]>(
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
