import { Guild, GuildReward, Role } from "@guildxyz/types"
import { env } from "env"
import { unstable_cache } from "next/cache"
import fetcher from "utils/fetcher"
import { GUILD_TEMPLATES_CACHE_KEY, TEMPLATE_GUILD_URL_NAMES } from "./constants"
import { GuildTemplate } from "./types"

/**
 * We got Zod errors when we passed "null" values to our API. We should definitely think about a better solution here, but for now I wrote this util to just remove nulls from an object so we'll always submit valid data.
 */
const removeNullProperties = <ObjectType extends Record<string, any>>(
  obj: ObjectType
) => {
  if (obj === null || typeof obj !== "object") return {} as ObjectType

  const mapped = structuredClone(obj)

  Object.keys(mapped).forEach((key: keyof typeof mapped) => {
    if (mapped[key] === null) delete mapped[key]

    if (
      Array.isArray(mapped[key]) &&
      mapped[key].every((v: ObjectType[keyof ObjectType]) => typeof v === "object")
    )
      mapped[key] = mapped[key].map((v: ObjectType[keyof ObjectType]) =>
        removeNullProperties(v)
      )

    if (typeof mapped[key] === "object")
      mapped[key] = removeNullProperties(mapped[key])
  })

  return mapped
}

const fetcherOptions = {
  headers: {
    "x-guild-service": "APP",
    "x-guild-auth": env.GUILD_API_KEY,
  },
} as const satisfies Parameters<typeof fetcher>[1]

const fetchTemplate = async (templateUrl: string): Promise<GuildTemplate> => {
  const [guild, roles, guildPlatforms]: [Guild, Role[], GuildReward[]] =
    await Promise.all([
      fetcher(`/v2/guilds/${templateUrl}`, fetcherOptions),
      fetcher(`/v2/guilds/${templateUrl}/roles`, fetcherOptions),
      fetcher(`/v2/guilds/${templateUrl}/guild-platforms`, fetcherOptions),
    ])

  const guildTemplate = {
    ...guild,
    roles: roles.map((role) => ({ ...role, rolePlatforms: [], requirements: [] })),
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

  const requirementArrays = await Promise.all(
    roles.map((role) =>
      fetcher(
        `/v2/guilds/${templateUrl}/roles/${role.id}/requirements`,
        fetcherOptions
      )
    )
  )

  requirementArrays.forEach(
    (requirementArray, roleIndex) =>
      (guildTemplate.roles[roleIndex].requirements = requirementArray)
  )

  return removeNullProperties(guildTemplate)
}

export const fetchTemplates = unstable_cache(
  () => Promise.all(TEMPLATE_GUILD_URL_NAMES.map(fetchTemplate)),
  [GUILD_TEMPLATES_CACHE_KEY],
  {
    revalidate: false,
    tags: [GUILD_TEMPLATES_CACHE_KEY],
  }
)
