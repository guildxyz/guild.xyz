import useServerData from "hooks/useServerData"
import { useMemo } from "react"
import { PlatformCardProps } from "../.."
import { useRolePlatform } from "../../../RolePlatformProvider"
import PlatformCard from "../../PlatformCard"

const DiscordCard = ({
  guildPlatform,
  actionRow,
  children,
  ...rest
}: PlatformCardProps): JSX.Element => {
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

  return (
    <PlatformCard
      type="DISCORD"
      image={data?.serverIcon || "/default_discord_icon.png"}
      name={data?.serverName || ""}
      info={roleName}
      actionRow={actionRow}
      {...rest}
    >
      {children}
    </PlatformCard>
  )
}

export default DiscordCard
