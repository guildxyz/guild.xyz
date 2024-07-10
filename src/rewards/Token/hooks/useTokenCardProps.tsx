import useTokenData from "hooks/useTokenData"
import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId } from "types"

/** Used in role edit drawer, for AccessHub we have TokenRewardCard */
const useTokenCardProps: CardPropsHook = ({
  platformGuildData,
}: GuildPlatformWithOptionalId) => {
  const {
    data: { symbol, logoURI },
  } = useTokenData(platformGuildData?.chain, platformGuildData?.tokenAddress)

  return {
    type: "ERC20",
    image: logoURI || platformGuildData?.imageUrl,
    name: `Claim ${symbol}`,
  }
}

export default useTokenCardProps
