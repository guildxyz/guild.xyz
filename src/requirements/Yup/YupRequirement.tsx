import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

const YupRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/requirementLogos/yup.svg" {...props}>
      {`Have a Yup Score of at least ${requirement.data.minAmount} `}
      {requirement.data.adapter && (
        <>
          {" from the "}
          <DataBlock>{requirement.data.adapter}</DataBlock>
          {" adapter"}
        </>
      )}
    </Requirement>
  )
}

export default YupRequirement
