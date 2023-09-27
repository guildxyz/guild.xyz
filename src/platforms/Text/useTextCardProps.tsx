import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformGuildData, PlatformName } from "types"

const useTextCardProps = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  return {
    name: "Text",
    type: "TEXT" as PlatformName,
    image: (
      <Circle size={10} bgColor={bgColor}>
        <Icon as={platforms.TEXT.icon} boxSize={6} />
      </Circle>
    ),
    info: (guildPlatform.platformGuildData as PlatformGuildData["TEXT"]).text,
  }
}

export default useTextCardProps
