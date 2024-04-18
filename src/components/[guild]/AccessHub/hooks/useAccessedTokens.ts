import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useMembership from "components/explorer/hooks/useMembership"
import { GuildPlatform, PlatformType, RolePlatform } from "types"

export type TokenAccessHubData = {
  guildPlatform: GuildPlatform
  rolePlatformsByRoles: {
    roleId?: number
    rolePlatforms: RolePlatform[]
  }[]
}

type GroupEntry = {
  guildPlatform: GuildPlatform
  rolePlatformsByRoles: Record<
    number,
    {
      roleId: number
      rolePlatforms: RolePlatform[]
    }
  >
}

/**
 * The token rewards are claimed TOGETHER by token type, and by role. For ease of
 * use, this hook groups all ERC20 reward guild and role platforms by token type
 * (chain - token contract address pair), and by roleId.
 *
 * This allows easier access of the reward amounts inside rolePlatform.dynamicAmount,
 * and other reward related data in guildPlatform.guildPlatformData.
 */
export const useAccessedTokens = () => {
  const { guildPlatforms, roles } = useGuild()
  const { roleIds } = useMembership()
  const { isAdmin } = useGuildPermission()

  const accessedGuildTokens =
    guildPlatforms?.filter((gp) => {
      if (gp.platformId !== PlatformType.ERC20) return false
      if (isAdmin) return true

      const relevantRolePlatforms = roles
        ?.flatMap((role) => role.rolePlatforms)
        ?.filter((rp) => roleIds?.includes(rp.roleId))

      return relevantRolePlatforms.length > 0
    }) || []

  const groupedByContractAndRole: TokenAccessHubData[] = Object.values(
    accessedGuildTokens.reduce((acc, item) => {
      const rolesForGuildPlatform = roles.filter((role) =>
        role.rolePlatforms.some((rp) => rp.guildPlatformId === item.id)
      )

      const key = item.id

      if (!acc[key]) {
        acc[key] = {
          guildPlatform: item,
          rolePlatformsByRoles: {},
        }
      }

      rolesForGuildPlatform.forEach((role) => {
        const rolePlatforms = role.rolePlatforms.filter(
          (rp) => rp.guildPlatformId === item.id
        )

        if (!acc[key].rolePlatformsByRoles[role.id]) {
          acc[key].rolePlatformsByRoles[role.id] = {
            roleId: role.id,
            rolePlatforms: rolePlatforms,
          }
        }
      })

      return acc
    }, {} as Record<string, GroupEntry>)
  ).map((item) => ({
    ...item,
    rolePlatformsByRoles: Object.values(item.rolePlatformsByRoles),
  }))

  return groupedByContractAndRole
}
