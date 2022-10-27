import { Icon } from "@chakra-ui/react"
import { SpotifyLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import RequirementCard from "../common/RequirementCard"

type Props = {
  requirement: Requirement
}

const SpotifyFollowerCountRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    requirement={requirement}
    image={requirement?.data?.img ?? <Icon as={SpotifyLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="SPOTIFY" />}
  >
    {`Have at least ${Math.floor(requirement.data.minAmount)} followers`}
  </RequirementCard>
)

export default SpotifyFollowerCountRequirementCard
