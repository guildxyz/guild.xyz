import { Icon } from "@chakra-ui/react"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterFollowerCountRequirementCard = ({ requirement, ...rest }: Props) => (
  <RequirementCard
    image={<Icon as={TwitterLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="TWITTER" />}
    {...rest}
  >
    {`Have at least ${Math.floor(requirement.data.minAmount)} followers`}
  </RequirementCard>
)

export default TwitterFollowerCountRequirementCard
