import useGuild from "components/[guild]/hooks/useGuild"
import { useMemo } from "react"
import { JoinState } from "../../utils/mapAccessJobState"
import ProgressJoinStep from "./components/ProgressJoinStep"

const GetRewardsJoinStep = ({ joinState }: { joinState: JoinState }) => {
  const status = useMemo(() => {
    if (joinState?.state === "NO_ACCESS") return "NO_ACCESS"

    if (joinState?.state === "MANAGING_REWARDS") return "LOADING"

    const hasAllRewards =
      !!joinState?.rewards && joinState?.rewards?.granted === joinState?.rewards?.all

    if (joinState?.state === "FINISHED" || hasAllRewards) return "DONE"

    return "INACTIVE"
  }, [joinState])

  /**
   * JoinState doesn't include rewards that we don't have the platform connected to,
   * so we calculate the total count by guild data (we can only do this, until we get
   * all rewards on the guild-page endpoint). But that doesn't include rewards
   * that're secret and we don't see yet (and joinState does), so we just show the
   * larger amount of these two
   */
  const { roles } = useGuild()
  const allRelevantRewardsCount = roles
    .filter((role) => joinState?.roleIds?.includes(role.id))
    .flatMap((role) => role.rolePlatforms)?.length
  const totalRewardsToShow = Math.max(
    joinState?.rewards?.all,
    allRelevantRewardsCount
  )

  return (
    <ProgressJoinStep
      title="Get rewards"
      countLabel="rewards granted"
      status={status}
      total={totalRewardsToShow}
      current={status === "NO_ACCESS" ? 0 : joinState?.rewards?.granted}
      fallbackText={
        status === "NO_ACCESS"
          ? "No rewards will be granted"
          : "Evaluating which rewards you will get"
      }
    />
  )
}

export default GetRewardsJoinStep
