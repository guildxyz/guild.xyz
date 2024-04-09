import { useAccessedGuildPlatforms } from "components/[guild]/AccessHub/AccessHub"
import useMembership from "components/explorer/hooks/useMembership"
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

  const guildPlatforms = useAccessedGuildPlatforms()

  const something = useMembership()
  console.log(something)

  return {
    type: "ERC20" as PlatformName,
    image: logoURI || imageUrl,
    name: `Claim ${symbol}`,
  }
}

export default useTokenCardProps
