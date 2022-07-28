import { Icon } from "@chakra-ui/react"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterFollowerCountRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={TwitterLogo} boxSize={6} />}
  >
    Have at least {Math.floor(requirement.data.minAmount)} followers
  </RequirementCard>
)

export default TwitterFollowerCountRequirementCard
