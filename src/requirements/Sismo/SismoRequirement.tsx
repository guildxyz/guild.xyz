import { Skeleton } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"
import useSismoBadges from "./hooks/useSismoBadges"

const SismoRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { data, isValidating } = useSismoBadges(requirement.data.type)
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={badge?.img}
      withImgBg={false}
      {...rest}
    >
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
