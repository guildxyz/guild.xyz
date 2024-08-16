import DynamicTag from "components/[guild]/RoleCard/components/DynamicReward/DynamicTag"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useTokenData from "hooks/useTokenData"
import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId, RolePlatform } from "types"

/** Used in role edit drawer, for AccessHub we have TokenRewardCard */
const useTokenCardProps: CardPropsHook = ({
  platformGuildData,
}: GuildPlatformWithOptionalId) => {
  const rolePlatform = useRolePlatform()
  const {
    data: { symbol, logoURI },
  } = useTokenData(platformGuildData?.chain, platformGuildData?.tokenAddress)

  return {
    type: "ERC20",
    image: logoURI || platformGuildData?.imageUrl,
    name: `Claim ${symbol}`,
    info: !!rolePlatform?.dynamicAmount && (
      <DynamicTag rolePlatform={rolePlatform as RolePlatform} mt={1} />
    ),
  }
}

export default useTokenCardProps
