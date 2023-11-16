import { Text } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import RequirementChainIndicator from "components/[guild]/Requirements/components/RequirementChainIndicator"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { DEPRECATED_PLAYGROUND_ADDRESS } from "./SismoForm"
import useSismoBadges from "./hooks/useSismoBadges"

const SismoRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { data, isValidating, error } = useSismoBadges(
    requirement.chain,
    requirement.address === DEPRECATED_PLAYGROUND_ADDRESS
  )
  const badge = data?.find((b) => b.value === requirement.data.id)

  return (
    <Requirement
      image={badge?.img}
      isImageLoading={isValidating}
      withImgBg={false}
      footer={<RequirementChainIndicator />}
      {...props}
    >
      <Text as="span">{`Have the `}</Text>
      <DataBlock
        isLoading={isValidating}
        error={error && "API error, please contact Sismo to report."}
      >
        {badge?.label ?? `#${requirement.data.id}`}
      </DataBlock>
      <Text as="span">
        {` Sismo badge${
          requirement.data.type === "PLAYGROUND" ? " (Playground)" : ""
        }`}
      </Text>
    </Requirement>
  )
}

export default SismoRequirement
