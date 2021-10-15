import useUsersGuilds from "components/index/hooks/useUsersGuilds"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"

const useIsMember = (): boolean => {
  const guild = useGuild() || null
  const group = useGroup() || null
  const usersGuildsIds = useUsersGuilds()

  return group
    ? usersGuildsIds?.groups?.includes(group.id)
    : usersGuildsIds?.guilds?.includes(guild.id)
}

export default useIsMember
