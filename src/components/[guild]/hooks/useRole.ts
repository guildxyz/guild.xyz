import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { SimpleRole } from "types"

const useRole = (guildId: number | string, roleId: number) => {
  const { data, mutate, isLoading, error, isSigned } =
    useSWRWithOptionalAuth<SimpleRole>(
      guildId && roleId ? `/v2/guilds/${guildId}/roles/${roleId}` : null,
      undefined,
      undefined,
      false
    )

  return {
    ...data,
    isDetailed: isSigned,
    isLoading,
    error,
    mutate,
  }
}

export default useRole
