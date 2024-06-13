import useGuild from "components/[guild]/hooks/useGuild"

export default function getGuildPlatformsOfRoles(
  roleIds: number[],
  guild: ReturnType<typeof useGuild>
) {
  try {
    const roleIdsSet = new Set(roleIds)

    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    const rolePlatforms = guild.roles
      .filter((role) => roleIdsSet.has(role.id))
      .flatMap((role) => role.rolePlatforms)

    const guildPlatformIds = new Set(
      rolePlatforms.map(({ guildPlatformId }) => guildPlatformId)
    )

    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    const guildPlatforms = guild.guildPlatforms.filter((guildPlatform) =>
      guildPlatformIds.has(guildPlatform.id)
    )

    return guildPlatforms
  } catch {
    return []
  }
}
