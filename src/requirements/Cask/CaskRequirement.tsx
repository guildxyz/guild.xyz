import { Img } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { RPC } from "connectors"
import shortenHex from "utils/shortenHex"

const CaskRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement image={<Img src="/requirementLogos/cask.png" />} {...props}>
      {`Subscribe to plan `}
      <DataBlock>{`#${requirement.data.planId}`}</DataBlock>
      {` by `}
      <DataBlock>{shortenHex(requirement.data.provider)}</DataBlock>
      {` on Cask Protocol (${RPC[requirement.chain].chainName})`}
    </Requirement>
  )
}

export default CaskRequirement
