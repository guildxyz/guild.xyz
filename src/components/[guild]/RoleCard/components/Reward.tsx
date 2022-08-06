import { Circle, HStack, Img, Text } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { PlatformType, RolePlatform } from "types"
import capitalize from "utils/capitalize"

type Props = {
  platform: RolePlatform
}

const getRewardLabel = (platform: RolePlatform) => {
  switch (platform.guildPlatform.platformId) {
    case PlatformType.DISCORD:
      return platform?.platformRoleData?.isGuarded
        ? "Guarded access to: "
        : "Role in: "

    case PlatformType.GOOGLE:
      if (typeof platform.guildPlatform?.platformGuildData?.role === "string")
        return `${capitalize(
          platform.guildPlatform.platformGuildData.role
        )} access to: `

    default:
      return "Access to: "
  }
}

const Reward = ({ platform }: Props) => {
  const { guildPlatforms } = useGuild()

  const guildPlatform = guildPlatforms?.find(
    (p) => p.id === platform.guildPlatformId
  )

  const platformWithGuildPlatform = { ...platform, guildPlatform }

  return (
    <HStack pt="3">
      <Circle size={6} overflow="hidden">
        <Img
          src={`/platforms/${PlatformType[
            guildPlatform?.platformId
          ]?.toLowerCase()}.png`}
          alt={guildPlatform?.platformGuildName}
          boxSize={6}
        />
      </Circle>
      <Text as="span">
        {getRewardLabel(platformWithGuildPlatform)}
        <b>{guildPlatform?.platformGuildName || guildPlatform?.platformGuildId}</b>
      </Text>
    </HStack>
  )
}

export default Reward
