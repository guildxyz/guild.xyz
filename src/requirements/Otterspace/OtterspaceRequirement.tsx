import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { RPC } from "connectors"
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
          error={error && "API error, please contact Otterspace to report."}
        >
          {requirement.data.id}
        </DataBlock>
      ) : (
        badge.label
      )}
      {` Otterspace badge on ${RPC[requirement.chain].chainName}`}
    </Requirement>
  )
}

export default OtterspaceRequirement
