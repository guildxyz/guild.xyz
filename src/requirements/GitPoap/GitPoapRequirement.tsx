import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"
import { usePoap } from "../Poap/hooks/usePoaps"

const GitPoapRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { poap, isLoading } = usePoap(requirement?.data?.id)

  return (
    <Requirement
      image={isLoading ? "" : poap?.image_url}
      isImageLoading={isLoading}
      {...rest}
    >
      {`Own the ${
        poap?.name ? poap.name.replace("GitPOAP: ", "") : requirement.data?.id
      } GitPOAP`}
    </Requirement>
  )
}

export default GitPoapRequirement
