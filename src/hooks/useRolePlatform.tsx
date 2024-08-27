import { RolePlatform } from "types"
import useSWRWithOptionalAuth from "./useSWRWithOptionalAuth"

type Props = { guildId?: number; roleId?: number; rolePlatformId?: number }

export const useRolePlatform = ({ guildId, roleId, rolePlatformId }: Props) => {
  const shouldFetch = guildId && roleId && rolePlatformId

  const { data, ...rest } = useSWRWithOptionalAuth<RolePlatform>(
    shouldFetch
      ? `/v2/guilds/${guildId}/roles/${roleId}/rolePlatforms/${rolePlatformId}`
      : null,
    undefined,
    false,
    false
  )

  return {
    rolePlatform: data,
    ...rest,
  }
}
