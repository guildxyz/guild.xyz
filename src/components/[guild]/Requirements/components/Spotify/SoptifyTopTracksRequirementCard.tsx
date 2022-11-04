import { Icon, Wrap } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { SpotifyLogo } from "phosphor-react"
import { Requirement, SpotifyParamType } from "types"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import { RequirementLinkButton } from "../common/RequirementButton"
import RequirementCard from "../common/RequirementCard"

const termToLabel = {
  short: "last couple of weeks",
  medium: "last 6 months",
  long: "last years",
}

const SpotifyTopTracksRequirementCard = ({
  requirement,
}: {
  requirement: Requirement
}) => {
  const { img, label, artist, term } =
    (requirement?.data?.params as SpotifyParamType) ?? {}

  return (
    <RequirementCard
      requirement={requirement}
      image={img ?? <Icon as={SpotifyLogo} boxSize={6} />}
      footer={
        <Wrap spacing={5}>
          <RequirementLinkButton
            href={`https://open.spotify.com/track/${requirement?.data?.id}`}
            imageUrl={"/requirementLogos/spotify.svg"}
          >
            View on Spotify
          </RequirementLinkButton>
          <ConnectRequirementPlatformButton platform="SPOTIFY" />
        </Wrap>
      }
    >
      Have <DataBlock>{label}</DataBlock> by{" "}
      <DataBlock>{artist ?? "Unknown artist"}</DataBlock> in your top{" "}
      <DataBlock>{requirement?.data?.minAmount}</DataBlock> listened tracks in the{" "}
      {termToLabel[term]}
    </RequirementCard>
  )
}

export { termToLabel }
export default SpotifyTopTracksRequirementCard
