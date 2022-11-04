import { Icon, Wrap } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { SpotifyLogo } from "phosphor-react"
import { Requirement, SpotifyParamType } from "types"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import { RequirementLinkButton } from "../common/RequirementButton"
import RequirementCard from "../common/RequirementCard"
import { termToLabel } from "./SoptifyTopTracksRequirementCard"

const SpotifyTopArtistsRequirementCard = ({
  requirement,
}: {
  requirement: Requirement
}) => {
  const { img, label, term } = (requirement?.data?.params as SpotifyParamType) ?? {}

  return (
    <RequirementCard
      requirement={requirement}
      image={img ?? <Icon as={SpotifyLogo} boxSize={6} />}
      footer={
        <Wrap spacing={5}>
          <RequirementLinkButton
            href={`https://open.spotify.com/artist/${requirement?.data?.id}`}
            imageUrl={"/requirementLogos/spotify.svg"}
          >
            View on Spotify
          </RequirementLinkButton>
          <ConnectRequirementPlatformButton platform="SPOTIFY" />
        </Wrap>
      }
    >
      Have <DataBlock>{label}</DataBlock> in your top{" "}
      <DataBlock>{requirement?.data?.minAmount}</DataBlock> listened artists in the{" "}
      {termToLabel[term]}
    </RequirementCard>
  )
}

export default SpotifyTopArtistsRequirementCard
