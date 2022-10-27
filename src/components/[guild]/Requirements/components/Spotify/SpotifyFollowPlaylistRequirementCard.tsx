import { Icon, Wrap } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { SpotifyLogo } from "phosphor-react"
import { Requirement } from "types"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import { RequirementLinkButton } from "../common/RequirementButton"
import RequirementCard from "../common/RequirementCard"

const SpotifyFollowPlaylistRequirementCard = ({
  requirement,
}: {
  requirement: Requirement
}) => (
  <RequirementCard
    requirement={requirement}
    image={requirement?.data?.img ?? <Icon as={SpotifyLogo} boxSize={6} />}
    footer={
      <Wrap spacing={5}>
        <RequirementLinkButton
          href={`https://open.spotify.com/playlist/${requirement?.data?.id}`}
          imageUrl={"/requirementLogos/spotify.svg"}
        >
          View on Spotify
        </RequirementLinkButton>
        <ConnectRequirementPlatformButton platform="SPOTIFY" />
      </Wrap>
    }
  >
    Follow the <DataBlock>{requirement.data?.label}</DataBlock> playlist
  </RequirementCard>
)

export default SpotifyFollowPlaylistRequirementCard
