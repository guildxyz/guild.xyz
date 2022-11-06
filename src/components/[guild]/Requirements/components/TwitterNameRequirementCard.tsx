import { Icon } from "@chakra-ui/react"
import DataBlockWithCopy from "components/common/DataBlockWithCopy"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterNameRequirementCard = ({ requirement, ...rest }: Props) => (
  <RequirementCard
    image={<Icon as={TwitterLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="TWITTER" />}
    {...rest}
  >
    {`Have "`}
    <DataBlockWithCopy text={requirement.data.id} />
    {`" in your username`}
  </RequirementCard>
)

export default TwitterNameRequirementCard
