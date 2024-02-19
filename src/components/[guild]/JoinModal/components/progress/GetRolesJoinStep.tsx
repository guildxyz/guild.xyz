import { useMemo } from "react"
import { JoinState } from "../../utils/mapAccessJobState"
import ProgressJoinStep from "./components/ProgressJoinStep"

const GetRolesJoinStep = ({ joinState }: { joinState: JoinState }) => {
  const status = useMemo(() => {
    switch (joinState?.state) {
      case "MANAGING_REWARDS":
      case "FINISHED":
        return "DONE"

      case "MANAGING_ROLES":
        return "LOADING"

      default:
        return "INACTIVE"
    }
  }, [joinState])

  return (
    <ProgressJoinStep
      title="Get roles"
      countLabel="roles granted"
      status={status}
      total={joinState?.roles?.all}
      current={joinState?.roles?.granted}
      fallbackText="Evaluating which roles you have access to"
    />
  )
}

export default GetRolesJoinStep
