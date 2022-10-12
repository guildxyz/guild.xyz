import { Skeleton } from "@chakra-ui/react"
import useOtterspaceBadges from "components/create-guild/Requirements/components/OtterspaceFormCard/hooks/useOtterspaceBadges"
import { Requirement } from "types"
import RequirementCard from "./common/RequirementCard"

type Props = {
  requirement: Requirement
}

const OtterspaceRequirementCard = ({ requirement }: Props) => {
  const { data, isValidating } = useOtterspaceBadges()
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <RequirementCard requirement={requirement} image={badge?.img}>
      {`Have the `}
      <Skeleton as="span" isLoaded={!!data}>
        {isValidating ? "Loading..." : badge?.label}
      </Skeleton>
      {` Otterspace badge`}
    </RequirementCard>
  )
}

export default OtterspaceRequirementCard
