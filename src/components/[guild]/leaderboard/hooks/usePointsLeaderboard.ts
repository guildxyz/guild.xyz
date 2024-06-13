import { Leaderboard } from "@guildxyz/types"
import useGuild from "components/[guild]/hooks/useGuild"
import useSWRWithOptionalAuth from "hooks/useSWRWithOptionalAuth"
import { useRouter } from "next/router"

export type PointsLeaderboardResponse = {
  isRevalidating: boolean
  leaderboard: Leaderboard
  aroundUser?: Leaderboard
}

const usePointsLeaderboard = () => {
  const { id: guildId } = useGuild()
  const { query } = useRouter()

  return useSWRWithOptionalAuth<PointsLeaderboardResponse>(
    guildId ? `/v2/guilds/${guildId}/points/${query.pointsId}/leaderboard` : null,
    { revalidateOnMount: true },
    false,
    false
  )
}

export default usePointsLeaderboard
