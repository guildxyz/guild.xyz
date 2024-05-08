import useSWRImmutable from "swr/immutable"
import { Requirement } from "types"
import useGuild from "./useGuild"

const useRequirement = (roleId: number, requirementId: number, search?: string) => {
  const { id: guildId } = useGuild()

  return useSWRImmutable<Requirement>(
    guildId && roleId && requirementId
      ? [
          `/v2/guilds/${guildId}/roles/${roleId}/requirements/${requirementId}${
            search ? `?search=${search}` : ""
          }`,
          { method: "GET" },
        ]
      : null
  )
}

export default useRequirement
