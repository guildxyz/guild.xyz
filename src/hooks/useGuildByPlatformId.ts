import useSWR from "swr"
import { Guild, PlatformName } from "types"

const useGuildByPlatformId = (platform: PlatformName, platformId: string) => {
  const shouldFetch = platformId?.length > 0
  const { data, error, isValidating } = useSWR<Partial<Guild>>(
    shouldFetch ? `/platform/guild/${platform}/${platformId}` : null,
    { fallbackData: { id: null } }
  )

  return { ...data, isLoading: !data && !error && isValidating }
}

export default useGuildByPlatformId
