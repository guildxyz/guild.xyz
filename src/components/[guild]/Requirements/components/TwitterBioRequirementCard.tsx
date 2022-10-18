import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/Pre"
import { TwitterLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "./common/ConnectRequirementPlatformButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const TwitterBioRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={<Icon as={TwitterLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="TWITTER" />}
  >
    {`Have "`}
    <DataBlock>{requirement.data.id}</DataBlock>
    {`" in your bio`}
  </RequirementCard>
)

export default TwitterBioRequirementCard
