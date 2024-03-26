import { Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import useGuild from "./useGuild"

const useRequirements = (roleId: number) => {
  const { id: guildId } = useGuild()

  // TODO: authenticated request
  return useSWRImmutable<Schemas["Requirement"][]>(
    guildId && roleId ? `/v2/guilds/${guildId}/roles/${roleId}/requirements` : null
  )
}

export default useRequirements
