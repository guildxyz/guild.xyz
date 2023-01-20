import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useSismoBadges from "./hooks/useSismoBadges"
import { DEPRECATED_PLAYGROUND_ADDRESS } from "./SismoForm"

const SismoRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data, isValidating, error } = useSismoBadges(
    requirement.chain,
    requirement.address === DEPRECATED_PLAYGROUND_ADDRESS
  )
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={badge?.img}
      isImageLoading={isValidating}
      withImgBg={false}
      {...props}
    >
      {`Have the `}
      <DataBlock
        isLoading={isValidating}
        error={error && "API error, please contact Sismo to report."}
      >
        {badge?.label ?? `#${requirement.data.id}`}
      </DataBlock>
      {` Sismo badge${
        requirement.data.type === "PLAYGROUND" ? " (Playground)" : ""
      }`}
    </Requirement>
  )
}

export default SismoRequirement
