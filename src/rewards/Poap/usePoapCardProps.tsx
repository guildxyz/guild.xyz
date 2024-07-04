import AvailabilityTags from "components/[guild]/RolePlatforms/components/PlatformCard/components/AvailabilityTags"
import useGuild from "components/[guild]/hooks/useGuild"
import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import { poapData } from "./data"

const usePoapCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => {
  const { roles } = useGuild()
  const platformGuildData = guildPlatform.platformGuildData

  const rolePlatform = roles
    ?.flatMap((role) => role.rolePlatforms)
    .find((rp) => rp.guildPlatformId === guildPlatform.id)

  return {
    name: platformGuildData?.name || poapData.name,
    type: "POAP" as PlatformName,
    image: platformGuildData?.imageUrl || poapData.imageUrl,
    info: rolePlatform && <AvailabilityTags rolePlatform={rolePlatform} mt={1} />,
  }
}

export default usePoapCardProps
