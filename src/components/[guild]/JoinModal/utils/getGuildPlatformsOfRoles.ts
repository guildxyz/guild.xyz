import useGuild from "components/[guild]/hooks/useGuild"

export default function getGuildPlatformsOfRoles(
  roleIds: number[],
  guild: ReturnType<typeof useGuild>
) {
  try {
    const roleIdsSet = new Set(roleIds)

    const rolePlatforms = guild.roles
      .filter((role) => roleIdsSet.has(role.id))
      .flatMap((role) => role.rolePlatforms)

    const guildPlatformIds = new Set(
      rolePlatforms.map(({ guildPlatformId }) => guildPlatformId)
    )

    const guildPlatforms = guild.guildPlatforms.filter((guildPlatform) =>
      guildPlatformIds.has(guildPlatform.id)
    )

    return guildPlatforms
  } catch {
    return []
  }
}
