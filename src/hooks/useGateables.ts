import useUser from "components/[guild]/hooks/useUser"
import useSWR, { SWRConfiguration } from "swr"
import { PlatformType } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import useKeyPair from "./useKeyPair"

type Gateables = {
  [PlatformType.DISCORD]: Array<{
    img: string
    name: string
    owner: boolean
    id: string
  }>
  [PlatformType.GITHUB]: Array<{
    avatarUrl: string
    description?: string
    platformGuildId: string
    repositoryName: string
    url: string
  }>
} & Record<PlatformType, unknown>

const platformsWithoutGateables: PlatformType[] = [PlatformType.TELEGRAM]

const useGateables = <K extends keyof Gateables>(
  platformId: K,
  swrConfig?: SWRConfiguration
) => {
  const { keyPair } = useKeyPair()

  const { platformUsers } = useUser()
  const isConnected = !!platformUsers?.some(
    (platformUser) => platformUser.platformName === PlatformType[platformId]
  )

  const fetcherWithSign = useFetcherWithSign()

  const shouldFetch =
    isConnected &&
    !!keyPair &&
    platformId &&
    !platformsWithoutGateables.includes(platformId)

  const { data, isValidating, mutate, error } = useSWR<Gateables[K]>(
    shouldFetch
      ? [
          "/guild/listGateables",
          { method: "POST", body: { platformName: PlatformType[platformId] } },
        ]
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
