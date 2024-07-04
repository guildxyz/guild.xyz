import useDynamicRewardUserAmount from "rewards/Token/hooks/useDynamicRewardUserAmount"
import Star from "static/icons/star.svg"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import { useRolePlatform } from "../../components/[guild]/RolePlatforms/components/RolePlatformProvider"
import { CardPropsHook } from "rewards/types"

const usePointsCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => {
  const rolePlatform = useRolePlatform()
  const { dynamicUserAmount } = useDynamicRewardUserAmount(rolePlatform)

  const score = !!rolePlatform?.dynamicAmount
    ? dynamicUserAmount ?? "some"
    : rolePlatform?.platformRoleData?.score

  return {
    type: "POINTS" as PlatformName,
    image: guildPlatform.platformGuildData?.name || <Star />,
    // if undefined at admin setup -> "some", if saved with no value (empty string) -> 0
    name: `Get ${score ?? 0} ${guildPlatform.platformGuildData?.name || "points"}`,
  }
}

export default usePointsCardProps
