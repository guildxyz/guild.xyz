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
 *   included_, except for when it is set as private reward by all roles)
 */
export const useAccessedGuildPoints = (
  filter: GuildPointsAccessFilter = "ACCESSED_ONLY"
) => {
  const { guildPlatforms, roles } = useGuild()
  const { roleIds } = useMembership()
  const { isAdmin } = useGuildPermission()

  const accessedGuildPoints =
    guildPlatforms?.filter((gp) => {
      if (gp.platformId !== PlatformType.POINTS) return false
      if (isAdmin) return true

      const visibleRelatedRolePlatformsToUser = roles
        ?.flatMap((role) => role.rolePlatforms)
        ?.filter((rp) => {
          if (rp.guildPlatformId !== gp.id || rp.visibility === "HIDDEN")
            return false

          if (filter === "ALL" && rp.visibility === "PUBLIC") return true

          // @ts-expect-error TODO: fix this error originating from strictNullChecks
          return roleIds?.includes(rp.roleId)
        })

      // @ts-expect-error TODO: fix this error originating from strictNullChecks
      return visibleRelatedRolePlatformsToUser.length > 0
    }) || []

  return accessedGuildPoints
}
