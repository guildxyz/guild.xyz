import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import useMembership from "components/explorer/hooks/useMembership"
import { PlatformType } from "types"

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
        ?.filter((rp) => rp.guildPlatformId === gp.id)
        ?.filter((rp) => roleIds?.includes(rp.roleId))

      return relevantRolePlatforms.length > 0
    }) || []

  return accessedGuildTokens
}
