import useUsersHallsGuilds from "components/index/hooks/useUsersHallsGuilds"
import { useGuild } from "components/[guild]/Context"
import { useHall } from "components/[hall]/Context"

const useIsMember = (): boolean => {
  const guild = useGuild() || null
  const hall = useHall() || null
  const { usersHallsIds, usersGuildsIds } = useUsersHallsGuilds()

  return hall ? usersHallsIds?.includes(hall.id) : usersGuildsIds?.includes(guild.id)
}

export default useIsMember
