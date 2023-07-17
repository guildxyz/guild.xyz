import { useWeb3React } from "@web3-react/core"
import useUsersGuildPins from "hooks/useUsersGuildPins"
import useUsersLeaderboardPosition from "./hooks/useUsersLeaderboardPosition"
import LeaderboardUserCard, {
  LeaderboardUserCardSkeleton,
} from "./LeaderboardUserCard"

const UsersLeaderboardPositionCard = () => {
  const { account } = useWeb3React()
  const { data, isLoading } = useUsersLeaderboardPosition()

  const { data: usersGuildPins } = useUsersGuildPins()

  if (!account) return null

  return isLoading ? (
    <LeaderboardUserCardSkeleton />
  ) : data ? (
    <LeaderboardUserCard
      address={account}
      score={data.score}
      position={data.position}
      pinMetadataArray={usersGuildPins}
    />
  ) : null
}

export default UsersLeaderboardPositionCard
