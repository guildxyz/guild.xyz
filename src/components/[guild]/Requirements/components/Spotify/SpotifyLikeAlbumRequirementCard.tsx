import { Icon, Wrap } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { SpotifyLogo } from "phosphor-react"
import { Requirement, SpotifyParamType } from "types"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import { RequirementLinkButton } from "../common/RequirementButton"
import RequirementCard from "../common/RequirementCard"

const SpotifyLikeAlbumRequirementCard = ({
  requirement,
}: {
  requirement: Requirement
}) => {
  const { img, label, artist } =
    (requirement?.data?.params as SpotifyParamType) ?? {}

  return (
    <RequirementCard
      requirement={requirement}
      image={img ?? <Icon as={SpotifyLogo} boxSize={6} />}
      footer={
        <Wrap spacing={5}>
          <RequirementLinkButton
            href={`https://open.spotify.com/album/${requirement?.data?.id}`}
            imageUrl={"/requirementLogos/spotify.svg"}
          >
            View on Spotify
          </RequirementLinkButton>
          <ConnectRequirementPlatformButton platform="SPOTIFY" />
        </Wrap>
      }
    >
      Like the <DataBlock>{label}</DataBlock> album by{" "}
      <DataBlock>{artist ?? "Unknown artist"}</DataBlock>
    </RequirementCard>
  )
}

export default SpotifyLikeAlbumRequirementCard
