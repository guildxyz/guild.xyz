import useUsersGuildsRolesIds from "components/index/hooks/useUsersGuildsRolesIds"

const useIsMember = (type: "guild" | "role", id: number): boolean => {
  const { usersGuildsIds, usersRolesIds } = useUsersGuildsRolesIds()

  if (id === undefined) return undefined

  return type === "guild"
    ? usersGuildsIds?.includes(id)
    : usersRolesIds?.includes(id)
}

export default useIsMember
