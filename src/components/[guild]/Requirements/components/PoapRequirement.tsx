import { usePoap } from "components/create-guild/Requirements/components/PoapForm/hooks/usePoaps"
import { RequirementComponentProps } from "types"
import Requirement from "./common/Requirement"

const PoapRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { poap, isLoading } = usePoap(requirement?.data?.id)

  return (
    <Requirement
      image={isLoading ? "" : poap?.image_url}
      loading={isLoading}
      {...rest}
    >
      {`Own the ${poap?.name ?? requirement.data?.id} POAP`}
    </Requirement>
  )
}

export default PoapRequirement
