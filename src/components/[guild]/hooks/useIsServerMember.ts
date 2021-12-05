// Check if the user has joined all roles on a specific DC server
import useUsersGuildsRolesIds from "components/index/hooks/useUsersGuildsRolesIds"

const useIsServerMember = (roleIds: Array<number>): boolean => {
  const { usersRolesIds } = useUsersGuildsRolesIds()

  return roleIds.some((id) => usersRolesIds?.includes(id))
}

export default useIsServerMember
