import useSWRImmutable from "swr/immutable"
import { useAccount } from "wagmi"

const usePinLeaderboardUsersPosition = () => {
  const { address } = useAccount()

  return useSWRImmutable<{
    score: number
    position: number
  }>(address ? `/api/leaderboard/${address}` : null)
}

export default usePinLeaderboardUsersPosition
