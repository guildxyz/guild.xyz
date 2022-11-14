import { Skeleton } from "@chakra-ui/react"
import useOtterspaceBadges from "components/create-guild/Requirements/components/OtterspaceFormCard/hooks/useOtterspaceBadges"
import { RequirementComponentProps } from "types"
import Requirement from "./common/Requirement"

const OtterspaceRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => {
  const { data, isValidating } = useOtterspaceBadges()
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement image={badge?.img} {...rest}>
      {`Have the `}
      <Skeleton as="span" isLoaded={!!data}>
        {isValidating ? "Loading..." : badge?.label}
      </Skeleton>
      {` Otterspace badge`}
    </Requirement>
  )
}

export default OtterspaceRequirement
