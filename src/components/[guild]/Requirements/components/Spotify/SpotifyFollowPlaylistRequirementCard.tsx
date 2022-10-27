import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { SpotifyLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import RequirementCard from "../common/RequirementCard"

const SpotifyFollowPlaylistRequirementCard = ({
  requirement,
}: {
  requirement: Requirement
}) => (
  <RequirementCard
    requirement={requirement}
    image={requirement?.data?.img ?? <Icon as={SpotifyLogo} boxSize={6} />}
    footer={<ConnectRequirementPlatformButton platform="SPOTIFY" />}
  >
    Follow the <DataBlock>{requirement.data?.label}</DataBlock> playlist
  </RequirementCard>
)

export default SpotifyFollowPlaylistRequirementCard
