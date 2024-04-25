import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useMembership from "components/explorer/hooks/useMembership"
import { PlatformType } from "types"

export const useAccessedTokenRewards = (pointPlatformId?: number) => {
  const { guildPlatforms, roles } = useGuild()
  const { roleIds } = useMembership()
  const { isAdmin } = useGuildPermission()

  const tokenRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.ERC20
  )

  if (!pointPlatformId && isAdmin) return tokenRewards

  const accessedTokenRewards =
    tokenRewards?.filter((gp) => {
      const relevantRoles = roles.filter((role) =>
        role.rolePlatforms.find(
          (rp) =>
            rp.guildPlatformId === gp.id &&
            (pointPlatformId
              ? rp.platformRoleData?.pointGuildPlatformId == pointPlatformId
              : true)
        )
      )

      const accessedRolesWithReward = relevantRoles.filter((role) =>
        roleIds?.includes(role.id)
      )

      return accessedRolesWithReward.length
    }) || []

  return accessedTokenRewards
}
