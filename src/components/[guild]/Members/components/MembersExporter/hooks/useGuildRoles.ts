import useGuild from "components/[guild]/hooks/useGuild"
import useSWRImmutable from "swr/immutable"
import { Role } from "types"
import fetcher from "utils/fetcher"

const fetchGuildRoles = (...roleIds: number[]) =>
  Promise.all(roleIds.map((roleId) => fetcher(`/role/${roleId}`)))

const useGuildRoles = (): { guildRoles: Role[]; isGuildRolesLoading: boolean } => {
  const { roles } = useGuild()
  const roleIds = roles.map((role) => role.id)

  const { data: guildRoles, isValidating: isGuildRolesLoading } = useSWRImmutable(
    roleIds?.length ? roleIds : null,
    fetchGuildRoles
  )

  return { guildRoles, isGuildRolesLoading }
}

export default useGuildRoles
