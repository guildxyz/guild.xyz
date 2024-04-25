import useGuild from "components/[guild]/hooks/useGuild"
import useMembership from "components/explorer/hooks/useMembership"
import { PlatformType } from "types"

export const useTokenRewards = (
  accessedOnly?: boolean,
  pointPlatformId?: number
) => {
  const { guildPlatforms, roles } = useGuild()
  const { roleIds } = useMembership()

  const tokenRewards = guildPlatforms?.filter(
    (gp) => gp.platformId === PlatformType.ERC20
  )

  if (!pointPlatformId && !accessedOnly) return tokenRewards || []

  const accessedTokenRewards = tokenRewards?.filter((gp) => {
    const relevantRoles = roles.filter((role) =>
      role.rolePlatforms.find(
        (rp) =>
          rp.guildPlatformId === gp.id &&
          (pointPlatformId
            ? rp.platformRoleData?.pointGuildPlatformId == pointPlatformId
            : true)
      )
    )
    if (!accessedOnly) return !!relevantRoles.length

    const accessedRolesWithReward = relevantRoles.filter((role) =>
      roleIds?.includes(role.id)
    )

    return accessedRolesWithReward.length
  })

  return accessedTokenRewards || []
}
