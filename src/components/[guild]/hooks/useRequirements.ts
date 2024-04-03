import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { Requirement } from "types"
import useGuild from "./useGuild"

const useRequirements = (roleId: number) => {
  const { id: guildId } = useGuild()

  return useSWRWithOptionalAuth<Requirement[]>(
    guildId && roleId ? `/v2/guilds/${guildId}/roles/${roleId}/requirements` : null,
    undefined,
    false,
    false
  )
}

export default useRequirements
