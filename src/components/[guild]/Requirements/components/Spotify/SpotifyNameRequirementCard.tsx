import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { SpotifyLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import RequirementCard from "../common/RequirementCard"

type Props = {
  requirement: Requirement
}

const SpotifyNameRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={requirement?.data?.img ?? <Icon as={SpotifyLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="SPOTIFY" />}
  >
    Have <DataBlock>{requirement.data.id}</DataBlock> in your username
  </RequirementCard>
)

export default SpotifyNameRequirementCard
