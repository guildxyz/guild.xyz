import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Guild, PlatformName } from "types"

const usePlatformUsageInfo = (
  platform: PlatformName,
  platformId: string
): {
  isAlreadyInUse: boolean
  isUsedInCurrentGuild: boolean
  guildUrlName?: string
  isValidating: boolean
} => {
  const { urlName } = useGuild()
  const shouldFetch = platformId?.length > 0
  const { data: guildByPlatform, isValidating } = useSWRWithOptionalAuth<
    Partial<Guild>
  >(shouldFetch ? `/v2/platforms/${platform}/guilds/${platformId}` : null, {
    shouldRetryOnError: false,
  })

  return {
    isAlreadyInUse: !!guildByPlatform?.id,
    isUsedInCurrentGuild: !!guildByPlatform && urlName === guildByPlatform.urlName,
    guildUrlName: guildByPlatform?.urlName,
    isValidating,
  }
}

export default usePlatformUsageInfo
