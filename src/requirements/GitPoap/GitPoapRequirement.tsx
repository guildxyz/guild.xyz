import { Link } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "../common/Requirement"
import { usePoap } from "../Poap/hooks/usePoaps"

const GitPoapRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { poap, isLoading, error } = usePoap(requirement?.data?.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={poap?.image_url}
      isImageLoading={isLoading}
      {...rest}
    >
      {"Own the "}
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
      {" GitPOAP"}
    </Requirement>
  )
}

export default GitPoapRequirement
