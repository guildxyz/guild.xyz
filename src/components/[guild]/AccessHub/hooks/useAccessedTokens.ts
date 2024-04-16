import { Chain } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useMembership from "components/explorer/hooks/useMembership"
import { GuildPlatform, PlatformType, RolePlatform } from "types"

export type TokenAccessHubData = {
  chain: Chain
  address: `0x${string}`
  rewardsByRoles: {
    roleId?: number
    rewards: { rolePlatform?: RolePlatform; guildPlatform: GuildPlatform }[]
  }[]
}

type GroupEntry = {
  chain: Chain
  address: `0x${string}`
  rewardsByRoles: Record<
    number,
    {
      roleId: number
      rewards: Array<{ rolePlatform?: RolePlatform; guildPlatform: GuildPlatform }>
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
      const { tokenAddress, chain } = item.platformGuildData
      const key = `${tokenAddress}-${chain}`

      const roleOfReward = roles.find((role) =>
        role.rolePlatforms.some((rp) => rp.guildPlatformId === item.id)
      )

      if (!roleOfReward) {
        console.error(
          "Unexpected error while grouping token rewards. No parent role found!"
        )
        return []
      }

      const rolePlatform = roleOfReward.rolePlatforms.find(
        (rp) => rp.guildPlatformId === item.id
      )
      const roleId = roleOfReward.id

      // Initialize the group for this key if it doesn't exist
      if (!acc[key]) {
        acc[key] = {
          chain: chain,
          address: tokenAddress,
          rewardsByRoles: {},
        }
      }

      // Initialize the role entry if it doesn't exist
      if (!acc[key].rewardsByRoles[roleId]) {
        acc[key].rewardsByRoles[roleId] = {
          roleId: roleId,
          rewards: [],
        }
      }

      // Add the current item's data to the rewards array
      acc[key].rewardsByRoles[roleId].rewards.push({
        rolePlatform: rolePlatform,
        guildPlatform: item,
      })

      return acc
    }, {} as Record<string, GroupEntry>)
  ).map((item) => ({
    ...item,
    rewardsByRoles: Object.values(item.rewardsByRoles),
  }))

  console.log(groupedByContractAndRole)

  return groupedByContractAndRole
}
