import { Skeleton } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"
import useSismoBadges from "./hooks/useSismoBadges"
import { DEPRECATED_PLAYGROUND_ADDRESS } from "./SismoForm"

const SismoRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { data, isValidating } = useSismoBadges(
    requirement.chain,
    requirement.address === DEPRECATED_PLAYGROUND_ADDRESS
  )
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement image={badge?.img} withImgBg={false} {...rest}>
      {`Have the `}
      <Skeleton as="span" isLoaded={!!data}>
        {isValidating ? "Loading..." : badge?.label}
      </Skeleton>
      {` Sismo badge${
        requirement.data.type === "PLAYGROUND" ? " (Playground)" : ""
      }`}
    </Requirement>
  )
}

export default SismoRequirement
