import CardMotionWrapper from "components/common/CardMotionWrapper"
import useUsersGuildPins from "hooks/useUsersGuildPins"
import { useAccount } from "wagmi"
import LeaderboardUserCard, {
  LeaderboardUserCardSkeleton,
} from "./LeaderboardUserCard"
import useUsersLeaderboardPosition from "./hooks/useUsersLeaderboardPosition"

const UsersLeaderboardPositionCard = () => {
  const { address } = useAccount()
  const { data, isLoading } = useUsersLeaderboardPosition()

  const { data: usersGuildPins } = useUsersGuildPins()

  return isLoading ? (
    <LeaderboardUserCardSkeleton />
  ) : data ? (
    <CardMotionWrapper>
      <LeaderboardUserCard
        address={address}
        score={data.score}
        position={data.position}
        pinMetadataArray={usersGuildPins}
      />
    </CardMotionWrapper>
  ) : null
}

export default UsersLeaderboardPositionCard
