import useUsersGroupsGuilds from "components/index/hooks/useUsersGroupsGuilds"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"

const useIsMember = (): boolean => {
  const guild = useGuild() || null
  const group = useGroup() || null
  const usersGuildsIds = useUsersGroupsGuilds()

  return group
    ? usersGuildsIds?.groups?.includes(group.id)
    : usersGuildsIds?.guilds?.includes(guild.id)
}

export default useIsMember
