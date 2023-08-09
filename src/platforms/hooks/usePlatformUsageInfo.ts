import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import platforms, { PlatformUsageRestrictions } from "platforms/platforms"
import { Guild, PlatformName } from "types"

const usePlatformUsageInfo = (
  platform: PlatformName,
  platformId: string
): { isAlreadyInUse: boolean; guildUrlName?: string; isValidating: boolean } => {
  const { usageRestriction } = platforms[platform]

  const { id } = useGuild()

  // Not sure if it'll be a problem (API performance wise) that we call this endpoint here, but
  const shouldFetch = platformId?.length > 0
  const { data: guildByPlatform, isValidating } = useSWRWithOptionalAuth<
    Partial<Guild>
  >(
    shouldFetch ? `/platform/guild/${platform}/${platformId}` : null,
    { fallbackData: { id: null } },
    true
  )

  const isOnGuildsPage = id === guildByPlatform?.id
  const isAlreadyUsedInGuild = !isValidating && !!guildByPlatform?.id
  const isAlreadyInUse = !isOnGuildsPage
    ? isAlreadyUsedInGuild
    : !isAlreadyUsedInGuild
    ? false
    : usageRestriction === PlatformUsageRestrictions.SINGLE_ROLE &&
      guildByPlatform?.guildPlatforms?.some(
        (gp) => gp.platformGuildId === platformId
      )

  return {
    isAlreadyInUse,
    guildUrlName: guildByPlatform?.urlName,
    isValidating,
  }
}

export default usePlatformUsageInfo
