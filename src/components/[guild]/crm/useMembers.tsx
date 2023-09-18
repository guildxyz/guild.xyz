import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useMemo } from "react"
import { Visibility } from "types"
import useGuild from "../hooks/useGuild"

const useMembers = () => {
  const { roles, id } = useGuild()

  const { data, ...rest } = useSWRWithOptionalAuth(`/v2/crm/guilds/${id}/members`)

  const transformedData = useMemo(() => {
    if (!data) return null

    const hiddenRoleIds = roles
      .filter((role) => role.visibility === Visibility.HIDDEN)
      .map((role) => role.id)

    if (!hiddenRoleIds.length)
      return data.map((user) => ({ ...user, roles: { public: user.roleIds } }))

    return data.map((user) => ({
      ...user,
      roles: {
        hidden: user.roleIds.filter((role) => hiddenRoleIds.includes(role.roleId)),
        public: user.roleIds.filter((role) => !hiddenRoleIds.includes(role.roleId)),
      },
    }))
  }, [data, roles])

  return {
    data: transformedData,
    ...rest,
  }
}

export default useMembers
