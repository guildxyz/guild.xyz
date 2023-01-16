import { Img } from "@chakra-ui/react"
import { RPC } from "connectors"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import shortenHex from "utils/shortenHex"
import Requirement from "../common/Requirement"

const CaskRequirement = ({ requirement, ...rest }: RequirementComponentProps) => (
  <Requirement image={<Img src="/requirementLogos/cask.png" />} {...rest}>
    {`Subscribe to plan `}
    <DataBlock>{`#${requirement.data.planId}`}</DataBlock>
    {` by `}
    <DataBlock>{shortenHex(requirement.data.provider)}</DataBlock>
    {` on Cask Protocol (${RPC[requirement.chain].chainName})`}
  </Requirement>
)

export default CaskRequirement
