import { Link } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "../common/Requirement"
import { usePoap } from "./hooks/usePoaps"

const PoapRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { poap, isLoading, error } = usePoap(requirement?.data?.id)

  return (
    <Requirement
      image={isLoading ? "" : poap?.image_url}
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
      {" POAP"}
    </Requirement>
  )
}

export default PoapRequirement
