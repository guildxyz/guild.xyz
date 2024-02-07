import { useMemo } from "react"
import { JoinState } from "../../utils/mapAccessJobState"
import ProgressJoinStep from "./components/ProgressJoinStep"

const GetRewardsJoinStep = ({ joinState }: { joinState: JoinState }) => {
  const status = useMemo(() => {
    const hasAllRewards =
      !!joinState?.rewards && joinState?.rewards?.granted === joinState?.rewards?.all

    if (joinState?.state === "FINISHED" || hasAllRewards) return "DONE"

    if (joinState?.state === "MANAGING_REWARDS") return "LOADING"

    return "INACTIVE"
  }, [joinState])

  return (
    <ProgressJoinStep
      title="Get rewards"
      countLabel="rewards granted"
      status={status}
      total={joinState?.rewards?.all}
      current={joinState?.rewards?.granted}
      fallbackText="Evaluating which rewards you will get"
    />
  )
}

export default GetRewardsJoinStep
