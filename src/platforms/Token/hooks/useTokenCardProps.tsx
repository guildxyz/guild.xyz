import useGuild from "components/[guild]/hooks/useGuild"
import { useRoleMembership } from "components/explorer/hooks/useMembership"
import useTokenData from "hooks/useTokenData"
import { GuildPlatformWithOptionalId, PlatformName } from "types"

const useTokenCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const {
    chain,
    imageUrl,
    contractAddress: tokenAddress,
  } = guildPlatform.platformGuildData

  const {
    data: { name, symbol, decimals, logoURI },
  } = useTokenData(chain, tokenAddress)

  const { roles } = useGuild()

  const roleOfReward = roles.find((role) =>
    role.rolePlatforms.find((rolePlatform) => rolePlatform.id === guildPlatform.id)
  )

  const { reqAccesses, hasRoleAccess } = useRoleMembership(roleOfReward?.id)

  return {
    type: "ERC20" as PlatformName,
    image: logoURI || imageUrl,
    name: `Claim ${symbol}`,
  }
}

export default useTokenCardProps
