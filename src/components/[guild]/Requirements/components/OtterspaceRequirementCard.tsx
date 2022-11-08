import { Skeleton } from "@chakra-ui/react"
import useOtterspaceBadges from "components/create-guild/Requirements/components/OtterspaceFormCard/hooks/useOtterspaceBadges"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const OtterspaceRequirementCard = ({ requirement, ...rest }: Props) => {
  const { data, isValidating } = useOtterspaceBadges()
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <RequirementCard image={badge?.img} {...rest}>
      {`Have the `}
      <Skeleton as="span" isLoaded={!!data}>
        {isValidating ? "Loading..." : badge?.label}
      </Skeleton>
      {` Otterspace badge`}
    </RequirementCard>
  )
}

export default OtterspaceRequirementCard
