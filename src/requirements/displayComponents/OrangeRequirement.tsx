import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "types"
import Requirement from "./common/Requirement"
import { RequirementLinkButton } from "./common/RequirementButton"

const OrangeRequirement = ({ requirement, ...rest }: RequirementComponentProps) => (
  <Requirement
    image={<Img src="/requirementLogos/orange.png" />}
    footer={
      <RequirementLinkButton
        imageUrl="https://app.orangeprotocol.io/logo.svg"
        href={`https://app.orangeprotocol.io/campaigns/details/${requirement.data.id}`}
      >
        View campaign
      </RequirementLinkButton>
    }
    {...rest}
  >
    {`Have the badge of Orange campaign `}
    <DataBlock>{`#${requirement.data.id}`}</DataBlock>
  </Requirement>
)

export default OrangeRequirement
