import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { useJuiceboxProject } from "./hooks/useJuicebox"

const JuiceboxRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { project, isLoading, error } = useJuiceboxProject(requirement.data.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={project?.logoUri}
      isImageLoading={isLoading}
      {...props}
    >
      {`Hold ${
        requirement.data?.minAmount > 0
          ? `at least ${requirement.data.minAmount}`
          : "any amount of"
      } `}

      <DataBlock
        isLoading={isLoading}
        error={error && "API error, please contact Juicebox to report."}
      >
        {project?.name ?? `#${requirement.data.id}`}
      </DataBlock>
      {" ticket(s) in Juicebox"}
    </Requirement>
  )
}

export default JuiceboxRequirement
