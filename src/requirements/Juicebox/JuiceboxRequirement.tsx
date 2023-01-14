import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "../common/Requirement"
import { useJuiceboxProject } from "./hooks/useJuicebox"

const JuiceboxRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => {
  const { project, isLoading, error } = useJuiceboxProject(requirement?.data?.id)

  return (
    <Requirement
      image={isLoading ? "" : project?.logoUri}
      isImageLoading={isLoading}
      {...rest}
    >
      {`Hold ${
        requirement.data?.minAmount > 0
          ? `at least ${requirement.data?.minAmount}`
          : "any amount of"
      } `}

      <DataBlock
        isLoading={isLoading}
        error={error && "API error, please contact Juicebox to report."}
      >
        {project.name}
      </DataBlock>
      {" ticket(s) in Juicebox"}
    </Requirement>
  )
}

export default JuiceboxRequirement
