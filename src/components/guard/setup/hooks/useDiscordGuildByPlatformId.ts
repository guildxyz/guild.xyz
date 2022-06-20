import useSWR from "swr"
import { Guild } from "types"

const useDiscordGuildByPlatformId = (platformId: string) => {
  const shouldFetch = platformId?.length > 0
  const { data } = useSWR<Partial<Guild>>(
    shouldFetch ? `/guild/platform/DISCORD/${platformId}` : null,
    { fallbackData: { id: null } }
  )

  return data
}

export default useDiscordGuildByPlatformId
