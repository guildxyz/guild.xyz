import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DataBlock } from "components/common/DataBlock"

const YupRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/requirementLogos/yup.svg" {...props}>
      <span>{`Have a Yup Score of at least ${requirement.data.minAmount} `}</span>
      {requirement.data.adapter && (
        <>
          <span>{" from the "}</span>
          <DataBlock>{requirement.data.adapter}</DataBlock>
          <span>{" adapter"}</span>
        </>
      )}
    </Requirement>
  )
}

export default YupRequirement
