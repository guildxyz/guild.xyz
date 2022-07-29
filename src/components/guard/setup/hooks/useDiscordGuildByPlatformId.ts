import useSWR from "swr"
import { Guild } from "types"

const useGuildByPlatformId = (platform: string, platformId: string) => {
  const shouldFetch = platformId?.length > 0
  const { data } = useSWR<Partial<Guild>>(
    shouldFetch ? `/guild/platform/${platform}/${platformId}` : null,
    { fallbackData: { id: null } }
  )

  return data
}

export default useGuildByPlatformId
