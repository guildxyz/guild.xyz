import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformGuildData, PlatformName } from "types"

const useTextCardProps = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const platformGuildData =
    guildPlatform.platformGuildData as PlatformGuildData["TEXT"]

  return {
    name: platformGuildData.name ?? "Text",
    type: "TEXT" as PlatformName,
    image: platformGuildData.image ?? (
      <Circle size={10} bgColor={bgColor}>
        <Icon as={platforms.TEXT.icon} boxSize={6} color="white" />
      </Circle>
    ),
  }
}

export default useTextCardProps
