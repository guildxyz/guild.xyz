import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const useUniqueTextCardProps = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const platformGuildData = guildPlatform.platformGuildData

  return {
    name: platformGuildData.name ?? "Unique text",
    type: "UNIQUE_TEXT" as PlatformName,
    image: platformGuildData.imageUrl ?? (
      <Circle size={10} bgColor={bgColor}>
        <Icon as={platforms.UNIQUE_TEXT.icon} boxSize={5} color="white" />
      </Circle>
    ),
  }
}

export default useUniqueTextCardProps
