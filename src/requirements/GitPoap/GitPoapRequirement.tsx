import { Link, Text } from "@chakra-ui/react"
import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import { usePoap } from "../Poap/hooks/usePoaps"

const GitPoapRequirement = (props: RequirementProps) => {
  const requirement = useRequirementContext()

  const { poap, isLoading, error } = usePoap(requirement?.data?.id)

  return (
    <Requirement image={poap?.image_url} isImageLoading={isLoading} {...props}>
      <Text as="span">{"Own the "}</Text>
      {!poap || isLoading || error ? (
        <DataBlock
          isLoading={isLoading}
          error={error && "API error, please contact POAP to report."}
        >
          {requirement.data.id}
        </DataBlock>
      ) : (
        <Link
          href={`https://poap.gallery/event/${poap.id}`}
          isExternal
          display="inline"
          colorScheme="blue"
          fontWeight="medium"
        >
          {poap.name}
        </Link>
      )}
      <Text as="span">{" GitPOAP"}</Text>
    </Requirement>
  )
}

export default GitPoapRequirement
