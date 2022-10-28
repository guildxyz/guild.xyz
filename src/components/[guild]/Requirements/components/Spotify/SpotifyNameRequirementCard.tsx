import { Icon } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { SpotifyLogo } from "phosphor-react"
import { Requirement, SpotifyParamType } from "types"
import ConnectRequirementPlatformButton from "../common/ConnectRequirementPlatformButton"
import RequirementCard from "../common/RequirementCard"

type Props = {
  requirement: Requirement
}

const SpotifyNameRequirementCard = ({ requirement }: Props) => {
  const { img } = (requirement?.data?.params as SpotifyParamType) ?? {}

  return (
    <RequirementCard
      requirement={requirement}
      image={img ?? <Icon as={SpotifyLogo} boxSize={6} />}
      footer={<ConnectRequirementPlatformButton platform="SPOTIFY" />}
    >
      Have <DataBlock>{requirement.data.id}</DataBlock> in your username
    </RequirementCard>
  )
}

export default SpotifyNameRequirementCard
