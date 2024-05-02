import useTokenData from "hooks/useTokenData"
import { GuildPlatformWithOptionalId, PlatformName } from "types"

// used in role edit drawer, for AccessHub we have TokenRewardCard
const useTokenCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const { chain, imageUrl, tokenAddress } = guildPlatform.platformGuildData

  const {
    data: { symbol, logoURI },
  } = useTokenData(chain, tokenAddress)

  return {
    type: "ERC20" as PlatformName,
    image: logoURI || imageUrl,
    name: `Claim ${symbol}`,
  }
}

export default useTokenCardProps
