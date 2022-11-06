import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { Requirement } from "types"
import { RequirementLinkButton } from "./common/RequirementButton"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const OrangeRequirementCard = ({ requirement }: Props) => (
  <RequirementCard
    image={<Img src="/requirementLogos/orange.png" />}
    footer={
      <RequirementLinkButton
        imageUrl="https://app.orangeprotocol.io/logo.svg"
        href={`https://app.orangeprotocol.io/campaigns/details/${requirement.data.id}`}
      >
        View campaign
      </RequirementLinkButton>
    }
  >
    {`Have the badge of Orange campaign `}
    <DataBlock>{`#${requirement.data.id}`}</DataBlock>
  </RequirementCard>
)

export default OrangeRequirementCard
