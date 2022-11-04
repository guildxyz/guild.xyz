import { Icon } from "@chakra-ui/react"
import { SpotifyLogo } from "phosphor-react"
import { Requirement, SpotifyParamType } from "types"
import pluralize from "utils/pluralize"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import RequirementCard from "../common/RequirementCard"

type Props = {
  requirement: Requirement
}

const SpotifyFollowerCountRequirementCard = ({ requirement }: Props) => {
  const { img } = (requirement?.data?.params as SpotifyParamType) ?? {}

  return (
    <RequirementCard
      requirement={requirement}
      image={img ?? <Icon as={SpotifyLogo} boxSize={6} />}
      footer={<ConnectRequirementPlatformButton platform="SPOTIFY" />}
    >
      Have at least {pluralize(Math.floor(requirement.data.minAmount), "follower")}
    </RequirementCard>
  )
}

export default SpotifyFollowerCountRequirementCard
