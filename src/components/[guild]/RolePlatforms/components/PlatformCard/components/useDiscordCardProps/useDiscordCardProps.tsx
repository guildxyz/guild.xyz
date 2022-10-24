import useServerData from "hooks/useServerData"
import { useEffect, useState } from "react"
import { GuildPlatform, PlatformName } from "types"
import { useRolePlatform } from "../../../RolePlatformProvider"

const useDiscordCardProps = (guildPlatform: GuildPlatform) => {
  const rolePlatform = useRolePlatform()
  const { data } = useServerData(guildPlatform.platformGuildId, {
    revalidateOnFocus: false,
  })

  const [roleName, setRoleName] = useState<string>()

  useEffect(() => {
    if (!rolePlatform) return

    if (!rolePlatform.platformRoleId) {
      setRoleName("Create a new Discord role")
      return
    }

    const discordRole = data?.roles?.find(
      (role) => role.id === rolePlatform.platformRoleId
    )

    if (!discordRole) {
      setRoleName("Deleted role")
      return
    }

    setRoleName(`${discordRole.name} role`)
  }, [rolePlatform, data])

  return {
    type: "DISCORD" as PlatformName,
    image: data?.serverIcon || "/default_discord_icon.png",
    name: data?.serverName || "",
    info: roleName,
  }
}

export default useDiscordCardProps
