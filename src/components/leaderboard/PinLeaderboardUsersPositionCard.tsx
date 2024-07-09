import useUsersGuildPins from "@/hooks/useUsersGuildPins"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { useAccount } from "wagmi"
import PinLeaderboardUserCard, {
  PinLeaderboardUserCardSkeleton,
} from "./PinLeaderboardUserCard"
import usePinLeaderboardUsersPosition from "./hooks/usePinLeaderboardUsersPosition"

const PinLeaderboardUsersPositionCard = () => {
  const { address } = useAccount()
  const { data, isLoading } = usePinLeaderboardUsersPosition()

  const { data: usersGuildPins } = useUsersGuildPins()

  return isLoading ? (
    <PinLeaderboardUserCardSkeleton />
  ) : data ? (
    <CardMotionWrapper>
      <PinLeaderboardUserCard
        address={address}
        score={data.score}
        position={data.position}
        pinMetadataArray={usersGuildPins}
      />
    </CardMotionWrapper>
  ) : null
}

export default PinLeaderboardUsersPositionCard
