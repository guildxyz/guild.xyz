import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo } from "react"
import { GuildPlatformWithOptionalId, PlatformName } from "types"

const useDiscordCardProps = (guildPlatform: GuildPlatformWithOptionalId) => {
  const { name: guildName, imageUrl } = useGuild()
  const rolePlatform = useRolePlatform()
  // const { data } = useServerData(guildPlatform.platformGuildId, {
  //   swrOptions: {
  //     revalidateOnFocus: false,
  //   },
  // })

  const roleName = useMemo(() => {
    if (!rolePlatform || !rolePlatform?.isNew) return null
    if (!rolePlatform.platformRoleId) return "Create a new Discord role"
    return "Manage existing role"
    // const discordRole = data?.roles?.find(
    //   (role) => role.id === rolePlatform.platformRoleId
    // )
    // if (!discordRole) return "Deleted role"
    // return `${discordRole.name} role`
  }, [rolePlatform /* , data */])

  return {
    type: "DISCORD" as PlatformName,
    // image: data?.serverIcon || "/default_discord_icon.png",
    // name: data?.serverName || "",
    image: imageUrl,
    name:
      guildPlatform.platformGuildName ||
      guildPlatform.platformGuildData?.name ||
      guildName,
    info: roleName,
  }
}

export default useDiscordCardProps
