import useUsersGroupsGuilds from "components/index/hooks/useUsersGroupsGuilds"

const useIsMember = (type: "group" | "guild", id: number): boolean => {
  const { usersGroupsIds, usersGuildsIds } = useUsersGroupsGuilds()

  return type === "group"
    ? usersGroupsIds?.includes(id)
    : usersGuildsIds?.includes(id)
}

export default useIsMember
