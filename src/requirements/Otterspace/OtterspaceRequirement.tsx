import { Skeleton } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"
import useOtterspaceBadges from "./hooks/useOtterspaceBadges"

const OtterspaceRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps) => {
  const { data, isValidating, error } = useOtterspaceBadges(requirement.chain)
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement image={badge?.img} errorApiName={error && "Otterspace"} {...rest}>
      {`Have the `}
      <Skeleton as="span" isLoaded={!!data}>
        {isValidating ? "Loading..." : badge?.label}
      </Skeleton>
      {` Otterspace badge`}
    </Requirement>
  )
}

export default OtterspaceRequirement
