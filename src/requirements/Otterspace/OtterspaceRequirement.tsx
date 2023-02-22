import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useOtterspaceBadges from "./hooks/useOtterspaceBadges"

const OtterspaceRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data, isValidating, error } = useOtterspaceBadges(requirement.chain)
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement image={badge?.img} isImageLoading={isValidating} {...props}>
      {`Have the `}
      {!badge || isValidating || error ? (
        <DataBlock
          isLoading={isValidating}
          error={error && "API error, please contact POAP to report."}
        >
          {requirement.data.id}
        </DataBlock>
      ) : (
        badge.label
      )}
      {` Otterspace badge`}
    </Requirement>
  )
}

export default OtterspaceRequirement
