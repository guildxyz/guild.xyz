import { Icon } from "@chakra-ui/react"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterBioRequirementCard = ({ requirement, ...rest }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={TwitterLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="TWITTER" />}
    {...rest}
  >
    {`Have "`}
    <pre>{requirement.data.id}</pre>
    {`" in your bio`}
  </RequirementCard>
)

export default TwitterBioRequirementCard
