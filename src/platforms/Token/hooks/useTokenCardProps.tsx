import { useAccessedGuildPlatforms } from "components/[guild]/AccessHub/AccessHub"
import useGuild from "components/[guild]/hooks/useGuild"
import useRole from "components/[guild]/hooks/useRole"
import useTokenData from "hooks/useTokenData"
import { GuildPlatformWithOptionalId, PlatformName, PlatformType } from "types"

const useTokenCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const {
    chain,
    imageUrl,
    contractAddress: tokenAddress,
  } = guildPlatform.platformGuildData

  const {
    data: { name, symbol, decimals, logoURI },
  } = useTokenData(chain, tokenAddress)

  const guildPlatforms = useAccessedGuildPlatforms()
  const tokenRewards = guildPlatforms.filter(
    (platform) => platform.platformId === PlatformType["ERC20"]
  )

  const { id: guildId } = useGuild()
  const role = useRole(guildPlatform.platformGuildId, guildPlatform.platformId)

  console.log(role)

  return {
    type: "ERC20" as PlatformName,
    image: imageUrl,
    name: `Claim ${symbol}`,
  }
}

export default useTokenCardProps
