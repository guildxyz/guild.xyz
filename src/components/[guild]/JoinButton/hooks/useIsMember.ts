import useUsersHallsGuilds from "components/index/hooks/useUsersHallsGuilds"

const useIsMember = (type: "hall" | "guild", id: number): boolean => {
  const { usersHallsIds, usersGuildsIds } = useUsersHallsGuilds()

  return type === "hall" ? usersHallsIds?.includes(id) : usersGuildsIds?.includes(id)
}

export default useIsMember
