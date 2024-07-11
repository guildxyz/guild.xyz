import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { GuildBase } from "types"

const useYourGuilds = () =>
  useSWRWithOptionalAuth<GuildBase[]>(
    `/v2/guilds?yours=true`,
    undefined,
    false,
    true
  )

export { useYourGuilds }
