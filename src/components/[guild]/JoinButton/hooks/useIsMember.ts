import useUsersGroupsGuilds from "components/index/hooks/useUsersGroupsGuilds"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"

const useIsMember = (): boolean => {
  const guild = useGuild() || null
  const group = useGroup() || null
  const { usersGroupsIds, usersGuildsIds } = useUsersGroupsGuilds()

  return group
    ? usersGroupsIds.includes(group.id)
    : usersGuildsIds.includes(guild.id)
}

export default useIsMember
