import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useMembership from "components/explorer/hooks/useMembership"
import { PlatformType, Requirement } from "types"

export const useAccessedTokens = (pointPlatformId?: number) => {
  const { guildPlatforms, roles } = useGuild()
  const { roleIds } = useMembership()
  const { isAdmin } = useGuildPermission()

  const accessedGuildTokens =
    guildPlatforms?.filter((gp) => {
      if (gp.platformId !== PlatformType.ERC20) return false

      const relevantRoles = roles?.filter((role: any) => {
        // Optional filtering by point platform

        if (pointPlatformId === undefined) return true
        const reqs: Requirement[] = role.requirements
        return reqs.find((req) => req.data?.guildPlatformId === pointPlatformId)
      })

      if (isAdmin) return relevantRoles.length > 0

      const relevantRolePlatforms = relevantRoles
        ?.flatMap((role) => role.rolePlatforms)
        ?.filter((rp) => rp.guildPlatformId === gp.id)
        ?.filter((rp) => roleIds?.includes(rp.roleId))

      return relevantRolePlatforms.length > 0
    }) || []

  return accessedGuildTokens
}
