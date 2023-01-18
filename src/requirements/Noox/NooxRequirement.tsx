import { Link } from "@chakra-ui/react"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import useSWRImmutable from "swr/immutable"
import Requirement from "../common/Requirement"
import { NooxBadge } from "./NooxForm"

const NooxRequirement = ({ requirement, ...rest }: RequirementComponentProps) => {
  const { data, isValidating, error } = useSWRImmutable<NooxBadge[]>("/api/noox")

  const badgeData = data?.find((badge) => badge.id === requirement.data.id)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={badgeData?.image}
      isImageLoading={isValidating}
      {...rest}
    >
      {`Have the `}
      {!badgeData || isValidating || error ? (
        <DataBlock
          isLoading={isValidating}
          error={error && "API error, please contact Noox to report."}
        >
          {`#${requirement.data.id}`}
        </DataBlock>
      ) : (
        <Link
          href={`https://noox.world/badge/${badgeData?.id}`}
          isExternal
          display="inline"
          colorScheme="blue"
          fontWeight="medium"
        >
          {badgeData.name}
        </Link>
      )}

      {` Noox badge`}
    </Requirement>
  )
}

export default NooxRequirement
