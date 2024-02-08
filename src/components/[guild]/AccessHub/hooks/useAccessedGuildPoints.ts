import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useMembership from "components/explorer/hooks/useMembership"
import { PlatformType } from "types"

type GuildPointsAccessFilter = "ALL" | "ACCESSED_ONLY"

/**
 * Custom hook to filter guild platforms based on role access and optionally,
 * additional privacy settings for points rewards.
 *
 * @param filter - ACCESSED_ONLY: apply access filter to every points platform (if
 *   the user does not have any roles that reward the point type, the point type will
 *   be filtered out)
 *
 *   ALL: apply access filter only to private points platforms (if the user does not
 *   have any roles that reward the point type, the point type will _still be
 *   included_, excpet for when it is set as private reward by all roles)
 */
export const useAccessedGuildPoints = (
  filter: GuildPointsAccessFilter = "ACCESSED_ONLY"
) => {
  const { id: guildId, guildPlatforms, roles } = useGuild()
  const { roleIds } = useMembership()
  const { isAdmin } = useGuildPermission()

  const accessedGuildPoints =
    guildPlatforms?.filter((gp) => {
      if (gp.platformId != PlatformType.POINTS) return false
      if (isAdmin) return true

      const isVisibleOnAccessedRole = roles
        ?.flatMap((role) => role.rolePlatforms)
        ?.filter((rp) => rp.guildPlatformId === gp.id)
        ?.filter((rp) =>
          filter === "ALL"
            ? rp.visibility === "PRIVATE"
              ? roleIds?.includes(rp.roleId)
              : true
            : roleIds?.includes(rp.roleId)
        )
        ?.some((rp) => rp.visibility != "HIDDEN")
      return isVisibleOnAccessedRole
    }) || []

  return accessedGuildPoints
}
