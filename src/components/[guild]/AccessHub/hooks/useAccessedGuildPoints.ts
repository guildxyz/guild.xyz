import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useMemberships from "components/explorer/hooks/useMemberships"
import { PlatformType } from "types"

/**
 * Custom hook to filter guild platforms based on role access and optionally,
 * additional privacy settings for points rewards.
 *
 * @param {boolean} filterPrivateOnly - When true, filters to include roles only when
 *   point rewards are private and the user has access to those roles. When false,
 *   always filters to roles the user has access to.
 */
export const useAccessedGuildPoints = (filterPrivateOnly = false) => {
  const { id: guildId, guildPlatforms, roles } = useGuild()
  const { memberships } = useMemberships()
  const { isAdmin } = useGuildPermission()

  const accessedRoleIds = memberships?.find(
    (membership) => membership.guildId === guildId
  )?.roleIds

  const accessedGuildPoints = guildPlatforms?.filter((gp) => {
    if (gp.platformId != PlatformType.POINTS) return false
    if (isAdmin) return true

    const isVisibleOnAccessedRole = roles
      ?.flatMap((role) => role.rolePlatforms)
      ?.filter((rp) => rp.guildPlatformId === gp.id)
      ?.filter((rp) =>
        filterPrivateOnly
          ? rp.visibility === "PRIVATE"
            ? accessedRoleIds?.includes(rp.roleId)
            : true
          : accessedRoleIds?.includes(rp.roleId)
      )
      ?.some((rp) => rp.visibility != "HIDDEN")
    return isVisibleOnAccessedRole
  })

  return accessedGuildPoints
}
