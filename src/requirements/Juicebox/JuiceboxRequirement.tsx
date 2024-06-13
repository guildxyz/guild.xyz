import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import DataBlock from "components/common/DataBlock"
import { useJuiceboxProject } from "./hooks/useJuicebox"

const JuiceboxRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const { project, isLoading, error } = useJuiceboxProject(requirement.data.id)

  return (
    <Requirement image={project?.logoUri} isImageLoading={isLoading} {...props}>
      {`Hold ${
        requirement.data?.minAmount > 0
          ? // @ts-expect-error TODO: fix this error originating from strictNullChecks
            `at least ${requirement.data.minAmount}`
          : "any amount of"
      } `}

      <DataBlock
        isLoading={isLoading}
        error={error && "API error, please contact Juicebox to report."}
      >
        {/* @ts-expect-error TODO: fix this error originating from strictNullChecks */}
        {project?.name ?? `#${requirement.data.id}`}
      </DataBlock>
      {" ticket(s) in Juicebox"}
    </Requirement>
  )
}

export default JuiceboxRequirement
