import useServerData from "hooks/useServerData"
import { useMemo } from "react"
import { GuildPlatform, PlatformName } from "types"
import { useRolePlatform } from "../../../RolePlatformProvider"

const useDiscordCardProps = (guildPlatform: GuildPlatform) => {
  const rolePlatform = useRolePlatform()
  const { data } = useServerData(guildPlatform.platformGuildId, {
    revalidateOnFocus: false,
  })

  const roleName = useMemo(() => {
    if (!rolePlatform) return null
    if (!rolePlatform.platformRoleId) return "Create a new Discord role"
    const discordRole = data?.roles?.find(
      (role) => role.id === rolePlatform.platformRoleId
    )
    if (!discordRole) return "Deleted role"
    return `${discordRole.name} role`
  }, [rolePlatform, data])

  return {
    type: "DISCORD" as PlatformName,
    image: data?.serverIcon || "/default_discord_icon.png",
    name: data?.serverName || "",
    info: roleName,
  }
}

export default useDiscordCardProps
