import useUser from "components/[guild]/hooks/useUser"
import useSWR, { SWRConfiguration } from "swr"
import { GoogleFile, PlatformType } from "types"
import { useFetcherWithSign } from "utils/fetcher"
import { useKeyPair } from "../components/_app/KeyPairProvider"

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
  [PlatformType.GOOGLE]: Array<GoogleFile>
} & Record<PlatformType, unknown>

const platformsWithoutGateables: PlatformType[] = [PlatformType.TELEGRAM]

const useGateables = <K extends keyof Gateables>(
  platformId: K,
  swrConfig?: SWRConfiguration
) => {
  const { keyPair } = useKeyPair()

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

  const { data, isLoading, mutate, error } = useSWR<Gateables[K]>(
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
      ...swrConfig,
    }
  )

  return {
    gateables: data,
    isLoading,
    mutate,
    error,
  }
}

export default useGateables
