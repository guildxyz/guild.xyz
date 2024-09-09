import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId } from "types"
import { discordData } from "./data"

const useDiscordCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => {
  const { name: guildName, imageUrl } = useGuild()
  const rolePlatform = useRolePlatform()
  return {
    type: "DISCORD",
    image: imageUrl,
    name:
      guildPlatform.platformGuildName ||
      guildPlatform.platformGuildData?.name ||
      guildName ||
      discordData.name,
    info: rolePlatform?.platformRoleData?.name
      ? `${rolePlatform?.platformRoleData?.name} role`
      : undefined,
  }
}

export default useDiscordCardProps
