import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Requirement } from "types"
import useGuild from "./useGuild"

const useRequirement = (roleId: number, requirementId: number, search?: string) => {
  const { id: guildId } = useGuild()

  return useSWRWithOptionalAuth<Requirement>(
    guildId && roleId && requirementId
      ? `/v2/guilds/${guildId}/roles/${roleId}/requirements/${requirementId}${
          search ? `?search=${search}` : ""
        }`
      : null
  )
}

export default useRequirement
