import { RequirementCardComponentProps } from "types"
import RequirementCard from "../common/RequirementCard"
import usePoap from "./hooks/usePoap"

const GitPoapRequirementCard = ({
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
      {`Own the ${
        poap?.name ? poap.name.replace("GitPOAP: ", "") : requirement.data?.id
      } GitPOAP`}
    </RequirementCard>
  )
}

export default GitPoapRequirementCard
