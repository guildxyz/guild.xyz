import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"

const YupRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
    <Requirement image="/requirementLogos/yup.svg" {...props}>
      {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
      {`Have a Yup Score of at least ${requirement.data.minAmount} `}
      {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
      {requirement.data.adapter && (
        <>
          {" from the "}
          {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
          <DataBlock>{requirement.data.adapter}</DataBlock>
          {" adapter"}
        </>
      )}
    </Requirement>
  )
}

export default YupRequirement
