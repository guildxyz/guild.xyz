import { useRouter } from "next/router"
import useSWRImmutable from "swr/immutable"
import { Guild, Hall, PlatformName } from "temporaryData/types"

type ExtendedGuildType = Guild & { guildId: number; groupId: number }

const useHallWithSortedGuilds = (): Hall & {
  sortedGuilds: Record<PlatformName, Record<string, Array<ExtendedGuildType>>>
} => {
  const router = useRouter()

  const { data } = useSWRImmutable(`/group/urlName/${router.query.hall}`)

  // Sorting guilds by platform
  const originalGuilds = [...data?.guilds]

  // Defining a new prop on the data object
  data.sortedGuilds = {
    DISCORD: {},
    TELEGRAM: {},
  }

  originalGuilds.forEach((guildData) => {
    if (!guildData.guild.guildPlatforms?.[0]?.platformId) return

    const platformName =
      guildData.guild.guildPlatforms[0].name === "DISCORD_CUSTOM"
        ? "DISCORD"
        : guildData.guild.guildPlatforms[0].name
    const platformId = guildData.guild.guildPlatforms[0].platformId.toString()

    if (Array.isArray(data.sortedGuilds[platformName][platformId])) {
      data.sortedGuilds[platformName][platformId].push(guildData.guild)
    } else {
      data.sortedGuilds[platformName][platformId] = [guildData.guild]
    }
  })

  return data
}

export default useHallWithSortedGuilds
