import { Img } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import shortenHex from "utils/shortenHex"

const CaskRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  return (
    <Requirement
      image={<Img src="/requirementLogos/cask.png" />}
      footer={<RequirementChainIndicator />}
      {...props}
    >
      {`Subscribe to plan `}
      <DataBlock>{`#${requirement.data.planId}`}</DataBlock>
      {` by `}
      <DataBlock>{shortenHex(requirement.data.provider)}</DataBlock>
      {` on Cask Protocol`}
    </Requirement>
  )
}

export default CaskRequirement
