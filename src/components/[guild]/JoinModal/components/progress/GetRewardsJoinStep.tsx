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

  return (
    <ProgressJoinStep
      title="Get rewards"
      countLabel="rewards granted"
      status={status}
      total={joinState?.rewards?.all}
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
