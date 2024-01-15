import { Text } from "@chakra-ui/react"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { APP_DETAILS } from "./Web3InboxForm"

const Web3InboxRequirement = (props: RequirementProps) => {
  const { data } = useRequirementContext()

  return (
    <Requirement image={APP_DETAILS[data.app].image} {...props}>
      <Text as="span">
        {`Subscribe to ${APP_DETAILS[data.app].name} on Web3Inbox`}
      </Text>
    </Requirement>
  )
}
export default Web3InboxRequirement
