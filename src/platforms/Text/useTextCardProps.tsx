import { Circle, Icon, Tag, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const useTextCardProps = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const platformGuildData = guildPlatform.platformGuildData

  // TODO: use dynamic values
  const capacity = 100
  const claimed = 58

  return {
    name: platformGuildData.name ?? "Text",
    type: "TEXT" as PlatformName,
    image: platformGuildData.imageUrl ?? (
      <Circle size={10} bgColor={bgColor}>
        <Icon as={platforms.TEXT.icon} boxSize={6} color="white" />
      </Circle>
    ),
    info: <Tag mt="1">{`${claimed}/${capacity} claimed`}</Tag>,
  }
}

export default useTextCardProps
