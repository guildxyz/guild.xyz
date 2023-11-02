import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import EditRolePlatformCapacityTime from "components/[guild]/RolePlatforms/components/EditRolePlatformCapacityTime"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const useUniqueTextCardProps = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const platformGuildData = guildPlatform.platformGuildData

  return {
    name: platformGuildData.name ?? "Unique secret",
    type: "UNIQUE_TEXT" as PlatformName,
    image: platformGuildData.imageUrl ?? (
      <Circle size={10} bgColor={bgColor}>
        <Icon as={platforms.UNIQUE_TEXT.icon} boxSize={5} color="white" />
      </Circle>
    ),
    EditRolePlatformRow: EditRolePlatformCapacityTime,
  }
}

export default useUniqueTextCardProps
