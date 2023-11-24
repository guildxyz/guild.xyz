import { Circle, Icon, useColorModeValue } from "@chakra-ui/react"
import AvailibiltyTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailibiltyTags"
import useGuild from "components/[guild]/hooks/useGuild"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const useUniqueTextCardProps = (guildPlatform: GuildPlatform) => {
  const bgColor = useColorModeValue("gray.700", "gray.600")

  const { roles } = useGuild()
  const platformGuildData = guildPlatform.platformGuildData

  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

  return {
    name: platformGuildData.name ?? "Unique secret",
    type: "UNIQUE_TEXT" as PlatformName,
    image: platformGuildData.imageUrl ?? (
      <Circle size={10} bgColor={bgColor}>
        <Icon as={platforms.UNIQUE_TEXT.icon} boxSize={5} color="white" />
      </Circle>
    ),
    info: rolePlatform && <AvailibiltyTags rolePlatform={rolePlatform} mt={1} />,
  }
}

export default useUniqueTextCardProps
