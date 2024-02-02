import { Text } from "@chakra-ui/react"
import { JoinState } from "../../../utils/mapAccessJobState"

const JoinStateCount = ({
  joinState,
  entity,
}: {
  joinState: JoinState
  entity: "role" | "reward" | "requirement"
}) => {
  if (!joinState) {
    return null
  }

  if (entity === "requirement" && joinState.requirements) {
    if (joinState.state === "CHECKING") {
      return (
        <Text>
          {joinState.requirements.checked}/{joinState.requirements.all} requirements
          checked
        </Text>
      )
    }

    return (
      <Text>
        {joinState.requirements.satisfied}/{joinState.requirements.all} requirements
        satisfied
      </Text>
    )
  }

  if (entity === "reward" && joinState.rewards) {
    return (
      <Text>
        {joinState.rewards.granted}/{joinState.rewards.all} rewards granted
      </Text>
    )
  }

  if (entity === "role" && joinState.roles) {
    return (
      <Text>
        {joinState.roles.granted}/{joinState.roles.all} roles granted
      </Text>
    )
  }

  return null
}

export default JoinStateCount
