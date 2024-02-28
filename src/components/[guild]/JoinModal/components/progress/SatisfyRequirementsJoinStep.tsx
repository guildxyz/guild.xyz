import { StackProps } from "@chakra-ui/react"
import { ReactNode, useMemo } from "react"
import { JoinState } from "../../utils/mapAccessJobState"
import ProgressJoinStep from "./components/ProgressJoinStep"

const SatisfyRequirementsJoinStep = ({
  joinState,
  fallbackText,
  ...stackProps
}: {
  joinState: JoinState
  fallbackText?: JSX.Element
  RightComponent?: ReactNode
} & StackProps) => {
  const status = useMemo(() => {
    switch (joinState?.state) {
      case "NO_ACCESS":
        return "ERROR"

      case "MANAGING_ROLES":
      case "MANAGING_REWARDS":
      case "FINISHED":
        return "DONE"

      case "PREPARING":
      case "CHECKING":
        return "LOADING"

      default:
        return "INACTIVE"
    }
  }, [joinState])

  return (
    <ProgressJoinStep
      title="Satisfy the requirements"
      countLabel={
        status === "LOADING" ? "requirements checked" : "requirements satisfied"
      }
      status={status}
      // so we render the no access fallbackText from JoinModal in case of no access
      total={status !== "ERROR" && joinState?.requirements?.all}
      current={
        status === "LOADING"
          ? joinState?.requirements?.checked
          : joinState?.requirements?.satisfied
      }
      fallbackText={
        fallbackText ||
        (status === "ERROR" ? "No accessed requirements" : "Preparing access check")
      }
      {...stackProps}
    />
  )
}

export { ProgressJoinStep }
export default SatisfyRequirementsJoinStep
