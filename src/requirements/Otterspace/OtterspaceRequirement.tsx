import { Text } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useOtterspaceBadges from "./hooks/useOtterspaceBadges"

const OtterspaceRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data, isValidating, error } = useOtterspaceBadges(requirement.chain)
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement
      image={badge?.img}
      isImageLoading={isValidating}
      footer={<RequirementChainIndicator />}
      {...props}
    >
      <Text as="span">{"Have the "}</Text>
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
      <Text as="span">{" Otterspace badge"}</Text>
    </Requirement>
  )
}

export default OtterspaceRequirement
