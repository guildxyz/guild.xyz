import useUsersGuilds from "components/index/hooks/useUsersGuilds"
import { useGuild } from "components/[guild]/Context"

const useIsMember = (): boolean => {
  const { id } = useGuild()
  const usersGuildsIds = useUsersGuilds()

  return usersGuildsIds?.includes(id)
}

export default useIsMember
