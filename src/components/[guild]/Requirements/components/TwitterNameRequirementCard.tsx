import { Icon } from "@chakra-ui/react"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterNameRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={TwitterLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="TWITTER" />}
  >
    {`Have "${requirement.data.id}" in your username`}
  </RequirementCard>
)

export default TwitterNameRequirementCard
