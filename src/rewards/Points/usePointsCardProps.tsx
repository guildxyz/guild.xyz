import { Circle, useColorModeValue } from "@chakra-ui/react"
import useDynamicRewardUserAmount from "rewards/Token/hooks/useDynamicRewardUserAmount"
import { CardPropsHook } from "rewards/types"
import Star from "static/icons/star.svg"
import { GuildPlatformWithOptionalId } from "types"
import { useRolePlatform } from "../../components/[guild]/RolePlatforms/components/RolePlatformProvider"

const usePointsCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => {
  const rolePlatform = useRolePlatform()
  const { dynamicUserAmount } = useDynamicRewardUserAmount(rolePlatform)

  const score = !!rolePlatform?.dynamicAmount
    ? dynamicUserAmount ?? "some"
    : rolePlatform?.platformRoleData?.score

  const bgColor = useColorModeValue("gray.700", "gray.600")

  return {
    type: "POINTS",
    image: guildPlatform.platformGuildData?.imageUrl || (
      <Circle size={10} bgColor={bgColor}>
        <Star color="white" />
      </Circle>
    ),
    // if undefined at admin setup -> "some", if saved with no value (empty string) -> 0
    name: `Get ${score ?? 0} ${guildPlatform.platformGuildData?.name || "points"}`,
  }
}

export default usePointsCardProps
