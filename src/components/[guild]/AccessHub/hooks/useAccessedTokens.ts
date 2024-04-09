import { Chain } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useMembership from "components/explorer/hooks/useMembership"
import { GuildPlatform, PlatformType } from "types"

export type TokenAccessHubData = {
  chain: Chain
  address: `0x${string}`
  guildPlatforms: GuildPlatform[]
}

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

  const groupedByContractAndChain: TokenAccessHubData[] = Object.values(
    accessedGuildTokens.reduce((acc, item) => {
      const { contractAddress, chain } = item.platformGuildData
      const key = `${contractAddress}-${chain}`

      if (!acc[key]) {
        acc[key] = {
          chain: chain,
          address: contractAddress,
          guildPlatforms: [],
        }
      }

      acc[key].guildPlatforms.push(item)

      return acc
    }, {})
  )

  console.log(groupedByContractAndChain)

  return groupedByContractAndChain
}
