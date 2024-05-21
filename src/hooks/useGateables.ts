import { DiscordGateable, GitHubGateable, GoogleGateable } from "@guildxyz/types"
import useUser, { useUserPublic } from "components/[guild]/hooks/useUser"
import useSWR, { SWRConfiguration } from "swr"
import { PlatformType } from "types"
import { useFetcherWithSign } from "utils/fetcher"

export type Gateables = {
  [PlatformType.DISCORD]: Array<DiscordGateable>
  [PlatformType.GITHUB]: Array<GitHubGateable>
  [PlatformType.GOOGLE]: Array<GoogleGateable>
} & Record<PlatformType, unknown>

const platformsWithoutGateables: PlatformType[] = [PlatformType.TELEGRAM]

const useGateables = <K extends keyof Gateables>(
  platformId: K,
  swrConfig?: SWRConfiguration
) => {
  const { keyPair } = useUserPublic()

  const { platformUsers, id: userId } = useUser()
  const isConnected = !!platformUsers?.some(
    (platformUser) => platformUser.platformName === PlatformType[platformId]
  )

  const fetcherWithSign = useFetcherWithSign()

  const shouldFetch =
    isConnected &&
    !!keyPair &&
    platformId &&
    !platformsWithoutGateables.includes(platformId)

  const { data, isLoading, mutate, error, isValidating } = useSWR<Gateables[K]>(
    shouldFetch
      ? [
          `/v2/users/${userId}/platforms/${PlatformType[platformId]}/gateables`,
          { method: "GET" },
        ]
      : null,
    (props) =>
      fetcherWithSign(props).then((body) => {
        if ("errorMsg" in body) {
          throw body
        }
        return body ?? []
      }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateIfStale: false,
      ...swrConfig,
    }
  )

  return {
    gateables: data,
    isLoading,
    mutate,
    error,
    isValidating,
  }
}

export default useGateables
