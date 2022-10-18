import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
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
    {`Have "`}
    <DataBlock>{requirement.data.id}</DataBlock>
    {`" in your username`}
  </RequirementCard>
)

export default TwitterNameRequirementCard
