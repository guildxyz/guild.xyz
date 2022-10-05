import { Requirement } from "types"
import RequirementCard from "../common/RequirementCard"
import usePoap from "./hooks/usePoap"

type Props = {
  requirement: Requirement
}

const GitPoapRequirementCard = ({ requirement }: Props) => {
  const { poap, isLoading } = usePoap(requirement?.data?.id)

  return (
    <RequirementCard
      requirement={requirement}
      image={isLoading ? "" : poap?.image_url}
      loading={isLoading}
    >
      {`Own the ${
        poap?.name ? poap.name.replace("GitPOAP: ", "") : requirement.data?.id
      } GitPOAP`}
    </RequirementCard>
  )
}

export default GitPoapRequirementCard
