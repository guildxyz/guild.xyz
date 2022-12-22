import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"
import { usePoap } from "./hooks/usePoaps"

const PoapRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { poap, isLoading } = usePoap(requirement?.data?.id)

  return (
    <Requirement
      image={isLoading ? "" : poap?.image_url}
      isImageLoading={isLoading}
      {...rest}
    >
      {`Own the ${poap?.name ?? requirement.data?.id} POAP`}
    </Requirement>
  )
}

export default PoapRequirement
