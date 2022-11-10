import { RequirementCardComponentProps } from "types"
import RequirementCard from "../common/RequirementCard"
import usePoap from "./hooks/usePoap"

const PoapRequirementCard = ({
  requirement,
  ...rest
}: RequirementCardComponentProps) => {
  const { poap, isLoading } = usePoap(requirement?.data?.id)

  return (
    <RequirementCard
      image={isLoading ? "" : poap?.image_url}
      loading={isLoading}
      {...rest}
    >
      {`Own the ${poap?.name ?? requirement.data?.id} POAP`}
    </RequirementCard>
  )
}

export default PoapRequirementCard
