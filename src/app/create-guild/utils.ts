import { Guild, GuildReward, Role } from "@guildxyz/types"
import { env } from "env"
import { unstable_cache } from "next/cache"
import fetcher from "utils/fetcher"
import { GUILD_TEMPLATES_CACHE_KEY, TEMPLATE_GUILD_URL_NAMES } from "./constants"
import { GuildTemplate } from "./types"

const fetcherOptions = {
  headers: {
    "x-guild-service": "APP",
    "x-guild-auth": env.GUILD_API_KEY,
  },
} satisfies Parameters<typeof fetcher>[1]

const fetchTemplate = async (templateUrl: string): Promise<GuildTemplate> => {
  const [guild, roles, guildPlatforms]: [Guild, Role[], GuildReward[]] =
    await Promise.all([
      fetcher(`/v2/guilds/${templateUrl}`, fetcherOptions),
      fetcher(`/v2/guilds/${templateUrl}/roles`, fetcherOptions),
      fetcher(`/v2/guilds/${templateUrl}/guild-platforms`, fetcherOptions),
    ])

  const guildTemplate = {
    ...guild,
    roles: roles.map((role) => ({ ...role, rolePlatforms: [] })),
    guildPlatforms,
  } satisfies GuildTemplate

  const rolePlatformArrays = await Promise.all(
    roles.map((role) =>
      fetcher(
        `/v2/guilds/${templateUrl}/roles/${role.id}/role-platforms`,
        fetcherOptions
      )
    )
  )

  rolePlatformArrays.forEach(
    (rolePlatformArray, roleIndex) =>
      (guildTemplate.roles[roleIndex].rolePlatforms = rolePlatformArray)
  )

  return guildTemplate
}

export const fetchTemplates = unstable_cache(
  () => Promise.all(TEMPLATE_GUILD_URL_NAMES.map(fetchTemplate)),
  [GUILD_TEMPLATES_CACHE_KEY],
  {
    revalidate: false,
    tags: [GUILD_TEMPLATES_CACHE_KEY],
  }
)
