import AvailibiltyTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailibiltyTags"
import useGuild from "components/[guild]/hooks/useGuild"
import platforms from "platforms/platforms"
import { GuildPlatform, PlatformName } from "types"

const usePoapCardProps = (guildPlatform: GuildPlatform) => {
  const { roles } = useGuild()
  const platformGuildData = guildPlatform.platformGuildData

  const rolePlatform = roles
    .flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

  return {
    name: platformGuildData.name ?? "POAP",
    type: "POAP" as PlatformName,
    image: platformGuildData.imageUrl ?? platforms.POAP.imageUrl,
    info: rolePlatform && <AvailibiltyTags rolePlatform={rolePlatform} mt={1} />,
  }
}

export default usePoapCardProps
