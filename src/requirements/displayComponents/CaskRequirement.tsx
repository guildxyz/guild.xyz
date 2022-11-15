import { Img } from "@chakra-ui/react"
import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "types"
import shortenHex from "utils/shortenHex"
import Requirement from "./common/Requirement"

const CaskRequirement = ({ requirement, ...rest }: RequirementComponentProps) => (
  <Requirement image={<Img src="/requirementLogos/cask.png" />} {...rest}>
    {`Subscribe to plan `}
    <DataBlock>{`#${requirement.data.planId}`}</DataBlock>
    {` by `}
    <DataBlock>{shortenHex(requirement.data.provider)}</DataBlock>
    {` on Cask Protocol`}
  </Requirement>
)

export default CaskRequirement
