import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo } from "react"
import { CardPropsHook } from "rewards/types"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import { discordData } from "./data"

const useDiscordCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => {
  const { name: guildName, imageUrl } = useGuild()
  const rolePlatform = useRolePlatform()
  const roleName = useMemo(() => {
    if (!rolePlatform || !rolePlatform?.isNew) return null
    if (!rolePlatform.platformRoleId) return "Create a new Discord role"
    return "Manage existing role"
  }, [rolePlatform])

  return {
    type: "DISCORD" as PlatformName,
    image: imageUrl,
    name:
      guildPlatform.platformGuildName ||
      guildPlatform.platformGuildData?.name ||
      guildName ||
      discordData.name,
    info: roleName ?? undefined,
  }
}

export default useDiscordCardProps
