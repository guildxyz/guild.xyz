import { Icon } from "@chakra-ui/react"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectPlatformButton from "./common/ConnectPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterNameRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={TwitterLogo} boxSize={6} />}
    footer={<ConnectPlatformButton platform="TWITTER" />}
  >
    Have "{requirement.data.id}" in your username
  </RequirementCard>
)

export default TwitterNameRequirementCard
