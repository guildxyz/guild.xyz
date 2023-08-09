import { useWeb3React } from "@web3-react/core"
import useSWRImmutable from "swr/immutable"

const useUsersLeaderboardPosition = () => {
  const { account } = useWeb3React()

  return useSWRImmutable<{
    score: number
    position: number
  }>(account ? `/api/leaderboard/${account}` : null)
}

export default useUsersLeaderboardPosition
