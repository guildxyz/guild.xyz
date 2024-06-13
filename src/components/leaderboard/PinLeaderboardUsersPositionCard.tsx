import CardMotionWrapper from "components/common/CardMotionWrapper"
import useUsersGuildPins from "hooks/useUsersGuildPins"
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
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        address={address}
        score={data.score}
        position={data.position}
        // @ts-expect-error TODO: fix this error originating from strictNullChecks
        pinMetadataArray={usersGuildPins}
      />
    </CardMotionWrapper>
  ) : null
}

export default PinLeaderboardUsersPositionCard
