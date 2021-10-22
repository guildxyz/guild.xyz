import useUsersGroupsGuilds from "components/index/hooks/useUsersGroupsGuilds"
import { useGroup } from "components/[group]/Context"
import { useGuild } from "components/[guild]/Context"

const useIsMember = (guildId?: number): boolean => {
  const guild = useGuild()
  const group = useGroup()
  const { usersGroupsIds, usersGuildsIds } = useUsersGroupsGuilds()

  return guildId || guild
    ? usersGuildsIds?.includes(guildId || guild?.id)
    : usersGroupsIds?.includes(group?.id)
}

export default useIsMember
