import { Link } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import Requirement from "../common/Requirement"
import { usePoap } from "./hooks/usePoaps"

const PoapRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { poap, isLoading } = usePoap(requirement?.data?.id)

  return (
    <Requirement
      image={isLoading ? "" : poap?.image_url}
      isImageLoading={isLoading}
      errorApiName={!poap && !isLoading && "POAP"}
      {...rest}
    >
      {`Own the `}
      {poap?.name ? (
        <Link
          href={`https://poap.gallery/event/${poap.id}`}
          isExternal
          display="inline"
          colorScheme="POAP"
          fontWeight="medium"
        >
          {poap.name}
        </Link>
      ) : (
        requirement.data?.id
      )}

      {` POAP`}
    </Requirement>
  )
}

export default PoapRequirement
