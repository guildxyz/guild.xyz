import useSWRImmutable from "swr/immutable"
import { useAccount } from "wagmi"

const useUsersLeaderboardPosition = () => {
  const { address } = useAccount()

  return useSWRImmutable<{
    score: number
    position: number
  }>(address ? `/api/leaderboard/${address}` : null)
}

export default useUsersLeaderboardPosition
