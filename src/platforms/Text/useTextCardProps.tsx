import { Circle, Icon } from "@chakra-ui/react"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformGuildData, PlatformName } from "types"

const useTextCardProps = (guildPlatform: GuildPlatform) => ({
  name: "Text",
  type: "TEXT" as PlatformName,
  image: (
    <Circle size={10}>
      <Icon as={platforms.TEXT.icon} boxSize={6} />
    </Circle>
  ),
  info: (guildPlatform.platformGuildData as PlatformGuildData["TEXT"]).text,
})

export default useTextCardProps
