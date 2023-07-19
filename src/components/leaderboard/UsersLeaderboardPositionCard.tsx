import { useWeb3React } from "@web3-react/core"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import useUsersGuildPins from "hooks/useUsersGuildPins"
import LeaderboardUserCard, {
  LeaderboardUserCardSkeleton,
} from "./LeaderboardUserCard"
import useUsersLeaderboardPosition from "./hooks/useUsersLeaderboardPosition"

const UsersLeaderboardPositionCard = () => {
  const { account } = useWeb3React()
  const { data, isLoading } = useUsersLeaderboardPosition()

  const { data: usersGuildPins } = useUsersGuildPins()

  return isLoading ? (
    <LeaderboardUserCardSkeleton />
  ) : data ? (
    <CardMotionWrapper>
      <LeaderboardUserCard
        address={account}
        score={data.score}
        position={data.position}
        pinMetadataArray={usersGuildPins}
      />
    </CardMotionWrapper>
  ) : null
}

export default UsersLeaderboardPositionCard
