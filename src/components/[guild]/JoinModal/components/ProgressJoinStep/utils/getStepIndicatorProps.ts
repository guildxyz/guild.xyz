import { JoinState } from "components/[guild]/JoinModal/utils/mapAccessJobState"
import { JoinStepIndicatorProps } from "../../../components/JoinStepIndicator"

// Q: Maybe only transition to a PROGRESS state, if at least 1 entity is "checked" / "granted"?
// If so, that should be handled in mapAccessJobState by not defining the counts until the smaller one is at least 1
export const getJoinStepIndicatorProps = (
  entity: "role" | "reward" | "requirement",
  joinState: JoinState
): JoinStepIndicatorProps => {
  if (!joinState) {
    return { status: "INACTIVE" }
  }

  if (joinState.state === "NO_ACCESS") {
    return { status: "ERROR" }
  }

  if (joinState.state === "INITIAL") {
    // Could be INACITVE for role & reward, but those are not shown in INITIAL state
    return { status: "LOADING" }
  }

  if (entity === "requirement") {
    if (joinState.state === "CHECKING" && !!joinState.requirements) {
      return {
        status: "PROGRESS",
        progress:
          (joinState.requirements.checked / joinState.requirements.all) * 100,
      }
    }

    if (
      joinState.state === "MANAGING_ROLES" ||
      joinState.state === "MANAGING_REWARDS" ||
      joinState.state === "FINISHED"
    ) {
      return { status: "DONE" }
    }

    return { status: "LOADING" }
  }

  if (entity === "reward") {
    const hasAllRewards =
      !!joinState.rewards && joinState.rewards.granted === joinState.rewards.all

    if (
      joinState.state === "MANAGING_REWARDS" &&
      joinState.rewards &&
      !hasAllRewards
    ) {
      return {
        status: "PROGRESS",
        progress: (joinState.rewards.granted / joinState.rewards.all) * 100,
      }
    }

    if (joinState.state === "FINISHED" || hasAllRewards) {
      return { status: "DONE" }
    }

    if (joinState.state === "MANAGING_REWARDS") {
      return { status: "LOADING" }
    }

    return { status: "INACTIVE" }
  }

  // For these, entity === "role" is true
  if (joinState.state === "MANAGING_ROLES") {
    return { status: "LOADING" }
  }

  return { status: "DONE" }
}
