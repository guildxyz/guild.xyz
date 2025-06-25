import useSWRImmutable from "swr/immutable"
import fetcher from "utils/fetcher"
import { ALPHA_GUILDS_API_URL, ALPHA_GUILDS_SWR_KEY } from "../consts"
import { AlphaGuild } from "../types"

export const useAlphaGuilds = () =>
  useSWRImmutable(ALPHA_GUILDS_SWR_KEY, () =>
    fetcher(ALPHA_GUILDS_API_URL).then((guilds: AlphaGuild[]) =>
      guilds.filter((g) => g.isVerified)
    )
  )
