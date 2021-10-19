import useUsersGroupsGuilds from "components/index/hooks/useUsersGroupsGuilds"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"

const useIsMember = (): boolean => {
  const guild = useGuild() || null
  const group = useGroup() || null
  const usersGroupsGuildsIds = useUsersGroupsGuilds()

  return group
    ? usersGroupsGuildsIds?.groups?.includes(group.id)
    : usersGroupsGuildsIds?.guilds?.includes(guild.id)
}

export default useIsMember
