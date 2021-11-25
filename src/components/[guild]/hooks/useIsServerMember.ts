// Check if the user has joined all guilds on a specific DC server
import useUsersHallsGuildsIds from "components/index/hooks/useUsersHallsGuildsIds"

const useIsServerMember = (guildIds: Array<number>): boolean => {
  const { usersGuildsIds } = useUsersHallsGuildsIds()

  return guildIds.some((id) => usersGuildsIds?.includes(id))
}

export default useIsServerMember
