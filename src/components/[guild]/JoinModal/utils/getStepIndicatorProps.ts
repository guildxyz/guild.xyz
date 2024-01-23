import { JoinStepIndicator } from "../components/JoinStep"
import { JoinState } from "./mapAccessJobState"

export const getJoinStepIndicatorProps = (
  entity: "role" | "reward" | "requirement",
  joinState: JoinState
): Parameters<typeof JoinStepIndicator>[number] => {
  if (!joinState) {
    return { status: "INACTIVE" }
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
    if (joinState.state === "MANAGING_REWARDS" && joinState.rewards) {
      return {
        status: "PROGRESS",
        progress: (joinState.rewards.granted / joinState.rewards.all) * 100,
      }
    }

    if (joinState.state === "MANAGING_REWARDS") {
      return { status: "LOADING" }
    }

    if (joinState.state === "FINISHED") {
      return { status: "DONE" }
    }

    return { status: "INACTIVE" }
  }

  // For these, entity === "role" is true
  if (joinState.state === "MANAGING_ROLES") {
    return { status: "LOADING" }
  }

  return { status: "DONE" }
}
