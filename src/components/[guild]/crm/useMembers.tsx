import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useMemo } from "react"
import { Visibility } from "types"
import useGuild from "../hooks/useGuild"

const useMembers = () => {
  const { roles, id } = useGuild()

  const { data, ...rest } = useSWRWithOptionalAuth(`/guild/${id}/crm/members`)

  const transformedData = useMemo(() => {
    if (!data) return null

    const hiddenRoleIds = roles
      .filter((role) => role.visibility === Visibility.HIDDEN)
      .map((role) => role.id)

    if (!hiddenRoleIds.length)
      return data.map((user) => ({ ...user, roleIds: { public: user.roleIds } }))

    return data.map((user) => ({
      ...user,
      roleIds: {
        hidden: user.roleIds.filter((roleId) => hiddenRoleIds.includes(roleId)),
        public: user.roleIds.filter((roleId) => !hiddenRoleIds.includes(roleId)),
      },
    }))
  }, [data, roles])

  return {
    data: transformedData,
    ...rest,
  }
}

export default useMembers
